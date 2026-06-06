// Atlas tabs — NEW STRUCTURE
// Overview · Cases (library of community types) · Sectors (categories) · Root Patterns · Traits

const { useState: useStateAT, useMemo: useMemoAT } = React;

// ============================================================
// Overview
// ============================================================
function AtlasOverviewTab({ store, goTab }) {
  const { categories, patterns, traits, cases, clients } = store;

  const perSector = useMemoAT(() => {
    const m = new Map();
    categories.forEach(c => m.set(c.id, 0));
    cases.forEach(c => (c.suggestedSectors || []).forEach(s => m.set(s, (m.get(s) || 0) + 1)));
    return categories.map(c => ({ ...c, count: m.get(c.id) || 0 })).sort((a, b) => b.count - a.count);
  }, [categories, cases]);

  const perRoot = useMemoAT(() => {
    const m = new Map();
    patterns.forEach(p => m.set(p.id, 0));
    cases.forEach(c => { if (c.suggestedRootPattern) m.set(c.suggestedRootPattern, (m.get(c.suggestedRootPattern) || 0) + 1); });
    return patterns.map(p => ({ ...p, count: m.get(p.id) || 0 })).sort((a, b) => b.count - a.count);
  }, [patterns, cases]);

  const max = Math.max(1, ...perSector.map(c => c.count));

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 40px 60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 28 }}>
        <KpiTile num={cases.length.toString()} label="نوع مجتمع" sub="مكتبة الأنواع" />
        <KpiTile num={categories.length.toString()} label="قطاع" sub="مجموعات العملاء" accent="oklch(0.5 0.14 30)" />
        <KpiTile num={patterns.length.toString()} label="نمط رئيسي" sub="مفتوح / مغلق / هجين" accent="oklch(0.48 0.13 225)" />
        <KpiTile num={traits.length.toString()} label="خاصية" sub="تُضاف للمجتمع" accent="oklch(0.45 0.14 310)" />
        <KpiTile num={clients.length.toString()} label="عميل مسجّل" sub="في أداة الاحتياج" accent="oklch(0.5 0.15 145)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>توزيع الأنواع حسب القطاع</h3>
            <button onClick={() => goTab('categories')} style={{ fontSize: 11.5, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>إدارة القطاعات ←</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {perSector.map(c => (
              <div key={c.uid} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 140, fontSize: 12.5, color: 'var(--ink)', fontWeight: 500 }}>{c.name || c.id}</div>
                <div style={{ flex: 1, height: 10, background: 'var(--warm)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${(c.count / max) * 100}%`, height: '100%', background: c.accent, borderRadius: 999, transition: 'width 0.3s' }} />
                </div>
                <div className="mono" style={{ width: 30, textAlign: 'end', fontSize: 11.5, color: 'var(--muted)' }}>{c.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>الأنماط الرئيسية</h3>
            <button onClick={() => goTab('patterns')} style={{ fontSize: 11.5, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>تفاصيل ←</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {perRoot.map(p => (
              <div key={p.uid} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: `oklch(0.98 0.015 ${p.hue})` }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: `oklch(0.9 0.05 ${p.hue})`, color: `oklch(0.35 0.15 ${p.hue})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{p.icon}</div>
                <div style={{ flex: 1, fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>{p.id}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{p.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Cases tab — library of community types
// ============================================================
function AtlasCasesTab({ store, api, openEditor, confirmDelete }) {
  const { categories, patterns, traits, cases } = store;
  const [activeSector, setActiveSector] = useStateAT('all');
  const [activeRoot, setActiveRoot] = useStateAT('all');
  const [query, setQuery] = useStateAT('');
  const [detailId, setDetailId] = useStateAT(null);

  const filtered = useMemoAT(() => {
    return cases.filter(uc => {
      if (activeSector !== 'all' && !(uc.suggestedSectors || []).includes(activeSector)) return false;
      if (activeRoot !== 'all' && uc.suggestedRootPattern !== activeRoot) return false;
      if (query) {
        const hay = `${uc.name} ${uc.desc} ${uc.entity || ''} ${uc.example || ''}`;
        if (!hay.includes(query.trim())) return false;
      }
      return true;
    });
  }, [cases, activeSector, activeRoot, query]);

  const sectorCounts = useMemoAT(() => {
    const m = {};
    cases.forEach(u => (u.suggestedSectors || []).forEach(s => { m[s] = (m[s] || 0) + 1; }));
    return m;
  }, [cases]);

  const detailCase = detailId ? cases.find(c => c.uid === detailId) : null;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 40px 60px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>
      <aside style={{ position: 'sticky', top: 70 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>القطاعات المقترحة</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CatItemAT label="الكل" count={cases.length} active={activeSector === 'all'} onClick={() => setActiveSector('all')} accent="var(--ink)" />
          {categories.map(c => (
            <CatItemAT key={c.uid} label={c.name || c.id} count={sectorCounts[c.id] || 0}
              active={activeSector === c.id}
              onClick={() => setActiveSector(activeSector === c.id ? 'all' : c.id)}
              accent={c.accent} bg={c.bg} brief={c.brief} />
          ))}
        </div>
      </aside>

      <div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: '#fff', border: '1px solid var(--line)', borderRadius: 10 }}>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>⌕</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث في الأنواع..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', background: 'transparent' }} />
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{filtered.length}/{cases.length}</span>
          </div>
          <AxBtn icon="+" onClick={() => openEditor('case', { suggestedSectors: activeSector !== 'all' ? [activeSector] : [], suggestedRootPattern: activeRoot !== 'all' ? activeRoot : '' })}>
            نوع جديد
          </AxBtn>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <FilterPill active={activeRoot === 'all'} onClick={() => setActiveRoot('all')} label="كل الأنماط" />
          {patterns.map(p => (
            <FilterPill key={p.uid} active={activeRoot === p.id}
              onClick={() => setActiveRoot(activeRoot === p.id ? 'all' : p.id)}
              label={p.id} icon={p.icon} hue={p.hue} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <AxEmpty title="لا توجد أنواع تطابق الفلاتر"
            message="جرّب إزالة الفلاتر أو إضافة نوع جديد"
            action={<AxBtn onClick={() => openEditor('case', {})} icon="+">نوع جديد</AxBtn>} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
            {filtered.map(uc => (
              <CaseCardAT key={uc.uid} uc={uc} categories={categories} patterns={patterns} traits={traits}
                onOpen={() => setDetailId(uc.uid)}
                onEdit={() => openEditor('case', uc)}
                onDelete={() => confirmDelete({ title: 'حذف النوع', message: `سيتم حذف "${uc.name}" نهائياً.`, onConfirm: () => api.deleteCase(uc.uid) })} />
            ))}
          </div>
        )}
      </div>

      {detailCase && (
        <CaseDetailDrawer uc={detailCase} categories={categories} patterns={patterns} traits={traits}
          onClose={() => setDetailId(null)}
          onEdit={() => { openEditor('case', detailCase); setDetailId(null); }}
          onDelete={() => confirmDelete({
            title: 'حذف النوع', message: `سيتم حذف "${detailCase.name}" نهائياً.`,
            onConfirm: () => { api.deleteCase(detailCase.uid); setDetailId(null); },
          })} />
      )}
    </div>
  );
}

function FilterPill({ active, onClick, label, icon, hue }) {
  const bg = active ? (hue != null ? `oklch(0.92 0.06 ${hue})` : 'var(--ink)') : '#fff';
  const fg = active ? (hue != null ? `oklch(0.35 0.15 ${hue})` : '#fff') : 'var(--ink-2)';
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', borderRadius: 999, background: bg, color: fg,
      border: active ? 'none' : '1px solid var(--line)',
      fontSize: 11.5, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      {icon && <span style={{ opacity: 0.85 }}>{icon}</span>}
      {label}
    </button>
  );
}

function CatItemAT({ label, count, active, onClick, accent, bg, brief }) {
  return (
    <button onClick={onClick}
      style={{
        textAlign: 'right', padding: '10px 12px', borderRadius: 10,
        background: active ? (bg || 'var(--warm)') : 'transparent',
        border: active ? `1px solid ${accent}33` : '1px solid transparent',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 3,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--warm)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? accent : 'var(--ink)' }}>{label}</span>
        <span className="mono" style={{ fontSize: 10.5, padding: '1px 7px', borderRadius: 999, background: active ? '#fff' : 'var(--warm)', color: 'var(--muted)' }}>{count}</span>
      </div>
      {brief && <span style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5 }}>{brief}</span>}
    </button>
  );
}

function CaseCardAT({ uc, categories, patterns, traits, onOpen, onEdit, onDelete }) {
  const firstSector = (uc.suggestedSectors || [])[0];
  const cat = categories.find(c => c.id === firstSector) || { name: firstSector || 'عام', accent: 'var(--ink-2)', bg: 'var(--warm)', short: '•' };
  const pat = patterns.find(p => p.id === uc.suggestedRootPattern) || { name: uc.suggestedRootPattern || '—', hue: 220, icon: '○' };
  const caseTraits = (uc.suggestedTraits || []).map(tid => traits.find(t => t.id === tid)).filter(Boolean);
  return (
    <div style={{
      padding: 18, background: '#fff', border: '1px solid var(--line)', borderRadius: 14,
      display: 'flex', flexDirection: 'column', gap: 12, minHeight: 240, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 10.5, fontWeight: 500, padding: '3px 9px', borderRadius: 999, background: cat.bg, color: cat.accent }}>
          {cat.short || cat.name}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <IconBtn onClick={onEdit} label="تعديل">✎</IconBtn>
          <IconBtn onClick={onDelete} label="حذف" danger>×</IconBtn>
        </div>
      </div>
      <div onClick={onOpen} style={{ cursor: 'pointer', flex: 1 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.35 }}>{uc.name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.65 }}>{uc.desc}</div>
      </div>
      <div style={{ paddingTop: 12, borderTop: '1px dashed var(--line)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>الجهة</div>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uc.entity || '—'}</div>
          </div>
          <span style={{
            fontSize: 10.5, padding: '3px 9px', borderRadius: 999,
            background: `oklch(0.96 0.025 ${pat.hue})`, color: `oklch(0.4 0.12 ${pat.hue})`,
            display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
          }}>
            <span style={{ fontSize: 9 }}>{pat.icon}</span>{pat.name}
          </span>
        </div>
        {caseTraits.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {caseTraits.map(t => (
              <span key={t.id} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: 'var(--warm)', color: 'var(--muted)' }}>
                {t.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, label, danger }) {
  return (
    <button onClick={onClick} title={label} aria-label={label} style={{
      width: 26, height: 26, borderRadius: 7, border: '1px solid var(--line)', background: '#fff',
      color: danger ? 'oklch(0.5 0.15 25)' : 'var(--ink-2)',
      fontSize: 12, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

function CaseDetailDrawer({ uc, categories, patterns, traits, onClose, onEdit, onDelete }) {
  const firstSector = (uc.suggestedSectors || [])[0];
  const cat = categories.find(c => c.id === firstSector) || { name: firstSector || 'عام', accent: 'var(--ink)', bg: 'var(--warm)' };
  const pat = patterns.find(p => p.id === uc.suggestedRootPattern) || { name: uc.suggestedRootPattern || '—', hue: 220, icon: '○', desc: '' };
  const caseTraits = (uc.suggestedTraits || []).map(tid => traits.find(t => t.id === tid)).filter(Boolean);
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.4)', zIndex: 200, backdropFilter: 'blur(2px)' }} />
      <aside style={{
        position: 'fixed', top: 0, bottom: 0, insetInlineEnd: 0,
        width: 'min(520px, 94vw)', background: '#fff', zIndex: 201,
        boxShadow: '-20px 0 60px -20px rgba(20,19,15,0.2)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '22px 24px', borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          background: cat.bg,
        }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: '#fff', color: cat.accent }}>
              {cat.name}
            </span>
            <h2 style={{ margin: '10px 0 0', fontSize: 22, fontWeight: 600, letterSpacing: -0.3, color: 'var(--ink)' }}>{uc.name}</h2>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', border: '1px solid var(--line)', fontSize: 16, color: 'var(--ink-2)', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px 40px' }}>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.75, marginBottom: 22 }}>{uc.desc}</div>

          <Section label="النمط الرئيسي المقترح">
            <div style={{ padding: '14px 16px', background: `oklch(0.97 0.02 ${pat.hue})`, borderRadius: 12, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `oklch(0.9 0.06 ${pat.hue})`, color: `oklch(0.35 0.15 ${pat.hue})`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>{pat.icon}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{pat.id || pat.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.65 }}>{pat.desc}</div>
              </div>
            </div>
          </Section>

          {caseTraits.length > 0 && (
            <Section label="الخصائص المقترحة">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {caseTraits.map(t => (
                  <span key={t.id} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'oklch(0.96 0.02 310)', color: 'oklch(0.4 0.12 310)' }}>
                    {t.label}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {(uc.suggestedSectors || []).length > 0 && (
            <Section label="القطاعات المقترحة">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(uc.suggestedSectors || []).map(sid => {
                  const c = categories.find(x => x.id === sid);
                  return (
                    <span key={sid} style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 999, background: c?.bg || 'var(--warm)', color: c?.accent || 'var(--ink-2)' }}>
                      {c?.name || sid}
                    </span>
                  );
                })}
              </div>
            </Section>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
            padding: '14px 16px', background: '#fbfaf7', borderRadius: 12,
            border: '1px solid var(--line)', marginBottom: 22,
          }}>
            <Pair label="نوع الجهة" value={uc.entity || '—'} />
            <Pair label="مثال" value={uc.example || '—'} />
          </div>
        </div>
        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--line)', display: 'flex', gap: 10, background: '#fbfaf7' }}>
          <AxBtn onClick={onEdit} icon="✎">تعديل</AxBtn>
          <AxBtn kind="danger" onClick={onDelete}>حذف</AxBtn>
        </div>
      </aside>
    </>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.4, marginBottom: 10, textTransform: 'uppercase' }}>{label}</div>
      {children}
    </div>
  );
}
function Pair({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

// ============================================================
// Categories (sectors)
// ============================================================
function AtlasCategoriesTab({ store, api, openEditor, confirmDelete }) {
  const counts = useMemoAT(() => {
    const m = {};
    store.cases.forEach(c => (c.suggestedSectors || []).forEach(s => { m[s] = (m[s] || 0) + 1; }));
    return m;
  }, [store.cases]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 40px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>القطاعات</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>تُستخدم لاقتراح الأنواع المناسبة لكل عميل حسب قطاعه</p>
        </div>
        <AxBtn icon="+" onClick={() => openEditor('category', {})}>قطاع جديد</AxBtn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {store.categories.map(c => (
          <div key={c.uid} style={{ padding: 18, background: '#fff', border: '1px solid var(--line)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: c.bg, border: `1px solid ${c.accent}22`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: c.accent,
              }}>{(c.short || c.name || '—').slice(0, 2)}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <IconBtn onClick={() => openEditor('category', c)}>✎</IconBtn>
                <IconBtn danger onClick={() => confirmDelete({
                  title: 'حذف القطاع',
                  message: `سيتم حذف "${c.name}" وستصبح ${counts[c.id] || 0} حالة بدون قطاع مقترح.`,
                  onConfirm: () => api.deleteCategory(c.uid),
                })}>×</IconBtn>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{c.name || c.id}</div>
              {c.brief && <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{c.brief}</div>}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px dashed var(--line)' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>عدد الأنواع</span>
              <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: c.accent }}>{counts[c.id] || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Patterns tab — 3 root patterns + traits overview
// ============================================================
function AtlasPatternsTab({ store, api, openEditor, confirmDelete }) {
  const { patterns, traits, cases } = store;
  const rootCounts = useMemoAT(() => {
    const m = {};
    cases.forEach(c => { if (c.suggestedRootPattern) m[c.suggestedRootPattern] = (m[c.suggestedRootPattern] || 0) + 1; });
    return m;
  }, [cases]);

  const traitsByGroup = useMemoAT(() => {
    const g = {};
    traits.forEach(t => {
      if (!g[t.group]) g[t.group] = [];
      g[t.group].push(t);
    });
    return g;
  }, [traits]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 40px 60px' }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>الأنماط الرئيسية</h2>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>كل مجتمع يُصنَّف بأحد الأنماط الثلاثة حصراً، ثم تُضاف له خصائص</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        {patterns.map(p => (
          <div key={p.uid} style={{
            padding: 20, background: '#fff',
            border: `1px solid oklch(0.9 0.04 ${p.hue})`, borderRadius: 14,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `oklch(0.94 0.05 ${p.hue})`, color: `oklch(0.35 0.15 ${p.hue})`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{p.icon}</div>
              <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: `oklch(0.35 0.15 ${p.hue})` }}>
                {rootCounts[p.id] || 0} نوع
              </span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{p.id}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 8 }}>{p.shortEn}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.7 }}>{p.desc}</div>
            </div>
            {(p.examples || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingTop: 10, borderTop: '1px dashed var(--line)' }}>
                {p.examples.map(ex => (
                  <span key={ex} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 999, background: `oklch(0.97 0.02 ${p.hue})`, color: `oklch(0.4 0.12 ${p.hue})` }}>
                    {ex}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>الخصائص التفصيلية</h3>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>تُضاف للمجتمع فوق النمط الرئيسي — يمكن اختيار أكثر من خاصية</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {Object.entries(traitsByGroup).map(([group, items]) => (
          <div key={group} style={{
            padding: 16, background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase' }}>{group}</div>
            {items.map(t => (
              <div key={t.uid} style={{
                padding: '8px 10px', borderRadius: 8,
                background: 'oklch(0.98 0.01 310)',
                display: 'flex', flexDirection: 'column', gap: 3,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{t.label}</span>
                  <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>
                    {(t.allowedRoots || []).join(' · ')}
                  </span>
                </div>
                {t.desc && <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{t.desc}</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  AtlasOverviewTab, AtlasCasesTab, AtlasCategoriesTab, AtlasPatternsTab,
  CaseDetailDrawer,
});
