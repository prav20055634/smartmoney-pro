// ─── DATA STORE ─────────────────────────────────────────────────────

const Store = {
  account: { balance: 10, startBalance: 10, riskPct: 1 },
  stats:   { totalTrades:0,wins:0,losses:0,totalPnL:0,
             winRate:0,prevWinRate:0,streak:0,bestStreak:0,
             biggestWin:0,biggestLoss:0 },
  signals: [],

  async load() {
    const r = await API.stats();
    if (r?.ok) {
      this.account = r.account || this.account;
      this.stats   = r.stats   || this.stats;
    }
    const s = await API.savedSignals();
    if (s?.ok) this.signals = s.signals || [];
    updateSidebarBalance();
  },

  async saveSignal(sig) {
    const r = await API.saveSignal(sig);
    if (r?.ok) {
      this.signals.unshift(r.signal);
      return r.signal;
    }
    return null;
  },

  async closeSignal(id, result) {
    const r = await API.closeSignal(id, result);
    if (r?.ok) {
      this.stats   = r.stats;
      this.account = r.account;
      const sig = this.signals.find(s => s.id === id);
      if (sig) {
        sig.status = result > 0 ? 'WIN' : 'LOSS';
        sig.pnl    = result;
      }
      updateSidebarBalance();
      return r;
    }
    return null;
  },

  riskUSD() { return this.account.balance * (this.account.riskPct / 100); },
  openSignals()  { return this.signals.filter(s => s.status === 'OPEN'); },
  closedSignals(){ return this.signals.filter(s => s.status !== 'OPEN'); },
};
