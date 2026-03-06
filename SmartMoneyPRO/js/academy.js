// ─── ACADEMY — 8 LEVELS with full SMC curriculum from @keeganvandyk ──

const ACADEMY_DATA = [
  {
    level:1, title:"Market Basics", subtitle:"The Language of Trading",
    emoji:"📘", color:"#4a9eff",
    tags:["Bullish/Bearish","Long/Short","Entry/SL/TP","Risk","Lot Size","Pips"],
    lessons:[
      { title:"Bullish vs Bearish", content:`
        <div class="lesson-concept">
          <div class="concept-card green"><div class="concept-title">📈 BULLISH</div>
            <div class="concept-body">You think price will go <strong>UP</strong>. You are looking to <strong>BUY</strong>.</div></div>
          <div class="concept-card red"><div class="concept-title">📉 BEARISH</div>
            <div class="concept-body">You think price will go <strong>DOWN</strong>. You are looking to <strong>SELL / SHORT</strong>.</div></div>
        </div>
        <div class="lesson-note">That's it. Every trade is either bullish or bearish. Master reading which one before you touch your mouse.</div>`},
      { title:"Long vs Short", content:`
        <div class="lesson-concept">
          <div class="concept-card green"><div class="concept-title">⬆ LONG (BUY)</div>
            <div class="concept-body">You make money if price goes <strong>UP</strong>. Open by clicking BUY.</div></div>
          <div class="concept-card red"><div class="concept-title">⬇ SHORT (SELL)</div>
            <div class="concept-body">You make money if price goes <strong>DOWN</strong>. Yes, you can profit in both directions.</div></div>
        </div>
        <div class="lesson-note">When traders say "buying" they mean going long. "Selling" means going short.</div>`},
      { title:"Entry, Stop Loss & Take Profit", content:`
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num gold">1</div><div><strong>Entry</strong> = the price where you open your trade</div></div>
          <div class="lesson-item"><div class="item-num red">2</div><div><strong>Stop Loss (SL)</strong> = your maximum loss. Closes the trade automatically.<br><span style="color:var(--red);font-weight:700;">No SL = gambling. ALWAYS set a SL.</span></div></div>
          <div class="lesson-item"><div class="item-num green">3</div><div><strong>Take Profit (TP)</strong> = your target — where you lock in profit</div></div>
        </div>`},
      { title:"Risk Management", content:`
        <div class="lesson-highlight">Risk = the amount of money you're willing to lose per trade. You don't control the market. <strong>You control your risk.</strong></div>
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num gold">⚖</div><div>Risk <strong>1% to max 2%</strong> of your capital per trade</div></div>
          <div class="lesson-item"><div class="item-num gold">📐</div><div>Your risk is defined by your <strong>lot size</strong> — not by hope</div></div>
          <div class="lesson-item"><div class="item-num gold">💰</div><div>On a $10 account: 1% = <strong>$0.10 max loss per trade</strong></div></div>
        </div>`},
      { title:"Lot Size & Pips", content:`
        <div class="lesson-concept">
          <div class="concept-card gold"><div class="concept-title">📦 LOT SIZE</div>
            <div class="concept-body">Lot = your trade size. It decides profit/loss per pip.<br/><strong>Bigger lot = bigger profit... and bigger risk.</strong></div></div>
          <div class="concept-card blue"><div class="concept-title">📏 PIP</div>
            <div class="concept-body">Smallest forex price movement. (Price In Percentage)<br/>EUR/USD: 1.1000 → 1.1001 = <strong>1 pip</strong></div></div>
        </div>
        <div class="lesson-note">On a $10 account: Use 0.01 micro lots on EUR/USD to keep ~$0.10 risk for a 10-pip SL.</div>`}
    ],
    quiz:[
      {q:"What does BEARISH mean?",a:"Price going down / looking to sell",opts:["Price going up","Price going down / looking to sell","Price is sideways","No movement"]},
      {q:"What is a Stop Loss for?",a:"Maximum loss protection — closes trade automatically",opts:["To make more profit","To enter the trade","Maximum loss protection — closes trade automatically","To change lot size"]}
    ]
  },
  {
    level:2, title:"Market Structure", subtitle:"Reading the Market Direction",
    emoji:"📊", color:"#f0b429",
    tags:["Uptrend","Downtrend","Ranging","HH/HL","LL/LH","4 Phases"],
    lessons:[
      { title:"The 3 Market Trends", content:`
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num green">↗</div><div><strong>Uptrend</strong> = Higher Highs (HH) + Higher Lows (HL). Market making new highs and pulling back higher each time.</div></div>
          <div class="lesson-item"><div class="item-num red">↘</div><div><strong>Downtrend</strong> = Lower Highs (LH) + Lower Lows (LL). Market making new lows and bouncing lower each time.</div></div>
          <div class="lesson-item"><div class="item-num gold">→</div><div><strong>Ranging</strong> = Equal Highs + Equal Lows. Price bouncing between two levels. Avoid trading inside the range.</div></div>
        </div>`},
      { title:"The 4 Market Phases", content:`
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num blue">1</div><div><strong>Accumulation</strong> — Smart money quietly buying. Price consolidates/ranges. Retail sees nothing.</div></div>
          <div class="lesson-item"><div class="item-num green">2</div><div><strong>Mark Up</strong> — Smart money pushes price up. The uptrend phase. Multiple BOS form.</div></div>
          <div class="lesson-item"><div class="item-num gold">3</div><div><strong>Distribution</strong> — Smart money quietly selling at highs. Price ranges again near top.</div></div>
          <div class="lesson-item"><div class="item-num red">4</div><div><strong>Mark Down</strong> — Smart money dumps. Price falls fast. The downtrend phase.</div></div>
        </div>
        <div class="lesson-note">BOS happens during Mark Up (bullish BOS) and Mark Down (bearish BOS) phases.</div>`},
      { title:"5-Step Trade Checklist", content:`
        <div class="lesson-steps">
          <div class="step-card"><div class="step-num">1</div><div><strong>Market Structure</strong> — Is market making HH+HL (bullish) or LH+LL (bearish)?</div></div>
          <div class="step-card"><div class="step-num">2</div><div><strong>Psychological Level</strong> — Is price near a round number (1.3000, 150.00)?</div></div>
          <div class="step-card"><div class="step-num">3</div><div><strong>Fibonacci</strong> — Connect swing low to swing high (buys). Look for 0.618 retracement zone.</div></div>
          <div class="step-card"><div class="step-num">4</div><div><strong>Trendline</strong> — 3 touches validate the trendline. Third touch is tradeable.</div></div>
          <div class="step-card"><div class="step-num">5</div><div><strong>Candlestick</strong> — Bullish engulfing, hammer, or morning star confirms entry. Enter on candle close.</div></div>
        </div>`}
    ],
    quiz:[
      {q:"Uptrend is identified by?",a:"Higher Highs and Higher Lows",opts:["Lower Highs and Lower Lows","Equal Highs and Lows","Higher Highs and Higher Lows","Random movement"]}
    ]
  },
  {
    level:3, title:"Break of Structure (BOS)", subtitle:"How Markets Move Forward",
    emoji:"💥", color:"#00e5a0",
    tags:["BOS","Candle Close Rule","Bullish BOS","Bearish BOS","Confirmation"],
    lessons:[
      { title:"What is BOS?", content:`
        <div class="lesson-highlight">Break of Structure = when the market breaks for a <strong>new high</strong> (bullish) or a <strong>new low</strong> (bearish). You will see these during Mark Up and Mark Down phases.</div>
        <div class="lesson-concept">
          <div class="concept-card red"><div class="concept-title">❌ INVALID BOS</div>
            <div class="concept-body">Price wick breaks through the level <strong>but does NOT close above/below</strong>. This is a fakeout — do NOT enter.</div></div>
          <div class="concept-card green"><div class="concept-title">✅ VALID BOS</div>
            <div class="concept-body">Price breaks AND <strong>CLOSES</strong> above/below the structure level. The candle BODY must close past the line.</div></div>
        </div>
        <div class="lesson-note">Golden rule: Always wait for the candle to CLOSE. Never enter on a wick break alone.</div>`},
      { title:"Bullish BOS — Higher Highs", content:`
        <div class="lesson-highlight green">In a bullish BOS, price creates Higher Highs and Higher Lows.</div>
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num green">1</div><div>Price makes a swing high</div></div>
          <div class="lesson-item"><div class="item-num green">2</div><div>Pulls back forming a Higher Low (HL)</div></div>
          <div class="lesson-item"><div class="item-num green">3</div><div>Breaks and <strong>closes above</strong> the previous swing high = BOS confirmed</div></div>
          <div class="lesson-item"><div class="item-num green">4</div><div>Confirms bullish structure — look for BUY setups on pullbacks</div></div>
        </div>`},
      { title:"Bearish BOS — Lower Lows", content:`
        <div class="lesson-highlight red">In a bearish BOS, price creates Lower Highs and Lower Lows.</div>
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num red">1</div><div>Price makes a swing low</div></div>
          <div class="lesson-item"><div class="item-num red">2</div><div>Bounces forming a Lower High (LH)</div></div>
          <div class="lesson-item"><div class="item-num red">3</div><div>Breaks and <strong>closes below</strong> the previous swing low = BOS confirmed</div></div>
          <div class="lesson-item"><div class="item-num red">4</div><div>Confirms bearish structure — look for SELL setups on bounces</div></div>
        </div>`}
    ],
    quiz:[
      {q:"For a BOS to be valid, what must happen?",a:"Candle must close above/below the level",opts:["Wick breaks through","Volume must spike","Candle must close above/below the level","Two candles must close outside"]}
    ]
  },
  {
    level:4, title:"Change of Character (CHOCH)", subtitle:"Spotting Trend Reversals",
    emoji:"🔄", color:"#a855f7",
    tags:["CHOCH","Trend Reversal","2+ S/D Zones","1H Confirm","BOS vs CHOCH"],
    lessons:[
      { title:"What is CHOCH?", content:`
        <div class="lesson-highlight">CHOCH = Change of Character — a signal of a possible <strong>trend change</strong>. The market breaks the structure AGAINST the current trend.</div>
        <div class="lesson-concept">
          <div class="concept-card green"><div class="concept-title">🔄 BULLISH CHOCH</div>
            <div class="concept-body">In a downtrend, price breaks and closes <strong>above two previous Lower Highs</strong>. Trend changes TO THE UPSIDE.</div></div>
          <div class="concept-card red"><div class="concept-title">🔄 BEARISH CHOCH</div>
            <div class="concept-body">In an uptrend, price breaks and closes <strong>below two previous Higher Lows</strong>. Trend changes TO THE DOWNSIDE.</div></div>
        </div>`},
      { title:"CHOCH Rules", content:`
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num gold">1</div><div>Must break through <strong>2 or more Supply/Demand zones</strong> for high confidence</div></div>
          <div class="lesson-item"><div class="item-num gold">2</div><div>Best found on <strong>4H and Daily</strong> timeframes</div></div>
          <div class="lesson-item"><div class="item-num gold">3</div><div>Most effective when near a key Supply or Demand zone</div></div>
          <div class="lesson-item"><div class="item-num gold">4</div><div>Wait for the candle to <strong>CLOSE</strong> past the level — same rule as BOS</div></div>
        </div>
        <div class="lesson-rule"><div class="rule-icon">⚡</div><div>CHOCH + Order Block + OTE Fibonacci = <strong>Highest probability reversal entry</strong></div></div>`},
      { title:"BOS vs CHOCH — Key Difference", content:`
        <div class="lesson-concept">
          <div class="concept-card blue"><div class="concept-title">BOS</div>
            <div class="concept-body">= <strong>Continuation</strong> of current trend. Market makes new HH (bull) or LL (bear). Trade WITH the trend.</div></div>
          <div class="concept-card purple"><div class="concept-title">CHOCH</div>
            <div class="concept-body">= Possible <strong>Reversal</strong>. Market breaks AGAINST the trend. Must break 2+ S/D zones. Trade the reversal.</div></div>
        </div>
        <div class="lesson-note">After CHOCH: wait for the first BOS in the NEW direction to confirm trend has truly changed, then look for an entry.</div>`}
    ],
    quiz:[
      {q:"CHOCH is most effective when?",a:"It breaks through 2 or more Supply/Demand zones",opts:["It happens on 5M chart","It breaks through 2 or more Supply/Demand zones","Volume is low","Price is at round number"]}
    ]
  },
  {
    level:5, title:"Supply, Demand & Candlesticks", subtitle:"Where Smart Money Lives",
    emoji:"⚖️", color:"#ff4d6a",
    tags:["Supply Zone","Demand Zone","Order Block","RBD/DBR","Candlestick Patterns","CRT Entry"],
    lessons:[
      { title:"Supply & Demand Zones", content:`
        <div class="lesson-concept">
          <div class="concept-card red"><div class="concept-title">🔴 SUPPLY ZONE</div>
            <div class="concept-body"><strong>Excess of SELLERS</strong> → price drops. Supply exceeds demand. Look for SELL setups when price returns here.</div></div>
          <div class="concept-card green"><div class="concept-title">🟢 DEMAND ZONE</div>
            <div class="concept-body"><strong>Excess of BUYERS</strong> → price rises. Demand exceeds supply. Look for BUY setups when price returns here.</div></div>
        </div>`},
      { title:"Price Action Zone Patterns", content:`
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num red">RBD</div><div><strong>Rally-Base-Drop</strong> = price rallies, consolidates (base), then drops = <strong>Supply zone</strong></div></div>
          <div class="lesson-item"><div class="item-num green">DBR</div><div><strong>Drop-Base-Rally</strong> = price drops, consolidates (base), then rallies = <strong>Demand zone</strong></div></div>
          <div class="lesson-item"><div class="item-num green">RBR</div><div><strong>Rally-Base-Rally</strong> = continuation demand zone. Price pauses then continues up.</div></div>
          <div class="lesson-item"><div class="item-num red">DBD</div><div><strong>Drop-Base-Drop</strong> = continuation supply zone. Price pauses then continues down.</div></div>
        </div>
        <div class="lesson-note">The BASE is your order block. Institutional orders sit there. Price often returns before the next big move.</div>`},
      { title:"Key Candlestick Patterns", content:`
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num green">BUY</div><div><strong>Hammer</strong> — small body at top, long lower wick. Bullish reversal signal.</div></div>
          <div class="lesson-item"><div class="item-num green">BUY</div><div><strong>Morning Star</strong> — 3 candles: bearish, small doji, bullish engulfing. Strong reversal at bottom.</div></div>
          <div class="lesson-item"><div class="item-num green">BUY</div><div><strong>Bullish Engulfing</strong> — big green candle fully engulfs the previous red candle.</div></div>
          <div class="lesson-item"><div class="item-num red">SELL</div><div><strong>Shooting Star</strong> — small body at bottom, long upper wick. Bearish reversal signal.</div></div>
          <div class="lesson-item"><div class="item-num red">SELL</div><div><strong>Evening Star</strong> — 3 candles: bullish, doji, bearish. Reversal at top.</div></div>
          <div class="lesson-item"><div class="item-num red">SELL</div><div><strong>Bearish Engulfing</strong> — big red candle fully engulfs the previous green candle.</div></div>
        </div>`},
      { title:"CRT Entry — Candle Range Theory", content:`
        <div class="lesson-highlight gold">CRT (Candle Range Theory) = the simplest and most powerful entry method for SMC traders.</div>
        <div class="lesson-steps">
          <div class="step-card"><div class="step-num">1</div><div>On <strong>4H chart</strong>, find a large candle that formed a swing high or low</div></div>
          <div class="step-card"><div class="step-num">2</div><div>Identify the <strong>Liquidity Sweep</strong> — 4H wick spikes above previous high (for sell) or below previous low (for buy) then closes back</div></div>
          <div class="step-card"><div class="step-num">3</div><div>Mark the <strong>Break Closing Level</strong> — the close price of the candle that broke the range</div></div>
          <div class="step-card"><div class="step-num">4</div><div>Drop to <strong>5M chart</strong>, narrow in and plan your entry at that level</div></div>
          <div class="step-card"><div class="step-num">5</div><div><strong>Enter</strong> when 5M confirms reversal at the Break Closing Level with a confirming candlestick</div></div>
        </div>
        <div class="lesson-note">Complete formula: 4H Sweep → Mark Break Closing Level → 5M Confirmation → Enter</div>`}
    ],
    quiz:[
      {q:"What is a Supply Zone?",a:"Area with excess sellers where price is likely to drop",opts:["Area with excess buyers","Area with excess sellers where price is likely to drop","A trend continuation signal","A Fibonacci level"]},
      {q:"In CRT entry, after the 4H sweep what do you do?",a:"Drop to 5M and enter at the Break Closing Level",opts:["Enter immediately on 4H","Wait for daily close","Drop to 5M and enter at the Break Closing Level","Move SL to breakeven"]}
    ]
  },
  {
    level:6, title:"Liquidity & Support/Resistance", subtitle:"Where Stop Hunts Happen",
    emoji:"🎯", color:"#f0b429",
    tags:["Liquidity","Stop Hunt","Equal Highs/Lows","Support","Resistance","S/R Flip"],
    lessons:[
      { title:"What is Liquidity?", content:`
        <div class="lesson-highlight">Liquidity = clusters of <strong>stop loss orders</strong> that smart money targets BEFORE moving price in the real direction.</div>
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num red">🔴</div><div><strong>Buy-side liquidity</strong> = stop losses of SHORT traders above equal highs/PDH. Smart money sweeps UP to grab these, then reverses DOWN.</div></div>
          <div class="lesson-item"><div class="item-num green">🟢</div><div><strong>Sell-side liquidity</strong> = stop losses of LONG traders below equal lows/PDL. Smart money sweeps DOWN to grab these, then reverses UP.</div></div>
        </div>
        <div class="lesson-note">The liquidity sweep IS the setup. Wait for the sweep, see the rejection, enter in the OPPOSITE direction.</div>`},
      { title:"How to Identify a Valid Liquidity Sweep (4H)", content:`
        <div class="lesson-steps">
          <div class="step-card"><div class="step-num">1</div><div>On 4H, find a candle whose wick extends <strong>clearly beyond</strong> a previous high or low</div></div>
          <div class="step-card"><div class="step-num">2</div><div>✅ <strong>Valid sweep</strong>: wick goes out AND candle <strong>closes back inside</strong> the range</div></div>
          <div class="step-card"><div class="step-num">3</div><div>❌ <strong>Invalid</strong>: candle closes outside the level — that's a real breakout, not a sweep</div></div>
          <div class="step-card"><div class="step-num">4</div><div>After valid sweep: drop to 5M for CRT entry at the Break Closing Level</div></div>
        </div>`},
      { title:"Support & Resistance + S/R Flip", content:`
        <div class="lesson-concept">
          <div class="concept-card green"><div class="concept-title">🟢 SUPPORT</div>
            <div class="concept-body">Price level with demand (buyers). Price bounces UP from here. <strong>Broken support → becomes resistance.</strong></div></div>
          <div class="concept-card red"><div class="concept-title">🔴 RESISTANCE</div>
            <div class="concept-body">Price level with supply (sellers). Price bounces DOWN from here. <strong>Broken resistance → becomes support.</strong></div></div>
        </div>
        <div class="lesson-rule"><div class="rule-icon">🔄</div><div><strong>S/R Flip:</strong> Broken resistance used for LONG entry. Broken support used for SHORT entry. This is confluence.</div></div>`}
    ],
    quiz:[
      {q:"A valid 4H liquidity sweep means?",a:"Wick sweeps the level AND candle closes back inside",opts:["Candle closes outside the level","Two candles close past the level","Wick sweeps the level AND candle closes back inside","Volume spike only"]}
    ]
  },
  {
    level:7, title:"Know Your Timeframes", subtitle:"Which Chart for Which Trader",
    emoji:"⏱️", color:"#00e5a0",
    tags:["Scalper","Day Trader","Swing Trader","Position Trader","Top-Down Analysis"],
    lessons:[
      { title:"4 Trading Styles by Timeframe", content:`
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num blue">⚡</div><div><strong>1min–15min = Scalper</strong><br/>Capitalize on short-term movements. Small % gains, many trades/day. Very stressful.</div></div>
          <div class="lesson-item"><div class="item-num green">📅</div><div><strong>15min–1hr = Day Trader</strong><br/>Hold longer for bigger % gains. Close all trades before end of session.</div></div>
          <div class="lesson-item"><div class="item-num gold">🌙</div><div><strong>1hr–4hr–1D = Swing Trader</strong><br/>Overnight price movement. Hold days to weeks. Best for $10 account growth.</div></div>
          <div class="lesson-item"><div class="item-num purple">📆</div><div><strong>1D–1W–1M = Position Trader</strong><br/>Long-term gains. Holds months. Needs large capital to start.</div></div>
        </div>`},
      { title:"Top-Down Multi-Timeframe Analysis", content:`
        <div class="lesson-highlight gold">Always analyze top-down: Higher TF gives direction, Lower TF gives entry.</div>
        <div class="lesson-steps">
          <div class="step-card"><div class="step-num">4H</div><div><strong>4-Hour</strong> — Overall bias (bull/bear). Find main structure, supply/demand zones, CRT setups.</div></div>
          <div class="step-card"><div class="step-num">1H</div><div><strong>1-Hour</strong> — Confirm BOS and CHOCH. Look for entry zones forming.</div></div>
          <div class="step-card"><div class="step-num">5M</div><div><strong>5-Minute</strong> — Pinpoint exact entry. Wait for Break Closing Level retest + candlestick confirmation.</div></div>
        </div>
        <div class="lesson-note">Rule: NEVER trade against the 4H direction. Higher timeframe bias always wins.</div>`}
    ],
    quiz:[
      {q:"Best timeframe approach for SMC trading?",a:"Top-down: 4H bias → 1H confirmation → 5M entry",opts:["Only use 1M chart","Only use daily chart","Top-down: 4H bias → 1H confirmation → 5M entry","Use whatever feels right"]}
    ]
  },
  {
    level:8, title:"The Conqueror Setup", subtitle:"All 6 Conditions — Maximum Power",
    emoji:"👑", color:"#f0b429",
    tags:["6/6 Score","OTE 0.618","Full SMC","$10→$1000","Master Level"],
    lessons:[
      { title:"The Complete 6-Condition Setup", content:`
        <div class="lesson-highlight gold">The CONQUEROR setup = ALL 6 conditions align. Score 6/6 = take the trade with full confidence and proper size.</div>
        <div class="lesson-steps">
          <div class="step-card"><div class="step-num">1</div><div><strong>Market Structure</strong> — 4H confirms bullish HH+HL or bearish LH+LL. Only trade with the trend.</div></div>
          <div class="step-card"><div class="step-num">2</div><div><strong>Liquidity Sweep</strong> — 4H candle sweeps PDH/PDL or equal highs/lows and <strong>closes back inside</strong>. The trap is set.</div></div>
          <div class="step-card"><div class="step-num">3</div><div><strong>CHOCH on 1H</strong> — After the sweep, 1H breaks the last LH (for buys) or HL (for sells) confirming reversal direction.</div></div>
          <div class="step-card"><div class="step-num">4</div><div><strong>Fibonacci OTE</strong> — Draw fib from sweep low to CHOCH high (buys). Enter in <strong>0.618–0.705</strong> golden zone.</div></div>
          <div class="step-card"><div class="step-num">5</div><div><strong>Order Block</strong> — Entry zone contains a fresh, unmitigated OB (last bearish candle before bullish impulse, or vice versa).</div></div>
          <div class="step-card"><div class="step-num">6</div><div><strong>5M Confirmation</strong> — Bullish/bearish engulfing or morning/evening star on 5M. Enter on <strong>close of confirmation candle</strong>.</div></div>
        </div>`},
      { title:"Entry, SL, TP & Position Sizing", content:`
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num gold">📍</div><div><strong>Entry</strong> = 0.618–0.705 OTE zone (on 5M candle close)</div></div>
          <div class="lesson-item"><div class="item-num red">🛑</div><div><strong>Stop Loss</strong> = 5 pips below swept low (buys) / 5 pips above swept high (sells)</div></div>
          <div class="lesson-item"><div class="item-num green">🎯</div><div><strong>TP1</strong> = 2R → take 50%, move SL to breakeven</div></div>
          <div class="lesson-item"><div class="item-num green">🎯</div><div><strong>TP2</strong> = 3.5R → take 30%</div></div>
          <div class="lesson-item"><div class="item-num green">🎯</div><div><strong>TP3</strong> = 5R → let 20% run to maximum target</div></div>
        </div>
        <div class="lesson-rule"><div class="rule-icon">👑</div><div>$10 account · 1% risk = $0.10 · 1:3 avg RR · 60% win rate = <strong>Profitable consistently</strong></div></div>`},
      { title:"Expectation vs Reality", content:`
        <div class="lesson-concept">
          <div class="concept-card blue"><div class="concept-title">EXPECTATION</div>
            <div class="concept-body">Smooth staircase upward. Every trade wins. Account doubles in a week. Easy money.</div></div>
          <div class="concept-card gold"><div class="concept-title">REALITY</div>
            <div class="concept-body">Messy, volatile, ups AND downs. <strong>But overall direction: UP.</strong> Losing streaks are normal. Trust the process.</div></div>
        </div>
        <div class="lesson-list">
          <div class="lesson-item"><div class="item-num gold">✓</div><div>60% win rate with 1:3 RR is <strong>extremely profitable</strong> over 100+ trades</div></div>
          <div class="lesson-item"><div class="item-num gold">✓</div><div>3 losses in a row = STOP trading for that day. Come back tomorrow.</div></div>
          <div class="lesson-item"><div class="item-num gold">✓</div><div>Track every trade in this app. The data reveals the truth about your trading.</div></div>
          <div class="lesson-item"><div class="item-num gold">✓</div><div>Consistency beats perfection. 2 quality trades/day, every single day.</div></div>
        </div>`}
    ],
    quiz:[
      {q:"How many conditions does the Conqueror setup require?",a:"All 6 conditions",opts:["3","4","5","All 6 conditions"]},
      {q:"Where is your Stop Loss in the Conqueror setup?",a:"5 pips beyond the swept high/low",opts:["At entry price","At CHOCH level","5 pips beyond the swept high/low","At TP1 level"]}
    ]
  }
];

// ─── STATE ───────────────────────────────────────────────────────────
let acProgress = JSON.parse(localStorage.getItem('sm_pro_academy') || '{"unlocked":[1],"completed":[],"quizScores":{}}');
let acActiveLevel = null;
let acActiveLesson = 0;

function saveAcProg() { localStorage.setItem('sm_pro_academy', JSON.stringify(acProgress)); }

// ─── RENDER MAIN ─────────────────────────────────────────────────────
function renderAcademy() {
  const el   = document.getElementById('pg-academy');
  const done = acProgress.completed.length;
  const pct  = Math.round((done / ACADEMY_DATA.length) * 100);

  el.innerHTML = `
    <div style="max-width:900px;margin:0 auto;">
      <div style="margin-bottom:28px;">
        <h2 style="font-family:var(--display);font-size:28px;font-weight:800;"><span class="shimmer">Trading Academy</span></h2>
        <p style="color:var(--muted);font-size:14px;margin-top:6px;">8 levels · From zero to SMC Conqueror · Based on @keeganvandyk curriculum</p>
        <div style="margin-top:14px;">
          <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;color:var(--muted);margin-bottom:6px;">
            <span>OVERALL PROGRESS</span><span>${pct}% · ${done}/${ACADEMY_DATA.length} levels</span>
          </div>
          <div class="prog"><div class="prog-fill gold" style="width:${pct}%;"></div></div>
        </div>
      </div>
      <div class="path">
        <div class="path-line"></div>
        ${ACADEMY_DATA.map(lvl => buildNode(lvl)).join('')}
      </div>
    </div>`;
}

function buildNode(lvl) {
  const unlocked  = acProgress.unlocked.includes(lvl.level);
  const completed = acProgress.completed.includes(lvl.level);
  const score     = acProgress.quizScores[lvl.level];
  return `
    <div class="path-node">
      <div class="node-circle ${completed?'done':''} ${!unlocked?'locked':''}"
        style="background:${unlocked?lvl.color+'22':'var(--bg2)'};border-color:${unlocked?lvl.color:'var(--border)'};color:${unlocked?lvl.color:'var(--muted)'};"
        onclick="${unlocked?`openLevel(${lvl.level})`:''}">
        ${completed?'✓':unlocked?lvl.emoji:'🔒'}
      </div>
      <div class="node-body">
        <div class="node-lvl" style="color:${lvl.color};">LEVEL ${lvl.level}</div>
        <div class="node-ttl">${lvl.title}</div>
        <div class="node-desc">${lvl.subtitle}</div>
        <div class="node-tags">
          ${lvl.tags.map(t=>`<span class="node-tag">${t}</span>`).join('')}
          ${completed?`<span class="badge green" style="font-size:9px;">✓ DONE${score!==undefined?` · ${score}%`:''}</span>`:''}
          ${!unlocked?`<span class="badge" style="font-size:9px;color:var(--muted);">🔒 Complete Level ${lvl.level-1}</span>`:''}
        </div>
        ${unlocked&&!completed?`<button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="openLevel(${lvl.level})">▶ START</button>`:''}
        ${completed?`<button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="openLevel(${lvl.level})">↻ REVIEW</button>`:''}
      </div>
    </div>`;
}

// ─── LESSON MODAL ────────────────────────────────────────────────────
function openLevel(n) {
  acActiveLevel  = ACADEMY_DATA.find(l=>l.level===n);
  acActiveLesson = 0;
  showLesson();
}

function showLesson() {
  const lvl = acActiveLevel;
  const les = lvl.lessons[acActiveLesson];
  const tot = lvl.lessons.length;
  const pct = Math.round((acActiveLesson/tot)*100);
  document.getElementById('ac-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="ac-modal" onclick="if(event.target.id==='ac-modal')closeAcModal()">
      <div class="modal" style="max-width:700px;">
        <div class="modal-head">
          <div>
            <div style="font-family:var(--mono);font-size:9px;color:${lvl.color};letter-spacing:3px;">LEVEL ${lvl.level} · ${lvl.title}</div>
            <div style="font-family:var(--display);font-size:18px;font-weight:800;margin-top:3px;">${les.title}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-family:var(--mono);font-size:10px;color:var(--muted);">${acActiveLesson+1}/${tot}</span>
            <button class="modal-close" onclick="closeAcModal()">✕</button>
          </div>
        </div>
        <div class="prog" style="border-radius:0;height:3px;"><div class="prog-fill gold" style="width:${pct}%;"></div></div>
        <div class="modal-body">
          <style>
            .lesson-concept{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}
            .concept-card{padding:16px;border-radius:var(--r);border:1px solid var(--border2)}
            .concept-card.blue{background:rgba(74,158,255,.07);border-color:rgba(74,158,255,.25)}
            .concept-card.green{background:rgba(0,229,160,.07);border-color:rgba(0,229,160,.25)}
            .concept-card.red{background:rgba(255,77,106,.07);border-color:rgba(255,77,106,.25)}
            .concept-card.gold{background:rgba(240,180,41,.07);border-color:rgba(240,180,41,.25)}
            .concept-card.purple{background:rgba(168,85,247,.07);border-color:rgba(168,85,247,.25)}
            .concept-title{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:2px;margin-bottom:8px}
            .concept-body{font-size:13px;line-height:1.7}
            .lesson-highlight{padding:14px 18px;background:rgba(240,180,41,.08);border-left:3px solid var(--gold);border-radius:0 var(--r) var(--r) 0;margin-bottom:16px;font-size:14px;line-height:1.7}
            .lesson-highlight.green{background:rgba(0,229,160,.08);border-color:var(--green)}
            .lesson-highlight.red{background:rgba(255,77,106,.08);border-color:var(--red)}
            .lesson-highlight.gold{background:rgba(240,180,41,.08);border-color:var(--gold)}
            .lesson-list{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
            .lesson-item{display:flex;align-items:flex-start;gap:12px;padding:10px;background:var(--bg2);border-radius:var(--r)}
            .item-num{font-family:var(--mono);font-size:11px;font-weight:700;min-width:36px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px}
            .item-num.green{background:rgba(0,229,160,.15);color:var(--green)}
            .item-num.red{background:rgba(255,77,106,.15);color:var(--red)}
            .item-num.gold{background:rgba(240,180,41,.15);color:var(--gold)}
            .item-num.blue{background:rgba(74,158,255,.15);color:var(--blue)}
            .item-num.purple{background:rgba(168,85,247,.15);color:var(--purple)}
            .lesson-note{padding:12px 16px;background:rgba(74,158,255,.06);border-radius:var(--r);border-left:3px solid var(--blue);font-size:12px;color:var(--muted);line-height:1.7;margin-top:12px}
            .lesson-rule{display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(240,180,41,.06);border-radius:var(--r);margin-bottom:8px;font-size:13px}
            .rule-icon{font-size:20px}
            .lesson-steps{display:flex;flex-direction:column;gap:8px}
            .step-card{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:var(--bg2);border-radius:var(--r);border-left:2px solid var(--gold)}
            .step-num{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--gold);min-width:28px}
          </style>
          ${les.content}
        </div>
        <div style="padding:16px 24px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" onclick="closeAcModal()">✕ Close</button>
          <div style="display:flex;gap:8px;">
            ${acActiveLesson>0?`<button class="btn btn-outline btn-sm" onclick="acPrev()">← Back</button>`:''}
            ${acActiveLesson<tot-1
              ?`<button class="btn btn-gold btn-sm" onclick="acNext()">Next Lesson →</button>`
              :lvl.quiz?.length
                ?`<button class="btn btn-gold btn-sm" onclick="startQuiz()">📝 Take Quiz</button>`
                :`<button class="btn btn-gold btn-sm" onclick="completeLevel()">✓ Complete</button>`
            }
          </div>
        </div>
      </div>
    </div>`);
}

function closeAcModal() { document.getElementById('ac-modal')?.remove(); }
function acNext() { acActiveLesson++; showLesson(); }
function acPrev() { acActiveLesson--; showLesson(); }

// ─── QUIZ ────────────────────────────────────────────────────────────
function startQuiz() { closeAcModal(); showQuiz(0,0); }

function showQuiz(qi, score) {
  const lvl = acActiveLevel;
  const q   = lvl.quiz[qi];
  const opts = [...q.opts].sort(()=>Math.random()-.5);
  document.getElementById('ac-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend',`
    <div class="modal-overlay" id="ac-modal">
      <div class="modal" style="max-width:600px;">
        <div class="modal-head">
          <div>
            <div style="font-family:var(--mono);font-size:9px;color:${lvl.color};letter-spacing:3px;">QUIZ · LEVEL ${lvl.level}</div>
            <div style="font-size:16px;font-weight:700;margin-top:4px;">Question ${qi+1} / ${lvl.quiz.length}</div>
          </div>
          <button class="modal-close" onclick="closeAcModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="font-size:17px;font-weight:600;margin-bottom:20px;line-height:1.5;">${q.q}</div>
          <div style="display:flex;flex-direction:column;gap:10px;" id="quiz-opts">
            ${opts.map((o,i)=>`
              <button onclick="answerQ(this,'${o.replace(/'/g,"\\'")}','${q.a.replace(/'/g,"\\'")}',${qi},${score},${lvl.quiz.length})"
                style="padding:12px 16px;background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r);
                color:var(--white);text-align:left;cursor:pointer;font-size:13px;transition:all .2s;font-family:var(--body);">
                ${String.fromCharCode(65+i)}. ${o}
              </button>`).join('')}
          </div>
        </div>
      </div>
    </div>`);
}

function answerQ(btn, chosen, correct, qi, score, total) {
  const right = chosen === correct;
  document.querySelectorAll('#quiz-opts button').forEach(b => {
    b.disabled = true;
    if (b.textContent.trim().slice(3) === correct) {
      b.style.borderColor='var(--green)'; b.style.background='rgba(0,229,160,.15)';
    }
  });
  if (!right) { btn.style.borderColor='var(--red)'; btn.style.background='rgba(255,77,106,.15)'; }
  const ns = score + (right?1:0);
  const modal = document.querySelector('.modal');
  const foot  = document.createElement('div');
  foot.style.cssText='padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;';
  foot.innerHTML=`
    <div style="font-family:var(--mono);font-size:12px;color:${right?'var(--green)':'var(--red)'};">
      ${right?'✓ Correct!':'✗ Incorrect — correct answer highlighted'}
    </div>
    <button class="btn btn-gold btn-sm" onclick="nextQ(${qi},${ns},${total})">
      ${qi+1<total?'Next →':'Finish ✓'}
    </button>`;
  modal.appendChild(foot);
}

function nextQ(qi, score, total) {
  closeAcModal();
  if (qi+1<total) { showQuiz(qi+1,score); return; }
  const pct = Math.round((score/total)*100);
  acProgress.quizScores[acActiveLevel.level] = pct;
  if (pct>=60) completeLevel(pct);
  else showResult(pct, false);
}

function showResult(pct, passed) {
  const lvl = acActiveLevel;
  document.getElementById('ac-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend',`
    <div class="modal-overlay" id="ac-modal">
      <div class="modal" style="max-width:480px;">
        <div class="modal-head">
          <div style="font-family:var(--display);font-size:20px;font-weight:800;">
            ${passed?'🎉 Level Complete!':'📚 Not Quite Yet!'}
          </div>
          <button class="modal-close" onclick="closeAcModal();renderAcademy()">✕</button>
        </div>
        <div class="modal-body" style="text-align:center;padding:32px 24px;">
          <div style="font-size:48px;margin-bottom:12px;">${passed?'🏆':'🔄'}</div>
          <div style="font-family:var(--mono);font-size:36px;font-weight:700;color:${passed?'var(--green)':'var(--gold)'};">${pct}%</div>
          <div style="color:var(--muted);margin:10px 0 24px;font-size:14px;">${passed?'Level complete. Next level unlocked!':'Need 60%+ to advance. Review lessons and retry.'}</div>
          ${passed
            ?`<button class="btn btn-gold btn-full" onclick="closeAcModal();renderAcademy()">Continue ➜</button>`
            :`<button class="btn btn-gold btn-full" onclick="closeAcModal();openLevel(${lvl.level})">Review & Retry</button>`
          }
        </div>
      </div>
    </div>`);
}

function completeLevel(pct) {
  const lvl = acActiveLevel;
  if (!acProgress.completed.includes(lvl.level)) acProgress.completed.push(lvl.level);
  const next = lvl.level+1;
  if (next<=ACADEMY_DATA.length && !acProgress.unlocked.includes(next)) acProgress.unlocked.push(next);
  if (pct!==undefined) acProgress.quizScores[lvl.level]=pct;
  saveAcProg();
  showResult(pct||100,true);
  toast(`Level ${lvl.level} done! ${next<=ACADEMY_DATA.length?'Level '+next+' unlocked 🔓':'You are a CONQUEROR 👑'}`, 'ok');
}
