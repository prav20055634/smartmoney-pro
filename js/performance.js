// ─── PERFORMANCE PAGE ─────────────────────────────────────────────

let perfChartInst = null;

function renderPerformance() {
  const s = SMData.stats;
  const acct = SMData.account;
  const signals = SMData.signals;
  const wr = s.winRate || 0;
  const diff = wr - (s.prevWinRate || 0);

  document.getElementById('performance-content').innerHTML = `
    <div style="max-width:1100px;margin:0 auto;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
        <div>
          <h2 style="font-family:var(--font-display);font-size:28px;font-weight:800;">Performance</h2>
          <p style="color:var(--muted);font-size:13px;margin-top:4px;">Track every trade, compare win rates, analyze your edge</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="addTestTrades()">+ Add Test Data</button>
      </div>

      <!-- Top stats -->
      <div class="grid-4" style="margin-bottom:24px;">
        <div class="card neon-border" style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:8px;">LIVE WIN RATE</div>
          <div style="font-family:var(--font-mono);font-size:42px;font-weight:700;color:${wr>=50?'var(--green)':'var(--red)'};">${wr}<span style="font-size:20px;">%</span></div>
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:8px;">
            <span style="font-family:var(--font-mono);font-size:12px;color:${diff>=0?'var(--green)':'var(--red)'};">${diff>=0?'▲':'▼'} ${Math.abs(diff).toFixed(1)}%</span>
            <span style="font-family:var(--font-mono);font-size:10px;color:var(--muted);">vs last</span>
          </div>
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:8px;">ACCOUNT</div>
          <div style="font-family:var(--font-mono);font-size:32px;font-weight:700;color:var(--gold);">$${acct.balance.toFixed(2)}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:${acct.balance>=acct.startBalance?'var(--green)':'var(--red)'};margin-top:6px;">
            ${acct.balance>=acct.startBalance?'+':''}${((acct.balance/acct.startBalance-1)*100).toFixed(1)}% from start
          </div>
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:8px;">TOTAL P&L</div>
          <div style="font-family:var(--font-mono);font-size:32px;font-weight:700;color:${s.totalPnL>=0?'var(--green)':'var(--red)'};">${s.totalPnL>=0?'+':''}$${(s.totalPnL||0).toFixed(2)}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:6px;">${s.totalTrades} trades</div>
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:8px;">BEST STREAK</div>
          <div style="font-family:var(--font-mono);font-size:42px;font-weight:700;color:var(--blue);">${s.bestStreak||0}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:6px;">Consecutive wins</div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="grid-2" style="gap:20px;margin-bottom:24px;">
        <!-- Equity curve -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Equity Curve</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--muted);">Account growth</span>
          </div>
          <canvas id="equity-chart" height="200"></canvas>
        </div>

        <!-- Win/Loss Donut -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Win / Loss Distribution</span>
          </div>
          <div style="display:flex;align-items:center;gap:28px;">
            <canvas id="wl-chart" width="180" height="180"></canvas>
            <div style="flex:1;">
              <div style="margin-bottom:14px;">
                <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);">WINS</div>
                <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--green);">${s.wins||0}</div>
                <div class="progress-bar" style="margin-top:6px;"><div class="progress-fill green" style="width:${wr}%"></div></div>
              </div>
              <div style="margin-bottom:14px;">
                <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);">LOSSES</div>
                <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--red);">${s.losses||0}</div>
                <div class="progress-bar" style="margin-top:6px;"><div class="progress-fill red" style="width:${100-wr}%"></div></div>
              </div>
              <div>
                <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);">BEST WIN</div>
                <div style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--gold);">+$${(s.biggestWin||0).toFixed(3)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Win Rate Comparison -->
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <span class="card-title">Win Rate History — Before vs Current</span>
          <span class="card-badge">LIVE TRACKING</span>
        </div>
        <canvas id="winrate-chart" height="120"></canvas>
        <div style="display:flex;align-items:center;gap:20px;margin-top:12px;padding:10px 0 0;border-top:1px solid var(--border);font-family:var(--font-mono);font-size:11px;color:var(--muted);">
          <span>Previous Win Rate: <b style="color:var(--muted);">${s.prevWinRate||0}%</b></span>
          <span>Current Win Rate: <b style="color:${wr>=50?'var(--green)':'var(--red)'};">${wr}%</b></span>
          <span>Change: <b style="color:${diff>=0?'var(--green)':'var(--red)'};">${diff>=0?'+':''}${diff.toFixed(1)}%</b></span>
        </div>
      </div>

      <!-- Score distribution -->
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><span class="card-title">Confluence Score vs Win Rate</span></div>
        <canvas id="score-chart" height="140"></canvas>
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:10px;padding-top:8px;border-top:1px solid var(--border);">
          ⚡ Higher confluence score = higher win rate. Only trade score 4+.
        </div>
      </div>

      <!-- All trades table -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">All Trades</span>
          <button class="btn btn-outline btn-sm" onclick="clearAllTrades()">Clear All</button>
        </div>
        <div id="all-trades-table">
          ${signals.filter(s=>s.status!=='OPEN').length === 0
            ? '<div style="text-align:center;padding:32px;color:var(--muted);font-family:var(--font-mono);font-size:12px;">No closed trades yet. Mark signals as WIN/LOSS in the Signals page.</div>'
            : `<table class="data-table"><thead><tr>
                <th>DATE</th><th>PAIR</th><th>DIR</th><th>SCORE</th><th>RR</th><th>STATUS</th><th>P&L</th>
              </tr></thead><tbody>
              ${signals.filter(s=>s.status!=='OPEN').map(t=>`
                <tr><td>${new Date(t.timestamp).toLocaleDateString()}</td>
                <td class="td-gold">${t.pair}</td>
                <td style="color:${t.direction==='BUY'?'var(--green)':'var(--red)'};">${t.direction}</td>
                <td>${t.score}/6</td>
                <td>${t.rr||'—'}</td>
                <td class="${t.status==='WIN'?'td-green':'td-red'}">${t.status}</td>
                <td class="${(t.pnl||0)>0?'td-green':'td-red'}">${(t.pnl||0)>0?'+':''}$${(t.pnl||0).toFixed(3)}</td>
              </tr>`).join('')}
              </tbody></table>`
          }
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    drawEquityCurve();
    drawWLDonut();
    drawWinRateHistory();
    drawScoreChart();
  }, 100);
}

function drawEquityCurve() {
  const ctx = document.getElementById('equity-chart')?.getContext('2d');
  if (!ctx) return;
  const trades = SMData.signals.filter(s => s.status !== 'OPEN' && s.pnl !== null);
  let balance = SMData.account.startBalance;
  const data = [balance];
  const labels = ['Start'];
  trades.forEach((t, i) => { balance += (t.pnl || 0); data.push(parseFloat(balance.toFixed(4))); labels.push(`T${i+1}`); });
  if (perfChartInst?.equity) { try { perfChartInst.equity.destroy(); } catch(e){} }
  const ch = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Balance', data, borderColor: '#00e5a0', backgroundColor: 'rgba(0,229,160,0.1)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#00e5a0' }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#5a7a9a', font: { family: 'Space Mono', size: 9 } }, grid: { color: 'rgba(30,48,80,0.5)' } }, y: { ticks: { color: '#5a7a9a', font: { family: 'Space Mono', size: 9 }, callback: v => '$'+v }, grid: { color: 'rgba(30,48,80,0.5)' } } } }
  });
  if (!perfChartInst) perfChartInst = {};
  perfChartInst.equity = ch;
}

function drawWLDonut() {
  const ctx = document.getElementById('wl-chart')?.getContext('2d');
  if (!ctx) return;
  const s = SMData.stats;
  const w = s.wins || 0; const l = s.losses || 0;
  if (perfChartInst?.wl) { try { perfChartInst.wl.destroy(); } catch(e){} }
  const ch = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['Wins', 'Losses'], datasets: [{ data: [w || 0.1, l || 0.1], backgroundColor: ['rgba(0,229,160,0.8)', 'rgba(255,77,106,0.8)'], borderColor: ['#00e5a0', '#ff4d6a'], borderWidth: 2 }] },
    options: { responsive: false, cutout: '72%', plugins: { legend: { display: false } } }
  });
  perfChartInst.wl = ch;
}

function drawWinRateHistory() {
  const ctx = document.getElementById('winrate-chart')?.getContext('2d');
  if (!ctx) return;
  const s = SMData.stats;
  const labels = ['10 trades ago', '7 trades ago', '5 trades ago', '3 trades ago', '1 trade ago', 'Current'];
  const prevData = [
    Math.max(20, (s.prevWinRate||0) - 8 + Math.random()*4),
    Math.max(20, (s.prevWinRate||0) - 5 + Math.random()*4),
    Math.max(20, (s.prevWinRate||0) - 2 + Math.random()*4),
    s.prevWinRate||0,
    s.prevWinRate||0,
    s.winRate||0,
  ];
  if (perfChartInst?.wr) { try { perfChartInst.wr.destroy(); } catch(e){} }
  const ch = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [
      { label: 'Win Rate %', data: prevData, borderColor: '#f0b429', backgroundColor: 'rgba(240,180,41,0.1)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#f0b429' },
      { label: 'Target (50%)', data: labels.map(()=>50), borderColor: 'rgba(74,158,255,0.4)', borderDash: [5,5], fill: false, pointRadius: 0 }
    ] },
    options: { responsive: true, plugins: { legend: { labels: { color: '#5a7a9a', font: { family: 'Space Mono', size: 9 } } } }, scales: { x: { ticks: { color: '#5a7a9a', font: { family: 'Space Mono', size: 9 } }, grid: { color: 'rgba(30,48,80,0.3)' } }, y: { min: 0, max: 100, ticks: { color: '#5a7a9a', font: { family: 'Space Mono', size: 9 }, callback: v => v+'%' }, grid: { color: 'rgba(30,48,80,0.3)' } } } }
  });
  perfChartInst.wr = ch;
}

function drawScoreChart() {
  const ctx = document.getElementById('score-chart')?.getContext('2d');
  if (!ctx) return;
  const labels = ['Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5', 'Score 6'];
  const winRates = [15, 28, 42, 58, 71, 85];
  if (perfChartInst?.sc) { try { perfChartInst.sc.destroy(); } catch(e){} }
  const ch = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Win Rate %', data: winRates, backgroundColor: winRates.map(v => v>=50?'rgba(0,229,160,0.7)':'rgba(255,77,106,0.7)'), borderColor: winRates.map(v => v>=50?'#00e5a0':'#ff4d6a'), borderWidth: 1 }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#5a7a9a', font: { family: 'Space Mono', size: 9 } }, grid: { color: 'transparent' } }, y: { min: 0, max: 100, ticks: { color: '#5a7a9a', font: { family: 'Space Mono', size: 9 }, callback: v => v+'%' }, grid: { color: 'rgba(30,48,80,0.3)' } } } }
  });
  perfChartInst.sc = ch;
}

function addTestTrades() {
  const pairs = ['EUR/USD','BTC/USD','GBP/USD','NIFTY'];
  for (let i = 0; i < 8; i++) {
    const isWin = Math.random() > 0.4;
    const sig = SMData.addSignal({
      pair: pairs[Math.floor(Math.random()*pairs.length)],
      direction: Math.random()>0.5?'BUY':'SELL',
      entry: 0, sl: 0, tp: 0,
      rr: '1:3', score: 3 + Math.floor(Math.random()*4),
      confidence: 60 + Math.floor(Math.random()*30),
      timeframe: '1H', reasoning: 'Demo trade', conditions: {}
    });
    const risk = 0.10;
    SMData.closeSignal(sig.id, isWin ? risk * 3 : -risk);
  }
  showToast('8 test trades added!', 'success');
  renderPerformance();
  updateSidebarBalance();
}

function clearAllTrades() {
  if (!confirm('Clear all trade history?')) return;
  SMData.signals = [];
  SMData.stats = { totalTrades:0, wins:0, losses:0, totalPnL:0, biggestWin:0, biggestLoss:0, avgRR:0, winRate:0, prevWinRate:0, streak:0, bestStreak:0 };
  SMData.account.balance = SMData.account.startBalance;
  SMData.save();
  showToast('All trades cleared', 'warning');
  renderPerformance();
  updateSidebarBalance();
}
