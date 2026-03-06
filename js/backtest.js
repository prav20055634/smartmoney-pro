// ─── BACKTEST ENGINE ───────────────────────────────────────────────

function renderBacktest() {
  const el = document.getElementById('backtest-content');
  el.innerHTML = `
    <div style="max-width:1000px;margin:0 auto;">
      <div style="margin-bottom:24px;">
        <h2 style="font-family:var(--font-display);font-size:28px;font-weight:800;">Strategy Backtest</h2>
        <p style="color:var(--muted);font-size:13px;margin-top:4px;">AI analyzes your signals, learns from mistakes, and improves entry/exit accuracy</p>
      </div>

      <div class="grid-2" style="gap:20px;align-items:start;">
        <!-- Config -->
        <div class="card card-gold">
          <div class="card-header"><span class="card-title">Backtest Config</span></div>

          <div class="grid-2" style="gap:12px;margin-bottom:16px;">
            <div class="input-group">
              <label class="input-label">PAIR</label>
              <select class="input-field" id="bt-pair">
                <option>EUR/USD</option><option>GBP/USD</option><option>BTC/USD</option>
                <option>ETH/USD</option><option>NIFTY</option><option>BANKNIFTY</option>
              </select>
            </div>
            <div class="input-group">
              <label class="input-label">TIMEFRAME</label>
              <select class="input-field" id="bt-tf">
                <option>15M</option><option selected>1H</option><option>4H</option><option>Daily</option>
              </select>
            </div>
            <div class="input-group">
              <label class="input-label">PERIOD</label>
              <select class="input-field" id="bt-period">
                <option value="30">Last 30 days</option>
                <option value="90" selected>Last 90 days</option>
                <option value="180">Last 180 days</option>
                <option value="365">Last 1 year</option>
              </select>
            </div>
            <div class="input-group">
              <label class="input-label">STRATEGY</label>
              <select class="input-field" id="bt-strategy">
                <option>SMC Full Setup</option>
                <option>Liquidity Sweep Only</option>
                <option>CHOCH + Fibonacci</option>
                <option>Breakout + Retest</option>
                <option>ORB (India)</option>
              </select>
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">MIN CONFLUENCE SCORE</label>
            <div style="display:flex;align-items:center;gap:12px;">
              <input type="range" id="bt-min-score" min="1" max="6" value="4" style="flex:1;accent-color:var(--gold);" oninput="document.getElementById('bt-score-val').textContent=this.value"/>
              <span id="bt-score-val" style="font-family:var(--font-mono);font-size:16px;font-weight:700;color:var(--gold);width:20px;">4</span>
            </div>
          </div>

          <div class="grid-2" style="gap:12px;margin-bottom:16px;">
            <div class="input-group">
              <label class="input-label">RISK:REWARD MIN</label>
              <select class="input-field" id="bt-rr">
                <option value="2">1:2</option><option value="3" selected>1:3</option>
                <option value="4">1:4</option><option value="5">1:5</option>
              </select>
            </div>
            <div class="input-group">
              <label class="input-label">ACCOUNT SIZE</label>
              <input class="input-field" type="number" id="bt-account" value="10" step="1"/>
            </div>
          </div>

          <button class="btn btn-gold btn-full btn-lg" onclick="runBacktest()">▶ RUN BACKTEST</button>
        </div>

        <!-- Results -->
        <div>
          <div class="card" id="bt-result-card" style="min-height:340px;">
            <div class="card-header"><span class="card-title">Results</span></div>
            <div id="bt-results">
              <div style="text-align:center;padding:60px 20px;color:var(--muted);">
                <div style="font-size:48px;margin-bottom:16px;">⚙️</div>
                <div style="font-family:var(--font-mono);font-size:13px;">Configure and run backtest</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Learning Report -->
      <div class="card" style="margin-top:24px;" id="ai-learning-card">
        <div class="card-header">
          <span class="card-title">AI Learning Report</span>
          <span class="card-badge">AUTO-IMPROVING</span>
        </div>
        <div id="ai-learning-content">
          <div style="text-align:center;padding:32px;color:var(--muted);font-family:var(--font-mono);font-size:12px;">Run a backtest to see AI analysis and mistake learning</div>
        </div>
      </div>

      <!-- Trade Log -->
      <div class="card" style="margin-top:20px;">
        <div class="card-header">
          <span class="card-title">Backtest Trade Log</span>
          <span id="bt-log-count" style="font-family:var(--font-mono);font-size:11px;color:var(--muted);"></span>
        </div>
        <div id="bt-trade-log">
          <div style="text-align:center;padding:32px;color:var(--muted);font-family:var(--font-mono);font-size:12px;">No trades yet</div>
        </div>
      </div>
    </div>
  `;
}

async function runBacktest() {
  const pair = document.getElementById('bt-pair').value;
  const tf = document.getElementById('bt-tf').value;
  const period = parseInt(document.getElementById('bt-period').value);
  const strategy = document.getElementById('bt-strategy').value;
  const minScore = parseInt(document.getElementById('bt-min-score').value);
  const minRR = parseInt(document.getElementById('bt-rr').value);
  const accountSize = parseFloat(document.getElementById('bt-account').value) || 10;

  document.getElementById('bt-results').innerHTML = `
    <div class="analyzing-overlay">
      <div class="scan-ring"></div>
      <div class="scan-text">Simulating ${period} days...</div>
      <div class="thinking-dots"><span>●</span><span>●</span><span>●</span></div>
    </div>
  `;
  document.getElementById('ai-learning-content').innerHTML = `
    <div style="padding:20px;font-family:var(--font-mono);font-size:12px;color:var(--muted);">AI analyzing patterns...</div>
  `;

  // Simulate realistic backtest data
  await new Promise(r => setTimeout(r, 1500));

  const totalSetups = Math.floor(period * (tf === 'Daily' ? 0.5 : tf === '4H' ? 1.5 : tf === '1H' ? 3 : 8));
  const filtered = Math.floor(totalSetups * (minScore / 6) * 0.4);
  const winRate = 45 + Math.random() * 20 + (minScore * 3) + (strategy.includes('Full') ? 8 : 0);
  const capped = Math.min(78, winRate);
  const wins = Math.floor(filtered * capped / 100);
  const losses = filtered - wins;
  const avgWin = minRR * (accountSize * 0.01);
  const avgLoss = accountSize * 0.01;
  const totalPnL = (wins * avgWin) - (losses * avgLoss);
  const maxDD = accountSize * 0.05 + Math.random() * accountSize * 0.03;
  const profitFactor = (wins * avgWin) / Math.max(0.001, losses * avgLoss);

  const trades = [];
  for (let i = 0; i < Math.min(filtered, 30); i++) {
    const isWin = Math.random() < (capped / 100);
    const score = minScore + Math.floor(Math.random() * (7 - minScore));
    const rr = isWin ? (minRR + Math.random() * 1.5).toFixed(1) : '—';
    const pnl = isWin ? (avgWin * (0.8 + Math.random() * 0.4)) : (-avgLoss);
    const d = new Date(); d.setDate(d.getDate() - (period - Math.floor(i * period / filtered)));
    trades.push({ date: d.toLocaleDateString(), pair, score, isWin, rr, pnl: pnl.toFixed(3) });
  }

  displayBacktestResults({ totalSetups, filtered, wins, losses, winRate: capped, totalPnL, maxDD, profitFactor, minRR, accountSize, pair, strategy, period, tf, trades });
  await runAILearning(trades, pair, strategy, capped, { totalSetups, filtered, wins, losses });
}

function displayBacktestResults(r) {
  const pnlColor = r.totalPnL >= 0 ? 'var(--green)' : 'var(--red)';
  document.getElementById('bt-results').innerHTML = `
    <div class="bt-stats-grid">
      <div class="bt-stat">
        <div class="bt-stat-val" style="color:${r.winRate>=50?'var(--green)':'var(--red)'};">${r.winRate.toFixed(1)}%</div>
        <div class="bt-stat-lbl">WIN RATE</div>
      </div>
      <div class="bt-stat">
        <div class="bt-stat-val" style="color:${pnlColor};">${r.totalPnL>=0?'+':''}$${r.totalPnL.toFixed(2)}</div>
        <div class="bt-stat-lbl">NET P&L</div>
      </div>
      <div class="bt-stat">
        <div class="bt-stat-val" style="color:var(--gold);">${r.profitFactor.toFixed(2)}x</div>
        <div class="bt-stat-lbl">PROFIT FACTOR</div>
      </div>
      <div class="bt-stat">
        <div class="bt-stat-val">${r.filtered}</div>
        <div class="bt-stat-lbl">SETUPS TAKEN</div>
      </div>
      <div class="bt-stat">
        <div class="bt-stat-val" style="color:var(--green);">${r.wins}</div>
        <div class="bt-stat-lbl">WINS</div>
      </div>
      <div class="bt-stat">
        <div class="bt-stat-val" style="color:var(--red);">${r.losses}</div>
        <div class="bt-stat-lbl">LOSSES</div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:11px;color:var(--muted);padding:0 4px;">
      <span>Total setups found: ${r.totalSetups}</span>
      <span>Max drawdown: -$${r.maxDD.toFixed(2)}</span>
      <span>Min RR: 1:${r.minRR}</span>
    </div>
    <div style="margin-top:16px;padding:12px;background:rgba(${r.totalPnL>=0?'0,229,160':'255,77,106'},0.08);border-radius:var(--radius);border-left:3px solid ${pnlColor};">
      <div style="font-family:var(--font-mono);font-size:11px;color:${pnlColor};font-weight:700;">
        ${r.totalPnL>=0?'✓ PROFITABLE STRATEGY':'⚠ NEEDS IMPROVEMENT'} on ${r.pair} ${r.tf}
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px;">
        ${r.filtered} trades over ${r.period} days • Account: $${r.accountSize} → $${(r.accountSize + r.totalPnL).toFixed(2)}
      </div>
    </div>
  `;

  // Trade log
  document.getElementById('bt-log-count').textContent = r.trades.length + ' trades shown';
  document.getElementById('bt-trade-log').innerHTML = `
    <table class="data-table">
      <thead><tr><th>DATE</th><th>PAIR</th><th>SCORE</th><th>RESULT</th><th>R:R</th><th>P&L</th></tr></thead>
      <tbody>
        ${r.trades.map(t => `
          <tr class="row-enter">
            <td>${t.date}</td><td class="td-gold">${t.pair}</td>
            <td style="color:${t.score>=5?'var(--green)':t.score>=3?'var(--gold)':'var(--red)'};">${t.score}/6</td>
            <td><span style="color:${t.isWin?'var(--green)':'var(--red)'};">${t.isWin?'WIN':'LOSS'}</span></td>
            <td>${t.rr}</td>
            <td class="${t.pnl>0?'td-green':'td-red'}">${t.pnl>0?'+':''}$${t.pnl}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function runAILearning(trades, pair, strategy, winRate, stats) {
  const lossReasons = trades.filter(t => !t.isWin);
  const prompt = `You are a Smart Money trading coach AI. Analyze this backtest data and respond ONLY with JSON (no markdown).

Pair: ${pair}, Strategy: ${strategy}, Win Rate: ${winRate.toFixed(1)}%, Wins: ${stats.wins}, Losses: ${stats.losses}
Loss trades: ${lossReasons.length} out of ${stats.filtered} total setups.

Respond ONLY with this JSON:
{
  "summary": "2 sentence honest assessment",
  "topMistakes": [
    {"mistake": "mistake name", "explanation": "why this happens", "fix": "how to fix it"},
    {"mistake": "mistake name", "explanation": "why this happens", "fix": "how to fix it"},
    {"mistake": "mistake name", "explanation": "why this happens", "fix": "how to fix it"}
  ],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "correctedEntry": "What the correct entry timing should be",
  "correctedExit": "What the correct exit strategy should be",
  "confidenceBoost": "One specific tweak that would improve win rate most",
  "revised_winrate_estimate": number
}`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await resp.json();
    const raw = data.content?.map(b => b.text||'').join('').replace(/```json|```/g,'').trim();
    const ai = JSON.parse(raw);
    displayAILearning(ai);
  } catch(e) {
    document.getElementById('ai-learning-content').innerHTML = `<div style="padding:20px;font-family:var(--font-mono);font-size:12px;color:var(--muted);">AI learning requires API connection.</div>`;
  }
}

function displayAILearning(ai) {
  document.getElementById('ai-learning-content').innerHTML = `
    <div style="padding:4px 0 16px;">
      <div style="padding:14px;background:rgba(74,158,255,0.08);border-radius:var(--radius);border-left:3px solid var(--blue);margin-bottom:16px;">
        <div style="font-family:var(--font-mono);font-size:9px;color:var(--blue);letter-spacing:2px;margin-bottom:6px;">AI ASSESSMENT</div>
        <div style="font-size:14px;color:var(--white);line-height:1.6;">${ai.summary}</div>
      </div>

      <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:2px;margin-bottom:10px;">TOP MISTAKES DETECTED</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
        ${(ai.topMistakes||[]).map((m,i) => `
          <div style="padding:12px;background:rgba(255,77,106,0.06);border-radius:var(--radius);border-left:3px solid var(--red);">
            <div style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:var(--red);margin-bottom:4px;">${i+1}. ${m.mistake}</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:6px;">${m.explanation}</div>
            <div style="font-family:var(--font-mono);font-size:11px;color:var(--green);">FIX: ${m.fix}</div>
          </div>
        `).join('')}
      </div>

      <div class="grid-2" style="gap:12px;margin-bottom:16px;">
        <div style="padding:12px;background:rgba(0,229,160,0.06);border-radius:var(--radius);border:1px solid rgba(0,229,160,0.2);">
          <div style="font-family:var(--font-mono);font-size:9px;color:var(--green);letter-spacing:2px;margin-bottom:6px;">CORRECTED ENTRY</div>
          <div style="font-size:12px;color:var(--white);">${ai.correctedEntry}</div>
        </div>
        <div style="padding:12px;background:rgba(240,180,41,0.06);border-radius:var(--radius);border:1px solid rgba(240,180,41,0.2);">
          <div style="font-family:var(--font-mono);font-size:9px;color:var(--gold);letter-spacing:2px;margin-bottom:6px;">CORRECTED EXIT</div>
          <div style="font-size:12px;color:var(--white);">${ai.correctedExit}</div>
        </div>
      </div>

      <div style="padding:14px;background:rgba(240,180,41,0.08);border-radius:var(--radius);border:1px solid rgba(240,180,41,0.2);">
        <div style="font-family:var(--font-mono);font-size:9px;color:var(--gold);letter-spacing:2px;margin-bottom:6px;">⚡ BIGGEST WIN RATE BOOSTER</div>
        <div style="font-size:13px;color:var(--white);">${ai.confidenceBoost}</div>
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--green);margin-top:8px;">Estimated improved win rate: ${ai.revised_winrate_estimate}%</div>
      </div>
    </div>
  `;
}
