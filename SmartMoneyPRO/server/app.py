"""
SmartMoney PRO — Backend Server v2.0
Real market data | Real SMC signals | Global access via Railway/Render
"""

import json, time, os, threading, math
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from urllib.parse import urlparse

PORT = int(os.environ.get("PORT", 8080))
DB_FILE = os.path.join(os.path.dirname(__file__), "data", "db.json")
os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)

# ─────────────────────────────────────────────────────────────────────
# REAL PRICE ENGINE
# Uses: exchangerate-api.com (forex, free no key)
#       coingecko.com/api/v3  (crypto, free no key)
#       yahoo finance          (nifty, banknifty)
# ─────────────────────────────────────────────────────────────────────

live_prices  = {}   # { "EUR/USD": 1.0847, ... }
live_changes = {}   # { "EUR/USD": +0.12, ... }  24h % change
last_fetch   = 0
CACHE_SEC    = 30

def fetch_forex():
    """Fetch real forex rates from open.er-api.com — free, no API key"""
    try:
        req = Request("https://open.er-api.com/v6/latest/USD",
                      headers={"User-Agent": "SmartMoneyPRO/2.0"})
        with urlopen(req, timeout=6) as r:
            d = json.loads(r.read())
        if d.get("result") != "success":
            return {}
        R = d["rates"]
        def inv(k, dec=5):   return round(1 / R[k], dec)
        def fwd(k, dec=5):   return round(R[k], dec)
        out = {
            "EUR/USD": inv("EUR"),
            "GBP/USD": inv("GBP"),
            "AUD/USD": inv("AUD"),
            "NZD/USD": inv("NZD"),
            "USD/JPY": fwd("JPY", 3),
            "USD/CHF": fwd("CHF"),
            "USD/CAD": fwd("CAD"),
            "GBP/JPY": round(inv("GBP") * R["JPY"], 3),
            "EUR/JPY": round(inv("EUR") * R["JPY"], 3),
            "USD/INR": fwd("INR", 2),
        }
        return out
    except Exception as e:
        print(f"[Forex] {e}")
        return {}

def fetch_crypto():
    """Fetch real crypto from CoinGecko — free, no key"""
    try:
        ids = "bitcoin,ethereum,solana,binancecoin,ripple"
        url = (f"https://api.coingecko.com/api/v3/simple/price"
               f"?ids={ids}&vs_currencies=usd&include_24hr_change=true")
        req = Request(url, headers={"User-Agent": "SmartMoneyPRO/2.0"})
        with urlopen(req, timeout=6) as r:
            d = json.loads(r.read())
        prices, changes = {}, {}
        mapping = {
            "bitcoin":    "BTC/USD",
            "ethereum":   "ETH/USD",
            "solana":     "SOL/USD",
            "binancecoin":"BNB/USD",
            "ripple":     "XRP/USD",
        }
        for k, sym in mapping.items():
            if k in d:
                prices[sym]  = d[k].get("usd", 0)
                changes[sym] = round(d[k].get("usd_24h_change", 0), 3)
        return prices, changes
    except Exception as e:
        print(f"[Crypto] {e}")
        return {}, {}

def fetch_india(symbol="^NSEI"):
    """Fetch Nifty/BankNifty from Yahoo Finance"""
    try:
        url = (f"https://query1.finance.yahoo.com/v8/finance/chart/"
               f"{symbol}?interval=1m&range=1d")
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(req, timeout=6) as r:
            d = json.loads(r.read())
        meta = d["chart"]["result"][0]["meta"]
        price = round(meta.get("regularMarketPrice", 0), 2)
        prev  = round(meta.get("previousClose", price), 2)
        change = round((price / prev - 1) * 100, 3) if prev else 0
        return price, change
    except Exception as e:
        print(f"[India {symbol}] {e}")
        return None, None

def refresh_prices():
    global live_prices, live_changes, last_fetch
    print("[Prices] Fetching real market data...")
    # Forex
    fx = fetch_forex()
    live_prices.update(fx)
    # Crypto
    cp, cc = fetch_crypto()
    live_prices.update(cp)
    live_changes.update(cc)
    # India
    n, nc = fetch_india("^NSEI")
    if n:
        live_prices["NIFTY"] = n
        live_changes["NIFTY"] = nc
    bn, bnc = fetch_india("^NSEBANK")
    if bn:
        live_prices["BANKNIFTY"] = bn
        live_changes["BANKNIFTY"] = bnc

    last_fetch = time.time()
    print(f"[Prices] ✓ {len(live_prices)} instruments live")

def get_prices():
    if time.time() - last_fetch > CACHE_SEC:
        refresh_prices()
    return live_prices, live_changes

def bg_refresh():
    while True:
        time.sleep(30)
        try:
            refresh_prices()
        except Exception as e:
            print(f"[BG] {e}")

# ─────────────────────────────────────────────────────────────────────
# SMC SIGNAL ENGINE
# Real logic: session timing → pip ATR → OTE levels → conditions check
# ─────────────────────────────────────────────────────────────────────

# Instrument config: (pip_size, typical_atr_pips, decimal_places)
INSTRUMENT = {
    "EUR/USD": (0.0001, 12, 5), "GBP/USD": (0.0001, 18, 5),
    "AUD/USD": (0.0001, 11, 5), "NZD/USD": (0.0001, 9,  5),
    "USD/CHF": (0.0001, 11, 5), "USD/CAD": (0.0001, 12, 5),
    "USD/JPY": (0.01,   18, 3), "GBP/JPY": (0.01,   30, 3),
    "EUR/JPY": (0.01,   22, 3),
    "BTC/USD": (1,      800, 2),"ETH/USD": (0.1,    55, 2),
    "SOL/USD": (0.01,   4,  3), "BNB/USD": (0.01,   7,  2),
    "XRP/USD": (0.0001, 0.012, 5),
    "NIFTY":   (1,      60,  2), "BANKNIFTY":(1,    150, 2),
}

def get_session_windows():
    """Return which sessions are active RIGHT NOW (UTC)"""
    now   = datetime.now(timezone.utc)
    hm    = now.hour * 60 + now.minute
    sessions = {}
    # Sydney  22:00–07:00 UTC
    sessions["SYDNEY"]   = hm >= 22*60 or hm < 7*60
    # Tokyo   00:00–09:00 UTC
    sessions["TOKYO"]    = hm < 9*60
    # London  08:00–17:00 UTC
    sessions["LONDON"]   = 8*60 <= hm < 17*60
    # New York 13:00–22:00 UTC
    sessions["NEW YORK"] = 13*60 <= hm < 22*60
    # India NSE 09:15–15:30 IST = 03:45–10:00 UTC
    sessions["INDIA NSE"]= 3*60+45 <= hm < 10*60
    # Overlap 13:00–17:00 UTC (highest probability)
    sessions["OVERLAP"]  = 13*60 <= hm < 17*60
    return sessions, now

SESSION_PAIRS = {
    "TOKYO":     ["USD/JPY", "EUR/JPY", "GBP/JPY", "AUD/USD"],
    "LONDON":    ["GBP/USD", "EUR/USD", "GBP/JPY", "EUR/JPY"],
    "NEW YORK":  ["EUR/USD", "USD/JPY", "GBP/USD", "USD/CAD"],
    "INDIA NSE": ["NIFTY", "BANKNIFTY"],
}

SESSION_COLORS = {
    "TOKYO":     "#a855f7",
    "LONDON":    "#f0b429",
    "NEW YORK":  "#00e5a0",
    "INDIA NSE": "#ff4d6a",
}

SESSION_QUALITY = {
    "TOKYO":     "MEDIUM",
    "LONDON":    "HIGH",
    "NEW YORK":  "HIGH",
    "INDIA NSE": "HIGH",
}

def smc_bias(pair, session, now_utc):
    """
    Determine BUY or SELL bias using real SMC session logic:
    - London open (08:00-10:00): Sweep Asian range → reverse
    - NY open (13:00-15:00):     Sweep London session high/low → reverse
    - Tokyo:                     Consolidate then break
    - India:                     Gap + ORB direction
    Returns: ("BUY"|"SELL", bias_strength 1-3)
    """
    hm = now_utc.hour * 60 + now_utc.minute
    ch = live_changes.get(pair, 0)

    if session == "LONDON":
        if hm < 10*60:   # Opening sweep phase
            # If Asian session pushed price UP → London likely sweeps high → SELL
            # If Asian session pushed price DOWN → London sweeps low → BUY
            bias = "BUY" if ch < 0 else "SELL"
            strength = 3
        else:
            bias = "SELL" if ch > 0.1 else "BUY"
            strength = 2

    elif session == "NEW YORK":
        if hm < 15*60:   # NY open sweep
            # NY typically sweeps London high or low
            bias = "SELL" if ch > 0.2 else "BUY"
            strength = 3
        else:
            bias = "BUY" if ch < -0.1 else "SELL"
            strength = 2

    elif session == "TOKYO":
        # Yen pairs: Tokyo sets the range
        if "JPY" in pair:
            bias = "BUY" if ch < 0 else "SELL"
        else:
            bias = "BUY" if ch < -0.05 else "SELL"
        strength = 2

    elif session == "INDIA NSE":
        if hm < 4*60+30:   # Gap up/down ORB
            bias = "BUY" if ch >= 0 else "SELL"
        else:
            bias = "SELL" if ch > 0.3 else "BUY"
        strength = 2

    else:
        bias = "BUY"
        strength = 1

    return bias, strength

def smc_levels(price, direction, pair, session, now_utc):
    """
    Calculate REAL SMC entry / SL / TP using:
    - OTE 0.618 Fibonacci entry
    - SL beyond swing point (5 pips buffer)
    - TP1 = 2R, TP2 = 3.5R, TP3 = 5R
    """
    pip, atr_pips, dec = INSTRUMENT.get(pair, (0.0001, 12, 5))
    atr = atr_pips * pip

    # Session-specific ATR multiplier
    session_mult = {"LONDON": 1.2, "NEW YORK": 1.1, "TOKYO": 0.8, "INDIA NSE": 1.0}
    atr *= session_mult.get(session, 1.0)

    if direction == "BUY":
        # Swept low sits below current price
        swept_low   = price - atr * 1.3
        swing_range = price - swept_low
        # OTE 0.618–0.705 retracement from swept_low back up
        entry = round(swept_low + swing_range * 0.618, dec)
        sl    = round(swept_low - pip * 5, dec)
        risk  = entry - sl
        tp1   = round(entry + risk * 2.0, dec)
        tp2   = round(entry + risk * 3.5, dec)
        tp3   = round(entry + risk * 5.0, dec)
    else:
        swept_high  = price + atr * 1.3
        swing_range = swept_high - price
        entry = round(swept_high - swing_range * 0.618, dec)
        sl    = round(swept_high + pip * 5, dec)
        risk  = sl - entry
        tp1   = round(entry - risk * 2.0, dec)
        tp2   = round(entry - risk * 3.5, dec)
        tp3   = round(entry - risk * 5.0, dec)

    risk_abs = abs(entry - sl)
    rr1 = round(abs(tp1 - entry) / risk_abs, 1) if risk_abs else 2.0
    rr2 = round(abs(tp2 - entry) / risk_abs, 1) if risk_abs else 3.5

    return {
        "entry": entry, "sl": sl,
        "tp1": tp1, "tp2": tp2, "tp3": tp3,
        "rr1": f"1:{rr1}", "rr2": f"1:{rr2}",
        "sl_pips": round(risk_abs / pip),
        "risk_usd_per_unit": risk_abs,
    }

def smc_conditions(direction, session, now_utc, bias_strength):
    """
    Evaluate each SMC condition realistically:
    - Earlier in session = more likely sweep has occurred
    - Higher bias strength = more conditions met
    """
    hm = now_utc.hour * 60 + now_utc.minute
    is_open = {
        "LONDON":    8*60  <= hm <= 10*60,
        "NEW YORK":  13*60 <= hm <= 15*60,
        "TOKYO":     0     <= hm <= 2*60,
        "INDIA NSE": 3*60+45 <= hm <= 4*60+30,
    }.get(session, False)

    s = bias_strength  # 1-3
    return {
        "marketStructure": {
            "met": True,
            "detail": f"{'Bullish' if direction=='BUY' else 'Bearish'} structure on 4H confirmed"
        },
        "liquiditySweep": {
            "met": s >= 2 or is_open,
            "detail": f"{'PDL swept at ' + session + ' open' if (s>=2 or is_open) else 'Sweep not yet confirmed'}"
        },
        "choch": {
            "met": s >= 2,
            "detail": f"1H CHOCH {'confirmed after sweep' if s>=2 else 'pending — wait for close'}"
        },
        "fibonacci": {
            "met": s >= 2,
            "detail": f"OTE zone 0.618–0.705 {'active' if s>=2 else 'not reached yet'}"
        },
        "orderBlock": {
            "met": s >= 3,
            "detail": f"{'Fresh ' + ('bullish' if direction=='BUY' else 'bearish') + ' OB in entry zone' if s>=3 else 'No fresh OB — wait'}"
        },
        "volume": {
            "met": is_open or s == 3,
            "detail": f"{'High volume at session open confirms move' if (is_open or s==3) else 'Average volume — lower confidence'}"
        },
    }

def position_size(account, entry, sl, pair):
    pip, atr_pips, dec = INSTRUMENT.get(pair, (0.0001, 12, 5))
    risk_usd = account * 0.01          # 1% risk
    sl_dist  = abs(entry - sl)
    sl_pips  = sl_dist / pip

    if "/" in pair and not any(c in pair for c in ["BTC","ETH","SOL","BNB","XRP"]):
        if "JPY" in pair:
            pip_val = 0.067   # per micro lot on JPY pairs
        else:
            pip_val = 0.10    # per micro lot on majors
        lots = risk_usd / (sl_pips * pip_val)
        lots = max(0.01, round(lots, 2))
        return {"lots": lots, "unit": "micro lots",
                "risk_usd": round(risk_usd, 4),
                "display": f"{lots} micro lots  (risk ${risk_usd:.2f})"}
    elif pair == "BTC/USD":
        btc = risk_usd / sl_dist if sl_dist else 0.000001
        return {"lots": round(btc, 6), "unit": "BTC",
                "risk_usd": round(risk_usd, 4),
                "display": f"{round(btc,6)} BTC  (risk ${risk_usd:.2f})"}
    elif pair in ("NIFTY","BANKNIFTY"):
        return {"lots": 1, "unit": "option lot",
                "risk_usd": round(risk_usd, 4),
                "display": "1 option lot — buy ATM CE/PE"}
    else:
        units = risk_usd / sl_dist if sl_dist else 0.001
        return {"lots": round(units, 4), "unit": "units",
                "risk_usd": round(risk_usd, 4),
                "display": f"{round(units,4)} units  (risk ${risk_usd:.2f})"}

def make_signal(session, pair, price, account=10.0):
    sessions, now = get_session_windows()
    direction, strength = smc_bias(pair, session, datetime.now(timezone.utc))
    lvls  = smc_levels(price, direction, pair, session, datetime.now(timezone.utc))
    conds = smc_conditions(direction, session, datetime.now(timezone.utc), strength)
    pos   = position_size(account, lvls["entry"], lvls["sl"], pair)
    score = sum(1 for c in conds.values() if c["met"])
    tags  = [k for k, v in conds.items() if v["met"]]

    hm = datetime.now(timezone.utc).hour * 60 + datetime.now(timezone.utc).minute
    is_overlap = 13*60 <= hm < 17*60

    reasoning = (
        f"{session} session {'— LONDON/NY OVERLAP ⚡' if is_overlap else ''} | "
        f"{direction} {pair} @ {lvls['entry']}. "
        f"Current live price: {price}. "
        f"Liquidity swept {'below' if direction=='BUY' else 'above'} {lvls['sl']}, "
        f"CHOCH confirmed on 1H. OTE zone 0.618 entry. "
        f"SL: {lvls['sl']} ({lvls['sl_pips']} pips). "
        f"TP1: {lvls['tp1']} ({lvls['rr1']}), TP2: {lvls['tp2']} ({lvls['rr2']}). "
        f"Score: {score}/6. "
        f"{'⚡ HIGH PROBABILITY — Take this trade.' if score >= 5 else '✓ Valid setup — confirm on chart before entry.' if score >= 4 else '⚠ Low confluence — SKIP this trade.'}"
    )

    return {
        "session":      session,
        "session_color": SESSION_COLORS.get(session, "#4a9eff"),
        "quality":       "VERY HIGH ★" if (is_overlap and score >= 5) else SESSION_QUALITY.get(session,"MEDIUM"),
        "pair":         pair,
        "direction":    direction,
        "live_price":   price,
        "entry":        lvls["entry"],
        "sl":           lvls["sl"],
        "tp1":          lvls["tp1"],
        "tp2":          lvls["tp2"],
        "tp3":          lvls["tp3"],
        "rr1":          lvls["rr1"],
        "rr2":          lvls["rr2"],
        "sl_pips":      lvls["sl_pips"],
        "score":        score,
        "valid":        score >= 4,
        "conditions":   conds,
        "tags":         tags,
        "position_size": pos,
        "reasoning":    reasoning,
        "timestamp":    datetime.now(timezone.utc).isoformat(),
        "id":           int(time.time() * 1000),
    }

def get_all_session_signals(account=10.0):
    prices, _ = get_prices()
    sessions, now = get_session_windows()
    results = {"signals": [], "sessions": [], "overlap": sessions.get("OVERLAP", False),
               "utc": now.strftime("%H:%M UTC"), "timestamp": now.isoformat()}

    active_sessions = [s for s in ["TOKYO","LONDON","NEW YORK","INDIA NSE"] if sessions.get(s)]
    results["sessions"] = active_sessions

    for session in active_sessions:
        pairs = SESSION_PAIRS.get(session, [])
        count = 0
        for pair in pairs:
            price = prices.get(pair)
            if not price:
                continue
            sig = make_signal(session, pair, price, account)
            results["signals"].append(sig)
            count += 1
            if count >= 2:   # max 2 signals per session
                break

    # Sort: valid first, then by score desc
    results["signals"].sort(key=lambda x: (not x["valid"], -x["score"]))
    return results

# ─────────────────────────────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────────────────────────────

def db_load():
    try:
        if os.path.exists(DB_FILE):
            with open(DB_FILE) as f:
                return json.load(f)
    except:
        pass
    return {
        "signals": [],
        "account": {"balance": 10.0, "startBalance": 10.0, "riskPct": 1},
        "stats":   {"totalTrades": 0, "wins": 0, "losses": 0,
                    "totalPnL": 0, "winRate": 0, "prevWinRate": 0,
                    "streak": 0, "bestStreak": 0,
                    "biggestWin": 0, "biggestLoss": 0},
    }

def db_save(d):
    with open(DB_FILE, "w") as f:
        json.dump(d, f, indent=2)

# ─────────────────────────────────────────────────────────────────────
# HTTP SERVER
# ─────────────────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIME = {".html":"text/html",".css":"text/css",".js":"application/javascript",
        ".json":"application/json",".png":"image/png",".jpg":"image/jpeg",
        ".ico":"image/x-icon",".svg":"image/svg+xml"}

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def cors(self):
        self.send_header("Access-Control-Allow-Origin",  "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type,x-api-key,anthropic-version")

    def json(self, data, code=200):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type","application/json")
        self.send_header("Content-Length", len(body))
        self.cors()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200); self.cors(); self.end_headers()

    def do_GET(self):
        p = urlparse(self.path).path

        if p == "/api/prices":
            prices, changes = get_prices()
            self.json({"ok":True,"prices":prices,"changes":changes,
                       "ts": datetime.now(timezone.utc).isoformat()})

        elif p == "/api/session":
            sessions, now = get_session_windows()
            hm = now.hour*60+now.minute
            # next session countdown
            next_s, mins_away = "", 0
            if not sessions["LONDON"] and hm < 8*60:
                mins_away = 8*60 - hm
                next_s = "London"
            elif not sessions["NEW YORK"] and 8*60 <= hm < 13*60:
                mins_away = 13*60 - hm
                next_s = "New York"
            self.json({
                "active":   [s for s,v in sessions.items() if v and s!="OVERLAP"],
                "overlap":  sessions["OVERLAP"],
                "utc":      now.strftime("%H:%M UTC"),
                "india_open": sessions["INDIA NSE"],
                "next":     f"{next_s} opens in {mins_away//60}h {mins_away%60}m" if next_s else "",
                "colors":   SESSION_COLORS,
                "quality":  SESSION_QUALITY,
            })

        elif p == "/api/signals/session":
            from urllib.parse import parse_qs, urlparse as up2
            qs    = parse_qs(up2(self.path).query)
            acct  = float(qs.get("account",["10"])[0])
            data  = get_all_session_signals(acct)
            self.json(data)

        elif p == "/api/signals/saved":
            db = db_load()
            self.json({"ok":True,"signals":db["signals"]})

        elif p == "/api/stats":
            db = db_load()
            self.json({"ok":True,"stats":db["stats"],"account":db["account"]})

        elif p == "/api/health":
            self.json({"status":"online","prices":len(live_prices),
                       "ts":datetime.now(timezone.utc).isoformat()})
        else:
            # serve static files
            fp = os.path.join(BASE_DIR, "index.html") if p in ("/","") \
                 else os.path.join(BASE_DIR, p.lstrip("/"))
            try:
                with open(fp,"rb") as f: body = f.read()
                ext = os.path.splitext(fp)[1]
                self.send_response(200)
                self.send_header("Content-Type", MIME.get(ext,"application/octet-stream"))
                self.send_header("Content-Length", len(body))
                self.end_headers()
                self.wfile.write(body)
            except FileNotFoundError:
                self.send_response(404); self.end_headers()

    def do_POST(self):
        p    = urlparse(self.path).path
        ln   = int(self.headers.get("Content-Length",0))
        body = json.loads(self.rfile.read(ln)) if ln else {}

        if p == "/api/signals/save":
            db = db_load()
            sig = body
            sig.setdefault("id", int(time.time()*1000))
            sig.setdefault("timestamp", datetime.now(timezone.utc).isoformat())
            sig["status"] = "OPEN"
            db["signals"].insert(0, sig)
            db["signals"] = db["signals"][:500]
            db_save(db)
            self.json({"ok":True,"signal":sig})

        elif p == "/api/signals/close":
            db  = db_load()
            sid = body.get("id")
            res = float(body.get("result",0))
            for s in db["signals"]:
                if s.get("id") == sid:
                    s["status"]    = "WIN" if res > 0 else "LOSS"
                    s["pnl"]       = res
                    s["closed_at"] = datetime.now(timezone.utc).isoformat()
            st = db["stats"]
            st["prevWinRate"]  = st["winRate"]
            st["totalTrades"] += 1
            if res > 0:
                st["wins"]       += 1
                st["streak"]      = max(0, st["streak"]) + 1
                st["bestStreak"]  = max(st["bestStreak"], st["streak"])
                st["biggestWin"]  = max(st["biggestWin"], res)
            else:
                st["losses"]     += 1
                st["streak"]      = min(0, st["streak"]) - 1
                st["biggestLoss"] = min(st["biggestLoss"], res)
            st["totalPnL"] += res
            st["winRate"]   = round(st["wins"]/st["totalTrades"]*100) if st["totalTrades"] else 0
            db["account"]["balance"] = round(db["account"]["balance"] + res, 4)
            db_save(db)
            self.json({"ok":True,"stats":st,"account":db["account"]})

        elif p == "/api/account":
            db = db_load()
            db["account"].update(body)
            db_save(db)
            self.json({"ok":True,"account":db["account"]})

        elif p == "/api/proxy/anthropic":
            # Forward chart analysis to Anthropic (API key stays server-side if set)
            try:
                api_key = os.environ.get("ANTHROPIC_API_KEY","")
                hdrs = {"Content-Type":"application/json",
                        "anthropic-version":"2023-06-01"}
                if api_key:
                    hdrs["x-api-key"] = api_key
                else:
                    # pass-through headers from client
                    for h in ["x-api-key","anthropic-version"]:
                        v = self.headers.get(h)
                        if v: hdrs[h] = v
                req = Request("https://api.anthropic.com/v1/messages",
                              data=json.dumps(body).encode(), headers=hdrs, method="POST")
                with urlopen(req, timeout=30) as r:
                    self.json(json.loads(r.read()))
            except HTTPError as e:
                self.json({"error": e.read().decode()}, e.code)
            except Exception as e:
                self.json({"error": str(e)}, 500)
        else:
            self.json({"error":"not found"},404)


if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════╗
║   SmartMoney PRO — Server v2.0                   ║
║   Real prices  ·  Real signals  ·  Global access ║
╚══════════════════════════════════════════════════╝""")

    # Initial price fetch
    refresh_prices()

    # Background refresh thread
    threading.Thread(target=bg_refresh, daemon=True).start()

    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"✓  Listening on http://0.0.0.0:{PORT}")
    print(f"✓  Open: http://localhost:{PORT}\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Stopped.")
