// Sales Dashboard — pipeline metrics, conversion funnel, activity overview, top deals
// Reads from atlas store. Pure-read view (no mutations).

const { useState: useStateSD, useMemo: useMemoSD } = React;

function SalesDashboard({ store, api, onOpenClient, onGotoPipeline }) {
  const stages = window.UC_STAGES || [];
  const openStages = stages.filter(s => s.kind === 'open');
  const wonStages  = stages.filter(s => s.kind === 'won');
  const lostStages = stages.filter(s => s.kind === 'lost');

  const clients = store.clients || [];

  // ---- aggregates ----
  const enriched = useMemoSD(() => clients.map(c => ({
    ...c,
    _stage: window.ucMigrateStage ? window.ucMigrateStage(c.stage) : c.stage,
    _stageMeta: stages.find(s => s.id === (window.ucMigrateStage ? window.ucMigrateStage(c.stage) : c.stage)) || stages[0],
    _value: window.spDealValue ? window.spDealValue(c.deal) : 0,
    _weighted: (window.spDealValue ? window.spDealValue(c.deal) : 0) * ((c.deal?.probability || 0) / 100),
    _daysSinceContact: c.lastContact ? Math.floor((Date.now() - new Date(c.lastContact).getTime()) / 86400000) : null,
    _openTasks: (c.tasks || []).filter(t => !t.done).length,
    _overdueTasks: (c.tasks || []).filter(t => !t.done && t.due && new Date(t.due) < new Date()).length,
    _activitiesCount: (c.activities || []).length,
  })), [clients, stages]);

  const openDeals = enriched.filter(c => c._stageMeta?.kind === 'open');
  const wonDeals  = enriched.filter(c => c._stageMeta?.kind === 'won');
  const lostDeals = enriched.filter(c => c._stageMeta?.kind === 'lost');

  const totalOpenValue = openDeals.reduce((s, c) => s + c._value, 0);
  const weightedPipeline = openDeals.reduce((s, c) => s + c._weighted, 0);
  const totalWon = wonDeals.reduce((s, c) => s + c._value, 0);
  const totalLost = lostDeals.reduce((s, c) => s + c._value, 0);

  // Conversion: won / (won + lost)
  const winRate = (wonDeals.length + lostDeals.length) > 0
    ? Math.round(wonDeals.length / (wonDeals.length + lostDeals.length) * 100)
    : null;

  // Avg deal size (won only, fallback to overall if no wins)
  const avgWonValue = wonDeals.length > 0
    ? Math.round(totalWon / wonDeals.length)
    : (openDeals.filter(c => c._value > 0).length > 0
        ? Math.round(totalOpenValue / openDeals.filter(c => c._value > 0).length)
        : 0);

  // ---- activity (last 30 days) ----
  const allActivities = useMemoSD(() => {
    const all = [];
    clients.forEach(c => {
      (c.activities || []).forEach(a => {
        all.push({ ...a, clientUid: c.uid, clientName: c.name });
      });
    });
    return all.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [clients]);

  const last30Activities = useMemoSD(() => {
    const cutoff = Date.now() - 30 * 86400000;
    return allActivities.filter(a => a.date && new Date(a.date).getTime() >= cutoff);
  }, [allActivities]);

  const byType = useMemoSD(() => {
    const m = new Map();
    (window.UC_ACTIVITY_TYPES || []).forEach(t => m.set(t.id, 0));
    last30Activities.forEach(a => m.set(a.type, (m.get(a.type) || 0) + 1));
    return m;
  }, [last30Activities]);

  // ---- alerts ----
  const stagnantDeals = openDeals.filter(c => c._daysSinceContact !== null && c._daysSinceContact > 14)
    .sort((a, b) => b._daysSinceContact - a._daysSinceContact);
  const overdueClients = enriched.filter(c => c._overdueTasks > 0);

  const topOpenDeals = [...openDeals]
    .filter(c => c._value > 0)
    .sort((a, b) => b._value - a._value)
    .slice(0, 5);

  // ---- recent wins ----
  const recentWins = useMemoSD(() => {
    return [...wonDeals].sort((a, b) => (b.lastContact || '').localeCompare(a.lastContact || '')).slice(0, 4);
  }, [wonDeals]);

  return (
    <div style={{ padding: '24px 32px 60px', background: 'oklch(0.985 0.003 240)', minHeight: '100%' }}>
      {/* ===== KPI ROW ===== */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22,
      }}>
        <KpiCard
          eyebrow="Pipeline · مفتوح"
          value={window.spFmtCurrency(totalOpenValue)}
          unit="ر.س"
          sub={`${openDeals.length} صفقة`}
          accent="oklch(0.55 0.15 220)"
          big
        />
        <KpiCard
          eyebrow="مرجّح بالاحتمالية"
          value={window.spFmtCurrency(weightedPipeline)}
          unit="ر.س"
          sub={`متوقّع · ${Math.round((weightedPipeline / (totalOpenValue || 1)) * 100)}%`}
          accent="oklch(0.55 0.15 145)"
        />
        <KpiCard
          eyebrow="فائزة"
          value={String(wonDeals.length)}
          sub={window.spFmtCurrency(totalWon) + ' ر.س'}
          accent="oklch(0.55 0.18 145)"
        />
        <KpiCard
          eyebrow="معدّل النجاح"
          value={winRate !== null ? `${winRate}%` : '—'}
          sub={winRate !== null
            ? `${wonDeals.length} ربح · ${lostDeals.length} خسارة`
            : 'لا قرارات بعد'}
          accent="oklch(0.55 0.16 30)"
        />
      </div>

      {/* ===== FUNNEL + ACTIVITY ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 22 }}>
        <FunnelChart
          stages={openStages}
          enriched={enriched}
          totalCount={openDeals.length}
          onClickStage={onGotoPipeline}
        />
        <ActivityPanel
          types={window.UC_ACTIVITY_TYPES || []}
          byType={byType}
          totalCount={last30Activities.length}
        />
      </div>

      {/* ===== TOP DEALS + RECENT WINS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 22 }}>
        <TopDealsCard deals={topOpenDeals} avgWonValue={avgWonValue} onOpenClient={onOpenClient} />
        <RecentWinsCard deals={recentWins} onOpenClient={onOpenClient} />
      </div>

      {/* ===== ALERTS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <AlertsCard
          title="صفقات راكدة"
          subtitle="أكثر من 14 يوم بدون تواصل"
          icon="⚠"
          hue={30}
          deals={stagnantDeals.slice(0, 5)}
          render={(c) => (
            <span className="mono" style={{ fontSize: 11, color: 'oklch(0.5 0.18 30)', fontWeight: 600 }}>
              {c._daysSinceContact} يوم
            </span>
          )}
          emptyText="ممتاز — لا توجد صفقات راكدة"
          onOpenClient={onOpenClient}
        />
        <AlertsCard
          title="مهام متأخرة"
          subtitle="مهام مفتوحة تجاوز موعدها"
          icon="◐"
          hue={350}
          deals={overdueClients.slice(0, 5)}
          render={(c) => (
            <span style={{
              fontSize: 10.5, padding: '2px 8px', borderRadius: 999,
              background: 'oklch(0.96 0.05 350)', color: 'oklch(0.45 0.2 350)', fontWeight: 600,
            }}>
              {c._overdueTasks} مهمة
            </span>
          )}
          emptyText="لا مهام متأخرة"
          onOpenClient={onOpenClient}
        />
      </div>
    </div>
  );
}

// =========================================================
// Sub-components
// =========================================================
function KpiCard({ eyebrow, value, unit, sub, accent, big }) {
  return (
    <div style={{
      padding: '16px 18px', background: '#fff', borderRadius: 14, border: '1px solid var(--line)',
      borderTop: `3px solid ${accent}`, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        fontSize: 9.5, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase',
        color: 'var(--muted)',
      }}>{eyebrow}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
        <div className="mono" style={{
          fontSize: big ? 28 : 24, fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.5, lineHeight: 1.1,
        }}>{value}</div>
        {unit && <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>{unit}</div>}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function FunnelChart({ stages, enriched, totalCount, onClickStage }) {
  // Count + value per stage
  const data = stages.map(s => {
    const list = enriched.filter(c => c._stage === s.id);
    return {
      ...s,
      count: list.length,
      value: list.reduce((sum, c) => sum + c._value, 0),
    };
  });
  const maxCount = Math.max(1, ...data.map(d => d.count));

  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid var(--line)', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>قمع المبيعات</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            توزيع {totalCount} صفقة على المراحل المفتوحة
          </div>
        </div>
        {onClickStage && (
          <button onClick={() => onClickStage()} style={{
            fontSize: 11, padding: '5px 11px', borderRadius: 7, fontFamily: 'inherit',
            background: '#fff', border: '1px solid var(--line)', cursor: 'pointer', color: 'var(--ink-2)',
          }}>عرض الكانبان →</button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map((d, i) => {
          const pct = (d.count / maxCount) * 100;
          const widthPct = Math.max(4, pct);
          return (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 90, textAlign: 'start', fontSize: 11.5, fontWeight: 500, color: 'var(--ink-2)', flexShrink: 0 }}>
                {d.label}
              </div>
              <div style={{ flex: 1, height: 28, background: 'oklch(0.97 0.01 240)', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  width: `${widthPct}%`, height: '100%',
                  background: `linear-gradient(90deg, oklch(0.55 0.15 ${d.hue}) 0%, oklch(0.6 0.13 ${d.hue}) 100%)`,
                  borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  paddingInlineEnd: 8, transition: 'width 0.4s',
                }}>
                  {pct > 18 && (
                    <span className="mono" style={{ fontSize: 10.5, color: '#fff', fontWeight: 600 }}>
                      {d.count}
                    </span>
                  )}
                </div>
                {pct <= 18 && (
                  <span className="mono" style={{
                    position: 'absolute', top: '50%', insetInlineStart: `calc(${widthPct}% + 6px)`,
                    transform: 'translateY(-50%)', fontSize: 10.5, color: 'var(--ink-2)', fontWeight: 600,
                  }}>{d.count}</span>
                )}
              </div>
              <div className="mono" style={{
                width: 70, textAlign: 'end', fontSize: 10.5, color: 'var(--muted)', flexShrink: 0,
              }}>
                {d.value > 0 ? window.spFmtCurrency(d.value) : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityPanel({ types, byType, totalCount }) {
  const total = totalCount || 1;
  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid var(--line)', padding: '18px 20px',
    }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>النشاط · آخر ٣٠ يوم</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
          {totalCount} نشاط مسجّل
        </div>
      </div>
      {totalCount === 0 ? (
        <div style={{ padding: '20px 14px', textAlign: 'center', color: 'var(--muted)', fontSize: 11.5 }}>
          لا أنشطة في آخر ٣٠ يوم
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {types.map(t => {
            const n = byType.get(t.id) || 0;
            if (n === 0) return null;
            const pct = Math.round((n / total) * 100);
            return (
              <div key={t.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--ink-2)' }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 5,
                      background: `oklch(0.95 0.05 ${t.hue})`, color: `oklch(0.4 0.15 ${t.hue})`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                    }}>{t.icon}</span>
                    {t.label}
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                    {n} · {pct}%
                  </div>
                </div>
                <div style={{ height: 4, background: 'oklch(0.97 0.01 240)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: `oklch(0.55 0.13 ${t.hue})`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TopDealsCard({ deals, avgWonValue, onOpenClient }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid var(--line)', padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>أعلى ٥ صفقات مفتوحة</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>مرتّبة حسب القيمة</div>
        </div>
        {avgWonValue > 0 && (
          <div style={{
            padding: '4px 10px', borderRadius: 7, background: 'oklch(0.97 0.03 145)',
            fontSize: 10.5, color: 'oklch(0.35 0.15 145)', fontWeight: 600,
          }}>
            متوسط فائز: {window.spFmtCurrency(avgWonValue)} ر.س
          </div>
        )}
      </div>
      {deals.length === 0 ? (
        <div style={{ padding: '20px 14px', textAlign: 'center', color: 'var(--muted)', fontSize: 11.5 }}>
          لا صفقات بقيمة مُحدّدة بعد
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {deals.map((c, i) => {
            const tier = (window.UC_TIERS || []).find(t => t.id === c.deal?.tier);
            return (
              <button key={c.uid} onClick={() => onOpenClient && onOpenClient(c.uid)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 9,
                  background: '#fbfaf7', border: '1px solid transparent',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'start',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--line)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fbfaf7'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <div className="mono" style={{
                  width: 22, fontSize: 11, color: 'var(--muted)', textAlign: 'center', flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{
                      fontSize: 9.5, padding: '1.5px 7px', borderRadius: 999, fontWeight: 600,
                      background: `oklch(0.97 0.03 ${c._stageMeta.hue})`,
                      color: `oklch(0.4 0.13 ${c._stageMeta.hue})`,
                    }}>{c._stageMeta.short}</span>
                    {tier && (
                      <span style={{
                        fontSize: 9.5, padding: '1.5px 7px', borderRadius: 999, fontWeight: 600,
                        background: `oklch(0.95 0.05 ${tier.hue})`, color: `oklch(0.35 0.15 ${tier.hue})`,
                      }}>{tier.label}</span>
                    )}
                    {c.deal?.probability !== undefined && (
                      <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>· {c.deal.probability}%</span>
                    )}
                  </div>
                </div>
                <div className="mono" style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--ink)', flexShrink: 0,
                }}>{window.spFmtCurrency(c._value)}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecentWinsCard({ deals, onOpenClient }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, oklch(0.98 0.025 145) 0%, #fff 100%)',
      borderRadius: 14, border: '1px solid oklch(0.92 0.04 145)', padding: '18px 20px',
    }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 24, height: 24, borderRadius: 7, background: 'oklch(0.55 0.18 145)', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
        }}>★</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'oklch(0.3 0.15 145)' }}>صفقات فائزة حديثة</div>
          <div style={{ fontSize: 10.5, color: 'oklch(0.45 0.1 145)', marginTop: 1 }}>للاحتفال + للمراجعة</div>
        </div>
      </div>
      {deals.length === 0 ? (
        <div style={{ padding: '16px 14px', textAlign: 'center', color: 'var(--muted)', fontSize: 11.5 }}>
          لم تُسجَّل صفقة فائزة بعد
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {deals.map(c => {
            const tier = (window.UC_TIERS || []).find(t => t.id === c.deal?.tier);
            return (
              <button key={c.uid} onClick={() => onOpenClient && onOpenClient(c.uid)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 11px', borderRadius: 9, background: '#fff',
                border: '1px solid oklch(0.94 0.03 145)',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}
                  </div>
                  {tier && (
                    <div style={{ fontSize: 9.5, color: 'oklch(0.45 0.13 145)', marginTop: 2, fontWeight: 500 }}>
                      {tier.label}
                    </div>
                  )}
                </div>
                <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'oklch(0.4 0.15 145)' }}>
                  {window.spFmtCurrency(c._value)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AlertsCard({ title, subtitle, icon, hue, deals, render, emptyText, onOpenClient }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14,
      border: `1px solid ${deals.length > 0 ? `oklch(0.92 0.04 ${hue})` : 'var(--line)'}`,
      padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{
          width: 26, height: 26, borderRadius: 7,
          background: deals.length > 0 ? `oklch(0.96 0.05 ${hue})` : 'var(--warm)',
          color: deals.length > 0 ? `oklch(0.45 0.18 ${hue})` : 'var(--muted)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
        }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
          <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{subtitle}</div>
        </div>
        {deals.length > 0 && (
          <span className="mono" style={{
            fontSize: 11, padding: '2px 9px', borderRadius: 999,
            background: `oklch(0.55 0.18 ${hue})`, color: '#fff', fontWeight: 600,
          }}>{deals.length}</span>
        )}
      </div>
      {deals.length === 0 ? (
        <div style={{
          padding: '14px 12px', textAlign: 'center', fontSize: 11, color: 'oklch(0.45 0.13 145)',
          background: 'oklch(0.98 0.02 145)', borderRadius: 9,
        }}>✓ {emptyText}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {deals.map(c => (
            <button key={c.uid} onClick={() => onOpenClient && onOpenClient(c.uid)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 10px', borderRadius: 7, background: '#fbfaf7', border: '1px solid transparent',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'start',
            }}>
              <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 500, color: 'var(--ink-2)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.name}
              </div>
              {render(c)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SalesDashboard });
