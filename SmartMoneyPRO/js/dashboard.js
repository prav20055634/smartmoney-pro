// ─── DASHBOARD ─────────────────────────────────────────────────────

function renderDashboard() {
  const s = SMData.stats;
  const acct = SMData.account;
  const openSignals = SMData.getSignals('OPEN');

  document.getElementById('dashboard-content').innerHTML = `
    <div style="max-width:1200px;margin:0 auto;">

      <!-- Welcome banner -->
      <div style="margin-bottom:28px;padding:24px 28px;background:linear-gradient(135deg,rgba(240,180,41,0.1),rgba(74,158,255,0.05));border-radius:var(--radius-lg);border:1px solid rgba(240,180,41,0.2);">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
          <div>
            <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:3px;margin-bottom:6px;">SMART MONEY AI — TRADING INTELLIGENCE</div>
            <div style="font-family:var(--font-display);font-size:26px;font-weight:800;margin-bottom:6px;">
              Welcome back, Trader <span class="shimmer-text">⚡</span>
            </div>
            <div style="font-size:13px;color:var(--muted);">Upload a chart → AI checks all SMC conditions → Get precise entry with position size for your $10 account</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-gold" onclick="navigate('analyzer')">⬡ Analyze Chart</button>
            <button class="btn btn-outline" onclick="navigate('academy')">◎ Academy</button>
          </div>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid-4" style="margin-bottom:24px;">
        <div class="card">
          <div class="stat-widget">
            <span class="stat-label">Account Balance</span>
            <span class="stat-value td-gold" style="color:var(--gold);font-size:24px;" id="dash-balance">$${acct.balance.toFixed(2)}</span>
            <span class="stat-sub">Started: $${acct.startBalance.toFixed(2)} · Risk: ${acct.riskPercent}%/trade</span>
          </div>
        </div>
        <div class="card">
          <div class="stat-widget">
            <span class="stat-label">Win Rate</span>
            <span class="stat-value ${s.winRate>=50?'stat-up':'stat-down'}" style="font-size:32px;">${s.winRate||0}%</span>
            <div class="progress-bar" style="margin-top:8px;"><div class="progress-fill ${s.winRate>=50?'green':'red'} load-bar" style="width:${s.winRate||0}%"></div></div>
          </div>
        </div>
        <div class="card">
          <div class="stat-widget">
            <span class="stat-label">Total Trades</span>
            <span class="stat-value">${s.totalTrades||0}</span>
            <span class="stat-sub stat-up">${s.wins||0}W</span> <span class="stat-sub" style="color:var(--muted);"> / </span> <span class="stat-sub stat-down">${s.losses||0}L</span>
          </div>
        </div>
        <div class="card">
          <div class="stat-widget">
            <span class="stat-label">P&L</span>
            <span class="stat-value ${(s.totalPnL||0)>=0?'stat-up':'stat-down'}" style="font-size:24px;">${(s.totalPnL||0)>=0?'+':''}$${(s.totalPnL||0).toFixed(3)}</span>
            <span class="stat-sub">Streak: ${s.streak||0} ${s.streak>0?'🔥':s.streak<0?'❄️':''}</span>
          </div>
        </div>
      </div>

      <div class="grid-2" style="gap:24px;margin-bottom:24px;">
        <!-- Open signals -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Open Signals</span>
            <button class="btn btn-gold btn-sm" onclick="navigate('analyzer')">+ New Analysis</button>
          </div>
          ${openSignals.length === 0
            ? `<div style="text-align:center;padding:32px;color:var(--muted);">
                <div style="font-size:32px;margin-bottom:10px;">📊</div>
                <div style="font-family:var(--font-mono);font-size:12px;">No open signals</div>
                <div style="font-size:12px;margin-top:6px;">Upload a chart to generate a signal</div>
                <button class="btn btn-gold btn-sm" style="margin-top:14px;" onclick="navigate('analyzer')">⬡ Analyze Chart</button>
              </div>`
            : openSignals.slice(0,3).map(s => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--bg2);border-radius:var(--radius);margin-bottom:8px;border-left:3px solid ${s.direction==='BUY'?'var(--green)':'var(--red)'};">
                <div>
                  <div style="font-family:var(--font-display);font-size:15px;font-weight:700;">${s.pair}</div>
                  <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);">${s.timeframe||'1H'} · Score ${s.score}/6</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-family:var(--font-mono);font-size:11px;color:${s.direction==='BUY'?'var(--green)':'var(--red)'};">${s.direction}</div>
                  <div style="font-family:var(--font-mono);font-size:13px;color:var(--gold);">@ ${s.entry||'N/A'}</div>
                </div>
              </div>
            `).join('')
          }
          ${openSignals.length > 3 ? `<button class="btn btn-outline btn-full btn-sm" onclick="navigate('signals')">View all ${openSignals.length} signals →</button>` : ''}
        </div>

        <!-- Quick links -->
        <div class="card">
          <div class="card-header"><span class="card-title">Quick Actions</span></div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${[
              ['⬡', 'AI Analyzer', 'Upload chart screenshot → get full SMC analysis', 'analyzer', 'var(--gold)'],
              ['▦', 'Live Charts', 'EUR/USD, BTC, Nifty with live price simulation', 'charts', 'var(--blue)'],
              ['◌', 'Backtest', 'Test your strategy on historical data', 'backtest', 'var(--green)'],
              ['◉', 'Signals', 'View all open and closed signals', 'signals', 'var(--purple)'],
              ['△', 'Performance', 'Win rate, equity curve, trade stats', 'performance', 'var(--red)'],
              ['◎', 'Academy', 'Learn SMC from beginner to conqueror', 'academy', 'var(--gold)'],
            ].map(([icon,title,desc,page,color]) => `
              <div onclick="navigate('${page}')" style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--bg2);border-radius:var(--radius);cursor:pointer;transition:all 0.2s;border:1px solid var(--border);" onmouseover="this.style.borderColor='${color}';this.style.background='rgba(74,158,255,0.04)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg2)'">
                <div style="width:36px;height:36px;border-radius:10px;background:${color}22;display:flex;align-items:center;justify-content:center;font-size:18px;color:${color};flex-shrink:0;">${icon}</div>
                <div>
                  <div style="font-family:var(--font-display);font-size:14px;font-weight:700;">${title}</div>
                  <div style="font-size:11px;color:var(--muted);">${desc}</div>
                </div>
                <span style="margin-left:auto;font-size:16px;color:var(--muted);">→</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- $10 Account Guide -->
      <div class="card" style="background:linear-gradient(135deg,rgba(0,229,160,0.05),rgba(74,158,255,0.03));border-color:rgba(0,229,160,0.2);">
        <div class="card-header">
          <span class="card-title" style="color:var(--green);">Your $10 Account — Growth Plan</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--green);">1% RISK = $${(acct.balance * 0.01).toFixed(2)}/trade</span>
        </div>
        <div class="grid-4">
          ${[
            ['$10', 'NOW', '$0.10/trade', 'var(--green)'],
            ['$25', 'After 25 wins', '$0.25/trade', 'var(--blue)'],
            ['$50', 'After 50 wins', '$0.50/trade', 'var(--gold)'],
            ['$100', 'After 100 wins', '$1.00/trade', 'var(--red)'],
          ].map(([bal,label,risk,color]) => `
            <div style="padding:14px;background:var(--bg2);border-radius:var(--radius);text-align:center;border:1px solid ${color}33;">
              <div style="font-family:var(--font-mono);font-size:22px;font-weight:700;color:${color};margin-bottom:4px;">${bal}</div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);">${label}</div>
              <div style="font-family:var(--font-mono);font-size:11px;color:${color};margin-top:6px;">${risk}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:14px;padding:12px;background:rgba(0,229,160,0.06);border-radius:var(--radius);font-family:var(--font-mono);font-size:11px;color:var(--green);">
          ⚡ Strategy: Only take 5+ score setups · 1:3 minimum RR · Max 2 trades/day · Never move SL against you
        </div>
      </div>
    </div>
  `;
}
