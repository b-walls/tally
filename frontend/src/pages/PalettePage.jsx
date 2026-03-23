export default function PalettePage() {
  return (
    <div className="min-h-screen bg-background text-text p-10 space-y-16 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold text-text">Tally — Component Reference</h1>

      {/* ── Colors ───────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Colors</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            ['background',    'bg-background'],
            ['surface',       'bg-surface'],
            ['surface-raised','bg-surface-raised'],
            ['border',        'bg-border'],
            ['primary',       'bg-primary'],
            ['primary-muted', 'bg-primary-muted'],
            ['text',          'bg-text'],
            ['text-muted',    'bg-text-muted'],
            ['success',       'bg-success'],
            ['warning',       'bg-warning'],
            ['danger',        'bg-danger'],
          ].map(([label, cls]) => (
            <div key={label} className="flex items-center gap-3 bg-surface border border-border rounded-lg p-3">
              <div className={`${cls} w-8 h-8 rounded-md shrink-0 border border-border`} />
              <span className="text-xs font-mono text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Typography ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Typography</h2>
        <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
          <p className="text-3xl font-bold text-text">Page Heading</p>
          <p className="text-xl font-semibold text-text">Section Heading</p>
          <p className="text-base text-text">Body text — regular content goes here.</p>
          <p className="text-sm text-text-muted">Label / hint / secondary info</p>
          <p className="text-xs font-mono text-text-muted">Mono — amounts, dates, codes</p>
          <p className="text-sm text-primary cursor-pointer hover:underline">Link / action text</p>
        </div>
      </section>

      {/* ── Buttons ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Buttons</h2>
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-wrap gap-3">
          <button className="bg-primary hover:bg-primary-hover text-background font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
            Primary
          </button>
          <button className="bg-surface-raised hover:bg-border text-text border border-border px-5 py-2 rounded-lg text-sm transition-colors">
            Secondary
          </button>
          <button className="bg-transparent hover:bg-primary-muted text-primary border border-primary/30 px-5 py-2 rounded-lg text-sm transition-colors">
            Outline
          </button>
          <button className="bg-transparent hover:bg-surface-raised text-text-muted px-5 py-2 rounded-lg text-sm transition-colors">
            Ghost
          </button>
          <button className="bg-danger/15 hover:bg-danger/25 text-danger px-5 py-2 rounded-lg text-sm transition-colors">
            Danger
          </button>
          <button disabled className="bg-surface-raised text-text-muted px-5 py-2 rounded-lg text-sm cursor-not-allowed opacity-50">
            Disabled
          </button>
        </div>
      </section>

      {/* ── Inputs ───────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Inputs</h2>
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4 max-w-sm">
          <div className="space-y-1">
            <label className="text-sm text-text-muted">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-surface-raised border border-border text-text placeholder:text-text-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-text-muted">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-surface-raised border border-border text-text placeholder:text-text-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-text-muted">Error state</label>
            <input
              placeholder="Invalid input"
              className="w-full bg-surface-raised border border-danger text-text placeholder:text-text-muted rounded-lg px-4 py-2.5 text-sm outline-none"
            />
            <p className="text-xs text-danger">This field is required.</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-text-muted">Select</label>
            <select className="w-full bg-surface-raised border border-border text-text rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Badges ───────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Badges / Tags</h2>
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-wrap gap-2">
          <span className="bg-primary-muted text-primary text-xs font-medium px-3 py-1 rounded-full">Groceries</span>
          <span className="bg-primary-muted text-primary text-xs font-medium px-3 py-1 rounded-full">Dining</span>
          <span className="bg-surface-raised text-text-muted text-xs font-medium px-3 py-1 rounded-full border border-border">Transport</span>
          <span className="bg-success/15 text-success text-xs font-medium px-3 py-1 rounded-full">Confirmed</span>
          <span className="bg-warning/15 text-warning text-xs font-medium px-3 py-1 rounded-full">Pending</span>
          <span className="bg-danger/15 text-danger text-xs font-medium px-3 py-1 rounded-full">Over budget</span>
        </div>
      </section>

      {/* ── Feedback ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Alerts</h2>
        <div className="space-y-3">
          <div className="bg-success/10 border border-success/25 text-success rounded-lg px-4 py-3 text-sm">Receipt scanned successfully.</div>
          <div className="bg-warning/10 border border-warning/25 text-warning rounded-lg px-4 py-3 text-sm">You are close to your grocery budget.</div>
          <div className="bg-danger/10  border border-danger/25  text-danger  rounded-lg px-4 py-3 text-sm">Login failed. Check your credentials.</div>
        </div>
      </section>

      {/* ── Budget Card ──────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Budget Card</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Groceries',    spent: 42,  limit: 100 },
            { label: 'Dining',       spent: 95,  limit: 100 },
            { label: 'Transport',    spent: 20,  limit: 60  },
            { label: 'Shopping',     spent: 10,  limit: 80  },
          ].map(({ label, spent, limit }) => {
            const pct = Math.min((spent / limit) * 100, 100)
            const color = pct >= 90 ? 'bg-danger' : pct >= 70 ? 'bg-warning' : 'bg-primary'
            return (
              <div key={label} className="bg-surface border border-border rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text">{label}</span>
                  <span className="text-xs font-mono text-text-muted">${spent} / ${limit}</span>
                </div>
                <div className="w-full bg-surface-raised rounded-full h-1.5">
                  <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-text-muted">${limit - spent} remaining</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Receipt Row ──────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Receipt List</h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {[
            { merchant: 'Whole Foods',   date: 'Mar 20', total: '$64.32', category: 'Groceries' },
            { merchant: 'Uber Eats',     date: 'Mar 19', total: '$28.50', category: 'Dining'    },
            { merchant: 'Shell Gas',     date: 'Mar 18', total: '$55.00', category: 'Transport' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-border last:border-none hover:bg-surface-raised transition-colors cursor-pointer">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-text">{r.merchant}</p>
                <p className="text-xs text-text-muted">{r.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary-muted text-primary text-xs px-2.5 py-1 rounded-full">{r.category}</span>
                <span className="text-sm font-mono text-text">{r.total}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Empty State ──────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Empty State</h2>
        <div className="bg-surface border border-border rounded-xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-muted text-xl">
            ✕
          </div>
          <p className="text-text font-medium">No receipts yet</p>
          <p className="text-sm text-text-muted">Scan your first receipt to get started.</p>
          <button className="mt-2 bg-primary hover:bg-primary-hover text-background font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
            Scan Receipt
          </button>
        </div>
      </section>

      {/* ── Loading ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-text-muted text-xs uppercase tracking-widest">Loading</h2>
        <div className="bg-surface border border-border rounded-xl p-6 flex items-center gap-6">
          <div className="w-6 h-6 rounded-full border-2 border-border border-t-primary animate-spin" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-surface-raised rounded-full w-1/2 animate-pulse" />
            <div className="h-3 bg-surface-raised rounded-full w-3/4 animate-pulse" />
          </div>
        </div>
      </section>

    </div>
  )
}