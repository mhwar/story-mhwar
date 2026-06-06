// Pricing strategies tab — 3 distinct packaging models for selling Mhwar.
// Internal reference for sales team to pick the right framing per client.

const { useState: useStatePR, useMemo: useMemoPR } = React;

// =========================================================
// The three pricing models
// =========================================================
const PRICING_MODELS = [
  {
    id: 'tiered',
    code: '01',
    name: 'الباقات المتدرّجة',
    subtitle: 'Tiered SaaS · الأسلوب الأكثر شيوعاً',
    philosophy: 'ثلاث باقات بميزات تتدرّج — يختار العميل ما يناسب حجمه.',
    bestFor: 'الجهات التي تعرف احتياجها ولديها ميزانيّة محدّدة · أسرع طريقة للإغلاق.',
    hue: 220,
    icon: '◈',
    strengths: [
      'قرار شراء سريع — الخيارات واضحة',
      'يُشجّع الترقية مع نمو الجهة',
      'سهل الحساب والتوقّع المالي',
    ],
    concerns: [
      'قد لا يناسب العملاء ذوي الاحتياج غير التقليدي',
      'بعض الجهات قد تدفع أكثر من حاجتها الفعلية',
    ],
    plans: [
      {
        name: 'Starter',
        ar: 'البدء',
        price: '999',
        period: 'ريال / شهر',
        tagline: 'لفريق واحد يبدأ بالمجتمعات',
        highlight: false,
        features: [
          { t: 'مجتمع واحد', ok: true },
          { t: '5 فعاليّات شهرياً', ok: true },
          { t: 'حتى 500 مدعوّ لكل فعالية', ok: true },
          { t: 'واتساب + بريد إلكتروني', ok: true },
          { t: 'تحليلات أساسية', ok: true },
          { t: 'تسجيل بهويّة محور', ok: true },
          { t: 'API + تكاملات متقدّمة', ok: false },
          { t: 'دعم مخصّص', ok: false },
        ],
      },
      {
        name: 'Growth',
        ar: 'النموّ',
        price: '2,990',
        period: 'ريال / شهر',
        tagline: 'للجهات ذات مجتمعات متعدّدة',
        highlight: true,
        badge: 'الأكثر طلباً',
        features: [
          { t: 'حتى 5 مجتمعات', ok: true },
          { t: '20 فعاليّة شهرياً', ok: true },
          { t: 'حتى 5,000 مدعوّ لكل فعالية', ok: true },
          { t: 'كل قنوات التواصل + SMS', ok: true },
          { t: 'تحليلات متقدّمة + تقارير PDF', ok: true },
          { t: 'هويّة كاملة (دومين + شعار)', ok: true },
          { t: 'تكاملات (Zapier, Google, Slack)', ok: true },
          { t: 'مدير حساب مخصّص', ok: true },
        ],
      },
      {
        name: 'Enterprise',
        ar: 'المؤسسي',
        price: 'حسب الطلب',
        period: 'عقد سنوي',
        tagline: 'للجهات الكبرى والمؤسسات الحكومية',
        highlight: false,
        features: [
          { t: 'مجتمعات غير محدودة', ok: true },
          { t: 'فعاليّات غير محدودة', ok: true },
          { t: 'مدعوّون غير محدودون', ok: true },
          { t: 'SLA ضمان 99.9٪', ok: true },
          { t: 'SSO + صلاحيات متقدّمة', ok: true },
          { t: 'استضافة داخل المملكة', ok: true },
          { t: 'تطوير مخصّص', ok: true },
          { t: 'تدريب وفِرَق تنفيذ', ok: true },
        ],
      },
    ],
  },
  {
    id: 'per-community',
    code: '02',
    name: 'التسعير حسب المجتمع',
    subtitle: 'Per-Community · نموذج قابل للتوسّع',
    philosophy: 'اشتراك قاعدي ثابت، ثم رسم لكل مجتمع يُضاف. شفاف ومباشر.',
    bestFor: 'الجهات التي تدير عدّة مجتمعات مستقلّة (مثل الجمعيات، الشركات متعدّدة الأقسام، المراكز الثقافية).',
    hue: 150,
    icon: '◉',
    strengths: [
      'يتوسّع مع نمو العميل طبيعيّاً',
      'شفاف — العميل يرى ما يدفع مقابله',
      'يُشجّع على إضافة المجتمعات = زيادة الإيراد',
    ],
    concerns: [
      'تعقيد في الفوترة مع التغييرات الشهريّة',
      'قد يُخيف العملاء الذين يخطّطون للنمو السريع',
    ],
    breakdown: [
      { label: 'اشتراك قاعدي شهري', value: '999 ر.س', sub: 'يشمل: منصّة، تحليلات، دعم، تحديثات' },
      { label: 'لكل مجتمع إضافي', value: '399 ر.س', sub: 'يشمل: نمط تواصل مستقل، هويّة، فعاليات' },
      { label: 'لكل قناة واتساب (رقم)', value: '149 ر.س', sub: 'اختياري — لمن يحتاج قناة واتساب مستقلّة لكل مجتمع' },
      { label: 'حزمة 10,000 رسالة إضافية', value: '299 ر.س', sub: 'الرسائل الأساسية: 5,000 / شهر في الاشتراك القاعدي' },
    ],
    examples: [
      { label: 'جهة صغيرة (مجتمعان)', v: '999 + 399×2 = 1,797 ر.س' },
      { label: 'جهة متوسطة (5 مجتمعات)', v: '999 + 399×5 = 2,994 ر.س' },
      { label: 'جهة كبيرة (10 مجتمعات + قنوات)', v: '999 + 399×10 + 149×5 = 5,734 ر.س' },
    ],
    whenToUse: [
      'العميل له طبيعة مجتمعات متعدّدة (جمعيّات، مراكز، شركات متفرّعة)',
      'يريد شفافية في الفوترة',
      'يبدأ بصغير ويخطّط للتوسّع',
    ],
  },
  {
    id: 'usage-based',
    code: '03',
    name: 'التسعير حسب الاستخدام',
    subtitle: 'Usage-Based + Base · نموذج مرِن',
    philosophy: 'اشتراك قاعدي منخفض + سعر لكل مدعوّ فعلي في الفعاليات.',
    bestFor: 'الجهات الموسميّة والمُنظّمين المحترفين · تدفع أكثر عندما تحصّل أكثر.',
    hue: 30,
    icon: '◐',
    strengths: [
      'حاجز دخول منخفض — الاشتراك الشهري صغير',
      'يعكس القيمة الحقيقية — كلّما كبرت فعالياتك دفعت أكثر',
      'مثالي للعملاء ذوي الفعاليّات الكبرى الموسميّة',
    ],
    concerns: [
      'صعوبة التنبّؤ بالإيرادات الشهريّة',
      'قد يشعر العميل أنه «يُعاقب» على النجاح',
      'يحتاج مراقبة دقيقة للحدّ من المفاجآت في الفاتورة',
    ],
    breakdown: [
      { label: 'اشتراك قاعدي شهري', value: '499 ر.س', sub: 'يفتح المنصّة، حتى 200 مدعوّ شهرياً مجّاناً' },
      { label: 'لكل مدعوّ إضافي (تسجيل)', value: '1.5 ر.س', sub: 'يُحتسب على المسجّلين فعلياً — لا على الدعوات' },
      { label: 'لكل مدعوّ حاضر (check-in)', value: '2.0 ر.س', sub: 'اختياري — بديل عن التسجيل لمن يريد الدفع على الحضور الفعلي' },
      { label: 'حزمة Premium add-on', value: '499 ر.س', sub: 'يشمل: تحليلات متقدّمة، API، دعم مخصّص' },
    ],
    examples: [
      { label: 'فعاليّة واحدة شهرياً · 300 مدعوّ', v: '499 + 100×1.5 = 649 ر.س' },
      { label: 'مُنظّم محترف · 2,000 مدعوّ شهرياً', v: '499 + 1,800×1.5 = 3,199 ر.س' },
      { label: 'مؤتمر موسمي · 10,000 مدعوّ/الحدث', v: '499 + 9,800×1.5 = 15,199 ر.س' },
    ],
    whenToUse: [
      'العميل مُنظّم فعاليّات محترف',
      'لديه موسميّة عالية (معارض، مؤتمرات)',
      'يريد دفع ما يستحقّ فعلاً',
    ],
  },
];

// =========================================================
// Comparison matrix data
// =========================================================
const COMPARISON_ROWS = [
  { dim: 'وضوح السعر',           tiered: 5, comm: 4, usage: 3 },
  { dim: 'سهولة الشرح للعميل',    tiered: 5, comm: 4, usage: 3 },
  { dim: 'مرونة الاستخدام',       tiered: 2, comm: 4, usage: 5 },
  { dim: 'توقّع الإيرادات',       tiered: 5, comm: 4, usage: 2 },
  { dim: 'التوسّع مع نمو العميل', tiered: 3, comm: 5, usage: 5 },
  { dim: 'حاجز الدخول (منخفض=أفضل)', tiered: 2, comm: 3, usage: 5 },
];

// =========================================================
// Recommendation matrix — which to use per client profile
// =========================================================
const RECOMMENDATION_MATRIX = [
  { profile: 'شركة حكوميّة / مؤسسيّة', icon: '▲', pick: 'tiered',         reason: 'حاجة لعقد سنوي واضح ومتطلّبات خاصّة' },
  { profile: 'جمعيّة خيريّة / مركز ثقافي', icon: '◉', pick: 'per-community', reason: 'مجتمعات متعدّدة مستقلّة بطبيعتها' },
  { profile: 'مُنظّم مؤتمرات / معارض',   icon: '◐', pick: 'usage-based',   reason: 'موسميّة عالية وأحجام حضور ضخمة' },
  { profile: 'شركة ناشئة / ريادة أعمال', icon: '▶', pick: 'tiered',         reason: 'قرار سريع وميزانيّة محدّدة · Growth غالباً' },
  { profile: 'جامعة / كلّية',            icon: '▣', pick: 'per-community', reason: 'كل كلّية أو قسم مجتمع مستقل' },
  { profile: 'وكالة تنظيم فعاليّات',     icon: '◆', pick: 'usage-based',   reason: 'تحتسب التكلفة على العميل النهائي بسهولة' },
];

// =========================================================
// Main Pricing tab
// =========================================================
function AtlasPricingTab() {
  const [active, setActive] = useStatePR('tiered');
  const activeModel = PRICING_MODELS.find(m => m.id === active);

  const exportModelPDF = (model) => {
    const w = window.open('', '_blank', 'width=920,height=1100');
    if (!w) return;

    let bodyHtml = '';
    if (model.id === 'tiered') {
      bodyHtml = `
        <div class="tiers">
          ${model.plans.map(p => `
            <div class="tier ${p.highlight ? 'hl' : ''}">
              ${p.badge ? `<div class="tier-badge">${p.badge}</div>` : ''}
              <div class="tier-name">${p.name}</div>
              <div class="tier-ar">${p.ar}</div>
              <div class="tier-price"><span class="big">${p.price}</span><span class="sm">${p.period}</span></div>
              <div class="tier-tag">${p.tagline}</div>
              <ul class="tier-feat">
                ${p.features.map(f => `<li class="${f.ok ? 'ok' : 'no'}"><span class="mk">${f.ok ? '✓' : '—'}</span>${f.t}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      bodyHtml = `
        <h2>البنية</h2>
        <table class="breakdown">
          <tbody>
          ${model.breakdown.map(b => `
            <tr>
              <td class="b-l">
                <div class="b-label">${b.label}</div>
                <div class="b-sub">${b.sub}</div>
              </td>
              <td class="b-v">${b.value}</td>
            </tr>
          `).join('')}
          </tbody>
        </table>
        <h2>أمثلة محسوبة</h2>
        <div class="examples">
          ${model.examples.map(e => `
            <div class="ex">
              <div class="ex-l">${e.label}</div>
              <div class="ex-v">${e.v}</div>
            </div>
          `).join('')}
        </div>
        <h2>متى يُستخدم</h2>
        <ul class="when">
          ${model.whenToUse.map(w => `<li>${w}</li>`).join('')}
        </ul>
      `;
    }

    w.document.write(`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
      <title>${model.name} — محور</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif; color: #14130f; line-height: 1.75; margin: 0; padding: 40px; max-width: 900px; margin: 0 auto; background: #fff; }
        .brand-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 2px solid #14130f; margin-bottom: 22px; }
        .brand { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
        .brand small { font-size: 10.5px; color: #6b6a64; font-weight: 400; margin-inline-start: 8px; letter-spacing: 2.5px; }
        .doc-tag { font-size: 10px; padding: 4px 10px; background: oklch(0.55 0.15 ${model.hue}); color: #fff; border-radius: 999px; letter-spacing: 2px; }
        h1 { font-size: 30px; margin: 0 0 4px; letter-spacing: -0.6px; }
        .subtitle { color: #6b6a64; font-size: 13px; margin-bottom: 14px; }
        .philosophy { padding: 16px; background: oklch(0.97 0.03 ${model.hue}); border-radius: 12px; font-size: 14px; margin-bottom: 24px; color: #2b2a24; }
        h2 { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #6b6a64; border-bottom: 1px solid #e8e5dd; padding-bottom: 8px; margin: 24px 0 14px; }
        /* Tiered */
        .tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .tier { padding: 20px 16px; border: 1px solid #e8e5dd; border-radius: 14px; background: #fff; position: relative; page-break-inside: avoid; }
        .tier.hl { border-color: #14130f; border-width: 2px; }
        .tier-badge { position: absolute; top: -11px; right: 14px; background: #14130f; color: #fff; font-size: 10px; padding: 3px 10px; border-radius: 999px; letter-spacing: 1px; }
        .tier-name { font-size: 18px; font-weight: 600; }
        .tier-ar { font-size: 11px; color: #6b6a64; letter-spacing: 2px; margin-bottom: 12px; }
        .tier-price { margin: 10px 0; display: flex; align-items: baseline; gap: 6px; }
        .tier-price .big { font-size: 26px; font-weight: 600; letter-spacing: -0.5px; }
        .tier-price .sm { font-size: 11px; color: #6b6a64; }
        .tier-tag { font-size: 12px; color: #2b2a24; padding-bottom: 12px; border-bottom: 1px solid #e8e5dd; margin-bottom: 12px; }
        .tier-feat { list-style: none; padding: 0; margin: 0; }
        .tier-feat li { display: flex; align-items: flex-start; gap: 7px; font-size: 11.5px; margin-bottom: 6px; color: #2b2a24; }
        .tier-feat li.no { color: #a8a7a0; text-decoration: line-through; }
        .tier-feat .mk { width: 14px; font-weight: 700; color: oklch(0.55 0.15 ${model.hue}); }
        .tier-feat li.no .mk { color: #c8c7c0; }
        /* Breakdown */
        .breakdown { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
        .breakdown tr { border-bottom: 1px solid #e8e5dd; }
        .breakdown td { padding: 14px 0; vertical-align: top; }
        .b-label { font-size: 14px; font-weight: 500; margin-bottom: 3px; }
        .b-sub { font-size: 11.5px; color: #6b6a64; line-height: 1.6; }
        .b-v { text-align: end; font-size: 18px; font-weight: 600; color: oklch(0.45 0.15 ${model.hue}); white-space: nowrap; padding-inline-start: 14px; }
        .examples { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 18px; }
        .ex { padding: 12px 14px; background: #fbfaf7; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; gap: 14px; }
        .ex-l { font-size: 12.5px; }
        .ex-v { font-size: 13px; font-weight: 600; color: oklch(0.4 0.15 ${model.hue}); }
        .when { padding-inline-start: 20px; }
        .when li { font-size: 12.5px; margin-bottom: 6px; }
        .foot { margin-top: 36px; padding-top: 14px; border-top: 1px solid #e8e5dd; font-size: 10.5px; color: #6b6a64; display: flex; justify-content: space-between; }
        @media print { body { padding: 20px; } }
      </style>
    </head><body>
      <div class="brand-row">
        <div class="brand">محور <small>MHWAR</small></div>
        <div class="doc-tag">استراتيجية تسعير ${model.code}</div>
      </div>
      <h1>${model.name}</h1>
      <div class="subtitle">${model.subtitle}</div>
      <div class="philosophy"><strong>الفلسفة:</strong> ${model.philosophy}</div>
      <div class="philosophy" style="background:#fbfaf7"><strong>الأنسب لـ:</strong> ${model.bestFor}</div>
      ${bodyHtml}
      <div class="foot">
        <span>محور — منصّة إدارة المجتمعات</span>
        <span>داخلي · ${new Date().toLocaleDateString('ar')}</span>
      </div>
      <script>window.onload = () => setTimeout(() => window.print(), 400);</script>
    </body></html>`);
    w.document.close();
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 40px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.3 }}>استراتيجيّات التسعير والباقات</h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted)', maxWidth: 760, lineHeight: 1.7 }}>
          ثلاث طرق لبيع منصّة محور. كل نموذج يناسب شريحة عملاء مختلفة — استخدم المصفوفة أدناه لاختيار الأنسب لكل عميل.
        </p>
      </div>

      {/* Model selector tabs */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22,
      }}>
        {PRICING_MODELS.map(m => {
          const isActive = m.id === active;
          return (
            <button key={m.id} onClick={() => setActive(m.id)} style={{
              padding: '18px 16px', borderRadius: 14,
              background: isActive ? '#fff' : '#fff',
              border: isActive ? `2px solid oklch(0.55 0.15 ${m.hue})` : '1px solid var(--line)',
              cursor: 'pointer', textAlign: 'start', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', gap: 4,
              boxShadow: isActive ? `0 8px 20px -10px oklch(0.55 0.15 ${m.hue} / 0.4)` : 'none',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: `oklch(0.96 0.04 ${m.hue})`,
                  color: `oklch(0.45 0.15 ${m.hue})`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                }}>{m.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: 2,
                  color: 'var(--muted)',
                }}>{m.code}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{m.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Active model details */}
      <div style={{
        background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden',
        marginBottom: 24,
      }}>
        {/* Model header */}
        <div style={{
          padding: '22px 24px', borderBottom: '1px solid var(--line)',
          background: `oklch(0.99 0.015 ${activeModel.hue})`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 10.5, letterSpacing: 2, color: `oklch(0.45 0.14 ${activeModel.hue})`, fontWeight: 600 }}>
                {activeModel.code} · {activeModel.subtitle}
              </span>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>{activeModel.name}</h3>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', maxWidth: 720, lineHeight: 1.8 }}>
              {activeModel.philosophy}
            </p>
          </div>
          <button onClick={() => exportModelPDF(activeModel)} style={{
            padding: '9px 14px', borderRadius: 10,
            background: 'var(--ink)', color: '#fff', border: 'none',
            fontSize: 12, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>⬇ تصدير PDF</button>
        </div>

        {/* best for */}
        <div style={{ padding: '18px 24px', background: '#fbfaf7', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginInlineEnd: 8 }}>الأنسب لـ</span>
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{activeModel.bestFor}</span>
        </div>

        {/* Body — tiered vs others */}
        <div style={{ padding: 24 }}>
          {activeModel.id === 'tiered' ? (
            <TieredView model={activeModel} />
          ) : (
            <BreakdownView model={activeModel} />
          )}
        </div>

        {/* Strengths / concerns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '1px solid var(--line)' }}>
          <div style={{ padding: '20px 24px', borderInlineEnd: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10.5, color: 'oklch(0.5 0.15 145)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>
              ◉ نقاط القوّة
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {activeModel.strengths.map((s, i) => (
                <li key={i} style={{ fontSize: 12.5, lineHeight: 1.7, marginBottom: 6, color: 'var(--ink-2)', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'oklch(0.55 0.15 145)', fontWeight: 700 }}>+</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 10.5, color: 'oklch(0.5 0.17 25)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>
              ◐ نقاط للحذر
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {activeModel.concerns.map((s, i) => (
                <li key={i} style={{ fontSize: 12.5, lineHeight: 1.7, marginBottom: 6, color: 'var(--ink-2)', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'oklch(0.55 0.17 25)', fontWeight: 700 }}>!</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison matrix */}
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>مصفوفة المقارنة</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>تقييم على سلم 5 نقاط لكل بُعد مقارنة</p>
        </div>
        <div style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid var(--line)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fbfaf7' }}>
                <th style={compTh}>البُعد</th>
                <th style={compTh}>الباقات المتدرّجة</th>
                <th style={compTh}>حسب المجتمع</th>
                <th style={compTh}>حسب الاستخدام</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ ...compTd, fontWeight: 500 }}>{r.dim}</td>
                  <td style={compTd}><ScoreBar score={r.tiered} hue={220} /></td>
                  <td style={compTd}><ScoreBar score={r.comm} hue={150} /></td>
                  <td style={compTd}><ScoreBar score={r.usage} hue={30} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation matrix */}
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>دليل الاختيار السريع</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>النموذج الأنسب لكل شريحة عملاء</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {RECOMMENDATION_MATRIX.map((r, i) => {
            const m = PRICING_MODELS.find(p => p.id === r.pick);
            return (
              <div key={i} style={{
                padding: 16, borderRadius: 12,
                background: `oklch(0.99 0.015 ${m.hue})`,
                border: `1px solid oklch(0.92 0.03 ${m.hue})`,
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `oklch(0.96 0.04 ${m.hue})`,
                  color: `oklch(0.45 0.15 ${m.hue})`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, flexShrink: 0,
                }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{r.profile}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.6 }}>{r.reason}</div>
                  <button onClick={() => setActive(r.pick)} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 999,
                    background: `oklch(0.55 0.15 ${m.hue})`, color: '#fff',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                  }}>{m.name} ←</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// Tiered view — 3 plan cards
// =========================================================
function TieredView({ model }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {model.plans.map((p, i) => (
        <div key={i} style={{
          padding: 20, borderRadius: 14,
          background: '#fff',
          border: p.highlight ? `2px solid oklch(0.4 0.14 ${model.hue})` : '1px solid var(--line)',
          position: 'relative',
          boxShadow: p.highlight ? `0 14px 30px -14px oklch(0.4 0.14 ${model.hue} / 0.3)` : 'none',
        }}>
          {p.badge && (
            <div style={{
              position: 'absolute', top: -11, insetInlineStart: 18,
              background: `oklch(0.4 0.14 ${model.hue})`, color: '#fff',
              fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
              letterSpacing: 1.2,
            }}>{p.badge}</div>
          )}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.2 }}>{p.name}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 2, marginTop: 2 }}>{p.ar}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.8, color: `oklch(0.4 0.14 ${model.hue})` }}>{p.price}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.period}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', paddingBottom: 14, borderBottom: '1px solid var(--line)', marginBottom: 14 }}>
            {p.tagline}
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {p.features.map((f, j) => (
              <li key={j} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                fontSize: 11.5, lineHeight: 1.6, marginBottom: 6,
                color: f.ok ? 'var(--ink-2)' : '#a8a7a0',
                textDecoration: f.ok ? 'none' : 'line-through',
              }}>
                <span style={{
                  width: 14, fontWeight: 700,
                  color: f.ok ? `oklch(0.5 0.15 ${model.hue})` : '#c8c7c0',
                  flexShrink: 0,
                }}>{f.ok ? '✓' : '—'}</span>
                <span>{f.t}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// =========================================================
// Breakdown view — for per-community & usage-based
// =========================================================
function BreakdownView({ model }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 22 }}>
      <div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
          بنية السعر
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {model.breakdown.map((b, i) => (
            <div key={i} style={{
              padding: 14, border: '1px solid var(--line)', borderRadius: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14,
              background: '#fff',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>{b.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>{b.sub}</div>
              </div>
              <div style={{
                fontSize: 17, fontWeight: 600,
                color: `oklch(0.4 0.15 ${model.hue})`,
                whiteSpace: 'nowrap',
              }}>{b.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
          أمثلة محسوبة
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {model.examples.map((e, i) => (
            <div key={i} style={{
              padding: 12, background: `oklch(0.99 0.015 ${model.hue})`,
              border: `1px solid oklch(0.93 0.025 ${model.hue})`,
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 4 }}>{e.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'ui-monospace, monospace', color: 'var(--ink)' }}>{e.v}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>
          متى يُستخدم
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {model.whenToUse.map((w, i) => (
            <li key={i} style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ink-2)', display: 'flex', gap: 8 }}>
              <span style={{ color: `oklch(0.5 0.15 ${model.hue})` }}>▸</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// =========================================================
// Score bar component
// =========================================================
function ScoreBar({ score, hue }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2, flex: 1 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 2,
            background: i <= score ? `oklch(0.55 0.15 ${hue})` : 'var(--line)',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 10.5, fontWeight: 600, color: `oklch(0.45 0.15 ${hue})`, width: 14, textAlign: 'center' }}>{score}</span>
    </div>
  );
}

const compTh = {
  padding: '12px 14px', fontSize: 11, fontWeight: 600, letterSpacing: 1.2,
  textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'start',
};
const compTd = {
  padding: '14px', fontSize: 12.5, color: 'var(--ink-2)',
};

// =========================================================
Object.assign(window, { AtlasPricingTab, PRICING_MODELS });
