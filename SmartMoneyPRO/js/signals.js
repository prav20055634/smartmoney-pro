// ─── LIVE SIGNALS PAGE ───────────────────────────────────────────────

async function renderSignals() {
  const el = document.getElementById('pg-signals');
  el.innerHTML = `
    <div style="max-width:1100px;margin:0 auto;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <div>
          <h2 style="font-family:var(--display);font-size:28px;font-weight:800;">Live Session Signals</h2>
          <p style="color:var(--muted);font-size:13px;margin-top:4px;">Real SMC signals from real prices — 3 sessions: Tokyo · London · New York · India</p>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-outline btn-sm" onclick="renderSignals()">↻ Refresh</button>
          <button class="btn btn-gold btn-sm" onclick="go('analyzer')">⬡ Analyze Chart</button>
        </div>
      </div>

      <!-- Session status bar -->
      <div id="session-status-bar" style="margin-bottom:24px;"></div>

      <!-- Loading -->
      <div id="sig-loading" style="text-align:center;padding:60px 20px;">
        <div class="spin" style="margin:0 auto 16px;"></div>
        <div style="font-family:var(--mono);font-size:13px;color:var(--gold);">Fetching real market data...</div>
      </div>

      <!-- Signals content -->
      <div id="sig-main" style="display:none;">
        <!-- Win rate banner -->
        <div id="sig-wr-banner" style="margin-bottom:24px;"></div>
        <!-- Auto signals by session -->
        <div id="sig-sessions"></div>
        <!-- Saved open trades -->
        <div id="sig-open" style="margin-top:28px;"></div>
        <!-- Trade history -->
        <div id="sig-history" style="margin-top:28px;"></div>
      </div>
    </div>
  `;

  // Load in parallel
  const [sigData, _] = await Promise.all([
    API.sessionSignals(Store.account.balance),
    Store.load()
  ]);

  document.getElementById('sig-loading').style.display = 'none';
  document.getElementById('sig-main').style.display    = 'block';

  renderSessionBar(sigData);
  renderAutoSignals(sigData);
  renderWRBanner();
  renderOpenTrades();
  renderTradeHistory();
}

function renderSessionBar(data) {
  const el = document.getElementById('session-status-bar');
  if (!data) { el.innerHTML = ''; return; }

  const SESSION_COLORS = { TOKYO:'#a855f7', LONDON:'#f0b429', 'NEW YORK':'#00e5a0', 'INDIA NSE':'#ff4d6a' };
  const ALL = ['TOKYO','LONDON','NEW YORK','INDIA NSE'];

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
      ${ALL.map(s => {
        const active = (data.sessions || []).includes(s);
        const color  = SESSION_COLORS[s];
        return `
          <div style="padding:12px 14px;border-radius:var(--r);border:1px solid ${active ? color+'44' : 'var(--border)'};
            background:${active ? color+'11' : 'var(--panel)'};transition:all .3s;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <div style="width:8px;height:8px;border-radius:50%;background:${active ? color : 'var(--muted2)'};
                ${active ? `box-shadow:0 0 8px ${color};animation:ringPulse 2s ease-in-out infinite` : ''}"></div>
              <span style="font-family:var(--mono);font-size:11px;font-weight:700;color:${active ? color : 'var(--muted)'};">${s}</span>
              ${active && data.overlap && (s === 'LONDON' || s === 'NEW YORK') ? `<span style="font-family:var(--mono);font-size:8px;color:var(--gold);background:rgba(240,180,41,.1);padding:1px 6px;border-radius:4px;">OVERLAP</span>` : ''}
            </div>
            <div style="font-family:var(--mono);font-size:9px;color:${active ? 'var(--white)' : 'var(--muted2)'};">
              ${active ? '● ACTIVE NOW' : '○ CLOSED'}
            </div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--muted);margin-top:3px;">
              ${s==='TOKYO'?'00:00–09:00 UTC':s==='LONDON'?'08:00–17:00 UTC':s==='NEW YORK'?'13:00–22:00 UTC':'03:45–10:00 UTC'}
            </div>
          </div>
        `;
      }).join('')}
    </div>
    ${data.utc ? `<div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:10px;text-align:right;">
      Current time: ${data.utc} ${data.overlap ? '— <span style="color:var(--gold)">⚡ London/NY overlap — highest probability</span>' : ''}
    </div>` : ''}
  `;
}

function renderAutoSignals(data) {
  const el = document.getElementById('sig-sessions');
  if (!data || !data.signals || data.signals.length === 0) {
    el.innerHTML = `
      <div class="card">
        <div class="no-signal">
          <div class="icon">🌙</div>
          <div class="msg">No active sessions right now</div>
          <div class="sub">Sessions: Tokyo 00:00, London 08:00, NY 13:00, India 03:45 UTC</div>
        </div>
      </div>`;
    return;
  }

  // Group by session
  const bySession = {};
  data.signals.forEach(s => {
    if (!bySession[s.session]) bySession[s.session] = [];
    bySession[s.session].push(s);
  });

  el.innerHTML = `<div style="font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:3px;margin-bottom:14px;">
    ACTIVE SESSION SIGNALS — REAL PRICES</div>`;

  Object.entries(bySession).forEach(([session, signals]) => {
    const color = signals[0]?.session_color || '#4a9eff';
    const quality = signals[0]?.quality || 'HIGH';
    el.innerHTML += `
      <div style="margin-bottom:28px;">
        <div class="session-hdr" style="border-color:${color}44;background:${color}0d;">
          <div class="session-dot" style="background:${color};box-shadow:0 0 10px ${color};animation:ringPulse 2s ease-in-out infinite;"></div>
          <div>
            <div class="session-name" style="color:${color};">${session} SESSION</div>
            <div style="font-family:var(--mono);font-size:9px;color:var(--muted);">Quality: ${quality}</div>
          </div>
          <div class="session-quality" style="color:${color};">${signals.length} signal${signals.length>1?'s':''}</div>
        </div>
        ${signals.map(s => buildSignalCard(s)).join('')}
      </div>
    `;
  });
}

function buildSignalCard(s) {
  const dir      = s.direction;
  const isValid  = s.valid;
  const score    = s.score || 0;
  const circ     = 283;
  const offset   = circ - (score / 6) * circ;
  const scoreCol = score >= 5 ? 'var(--green)' : score >= 4 ? 'var(--gold)' : 'var(--red)';
  const dirCol   = dir === 'BUY' ? 'var(--green)' : 'var(--red)';

  const condKeys   = ['marketStructure','liquiditySweep','choch','fibonacci','orderBlock','volume'];
  const condLabels = ['Market Structure','Liquidity Sweep','CHOCH','Fibonacci OTE','Order Block','Volume'];

  const condsHTML = condKeys.map((k, i) => {
    const c = s.conditions?.[k];
    if (!c) return '';
    return `
      <div class="cond-row ${c.met ? 'met' : 'not'}">
        <span class="cond-icon" style="color:${c.met?'var(--green)':'var(--red)'};">${c.met?'✓':'✗'}</span>
        <span class="cond-name">${condLabels[i]}</span>
        <span class="cond-detail">${c.detail || ''}</span>
      </div>`;
  }).join('');

  return `
    <div class="sig-card ${dir.toLowerCase()}" style="${!isValid ? 'opacity:.65' : ''}">
      <div class="sig-hdr">
        <div>
          <div class="sig-pair">${s.pair}</div>
          <div class="sig-session" style="color:${s.session_color || 'var(--muted)'};">
            ${s.session} · ${s.timeframe || '1H'}</div>
          <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:4px;">
            Live price: <span style="color:var(--gold);">${formatPrice(s.live_price, s.pair)}</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div class="score-ring-wrap">
            <svg class="score-ring" width="80" height="80" viewBox="0 0 100 100">
              <circle class="score-bg" cx="50" cy="50" r="45"/>
              <circle class="score-fill" cx="50" cy="50" r="45"
                stroke="${scoreCol}"
                stroke-dasharray="${circ}"
                stroke-dashoffset="${offset}"/>
            </svg>
            <div class="score-num" style="color:${scoreCol};">${score}/6</div>
          </div>
          <div class="score-sub">CONFLUENCE</div>
          <span class="sig-dir ${dir.toLowerCase()}">${dir}</span>
        </div>
      </div>

      <!-- Entry / SL / TP -->
      <div class="sig-levels">
        <div class="sig-level">
          <div class="sig-level-lbl">ENTRY (OTE)</div>
          <div class="sig-level-val entry">${s.entry}</div>
        </div>
        <div class="sig-level">
          <div class="sig-level-lbl">STOP LOSS</div>
          <div class="sig-level-val sl">${s.sl}</div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--muted);margin-top:3px;">${s.sl_pips} pips</div>
        </div>
        <div class="sig-level">
          <div class="sig-level-lbl">TP1 (${s.rr1})</div>
          <div class="sig-level-val tp">${s.tp1}</div>
        </div>
      </div>

      <!-- TP2, TP3 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="padding:8px;background:rgba(0,229,160,.05);border-radius:6px;text-align:center;border:1px solid rgba(0,229,160,.15);">
          <div style="font-family:var(--mono);font-size:9px;color:var(--muted);">TP2 (${s.rr2})</div>
          <div style="font-family:var(--mono);font-size:14px;font-weight:700;color:var(--green);">${s.tp2}</div>
        </div>
        <div style="padding:8px;background:rgba(0,229,160,.05);border-radius:6px;text-align:center;border:1px solid rgba(0,229,160,.15);">
          <div style="font-family:var(--mono);font-size:9px;color:var(--muted);">TP3 (1:5)</div>
          <div style="font-family:var(--mono);font-size:14px;font-weight:700;color:var(--green);">${s.tp3}</div>
        </div>
      </div>

      <!-- Position size -->
      <div style="padding:10px 14px;background:rgba(240,180,41,.07);border-radius:8px;border:1px solid rgba(240,180,41,.2);margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-family:var(--mono);font-size:9px;color:var(--muted);letter-spacing:2px;">POSITION SIZE ($${Store.account.balance.toFixed(2)} · 1% risk)</div>
          <div style="font-family:var(--mono);font-size:13px;color:var(--gold);font-weight:700;margin-top:4px;">
            ${s.position_size?.display || '—'}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--mono);font-size:9px;color:var(--muted);">MAX RISK</div>
          <div style="font-family:var(--mono);font-size:16px;color:var(--red);font-weight:700;">
            $${(Store.account.balance * 0.01).toFixed(4)}
          </div>
        </div>
      </div>

      <!-- Conditions -->
      <div style="font-family:var(--mono);font-size:9px;color:var(--muted);letter-spacing:2px;margin-bottom:7px;">CONDITIONS CHECK</div>
      <div style="margin-bottom:12px;">${condsHTML}</div>

      <!-- Reasoning -->
      <div style="padding:10px 12px;background:rgba(74,158,255,.06);border-radius:var(--r);border-left:3px solid var(--blue);margin-bottom:12px;">
        <div style="font-family:var(--mono);font-size:9px;color:var(--blue);letter-spacing:2px;margin-bottom:5px;">AI REASONING</div>
        <div style="font-size:12px;color:var(--white);line-height:1.6;">${s.reasoning}</div>
      </div>

      ${!isValid ? `
        <div style="padding:10px 12px;background:rgba(255,77,106,.08);border-radius:var(--r);border-left:3px solid var(--red);font-family:var(--mono);font-size:11px;color:var(--red);">
          ⚠ Score ${score}/6 — Insufficient confluence. SKIP this trade. Wait for score 4+.
        </div>` :
        `<div style="display:flex;gap:8px;margin-top:4px;">
          <button class="btn btn-green" style="flex:1;font-size:11px;" onclick="saveSignalFromSession(${JSON.stringify(s).replace(/"/g,'&quot;')})">
            ✓ SAVE TO MY TRADES
          </button>
        </div>`
      }
    </div>
  `;
}

async function saveSignalFromSession(s) {
  const saved = await Store.saveSignal(s);
  if (saved) {
    toast('Signal saved! Track it in My Open Trades below.', 'ok');
    renderOpenTrades();
  } else {
    toast('Save failed — server error', 'err');
  }
}

function renderWRBanner() {
  const el = document.getElementById('sig-wr-banner');
  const st = Store.stats;
  const wr = st.winRate || 0;
  const diff = wr - (st.prevWinRate || 0);
  el.innerHTML = `
    <div class="g4" style="gap:12px;">
      ${[
        [wr+'%', 'WIN RATE', `${diff>=0?'▲':'▼'} ${Math.abs(diff).toFixed(1)}% vs prev`, wr>=50?'green':'red'],
        [st.totalTrades||0, 'TRADES', `${st.wins||0}W / ${st.losses||0}L`, 'white'],
        [`${(st.totalPnL||0)>=0?'+':''}$${(st.totalPnL||0).toFixed(3)}`, 'TOTAL P&L', `Balance: $${Store.account.balance.toFixed(2)}`, (st.totalPnL||0)>=0?'green':'red'],
        [st.streak||0, 'STREAK', `Best: ${st.bestStreak||0} wins`, st.streak>0?'green':st.streak<0?'red':'white'],
      ].map(([v,l,s,c]) => `
        <div class="card" style="text-align:center;padding:16px;">
          <div class="stat-lbl">${l}</div>
          <div class="stat-val ${c}" style="font-size:26px;">${v}</div>
          <div class="stat-sub ${c}">${s}</div>
        </div>`).join('')}
    </div>`;
}

function renderOpenTrades() {
  const el = document.getElementById('sig-open');
  const open = Store.openSignals();
  el.innerHTML = `
    <div style="font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:3px;margin-bottom:14px;">
      MY OPEN TRADES (${open.length})</div>
    ${open.length === 0
      ? `<div class="card"><div class="no-signal"><div class="icon">📋</div>
          <div class="msg">No open trades. Save a signal above to track it.</div></div></div>`
      : open.map(s => `
          <div class="sig-card ${(s.direction||'').toLowerCase()}" style="padding:14px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
              <div>
                <span style="font-family:var(--display);font-size:18px;font-weight:800;">${s.pair}</span>
                <span class="sig-dir ${(s.direction||'').toLowerCase()}" style="margin-left:10px;">${s.direction}</span>
              </div>
              <span style="font-family:var(--mono);font-size:10px;color:var(--muted);">${new Date(s.timestamp).toLocaleString()}</span>
            </div>
            <div class="sig-levels">
              <div class="sig-level"><div class="sig-level-lbl">ENTRY</div><div class="sig-level-val entry">${s.entry||'—'}</div></div>
              <div class="sig-level"><div class="sig-level-lbl">STOP LOSS</div><div class="sig-level-val sl">${s.sl||'—'}</div></div>
              <div class="sig-level"><div class="sig-level-lbl">TP1</div><div class="sig-level-val tp">${s.tp1||'—'}</div></div>
            </div>
            <div style="font-family:var(--mono);font-size:11px;color:var(--gold);margin-bottom:10px;">
              Position: ${s.position_size?.display || '—'}
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-green btn-sm" style="flex:1;" onclick="closeMyTrade(${s.id},'win')">✓ WIN</button>
              <button class="btn btn-red btn-sm" style="flex:1;" onclick="closeMyTrade(${s.id},'loss')">✗ LOSS</button>
            </div>
          </div>`).join('')
    }`;
}

async function closeMyTrade(id, result) {
  const risk = Store.riskUSD();
  const sig  = Store.signals.find(s => s.id === id);
  const rr   = sig?.rr1 ? parseFloat((sig.rr1||'1:3').split(':')[1]) : 3;
  const pnl  = result === 'win' ? parseFloat((risk * rr).toFixed(4)) : -parseFloat(risk.toFixed(4));

  const r = await Store.closeSignal(id, pnl);
  if (r) {
    const wr = r.stats?.winRate || 0;
    toast(result === 'win'
      ? `✓ WIN +$${pnl.toFixed(4)} | Win rate: ${wr}%`
      : `Loss -$${Math.abs(pnl).toFixed(4)} | Stay disciplined!`, result === 'win' ? 'ok' : 'warn');
    renderWRBanner();
    renderOpenTrades();
    renderTradeHistory();
    updateSidebarBalance();
  }
}

function renderTradeHistory() {
  const el = document.getElementById('sig-history');
  const closed = Store.closedSignals();
  el.innerHTML = `
    <div style="font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:3px;margin-bottom:14px;">
      TRADE HISTORY (${closed.length})</div>
    <div class="card" style="padding:0;overflow:hidden;">
      ${closed.length === 0
        ? `<div style="text-align:center;padding:32px;color:var(--muted);font-family:var(--mono);font-size:12px;">No closed trades yet</div>`
        : `<table class="tbl">
            <thead><tr>
              <th>DATE</th><th>SESSION</th><th>PAIR</th><th>DIR</th>
              <th>ENTRY</th><th>SL</th><th>TP1</th><th>SCORE</th><th>STATUS</th><th>P&L</th>
            </tr></thead>
            <tbody>
              ${closed.slice(0, 50).map(t => `<tr>
                <td>${new Date(t.timestamp).toLocaleDateString()}</td>
                <td style="font-family:var(--mono);font-size:10px;color:var(--muted);">${t.session||'—'}</td>
                <td class="gold">${t.pair}</td>
                <td style="color:${t.direction==='BUY'?'var(--green)':'var(--red)'};">${t.direction}</td>
                <td>${t.entry||'—'}</td>
                <td class="dn">${t.sl||'—'}</td>
                <td class="up">${t.tp1||'—'}</td>
                <td style="color:${t.score>=5?'var(--green)':t.score>=4?'var(--gold)':'var(--red)'};">${t.score}/6</td>
                <td><span style="font-family:var(--mono);font-size:10px;padding:2px 7px;border-radius:4px;
                  background:${t.status==='WIN'?'rgba(0,229,160,.15)':'rgba(255,77,106,.15)'};
                  color:${t.status==='WIN'?'var(--green)':'var(--red)'};">${t.status}</span></td>
                <td class="${(t.pnl||0)>0?'up':'dn'}">${(t.pnl||0)>0?'+':''}$${(t.pnl||0).toFixed(4)}</td>
              </tr>`).join('')}
            </tbody>
          </table>`
      }
    </div>`;
}

function formatPrice(p, pair) {
  if (!p) return '—';
  if (p > 10000) return p.toLocaleString('en-US', {maximumFractionDigits: 0});
  if (p > 100)   return p.toFixed(2);
  if (p > 10)    return p.toFixed(3);
  return p.toFixed(5);
}
