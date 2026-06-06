// Reference sections — Terms, Privacy, SLA, Roadmap, Glossary.
// Terms/Privacy/SLA/Glossary: structure only, content pending.
// Roadmap: real content driven by UC_FEATURES_SEED.

// ---- Toast helper ----
(function ensureToastHost() {
  if (window.__mhwarToast) return;
  const host = document.createElement('div');
  host.id = 'mhwar-toast-host';
  host.style.cssText = 'position:fixed;top:16px;inset-inline-start:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
  document.body.appendChild(host);
  window.__mhwarToast = (msg, kind='ok') => {
    const el = document.createElement('div');
    const bg = kind === 'err' ? 'oklch(0.55 0.2 25)' : 'oklch(0.35 0.15 145)';
    el.style.cssText = `background:${bg};color:#fff;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:500;box-shadow:0 6px 20px rgba(0,0,0,.15);opacity:0;transition:opacity .2s,transform .2s;transform:translateY(-6px);pointer-events:auto;font-family:inherit;`;
    el.textContent = msg;
    host.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-6px)';
      setTimeout(() => el.remove(), 300);
    }, 1800);
  };
})();

// ---- Drag state (readable during dragover) ----
window.__mhwarDrag = window.__mhwarDrag || { famId: null, featureId: null };

// ---- Shared printable-document helper (used by SLA / Terms / Privacy / Features downloads) ----
function refPrintDoc(title, bodyHtml, accent = 'oklch(0.45 0.18 270)') {
  const w = window.open('', '_blank', 'width=900,height=1100');
  if (!w) { window.__mhwarToast?.('فضلاً اسمح بالنوافذ المنبثقة للتنزيل', 'err'); return; }
  const date = new Date().toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });
  w.document.write(`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${title} — محور</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box} body{font-family:'IBM Plex Sans Arabic',system-ui,sans-serif;color:#14130f;max-width:820px;margin:0 auto;padding:48px 40px;line-height:1.8}
    .brand{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ${accent};padding-bottom:16px;margin-bottom:8px}
    .brand .logo{font-size:22px;font-weight:700}.brand .logo small{font-size:11px;color:#8a877f;font-weight:500;margin-inline-start:6px;letter-spacing:2px}
    .brand .tag{font-size:11px;color:#fff;background:${accent};padding:4px 12px;border-radius:999px;font-weight:600}
    h1{font-size:28px;margin:18px 0 4px}.lead{color:#6b6a64;font-size:14px;margin:0 0 26px}
    h2{font-size:18px;margin:30px 0 10px;padding-bottom:6px;border-bottom:1px solid #ece9e3}
    h3{font-size:14px;margin:20px 0 8px;color:#444}
    p{font-size:13.5px;margin:0 0 12px}ul,ol{font-size:13.5px;padding-inline-start:22px;margin:0 0 14px}li{margin-bottom:6px}
    table{width:100%;border-collapse:collapse;margin:8px 0 18px;font-size:12.5px}
    th{background:#faf7f0;text-align:start;padding:10px 12px;border:1px solid #ece9e3;font-weight:600;color:#555}
    td{padding:10px 12px;border:1px solid #ece9e3;vertical-align:top}td.f{font-weight:600;white-space:nowrap}
    .note{background:#f4f6fb;border:1px solid #e2e7f2;border-radius:10px;padding:13px 15px;font-size:12.5px;margin:6px 0 16px}
    .pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:600;background:#eee}
    .foot{margin-top:40px;padding-top:14px;border-top:1px solid #ece9e3;display:flex;justify-content:space-between;font-size:11px;color:#8a877f}
    @media print{body{padding:24px}.note{-webkit-print-color-adjust:exact;print-color-adjust:exact}th{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
    <div class="brand"><div class="logo">محور<small>MHWAR</small></div><div class="tag">${title}</div></div>
    ${bodyHtml}
    <div class="foot"><span>محور — وثيقة مرجعيّة</span><span>${date}</span></div>
    <script>window.onload=()=>setTimeout(()=>window.print(),500)</script>
  </body></html>`);
  w.document.close();
}

// ---- SLA document body (mirrors the SlaSection tabs) ----
function buildSlaDocHtml() {
  return `
    <h1>اتفاقيّة مستوى الخدمة (SLA)</h1>
    <p class="lead">وعود الأداء والتوفّر لعملاء منصّة محور — التزامات مُقاسة وقابلة للتدقيق.</p>

    <h2>١. الالتزام الأساسي بالتوفّر</h2>
    <table><thead><tr><th>الباقة</th><th>هدف التوفّر الشهري</th><th>طبيعة الالتزام</th></tr></thead><tbody>
      <tr><td class="f">المجتمع</td><td>—</td><td>بذل أفضل جهد (بدون ضمان تعاقدي)</td></tr>
      <tr><td class="f">النمو</td><td>99.5٪</td><td>هدف معلن</td></tr>
      <tr><td class="f">المؤسّسة</td><td>99.9٪</td><td>التزام تعاقدي ملزم (SLA)</td></tr>
    </tbody></table>
    <div class="note"><b>آليّة الاحتساب:</b> التوفّر = (دقائق الشهر − دقائق التعطّل غير المخطّط) ÷ دقائق الشهر × 100، تُقاس عبر منصّة مراقبة مستقلّة 24×7. الصيانة المجدولة (إشعار 72 ساعة، بحدّ 4 ساعات شهريّاً، خارج أوقات الذروة) لا تُحتسب ضمن التعطّل.</div>

    <h2>٢. مستويات الخطورة وأزمنة الاستجابة</h2>
    <table><thead><tr><th>الدرجة</th><th>التعريف</th><th>زمن الردّ</th><th>زمن الحلّ المستهدف</th></tr></thead><tbody>
      <tr><td class="f">P1 حرِجة</td><td>توقّف كامل أو تعذّر الإرسال لكل المستخدمين</td><td>30 دقيقة</td><td>4 ساعات</td></tr>
      <tr><td class="f">P2 عالية</td><td>تعطّل ميزة أساسيّة دون بديل</td><td>ساعتان</td><td>يوم عمل</td></tr>
      <tr><td class="f">P3 متوسّطة</td><td>خلل جزئيّ مع حلّ بديل مؤقّت</td><td>8 ساعات عمل</td><td>3 أيّام عمل</td></tr>
      <tr><td class="f">P4 منخفضة</td><td>استفسار أو طلب تحسين أو خلل تجميليّ</td><td>يوم عمل</td><td>حسب خطّة الإصدار</td></tr>
    </tbody></table>
    <div class="note">P1 وP2 على مدار الساعة (24×7) · P3 وP4 ضمن ساعات العمل الرسميّة.</div>

    <h2>٣. قنوات الدعم والتصعيد</h2>
    <table><thead><tr><th>القناة</th><th>التغطية</th><th>الإتاحة</th><th>الباقة</th></tr></thead><tbody>
      <tr><td class="f">منتدى المجتمع</td><td>أسئلة عامّة ومشاركة المعرفة</td><td>دائم</td><td>الكل</td></tr>
      <tr><td class="f">البريد والتذاكر</td><td>كل الدرجات مع تتبّع الحالة</td><td>24×7 استقبال</td><td>النمو فأعلى</td></tr>
      <tr><td class="f">الدردشة المباشرة</td><td>دعم سريع خلال ساعات العمل</td><td>بريد 24 ساعة + دردشة</td><td>النمو فأعلى</td></tr>
      <tr><td class="f">مدير حساب مخصّص</td><td>نقطة تواصل + قناة Slack/واتساب</td><td>أيّام العمل</td><td>المؤسّسة</td></tr>
      <tr><td class="f">خطّ الطوارئ (P1)</td><td>هاتف/واتساب للحوادث الحرِجة فقط</td><td>24×7</td><td>المؤسّسة</td></tr>
    </tbody></table>

    <h2>٤. تعويضات الإخلال (Service Credits)</h2>
    <table><thead><tr><th>التوفّر الشهري المُحقّق</th><th>التعويض (من الاشتراك الشهري)</th></tr></thead><tbody>
      <tr><td class="f">أقل من 99.9٪ وحتى 99.0٪</td><td>رصيد 10٪</td></tr>
      <tr><td class="f">أقل من 99.0٪ وحتى 95.0٪</td><td>رصيد 25٪</td></tr>
      <tr><td class="f">أقل من 95.0٪</td><td>رصيد 50٪</td></tr>
    </tbody></table>
    <div class="note"><b>شروط المطالبة:</b> تُقدّم خلال 30 يوماً من الحادثة، وتُضاف كرصيد على الفاتورة التالية (لا تُصرف نقداً). السقف السنوي: شهر اشتراك واحد.</div>

    <h2>٥. الاستثناءات</h2>
    <ul>
      <li>الصيانة المجدولة المُعلَن عنها مسبقاً (إشعار 72 ساعة).</li>
      <li>أعطال خارجة عن سيطرة محور: مزوّدو Meta / AWS / مشغّلو الاتصالات.</li>
      <li>سوء استخدام العميل أو تجاوز الحدود التعاقديّة أو مخالفة سياسة الاستخدام.</li>
      <li>القوّة القاهرة (كوارث، انقطاعات إقليميّة، قرارات تنظيميّة طارئة).</li>
      <li>إعدادات أو تكاملات من طرف العميل تتسبّب في الخلل.</li>
    </ul>
    <div class="note">تُوثّق كل حادثة كبرى في تقرير ما بعد الحادثة (RCA) خلال 5 أيّام عمل، متضمّناً السبب الجذري والإجراءات الوقائيّة.</div>

    <h2>٦. التقارير والمراجعة</h2>
    <table><thead><tr><th>النوع</th><th>المحتوى</th><th>التكرار</th></tr></thead><tbody>
      <tr><td class="f">تقرير التوفّر الشهري</td><td>نسبة التوفّر، الحوادث، التعويضات المستحقّة</td><td>شهري</td></tr>
      <tr><td class="f">تقرير ما بعد الحادثة (RCA)</td><td>السبب الجذري والإجراءات التصحيحيّة</td><td>عند كل حادثة كبرى</td></tr>
      <tr><td class="f">مراجعة الأعمال الدوريّة</td><td>الأداء، خارطة الطريق، التوصيات</td><td>ربع سنويّة</td></tr>
      <tr><td class="f">لوحة الحالة المباشرة</td><td>حالة الخدمات الآنيّة + سجلّ الحوادث</td><td>مباشر (24×7)</td></tr>
    </tbody></table>`;
}

// ---- Features catalogue document body (from live features store / seed) ----
function buildFeaturesDocHtml() {
  const fams = window.UC_FEATURE_FAMILIES || [];
  const feats = (window.featuresStore?.getMerged?.() || window.UC_FEATURES_SEED || []);
  const statusLabel = { live: 'منشور', dev: 'قيد التطوير', planned: 'مخطّط', idea: 'مقترح' };
  let body = `<h1>مميّزات منصّة محور</h1><p class="lead">مرجع شامل لقدرات المنصّة موزّعة على العائلات — مع حالة كل ميزة.</p>`;
  fams.forEach(fam => {
    const rows = feats.filter(f => f.family === fam.id);
    if (!rows.length) return;
    body += `<h2>${fam.icon || ''} ${fam.label}</h2><table><thead><tr><th>الميزة</th><th>الوصف</th><th>الحالة</th></tr></thead><tbody>`;
    rows.forEach(f => {
      body += `<tr><td class="f">${f.name}</td><td>${f.shortAr || f.desc || ''}</td><td>${statusLabel[f.status] || f.status || ''}</td></tr>`;
    });
    body += `</tbody></table>`;
  });
  return body;
}

Object.assign(window, { refPrintDoc, buildSlaDocHtml, buildFeaturesDocHtml });


// ---- Inline status quick pill (used by Roadmap cards) ----
function StatusQuickPill({ feature }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const STATUSES = [
    { id: 'live',    label: 'منشور',       bg: '#e3f1ea', fg: '#2f8a5a' },
    { id: 'dev',     label: 'قيد التطوير', bg: '#fbeedb', fg: '#a7741a' },
    { id: 'planned', label: 'مخطّط',       bg: '#e4ecf7', fg: '#3954a0' },
    { id: 'idea',    label: 'فكرة',        bg: '#ebe7f3', fg: '#594799' },
    { id: 'on_hold', label: 'مؤجّل',       bg: '#f4e4e4', fg: '#9a3c3c' },
  ];
  const cur = STATUSES.find(s => s.id === feature.status) || STATUSES[3];
  const apply = (s) => {
    const patch = { status: s.id };
    if (s.id === 'live') patch.shipped_at = new Date().toISOString().slice(0, 10);
    window.featuresStore?.update(feature.id, patch);
    window.__mhwarToast?.(`تم التحديث إلى: ${s.label}`, 'ok');
    setOpen(false);
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        title="تغيير الحالة"
        style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 10,
          background: cur.bg, color: cur.fg, border: '1px solid transparent',
          cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
        <span style={{ width: 5, height: 5, borderRadius: 3, background: cur.fg }}/>
        {cur.label}
        <span style={{ fontSize: 8, opacity: 0.6 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', insetInlineEnd: 0, marginTop: 4,
          background: '#fff', border: '1px solid var(--line)', borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,.12)', padding: 4, minWidth: 130, zIndex: 50,
        }}>
          {STATUSES.map(s => (
            <button key={s.id} onClick={(e) => { e.stopPropagation(); apply(s); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '6px 8px', border: 'none', background: s.id === cur.id ? '#faf7f0' : 'transparent',
                borderRadius: 4, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                color: 'var(--ink)', textAlign: 'start',
              }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: s.fg }}/>
              {s.label}
              {s.id === cur.id && <span style={{ marginInlineStart: 'auto', color: 'var(--muted)', fontSize: 11 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const { useState: useStateRS } = React;

function RefSection({ data }) {
  // Terms & Privacy are fully designed docs — delegate.
  if ((data?.refId === 'terms' || data?.refId === 'privacy') && typeof window.LegalDoc === 'function') {
    return <window.LegalDoc data={{ docKey: data.refId }}/>;
  }

  const cfgId = data?.refId || 'terms';
  const cfg = REF_SECTIONS[cfgId] || REF_SECTIONS['terms'];
  const [activeTab, setActiveTab] = useStateRS(cfg.tabs[0]?.id);
  React.useEffect(() => { setActiveTab(cfg.tabs[0]?.id); }, [data?.refId]);

  // Roadmap gets a real body
  const isRoadmap = cfgId === 'roadmap';

  return (
    <div style={refStyles.root} dir="rtl">
      <div style={refStyles.hero}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, maxWidth: 1080, margin: '0 auto' }}>
          <div style={refStyles.iconWrap}>{cfg.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={refStyles.eyebrow}>MHWAR · INTERNAL REFERENCE</div>
            <h1 style={refStyles.title}>{cfg.title}</h1>
            <div style={refStyles.subtitle}>{cfg.subtitle}</div>
            <div style={refStyles.desc}>{cfg.desc}</div>
          </div>
          <div style={refStyles.statusBadge}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: isRoadmap ? '#52a967' : '#cfa54a', display: 'inline-block' }}/>
            <span>{isRoadmap ? 'مُحدّث ديناميكياً' : 'مسودّة أولية'}</span>
          </div>
          {cfgId === 'sla' && (
            <button onClick={() => window.refPrintDoc('اتفاقية مستوى الخدمة (SLA)', window.buildSlaDocHtml())}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: 'var(--ink)', color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              ⭳ تنزيل الاتفاقية
            </button>
          )}
        </div>
      </div>

      {isRoadmap && <RoadmapProgressBar/>}

      {/* Inner tabs */}
      <div style={refStyles.tabBar}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {cfg.tabs.map((t, i) => {
            const active = activeTab === t.id;
            const count = isRoadmap ? roadmapCount(t.id) : t.count;
            // Allow drop on status tabs to reassign a feature
            const STATUS_TAB_MAP = { now: 'dev', next: 'planned', later: 'idea', shipped: 'live' };
            const targetStatus = isRoadmap ? STATUS_TAB_MAP[t.id] : null;
            // Section divider — show before tabs that begin a new section
            const showSectionLabel = isRoadmap && t.sectionLabel;
            return (
              <React.Fragment key={t.id}>
                {showSectionLabel && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: 'var(--faint)',
                    letterSpacing: 1.4, textTransform: 'uppercase',
                    padding: '0 10px', marginInlineStart: i === 0 ? 0 : 8,
                    borderInlineStart: i === 0 ? 'none' : '1px solid var(--line)',
                    alignSelf: 'stretch', display: 'inline-flex', alignItems: 'center',
                  }}>{t.sectionLabel}</span>
                )}
                <button
                onClick={() => setActiveTab(t.id)}
                onDragOver={(e) => {
                  if (!targetStatus) return;
                  if (e.dataTransfer.types.includes('text/feature-id')) {
                    e.preventDefault();
                    e.currentTarget.style.background = 'oklch(0.94 0.08 145)';
                  }
                }}
                onDragLeave={(e) => {
                  if (!targetStatus) return;
                  e.currentTarget.style.background = active ? '#fff' : 'transparent';
                }}
                onDrop={(e) => {
                  if (!targetStatus) return;
                  const fid = e.dataTransfer.getData('text/feature-id');
                  if (fid) {
                    e.preventDefault();
                    const patch = { status: targetStatus };
                    if (targetStatus === 'live') patch.shipped_at = new Date().toISOString().slice(0, 10);
                    window.featuresStore?.update(fid, patch);
                    window.__mhwarToast?.(`تم تغيير الحالة إلى: ${t.label}`, 'ok');
                    setActiveTab(t.id);
                  }
                  e.currentTarget.style.background = active ? '#fff' : 'transparent';
                }}
                style={{
                  padding: '10px 16px',
                  background: active ? '#fff' : 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
                  color: active ? 'var(--ink)' : 'var(--muted)',
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  fontFamily: 'inherit', cursor: 'pointer',
                  transition: 'color 0.15s, background 0.15s',
                }}>
                {t.label}
                {count != null && (
                  <span className="mono" style={{
                    marginInlineStart: 6, fontSize: 10.5,
                    color: active ? 'var(--muted)' : 'var(--faint)',
                  }}>{count}</span>
                )}
              </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={refStyles.body}>
        <div style={{ maxWidth: isRoadmap ? 1080 : 720, margin: '0 auto' }}>
          {isRoadmap
            ? <RoadmapTab tabId={activeTab}/>
            : cfgId === 'glossary'
              ? <GlossarySection/>
              : cfgId === 'sla'
                ? <SlaSection tabId={activeTab}/>
                : <EmptyTab tab={cfg.tabs.find(t => t.id === activeTab) || cfg.tabs[0]}/>
          }
        </div>
      </div>
    </div>
  );
}

function EmptyTab({ tab }) {
  return (
    <div style={refStyles.emptyCard}>
      <div style={refStyles.emptyIcon}>○</div>
      <div style={refStyles.emptyTitle}>{tab.label}</div>
      <div style={refStyles.emptyDesc}>{tab.desc || 'المحتوى سيُضاف لاحقاً.'}</div>
      <div style={refStyles.emptyMono}>draft · pending content</div>
    </div>
  );
}

// ===== Roadmap logic =====

function roadmapCount(tabId) {
  const features = ((window.featuresStore ? window.featuresStore.getMerged() : window.UC_FEATURES_SEED) || []);
  if (tabId === 'overview')  return features.length;
  if (tabId === 'plan')      return features.length;
  if (tabId === 'catalog')   return features.filter(f => f.status === 'live').length;
  if (tabId === 'phases')    return 4;
  if (tabId === 'swim')     return (window.UC_FEATURE_FAMILIES || []).length;
  if (tabId === 'status')   return features.filter(f => ['live','dev','planned','idea'].includes(f.status)).length;
  if (tabId === 'principles') return 3;
  return null;
}

// Quarter id → swimlane phase number
const QUARTER_TO_PHASE = {
  'q4_2025': 1, 'q1_2026': 1, 'q2_2026': 1,
  'q3_2026': 2,
  'q4_2026': 3,
  'q1_2027': 4, 'backlog': 4,
};

// Phase assignment rule: stored quarter wins; fallback to status+priority heuristics
function roadmapPhaseOf(f) {
  if (f.status === 'live') return 1;
  if (f.quarter && QUARTER_TO_PHASE[f.quarter] !== undefined) return QUARTER_TO_PHASE[f.quarter];
  if (f.status === 'dev')  return (f.priority === 'p0' || f.priority === 'p1') ? 1 : 2;
  if (f.status === 'planned') {
    if (f.priority === 'p0' || f.priority === 'p1') return 2;
    if (f.priority === 'p2') return 3;
    return 4;
  }
  return 4; // idea
}

const ROADMAP_PHASES = [
  { n: 1, label: 'المرحلة الحالية',  title: 'الأساس يعمل',            sub: 'كل ما يشغّل محور اليوم للعملاء الحاليين — قنوات معتمدة، فعاليات، مجتمعات، هوية، قياس.', q: 'Q2 · 2026', range: 'منشور الآن',          status: 'live',    color: '#2f8a5a', soft: '#e3f1ea' },
  { n: 2, label: 'الربع القادم',      title: 'استقلالية العميل',       sub: 'BYO-Meta و BYO-Email، شرائح ديناميكية، رحلات آلية، شراكات الدفع، دخول البوّابات — كلها تمنح العميل تحكّماً أعمق.', q: 'Q3 · 2026', range: 'يوليو — سبتمبر',     status: 'dev',     color: '#c78a1e', soft: '#f7eed9' },
  { n: 3, label: 'نصف السنة الثاني',  title: 'التوسّع والحوكمة',        sub: 'حوكمة المجالس، دفع وفوترة متكاملة، AI للصياغة، نطاق مخصّص، A/B وحملات متعدّدة الخطوات.', q: 'Q4 · 2026', range: 'أكتوبر — ديسمبر',     status: 'planned', color: '#3d3a8c', soft: '#ecebf7' },
  { n: 4, label: 'ما بعد ٢٠٢٦',        title: 'قدرات متقدّمة (تحت الدراسة)', sub: 'قنوات جديدة، ذكاء اصطناعي متقدّم، تكاملات نظام بيئي — مقترحات غير مؤكّدة تعتمد على إشارات السوق.', q: '2027+',      range: 'قيد الدراسة',          status: 'idea',    color: '#7a5fb0', soft: '#eee8f5' },
];

function RoadmapTab({ tabId }) {
  // All hooks must be at the top, before any early return
  const [,_fr] = React.useState(0);
  React.useEffect(() => window.featuresStore?.subscribe(() => _fr(x=>x+1)), []);

  const VIEW_KEY = `mhwar:roadmap:view:${tabId}`;
  const [view, setView] = React.useState(() => {
    try { return localStorage.getItem(VIEW_KEY) || (tabId === 'status' ? 'kanban' : 'kanban'); } catch { return 'kanban'; }
  });
  const setViewPersist = (v) => {
    setView(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch {}
  };

  // Status filter (only used when tabId === 'status')
  const STATUS_KEY = 'mhwar:roadmap:status-filter';
  const [statusFilter, setStatusFilter] = React.useState(() => {
    try { return localStorage.getItem(STATUS_KEY) || 'all'; } catch { return 'all'; }
  });
  const setStatusFilterPersist = (v) => {
    setStatusFilter(v);
    try { localStorage.setItem(STATUS_KEY, v); } catch {}
  };

  // Early returns for structural tabs
  if (tabId === 'overview')   return <RoadmapOverview/>;
  if (tabId === 'plan')       return <RoadmapPlan/>;
  if (tabId === 'catalog')    return <RoadmapLiveCatalog/>;
  if (tabId === 'phases')     return <RoadmapPhases/>;
  if (tabId === 'swim')       return <RoadmapSwim/>;
  if (tabId === 'principles') return <RoadmapPrinciples/>;

  // Unified status tab: all four statuses in one place, with a filter chip row
  const allFeatures = (window.featuresStore ? window.featuresStore.getMerged() : window.UC_FEATURES_SEED) || [];
  const features = statusFilter === 'all'
    ? allFeatures.filter(f => ['live','dev','planned','idea'].includes(f.status))
    : allFeatures.filter(f => f.status === statusFilter);
  const families  = window.UC_FEATURE_FAMILIES || [];
  const priorities = window.UC_FEATURE_PRIORITIES || [];

  const STATUS_CHIPS = [
    { id: 'all',     label: 'الكل',         color: '#6b6b6b' },
    { id: 'live',    label: 'منشور',        color: '#3e7d50' },
    { id: 'dev',     label: 'قيد التنفيذ',  color: '#d4a63c' },
    { id: 'planned', label: 'الربع القادم', color: '#5a6fb8' },
    { id: 'idea',    label: 'لاحقاً',       color: '#8b6fb8' },
  ];
  const statusCount = (id) => id === 'all'
    ? allFeatures.filter(f => ['live','dev','planned','idea'].includes(f.status)).length
    : allFeatures.filter(f => f.status === id).length;

  return (
    <div>
      {/* Tab intro + view switch + status filter */}
      <div style={refStyles.tabIntro}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>حالة التنفيذ</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{features.length} ميزة</div>
          <div style={{ marginInlineStart: 'auto' }}>
            <ViewSwitch value={view} onChange={setViewPersist}/>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7, maxWidth: 720, marginBottom: 14 }}>
          كل الميزات في مكان واحد — مجمّعة حسب الحالة. استخدم الشرائح للتركيز على حالة واحدة، أو اسحب البطاقات بين الحالات لتحديث التنفيذ.
        </div>
        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUS_CHIPS.map(s => {
            const active = statusFilter === s.id;
            const n = statusCount(s.id);
            return (
              <button key={s.id} onClick={() => setStatusFilterPersist(s.id)}
                onDragOver={(e) => {
                  if (s.id !== 'all') {
                    e.preventDefault();
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${s.color}`;
                  }
                }}
                onDragLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                onDrop={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  if (s.id === 'all') return;
                  const fid = e.dataTransfer.getData('text/feature-id');
                  if (!fid) return;
                  const patch = { status: s.id };
                  if (s.id === 'live') patch.shipped_at = new Date().toISOString().slice(0, 10);
                  window.featuresStore?.update(fid, patch);
                  window.__mhwarToast?.(`تم النقل إلى: ${s.label}`, 'ok');
                }}
                style={{
                  padding: '6px 12px', borderRadius: 999,
                  border: `1px solid ${active ? s.color : 'var(--line)'}`,
                  background: active ? s.color : '#fff',
                  color: active ? '#fff' : 'var(--ink)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'all .15s',
                }}>
                <span style={{
                  width: 7, height: 7, borderRadius: 4,
                  background: active ? '#fff' : s.color,
                  opacity: active ? .9 : 1,
                }}/>
                <span>{s.label}</span>
                <span className="mono" style={{
                  fontSize: 10, opacity: .8,
                  padding: '1px 5px', borderRadius: 8,
                  background: active ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.05)',
                }}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {view === 'list'   && <RoadmapListView features={features} families={families} priorities={priorities} tabId={tabId}/>}
      {view === 'kanban' && <RoadmapKanbanView features={features} families={families} priorities={priorities} tabId={tabId}/>}
      {view === 'gantt'  && <RoadmapGanttView features={features} families={families} priorities={priorities} tabId={tabId}/>}

      {features.length === 0 && (
        <div style={refStyles.emptyCard}>
          <div style={refStyles.emptyIcon}>○</div>
          <div style={refStyles.emptyTitle}>لا يوجد عناصر هنا</div>
          <div style={refStyles.emptyDesc}>اختر حالة أخرى من الشرائح أعلاه.</div>
        </div>
      )}
    </div>
  );
}

// ===== View switch =====
function ViewSwitch({ value, onChange }) {
  const items = [
    { id: 'kanban', label: 'كانبان',  icon: '▦' },
    { id: 'gantt',  label: 'جانت',    icon: '▬' },
    { id: 'list',   label: 'قائمة',   icon: '≡' },
  ];
  return (
    <div style={{
      display: 'inline-flex', gap: 2, padding: 3,
      background: '#f5f2ec', borderRadius: 8, border: '1px solid var(--line)',
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => onChange(it.id)}
          style={{
            padding: '5px 11px', fontSize: 12, borderRadius: 6,
            background: value === it.id ? '#fff' : 'transparent',
            color: value === it.id ? 'var(--ink)' : 'var(--muted)',
            border: value === it.id ? '1px solid var(--line)' : '1px solid transparent',
            cursor: 'pointer', fontFamily: 'inherit',
            fontWeight: value === it.id ? 600 : 500,
            boxShadow: value === it.id ? '0 1px 2px rgba(0,0,0,.04)' : 'none',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
          <span style={{ opacity: 0.6, fontSize: 11 }}>{it.icon}</span>
          {it.label}
        </button>
      ))}
    </div>
  );
}

// ===== List view (grouped by family) =====
function RoadmapListView({ features, families, priorities, tabId }) {
  const grouped = {};
  for (const f of features) {
    (grouped[f.family] = grouped[f.family] || []).push(f);
  }
  for (const k of Object.keys(grouped)) {
    grouped[k].sort((a, b) => {
      const rA = priorities.find(p => p.id === a.priority)?.rank || 0;
      const rB = priorities.find(p => p.id === b.priority)?.rank || 0;
      return rB - rA;
    });
  }
  return (
    <div>
      {families.filter(fam => grouped[fam.id]?.length).map(fam => (
        <div key={fam.id} style={{ marginBottom: 36 }}>
          <div style={refStyles.familyHeader}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: `hsl(${fam.hue} 45% 96%)`,
              color: `hsl(${fam.hue} 55% 35%)`,
              display: 'grid', placeItems: 'center',
              fontSize: 14,
            }}>{fam.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{fam.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{fam.desc}</div>
            </div>
            <div style={{ marginInlineStart: 'auto' }} className="mono">
              <span style={{ fontSize: 11, color: 'var(--faint)' }}>{grouped[fam.id].length}</span>
            </div>
          </div>
          <div style={refStyles.featureGrid}>
            {grouped[fam.id].map(f => (
              <RoadmapCard key={f.id} feature={f} priorities={priorities} tabId={tabId}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== Kanban view — columns by priority =====
function RoadmapKanbanView({ features, families, priorities, tabId }) {
  // Priority columns — p0..p3
  const cols = [
    { id: 'p0', label: 'حرِج · P0',  sub: 'يجب أن يُنجز أولاً', hue: 10,  color: '#b83c28', soft: '#fde8e4' },
    { id: 'p1', label: 'مرتفع · P1', sub: 'أهمية عالية',        hue: 38,  color: '#a7741a', soft: '#fcefd9' },
    { id: 'p2', label: 'عادي · P2',  sub: 'ضمن الخطة',          hue: 145, color: '#2f7a4a', soft: '#e3f2e9' },
    { id: 'p3', label: 'منخفض · P3', sub: 'غير مُلِحّ',          hue: 240, color: '#4a5680', soft: '#ebeef7' },
  ];
  const famById = Object.fromEntries(families.map(f => [f.id, f]));
  const byPri = Object.fromEntries(cols.map(c => [c.id, []]));
  features.forEach(f => { if (byPri[f.priority]) byPri[f.priority].push(f); });

  return (
    <div style={{
      display: 'grid', gap: 12,
      gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
      overflowX: 'auto',
    }}>
      {cols.map(col => (
        <div key={col.id}
          onDragOver={(e) => {
            if (!e.dataTransfer.types.includes('text/feature-id')) return;
            e.preventDefault();
            e.currentTarget.style.background = col.soft;
          }}
          onDragLeave={(e) => { e.currentTarget.style.background = '#fbfaf6'; }}
          onDrop={(e) => {
            const fid = e.dataTransfer.getData('text/feature-id');
            e.currentTarget.style.background = '#fbfaf6';
            if (!fid) return;
            e.preventDefault();
            window.featuresStore?.update(fid, { priority: col.id });
            window.__mhwarToast?.(`الأولوية: ${col.label}`, 'ok');
          }}
          style={{
            background: '#fbfaf6', borderRadius: 10,
            border: '1px solid var(--line)',
            padding: 12, minHeight: 320,
            display: 'flex', flexDirection: 'column', gap: 10,
            transition: 'background .15s',
          }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            paddingBottom: 10, borderBottom: `2px solid ${col.color}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: col.soft, color: col.color,
              display: 'grid', placeItems: 'center',
              fontSize: 10, fontFamily: 'var(--mono, monospace)', fontWeight: 700,
            }}>{col.id.toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{col.label}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{col.sub}</div>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{byPri[col.id].length}</div>
          </div>

          {byPri[col.id].length === 0 && (
            <div style={{
              fontSize: 11, color: 'var(--faint)', textAlign: 'center',
              padding: '22px 10px', border: '1px dashed var(--line)', borderRadius: 8,
            }}>لا شيء هنا</div>
          )}

          {byPri[col.id].map(f => {
            const fam = famById[f.family];
            return (
              <div key={f.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/feature-id', f.id);
                  e.dataTransfer.setData('text/feature-fam', f.family);
                  e.dataTransfer.effectAllowed = 'move';
                  window.__mhwarDrag = { famId: f.family, featureId: f.id };
                }}
                onDragEnd={() => { window.__mhwarDrag = { famId: null, featureId: null }; }}
                onClick={() => window.openFeatureEditor?.(f.id)}
                style={{
                  padding: 10, background: '#fff',
                  border: '1px solid var(--line)', borderRadius: 8,
                  cursor: 'grab', transition: 'transform .12s, box-shadow .12s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  position: 'absolute', top: 0, insetInlineStart: 0, bottom: 0,
                  width: 3, borderRadius: '8px 0 0 8px',
                  background: col.color,
                }}/>
                <div style={{ paddingInlineStart: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    {fam && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 10, padding: '1px 6px', borderRadius: 4,
                        background: `hsl(${fam.hue} 45% 96%)`,
                        color: `hsl(${fam.hue} 55% 35%)`,
                      }}>
                        <span style={{ fontSize: 10 }}>{fam.icon}</span>
                        {fam.label}
                      </span>
                    )}
                    <div style={{ marginInlineStart: 'auto' }} onClick={(e) => e.stopPropagation()}>
                      <StatusQuickPill feature={f}/>
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 3 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.55 }}>{f.shortAr}</div>
                  {f.channels?.length > 0 && (
                    <div style={{ display: 'flex', gap: 3, marginTop: 6, flexWrap: 'wrap' }}>
                      {f.channels.slice(0, 3).map(ch => (
                        <span key={ch} style={{
                          fontSize: 9, padding: '1px 5px', borderRadius: 3,
                          background: '#f5f2ec', color: 'var(--muted)',
                          fontFamily: 'var(--mono, monospace)',
                        }}>{ch}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ===== Gantt view — horizontal bars across quarters =====
function RoadmapGanttView({ features, families, priorities, tabId }) {
  // Timeline: Q2·26 → Q1·27 (5 columns)
  const quarters = [
    { id: 'q2_2026', label: 'Q2 · 26', n: 1 },
    { id: 'q3_2026', label: 'Q3 · 26', n: 2 },
    { id: 'q4_2026', label: 'Q4 · 26', n: 3 },
    { id: 'q1_2027', label: 'Q1 · 27', n: 4 },
    { id: 'backlog', label: 'لاحقاً',  n: 5 },
  ];
  const qIdToCol = Object.fromEntries(quarters.map(q => [q.id, q.n]));
  const famById = Object.fromEntries(families.map(f => [f.id, f]));

  // Map feature → (startCol, endCol).
  // Priority: explicit `quarter` field wins; fall back to status/priority heuristics.
  const featurePlacement = (f) => {
    if (f.status === 'live') return { start: 1, end: 1, kind: 'shipped' };
    if (f.quarter && qIdToCol[f.quarter]) {
      const c = qIdToCol[f.quarter];
      if (f.status === 'dev')                                   return { start: c, end: c, kind: 'dev' };
      if (f.status === 'idea')                                  return { start: c, end: c, kind: 'idea' };
      if (f.priority === 'p0' || f.priority === 'p1')           return { start: c, end: c, kind: 'planned-high' };
      if (f.priority === 'p2')                                  return { start: c, end: c, kind: 'planned' };
      return { start: c, end: c, kind: 'planned-low' };
    }
    // Fallback heuristics for features without a stored quarter
    if (f.status === 'dev')                    return { start: 1, end: 2, kind: 'dev' };
    if (f.status === 'planned') {
      if (f.priority === 'p0' || f.priority === 'p1') return { start: 2, end: 3, kind: 'planned-high' };
      if (f.priority === 'p2') return { start: 3, end: 4, kind: 'planned' };
      return { start: 4, end: 5, kind: 'planned-low' };
    }
    return { start: 5, end: 5, kind: 'idea' };
  };

  // Apply a quarter drop: update feature.quarter + nudge status to match the column semantics.
  const applyQuarterDrop = (fid, srcFamId, targetQ) => {
    if (!fid) return;
    const feat = features.find(x => x.id === fid);
    if (!feat) return;
    if (srcFamId && srcFamId !== feat.family) {
      window.__mhwarToast?.('يجب أن تبقى الميزة في نفس العائلة', 'err');
      return;
    }
    const patch = { quarter: targetQ.id, shipped_at: null };
    // If currently 'live', moving to a future quarter means it's planned again
    if (feat.status === 'live') patch.status = 'planned';
    // If it was 'idea' and user explicitly placed it in a real quarter, promote to planned
    if (feat.status === 'idea' && targetQ.id !== 'backlog') patch.status = 'planned';
    // If moved to backlog, demote to idea
    if (targetQ.id === 'backlog') patch.status = 'idea';
    window.featuresStore?.update(fid, patch);
    window.__mhwarToast?.(`نُقلت إلى ${targetQ.label}`, 'ok');
  };

  const kindColors = {
    'shipped':       { bar: 'oklch(0.7 0.12 145)', edge: 'oklch(0.45 0.15 145)' },
    'dev':           { bar: 'oklch(0.75 0.13 60)', edge: 'oklch(0.5 0.15 60)' },
    'planned-high':  { bar: 'oklch(0.75 0.11 40)', edge: 'oklch(0.5 0.14 40)' },
    'planned':       { bar: 'oklch(0.78 0.08 220)', edge: 'oklch(0.5 0.14 220)' },
    'planned-low':   { bar: 'oklch(0.8 0.06 260)', edge: 'oklch(0.5 0.12 260)' },
    'idea':          { bar: 'oklch(0.85 0.04 280)', edge: 'oklch(0.55 0.1 280)' },
  };

  // Group by family for swimlanes
  const byFam = {};
  features.forEach(f => { (byFam[f.family] = byFam[f.family] || []).push(f); });
  const famList = families.filter(fam => byFam[fam.id]?.length);

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--line)',
      borderRadius: 10, overflow: 'hidden',
    }}>
      {/* Timeline header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `160px repeat(${quarters.length}, 1fr)`,
        borderBottom: '2px solid var(--line)',
        background: '#faf7f0',
      }}>
        <div style={{
          padding: '12px 14px', fontSize: 11, fontWeight: 600,
          color: 'var(--muted)', letterSpacing: 0.8, textTransform: 'uppercase',
          borderInlineEnd: '1px solid var(--line)',
        }}>العائلة · الميزة</div>
        {quarters.map((q, i) => (
          <div key={q.id} style={{
            padding: '12px 14px', fontSize: 11, fontWeight: 600,
            color: 'var(--ink-2)', textAlign: 'center',
            fontFamily: 'var(--mono, monospace)', letterSpacing: 0.5,
            borderInlineEnd: i < quarters.length - 1 ? '1px solid var(--line)' : 'none',
          }}>{q.label}</div>
        ))}
      </div>

      {/* Rows */}
      {famList.map((fam, fi) => {
        const fs = byFam[fam.id].slice().sort((a, b) => {
          const rA = priorities.find(p => p.id === a.priority)?.rank || 0;
          const rB = priorities.find(p => p.id === b.priority)?.rank || 0;
          return rB - rA;
        });
        return (
          <React.Fragment key={fam.id}>
            {/* Family header row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `160px repeat(${quarters.length}, 1fr)`,
              background: '#fbfaf6', borderTop: fi > 0 ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{
                padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
                borderInlineEnd: '1px solid var(--line)',
              }}>
                <span style={{ fontSize: 12, opacity: 0.7 }}>{fam.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{fam.label}</span>
                <span className="mono" style={{ marginInlineStart: 'auto', fontSize: 10.5, color: 'var(--muted)' }}>{fs.length}</span>
              </div>
              {/* Grid lines */}
              {quarters.map((q, i) => (
                <div key={q.id} style={{ borderInlineEnd: i < quarters.length - 1 ? '1px solid var(--line)' : 'none' }}/>
              ))}
            </div>

            {/* Feature rows */}
            {fs.map(f => {
              const pl = featurePlacement(f);
              const col = kindColors[pl.kind] || kindColors.idea;
              const startCol = pl.start + 1; /* +1 because first col is the label */
              const endCol   = pl.end + 2; /* grid-column-end exclusive */
              const isShipped = f.status === 'live';
              return (
                <div key={f.id} style={{
                  display: 'grid',
                  gridTemplateColumns: `160px repeat(${quarters.length}, 1fr)`,
                  alignItems: 'center',
                  borderTop: '1px solid var(--line)',
                  minHeight: 40,
                  position: 'relative',
                }}>
                  <div style={{
                    padding: '8px 14px 8px 28px',
                    borderInlineEnd: '1px solid var(--line)',
                    fontSize: 11.5, color: 'var(--ink-2)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    cursor: 'pointer',
                  }} title={f.name}
                  onClick={() => window.openFeatureEditor?.(f.id)}>{f.name}</div>

                  {/* Drop-target cells, one per quarter, behind the bar */}
                  {quarters.map((q, qi) => (
                    <div key={q.id}
                      onDragOver={(e) => {
                        if (isShipped) return;
                        const srcFam = window.__mhwarDrag?.famId;
                        if (!srcFam) return;
                        const sameFam = srcFam === fam.id;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = sameFam ? 'move' : 'none';
                        e.currentTarget.style.background = sameFam ? '#eaf4ec' : '#fce8e6';
                        e.currentTarget.style.outline = sameFam
                          ? '2px dashed oklch(0.55 0.17 145)'
                          : '2px dashed oklch(0.55 0.2 25)';
                        e.currentTarget.style.outlineOffset = '-3px';
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.outline = 'none';
                      }}
                      onDrop={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.outline = 'none';
                        if (isShipped) return;
                        const fid = e.dataTransfer.getData('text/feature-id');
                        const srcFam = e.dataTransfer.getData('text/feature-fam') || window.__mhwarDrag?.famId;
                        if (!fid) return;
                        e.preventDefault();
                        applyQuarterDrop(fid, srcFam, q);
                      }}
                      style={{
                        gridColumn: `${qi + 2} / ${qi + 3}`,
                        gridRow: '1 / 2',
                        alignSelf: 'stretch',
                        borderInlineEnd: qi < quarters.length - 1 ? '1px dashed transparent' : 'none',
                        transition: 'background .12s, outline .12s',
                      }}/>
                  ))}

                  <div
                    draggable={!isShipped}
                    onDragStart={(e) => {
                      if (isShipped) return;
                      e.dataTransfer.setData('text/feature-id', f.id);
                      e.dataTransfer.setData('text/feature-fam', f.family);
                      e.dataTransfer.effectAllowed = 'move';
                      window.__mhwarDrag = { famId: f.family, featureId: f.id };
                    }}
                    onDragEnd={() => { window.__mhwarDrag = { famId: null, featureId: null }; }}
                    onClick={() => window.openFeatureEditor?.(f.id)}
                    title={isShipped ? f.name : 'اسحب لتغيير الربع · انقر للتعديل'}
                    style={{
                    gridColumn: `${startCol} / ${endCol}`,
                    gridRow: '1 / 2',
                    margin: '6px 8px',
                    height: 22, borderRadius: 6,
                    background: col.bar,
                    borderInlineStart: `3px solid ${col.edge}`,
                    display: 'flex', alignItems: 'center',
                    padding: '0 10px', fontSize: 10.5,
                    color: 'oklch(0.2 0 0)', fontWeight: 600,
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    cursor: isShipped ? 'pointer' : 'grab',
                    position: 'relative', zIndex: 1,
                    userSelect: 'none',
                  }}>
                    <span style={{
                      fontSize: 9, padding: '1px 5px', borderRadius: 3,
                      background: 'rgba(255,255,255,.6)', marginInlineEnd: 6,
                      fontFamily: 'var(--mono, monospace)',
                    }}>{f.priority?.toUpperCase() || '—'}</span>
                    {pl.kind === 'shipped' && '✓ '}
                    {f.shortAr || f.name}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        );
      })}

      {/* Legend */}
      <div style={{
        display: 'flex', gap: 12, padding: '12px 18px', flexWrap: 'wrap',
        fontSize: 10.5, color: 'var(--muted)',
        borderTop: '1px solid var(--line)', background: '#faf7f0',
      }}>
        <LegendDot c={kindColors.shipped.bar} label="منشور"/>
        <LegendDot c={kindColors.dev.bar} label="قيد التطوير"/>
        <LegendDot c={kindColors['planned-high'].bar} label="مخطّط · أولوية عالية"/>
        <LegendDot c={kindColors.planned.bar} label="مخطّط · عادي"/>
        <LegendDot c={kindColors['planned-low'].bar} label="مخطّط · منخفض"/>
        <LegendDot c={kindColors.idea.bar} label="فكرة"/>
      </div>
    </div>
  );
}
function LegendDot({ c, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 18, height: 8, borderRadius: 2, background: c, border: '1px solid rgba(0,0,0,.06)' }}/>
      {label}
    </span>
  );
}

// ===== Live Catalog =====
const CHANNEL_META = {
  whatsapp: { label: 'واتساب',          color: 'oklch(0.45 0.17 145)', bg: 'oklch(0.94 0.05 145)' },
  email:    { label: 'بريد إلكتروني',   color: 'oklch(0.4 0.12 220)',  bg: 'oklch(0.94 0.04 220)' },
  sms:      { label: 'SMS',             color: 'oklch(0.45 0.14 30)',   bg: 'oklch(0.96 0.04 30)'  },
  inapp:    { label: 'داخل التطبيق',    color: 'oklch(0.4 0.12 265)',   bg: 'oklch(0.94 0.04 265)' },
  web:      { label: 'ويب',             color: 'oklch(0.4 0.10 200)',   bg: 'oklch(0.94 0.04 200)' },
};
const formLabel = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' };
const formInput = { width: '100%', boxSizing: 'border-box', border: '1px solid var(--line)', borderRadius: 7, padding: '8px 11px', fontSize: 13, background: '#fafafa', color: 'var(--ink)', fontFamily: 'inherit', outline: 'none' };

function RoadmapLiveCatalog() {
  const [,_fr] = React.useState(0);
  React.useEffect(() => window.featuresStore?.subscribe(() => _fr(x=>x+1)), []);

  const allFeatures = (window.featuresStore ? window.featuresStore.getMerged() : window.UC_FEATURES_SEED) || [];
  const liveFeatures = allFeatures.filter(f => f.status === 'live');
  const families = window.UC_FEATURE_FAMILIES || [];

  const [search, setSearch] = React.useState('');
  const [activeFam, setActiveFam] = React.useState('all');
  const [showNewForm, setShowNewForm] = React.useState(false);
  const [newFeature, setNewFeature] = React.useState({ name: '', shortAr: '', desc: '', family: '', channels: [], shipped_at: new Date().toISOString().slice(0,10), notes: '', templates: '', useWith: '' });

  const liveFamilies = families.filter(fam => liveFeatures.some(f => f.family === fam.id));

  const filtered = liveFeatures.filter(f => {
    const matchFam = activeFam === 'all' || f.family === activeFam;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || f.name.toLowerCase().includes(q) || (f.desc || '').toLowerCase().includes(q) || (f.shortAr || '').toLowerCase().includes(q);
    return matchFam && matchSearch;
  });

  const toggleChannel = (ch) => setNewFeature(p => ({
    ...p, channels: p.channels.includes(ch) ? p.channels.filter(c => c !== ch) : [...p.channels, ch],
  }));

  const submitNew = () => {
    if (!newFeature.name.trim() || !newFeature.family) return;
    const id = 'custom.' + Date.now();
    const f = {
      id, status: 'live', priority: 'p2',
      name: newFeature.name.trim(),
      shortAr: newFeature.shortAr.trim(),
      desc: newFeature.desc.trim(),
      family: newFeature.family,
      channels: newFeature.channels,
      shipped_at: newFeature.shipped_at,
      notes: newFeature.notes.trim(),
      templates: newFeature.templates.split(',').map(s => s.trim()).filter(Boolean),
      useWith: newFeature.useWith.split(',').map(s => s.trim()).filter(Boolean),
      icon: '◈',
      hue: 220,
    };
    window.featuresStore?.update(id, f);
    setNewFeature({ name: '', shortAr: '', desc: '', family: '', channels: [], shipped_at: new Date().toISOString().slice(0,10), notes: '', templates: '', useWith: '' });
    setShowNewForm(false);
    window.__mhwarToast?.('تمّ توثيق الميزة الجديدة ✓', 'ok');
  };

  // Group filtered by family
  const grouped = {};
  liveFamilies.forEach(fam => {
    const fs = filtered.filter(f => f.family === fam.id);
    if (fs.length) grouped[fam.id] = fs;
  });

  return (
    <div>
      {/* Intro */}
      <div style={refStyles.tabIntro}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>دليل المميزات المنشورة</div>
          <button onClick={() => setShowNewForm(v => !v)} style={{
            marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: showNewForm ? '#f0f0f8' : 'oklch(0.35 0.18 265)', color: showNewForm ? 'var(--ink)' : '#fff',
            border: 'none', cursor: 'pointer', transition: 'all .15s',
          }}>
            {showNewForm ? '✕ إلغاء' : '+ توثيق ميزة جديدة'}
          </button>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 640 }}>
          توثيق كامل لكل قدرة تعمل اليوم في المنصة —{' '}
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{liveFeatures.length}</span>{' '}
          ميزة موزّعة على{' '}
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{liveFamilies.length}</span>{' '}
          عائلة منتج.
        </div>
      </div>

      {/* New feature form */}
      {showNewForm && (
        <div style={{
          background: '#fff', border: '1.5px solid oklch(0.75 0.12 265)',
          borderRadius: 12, padding: '20px 24px', marginBottom: 24,
          boxShadow: '0 4px 20px oklch(0.4 0.15 265 / 0.1)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'oklch(0.3 0.15 265)' }}>توثيق ميزة منشورة جديدة</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={formLabel}>اسم الميزة *</label>
              <input value={newFeature.name} onChange={e => setNewFeature(p => ({...p, name: e.target.value}))} placeholder="مثال: لوحة التحليلات المتقدمة" style={formInput}/>
            </div>
            <div>
              <label style={formLabel}>الوصف المختصر</label>
              <input value={newFeature.shortAr} onChange={e => setNewFeature(p => ({...p, shortAr: e.target.value}))} placeholder="جملة واحدة تصف الميزة" style={formInput}/>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={formLabel}>الوصف التفصيلي</label>
              <textarea value={newFeature.desc} onChange={e => setNewFeature(p => ({...p, desc: e.target.value}))} placeholder="اشرح ماذا تفعل هذه الميزة، ولمن، وما قيمتها للعميل..." rows={3} style={{...formInput, resize: 'vertical', lineHeight: 1.7}}/>
            </div>
            <div>
              <label style={formLabel}>العائلة *</label>
              <select value={newFeature.family} onChange={e => setNewFeature(p => ({...p, family: e.target.value}))} style={formInput}>
                <option value="">اختر العائلة…</option>
                {families.map(fam => <option key={fam.id} value={fam.id}>{fam.label}</option>)}
              </select>
            </div>
            <div>
              <label style={formLabel}>تاريخ النشر</label>
              <input type="date" value={newFeature.shipped_at} onChange={e => setNewFeature(p => ({...p, shipped_at: e.target.value}))} style={formInput}/>
            </div>
            <div>
              <label style={formLabel}>القنوات</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {Object.entries(CHANNEL_META).map(([ch, cm]) => {
                  const active = newFeature.channels.includes(ch);
                  return (
                    <button key={ch} type="button" onClick={() => toggleChannel(ch)} style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11.5, cursor: 'pointer',
                      border: active ? `1.5px solid ${cm.color}` : '1px solid var(--line)',
                      background: active ? cm.bg : '#fff', color: active ? cm.color : 'var(--ink-2)',
                      fontWeight: active ? 600 : 400,
                    }}>{cm.label}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={formLabel}>قوالب مرتبطة <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(مفصولة بفاصلة)</span></label>
              <input value={newFeature.templates} onChange={e => setNewFeature(p => ({...p, templates: e.target.value}))} placeholder="event-invite, rsvp-confirm, …" style={formInput}/>
            </div>
            <div>
              <label style={formLabel}>تستخدم مع <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(مفصولة بفاصلة)</span></label>
              <input value={newFeature.useWith} onChange={e => setNewFeature(p => ({...p, useWith: e.target.value}))} placeholder="مفتوح, هجين, …" style={formInput}/>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={formLabel}>ملاحظات داخلية</label>
              <textarea value={newFeature.notes} onChange={e => setNewFeature(p => ({...p, notes: e.target.value}))} placeholder="أي تفاصيل تقنية أو تنبيهات للفريق…" rows={2} style={{...formInput, resize: 'vertical'}}/>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button onClick={submitNew} disabled={!newFeature.name.trim() || !newFeature.family} style={{
              padding: '9px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
              background: newFeature.name.trim() && newFeature.family ? 'oklch(0.35 0.18 265)' : '#ccc',
              color: '#fff', border: 'none', cursor: newFeature.name.trim() && newFeature.family ? 'pointer' : 'not-allowed',
            }}>حفظ التوثيق</button>
            <button onClick={() => setShowNewForm(false)} style={{
              padding: '9px 18px', borderRadius: 8, fontSize: 13, background: '#f5f5f5',
              border: '1px solid var(--line)', color: 'var(--ink-2)', cursor: 'pointer',
            }}>إلغاء</button>
          </div>
        </div>
      )}

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث في الميزات…"
            style={{
              width: '100%', boxSizing: 'border-box',
              border: '1px solid var(--line)', borderRadius: 8,
              padding: '8px 14px 8px 36px', fontSize: 13,
              background: '#fff', color: 'var(--ink)', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <span style={{ position: 'absolute', insetInlineStart: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, opacity: 0.4 }}>🔍</span>
        </div>
        {/* Family filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[{ id: 'all', label: 'الكل', icon: '◈' }, ...liveFamilies].map(fam => {
            const active = activeFam === fam.id;
            return (
              <button key={fam.id} onClick={() => setActiveFam(fam.id)} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                border: active ? '1.5px solid oklch(0.4 0.15 265)' : '1px solid var(--line)',
                background: active ? 'oklch(0.93 0.05 265)' : '#fff',
                color: active ? 'oklch(0.3 0.15 265)' : 'var(--ink-2)',
                fontWeight: active ? 600 : 400,
                transition: 'all .15s',
              }}>
                {fam.icon && <span style={{ marginInlineEnd: 4, opacity: 0.7 }}>{fam.icon}</span>}
                {fam.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog groups */}
      {Object.entries(grouped).map(([famId, fs]) => {
        const fam = families.find(f => f.id === famId);
        if (!fam) return null;
        return (
          <div key={famId} style={{ marginBottom: 36 }}>
            {/* Family header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', borderRadius: 10,
              background: '#faf7f0', border: '1px solid var(--line)',
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 18, opacity: 0.8 }}>{fam.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{fam.label}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginInlineStart: 4 }}>{fs.length} ميزة</span>
              {fam.desc && <span style={{ fontSize: 11.5, color: 'var(--ink-2)', marginInlineStart: 8, flex: 1 }}>{fam.desc}</span>}
            </div>

            {/* Feature cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {fs.map((f, fi) => (
                <CatalogFeatureRow key={f.id} f={f} isLast={fi === fs.length - 1}/>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontSize: 13 }}>
          لا توجد نتائج — جرّب تغيير الفلتر أو البحث
        </div>
      )}
    </div>
  );
}

function CatalogFeatureRow({ f, isLast }) {
  const [open, setOpen] = React.useState(false);
  const pri = (window.UC_FEATURE_PRIORITIES || []).find(p => p.id === f.priority);

  const priColors = { p0: '#c0392b', p1: '#c78a1e', p2: '#3d3a8c', p3: '#7a7a9a' };
  const priLabels = { p0: 'حرجة', p1: 'عالية', p2: 'متوسطة', p3: 'منخفضة' };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: open ? 10 : 8,
      marginBottom: 4,
      overflow: 'hidden',
      transition: 'box-shadow .15s',
      boxShadow: open ? '0 2px 12px rgba(0,0,0,.06)' : 'none',
    }}>
      {/* Row header — always visible */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Shipped indicator */}
        <span style={{
          width: 8, height: 8, borderRadius: 4, flexShrink: 0,
          background: 'oklch(0.55 0.17 145)',
          boxShadow: '0 0 0 2px oklch(0.88 0.08 145)',
        }}/>

        {/* Icon + name */}
        <span style={{ fontSize: 15, lineHeight: 1, color: 'var(--ink-2)', flexShrink: 0 }}>{f.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{f.name}</span>
          {f.shortAr && (
            <span style={{ fontSize: 11.5, color: 'var(--muted)', marginInlineStart: 8 }}>{f.shortAr}</span>
          )}
        </div>

        {/* Channels */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {(f.channels || []).map(ch => {
            const cm = CHANNEL_META[ch];
            if (!cm) return null;
            return (
              <span key={ch} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 4,
                background: cm.bg, color: cm.color, fontWeight: 500,
              }}>{cm.label}</span>
            );
          })}
        </div>

        {/* Priority */}
        {f.priority && (
          <span style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 4,
            background: '#f5f5f5', color: priColors[f.priority] || '#666',
            fontFamily: 'var(--mono)', fontWeight: 600, flexShrink: 0,
          }}>{priLabels[f.priority] || f.priority}</span>
        )}

        {/* Shipped date */}
        {f.shipped_at && (
          <span style={{
            fontSize: 10, color: 'var(--muted)',
            fontFamily: 'var(--mono)', flexShrink: 0,
          }}>{f.shipped_at}</span>
        )}

        {/* Chevron */}
        <span style={{
          fontSize: 11, color: 'var(--muted)', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform .2s',
        }}>▾</span>
      </div>

      {/* Expanded body */}
      {open && (
        <div style={{
          padding: '0 16px 18px 36px',
          borderTop: '1px solid var(--line)',
          paddingTop: 16,
        }}>
          {/* Description */}
          {f.desc ? (
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: 'var(--ink-2)', margin: '0 0 14px', textWrap: 'pretty' }}>
              {f.desc}
            </p>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', margin: '0 0 14px' }}>لا يوجد وصف مفصّل بعد.</p>
          )}

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {/* Channels detail */}
            {(f.channels || []).length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.6, marginBottom: 6, textTransform: 'uppercase' }}>القنوات</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {f.channels.map(ch => {
                    const cm = CHANNEL_META[ch];
                    if (!cm) return null;
                    return (
                      <span key={ch} style={{
                        fontSize: 11.5, padding: '3px 10px', borderRadius: 6,
                        background: cm.bg, color: cm.color, fontWeight: 500,
                      }}>{cm.label}</span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Use with patterns */}
            {(f.useWith || []).length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.6, marginBottom: 6, textTransform: 'uppercase' }}>تستخدم مع</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {f.useWith.map(u => (
                    <span key={u} style={{
                      fontSize: 11.5, padding: '3px 10px', borderRadius: 6,
                      background: 'oklch(0.95 0.02 145)', color: 'oklch(0.35 0.15 145)', fontWeight: 500,
                    }}>{u}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Templates */}
            {(f.templates || []).length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.6, marginBottom: 6, textTransform: 'uppercase' }}>القوالب</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {f.templates.map(t => (
                    <span key={t} style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 6,
                      background: '#f0f0f8', color: '#3d3a8c',
                      fontFamily: 'var(--mono)',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {f.notes && (
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: 0.6, marginBottom: 6, textTransform: 'uppercase' }}>ملاحظات</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.7, background: '#faf7f0', padding: '8px 12px', borderRadius: 6, borderInlineStart: '3px solid oklch(0.75 0.12 60)' }}>
                  {f.notes}
                </div>
              </div>
            )}
          </div>

          {/* Edit button */}
          <div style={{ marginTop: 14 }}>
            <button onClick={(e) => { e.stopPropagation(); window.openFeatureEditor?.(f.id); }} style={{
              fontSize: 11.5, padding: '5px 14px', borderRadius: 6,
              border: '1px solid var(--line)', background: '#fff',
              color: 'var(--ink-2)', cursor: 'pointer',
            }}>✎ تعديل التوثيق</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Plan view (unified: features + swimlane with family CRUD) =====
function RoadmapPlan() {
  const [,_fr] = React.useState(0);
  React.useEffect(() => window.featuresStore?.subscribe(() => _fr(x=>x+1)), []);

  const VIEW_KEY = 'mhwar:roadmap:plan-view';
  const [view, setView] = React.useState(() => {
    try { return localStorage.getItem(VIEW_KEY) || 'list'; } catch { return 'list'; }
  });
  const setViewPersist = (v) => {
    setView(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch {}
  };

  return (
    <div>
      {/* Intro + view toggle */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 16, marginBottom: 24, flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>قاعدة المنتج — المميزات والعائلات</div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 640 }}>
            مكان واحد لتعريف وإدارة كل ما يُغذّي خارطة الطريق: مميزات المنتج، عائلاتها، وتوزيعها على المراحل.
            التغييرات هنا تنعكس فوراً على باقي تبويبات الخريطة.
          </div>
        </div>
        {/* View toggle */}
        <div style={{
          display: 'flex', gap: 0, padding: 3, background: '#f4f1ea',
          borderRadius: 10, border: '1px solid var(--line)', flexShrink: 0,
        }}>
          {[
            { id: 'list', label: 'قائمة المميزات', icon: '☰' },
            { id: 'swim', label: 'العائلات × المراحل', icon: '▦' },
          ].map(opt => {
            const active = view === opt.id;
            return (
              <button key={opt.id} onClick={() => setViewPersist(opt.id)} style={{
                padding: '8px 16px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer',
                background: active ? '#fff' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--muted)',
                fontWeight: active ? 600 : 500, border: 'none',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                transition: 'all .15s', display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'inherit',
              }}>
                <span style={{ opacity: 0.7, fontSize: 11 }}>{opt.icon}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View body */}
      {view === 'list' && (
        window.UseCasesView
          ? <div style={{ margin: '0 -8px' }}><window.UseCasesView data={{ mode: 'features' }}/></div>
          : <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل…</div>
      )}
      {view === 'swim' && <RoadmapSwim withFamilyCRUD={true}/>}
    </div>
  );
}

// ===== Overview =====

function RoadmapProgressBar() {
  const [,_fr] = React.useState(0);
  React.useEffect(() => window.featuresStore?.subscribe(() => _fr(x=>x+1)), []);
  const features = window.featuresStore ? window.featuresStore.getMerged() : (window.UC_FEATURES_SEED || []);
  const s = window.featuresStore?.stats(features) || { total: features.length, shipped: 0, dev: 0, planned: 0, idea: 0, onHold: 0, shippedPct: 0, remaining: features.length };
  const pct = Math.round((s.shippedPct || 0) * 100);
  const devPct = s.total ? Math.round((s.dev / s.total) * 100) : 0;
  return (
    <div style={{ maxWidth: 1080, margin: '14px auto 0', padding: '0 20px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 18px', borderRadius: 12,
        background: '#fff', border: '1px solid var(--line)',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: 'oklch(0.35 0.18 145)' }}>{s.shipped}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>منشور من أصل</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{s.total}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>ميزة</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginInlineStart: 'auto' }}>{pct}%</span>
          </div>
          <div style={{
            position: 'relative',
            height: 8, borderRadius: 999,
            background: 'oklch(0.94 0.01 70)',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', insetInlineStart: 0, top: 0, bottom: 0,
              width: pct + '%',
              background: 'linear-gradient(90deg, oklch(0.55 0.17 145), oklch(0.65 0.18 155))',
              transition: 'width .4s ease',
            }}/>
            <div style={{
              position: 'absolute', insetInlineStart: pct + '%', top: 0, bottom: 0,
              width: devPct + '%',
              background: 'oklch(0.8 0.15 60 / 0.4)',
              transition: 'all .4s ease',
            }}/>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11, flexWrap: 'wrap' }}>
            <StatMini dot='oklch(0.55 0.17 145)' label='منشور' n={s.shipped}/>
            <StatMini dot='oklch(0.65 0.17 60)'  label='قيد التطوير' n={s.dev}/>
            <StatMini dot='oklch(0.55 0.15 220)' label='مخطط' n={s.planned}/>
            <StatMini dot='oklch(0.55 0.15 265)' label='فكرة' n={s.idea}/>
            {s.onHold > 0 && <StatMini dot='oklch(0.55 0.15 10)' label='مؤجل' n={s.onHold}/>}
            <span style={{ marginInlineStart: 'auto', fontSize: 11, color: 'var(--muted)' }}>
              اسحب أي بطاقة إلى تبويب لتغيير حالتها
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
function StatMini({ dot, label, n }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--ink-2)' }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: dot }}/>
      <span>{label}</span>
      <span className="mono" style={{ color: 'var(--muted)' }}>{n}</span>
    </span>
  );
}

function RoadmapOverview() {
  // subscribe to store for live updates
  const [,_fr] = React.useState(0);
  React.useEffect(() => window.featuresStore?.subscribe(() => _fr(x=>x+1)), []);

  const features = (window.featuresStore ? window.featuresStore.getMerged() : window.UC_FEATURES_SEED) || [];
  const families = window.UC_FEATURE_FAMILIES || [];
  const c = { live: 0, dev: 0, planned: 0, idea: 0 };
  features.forEach(f => c[f.status]++);

  const cards = [
    { k: 'live',    label: 'منشور الآن',    num: c.live,    desc: 'قدرات تعمل في الإنتاج اليوم', color: '#2f8a5a' },
    { k: 'dev',     label: 'قيد التطوير',   num: c.dev,     desc: 'نعمل عليها هذا الربع',       color: '#c78a1e' },
    { k: 'planned', label: 'مخطّط',         num: c.planned, desc: 'ضمن خارطة ٢٠٢٦',            color: '#3d3a8c' },
    { k: 'idea',    label: 'اقتراحات',      num: c.idea,    desc: 'قيد الدراسة — ليست التزاماً', color: '#7a5fb0' },
  ];

  return (
    <div>
      <div style={refStyles.tabIntro}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>نظرة عامّة</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 640 }}>
          بنية محور موزّعة على <span className="mono">{features.length}</span> قدرة ضمن{' '}
          <span className="mono">{families.length}</span> عائلة منتج — موثّقة هنا بحالتها الحالية،
          وأولويّتها، ومسار توصيلها عبر أربع مراحل حتى نهاية ٢٠٢٦.
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, background: 'var(--line)',
        border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden',
        marginBottom: 28,
      }}>
        {cards.map(c => (
          <div key={c.k} style={{ background: '#fff', padding: '22px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--muted)', letterSpacing: 0.4, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: c.color }}/>
              {c.label}
            </div>
            <div className="mono" style={{ fontSize: 34, letterSpacing: -1, fontWeight: 600, color: 'var(--ink)' }}>{c.num}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        fontSize: 11.5, color: 'var(--muted)',
        padding: '14px 20px', background: '#faf7f0',
        borderRadius: 8, border: '1px solid var(--line)',
      }}>
        <LegendDot c="#2f8a5a" label="منشور"/>
        <LegendDot c="#c78a1e" label="قيد التطوير"/>
        <LegendDot c="#3d3a8c" label="مخطّط"/>
        <LegendDot c="#7a5fb0" label="اقتراح"/>
        <div style={{ width: 1, height: 16, background: 'var(--line)' }}/>
        <PriChip p="p0" label="حرجة"/>
        <PriChip p="p1" label="عالية"/>
        <PriChip p="p2" label="متوسطة"/>
        <PriChip p="p3" label="منخفضة"/>
      </div>
    </div>
  );
}

function PriChip({ p, label }) {
  const bg = { p0: '#fce8e6', p1: '#fbeedb', p2: '#e8f4ea', p3: '#eaeaf0' }[p];
  const fg = { p0: '#b83c28', p1: '#a7741a', p2: '#2f7a4a', p3: '#6c6c8a' }[p];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="mono" style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: bg, color: fg, letterSpacing: 0.5 }}>{p.toUpperCase()}</span>
      <span>{label}</span>
    </div>
  );
}

// ===== Phases view =====
function RoadmapPhases() {
  // subscribe to store for live updates
  const [,_fr] = React.useState(0);
  React.useEffect(() => window.featuresStore?.subscribe(() => _fr(x=>x+1)), []);

  const features = (window.featuresStore ? window.featuresStore.getMerged() : window.UC_FEATURES_SEED) || [];
  const families = window.UC_FEATURE_FAMILIES || [];
  const famById = Object.fromEntries(families.map(f => [f.id, f]));
  const priorities = window.UC_FEATURE_PRIORITIES || [];

  return (
    <div>
      <div style={refStyles.tabIntro}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>أربع مراحل · طريق واضح</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 640 }}>
          كل قدرة موضوعة في مرحلة حسب حالتها وأولويّتها. المراحل تُقرأ بالترتيب — من المنشور اليوم إلى ما بعد ٢٠٢٦.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {ROADMAP_PHASES.map(p => {
          const items = features.filter(f => roadmapPhaseOf(f) === p.n);
          const byFam = {};
          items.forEach(f => { (byFam[f.family] = byFam[f.family] || []).push(f); });
          const famKeys = Object.keys(byFam).sort((a, b) => byFam[b].length - byFam[a].length);

          return (
            <div key={p.n}
              onDragOver={(e) => {
                const srcFam = window.__mhwarDrag?.famId;
                if (!srcFam) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                e.currentTarget.style.boxShadow = `0 0 0 2px ${p.color}`;
              }}
              onDragLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              onDrop={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                const fid = e.dataTransfer.getData('text/feature-id');
                if (!fid) return;
                e.preventDefault();
                const patch = {};
                if (p.n === 1)      { patch.status = 'live';    patch.shipped_at = new Date().toISOString().slice(0,10); }
                else if (p.n === 2) { patch.status = 'dev';     patch.priority = 'p1'; patch.shipped_at = null; }
                else if (p.n === 3) { patch.status = 'planned'; patch.priority = 'p2'; patch.shipped_at = null; }
                else if (p.n === 4) { patch.status = 'idea';    patch.priority = 'p3'; patch.shipped_at = null; }
                window.featuresStore?.update(fid, patch);
                window.__mhwarToast?.(`نُقلت إلى ${p.q}`, 'ok');
              }}
              style={{
                background: '#fff', border: '1px solid var(--line)',
                borderRadius: 12, overflow: 'hidden',
                transition: 'box-shadow .15s',
              }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '52px 1fr auto',
                alignItems: 'center', gap: 18,
                padding: '20px 24px', borderBottom: '1px solid var(--line)',
                background: 'linear-gradient(to bottom, #fdfcf9, #fff)',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: p.soft, color: p.color,
                  display: 'grid', placeItems: 'center',
                  fontSize: 16, fontFamily: 'var(--mono, monospace)',
                }}>0{p.n}</div>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: 1.5, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{p.sub}</div>
                </div>
                <div style={{ textAlign: 'left', paddingInlineStart: 16, borderInlineStart: '1px solid var(--line)' }}>
                  <div className="mono" style={{ fontSize: 18, color: 'var(--ink)', letterSpacing: -0.3 }}>{p.q}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{p.range}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 8 }}>
                    {items.length} قدرة · {famKeys.length} عائلة
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--line)' }}>
                {famKeys.map(fk => {
                  const fam = famById[fk];
                  if (!fam) return null;
                  return (
                    <div key={fk} style={{ background: '#fff', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 8, borderBottom: '1px dashed var(--line)' }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 6,
                          background: `hsl(${fam.hue} 45% 96%)`,
                          color: `hsl(${fam.hue} 55% 35%)`,
                          display: 'grid', placeItems: 'center',
                          fontSize: 13,
                        }}>{fam.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{fam.label}</div>
                        <div className="mono" style={{ marginInlineStart: 'auto', fontSize: 11, color: 'var(--muted)' }}>{byFam[fk].length}</div>
                      </div>
                      {byFam[fk].map(f => {
                        const pri = priorities.find(pp => pp.id === f.priority);
                        return (
                          <div key={f.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/feature-id', f.id);
                              e.dataTransfer.setData('text/feature-fam', f.family);
                              e.dataTransfer.effectAllowed = 'move';
                              window.__mhwarDrag = { famId: f.family, featureId: f.id };
                            }}
                            onDragEnd={() => { window.__mhwarDrag = { famId: null, featureId: null }; }}
                            onClick={() => window.openFeatureEditor?.(f.id)}
                            style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto', gap: 10, alignItems: 'start', cursor: 'grab', padding: '4px 2px', borderRadius: 6 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fbfaf6'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: p.color, marginTop: 7 }}/>
                            <div>
                              <div style={{ fontSize: 12.5, lineHeight: 1.4, color: 'var(--ink)' }}>{f.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{f.shortAr}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end', alignSelf: 'start', marginTop: 1 }} onClick={(e) => e.stopPropagation()}>
                              <StatusQuickPill feature={f}/>
                              {pri && (
                                <span className="mono" style={{
                                  fontSize: 9.5, padding: '1px 5px', borderRadius: 3,
                                  background: { p0: '#fce8e6', p1: '#fbeedb', p2: '#e8f4ea', p3: '#eaeaf0' }[f.priority],
                                  color:      { p0: '#b83c28', p1: '#a7741a', p2: '#2f7a4a', p3: '#6c6c8a' }[f.priority],
                                  letterSpacing: 0.5,
                                }}>{f.priority.toUpperCase()}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Custom families storage — adds user-defined families on top of seed
const CUSTOM_FAMILIES_KEY = 'mhwar:custom-families.v1';
function getCustomFamilies() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_FAMILIES_KEY) || '[]'); } catch { return []; }
}
function saveCustomFamily(fam) {
  const cur = getCustomFamilies();
  cur.push(fam);
  try { localStorage.setItem(CUSTOM_FAMILIES_KEY, JSON.stringify(cur)); } catch {}
  // Mutate global for immediate visibility
  if (Array.isArray(window.UC_FEATURE_FAMILIES) && !window.UC_FEATURE_FAMILIES.find(f => f.id === fam.id)) {
    window.UC_FEATURE_FAMILIES.push(fam);
  }
}
// Merge custom families into global on first call
(function mergeCustomFamiliesOnce() {
  if (typeof window === 'undefined') return;
  if (window.__customFamiliesMerged) return;
  window.__customFamiliesMerged = true;
  const cur = getCustomFamilies();
  if (Array.isArray(window.UC_FEATURE_FAMILIES)) {
    cur.forEach(f => {
      if (!window.UC_FEATURE_FAMILIES.find(x => x.id === f.id)) window.UC_FEATURE_FAMILIES.push(f);
    });
  }
})();

// ===== Swimlane =====
function RoadmapSwim({ withFamilyCRUD = false }) {
  // subscribe to store for live updates
  const [,_fr] = React.useState(0);
  React.useEffect(() => window.featuresStore?.subscribe(() => _fr(x=>x+1)), []);

  const features = (window.featuresStore ? window.featuresStore.getMerged() : window.UC_FEATURES_SEED) || [];
  const families = window.UC_FEATURE_FAMILIES || [];

  const [showFamModal, setShowFamModal] = React.useState(false);
  const [newFam, setNewFam] = React.useState({ id: '', label: '', short: '', icon: '◆', desc: '', hue: 200 });
  const submitFamily = () => {
    const id = (newFam.id || '').trim().toLowerCase().replace(/\s+/g, '_');
    const label = (newFam.label || '').trim();
    if (!id || !label) { window.__mhwarToast?.('الاسم والمعرّف مطلوبان', 'err'); return; }
    if (families.find(f => f.id === id)) { window.__mhwarToast?.('المعرّف مستخدم سابقاً', 'err'); return; }
    saveCustomFamily({ ...newFam, id, label, short: (newFam.short || label).trim() });
    setShowFamModal(false);
    setNewFam({ id: '', label: '', short: '', icon: '◆', desc: '', hue: 200 });
    _fr(x => x + 1);
    window.__mhwarToast?.(`تمّت إضافة العائلة: ${label}`, 'ok');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={{ fontSize: 16.5, fontWeight: 600, marginBottom: 6 }}>عائلات المنتج عبر المراحل</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7, maxWidth: 640 }}>
            نظرة أفقية: أيّ عائلة تنمو في أيّ ربع. {families.length} عائلة × ٤ مراحل.
            {' '}اسحب أيّ ميزة بين أعمدة المراحل لإعادة تخصيصها (داخل نفس العائلة).
          </div>
        </div>
        {withFamilyCRUD && (
          <button onClick={() => setShowFamModal(true)} style={{
            padding: '9px 14px', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
            background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 8,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>＋</span> إضافة عائلة
          </button>
        )}
      </div>

      <div style={{
        background: '#fff', border: '1px solid var(--line)',
        borderRadius: 12, padding: '20px 22px', overflowX: 'auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '160px repeat(4, 1fr)',
          gap: 1, background: 'var(--line)',
          borderRadius: 8, overflow: 'hidden',
          minWidth: 900,
        }}>
          {/* Header */}
          <div style={swimStyles.hdrLbl}>العائلة</div>
          {ROADMAP_PHASES.map(p => (
            <div key={p.n} style={swimStyles.hdr}>{p.q}</div>
          ))}

          {/* Rows */}
          {families.map(fam => (
            <React.Fragment key={fam.id}>
              <div style={swimStyles.cellLbl}>
                <span style={{ opacity: 0.7, fontSize: 13 }}>{fam.icon}</span>
                <span>{fam.label}</span>
              </div>
              {ROADMAP_PHASES.map(p => {
                const fs = features.filter(f => f.family === fam.id && roadmapPhaseOf(f) === p.n);
                return (
                  <div key={p.n}
                    onDragOver={(e) => {
                      const srcFam = window.__mhwarDrag?.famId;
                      if (!srcFam) return;
                      const sameFam = srcFam === fam.id;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = sameFam ? 'move' : 'none';
                      e.currentTarget.style.background = sameFam ? '#eaf4ec' : '#fce8e6';
                      e.currentTarget.style.outline = sameFam
                        ? '2px dashed oklch(0.55 0.17 145)'
                        : '2px dashed oklch(0.55 0.2 25)';
                      e.currentTarget.style.outlineOffset = '-3px';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.background = fs.length === 0 ? '#fff' : '#fff';
                      e.currentTarget.style.outline = 'none';
                    }}
                    onDrop={(e) => {
                      const fid = e.dataTransfer.getData('text/feature-id');
                      const srcFam = e.dataTransfer.getData('text/feature-fam') || window.__mhwarDrag?.famId;
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.outline = 'none';
                      if (!fid) return;
                      e.preventDefault();
                      if (srcFam && srcFam !== fam.id) {
                        window.__mhwarToast?.('يجب أن تبقى الميزة في نفس العائلة', 'err');
                        return;
                      }
                      const PHASE_TO_QUARTER = { 1: 'q2_2026', 2: 'q3_2026', 3: 'q4_2026', 4: 'backlog' };
                      const patch = { quarter: PHASE_TO_QUARTER[p.n] || 'backlog' };
                      if (p.n === 1) { patch.status = 'live'; patch.shipped_at = new Date().toISOString().slice(0,10); }
                      else if (p.n === 2) { patch.status = 'dev'; patch.shipped_at = null; }
                      else if (p.n === 3) { patch.status = 'planned'; patch.shipped_at = null; }
                      else if (p.n === 4) { patch.status = 'idea'; patch.shipped_at = null; }
                      window.featuresStore?.update(fid, patch);
                      window.__mhwarToast?.(`نُقلت إلى ${p.q}`, 'ok');
                    }}
                    style={fs.length === 0
                      ? { ...swimStyles.cell, color: 'var(--line)', minHeight: 56, transition: 'background .15s, outline .15s' }
                      : { ...swimStyles.cell, minHeight: 56, transition: 'background .15s, outline .15s' }}>
                    {fs.length === 0 ? '·' : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {fs.map(f => (
                        <span key={f.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/feature-id', f.id);
                            e.dataTransfer.setData('text/feature-fam', f.family);
                            e.dataTransfer.effectAllowed = 'move';
                            window.__mhwarDrag = { famId: f.family, featureId: f.id };
                          }}
                          onDragEnd={() => { window.__mhwarDrag = { famId: null, featureId: null }; }}
                          onClick={() => window.openFeatureEditor?.(f.id)}
                          style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '3px 8px', borderRadius: 4,
                          fontSize: 11, background: '#faf7f0',
                          border: '1px solid var(--line)', color: 'var(--ink)',
                          lineHeight: 1.3, cursor: 'grab',
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: 3, background: p.color, flexShrink: 0 }}/>
                          {f.name}
                        </span>
                      ))}
                    </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        {withFamilyCRUD && (
          <button onClick={() => setShowFamModal(true)} style={{
            marginTop: 10, padding: '10px 14px', fontSize: 12.5, fontFamily: 'inherit',
            background: '#fff', color: 'var(--muted)', border: '1px dashed var(--line)',
            borderRadius: 8, cursor: 'pointer', width: '100%',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#faf7f0'; e.currentTarget.style.color = 'var(--ink)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--muted)'; }}>
            <span style={{ fontSize: 14 }}>＋</span> إضافة عائلة جديدة
          </button>
        )}
      </div>

      {/* Add-family modal */}
      {showFamModal && (
        <div onClick={() => setShowFamModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 12, padding: 24, maxWidth: 520, width: '100%',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>إضافة عائلة جديدة</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
                  العائلة هي تجميعة منطقية لمميزات مرتبطة (مثلاً: قنوات التواصل، التحليلات…).
                </div>
              </div>
              <button onClick={() => setShowFamModal(false)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 20, color: 'var(--muted)', padding: 4, lineHeight: 1,
              }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={formLabel}>الاسم</label>
                  <input value={newFam.label} onChange={e => setNewFam(p => ({...p, label: e.target.value}))}
                    placeholder="مثلاً: التحليلات والقياسات" style={formInput}/>
                </div>
                <div>
                  <label style={formLabel}>المعرّف (id)</label>
                  <input value={newFam.id} onChange={e => setNewFam(p => ({...p, id: e.target.value}))}
                    placeholder="analytics" style={{...formInput, fontFamily: 'monospace', direction: 'ltr', textAlign: 'left'}}/>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr', gap: 12 }}>
                <div>
                  <label style={formLabel}>الاسم المختصر</label>
                  <input value={newFam.short} onChange={e => setNewFam(p => ({...p, short: e.target.value}))}
                    placeholder="تحليلات" style={formInput}/>
                </div>
                <div>
                  <label style={formLabel}>الأيقونة</label>
                  <input value={newFam.icon} onChange={e => setNewFam(p => ({...p, icon: e.target.value}))}
                    style={{...formInput, textAlign: 'center'}}/>
                </div>
                <div>
                  <label style={formLabel}>درجة اللون (hue 0-360)</label>
                  <input type="number" min="0" max="360" value={newFam.hue}
                    onChange={e => setNewFam(p => ({...p, hue: Number(e.target.value)}))}
                    style={{...formInput, fontFamily: 'monospace', direction: 'ltr', textAlign: 'left'}}/>
                </div>
              </div>
              <div>
                <label style={formLabel}>الوصف</label>
                <input value={newFam.desc} onChange={e => setNewFam(p => ({...p, desc: e.target.value}))}
                  placeholder="جملة قصيرة تصف ما تجمعه هذه العائلة." style={formInput}/>
              </div>
              {/* Preview */}
              <div style={{
                padding: '12px 14px', background: '#fbfaf6', border: '1px solid var(--line)', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: `oklch(0.94 0.04 ${newFam.hue})`, color: `oklch(0.4 0.12 ${newFam.hue})`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0,
                }}>{newFam.icon || '◆'}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{newFam.label || 'اسم العائلة'}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{newFam.desc || 'الوصف يظهر هنا'}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowFamModal(false)} style={{
                padding: '9px 16px', fontSize: 12.5, fontFamily: 'inherit',
                background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)',
                borderRadius: 8, cursor: 'pointer',
              }}>إلغاء</button>
              <button onClick={submitFamily} style={{
                padding: '9px 16px', fontSize: 12.5, fontFamily: 'inherit', fontWeight: 600,
                background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
              }}>إضافة العائلة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const swimStyles = {
  hdr:    { background: '#faf7f0', padding: '10px 14px', fontSize: 11, color: 'var(--muted)', letterSpacing: 0.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'var(--mono, monospace)' },
  hdrLbl: { background: '#faf7f0', padding: '10px 14px', fontSize: 11, color: 'var(--muted)', letterSpacing: 0.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' },
  cell:    { background: '#fff', padding: '12px 14px', minHeight: 56, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 },
  cellLbl: { background: '#fbfaf6', padding: '12px 14px', minHeight: 56, fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 },
};

// ===== Principles =====
function RoadmapPrinciples() {
  const list = [
    { num: '01', title: 'نبني القناة قبل الميزة', text: 'كل قناة جديدة (SMS، Telegram، In-App) يجب أن تسبقها قدرات BYO حتى لا يعتمد العميل على بنيتنا. الاستقلالية أولاً، الراحة ثانياً.' },
    { num: '02', title: 'العلامة البيضاء افتراضية', text: 'اسم محور لا يظهر للأعضاء أبداً. كل ميزة جديدة تختبر على معيار: هل تبقى هوية العميل هي المرئيّة؟ إن لم يكن، لا نطلقها.' },
    { num: '03', title: 'التحليل ينضج مع المنتج', text: 'لا نضيف قدرة جديدة دون لوحة قياسها. كل رحلة، كل حملة، كل شهادة — تحمل مقاييسها منذ اليوم الأول بدل تقديرها لاحقاً.' },
  ];
  return (
    <div>
      <div style={refStyles.tabIntro}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>مبادئ التخطيط</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 640 }}>
          ثلاث قواعد تحكم قبول أيّ ميزة جديدة في الخارطة. إن فشلت ميزة في أحدها، لا تدخل.
        </div>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
        background: 'var(--line)',
        border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden',
      }}>
        {list.map(p => (
          <div key={p.num} style={{ background: '#fff', padding: '26px 24px' }}>
            <div className="mono" style={{ fontSize: 11, color: '#3d3a8c', letterSpacing: 1, marginBottom: 14 }}>{p.num} / مبدأ</div>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, marginBottom: 8 }}>{p.title}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.7, color: 'var(--ink-2)', textWrap: 'pretty' }}>{p.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapCard({ feature, priorities, tabId }) {
  const pri = priorities.find(p => p.id === feature.priority);
  const statusMeta = window.featuresStore?.statusMeta(feature.status);
  const quarterMeta = feature.quarter ? window.featuresStore?.quarterMeta(feature.quarter) : null;
  const isShipped = feature.status === 'live';
  const isEditing = window.__editModeOn === true;

  const handleClick = (e) => {
    e.stopPropagation();
    if (window.openFeatureEditor) window.openFeatureEditor(feature.id);
  };

  return (
    <div
      style={{ ...refStyles.featureCard, cursor: 'pointer', position: 'relative' }}
      onClick={handleClick}
      draggable={isEditing}
      onDragStart={(e) => {
        if (!isEditing) return;
        e.dataTransfer.setData('text/feature-id', feature.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      title="انقر للتعديل"
    >
      {/* Status strip along the top for clarity */}
      {statusMeta && (
        <div style={{
          position: 'absolute', top: 0, insetInlineStart: 0, insetInlineEnd: 0,
          height: 3, borderRadius: '10px 10px 0 0',
          background: `oklch(0.65 0.15 ${statusMeta.hue})`,
          opacity: 0.8,
        }}/>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, paddingTop: 3 }}>
        <div style={{ fontSize: 16, lineHeight: 1, color: 'var(--ink-2)', marginTop: 2 }}>{feature.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>
            {feature.name}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>{feature.shortAr}</div>
        </div>
        {pri && (
          <div style={{
            fontSize: 9.5, padding: '2px 7px', borderRadius: 999,
            background: `hsl(${pri.hue} 45% 96%)`,
            color: `hsl(${pri.hue} 55% 35%)`,
            fontFamily: 'var(--mono, monospace)',
            letterSpacing: 0.5, flexShrink: 0,
          }}>{pri.id.toUpperCase()}</div>
        )}
      </div>
      <div style={{
        fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.7,
        textWrap: 'pretty',
      }}>{feature.desc}</div>
      {/* Bottom row: channels + status badge + quarter */}
      <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {feature.channels?.map(ch => (
          <span key={ch} style={{
            fontSize: 10, padding: '2px 6px', borderRadius: 4,
            background: '#f5f2ec', color: 'var(--muted)',
            fontFamily: 'var(--mono, monospace)',
          }}>{ch}</span>
        ))}
        <div style={{ flex: 1 }}/>
        {!isShipped && quarterMeta && feature.quarter && (
          <span style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 4,
            background: 'oklch(0.95 0.02 260)', color: 'oklch(0.4 0.1 260)',
            fontFamily: 'var(--mono, monospace)',
          }}>{quarterMeta.shortLabel}</span>
        )}
        {isShipped && (
          <span style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 4,
            background: 'oklch(0.92 0.1 145)', color: 'oklch(0.3 0.15 145)',
            fontFamily: 'var(--mono, monospace)', fontWeight: 600,
          }}>✓ منشور{feature.shipped_at ? ` · ${feature.shipped_at}` : ''}</span>
        )}
      </div>
    </div>
  );
}

const REF_SECTIONS = {
  terms: {
    title: 'الشروط والأحكام',
    subtitle: 'اتفاقية استخدام منصّة محور',
    desc: 'الإطار القانوني الذي يحكم استخدام العملاء للمنصّة. سيتمّ رفع النصّ الرسمي من mhwar.com كما هو بدون تعديل.',
    icon: <IconShield size={28}/>,
    tabs: [
      { id: 'service',     label: 'استخدام الخدمة',    desc: 'حدود الإرسال، الاستخدام العادل، حالات المنع.' },
      { id: 'ip',          label: 'الملكية الفكرية',   desc: 'حقوق محور على البرمجيات، وحقوق العميل على محتواه.' },
      { id: 'liability',   label: 'المسؤولية والتعويض', desc: 'سقف المسؤولية، التعويض المتبادل.' },
      { id: 'fees',        label: 'الرسوم والفوترة',   desc: 'دورة الفوترة، التجديد، الاسترداد.' },
      { id: 'termination', label: 'الإنهاء والإخراج',  desc: 'شروط الإنهاء، تسليم البيانات.' },
      { id: 'law',         label: 'القانون الحاكم',    desc: 'النظام السعودي، جهة الاختصاص.' },
    ],
  },
  privacy: {
    title: 'سياسة الخصوصية',
    subtitle: 'حماية بيانات الأعضاء والعملاء',
    desc: 'كيف تجمع منصّة محور البيانات الشخصية، كيف تستخدمها، وما هي حقوق صاحب البيانات. متوافقة مع نظام حماية البيانات الشخصية (PDPL) السعودي.',
    icon: <IconShield size={28}/>,
    tabs: [
      { id: 'collect',   label: 'البيانات المُجمَّعة', desc: 'معرّفات الاتصال، بيانات الاستخدام، مؤشرات الأداء.' },
      { id: 'purpose',   label: 'أغراض الاستخدام',    desc: 'تقديم الخدمة، تحسين الأداء، الامتثال القانوني.' },
      { id: 'sharing',   label: 'مشاركة البيانات',    desc: 'مزوّدو البنية التحتية والأطراف ذات العلاقة.' },
      { id: 'rights',    label: 'حقوق صاحب البيانات', desc: 'الوصول، التصحيح، الحذف، الاعتراض، النقل.' },
      { id: 'retention', label: 'مدّة الاحتفاظ',      desc: 'جداول الاحتفاظ والحذف التلقائي.' },
      { id: 'cookies',   label: 'الكوكيز والتتبّع',   desc: 'الكوكيز المُستخدمة وكيفية التحكّم بها.' },
      { id: 'pdpl',      label: 'PDPL والامتثال',     desc: 'الالتزام بنظام حماية البيانات السعودي.' },
    ],
  },
  sla: {
    title: 'اتفاقية مستوى الخدمة (SLA)',
    subtitle: 'وعود الأداء والتوفّر للعملاء',
    desc: 'التزامات محور المُقاسة: نسبة التوفّر، زمن الاستجابة للدعم، زمن حل الأعطال، والتعويضات عند الإخلال.',
    icon: <IconCheckCircle size={28}/>,
    tabs: [
      { id: 'uptime',     label: 'نسبة التوفّر',       desc: 'هدف 99.9٪ شهرياً · آلية الاحتساب · الاستثناءات.' },
      { id: 'response',   label: 'زمن الاستجابة',      desc: 'مستويات الخطورة · وقت الرد · وقت الحل.' },
      { id: 'channels',   label: 'قنوات الدعم',        desc: 'واتساب، بريد، هاتف الطوارئ، ساعات العمل.' },
      { id: 'credits',    label: 'تعويضات الإخلال',    desc: 'سلّم الاعتمادات عند فوات الأهداف.' },
      { id: 'exclusions', label: 'استثناءات',          desc: 'الصيانة المجدولة، القوة القاهرة، الطرف الثالث.' },
      { id: 'reporting',  label: 'التقارير والمراجعة', desc: 'تقرير شهري، مراجعة ربع سنوية.' },
    ],
  },
  roadmap: {
    title: 'خارطة الطريق',
    subtitle: 'ما نبنيه · متى · ولماذا',
    desc: 'عرض علني لخطّة منتج محور. تتغذّى من بيانات المميزات الحيّة في المنصّة — فور تحديث حالة أي ميزة تظهر في تبويبها الصحيح هنا تلقائياً.',
    icon: <IconRefresh size={28}/>,
    tabs: [
      { id: 'overview',   label: 'نظرة عامّة' },
      { id: 'plan',       label: 'قاعدة المنتج',     section: 'plan', sectionLabel: 'التخطيط' },
      { id: 'principles', label: 'مبادئ التخطيط',     section: 'plan' },
      { id: 'status',     label: 'حالة التنفيذ',     section: 'exec', sectionLabel: 'التنفيذ' },
      { id: 'catalog',    label: 'دليل المنشور',      section: 'exec' },
      { id: 'phases',     label: 'المراحل الزمنية',  section: 'exec' },
    ],
  },
  glossary: {
    title: 'قاموس المصطلحات',
    subtitle: 'مفردات منصّة محور الموحّدة',
    desc: 'مرجع داخلي يوحّد فهم الفريق والعملاء لمصطلحات المنصّة: مجتمع، حالة، نمط، قناة، شريحة، قالب، رحلة.',
    icon: <IconCode size={28}/>,
    tabs: [
      { id: 'platform',   label: 'مفاهيم المنصّة',   desc: 'مجتمع، قناة، قالب، حملة، رحلة، شريحة.' },
      { id: 'patterns',   label: 'الأنماط والحالات', desc: 'مفتوح/مغلق/هجين، داخلي/خارجي، رسمي/غير رسمي.' },
      { id: 'channels',   label: 'القنوات',          desc: 'واتساب، بريد، SMS، إشعارات داخل التطبيق.' },
      { id: 'identity',   label: 'الهوية والدخول',   desc: 'OTP، نفاذ، كلمة مرور، أدوار، صلاحيات.' },
      { id: 'messaging',  label: 'قوالب الرسائل',    desc: 'Utility · Marketing · OTP · Authentication.' },
      { id: 'analytics',  label: 'القياس',           desc: 'معدّل الفتح، الردّ، الحضور، Churn، NPS.' },
      { id: 'compliance', label: 'الامتثال',         desc: 'PDPL، Opt-in، GDPR، ZATCA.' },
    ],
  },
};

const refStyles = {
  root: { minHeight: '100%', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit' },
  hero: { padding: '40px 32px 28px', borderBottom: '1px solid var(--line)', background: '#fbfaf7' },
  iconWrap: {
    width: 56, height: 56, borderRadius: 14,
    display: 'grid', placeItems: 'center',
    background: '#fff', border: '1px solid var(--line)',
    color: 'var(--ink-2)', flexShrink: 0,
  },
  eyebrow: {
    fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
    color: 'var(--muted)', marginBottom: 10,
    fontFamily: 'var(--mono, ui-monospace, monospace)',
  },
  title: { fontSize: 32, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2, margin: '0 0 6px' },
  subtitle: { fontSize: 15, color: 'var(--ink-2)', marginBottom: 14 },
  desc: { fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 640, textWrap: 'pretty' },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 999,
    background: '#fff', border: '1px solid var(--line)',
    fontSize: 11, color: 'var(--ink-2)',
    fontFamily: 'var(--mono, ui-monospace, monospace)', flexShrink: 0,
  },
  tabBar: { borderBottom: '1px solid var(--line)', background: '#fbfaf7', padding: '0 32px' },
  body: { padding: '40px 32px 80px' },
  emptyCard: {
    padding: '64px 32px', background: '#fff',
    border: '1px dashed var(--line)', borderRadius: 16, textAlign: 'center',
  },
  emptyIcon: { fontSize: 32, color: 'var(--faint)', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 600, marginBottom: 8 },
  emptyDesc: {
    fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8,
    maxWidth: 420, margin: '0 auto 20px', textWrap: 'pretty',
  },
  emptyMono: {
    display: 'inline-block', fontSize: 10.5, color: 'var(--muted)',
    letterSpacing: 1.5, textTransform: 'uppercase',
    fontFamily: 'var(--mono, ui-monospace, monospace)',
    padding: '4px 10px', borderRadius: 999,
    background: '#faf7f0', border: '1px solid var(--line)',
  },
  tabIntro: {
    padding: '16px 18px', marginBottom: 28,
    background: '#fff', borderRadius: 10, border: '1px solid var(--line)',
  },
  familyHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    paddingBottom: 10, marginBottom: 14,
    borderBottom: '1px solid var(--line)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 12,
  },
  featureCard: {
    padding: 14, background: '#fff',
    border: '1px solid var(--line)', borderRadius: 10,
  },
};

// ===== Glossary data =====
const GLOSSARY_TERMS = {
  platform: [
    { term: 'مجتمع', en: 'Community', def: 'الكيان الجذري في محور. كل عميل يملك مجتمعاً واحداً أو أكثر يحمل هوية مستقلة (اسم، شعار، دومين)، وداخله تُدار الأعضاء والفعاليات والقنوات.', note: 'مجتمع ≠ منظّمة. المنظّمة هي عميل محور؛ المجتمع هو ما يراه الأعضاء.' },
    { term: 'فضاء', en: 'Space', def: 'وحدة تنظيمية داخل المجتمع تجمع مجموعة من الأعضاء حول موضوع أو فعالية أو حالة مشتركة. الفضاء له قناة تواصل افتراضية وإعدادات صلاحيات مستقلة.' },
    { term: 'قناة', en: 'Channel', def: 'آلية إيصال الرسالة للعضو: واتساب، بريد إلكتروني، SMS، إشعار داخل التطبيق. كل قناة لها اشتراطات موافقة (Opt-in) وقوالب خاصة.', note: 'القناة ≠ الرسالة. القناة هي الطريق؛ الرسالة هي المحتوى.' },
    { term: 'عضو', en: 'Member', def: 'شخص مسجّل في مجتمع واحد أو أكثر. العضو يحمل هوية واحدة (رقم هاتف أو بريد) وقد تختلف أدواره وصلاحياته من مجتمع لآخر.' },
    { term: 'شريحة', en: 'Segment', def: 'مجموعة ديناميكية من الأعضاء تحدَّد بقواعد (حالة العضوية، الحضور، الاستجابة، الحقول المخصّصة). تُستخدم لاستهداف الحملات والرحلات.' },
    { term: 'رحلة', en: 'Journey', def: 'تسلسل آلي من الرسائل أو الإجراءات يُشغَّل بناءً على حدث (انضمام، غياب، دفع، استجابة). الرحلة تختلف عن الحملة بأنها مستمرة وشخصية.' },
    { term: 'حملة', en: 'Campaign', def: 'إرسال جماعي مجدوَل لشريحة محددة. الحملة لها تاريخ إرسال واحد ومحتوى ثابت، وتُقاس بمعدل الفتح والتفاعل.' },
    { term: 'قالب', en: 'Template', def: 'نص رسالة مُهيكَل ومعتمد مسبقاً، يحتوي على متغيّرات ({{اسم_العضو}}) تُملأ ديناميكياً. القوالب إلزامية لقناتَي واتساب و SMS.' },
    { term: 'فعالية', en: 'Event', def: 'نشاط زمني محدد يُنظّمه المجتمع (حضوري أو افتراضي). الفعالية تحمل حالة التسجيل، التذاكر، الحضور، والتذكيرات الآلية.' },
    { term: 'نموذج', en: 'Form', def: 'واجهة جمع بيانات مخصّصة (تسجيل، استبيان، طلب عضوية). النتائج تُخزَّن ضمن ملف العضو وتُغذّي الشرائح والرحلات.' },
  ],
  patterns: [
    { term: 'مجتمع مفتوح', en: 'Open Community', def: 'أي شخص يستطيع الانضمام دون موافقة مسبقة. يُستخدم للمجتمعات العامة والندوات المفتوحة.' },
    { term: 'مجتمع مغلق', en: 'Closed Community', def: 'الانضمام يستلزم موافقة المشرف أو رمزاً دعوياً. يُستخدم للأكاديميات والمجتمعات المدفوعة والجمعيات المهنية.' },
    { term: 'مجتمع هجين', en: 'Hybrid Community', def: 'جزء من المحتوى عام (مفتوح) وجزء محجوب لشرائح معينة. يتيح بناء قُمع بين الاهتمام المجاني والعضوية المميّزة.' },
    { term: 'عضوية داخلية', en: 'Internal Membership', def: 'أعضاء من داخل المنظّمة (موظفون، طلاب، أعضاء مجلس). يدخلون عادةً عبر SSO أو نفاذ.' },
    { term: 'عضوية خارجية', en: 'External Membership', def: 'أعضاء من خارج المنظّمة (عملاء، جمهور عام، شركاء). يدخلون عبر OTP أو رابط دعوة.' },
    { term: 'علامة بيضاء', en: 'White Label', def: 'الواجهة والرسائل تحمل هوية عميل محور كاملاً (اسم، شعار، دومين) دون ظهور اسم "محور". مبدأ تصميمي أساسي لكل ميزة.' },
    { term: 'BYO (اصطحب مزوّدك)', en: 'Bring Your Own', def: 'نمط يتيح للعميل ربط مزوّد خدمة خاص به (Meta Business Account، SendGrid، Twilio) بدل استخدام بنية محور المشتركة. يمنح استقلالية كاملة ويُخفض التكلفة المشتركة.' },
  ],
  channels: [
    { term: 'واتساب (رسمي)', en: 'WhatsApp Business API', def: 'قناة مُدارة عبر Meta Business API. تشترط قوالب معتمدة مسبقاً من Meta وبرقم مسجّل. تنقسم الرسائل إلى: Utility، Marketing، Authentication، OTP.' },
    { term: 'واتساب BYO', en: 'WhatsApp BYO', def: 'نمط يربط العميل حساب Meta Business الخاص به بمحور. يُوفّر استقلالية الرقم والفواتير المباشرة مع Meta.' },
    { term: 'البريد الإلكتروني', en: 'Email', def: 'قناة HTML وNS أو نص عادي. تشترط Opt-in صريح ورابط إلغاء اشتراك. تُقاس بـ Open Rate و Click Rate و Bounce Rate.' },
    { term: 'البريد BYO', en: 'Email BYO', def: 'ربط خادم SMTP أو حساب SendGrid/Mailgun خاص بالعميل. يُبقي السمعة البريدية (Sender Reputation) تحت سيطرة العميل.' },
    { term: 'SMS', en: 'SMS', def: 'رسائل نصية قصيرة. مقيّدة بمحتوى نصي فقط و160 حرفاً للرسالة العربية. تتطلّب Opt-in وتخضع لاشتراطات هيئة الاتصالات.' },
    { term: 'إشعار داخل التطبيق', en: 'In-App Notification', def: 'إشعار يظهر داخل تطبيق أو موقع العميل عبر SDK محور. لا يحتاج Opt-in مستقل ويُستخدم لتعزيز القنوات الأخرى.' },
  ],
  identity: [
    { term: 'OTP', en: 'One-Time Password', def: 'رمز مؤقت يُرسَل عبر SMS أو واتساب للتحقق من هوية العضو عند الدخول. صالح لدقائق محدودة وللاستخدام مرة واحدة.' },
    { term: 'نفاذ', en: 'Nafath', def: 'منصة الهوية الوطنية السعودية. يتيح دخول الأعضاء السعوديين بهوية موثّقة دون كلمة مرور. يُستخدم في المجتمعات الحكومية والمهنية.' },
    { term: 'SSO', en: 'Single Sign-On', def: 'دخول موحّد يربط حساب محور بنظام الهوية الخاص بالمنظّمة (Azure AD، Okta، Google Workspace). يُستخدم للعضويات الداخلية.' },
    { term: 'دور', en: 'Role', def: 'مجموعة صلاحيات جاهزة تُعيَّن للعضو داخل مجتمع: مشرف، مشرف محتوى، مُنظّم فعالية، عضو عادي، ضيف. كل دور يحدد ما يستطيع رؤيته وتعديله.' },
    { term: 'حقل مخصّص', en: 'Custom Field', def: 'بيانات إضافية تُجمَع من الأعضاء خلال التسجيل أو النماذج (مسمّى وظيفي، مدينة، رقم عضوية). تُستخدم في الشرائح والتخصيص.' },
  ],
  messaging: [
    { term: 'Utility', en: 'Utility Message', def: 'رسالة خدمية ذات صلة مباشرة بتفاعل العضو: تأكيد حجز، إيصال دفع، تذكير موعد. أعلى معدلات فتح وأقل قيود من Marketing.' },
    { term: 'Marketing', en: 'Marketing Message', def: 'رسالة ترويجية أو إعلانية: إطلاق ميزة، دعوة لفعالية، عرض. تتطلّب Opt-in صريح ومراجعة Meta للقالب.' },
    { term: 'Authentication', en: 'Authentication Message', def: 'رسالة للتحقق من هوية المستخدم عبر كود. تختلف عن OTP بأنها قالب مُدار بمعايير Meta الأمنية وتُرسَل فقط للأرقام المسجّلة.' },
    { term: 'OTP (قالب)', en: 'OTP Template', def: 'قالب واتساب مخصّص لإرسال رمز التحقق. يحمل نصاً ثابتاً ومتغيّراً واحداً (الرمز) وصلاحية محدودة.' },
    { term: 'متغيّر القالب', en: 'Template Variable', def: 'حقل ديناميكي داخل نص القالب يُشار إليه بـ {{1}} أو {{اسم}}. يُملأ تلقائياً من بيانات العضو أو الفعالية عند الإرسال.' },
    { term: 'Header / Body / Footer', en: 'Message Structure', def: 'هيكل رسالة واتساب: Header (صورة أو نص بارز)، Body (المحتوى الرئيسي)، Footer (تنبيه أو Opt-out)، Buttons (إجراء أو رابط). كل جزء له حد أحرف مستقل.' },
  ],
  analytics: [
    { term: 'معدّل الفتح', en: 'Open Rate', def: 'نسبة مَن فتحوا الرسالة من إجمالي مَن استلموها. معيار قياسي للبريد الإلكتروني؛ في واتساب يُقاس بمعدّل القراءة (آخر قراءة).' },
    { term: 'معدّل النقر', en: 'Click-Through Rate (CTR)', def: 'نسبة مَن نقروا على رابط أو زر داخل الرسالة. يقيس جودة المحتوى والدعوة للإجراء (CTA).' },
    { term: 'معدّل الردّ', en: 'Reply Rate', def: 'نسبة مَن ردّوا على الرسالة. مؤشر لتفاعل العضو ودرجة ارتباطه بالمجتمع.' },
    { term: 'معدّل الحضور', en: 'Attendance Rate', def: 'نسبة مَن حضروا الفعالية من إجمالي المسجّلين. فجوة كبيرة بين التسجيل والحضور تشير إلى ضعف في تذكيرات أو توقيت الفعالية.' },
    { term: 'Churn', en: 'Member Churn', def: 'معدّل ترك الأعضاء للمجتمع خلال فترة. يُقاس على مستوى المجتمع والفضاء. ارتفاعه يشير إلى مشكلة في القيمة أو التواصل.' },
    { term: 'NPS', en: 'Net Promoter Score', def: 'مؤشر ترشيح: ما احتمال أن يوصي العضو بالمجتمع لغيره؟ يُقاس عبر نماذج محور ويُستخدم لقياس الرضا وجودة التجربة.' },
    { term: 'Delivery Rate', en: 'Delivery Rate', def: 'نسبة الرسائل التي وصلت بنجاح من إجمالي المُرسَلة. انخفاضه يشير إلى مشكلة في أرقام أو عناوين الوصول.' },
    { term: 'Opt-out Rate', en: 'Opt-out Rate', def: 'نسبة مَن أوقفوا استقبال الرسائل. ارتفاعه يشير إلى إفراط في التواصل أو محتوى غير ملائم.' },
  ],
  compliance: [
    { term: 'Opt-in', en: 'Explicit Opt-in', def: 'موافقة صريحة من العضو على استقبال رسائل تسويقية عبر قناة معيّنة. شرط قانوني في PDPL وSMS واتفاقيات Meta. لا ترسل قبل الحصول عليها.' },
    { term: 'Opt-out', en: 'Opt-out / Unsubscribe', def: 'حق العضو في سحب موافقته وإيقاف استقبال الرسائل. يجب توفير آلية واضحة في كل حملة تسويقية.' },
    { term: 'PDPL', en: 'Personal Data Protection Law', def: 'نظام حماية البيانات الشخصية السعودي. يُلزم بجمع البيانات بموافقة، تحديد غرض الاستخدام، وحماية بيانات الأعضاء. نافذ اعتباراً من 2024.' },
    { term: 'GDPR', en: 'General Data Protection Regulation', def: 'لائحة حماية البيانات الأوروبية. تسري على مجتمعات تضم أعضاء من الاتحاد الأوروبي بصرف النظر عن موقع المنظّمة.' },
    { term: 'نافذة الـ 24 ساعة', en: '24-Hour Session Window', def: 'نافذة المحادثة في واتساب: بعد ردّ العضو، يمكن إرسال رسائل حرة لمدة 24 ساعة دون قالب معتمد. خارجها، القوالب إلزامية.' },
    { term: 'معرّف المُرسِل', en: 'Sender ID', def: 'الاسم الذي يظهر للمستلم في SMS. يتطلّب تسجيلاً مسبقاً لدى مزوّد SMS والجهة المرخّصة. في واتساب يُعرض اسم الحساب التجاري.' },
  ],
};

// ===== GlossarySection =====
function SlaSection({ tabId }) {
  const C = {
    card: { background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 22, marginBottom: 16 },
    h: { margin: '0 0 4px', fontSize: 17, fontWeight: 600 },
    sub: { margin: '0 0 16px', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 },
    th: { padding: '10px 14px', textAlign: 'start', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', background: 'var(--warm, #faf7f0)', borderBottom: '1px solid var(--line)' },
    td: { padding: '11px 14px', fontSize: 12.5, color: 'var(--ink-2)', borderBottom: '1px solid var(--line)', verticalAlign: 'top' },
    fcell: { fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' },
    note: { background: 'oklch(0.97 0.02 250)', border: '1px solid oklch(0.9 0.04 250)', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.8, marginTop: 4 },
    pill: (hue) => ({ display: 'inline-block', padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: `oklch(0.4 0.15 ${hue})`, background: `oklch(0.95 0.05 ${hue})` }),
  };
  const Table = ({ head, rows }) => (
    <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 12 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>{head.map((h, i) => <th key={i} style={{ ...C.th, borderInlineStart: i ? '1px solid var(--line)' : 'none' }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, ri) => (
          <tr key={ri}>{r.map((c, ci) => <td key={ci} style={{ ...C.td, ...(ci === 0 ? C.fcell : {}), borderInlineStart: ci ? '1px solid var(--line)' : 'none', borderBottom: ri === rows.length - 1 ? 'none' : C.td.borderBottom }}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );

  if (tabId === 'uptime') return (
    <div>
      <div style={C.card}>
        <h3 style={C.h}>الالتزام الأساسي بالتوفّر</h3>
        <p style={C.sub}>تضمن «محور» نسبة توفّر شهريّة للخدمات الأساسيّة (لوحة التحكّم، استقبال التسجيلات، تشغيل الفعاليّات، واجهات الإرسال) بحسب الباقة.</p>
        <Table
          head={['الباقة', 'هدف التوفّر الشهري', 'طبيعة الالتزام']}
          rows={[
            ['المجتمع', '—', 'بذل أفضل جهد (بدون ضمان تعاقدي)'],
            ['النمو', '99.5٪', 'هدف معلن'],
            ['المؤسّسة', '99.9٪', <span>التزام تعاقدي ملزم <span style={C.pill(145)}>SLA</span></span>],
          ]}
        />
        <div style={C.note}>
          <b>آليّة الاحتساب:</b> التوفّر = (دقائق الشهر − دقائق التعطّل غير المخطّط) ÷ دقائق الشهر × 100. تُقاس عبر منصّة مراقبة مستقلّة على مدار الساعة. لا تُحتسب ضمن التعطّل: الصيانة المجدولة المُعلَنة مسبقاً، والأعطال خارج سيطرة محور.
        </div>
      </div>
      <div style={C.card}>
        <h3 style={C.h}>الصيانة المجدولة</h3>
        <p style={C.sub}>تُجرى خارج أوقات الذروة (عادةً 1:00–5:00 صباحاً بتوقيت السعودية) بإشعار مسبق لا يقلّ عن <b>72 ساعة</b>، وبحدّ أقصى <b>4 ساعات شهريّاً</b> لا تُحتسب ضمن التعطّل.</p>
      </div>
    </div>
  );

  if (tabId === 'response') return (
    <div style={C.card}>
      <h3 style={C.h}>مستويات الخطورة وأزمنة الاستجابة</h3>
      <p style={C.sub}>تُصنّف البلاغات حسب الأثر، ولكلّ مستوى زمن ردّ أوّليّ وزمن حلّ مستهدف (باقة المؤسّسة).</p>
      <Table
        head={['الدرجة', 'التعريف', 'زمن الردّ', 'زمن الحلّ المستهدف']}
        rows={[
          [<span><span style={C.pill(25)}>P1 حرِجة</span></span>, 'توقّف كامل أو تعذّر الإرسال لكل المستخدمين', 'خلال 30 دقيقة', 'خلال 4 ساعات'],
          [<span><span style={C.pill(50)}>P2 عالية</span></span>, 'تعطّل ميزة أساسيّة دون بديل (تذاكر، تسجيل، فوترة)', 'خلال ساعتين', 'خلال يوم عمل'],
          [<span><span style={C.pill(250)}>P3 متوسّطة</span></span>, 'خلل جزئيّ مع حلّ بديل مؤقّت', 'خلال 8 ساعات عمل', 'خلال 3 أيّام عمل'],
          [<span><span style={C.pill(200)}>P4 منخفضة</span></span>, 'استفسار أو طلب تحسين أو خلل تجميليّ', 'خلال يوم عمل', 'حسب خطّة الإصدار'],
        ]}
      />
      <div style={C.note}>أزمنة الردّ للدرجات P1 وP2 على مدار الساعة (24×7). الدرجات P3 وP4 ضمن أيّام وساعات العمل الرسميّة.</div>
    </div>
  );

  if (tabId === 'channels') return (
    <div style={C.card}>
      <h3 style={C.h}>قنوات الدعم والتصعيد</h3>
      <p style={C.sub}>تختلف القنوات والإتاحة حسب الباقة — تتدرّج من المجتمع إلى مدير حساب مخصّص.</p>
      <Table
        head={['القناة', 'التغطية', 'الإتاحة', 'الباقة']}
        rows={[
          ['منتدى المجتمع', 'أسئلة عامّة ومشاركة المعرفة', 'دائم', 'الكل'],
          ['البريد والتذاكر', 'كل الدرجات مع تتبّع الحالة', '24×7 استقبال', 'النمو فأعلى'],
          ['الدردشة المباشرة', 'دعم سريع خلال ساعات العمل', 'بريد 24 ساعة + دردشة', 'النمو فأعلى'],
          ['مدير حساب مخصّص', 'نقطة تواصل + قناة Slack/واتساب', 'أيّام العمل', 'المؤسّسة'],
          [<span>خطّ الطوارئ <span style={C.pill(25)}>P1</span></span>, 'هاتف/واتساب للحوادث الحرِجة فقط', '24×7', 'المؤسّسة'],
        ]}
      />
    </div>
  );

  if (tabId === 'credits') return (
    <div style={C.card}>
      <h3 style={C.h}>تعويضات الإخلال (Service Credits)</h3>
      <p style={C.sub}>عند فوات هدف التوفّر الشهري في باقة المؤسّسة، يستحقّ العميل رصيداً يُضاف على الفاتورة التالية.</p>
      <Table
        head={['التوفّر الشهري المُحقّق', 'التعويض (من الاشتراك الشهري)']}
        rows={[
          ['أقل من 99.9٪ وحتى 99.0٪', <span style={C.pill(50)}>رصيد 10٪</span>],
          ['أقل من 99.0٪ وحتى 95.0٪', <span style={C.pill(40)}>رصيد 25٪</span>],
          ['أقل من 95.0٪', <span style={C.pill(25)}>رصيد 50٪</span>],
        ]}
      />
      <div style={C.note}>
        <b>شروط المطالبة:</b> يُقدّم الطلب خلال 30 يوماً من الحادثة. يُضاف التعويض كرصيد على الفاتورة التالية ولا يُصرف نقداً. <b>السقف السنوي للتعويضات:</b> ما يعادل شهر اشتراك واحد.
      </div>
    </div>
  );

  if (tabId === 'exclusions') return (
    <div style={C.card}>
      <h3 style={C.h}>الاستثناءات</h3>
      <p style={C.sub}>لا يشمل ضمان التوفّر الحالات التالية، ولا تُحتسب ضمن دقائق التعطّل:</p>
      <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 2 }}>
        <li>الصيانة المجدولة المُعلَن عنها مسبقاً (إشعار 72 ساعة).</li>
        <li>أعطال خارجة عن سيطرة محور: مزوّدو Meta / AWS / مشغّلو الاتصالات.</li>
        <li>سوء استخدام العميل أو تجاوز الحدود التعاقديّة أو مخالفة سياسة الاستخدام.</li>
        <li>القوّة القاهرة (كوارث، انقطاعات إقليميّة، قرارات تنظيميّة طارئة).</li>
        <li>إعدادات أو تكاملات من طرف العميل تتسبّب في الخلل.</li>
      </ul>
      <div style={C.note}>تُوثّق كل حادثة كبرى في <b>تقرير ما بعد الحادثة (RCA)</b> يصدر خلال 5 أيّام عمل، متضمّناً السبب الجذري والإجراءات الوقائيّة.</div>
    </div>
  );

  if (tabId === 'reporting') return (
    <div style={C.card}>
      <h3 style={C.h}>التقارير والمراجعة</h3>
      <p style={C.sub}>شفافيّة دوريّة حول الأداء والالتزام بالأهداف.</p>
      <Table
        head={['النوع', 'المحتوى', 'التكرار']}
        rows={[
          ['تقرير التوفّر الشهري', 'نسبة التوفّر المُحقّقة، الحوادث، التعويضات المستحقّة', 'شهري'],
          ['تقرير ما بعد الحادثة (RCA)', 'السبب الجذري والإجراءات التصحيحيّة', 'عند كل حادثة كبرى'],
          ['مراجعة الأعمال الدوريّة', 'الأداء، خارطة الطريق، التوصيات', 'ربع سنويّة'],
          ['لوحة الحالة المباشرة', 'حالة الخدمات الآنيّة + سجلّ الحوادث', 'مباشر (24×7)'],
        ]}
      />
    </div>
  );

  return null;
}

function GlossarySection() {
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('platform');

  const tabs = [
    { id: 'platform',   label: 'مفاهيم المنصّة',   count: GLOSSARY_TERMS.platform.length },
    { id: 'patterns',   label: 'الأنماط والتشغيل',  count: GLOSSARY_TERMS.patterns.length },
    { id: 'channels',   label: 'القنوات',            count: GLOSSARY_TERMS.channels.length },
    { id: 'identity',   label: 'الهوية والدخول',     count: GLOSSARY_TERMS.identity.length },
    { id: 'messaging',  label: 'قوالب الرسائل',      count: GLOSSARY_TERMS.messaging.length },
    { id: 'analytics',  label: 'القياس والتحليل',    count: GLOSSARY_TERMS.analytics.length },
    { id: 'compliance', label: 'الامتثال والخصوصية', count: GLOSSARY_TERMS.compliance.length },
  ];

  const q = search.trim().toLowerCase();
  const allTerms = Object.values(GLOSSARY_TERMS).flat();
  const isSearching = q.length > 1;

  const displayTerms = isSearching
    ? allTerms.filter(t =>
        t.term.includes(q) || t.en.toLowerCase().includes(q) || t.def.includes(search.trim()) || (t.note || '').includes(search.trim())
      )
    : (GLOSSARY_TERMS[activeTab] || []);

  return (
    <div>
      {/* Search bar */}
      <div style={{ padding: '0 0 24px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', border: '1px solid var(--line)',
          borderRadius: 10, padding: '10px 14px',
        }}>
          <span style={{ color: 'var(--muted)', fontSize: 15 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن مصطلح بالعربي أو الإنجليزي…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13.5, color: 'var(--ink)', fontFamily: 'inherit',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 16, padding: 0 }}>×</button>
          )}
        </div>
      </div>

      {/* Tabs — hidden when searching */}
      {!isSearching && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '6px 14px', borderRadius: 999, border: '1px solid',
              borderColor: activeTab === t.id ? 'var(--accent)' : 'var(--line)',
              background: activeTab === t.id ? 'var(--accent)' : '#fff',
              color: activeTab === t.id ? '#fff' : 'var(--ink-2)',
              fontSize: 12.5, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {t.label}
              <span style={{
                background: activeTab === t.id ? 'rgba(255,255,255,0.25)' : '#f0ede8',
                color: activeTab === t.id ? '#fff' : 'var(--muted)',
                borderRadius: 999, padding: '1px 7px', fontSize: 10.5, fontWeight: 600,
              }}>{t.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {isSearching && (
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16, fontFamily: 'var(--mono, monospace)' }}>
          {displayTerms.length} نتيجة · "{search}"
        </div>
      )}

      {displayTerms.length === 0 && (
        <div style={{ ...refStyles.emptyCard }}>
          <div style={{ fontSize: 28, marginBottom: 10, color: 'var(--faint)' }}>○</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>لا توجد نتيجة</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>جرّب كلمة أخرى بالعربي أو الإنجليزي</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {displayTerms.map((t, i) => (
          <GlossaryCard key={t.term + i} item={t} />
        ))}
      </div>

      <div style={{ marginTop: 40, padding: '14px 18px', background: '#faf7f0', borderRadius: 10, border: '1px solid var(--line)', fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono, monospace)', textAlign: 'center' }}>
        {allTerms.length} مصطلح · {tabs.length} فئة · آخر تحديث {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
      </div>
    </div>
  );
}

function GlossaryCard({ item }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: '#fff', border: '1px solid var(--line)',
        borderRadius: 10, padding: '14px 18px', cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: open ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
        borderColor: open ? 'var(--accent)' : 'var(--line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{item.term}</span>
            <span style={{
              fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono, monospace)',
              padding: '2px 8px', background: '#f5f2ec', borderRadius: 999, letterSpacing: 0.3,
            }}>{item.en}</span>
          </div>
          {!open && (
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.6,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '80%',
            }}>{item.def}</div>
          )}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 12, flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</div>
      </div>
      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.85, textWrap: 'pretty' }}>{item.def}</div>
          {item.note && (
            <div style={{
              marginTop: 10, padding: '8px 12px',
              background: '#faf7f0', borderRadius: 8,
              fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.7,
              borderRight: '3px solid var(--accent)',
            }}>
              <strong style={{ color: 'var(--ink)', marginLeft: 4 }}>ملاحظة:</strong>{item.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { RefSection, REF_SECTIONS, GlossarySection });
