// ─── AI CHART ANALYZER ───────────────────────────────────────────────

function renderAnalyzer() {
  const el = document.getElementById('pg-analyzer');
  el.innerHTML = `
    <div style="max-width:960px;margin:0 auto;">
      <div style="margin-bottom:24px;">
        <h2 style="font-family:var(--display);font-size:28px;font-weight:800;">
          <span class="shimmer">AI Chart Analyzer</span>
        </h2>
        <p style="color:var(--muted);font-size:14px;margin-top:6px;">Upload a screenshot → Claude checks all 6 SMC conditions → gives Entry, SL, TP for your $${Store.account.balance.toFixed(2)}</p>
      </div>

      <div class="g2" style="gap:24px;align-items:start;">
        <!-- Left: upload + config -->
        <div>
          <div class="card gold" style="margin-bottom:18px;">
            <div class="card-hdr"><span class="card-ttl">Upload Chart</span><span class="badge">CLAUDE AI</span></div>
            <div class="upload-zone" id="drop-zone" onclick="document.getElementById('chart-input').click()">
              <input type="file" id="chart-input" accept="image/*" style="display:none" onchange="onChartFile(event)"/>
              <span class="upload-icon">📊</span>
              <div class="upload-ttl">Drop Chart Screenshot</div>
              <div class="upload-sub">Any broker · Any timeframe · PNG / JPG<br/>TradingView, Zerodha, Binance, MT4/5</div>
            </div>
            <div id="chart-preview" style="display:none;margin-top:14px;">
              <img id="preview-img" style="width:100%;border-radius:var(--r);border:1px solid var(--border2);"/>
              <button class="btn btn-gold btn-full" style="margin-top:10px;" onclick="runAnalysis()">
                ⬡ ANALYZE WITH AI
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-hdr"><span class="card-ttl">Trade Config</span></div>
            <div class="g2" style="gap:10px;">
              <div><label class="lbl">PAIR</label>
                <select class="inp" id="an-pair">
                  <option>EUR/USD</option><option>GBP/USD</option><option>USD/JPY</option>
                  <option>GBP/JPY</option><option>AUD/USD</option><option>USD/CAD</option>
                  <option>BTC/USD</option><option>ETH/USD</option><option>SOL/USD</option>
                  <option>NIFTY</option><option>BANKNIFTY</option>
                </select>
              </div>
              <div><label class="lbl">TIMEFRAME</label>
                <select class="inp" id="an-tf">
                  <option>5M</option><option>15M</option><option selected>1H</option>
                  <option>4H</option><option>Daily</option>
                </select>
              </div>
              <div><label class="lbl">SESSION</label>
                <select class="inp" id="an-session">
                  <option>London</option><option>New York</option>
                  <option>Tokyo</option><option>India NSE</option>
                </select>
              </div>
              <div><label class="lbl">ACCOUNT (USD)</label>
                <input class="inp" type="number" id="an-account" value="${Store.account.balance.toFixed(2)}" step="0.01"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: result -->
        <div>
          <div class="card" id="result-card" style="min-height:420px;">
            <div class="card-hdr"><span class="card-ttl">Analysis Result</span></div>
            <div id="result-body">
              <div class="no-signal">
                <div class="icon">🔍</div>
                <div class="msg">Upload a chart to begin</div>
                <div class="sub">AI checks 6 SMC confluence factors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Drag & drop
  const zone = document.getElementById('drop-zone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag');
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) loadPreview(f);
  });
}

let imgB64 = null, imgMime = null;

function onChartFile(e) {
  const f = e.target.files[0];
  if (f) loadPreview(f);
}

function loadPreview(file) {
  imgMime = file.type;
  const reader = new FileReader();
  reader.onload = ev => {
    imgB64 = ev.target.result.split(',')[1];
    document.getElementById('preview-img').src = ev.target.result;
    document.getElementById('chart-preview').style.display = 'block';
    document.getElementById('drop-zone').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

async function runAnalysis() {
  if (!imgB64) { toast('Upload a chart first','warn'); return; }
  const pair    = document.getElementById('an-pair').value;
  const tf      = document.getElementById('an-tf').value;
  const session = document.getElementById('an-session').value;
  const account = parseFloat(document.getElementById('an-account').value) || 10;

  document.getElementById('result-body').innerHTML = `
    <div style="text-align:center;padding:60px 20px;">
      <div class="spin" style="margin:0 auto 20px;"></div>
      <div style="font-family:var(--mono);font-size:13px;color:var(--gold);">Analyzing Chart...</div>
      <div class="thinking" style="margin-top:12px;justify-content:center;">
        <span></span><span></span><span></span>
      </div>
      <div style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:16px;line-height:2;">
        Checking: Market Structure · Liquidity Sweep · CHOCH<br/>
        Fibonacci OTE · Order Block · Volume
      </div>
    </div>`;

  const prompt = buildAnalysisPrompt(pair, tf, session, account);
  const resp   = await API.analyzeChart(imgB64, imgMime || 'image/png', prompt);

  if (!resp || resp.error) {
    document.getElementById('result-body').innerHTML = `
      <div class="no-signal">
        <div class="icon">⚠️</div>
        <div class="msg" style="color:var(--red);">Analysis failed</div>
        <div class="sub">${resp?.error || 'Check your connection and try again'}</div>
      </div>`;
    return;
  }

  try {
    const raw = resp.content?.map(b => b.text || '').join('')
                  .replace(/```json|```/g, '').trim();
    const result = JSON.parse(raw);
    showResult(result, account, pair);

    if (result.signal !== 'NO_TRADE' && result.score >= 4) {
      const saved = await Store.saveSignal({
        ...result, pair, timeframe: tf, session,
        status: 'OPEN', timestamp: new Date().toISOString(),
      });
      if (saved) toast(`${result.signal} signal saved! Score: ${result.score}/6`, 'ok');
    }
  } catch (e) {
    document.getElementById('result-body').innerHTML = `
      <div class="no-signal">
        <div class="icon">⚠️</div>
        <div class="msg" style="color:var(--red);">Could not parse AI response</div>
        <div class="sub">Try again with a clearer chart image</div>
      </div>`;
  }
}

function buildAnalysisPrompt(pair, tf, session, account) {
  const risk = (account * 0.01).toFixed(4);
  return `You are an expert Smart Money Concepts (SMC) trading analyst.
Analyze the chart image and respond ONLY with a valid JSON object — no markdown, no explanation.

Trader account: $${account}. Risk per trade: 1% = $${risk}. Pair: ${pair}. Timeframe: ${tf}. Session: ${session}.

Check ALL conditions:
1. Market Structure: HH/HL uptrend OR LL/LH downtrend on visible timeframe
2. Liquidity Sweep: recent spike above/below equal highs/lows, PDH, PDL, trendline — then close back inside
3. CHOCH: break of last HL (in uptrend) or LH (in downtrend) confirming reversal
4. Fibonacci OTE: price in 0.618–0.786 retracement zone from last swing
5. Order Block: last opposite candle before impulse move visible
6. Volume/Momentum: volume spike or momentum confirmation on CHOCH candle

Return ONLY this JSON:
{
  "signal": "BUY" | "SELL" | "NO_TRADE",
  "confidence": 0-100,
  "score": 0-6,
  "entry": number_or_null,
  "sl": number_or_null,
  "tp1": number_or_null,
  "tp2": number_or_null,
  "tp3": number_or_null,
  "rr1": "1:X" or null,
  "rr2": "1:X" or null,
  "sl_pips": number_or_null,
  "position_size": { "display": "X micro lots (risk $Y)" },
  "conditions": {
    "marketStructure": { "met": bool, "detail": "brief note" },
    "liquiditySweep":  { "met": bool, "detail": "brief note" },
    "choch":           { "met": bool, "detail": "brief note" },
    "fibonacci":       { "met": bool, "detail": "brief note" },
    "orderBlock":      { "met": bool, "detail": "brief note" },
    "volume":          { "met": bool, "detail": "brief note" }
  },
  "reasoning": "2-3 sentences explaining the setup",
  "warning": "any risk warning" or null
}`;
}

function showResult(r, account, pair) {
  const dir   = r.signal;
  const score = r.score || 0;
  const circ  = 283;
  const off   = circ - (score / 6) * circ;
  const sc    = score >= 5 ? 'var(--green)' : score >= 4 ? 'var(--gold)' : 'var(--red)';
  const dc    = dir === 'BUY' ? 'var(--green)' : dir === 'SELL' ? 'var(--red)' : 'var(--muted)';

  const condKeys = ['marketStructure','liquiditySweep','choch','fibonacci','orderBlock','volume'];
  const condLbls = ['Market Structure','Liquidity Sweep','CHOCH','Fibonacci OTE','Order Block','Volume'];

  document.getElementById('result-body').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div>
        <div style="font-family:var(--display);font-size:28px;font-weight:800;color:${dc};">${dir}</div>
        <div style="font-family:var(--mono);font-size:11px;color:var(--muted);">${pair}</div>
      </div>
      <div style="text-align:center;">
        <div class="score-ring-wrap">
          <svg class="score-ring" width="80" height="80" viewBox="0 0 100 100">
            <circle class="score-bg" cx="50" cy="50" r="45"/>
            <circle class="score-fill" cx="50" cy="50" r="45" stroke="${sc}"
              stroke-dasharray="${circ}" stroke-dashoffset="${off}"/>
          </svg>
          <div class="score-num" style="color:${sc};">${score}/6</div>
        </div>
        <div class="score-sub">CONFLUENCE</div>
      </div>
    </div>

    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;color:var(--muted);margin-bottom:5px;">
        <span>CONFIDENCE</span><span style="color:${dc};">${r.confidence}%</span></div>
      <div class="prog"><div class="prog-fill ${dir==='BUY'?'green':dir==='SELL'?'red':'gold'}" style="width:${r.confidence}%;"></div></div>
    </div>

    ${dir !== 'NO_TRADE' && r.entry ? `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
      ${[['ENTRY',r.entry,'entry'],['STOP LOSS',r.sl,'sl'],['TP1',r.tp1,'tp']].map(([l,v,c])=>`
        <div class="sig-level"><div class="sig-level-lbl">${l}</div>
          <div class="sig-level-val ${c}">${v||'—'}</div></div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
      <div class="sig-level"><div class="sig-level-lbl">TP2 (${r.rr2||'—'})</div>
        <div class="sig-level-val tp">${r.tp2||'—'}</div></div>
      <div class="sig-level"><div class="sig-level-lbl">TP3 (1:5)</div>
        <div class="sig-level-val tp">${r.tp3||'—'}</div></div>
    </div>
    <div style="padding:10px 14px;background:rgba(240,180,41,.07);border-radius:8px;border:1px solid rgba(240,180,41,.2);margin-bottom:12px;">
      <div style="font-family:var(--mono);font-size:9px;color:var(--muted);letter-spacing:2px;">POSITION SIZE ($${account})</div>
      <div style="font-family:var(--mono);font-size:13px;color:var(--gold);font-weight:700;margin-top:4px;">${r.position_size?.display||'See sizing guide'}</div>
    </div>` : ''}

    <div style="font-family:var(--mono);font-size:9px;color:var(--muted);letter-spacing:2px;margin-bottom:7px;">CONDITIONS</div>
    <div style="margin-bottom:12px;">
      ${condKeys.map((k,i) => {
        const c = r.conditions?.[k];
        return `<div class="cond-row ${c?.met?'met':'not'}">
          <span class="cond-icon" style="color:${c?.met?'var(--green)':'var(--red)'};">${c?.met?'✓':'✗'}</span>
          <span class="cond-name">${condLbls[i]}</span>
          <span class="cond-detail">${c?.detail||''}</span>
        </div>`;
      }).join('')}
    </div>

    <div style="padding:10px 12px;background:rgba(74,158,255,.06);border-radius:var(--r);border-left:3px solid var(--blue);margin-bottom:10px;">
      <div style="font-family:var(--mono);font-size:9px;color:var(--blue);letter-spacing:2px;margin-bottom:4px;">AI ANALYSIS</div>
      <div style="font-size:13px;line-height:1.6;">${r.reasoning}</div>
    </div>

    ${r.warning ? `<div style="padding:10px 12px;background:rgba(255,77,106,.08);border-radius:var(--r);border-left:3px solid var(--red);margin-bottom:10px;">
      <div style="font-family:var(--mono);font-size:9px;color:var(--red);letter-spacing:2px;margin-bottom:3px;">⚠ WARNING</div>
      <div style="font-size:12px;color:var(--muted);">${r.warning}</div>
    </div>` : ''}

    ${score < 4 ? `<div style="padding:10px 12px;background:rgba(255,77,106,.08);border-radius:var(--r);font-family:var(--mono);font-size:12px;color:var(--red);">
      ⚠ Score ${score}/6 — DO NOT trade this. Wait for score 4 or higher.</div>` : ''}
  `;
}
