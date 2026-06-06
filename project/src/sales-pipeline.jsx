// Sales Pipeline View — Kanban (drag-between stages) for Mhwar CRM
// Reads/writes via the atlas store. Operates on clients enriched with deal + stage.

const { useState: useStateSP, useMemo: useMemoSP, useRef: useRefSP } = React;

// ------- helpers -------
function spStageMeta(stageId) {
  return (window.UC_STAGES || []).find(s => s.id === stageId) || (window.UC_STAGES || [])[0];
}

function spDaysSince(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d)) return null;
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  } catch (_) { return null; }
}

function spDealValue(deal) {
  // priority: ACV → MRR*12 → 0
  const acv = parseFloat(deal?.acv) || 0;
  const mrr = parseFloat(deal?.mrr) || 0;
  return acv > 0 ? acv : mrr * 12;
}

function spFmtCurrency(n) {
  if (!n || n <= 0) return '—';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(Math.round(n));
}

// =========================================================
// Kanban board
// =========================================================
function SalesPipelineBoard({ store, api, onOpenClient }) {
  const stages = (window.UC_STAGES || []);
  const openStages = stages.filter(s => s.kind === 'open');
  const wonStages  = stages.filter(s => s.kind === 'won');
  const lostStages = stages.filter(s => s.kind === 'lost');

  const [showWon, setShowWon] = useStateSP(true);
  const [showLost, setShowLost] = useStateSP(false);
  const [dragId, setDragId] = useStateSP(null);
  const [dragOverStage, setDragOverStage] = useStateSP(null);

  // Group clients by stage (with legacy migration)
  const byStage = useMemoSP(() => {
    const m = new Map();
    stages.forEach(s => m.set(s.id, []));
    (store.clients || []).forEach(c => {
      const sid = window.ucMigrateStage(c.stage);
      if (!m.has(sid)) m.set(sid, []);
      m.get(sid).push(c);
    });
    return m;
  }, [store.clients]);

  // Visible columns
  const visibleStages = useMemoSP(() => {
    const cols = [...openStages];
    if (showWon) cols.push(...wonStages);
    if (showLost) cols.push(...lostStages);
    return cols;
  }, [showWon, showLost]);

  const totalOpenValue = useMemoSP(() => {
    return openStages.reduce((sum, s) => {
      const list = byStage.get(s.id) || [];
      return sum + list.reduce((sx, c) => sx + spDealValue(c.deal), 0);
    }, 0);
  }, [byStage]);

  const totalOpenCount = openStages.reduce((s, st) => s + (byStage.get(st.id) || []).length, 0);
  const wonCount = wonStages.reduce((s, st) => s + (byStage.get(st.id) || []).length, 0);

  const handleDrop = (stageId) => {
    if (dragId) {
      api.setStage(dragId, stageId);
    }
    setDragId(null);
    setDragOverStage(null);
  };

  return (
    <div style={{ padding: '20px 28px 60px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{
          padding: '10px 14px', background: 'var(--ink)', color: '#fff',
          borderRadius: 12, display: 'flex', gap: 14, alignItems: 'baseline',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2 }}>قيمة Pipeline المفتوح</span>
          <span className="mono" style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.4 }}>{spFmtCurrency(totalOpenValue)}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>· {totalOpenCount} صفقة</span>
        </div>
        <div style={{ flex: 1 }} />
        <SPToggle on={showWon} onChange={setShowWon} label={`الفائزة (${wonCount})`} hue={145} />
        <SPToggle on={showLost} onChange={setShowLost} label="الخاسرة" hue={20} />
      </div>

      {/* Board */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        overflowX: 'auto', paddingBottom: 12, scrollSnapType: 'x proximity',
      }}>
        {visibleStages.map(stage => {
          const list = byStage.get(stage.id) || [];
          const colValue = list.reduce((s, c) => s + spDealValue(c.deal), 0);
          const isOver = dragOverStage === stage.id;
          return (
            <div key={stage.id}
              onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage.id); }}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={() => handleDrop(stage.id)}
              style={{
                flex: '0 0 280px', scrollSnapAlign: 'start',
                background: isOver ? `oklch(0.96 0.05 ${stage.hue})` : '#fbfaf7',
                border: isOver ? `2px dashed oklch(0.55 0.15 ${stage.hue})` : '1px solid var(--line)',
                borderRadius: 14, padding: 10, minHeight: 220,
              }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                padding: '8px 10px', background: '#fff', borderRadius: 9,
                borderInlineStart: `3px solid oklch(0.55 0.15 ${stage.hue})`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{stage.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>
                    {list.length} · {spFmtCurrency(colValue)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.length === 0 && (
                  <div style={{
                    padding: 16, fontSize: 11, color: 'var(--muted)', textAlign: 'center',
                    border: '1px dashed var(--line-2)', borderRadius: 9,
                  }}>اسحب صفقة إلى هنا</div>
                )}
                {list.map(c => (
                  <DealCard key={c.uid} client={c} stage={stage}
                    isDragging={dragId === c.uid}
                    onDragStart={() => setDragId(c.uid)}
                    onDragEnd={() => { setDragId(null); setDragOverStage(null); }}
                    onClick={() => onOpenClient(c.uid)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SPToggle({ on, onChange, label, hue = 220 }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      style={{
        padding: '7px 13px', borderRadius: 999, fontFamily: 'inherit',
        background: on ? `oklch(0.96 0.05 ${hue})` : '#fff',
        border: on ? `1.5px solid oklch(0.55 0.13 ${hue})` : '1px solid var(--line)',
        color: on ? `oklch(0.35 0.16 ${hue})` : 'var(--ink-2)',
        fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
      <span style={{ fontSize: 9 }}>{on ? '●' : '○'}</span> {label}
    </button>
  );
}

// =========================================================
// Single deal card (draggable)
// =========================================================
function DealCard({ client, stage, isDragging, onDragStart, onDragEnd, onClick }) {
  const priority = (window.CL_PRIORITY_COLORS || {})[client.priority] || (window.CL_PRIORITY_COLORS || {}).warm;
  const tier = (window.UC_TIERS || []).find(t => t.id === client.deal?.tier);
  const days = spDaysSince(client.lastContact);
  const stagnant = days !== null && days > 14 && stage.kind === 'open';
  const value = spDealValue(client.deal);
  const prob = client.deal?.probability ?? null;
  const tasksOpen = (client.tasks || []).filter(t => !t.done).length;
  const tasksOverdue = (client.tasks || []).filter(t => !t.done && t.due && new Date(t.due) < new Date()).length;
  const communities = client.communities?.length || 0;

  return (
    <div draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart(); }}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid var(--line)', borderRadius: 10,
        padding: 11, cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isDragging ? '0 8px 24px -8px rgba(20,19,15,0.2)' : 'none',
        transition: 'opacity 0.12s, transform 0.12s',
        position: 'relative',
      }}>
      {/* Priority dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: priority?.dot, flexShrink: 0 }} />
        <span style={{ fontSize: 10, color: priority?.fg, fontWeight: 600 }}>{priority?.label}</span>
        {stagnant && (
          <span title={`${days} يوم بدون تواصل`} style={{
            marginInlineStart: 'auto', fontSize: 9, padding: '1px 6px', borderRadius: 999,
            background: 'oklch(0.95 0.06 30)', color: 'oklch(0.45 0.18 30)', fontWeight: 600,
          }}>⚠ {days}ي</span>
        )}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4,
        overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 32,
      }}>{client.name}</div>
      {client.contactName && (
        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {client.contactName}
        </div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
        paddingTop: 7, borderTop: '1px solid var(--line)', flexWrap: 'wrap',
      }}>
        {tier && (
          <span style={{
            fontSize: 9.5, padding: '1.5px 7px', borderRadius: 999, fontWeight: 600,
            background: `oklch(0.95 0.05 ${tier.hue})`, color: `oklch(0.35 0.15 ${tier.hue})`,
          }}>{tier.label}</span>
        )}
        {value > 0 && (
          <span className="mono" style={{
            fontSize: 11, fontWeight: 600, color: 'var(--ink)',
          }}>{spFmtCurrency(value)}</span>
        )}
        {prob !== null && stage.kind === 'open' && (
          <span style={{
            fontSize: 9.5, color: 'var(--muted)',
          }}>· {prob}%</span>
        )}
        <span style={{ flex: 1 }} />
        {communities > 0 && (
          <span title={`${communities} مجتمع`} style={{
            fontSize: 9.5, color: 'var(--muted)',
          }}>◉ {communities}</span>
        )}
        {tasksOpen > 0 && (
          <span title={`${tasksOpen} مهمة`} style={{
            fontSize: 9.5,
            color: tasksOverdue > 0 ? 'oklch(0.5 0.18 25)' : 'var(--muted)',
            fontWeight: tasksOverdue > 0 ? 600 : 400,
          }}>{tasksOverdue > 0 ? '⚠' : '☑'} {tasksOpen}</span>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  SalesPipelineBoard,
  spStageMeta, spDaysSince, spDealValue, spFmtCurrency,
});
