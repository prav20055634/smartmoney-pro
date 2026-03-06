// ─── API LAYER — talks to the real backend server ──────────────────
// Auto-detects if running locally or deployed globally

const API = (() => {
  // When deployed to Railway/Render, this page IS served from the backend
  // So all API calls go to the same origin — works globally from any network
  const BASE = window.location.origin;

  async function get(path) {
    try {
      const r = await fetch(BASE + path);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      console.error('[API GET]', path, e.message);
      return null;
    }
  }

  async function post(path, body) {
    try {
      const r = await fetch(BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      console.error('[API POST]', path, e.message);
      return null;
    }
  }

  return {
    // ── Real market prices ───────────────────────────
    async prices()    { return await get('/api/prices'); },

    // ── Session info (which sessions active now) ─────
    async session()   { return await get('/api/session'); },

    // ── Auto-generated SMC signals for all 3 sessions ─
    async sessionSignals(account = 10) {
      return await get(`/api/signals/session?account=${account}`);
    },

    // ── Saved signals (user's trade history) ────────
    async savedSignals() { return await get('/api/signals/saved'); },

    // ── Stats + account balance ──────────────────────
    async stats()     { return await get('/api/stats'); },

    // ── Health check ─────────────────────────────────
    async health()    { return await get('/api/health'); },

    // ── Save a signal ────────────────────────────────
    async saveSignal(sig)   { return await post('/api/signals/save', sig); },

    // ── Close a signal (WIN/LOSS) ────────────────────
    async closeSignal(id, result) {
      return await post('/api/signals/close', { id, result });
    },

    // ── Update account ───────────────────────────────
    async updateAccount(data) { return await post('/api/account', data); },

    // ── AI chart analysis via backend proxy ──────────
    // The backend proxies to Anthropic so it works cross-origin
    async analyzeChart(imageBase64, mediaType, prompt) {
      return await post('/api/proxy/anthropic', {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text',  text: prompt }
          ]
        }]
      });
    },

    // ── AI text query via backend proxy ──────────────
    async ai(prompt) {
      return await post('/api/proxy/anthropic', {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      });
    }
  };
})();

// ─── PRICE STORE — live prices cached in memory ─────────────────────
const Prices = {
  data: {},
  changes: {},
  lastFetch: 0,

  async refresh() {
    const r = await API.prices();
    if (r && r.prices) {
      this.data    = r.prices;
      this.changes = r.changes || {};
      this.lastFetch = Date.now();
      this._broadcast();
    }
    return r;
  },

  get(pair)    { return this.data[pair] || 0; },
  chg(pair)    { return this.changes[pair] || 0; },

  fmt(pair) {
    const p = this.get(pair);
    if (!p) return '—';
    if (p > 10000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (p > 100)   return p.toFixed(2);
    if (p > 10)    return p.toFixed(3);
    return p.toFixed(5);
  },

  _listeners: [],
  on(fn)       { this._listeners.push(fn); },
  _broadcast() { this._listeners.forEach(fn => fn(this.data, this.changes)); },
};

// ─── SESSION STORE ───────────────────────────────────────────────────
const Session = {
  data: {},

  async refresh() {
    const r = await API.session();
    if (r) {
      this.data = r;
      this._broadcast();
    }
    return r;
  },

  isActive(name) { return (this.data.active || []).includes(name); },
  isOverlap()    { return this.data.overlap || false; },
  utc()          { return this.data.utc || '—'; },
  active()       { return this.data.active || []; },

  _listeners: [],
  on(fn)         { this._listeners.push(fn); },
  _broadcast()   { this._listeners.forEach(fn => fn(this.data)); },
};
