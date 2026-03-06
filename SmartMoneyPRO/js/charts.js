// ─── LIVE CHARTS — TradingView Real Embeds ─────────────────────────
// Uses TradingView widget which shows 100% real live data globally

function renderCharts() {
  const el = document.getElementById('pg-charts');
  el.innerHTML = `
    <div style="max-width:1200px;margin:0 auto;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <div>
          <h2 style="font-family:var(--display);font-size:28px;font-weight:800;">Live Charts</h2>
          <p style="color:var(--muted);font-size:13px;margin-top:4px;">Real-time TradingView charts — not simulated</p>
        </div>
        <div class="tabs" id="mkt-tabs">
          <button class="tab active" onclick="switchMkt('forex',this)">FOREX</button>
          <button class="tab" onclick="switchMkt('crypto',this)">CRYPTO</button>
          <button class="tab" onclick="switchMkt('india',this)">INDIA</button>
        </div>
      </div>

      <!-- Symbol selector -->
      <div class="card" style="margin-bottom:20px;padding:14px 18px;">
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
          <select class="inp" id="sym-select" onchange="loadTVChart()" style="width:160px;">
            <option value="FX:EURUSD">EUR/USD</option>
            <option value="FX:GBPUSD">GBP/USD</option>
            <option value="FX:USDJPY">USD/JPY</option>
            <option value="FX:GBPJPY">GBP/JPY</option>
            <option value="FX:AUDUSD">AUD/USD</option>
            <option value="FX:USDCAD">USD/CAD</option>
          </select>
          <div class="tabs" id="tf-tabs">
            ${['5','15','60','240','D'].map((tf,i) =>
              `<button class="tab ${i===2?'active':''}" onclick="changeTF('${tf}',this)">${tf==='D'?'Daily':tf==='240'?'4H':tf==='60'?'1H':tf+'M'}</button>`
            ).join('')}
          </div>
          <div style="margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--muted);">
            Live price: <span id="chart-live-price" style="color:var(--gold);font-weight:700;">—</span>
          </div>
        </div>
      </div>

      <!-- Main TV chart -->
      <div class="card" style="padding:0;overflow:hidden;margin-bottom:20px;">
        <div id="tv-main-chart" style="height:500px;"></div>
      </div>

      <!-- 3 mini charts -->
      <div class="g3" style="gap:16px;">
        <div class="card" style="padding:0;overflow:hidden;">
          <div style="padding:10px 14px;background:rgba(0,0,0,.2);border-bottom:1px solid var(--border);
            display:flex;align-items:center;justify-content:space-between;">
            <span style="font-family:var(--display);font-size:14px;font-weight:800;">EUR/USD</span>
            <span style="font-family:var(--mono);font-size:13px;color:var(--gold);" id="mini-p1">—</span>
          </div>
          <div id="mini-chart-1" style="height:200px;"></div>
        </div>
        <div class="card" style="padding:0;overflow:hidden;">
          <div style="padding:10px 14px;background:rgba(0,0,0,.2);border-bottom:1px solid var(--border);
            display:flex;align-items:center;justify-content:space-between;">
            <span style="font-family:var(--display);font-size:14px;font-weight:800;">BTC/USD</span>
            <span style="font-family:var(--mono);font-size:13px;color:var(--gold);" id="mini-p2">—</span>
          </div>
          <div id="mini-chart-2" style="height:200px;"></div>
        </div>
        <div class="card" style="padding:0;overflow:hidden;">
          <div style="padding:10px 14px;background:rgba(0,0,0,.2);border-bottom:1px solid var(--border);
            display:flex;align-items:center;justify-content:space-between;">
            <span style="font-family:var(--display);font-size:14px;font-weight:800;">NIFTY</span>
            <span style="font-family:var(--mono);font-size:13px;color:var(--gold);" id="mini-p3">—</span>
          </div>
          <div id="mini-chart-3" style="height:200px;"></div>
        </div>
      </div>

      <!-- Live price table -->
      <div class="card" style="margin-top:20px;">
        <div class="card-hdr"><span class="card-ttl">Live Prices (Real)</span>
          <span style="font-family:var(--mono);font-size:10px;color:var(--green);">● Updates every 30s from server</span></div>
        <div id="price-table"></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    loadTVChart();
    loadMiniTVCharts();
    refreshPriceTable();
  }, 100);
}

let currentTF   = '60';
let currentSym  = 'FX:EURUSD';

function loadTVChart() {
  const sym = document.getElementById('sym-select')?.value || 'FX:EURUSD';
  currentSym = sym;
  const el  = document.getElementById('tv-main-chart');
  if (!el) return;

  // TradingView embed — shows fully live, real data globally
  el.innerHTML = `
    <iframe
      src="https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(sym)}&interval=${currentTF}&theme=dark&style=1&locale=en&toolbar_bg=%230a1628&hide_top_toolbar=0&hide_legend=0&saveimage_enabled=0&withdateranges=1&hide_side_toolbar=0&allow_symbol_change=0&calendar=0&hotlist=0&news=0&studies=MACD%401%7Bclose%2C12%2C26%2C9%7D%2CRSI%401%7Bclose%2C14%7D&bgcolor=%230a1628&gridcolor=%231e3050&linecolor=%234a9eff"
      style="width:100%;height:500px;border:none;"
      allowtransparency="true"
      frameborder="0"
      scrolling="no">
    </iframe>`;

  // Update live price from our server
  Prices.refresh().then(() => {
    const pairMap = {
      'FX:EURUSD':'EUR/USD','FX:GBPUSD':'GBP/USD','FX:USDJPY':'USD/JPY',
      'FX:GBPJPY':'GBP/JPY','FX:AUDUSD':'AUD/USD','FX:USDCAD':'USD/CAD',
      'BINANCE:BTCUSDT':'BTC/USD','BINANCE:ETHUSDT':'ETH/USD',
      'NSE:NIFTY50':'NIFTY','NSE:BANKNIFTY':'BANKNIFTY',
    };
    const pair = pairMap[sym];
    const price = pair ? Prices.fmt(pair) : '—';
    const cpEl = document.getElementById('chart-live-price');
    if (cpEl) cpEl.textContent = price;
  });
}

function loadMiniTVCharts() {
  const configs = [
    { id:'mini-chart-1', sym:'FX:EURUSD',           priceId:'mini-p1', pair:'EUR/USD'  },
    { id:'mini-chart-2', sym:'BINANCE:BTCUSDT',      priceId:'mini-p2', pair:'BTC/USD'  },
    { id:'mini-chart-3', sym:'NSE:NIFTY50',          priceId:'mini-p3', pair:'NIFTY'    },
  ];

  configs.forEach(cfg => {
    const el = document.getElementById(cfg.id);
    if (!el) return;
    el.innerHTML = `
      <iframe
        src="https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(cfg.sym)}&interval=60&theme=dark&style=3&locale=en&toolbar_bg=%230a1628&hide_top_toolbar=1&hide_legend=1&hide_side_toolbar=1&allow_symbol_change=0"
        style="width:100%;height:200px;border:none;"
        allowtransparency="true"
        frameborder="0"
        scrolling="no">
      </iframe>`;
    // Price from our real server
    const p = Prices.fmt(cfg.pair);
    const pel = document.getElementById(cfg.priceId);
    if (pel && p !== '—') pel.textContent = p;
  });
}

function changeTF(tf, btn) {
  document.querySelectorAll('#tf-tabs .tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentTF = tf;
  loadTVChart();
}

function switchMkt(mkt, btn) {
  document.querySelectorAll('#mkt-tabs .tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const sel = document.getElementById('sym-select');
  if (!sel) return;
  if (mkt === 'forex') {
    sel.innerHTML = `
      <option value="FX:EURUSD">EUR/USD</option>
      <option value="FX:GBPUSD">GBP/USD</option>
      <option value="FX:USDJPY">USD/JPY</option>
      <option value="FX:GBPJPY">GBP/JPY</option>
      <option value="FX:AUDUSD">AUD/USD</option>
      <option value="FX:USDCAD">USD/CAD</option>`;
  } else if (mkt === 'crypto') {
    sel.innerHTML = `
      <option value="BINANCE:BTCUSDT">BTC/USD</option>
      <option value="BINANCE:ETHUSDT">ETH/USD</option>
      <option value="BINANCE:SOLUSDT">SOL/USD</option>
      <option value="BINANCE:BNBUSDT">BNB/USD</option>`;
  } else {
    sel.innerHTML = `
      <option value="NSE:NIFTY50">NIFTY 50</option>
      <option value="NSE:BANKNIFTY">BANK NIFTY</option>`;
  }
  loadTVChart();
}

async function refreshPriceTable() {
  await Prices.refresh();
  const el = document.getElementById('price-table');
  if (!el) return;
  const pairs = [
    ['EUR/USD','Forex'],['GBP/USD','Forex'],['USD/JPY','Forex'],
    ['GBP/JPY','Forex'],['AUD/USD','Forex'],['USD/CAD','Forex'],
    ['BTC/USD','Crypto'],['ETH/USD','Crypto'],['SOL/USD','Crypto'],
    ['NIFTY','India'],['BANKNIFTY','India'],
  ];
  el.innerHTML = `<table class="tbl">
    <thead><tr><th>INSTRUMENT</th><th>MARKET</th><th>LIVE PRICE</th><th>24H CHANGE</th><th>SOURCE</th></tr></thead>
    <tbody>
      ${pairs.map(([p,mkt]) => {
        const price = Prices.fmt(p);
        const chg   = Prices.chg(p);
        return `<tr>
          <td class="gold">${p}</td>
          <td style="color:var(--muted);font-size:11px;">${mkt}</td>
          <td>${price}</td>
          <td class="${chg>=0?'up':'dn'}">${chg>=0?'+':''}${chg}%</td>
          <td style="font-family:var(--mono);font-size:9px;color:var(--muted);">
            ${mkt==='India'?'Yahoo Finance':mkt==='Crypto'?'CoinGecko':'ExchangeRate-API'}
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
  <div style="font-family:var(--mono);font-size:10px;color:var(--muted);padding:10px 14px;border-top:1px solid var(--border);">
    Last updated: ${new Date().toLocaleTimeString()} · Refreshes every 30 seconds from live APIs
  </div>`;

  // Update mini prices
  ['EUR/USD','BTC/USD','NIFTY'].forEach((p,i) => {
    const el2 = document.getElementById(`mini-p${i+1}`);
    if (el2) el2.textContent = Prices.fmt(p);
  });
}
