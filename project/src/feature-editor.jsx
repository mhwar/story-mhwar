// Shared feature edit panel — overlay that opens on any feature card click.
// Used by the roadmap tab AND the features list tab.
// Call via: window.openFeatureEditor(featureId).

const { useState: useStateFE, useEffect: useEffectFE } = React;

let _editorOpenFn = null;
window.openFeatureEditor = (featureId) => {
  if (_editorOpenFn) _editorOpenFn(featureId);
};

function FeatureEditor() {
  const [openId, setOpenId] = useStateFE(null);
  const [, force] = useStateFE(0);

  useEffectFE(() => {
    _editorOpenFn = (id) => setOpenId(id);
    return () => { _editorOpenFn = null; };
  }, []);
  useEffectFE(() => window.featuresStore?.subscribe(() => force(x => x + 1)), []);

  if (!openId) return null;
  const features = window.featuresStore.getMerged();
  const f = features.find(x => x.id === openId);
  if (!f) return null;

  const families = window.UC_FEATURE_FAMILIES || [];
  const statuses = window.featuresStore.EXTENDED_STATUSES;
  const quarters = window.featuresStore.QUARTERS;

  const close = () => setOpenId(null);
  const patch = (p) => window.featuresStore.update(openId, p);

  const statusMeta = window.featuresStore.statusMeta(f.status);
  const familyMeta = families.find(x => x.id === f.family) || families[0];

  const shipNow = () => {
    const today = new Date().toISOString().slice(0, 10);
    patch({ status: 'live', shipped_at: today });
  };

  return (
    <div style={feStyles.backdrop} onClick={close}>
      <div style={feStyles.panel} dir="rtl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={feStyles.hdr}>
          <div style={feStyles.hdrLeft}>
            <div style={{ ...feStyles.iconBadge, background: `oklch(0.95 0.04 ${f.hue || 200})`, color: `oklch(0.45 0.12 ${f.hue || 200})` }}>
              {f.icon || '◇'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={feStyles.familyLabel}>{familyMeta?.label || '—'}</div>
              <input
                value={f.name || ''}
                onChange={(e) => patch({ name: e.target.value })}
                style={feStyles.titleInput}
                placeholder="اسم الميزة"
              />
            </div>
          </div>
          <button onClick={close} style={feStyles.closeBtn} title="إغلاق">✕</button>
        </div>

        {/* Body */}
        <div style={feStyles.body}>
          {/* Status picker */}
          <section style={feStyles.sect}>
            <div style={feStyles.sectLabel}>
              <span>الحالة</span>
              {f.status === 'live' && f.shipped_at && (
                <span style={feStyles.dateBadge}>نُشرت: {f.shipped_at}</span>
              )}
              {f.status !== 'live' && (
                <button onClick={shipNow} style={feStyles.quickShip}>✓ نشر الآن</button>
              )}
            </div>
            <div style={feStyles.statusGrid}>
              {statuses.map(s => {
                const active = s.id === f.status;
                return (
                  <button
                    key={s.id}
                    onClick={() => patch({ status: s.id })}
                    style={{
                      ...feStyles.statusChip,
                      ...(active ? {
                        background: `oklch(0.96 0.04 ${s.hue})`,
                        borderColor: `oklch(0.6 0.14 ${s.hue})`,
                        color: `oklch(0.35 0.18 ${s.hue})`,
                      } : {}),
                    }}
                  >
                    <span style={{ ...feStyles.statusDot, color: `oklch(0.55 0.18 ${s.hue})` }}>{s.dot}</span>
                    <span style={{ fontWeight: active ? 600 : 500 }}>{s.label}</span>
                    <span style={feStyles.statusShort}>{s.short}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Quarter — only relevant if NOT shipped */}
          {f.status !== 'live' && (
            <section style={feStyles.sect}>
              <div style={feStyles.sectLabel}>الربع المستهدف</div>
              <div style={feStyles.quarterRow}>
                {quarters.map(q => {
                  const active = q.id === (f.quarter || 'backlog');
                  return (
                    <button
                      key={q.id}
                      onClick={() => patch({ quarter: q.id })}
                      style={{ ...feStyles.qChip, ...(active ? feStyles.qChipActive : {}) }}
                    >{q.label}</button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Shipped date editor for live */}
          {f.status === 'live' && (
            <section style={feStyles.sect}>
              <div style={feStyles.sectLabel}>تاريخ النشر</div>
              <input
                type="date"
                value={f.shipped_at || ''}
                onChange={(e) => patch({ shipped_at: e.target.value })}
                style={feStyles.dateInput}
              />
            </section>
          )}

          {/* Family (re-classify) */}
          <section style={feStyles.sect}>
            <div style={feStyles.sectLabel}>عائلة العمل (التصنيف)</div>
            <div style={feStyles.familyRow}>
              {families.map(fam => {
                const active = fam.id === f.family;
                return (
                  <button
                    key={fam.id}
                    onClick={() => patch({ family: fam.id, hue: fam.hue })}
                    style={{
                      ...feStyles.famChip,
                      ...(active ? {
                        background: `oklch(0.96 0.03 ${fam.hue})`,
                        borderColor: `oklch(0.5 0.12 ${fam.hue})`,
                        color: `oklch(0.3 0.15 ${fam.hue})`,
                        fontWeight: 600,
                      } : {}),
                    }}
                  >
                    <span style={{ fontSize: 11, marginInlineEnd: 5, color: `oklch(0.55 0.15 ${fam.hue})` }}>{fam.icon}</span>
                    {fam.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Description */}
          <section style={feStyles.sect}>
            <div style={feStyles.sectLabel}>الوصف</div>
            <textarea
              value={f.desc || ''}
              onChange={(e) => patch({ desc: e.target.value })}
              rows={3}
              style={feStyles.textarea}
              placeholder="وصف الميزة — ماذا تفعل ومَن يستفيد منها؟"
            />
          </section>

          {/* Short tagline */}
          <section style={feStyles.sect}>
            <div style={feStyles.sectLabel}>وصف مختصر (سطر واحد)</div>
            <input
              value={f.shortAr || ''}
              onChange={(e) => patch({ shortAr: e.target.value })}
              style={feStyles.textInput}
              placeholder="سطر واحد يُلخّص الميزة"
            />
          </section>

          {/* Notes */}
          <section style={feStyles.sect}>
            <div style={feStyles.sectLabel}>ملاحظات داخلية</div>
            <textarea
              value={f.notes || ''}
              onChange={(e) => patch({ notes: e.target.value })}
              rows={2}
              style={feStyles.textarea}
              placeholder="ملاحظات للفريق — اعتبارات، مخاطر، اعتماديات..."
            />
          </section>
        </div>

        {/* Footer */}
        <div style={feStyles.footer}>
          <button
            onClick={() => {
              if (confirm('استعادة القيم الأصلية لهذه الميزة؟')) {
                window.featuresStore.resetFeature(openId);
              }
            }}
            style={feStyles.resetBtn}
            title="استعادة القيم الافتراضية من البذرة"
          >↻ استعادة الأصل</button>
          <div style={{ flex: 1 }}/>
          <button onClick={close} style={feStyles.doneBtn}>تم</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Styles ----------
const feStyles = {
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'oklch(0.2 0.02 60 / 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'grid', placeItems: 'center',
    padding: 24,
    animation: 'fadeIn 0.2s ease',
  },
  panel: {
    background: '#fff',
    borderRadius: 18,
    width: '100%', maxWidth: 720, maxHeight: '90vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 24px 80px oklch(0.2 0.02 60 / 0.3)',
    border: '1px solid oklch(0.88 0.01 70)',
    fontFamily: 'inherit',
  },
  hdr: {
    display: 'flex', alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid oklch(0.92 0.01 70)',
    gap: 12,
  },
  hdrLeft: {
    display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1, minWidth: 0,
  },
  iconBadge: {
    width: 44, height: 44, borderRadius: 12,
    display: 'grid', placeItems: 'center',
    fontSize: 20, flexShrink: 0,
  },
  familyLabel: {
    fontSize: 11, color: 'var(--muted)',
    marginBottom: 4, fontFamily: 'var(--mono, ui-monospace, monospace)',
    letterSpacing: 0.5,
  },
  titleInput: {
    width: '100%', fontSize: 20, fontWeight: 600,
    letterSpacing: -0.3, color: 'var(--ink)',
    border: '1px dashed transparent', borderRadius: 8,
    padding: '4px 8px', margin: '-4px -8px',
    fontFamily: 'inherit', background: 'transparent',
    boxSizing: 'border-box',
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 8,
    background: 'oklch(0.96 0.01 70)', border: 'none',
    color: 'var(--ink-2)', fontSize: 13,
    cursor: 'pointer', flexShrink: 0,
    fontFamily: 'inherit',
  },
  body: {
    padding: '16px 24px', overflowY: 'auto',
    flex: 1, display: 'flex', flexDirection: 'column', gap: 18,
  },
  sect: {
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  sectLabel: {
    fontSize: 12, color: 'var(--ink-2)',
    fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: 10,
  },
  dateBadge: {
    fontSize: 11, padding: '3px 8px', borderRadius: 999,
    background: 'oklch(0.93 0.08 145)', color: 'oklch(0.35 0.15 145)',
    fontWeight: 500,
  },
  quickShip: {
    fontSize: 11, padding: '4px 10px', borderRadius: 6,
    background: 'oklch(0.92 0.1 145)', color: 'oklch(0.3 0.15 145)',
    border: '1px solid oklch(0.75 0.15 145)',
    fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600,
  },
  statusGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 6,
  },
  statusChip: {
    display: 'flex', flexDirection: 'column', gap: 2,
    padding: '10px 12px', borderRadius: 9,
    background: '#fff', border: '1px solid oklch(0.9 0.01 70)',
    color: 'var(--ink)', fontSize: 13, textAlign: 'right',
    fontFamily: 'inherit', cursor: 'pointer',
    position: 'relative',
  },
  statusDot: { fontSize: 14, marginInlineEnd: 6 },
  statusShort: {
    fontSize: 11, color: 'var(--muted)', fontWeight: 400,
  },
  quarterRow: {
    display: 'flex', flexWrap: 'wrap', gap: 6,
  },
  qChip: {
    padding: '6px 12px', borderRadius: 999,
    background: '#fff', border: '1px solid oklch(0.9 0.01 70)',
    color: 'var(--ink-2)', fontSize: 12,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  qChipActive: {
    background: 'var(--ink)', color: '#fff',
    borderColor: 'var(--ink)', fontWeight: 600,
  },
  dateInput: {
    fontSize: 13, padding: '8px 12px',
    borderRadius: 8, border: '1px solid oklch(0.9 0.01 70)',
    background: '#fff', fontFamily: 'inherit',
    maxWidth: 200,
  },
  familyRow: {
    display: 'flex', flexWrap: 'wrap', gap: 5,
  },
  famChip: {
    padding: '5px 10px', borderRadius: 7,
    background: '#fff', border: '1px solid oklch(0.9 0.01 70)',
    color: 'var(--ink-2)', fontSize: 11.5,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  textInput: {
    fontSize: 13, padding: '10px 12px',
    borderRadius: 8, border: '1px solid oklch(0.9 0.01 70)',
    background: '#fff', fontFamily: 'inherit',
    color: 'var(--ink)', width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    fontSize: 13, padding: '10px 12px',
    borderRadius: 8, border: '1px solid oklch(0.9 0.01 70)',
    background: '#fff', fontFamily: 'inherit',
    color: 'var(--ink)', width: '100%',
    resize: 'vertical', lineHeight: 1.7,
    boxSizing: 'border-box',
  },
  footer: {
    display: 'flex', gap: 10, alignItems: 'center',
    padding: '14px 24px',
    borderTop: '1px solid oklch(0.92 0.01 70)',
  },
  resetBtn: {
    padding: '7px 12px', borderRadius: 8,
    background: 'transparent', border: '1px solid oklch(0.9 0.01 70)',
    color: 'var(--muted)', fontSize: 12,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  doneBtn: {
    padding: '8px 20px', borderRadius: 8,
    background: 'var(--ink)', color: '#fff',
    border: 'none', fontSize: 13, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer',
  },
};

// inject fade-in keyframe
if (typeof document !== 'undefined' && !document.getElementById('feature-editor-kf')) {
  const s = document.createElement('style');
  s.id = 'feature-editor-kf';
  s.textContent = `@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`;
  document.head.appendChild(s);
}

Object.assign(window, { RoadmapFeatureEditor: FeatureEditor });
