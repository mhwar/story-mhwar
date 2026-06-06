// Use Cases reference view — standalone screen within the Mhwar templates app

const { useState: useStateUC, useMemo: useMemoUC } = React;

const CHANNEL_META = {
  'داخل المنصة': { color: 'oklch(0.5 0.12 250)', bg: 'oklch(0.96 0.02 250)', icon: '◆' },
  'إيميل':        { color: 'oklch(0.45 0.12 260)', bg: 'oklch(0.96 0.02 260)', icon: '✉' },
  'SMS':          { color: 'oklch(0.5 0.13 30)',   bg: 'oklch(0.96 0.025 30)', icon: '⊞' },
  'واتساب':       { color: 'oklch(0.5 0.15 145)',  bg: 'oklch(0.96 0.025 145)', icon: '●' },
  'إشعارات':      { color: 'oklch(0.52 0.14 60)',  bg: 'oklch(0.96 0.03 60)',  icon: '♦' },
};

function ucPatternMeta(id) {
  return window.UC_PATTERNS.find(p => p.id === id) || window.UC_PATTERNS[0];
}
function ucCatMeta(id) {
  return window.UC_CATEGORIES.find(c => c.id === id) || window.UC_CATEGORIES[0];
}

// ---------- Channel chip ----------
function ChannelChip({ name }) {
  const m = CHANNEL_META[name] || { color: 'var(--ink-2)', bg: 'var(--warm)', icon: '·' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px 3px 8px', borderRadius: 999,
      fontSize: 11, fontWeight: 500,
      background: m.bg, color: m.color,
    }}>
      <span style={{ fontSize: 9, opacity: 0.8 }}>{m.icon}</span>
      {name}
    </span>
  );
}

// ---------- Pattern badge ----------
function PatternBadge({ id, size = 'md' }) {
  const m = ucPatternMeta(id);
  const s = size === 'sm' ? { fs: 10.5, pad: '2px 8px', ic: 9 } : { fs: 11.5, pad: '4px 10px', ic: 10 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: s.pad, borderRadius: 999,
      fontSize: s.fs, fontWeight: 500,
      background: `oklch(0.96 0.025 ${m.hue})`,
      color: `oklch(0.4 0.12 ${m.hue})`,
    }}>
      <span style={{ fontSize: s.ic, opacity: 0.85 }}>{m.icon}</span>
      {id}
    </span>
  );
}

// ---------- KPI tile ----------
function KpiTile({ num, label, sub, accent }) {
  return (
    <div style={{
      padding: '18px 20px',
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 14,
      minWidth: 0,
    }}>
      <div style={{
        fontSize: 34, lineHeight: 1,
        fontWeight: 600, letterSpacing: -1.2,
        color: accent || 'var(--ink)',
        fontFeatureSettings: '"tnum"',
      }}>
        {num}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)', marginTop: 8 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.5 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ---------- Pattern card ----------
function PatternCard({ pat, active, onClick }) {
  const visLabel = pat.visible === 'no' ? 'العميل لا يرى محور' : pat.visible === 'yes' ? 'العميل يدخل المنصة' : 'مختلط';
  const visColor = pat.visible === 'no' ? 'oklch(0.55 0.08 240)' : pat.visible === 'yes' ? 'oklch(0.5 0.14 145)' : 'oklch(0.55 0.12 60)';
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'right',
        padding: '16px 18px',
        background: active ? `oklch(0.98 0.02 ${pat.hue})` : '#fff',
        border: active ? `1.5px solid oklch(0.65 0.15 ${pat.hue})` : '1px solid var(--line)',
        borderRadius: 14,
        display: 'flex', flexDirection: 'column', gap: 10,
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `oklch(0.94 0.04 ${pat.hue})`,
          color: `oklch(0.4 0.15 ${pat.hue})`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>{pat.icon}</div>
        <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: 1 }}>{pat.shortEn.toUpperCase()}</span>
      </div>
      <div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{pat.id}</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>{pat.desc}</div>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: 10.5, padding: '2px 8px', borderRadius: 999,
          background: `color-mix(in oklch, ${visColor} 10%, white)`,
          color: visColor, fontWeight: 500,
        }}>{visLabel}</span>
      </div>
    </button>
  );
}

// ---------- Use-case card ----------
function UseCaseCard({ uc, onOpen }) {
  const cat = ucCatMeta(uc.cat);
  const pat = ucPatternMeta(uc.pattern);
  return (
    <button
      onClick={onOpen}
      style={{
        textAlign: 'right',
        padding: 18,
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 14,
        display: 'flex', flexDirection: 'column', gap: 12,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.15s',
        minHeight: 240,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px -10px rgba(20,19,15,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontSize: 10.5, fontWeight: 500,
          padding: '3px 9px', borderRadius: 999,
          background: cat.bg, color: cat.accent,
        }}>{cat.short}</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
          #{String(uc.id).padStart(2, '0')}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.35 }}>
          {uc.name}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.65 }}>
          {uc.desc}
        </div>
      </div>
      <div style={{
        paddingTop: 12, marginTop: 'auto',
        borderTop: '1px dashed var(--line)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 0.5, marginBottom: 3 }}>الجهة</div>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink)' }}>{uc.entity}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>مثال: {uc.example}</div>
          </div>
          <PatternBadge id={uc.pattern} size="sm" />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {uc.channels.map(c => <ChannelChip key={c} name={c} />)}
        </div>
      </div>
    </button>
  );
}

// ---------- Detail drawer ----------
function UseCaseDetail({ uc, onClose }) {
  if (!uc) return null;
  const cat = ucCatMeta(uc.cat);
  const pat = ucPatternMeta(uc.pattern);
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.4)', zIndex: 200,
        backdropFilter: 'blur(2px)',
      }} />
      <aside style={{
        position: 'fixed', top: 0, bottom: 0, insetInlineEnd: 0,
        width: 'min(520px, 94vw)',
        background: '#fff', zIndex: 201,
        boxShadow: '-20px 0 60px -20px rgba(20,19,15,0.2)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '22px 24px',
          borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          background: cat.bg,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                fontSize: 10.5, fontWeight: 600,
                padding: '3px 10px', borderRadius: 999,
                background: '#fff', color: cat.accent,
              }}>{cat.id}</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>#{String(uc.id).padStart(2, '0')}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.3, color: 'var(--ink)' }}>{uc.name}</h2>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 10,
            background: '#fff', border: '1px solid var(--line)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: 'var(--ink-2)',
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px 40px' }}>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.75, marginBottom: 22 }}>
            {uc.desc}
          </div>

          <DetailSection label="القيمة المضافة من محور">
            <div style={{
              padding: '14px 16px',
              background: 'oklch(0.98 0.015 60)',
              borderRadius: 12,
              border: '1px solid oklch(0.94 0.03 60)',
              fontSize: 13, lineHeight: 1.7, color: 'oklch(0.3 0.08 40)',
            }}>
              {uc.value}
            </div>
          </DetailSection>

          <DetailSection label="نمط التواصل">
            <div style={{
              padding: '14px 16px',
              background: `oklch(0.97 0.02 ${pat.hue})`,
              borderRadius: 12,
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `oklch(0.9 0.06 ${pat.hue})`,
                color: `oklch(0.35 0.15 ${pat.hue})`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>{pat.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{pat.id}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.65 }}>{pat.desc}</div>
              </div>
            </div>
          </DetailSection>

          <DetailGrid>
            <DetailPair label="نوع الجهة" value={uc.entity} />
            <DetailPair label="مثال" value={uc.example} />
          </DetailGrid>

          <DetailSection label="القنوات المستخدمة">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {uc.channels.map(c => <ChannelChip key={c} name={c} />)}
            </div>
          </DetailSection>

          <DetailSection label="هل العميل يدخل المنصة؟">
            <div style={{ fontSize: 13, color: 'var(--ink)', padding: '10px 14px', background: 'var(--warm)', borderRadius: 10 }}>
              {uc.visibility}
            </div>
          </DetailSection>
        </div>
      </aside>
    </>
  );
}

function DetailSection({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.4, marginBottom: 10, textTransform: 'uppercase' }}>
        {label}
      </div>
      {children}
    </div>
  );
}
function DetailPair({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{value}</div>
    </div>
  );
}
function DetailGrid({ children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
      padding: '14px 16px', background: '#fbfaf7', borderRadius: 12,
      border: '1px solid var(--line)',
      marginBottom: 22,
    }}>{children}</div>
  );
}

// ---------- Main view ----------
function UseCasesView() {
  const [activeCat, setActiveCat] = useStateUC('all');
  const [activePat, setActivePat] = useStateUC('all');
  const [query, setQuery] = useStateUC('');
  const [detailId, setDetailId] = useStateUC(null);

  const filtered = useMemoUC(() => {
    return window.USE_CASES.filter(uc => {
      if (activeCat !== 'all' && uc.cat !== activeCat) return false;
      if (activePat !== 'all' && uc.pattern !== activePat) return false;
      if (query) {
        const q = query.trim();
        const hay = `${uc.name} ${uc.desc} ${uc.entity} ${uc.example} ${uc.value}`;
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activeCat, activePat, query]);

  const catCounts = useMemoUC(() => {
    const m = {};
    window.USE_CASES.forEach(u => { m[u.cat] = (m[u.cat] || 0) + 1; });
    return m;
  }, []);

  const detailUC = detailId ? window.USE_CASES.find(u => u.id === detailId) : null;

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: 'oklch(0.985 0.003 240)',
      fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif',
      direction: 'rtl',
    }}>
      {/* Hero */}
      <div style={{
        padding: '40px 40px 28px',
        borderBottom: '1px solid var(--line)',
        background: 'linear-gradient(180deg, #fff 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
            Mhwar · Use Cases Atlas
          </div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 600, letterSpacing: -0.8, color: 'var(--ink)', lineHeight: 1.2 }}>
            حالات استخدام منصة محور
          </h1>
          <p style={{ fontSize: 14.5, color: 'var(--ink-2)', marginTop: 10, maxWidth: 780, lineHeight: 1.75 }}>
            مرجع شامل لـ 43 حالة استخدام عبر 10 قطاعات و 6 أنماط تواصل — أداة داخلية لفهم من يمكن أن يستخدم محور، بأي شكل، ومن أي قناة.
            انقر أي حالة لعرض التفاصيل الكاملة.
          </p>

          {/* KPIs */}
          <div style={{
            marginTop: 28,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
          }}>
            <KpiTile num="43" label="حالة استخدام" sub="موزّعة على 10 قطاعات" />
            <KpiTile num="10" label="قطاعات مستهدفة" sub="من الحوكمة للأوقاف" accent="oklch(0.5 0.14 30)" />
            <KpiTile num="6"  label="أنماط تواصل" sub="من الإرسال الخلفي للمجتمع المدفوع" accent="oklch(0.48 0.13 225)" />
            <KpiTile num="5"  label="قنوات متاحة" sub="منصة · إيميل · SMS · واتساب · إشعارات" accent="oklch(0.5 0.15 145)" />
          </div>
        </div>
      </div>

      {/* Patterns */}
      <div style={{ padding: '36px 40px 20px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.2 }}>
            أنماط التواصل الستة
          </h2>
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
            انقر نمطاً لتصفية الحالات
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {window.UC_PATTERNS.map(p => (
            <PatternCard
              key={p.id}
              pat={p}
              active={activePat === p.id}
              onClick={() => setActivePat(activePat === p.id ? 'all' : p.id)}
            />
          ))}
        </div>
      </div>

      {/* Filters + cases */}
      <div style={{
        padding: '28px 40px 60px',
        maxWidth: 1400, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '240px 1fr',
        gap: 28, alignItems: 'start',
      }}>
        {/* Category rail */}
        <aside style={{ position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>
            القطاعات
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CatItem
              label="الكل"
              count={window.USE_CASES.length}
              active={activeCat === 'all'}
              onClick={() => setActiveCat('all')}
              accent="var(--ink)"
            />
            {window.UC_CATEGORIES.map(c => (
              <CatItem
                key={c.id}
                label={c.id}
                count={catCounts[c.id] || 0}
                active={activeCat === c.id}
                onClick={() => setActiveCat(activeCat === c.id ? 'all' : c.id)}
                accent={c.accent}
                bg={c.bg}
                brief={c.brief}
              />
            ))}
          </div>
        </aside>

        {/* Cases */}
        <div>
          {/* Search + clear */}
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center',
            marginBottom: 18,
            padding: '10px 12px',
            background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
          }}>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>⌕</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث في الحالات، الجهات، الأمثلة..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 13.5, color: 'var(--ink)',
                fontFamily: 'inherit', background: 'transparent',
              }}
            />
            {(activeCat !== 'all' || activePat !== 'all' || query) && (
              <button
                onClick={() => { setActiveCat('all'); setActivePat('all'); setQuery(''); }}
                style={{
                  fontSize: 11.5, padding: '5px 12px', borderRadius: 999,
                  background: 'var(--warm)', color: 'var(--ink-2)',
                }}
              >مسح الفلاتر</button>
            )}
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', padding: '0 8px' }}>
              {filtered.length}/{window.USE_CASES.length}
            </span>
          </div>

          {/* Active filter pills */}
          {(activeCat !== 'all' || activePat !== 'all') && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {activeCat !== 'all' && (
                <span style={{
                  fontSize: 11.5, padding: '4px 10px', borderRadius: 999,
                  background: ucCatMeta(activeCat).bg, color: ucCatMeta(activeCat).accent,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  قطاع: {activeCat}
                  <button onClick={() => setActiveCat('all')} style={{ fontSize: 12, opacity: 0.6 }}>×</button>
                </span>
              )}
              {activePat !== 'all' && (
                <span style={{
                  fontSize: 11.5, padding: '4px 10px', borderRadius: 999,
                  background: `oklch(0.96 0.025 ${ucPatternMeta(activePat).hue})`,
                  color: `oklch(0.4 0.12 ${ucPatternMeta(activePat).hue})`,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  نمط: {activePat}
                  <button onClick={() => setActivePat('all')} style={{ fontSize: 12, opacity: 0.6 }}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: '#fff', border: '1px dashed var(--line)', borderRadius: 14,
              color: 'var(--muted)', fontSize: 13,
            }}>
              لا توجد حالات تطابق الفلاتر الحالية
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
            }}>
              {filtered.map(uc => (
                <UseCaseCard key={uc.id} uc={uc} onOpen={() => setDetailId(uc.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {detailUC && <UseCaseDetail uc={detailUC} onClose={() => setDetailId(null)} />}
    </div>
  );
}

function CatItem({ label, count, active, onClick, accent, bg, brief }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'right',
        padding: '10px 12px',
        borderRadius: 10,
        background: active ? (bg || 'var(--warm)') : 'transparent',
        border: active ? `1px solid ${accent}33` : '1px solid transparent',
        cursor: 'pointer',
        transition: 'background 0.15s',
        display: 'flex', flexDirection: 'column', gap: 3,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--warm)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? accent : 'var(--ink)' }}>
          {label}
        </span>
        <span className="mono" style={{
          fontSize: 10.5, padding: '1px 7px', borderRadius: 999,
          background: active ? '#fff' : 'var(--warm)', color: 'var(--muted)',
        }}>{count}</span>
      </div>
      {brief && (
        <span style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5 }}>
          {brief}
        </span>
      )}
    </button>
  );
}

Object.assign(window, { UseCasesView });
