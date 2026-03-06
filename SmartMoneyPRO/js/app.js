// ─── APP CONTROLLER ──────────────────────────────────────────────────

const PAGES = {
  dashboard:   { render: renderDashboard,   title: 'Dashboard'       },
  signals:     { render: renderSignals,     title: 'Live Signals'    },
  analyzer:    { render: renderAnalyzer,    title: 'AI Analyzer'     },
  charts:      { render: renderCharts,      title: 'Live Charts'     },
  backtest:    { render: renderBacktest,    title: 'Backtest'        },
  performance: { render: renderPerformance, title: 'Performance'     },
  academy:     { render: renderAcademy,     title: 'Academy'         },
};

// ─── NAVIGATION ──────────────────────────────────────────────────────
function go(page) {
  if (!PAGES[page]) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('pg-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  document.getElementById('page-title').textContent = PAGES[page].title;
  PAGES[page].render();
}

// ─── TICKER ───────────────────────────────────────────────────────────
const TICKER_MAP = {
  'eurusd': 'EUR/USD',
  'gbpusd': 'GBP/USD',
  'btcusd': 'BTC/USD',
  'nifty':  'NIFTY',
};

function updateTicker() {
  Object.entries(TICKER_MAP).forEach(([id, pair]) => {
    const pEl = document.getElementById('t-'  + id);
    const cEl = document.getElementById('tc-' + id);
    if (!pEl || !cEl) return;
    const price  = Prices.fmt(pair);
    const change = Prices.chg(pair);
    if (price !== '—') {
      pEl.textContent = price;
      cEl.textContent = (change >= 0 ? '+' : '') + change + '%';
      cEl.className   = 'tick-chg ' + (change >= 0 ? 'up' : 'dn');
      pEl.style.transition = 'color .5s';
      pEl.style.color = change >= 0 ? 'var(--green)' : 'var(--red)';
      setTimeout(() => { pEl.style.color = 'var(--white)'; }, 800);
    }
  });
}

// ─── UTC CLOCK ────────────────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('utc-clock');
  if (el) el.textContent = new Date().toISOString().slice(11, 16) + ' UTC';
}

// ─── SESSION BADGE ────────────────────────────────────────────────────
async function updateSessionBadge() {
  const data = await Session.refresh();
  if (!data) return;
  const el = document.getElementById('session-badge');
  if (!el) return;
  const active = data.active || [];
  if (data.overlap) {
    el.textContent = '⚡ LONDON + NY OVERLAP';
    el.style.cssText += 'color:var(--green);border-color:rgba(0,229,160,.4);background:rgba(0,229,160,.1);';
  } else if (active.length > 0) {
    el.textContent = active[0] + ' SESSION';
    el.style.color = data.colors?.[active[0]] || 'var(--gold)';
  } else {
    el.textContent = 'MARKET CLOSED';
    el.style.color = 'var(--muted)';
  }
}

// ─── SERVER STATUS ────────────────────────────────────────────────────
function setStatus(online) {
  const dot = document.querySelector('.status-dot');
  const lbl = document.getElementById('server-status');
  if (online) {
    dot?.classList.remove('offline');
    if (lbl) lbl.textContent = 'LIVE';
    if (lbl) lbl.style.color = 'var(--green)';
  } else {
    dot?.classList.add('offline');
    if (lbl) lbl.textContent = 'OFFLINE';
    if (lbl) lbl.style.color = 'var(--red)';
  }
}

async function checkHealth() {
  const r = await API.health();
  setStatus(r?.status === 'online');
}

// ─── SIDEBAR BALANCE ──────────────────────────────────────────────────
function updateSidebarBalance() {
  const el = document.getElementById('sb-balance');
  if (el) el.textContent = '$' + (Store.account.balance || 10).toFixed(2);
}

// ─── TOAST ────────────────────────────────────────────────────────────
function toast(msg, type = 'ok') {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `<span>${{ok:'✓',warn:'⚠',err:'✕'}[type]||'●'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.cssText += 'opacity:0;transform:translateX(20px);transition:all .3s;';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// ─── INIT ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

  // Show connecting immediately
  setStatus(false);
  const lbl = document.getElementById('server-status');
  if (lbl) { lbl.textContent = 'CONNECTING...'; lbl.style.color = 'var(--gold)'; }

  // Clock starts immediately — no server needed
  setInterval(updateClock, 1000);
  updateClock();

  // Load all data in parallel — much faster
  const [health, prices, session, _store] = await Promise.all([
    API.health(),
    Prices.refresh(),
    Session.refresh(),
    Store.load(),
  ]);

  // Now update everything at once
  setStatus(health?.status === 'online');
  updateTicker();
  updateSidebarBalance();

  // Update session badge from already-fetched data
  const el = document.getElementById('session-badge');
  if (el && session) {
    const active = session.active || [];
    if (session.overlap) {
      el.textContent = '⚡ LONDON + NY OVERLAP';
      el.style.color = 'var(--green)';
    } else if (active.length > 0) {
      el.textContent = active[0] + ' SESSION';
      el.style.color = session.colors?.[active[0]] || 'var(--gold)';
    } else {
      el.textContent = 'MARKET CLOSED';
      el.style.color = 'var(--muted)';
    }
  }

  // Load dashboard
  go('dashboard');

  // Background refresh every 30s
  setInterval(async () => {
    await Prices.refresh();
    updateTicker();
  }, 30000);

  // Session every 5 min
  setInterval(updateSessionBadge, 5 * 60 * 1000);

  // Health every 60s
  setInterval(checkHealth, 60000);

  // Keyboard shortcuts Ctrl+1 to Ctrl+7
  document.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const map = {'1':'dashboard','2':'signals','3':'analyzer',
                 '4':'charts','5':'backtest','6':'performance','7':'academy'};
    if (map[e.key]) { e.preventDefault(); go(map[e.key]); }
  });

  // Welcome toasts
  const bal = Store.account.balance || 10;
  setTimeout(() => toast('✓ SmartMoney PRO — 17 instruments live', 'ok'), 500);
  setTimeout(() => toast(`Account $${bal.toFixed(2)} · Risk per trade $${(bal*0.01).toFixed(4)}`, 'warn'), 1800);
});
