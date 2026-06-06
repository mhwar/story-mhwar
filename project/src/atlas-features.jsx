// Atlas Features tab — library of platform capabilities grouped by family.
// Capabilities = the services Mhwar delivers. Distinct from use-cases (what communities ARE)
// and templates (which specific messages get sent). Features are the verbs.
// Now with: status (live/dev/planned/idea), priority (p0-p3), notes, inline editing.

const { useState: useStateAF, useMemo: useMemoAF, useEffect: useEffectAF } = React;

// Tiny local label
function AxLabel({ children }) {
  return (
    <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>
  );
}

function AtlasFeaturesTab({ store, api }) {
  const features = store.features || [];
  const families = window.UC_FEATURE_FAMILIES || [];
  const STATUSES = window.UC_FEATURE_STATUSES || [];
  const PRIORITIES = window.UC_FEATURE_PRIORITIES || [];

  const [activeFamily, setActiveFamily] = useStateAF('all');
  const [activeStatus, setActiveStatus] = useStateAF('all');
  const [activePriority, setActivePriority] = useStateAF('all');
  const [query, setQuery] = useStateAF('');
  const [detailUid, setDetailUid] = useStateAF(null);
  const [editorValue, setEditorValue] = useStateAF(null); // null | {...feature}
  const [confirmDel, setConfirmDel] = useStateAF(null);

  const filtered = useMemoAF(() => {
    return features.filter(f => {
      if (activeFamily !== 'all' && f.family !== activeFamily) return false;
      if (activeStatus !== 'all' && f.status !== activeStatus) return false;
      if (activePriority !== 'all' && f.priority !== activePriority) return false;
      if (query) {
        const hay = `${f.name} ${f.shortAr || ''} ${f.desc || ''} ${f.notes || ''}`;
        if (!hay.includes(query.trim())) return false;
      }
      return true;
    });
  }, [features, activeFamily, activeStatus, activePriority, query]);

  const familyCounts = useMemoAF(() => {
    const m = {};
    features.forEach(f => { m[f.family] = (m[f.family] || 0) + 1; });
    return m;
  }, [features]);

  const statusCounts = useMemoAF(() => {
    const m = {};
    features.forEach(f => { m[f.status] = (m[f.status] || 0) + 1; });
    return m;
  }, [features]);

  const priorityCounts = useMemoAF(() => {
    const m = {};
    features.forEach(f => { m[f.priority] = (m[f.priority] || 0) + 1; });
    return m;
  }, [features]);

  const detail = detailUid ? features.find(f => f.uid === detailUid) : null;
  const anyFilterActive = activeFamily !== 'all' || activeStatus !== 'all' || activePriority !== 'all' || !!query;

  // Roll-up stats for the hero
  const totals = { total: features.length, live: statusCounts.live||0, dev: statusCounts.dev||0, planned: statusCounts.planned||0, idea: statusCounts.idea||0 };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 40px 60px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>
      {/* Sidebar */}
      <aside style={{ position: 'sticky', top: 70, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Families */}
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>العائلات</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FamItemAF label="الكل" count={features.length} active={activeFamily === 'all'}
              onClick={() => setActiveFamily('all')} accent="var(--ink)" />
            {families.map(fam => (
              <FamItemAF key={fam.id} label={fam.label} count={familyCounts[fam.id] || 0}
                active={activeFamily === fam.id}
                onClick={() => setActiveFamily(activeFamily === fam.id ? 'all' : fam.id)}
                accent={`oklch(0.48 0.14 ${fam.hue})`}
                bg={`oklch(0.96 0.02 ${fam.hue})`}
                brief={fam.desc}
                icon={fam.icon} />
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div>
        {/* Status roll-up chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {STATUSES.map(st => (
            <StatusRollupCard key={st.id} st={st} count={statusCounts[st.id] || 0}
              active={activeStatus === st.id}
              onClick={() => setActiveStatus(activeStatus === st.id ? 'all' : st.id)} />
          ))}
        </div>

        {/* Search + add */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: '#fff', border: '1px solid var(--line)', borderRadius: 10 }}>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>⌕</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث في المميزات، الأوصاف، والملاحظات..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', background: 'transparent' }} />
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{filtered.length}/{features.length}</span>
          </div>
          <AxBtn icon="+" onClick={() => setEditorValue({ family: activeFamily !== 'all' ? activeFamily : 'channels', status: 'idea', priority: 'p2' })}>
            ميزة جديدة
          </AxBtn>
          <button onClick={() => (window.refPrintDoc ? window.refPrintDoc('مميّزات منصّة محور', window.buildFeaturesDocHtml()) : null)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, background: 'var(--ink)', color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            ⭳ تنزيل
          </button>
        </div>

        {/* Priority pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10.5, color: 'var(--muted)', marginLeft: 4, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>الأولوية</span>
          <FilterPillAF active={activePriority === 'all'} onClick={() => setActivePriority('all')} label="الكل" />
          {PRIORITIES.map(p => (
            <FilterPillAF key={p.id} active={activePriority === p.id}
              onClick={() => setActivePriority(activePriority === p.id ? 'all' : p.id)}
              label={`${p.label}`} count={priorityCounts[p.id] || 0} hue={p.hue} />
          ))}
          {anyFilterActive && (
            <button onClick={() => { setActiveFamily('all'); setActiveStatus('all'); setActivePriority('all'); setQuery(''); }}
              style={{ marginInlineStart: 'auto', padding: '6px 10px', borderRadius: 999, background: 'transparent', border: '1px dashed var(--line)', color: 'var(--muted)', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}>
              ✕ مسح الفلاتر
            </button>
          )}
        </div>
        <div style={{ marginBottom: 18 }}/>

        {/* Features view */}
        {!anyFilterActive ? (
          <FeaturesByFamily families={families} features={features}
            onOpen={uid => setDetailUid(uid)}
            onEdit={f => setEditorValue(f)} />
        ) : (
          filtered.length === 0 ? (
            <AxEmpty title="لا توجد مميزات تطابق الفلاتر"
              message="جرّب إزالة الفلاتر أو تغيير البحث"
              action={<AxBtn onClick={() => setEditorValue({ family: 'channels', status: 'idea', priority: 'p2' })} icon="+">ميزة جديدة</AxBtn>} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {filtered.map(f => (
                <FeatureCardAF key={f.uid} f={f} families={families}
                  onOpen={() => setDetailUid(f.uid)}
                  onEdit={() => setEditorValue(f)} />
              ))}
            </div>
          )
        )}
      </div>

      {detail && (
        <FeatureDetailDrawer f={detail} families={families} templates={window.TEMPLATES || []}
          onClose={() => setDetailUid(null)}
          onEdit={() => { setEditorValue(detail); setDetailUid(null); }}
          onDelete={() => setConfirmDel({ uid: detail.uid, name: detail.name })} />
      )}

      <FeatureEditor open={!!editorValue} value={editorValue} onClose={() => setEditorValue(null)}
        onSave={api.upsertFeature} families={families} />

      <AxConfirm
        open={!!confirmDel}
        title="حذف الميزة"
        message={confirmDel ? `سيتم حذف "${confirmDel.name}" نهائياً.` : ''}
        confirmLabel="حذف"
        destructive={true}
        onConfirm={() => { if (confirmDel) { api.deleteFeature(confirmDel.uid); setDetailUid(null); } }}
        onClose={() => setConfirmDel(null)}
      />
    </div>
  );
}

// ========== Status roll-up card (top of page) ==========
function StatusRollupCard({ st, count, active, onClick }) {
  const accent = `oklch(0.48 0.14 ${st.hue})`;
  const bg = `oklch(0.97 0.02 ${st.hue})`;
  return (
    <button onClick={onClick} style={{
      textAlign: 'right', cursor: 'pointer',
      padding: '14px 16px', borderRadius: 12,
      background: active ? bg : '#fff',
      border: active ? `1px solid ${accent}` : '1px solid var(--line)',
      fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', gap: 6,
      transition: 'all .15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: active ? accent : 'var(--ink-2)' }}>{st.label}</span>
        <span style={{ fontSize: 14, color: accent }}>{st.dot}</span>
      </div>
      <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: active ? accent : 'var(--ink)', lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.4 }}>{st.short}</div>
    </button>
  );
}

// ========== Family sections (grouped list view when no filters active) ==========
function FeaturesByFamily({ families, features, onOpen, onEdit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {families.map(fam => {
        const items = features.filter(f => f.family === fam.id).sort((a, b) => {
          // Sort by priority rank desc, then by status (live first)
          const pa = (window.UC_FEATURE_PRIORITIES || []).find(p => p.id === a.priority)?.rank || 0;
          const pb = (window.UC_FEATURE_PRIORITIES || []).find(p => p.id === b.priority)?.rank || 0;
          if (pa !== pb) return pb - pa;
          const statusOrder = { live: 0, dev: 1, planned: 2, idea: 3 };
          return (statusOrder[a.status]||9) - (statusOrder[b.status]||9);
        });
        if (!items.length) return null;
        const accent = `oklch(0.48 0.14 ${fam.hue})`;
        const bg = `oklch(0.97 0.02 ${fam.hue})`;
        return (
          <section key={fam.id}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  display: 'inline-grid', placeItems: 'center',
                  width: 34, height: 34, borderRadius: 9,
                  background: bg, color: accent,
                  fontSize: 18,
                }}>{fam.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{fam.label}</h3>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{fam.desc}</div>
                </div>
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{items.length} عنصر</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {items.map(f => (
                <FeatureCardAF key={f.uid} f={f} families={families}
                  onOpen={() => onOpen(f.uid)}
                  onEdit={() => onEdit(f)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ========== Feature card ==========
function FeatureCardAF({ f: _f, families, onOpen, onEdit }) {
  // Subscribe to featuresStore for live updates
  const [,_fr] = React.useState(0);
  React.useEffect(() => window.featuresStore?.subscribe(() => _fr(x => x + 1)), []);
  // Merge atlas feature with roadmap overrides (roadmap wins)
  const merged = window.featuresStore?.getMerged().find(x => x.id === _f.id);
  const f = merged ? { ..._f, status: merged.status, shipped_at: merged.shipped_at, quarter: merged.quarter, desc: merged.desc || _f.desc, name: merged.name || _f.name, shortAr: merged.shortAr || _f.shortAr, notes: merged.notes || _f.notes, family: merged.family || _f.family, hue: merged.hue ?? _f.hue } : _f;

  const fam = families.find(x => x.id === f.family);
  const accent = fam ? `oklch(0.48 0.14 ${fam.hue})` : 'var(--ink)';
  const bg = fam ? `oklch(0.97 0.02 ${fam.hue})` : 'var(--panel)';
  const st = (window.featuresStore?.EXTENDED_STATUSES || window.UC_FEATURE_STATUSES || []).find(s => s.id === f.status);
  const pr = (window.UC_FEATURE_PRIORITIES || []).find(p => p.id === f.priority);
  return (
    <div style={{
      position: 'relative',
      padding: 14, background: '#fff',
      border: '1px solid var(--line)', borderRadius: 12,
      fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'all .15s',
      cursor: 'pointer',
    }}
      onClick={() => window.openFeatureEditor?.(f.id)}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${accent}`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.border = '1px solid var(--line)'; e.currentTarget.style.transform = 'none'; }}
      title="انقر للتعديل"
    >
      {/* Status stripe — top edge */}
      {st && <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 3, borderTopRightRadius: 12, borderTopLeftRadius: 12, background: `oklch(0.55 0.16 ${st.hue})` }} />}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{
          display: 'inline-grid', placeItems: 'center',
          width: 34, height: 34, borderRadius: 8,
          background: bg, color: accent,
          fontSize: 16, flexShrink: 0,
        }}>{f.icon}</span>
        <button onClick={onOpen} style={{ flex: 1, minWidth: 0, textAlign: 'right', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{f.name}</div>
          {f.shortAr && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{f.shortAr}</div>}
        </button>
        {/* Edit button */}
        <button onClick={onEdit} title="تعديل" style={{
          background: 'transparent', border: '1px solid var(--line)', borderRadius: 6,
          color: 'var(--muted)', cursor: 'pointer', padding: '3px 6px', fontSize: 11, fontFamily: 'inherit',
        }}>✎</button>
      </div>

      {/* Meta chips row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {st && <StatusChipAF st={st} />}
        {pr && <PriorityChipAF pr={pr} />}
      </div>

      <button onClick={onOpen} style={{ textAlign: 'right', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{f.desc}</span>
      </button>

      {f.notes && (
        <div style={{ fontSize: 11, color: 'var(--ink-2)', padding: '6px 8px', background: 'oklch(0.98 0.02 60)', borderRadius: 6, borderInlineStart: '2px solid oklch(0.75 0.13 60)' }}>
          <span style={{ color: 'var(--muted)' }}>ملاحظة: </span>{f.notes}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto' }}>
        {(f.channels || []).map(ch => <ChannelChipAF key={ch} ch={ch} />)}
        {(f.templates || []).length > 0 && (
          <span className="mono" style={{ fontSize: 10, padding: '3px 7px', borderRadius: 999, background: 'var(--panel)', color: 'var(--muted)' }}>
            {f.templates.length} قالب
          </span>
        )}
      </div>
    </div>
  );
}

// ========== Chips ==========
function ChannelChipAF({ ch }) {
  const meta = {
    whatsapp: { label: 'واتساب', hue: 145 },
    email:    { label: 'إيميل',  hue: 205 },
    sms:      { label: 'SMS',     hue: 95 },
    web:      { label: 'ويب',     hue: 245 },
    inapp:    { label: 'داخلي',   hue: 265 },
  }[ch];
  if (!meta) return null;
  return (
    <span style={{
      fontSize: 10.5, padding: '3px 8px', borderRadius: 999,
      background: `oklch(0.95 0.03 ${meta.hue})`,
      color: `oklch(0.38 0.14 ${meta.hue})`,
    }}>{meta.label}</span>
  );
}

function StatusChipAF({ st }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10.5, padding: '3px 8px', borderRadius: 999,
      background: `oklch(0.95 0.04 ${st.hue})`,
      color: `oklch(0.38 0.15 ${st.hue})`,
      fontWeight: 600,
    }}>
      <span style={{ fontSize: 9 }}>{st.dot}</span>
      {st.label}
    </span>
  );
}

function PriorityChipAF({ pr }) {
  return (
    <span style={{
      fontSize: 10.5, padding: '3px 8px', borderRadius: 999,
      background: `oklch(0.96 0.03 ${pr.hue})`,
      color: `oklch(0.42 0.15 ${pr.hue})`,
      fontWeight: 600,
    }}>
      أولوية {pr.label}
    </span>
  );
}

// ========== Filter pill ==========
function FilterPillAF({ active, onClick, label, count, hue }) {
  const bg = active ? (hue != null ? `oklch(0.92 0.06 ${hue})` : 'var(--ink)') : '#fff';
  const fg = active ? (hue != null ? `oklch(0.35 0.15 ${hue})` : '#fff') : 'var(--ink-2)';
  return (
    <button onClick={onClick} style={{
      padding: '5px 11px', borderRadius: 999, background: bg, color: fg,
      border: active ? 'none' : '1px solid var(--line)',
      fontSize: 11, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <span>{label}</span>
      {count != null && <span className="mono" style={{ fontSize: 10, opacity: .7 }}>{count}</span>}
    </button>
  );
}

// ========== Sidebar item ==========
function FamItemAF({ label, count, active, onClick, accent, bg, brief, icon }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      width: '100%', textAlign: 'right',
      padding: '8px 10px', borderRadius: 8,
      background: active ? (bg || 'var(--panel)') : 'transparent',
      border: active ? `1px solid ${accent}` : '1px solid transparent',
      cursor: 'pointer', fontFamily: 'inherit',
    }}>
      {icon && <span style={{ fontSize: 13, color: active ? accent : 'var(--muted)' }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? accent : 'var(--ink)' }}>{label}</div>
        {brief && <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{brief}</div>}
      </div>
      <span className="mono" style={{ fontSize: 10.5, color: active ? accent : 'var(--muted)' }}>{count}</span>
    </button>
  );
}

// ========== Detail drawer (read-only view with edit/delete) ==========
function FeatureDetailDrawer({ f, families, templates, onClose, onEdit, onDelete }) {
  const fam = families.find(x => x.id === f.family);
  const accent = fam ? `oklch(0.48 0.14 ${fam.hue})` : 'var(--ink)';
  const bg = fam ? `oklch(0.97 0.02 ${fam.hue})` : 'var(--panel)';
  const st = (window.UC_FEATURE_STATUSES || []).find(s => s.id === f.status);
  const pr = (window.UC_FEATURE_PRIORITIES || []).find(p => p.id === f.priority);

  const linkedTemplates = (f.templates || []).map(tid => {
    return (templates || []).find(t => t.id === tid);
  }).filter(Boolean);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,20,30,.4)',
      zIndex: 100, display: 'flex', justifyContent: 'flex-start',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 540, maxWidth: '100%', background: '#fff',
        height: '100%', overflowY: 'auto', direction: 'rtl',
        boxShadow: '0 20px 60px rgba(15,20,30,.25)',
      }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-grid', placeItems: 'center',
            width: 42, height: 42, borderRadius: 10,
            background: bg, color: accent,
            fontSize: 22,
          }}>{f.icon}</span>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase' }}>{fam?.label || f.family}</div>
            <h3 style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 600 }}>{f.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 20, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>×</button>
        </div>

        {/* Action row */}
        <div style={{ padding: '14px 28px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 8, background: 'oklch(0.985 0.003 240)' }}>
          <button onClick={onEdit} style={{ padding: '7px 14px', borderRadius: 8, background: 'var(--ink)', color: '#fff', border: 'none', fontSize: 12, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer' }}>✎ تحرير</button>
          {!f.builtin && <button onClick={onDelete} style={{ padding: '7px 14px', borderRadius: 8, background: '#fff', color: 'oklch(0.45 0.2 25)', border: '1px solid oklch(0.85 0.08 25)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>حذف</button>}
        </div>

        <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Status + priority */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {st && <StatusChipAF st={st} />}
            {pr && <PriorityChipAF pr={pr} />}
          </div>

          {f.shortAr && (
            <div style={{ padding: 14, background: bg, borderRadius: 10, fontSize: 13, color: accent, fontWeight: 500 }}>
              {f.shortAr}
            </div>
          )}

          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>الوصف</div>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.85 }}>{f.desc}</p>
          </div>

          {f.notes && (
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>ملاحظات داخلية</div>
              <div style={{ padding: 12, background: 'oklch(0.985 0.015 60)', borderRadius: 8, borderInlineStart: '3px solid oklch(0.75 0.13 60)', fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>{f.notes}</div>
            </div>
          )}

          {(f.channels || []).length > 0 && (
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>قنوات التسليم</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {f.channels.map(ch => <ChannelChipAF key={ch} ch={ch} />)}
              </div>
            </div>
          )}

          {(f.useWith || []).length > 0 && (
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>يُستخدم مع الأنماط</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {f.useWith.map(p => (
                  <span key={p} style={{
                    fontSize: 12, padding: '4px 10px', borderRadius: 999,
                    background: 'var(--panel)', color: 'var(--ink-2)',
                    border: '1px solid var(--line)',
                  }}>{p}</span>
                ))}
              </div>
            </div>
          )}

          {linkedTemplates.length > 0 && (
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>قوالب مرتبطة</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {linkedTemplates.map(t => (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 9,
                    border: '1px solid var(--line)', background: 'var(--panel)',
                  }}>
                    <span style={{ fontSize: 14 }}>{t.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{t.label}</div>
                      {t.desc && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{t.desc}</div>}
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{t.group}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== Feature Editor (modal with form) ==========
function FeatureEditor({ open, value, onClose, onSave, families }) {
  const makeDraft = (v) => ({
    uid: v?.uid,
    id: v?.id,
    name: v?.name || '',
    family: v?.family || 'channels',
    shortAr: v?.shortAr || '',
    desc: v?.desc || '',
    icon: v?.icon || '◇',
    status: v?.status || 'idea',
    priority: v?.priority || 'p2',
    notes: v?.notes || '',
    channels: Array.isArray(v?.channels) ? v.channels : [],
    useWith: Array.isArray(v?.useWith) ? v.useWith : [],
    templates: Array.isArray(v?.templates) ? v.templates : [],
    builtin: v?.builtin || false,
  });
  const [draft, setDraft] = useStateAF(() => makeDraft(value));
  useEffectAF(() => {
    if (open) setDraft(makeDraft(value));
  }, [open, value?.uid]);

  if (!open) return null;

  const STATUSES = window.UC_FEATURE_STATUSES || [];
  const PRIORITIES = window.UC_FEATURE_PRIORITIES || [];

  const handleSave = () => {
    if (!draft.name?.trim()) return;
    onSave(draft);
    onClose();
  };

  const toggle = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  return (
    <AxModal open={open} onClose={onClose} title={value?.uid ? 'تعديل الميزة' : 'ميزة جديدة'} width={640}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Name */}
        <div>
          <AxLabel>الاسم</AxLabel>
          <AxInput value={draft.name} onChange={v => setDraft({ ...draft, name: v })} placeholder="اسم الميزة" />
        </div>

        {/* Icon + family */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12 }}>
          <div>
            <AxLabel>الأيقونة</AxLabel>
            <AxInput value={draft.icon} onChange={v => setDraft({ ...draft, icon: v })} placeholder="◇" />
          </div>
          <div>
            <AxLabel>العائلة</AxLabel>
            <AxSelect value={draft.family} onChange={v => setDraft({ ...draft, family: v })}
              options={families.map(f => ({ value: f.id, label: f.label }))} />
          </div>
        </div>

        {/* Short description */}
        <div>
          <AxLabel>عنوان فرعي مختصر</AxLabel>
          <AxInput value={draft.shortAr} onChange={v => setDraft({ ...draft, shortAr: v })} placeholder="سطر واحد — يظهر في البطاقة" />
        </div>

        {/* Description */}
        <div>
          <AxLabel>الوصف الكامل</AxLabel>
          <AxTextarea value={draft.desc} onChange={v => setDraft({ ...draft, desc: v })}
            rows={4} placeholder="اشرح ما تفعله الميزة بالتفصيل..." />
        </div>

        {/* Status + Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <AxLabel>الحالة</AxLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STATUSES.map(st => (
                <label key={st.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px', borderRadius: 8,
                  background: draft.status === st.id ? `oklch(0.96 0.03 ${st.hue})` : '#fff',
                  border: draft.status === st.id ? `1px solid oklch(0.55 0.16 ${st.hue})` : '1px solid var(--line)',
                  cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                }}>
                  <input type="radio" name="status" checked={draft.status === st.id}
                    onChange={() => setDraft({ ...draft, status: st.id })} style={{ accentColor: `oklch(0.55 0.16 ${st.hue})` }} />
                  <span style={{ color: `oklch(0.55 0.16 ${st.hue})` }}>{st.dot}</span>
                  <span style={{ fontWeight: 500, color: draft.status === st.id ? `oklch(0.38 0.15 ${st.hue})` : 'var(--ink)' }}>{st.label}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)', marginInlineStart: 'auto' }}>{st.short}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <AxLabel>الأولوية</AxLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PRIORITIES.map(pr => (
                <label key={pr.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px', borderRadius: 8,
                  background: draft.priority === pr.id ? `oklch(0.96 0.03 ${pr.hue})` : '#fff',
                  border: draft.priority === pr.id ? `1px solid oklch(0.55 0.16 ${pr.hue})` : '1px solid var(--line)',
                  cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                }}>
                  <input type="radio" name="priority" checked={draft.priority === pr.id}
                    onChange={() => setDraft({ ...draft, priority: pr.id })} style={{ accentColor: `oklch(0.55 0.16 ${pr.hue})` }} />
                  <span style={{ fontWeight: 500, color: draft.priority === pr.id ? `oklch(0.42 0.15 ${pr.hue})` : 'var(--ink)' }}>{pr.label}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)', marginInlineStart: 'auto' }}>{pr.short}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Channels */}
        <div>
          <AxLabel>قنوات التسليم</AxLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              { id: 'whatsapp', label: 'واتساب', hue: 145 },
              { id: 'email', label: 'إيميل', hue: 205 },
              { id: 'sms', label: 'SMS', hue: 95 },
              { id: 'web', label: 'ويب', hue: 245 },
              { id: 'inapp', label: 'داخلي', hue: 265 },
            ].map(ch => (
              <button key={ch.id} type="button" onClick={() => setDraft({ ...draft, channels: toggle(draft.channels, ch.id) })}
                style={{
                  padding: '6px 11px', borderRadius: 999,
                  background: draft.channels.includes(ch.id) ? `oklch(0.92 0.06 ${ch.hue})` : '#fff',
                  color: draft.channels.includes(ch.id) ? `oklch(0.35 0.15 ${ch.hue})` : 'var(--ink-2)',
                  border: draft.channels.includes(ch.id) ? 'none' : '1px solid var(--line)',
                  fontSize: 11.5, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
                }}>{ch.label}</button>
            ))}
          </div>
        </div>

        {/* Use-with patterns */}
        <div>
          <AxLabel>الأنماط المستهدفة (اختياري)</AxLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['مفتوح', 'مغلق', 'هجين'].map(p => (
              <button key={p} type="button" onClick={() => setDraft({ ...draft, useWith: toggle(draft.useWith, p) })}
                style={{
                  padding: '6px 11px', borderRadius: 999,
                  background: draft.useWith.includes(p) ? 'var(--ink)' : '#fff',
                  color: draft.useWith.includes(p) ? '#fff' : 'var(--ink-2)',
                  border: draft.useWith.includes(p) ? 'none' : '1px solid var(--line)',
                  fontSize: 11.5, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
                }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <AxLabel>ملاحظات داخلية (اختياري)</AxLabel>
          <AxTextarea value={draft.notes} onChange={v => setDraft({ ...draft, notes: v })}
            rows={3} placeholder="أي ملاحظات داخلية، روابط JIRA، قرارات منتج..." />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: 8, background: '#fff', border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer' }}>إلغاء</button>
          <button onClick={handleSave} disabled={!draft.name?.trim()} style={{
            padding: '9px 18px', borderRadius: 8,
            background: draft.name?.trim() ? 'var(--ink)' : 'var(--panel)',
            color: draft.name?.trim() ? '#fff' : 'var(--muted)',
            border: 'none', fontSize: 12.5, fontFamily: 'inherit', fontWeight: 500,
            cursor: draft.name?.trim() ? 'pointer' : 'not-allowed',
          }}>حفظ</button>
        </div>
      </div>
    </AxModal>
  );
}

Object.assign(window, {
  AtlasFeaturesTab,
  FeatureCardAF, FeatureDetailDrawer, FeatureEditor,
});
