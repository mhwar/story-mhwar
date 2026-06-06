// =============================================================================
// Mhwar Pricing — Public-facing pricing reference (v2)
// Built from the official pricing model (v1, fixed 2026-05-02).
// Hybrid: Tiered subscription + WhatsApp Wallet (per-message prepaid).
// =============================================================================

const { useState: useStateMP, useMemo: useMemoMP } = React;

// -----------------------------------------------------------------------------
// Data — single source of truth
// -----------------------------------------------------------------------------

const MP_PLANS = [
  {
    id: 'free',
    name: 'مجانية',
    nameEn: 'Free',
    tagline: 'تجربة المنصّة وأندية صغيرة',
    priceMonthly: 0,
    priceYearly: 0,
    cta: 'ابدأ مجّاناً',
    highlight: false,
    hue: 250,
    headline: { value: '0', unit: 'ر.س', period: 'دائماً' },
    keyLimits: [
      { label: 'الأعضاء النشطون', value: '50' },
      { label: 'المجتمعات المملوكة', value: '1' },
      { label: 'التخزين', value: '1 جيجابايت' },
      { label: 'الفعاليات / شهر', value: '2' },
      { label: 'واتساب (تجريبي)', value: '50 رسالة' },
    ],
  },
  {
    id: 'pro',
    name: 'احترافية',
    nameEn: 'Pro',
    tagline: 'المجتمعات النشطة والمنظّمات المتوسطة',
    priceMonthly: 199,
    priceYearly: 1910,
    cta: 'اشترك الآن',
    highlight: true,
    badge: 'الأكثر شيوعاً',
    hue: 250,
    headline: { value: '199', unit: 'ر.س', period: '/ شهر' },
    keyLimits: [
      { label: 'الأعضاء النشطون', value: '1,000' },
      { label: 'المجتمعات المملوكة', value: '3' },
      { label: 'التخزين', value: '25 جيجابايت' },
      { label: 'الفعاليات / شهر', value: '20' },
      { label: 'واتساب مشمول', value: '1,000 / شهر' },
    ],
  },
  {
    id: 'business',
    name: 'أعمال',
    nameEn: 'Business',
    tagline: 'الجمعيّات الكبيرة والهيئات المهنيّة',
    priceMonthly: 799,
    priceYearly: 7670,
    cta: 'اشترك الآن',
    highlight: false,
    hue: 30,
    headline: { value: '799', unit: 'ر.س', period: '/ شهر' },
    keyLimits: [
      { label: 'الأعضاء النشطون', value: '10,000' },
      { label: 'المجتمعات المملوكة', value: '10' },
      { label: 'التخزين', value: '250 جيجابايت' },
      { label: 'الفعاليات / شهر', value: 'غير محدودة' },
      { label: 'واتساب مشمول', value: '10,000 / شهر' },
    ],
  },
  {
    id: 'enterprise',
    name: 'مؤسّسية',
    nameEn: 'Enterprise',
    tagline: 'الجهات الحكومية والوزارات والهيئات الوطنية',
    priceMonthly: null,
    priceYearly: 25000,
    cta: 'تواصل معنا',
    highlight: false,
    hue: 145,
    headline: { value: 'مخصّص', unit: '', period: 'سنوي · من 25,000 ر.س' },
    keyLimits: [
      { label: 'الأعضاء النشطون', value: '+10,000' },
      { label: 'المجتمعات', value: 'غير محدودة' },
      { label: 'التخزين', value: 'مخصّص' },
      { label: 'SLA + SSO', value: '✓ مشمول' },
      { label: 'علامة تجارية كاملة', value: '✓' },
    ],
  },
];

// Comparison matrix — feature x plan
const MP_COMPARE_GROUPS = [
  {
    title: 'السعة',
    rows: [
      { f: 'المجتمعات المملوكة',         v: ['1', '3', '10', 'غير محدودة'] },
      { f: 'الأعضاء النشطون',           v: ['50', '1,000', '10,000', 'مخصّص'] },
      { f: 'مساحات لكل مجتمع',          v: ['3', 'غير محدودة', 'غير محدودة', 'غير محدودة'] },
      { f: 'مقاعد المسؤولين / المشرفين', v: ['2', '10', '50', 'غير محدودة'] },
      { f: 'التخزين',                   v: ['1 جيجابايت', '25 جيجابايت', '250 جيجابايت', 'مخصّص'] },
      { f: 'فعاليّات / شهر',             v: ['2', '20', 'غير محدودة', 'غير محدودة'] },
      { f: 'رسائل واتساب مشمولة / شهر', v: ['50 (تجريبي)', '1,000', '10,000', 'مخصّص'] },
      { f: 'إرسال البريد الإلكتروني / شهر', v: ['200', '10 آلاف', '100 ألف', 'مخصّص'] },
    ],
  },
  {
    title: 'المجتمع والمحتوى',
    rows: [
      { f: 'مجتمعات بمساحات متعدّدة',    v: ['✓', '✓', '✓', '✓'] },
      { f: 'شعار وصورة غلاف مخصّصة',     v: ['✓', '✓', '✓', '✓'] },
      { f: 'ألوان مخصّصة للسمة',         v: ['—', '✓', '✓', '✓'] },
      { f: 'نطاق مخصّص',                v: ['—', '—', '✓', '✓'] },
      { f: 'علامة تجارية كاملة',         v: ['—', '—', '—', '✓'] },
      { f: 'مستويات عضويّة (مجانية/مدفوعة)', v: ['—', '✓', '✓', '✓'] },
      { f: 'مصفوفة صلاحيات مخصّصة',      v: ['—', '✓', '✓', '✓'] },
    ],
  },
  {
    title: 'الفعاليّات',
    rows: [
      { f: 'فعاليّات أساسية',                  v: ['✓', '✓', '✓', '✓'] },
      { f: 'فعاليّات متعدّدة الأيام + جدول',    v: ['—', '✓', '✓', '✓'] },
      { f: 'تسجيل الحضور برمز QR',             v: ['—', '✓', '✓', '✓'] },
      { f: 'تذكيرات تلقائيّة + واتساب',         v: ['—', '✓', '✓', '✓'] },
      { f: 'الشهادات',                        v: ['—', '—', '✓', '✓'] },
      { f: 'قوالب بريد مخصّصة لكل فعاليّة',     v: ['—', '✓', '✓', '✓'] },
    ],
  },
  {
    title: 'التواصل',
    rows: [
      { f: 'إشعارات البريد الإلكتروني', v: ['أساسية', 'كاملة', 'كاملة + نطاق مخصّص', 'كاملة'] },
      { f: 'إرسال واتساب',              v: ['تجريبي', '✓', '✓', '✓'] },
      { f: 'استقبال واتساب (الردود)',   v: ['—', '✓', '✓', '✓'] },
      { f: 'مكتبة قوالب واتساب',        v: ['—', '5', '50', 'غير محدودة'] },
      { f: 'استهداف بشرائح',            v: ['—', '✓', '✓', '✓'] },
    ],
  },
  {
    title: 'التفاعل والربح',
    rows: [
      { f: 'منشئ النماذج',         v: ['1 نشط', '20 نشطاً', 'غير محدودة', 'غير محدودة'] },
      { f: 'الاستبيانات',          v: ['1 نشط', '20 نشطاً', 'غير محدودة', 'غير محدودة'] },
      { f: 'الكوبونات',            v: ['—', '✓', '✓', '✓'] },
      { f: 'العضويّات المدفوعة',    v: ['—', '—', '✓', '✓'] },
      { f: 'الفعاليّات المدفوعة',   v: ['—', '—', '✓', '✓'] },
    ],
  },
  {
    title: 'الدعم والتشغيل',
    rows: [
      { f: 'الدعم',                  v: ['منتدى المجتمع', 'بريد · 48 ساعة', 'بريد 24 ساعة + دردشة', 'مدير حساب مخصّص'] },
      { f: 'اتفاقية مستوى الخدمة (SLA)', v: ['—', '—', '—', 'جاهزية 99.9٪'] },
      { f: 'الدخول الموحّد (SSO)',      v: ['—', '—', '—', '✓'] },
      { f: 'الاحتفاظ بسجلّ التدقيق',    v: ['—', '30 يوماً', 'سنة', 'غير محدود'] },
      { f: 'تصدير البيانات',           v: ['—', 'CSV', 'CSV + JSON', 'تصدير كامل + قاعدة بيانات'] },
    ],
  },
];

// WhatsApp wallet pricing
const MP_WA_CATEGORIES = [
  { kind: 'تسويقي',          price: 0.30,  use: 'الإعلانات الترويجية والبثّ', desc: 'حملات تسويقيّة، عروض، إعلانات' },
  { kind: 'خدمي / تحفيزي',   price: 0.12,  use: 'OTP، المعاملات، التذكيرات',  desc: 'إشعارات الفعاليّات والتأكيدات' },
  { kind: 'مصادقة',          price: 0.15,  use: 'رموز التحقق وتسجيل الدخول',   desc: 'OTP، التحقّق بخطوتين' },
  { kind: 'خدمة عملاء',     price: 0.05,  use: 'ردّ خلال 24 ساعة من العميل',   desc: 'محادثات تفاعليّة' },
];

const MP_WA_TOPUPS = [
  { amount: 50,    credit: 50,    bonus: 0,      pct: '0%' },
  { amount: 200,   credit: 220,   bonus: 20,     pct: '+9%' },
  { amount: 1000,  credit: 1150,  bonus: 150,    pct: '+13%' },
  { amount: 5000,  credit: 6000,  bonus: 1000,   pct: '+17%' },
  { amount: 20000, credit: 25000, bonus: 5000,   pct: '+20%', tag: 'مؤسّسية' },
];

// Add-ons (recurring monthly)
const MP_ADDONS = [
  {
    title: 'تجاوز الأعضاء',
    desc: 'سقف ليّن — بدون حظر صارم. عند ٨٠٪ من السقف يظهر اقتراح الترقية تلقائيّاً.',
    rows: [
      { plan: 'احترافية', price: '+50 ر.س / 100 عضو إضافي / شهر' },
      { plan: 'أعمال',    price: '+30 ر.س / 100 عضو إضافي / شهر' },
      { plan: 'مجانية',   price: 'لا تجاوز — تنتظر طلبات الانضمام عند سقف 50' },
    ],
  },
  {
    title: 'باقات التخزين',
    desc: 'لزيادة مساحة الملفات والمرفقات.',
    rows: [
      { plan: '+10 جيجابايت',  price: '30 ر.س / شهر' },
      { plan: '+50 جيجابايت',  price: '100 ر.س / شهر' },
      { plan: '+250 جيجابايت', price: '350 ر.س / شهر' },
    ],
  },
  {
    title: 'مقاعد المسؤولين',
    desc: 'مقاعد إضافيّة للمشرفين والمسؤولين.',
    rows: [
      { plan: '+5 مقاعد',  price: '50 ر.س / شهر' },
      { plan: '+20 مقعداً', price: '150 ر.س / شهر' },
    ],
  },
];

// FAQ
const MP_FAQ = [
  {
    q: 'ما الفرق بين الباقة الاحترافيّة وباقة الأعمال؟',
    a: 'الاحترافيّة (199 ر.س/شهر) تناسب المجتمعات النشطة والمنظّمات المتوسطة بحد 1,000 عضو ومساحة 25 جيجابايت. باقة الأعمال (799 ر.س/شهر) للجمعيّات الكبيرة بـ 10,000 عضو، فعاليّات غير محدودة، نطاق مخصّص، وعضويّات مدفوعة.',
  },
  {
    q: 'كيف يعمل رصيد واتساب؟',
    a: 'تعمل المنصّة بنموذج هجين: اشتراكك يشمل حصّة شهريّة من رسائل واتساب (1,000 في الاحترافيّة و10,000 في الأعمال). إذا تجاوزتها أو احتجت أنماط رسائل أخرى، تُخصم تلقائيّاً من رصيد محفظتك. الشحن يبدأ من 50 ر.س مع مكافآت تصل إلى 20٪ على الباقات الكبيرة. صلاحيّة الرصيد 12 شهراً من تاريخ الشراء.',
  },
  {
    q: 'هل يمكن تغيير الخطة في أي وقت؟',
    a: 'نعم. يمكنك الترقية فوراً عبر لوحة التحكم — والفرق يُحتسب على الفور. التخفيض يسري في بداية دورة الفوترة التالية. الاشتراك السنوي يمنحك خصم 20٪ (ما يعادل ~2.4 شهر مجّاناً).',
  },
  {
    q: 'ماذا يحدث عند تجاوز عدد الأعضاء؟',
    a: 'لن نوقف خدمتك. لدينا "سقف ليّن": ستدفع 50 ر.س لكل 100 عضو إضافي في الاحترافيّة (30 ر.س في الأعمال). عند تجاوز إجمالي التجاوز سعر الباقة الأعلى، سيظهر تلقائياً اقتراح بالترقية.',
  },
  {
    q: 'ما طرق الدفع المقبولة؟',
    a: 'جميع الباقات: مدى، فيزا، ماستركارد، STC Pay، Apple Pay، التحويل البنكي (فاتورة). للباقة المؤسّسية فقط: أوامر الشراء (PO) بصافي 30 يوماً. الفواتير متوافقة مع هيئة الزكاة والضريبة (ZATCA) مع حقل الرقم الضريبي.',
  },
  {
    q: 'هل هناك ضمان استرداد؟',
    a: 'نعم. الاشتراك السنوي قابل للاسترداد الكامل خلال أوّل 7 أيام (ضمان استرداد المال). الاشتراك الشهري لا يقبل الاسترداد، لكن الخدمة تستمرّ حتى نهاية الفترة المدفوعة. رصيد محفظة واتساب غير قابل للاسترداد، لكن الإرسال الفاشل من Meta يُعاد تلقائيّاً إلى محفظتك.',
  },
  {
    q: 'هل تشمل الأسعار ضريبة القيمة المضافة؟',
    a: 'لا. جميع الأسعار المعروضة لا تشمل ضريبة القيمة المضافة 15٪. تُحتسب الضريبة عند الفوترة، وتُصدَر فواتير ضريبيّة متوافقة مع هيئة الزكاة والضريبة (ZATCA).',
  },
  {
    q: 'هل تتوفّر خصومات للجهات غير الربحيّة والمساجد والجامعات؟',
    a: 'نعم. الجمعيّات غير الربحيّة الموثّقة تحصل على خصم 30٪ على الباقتين الاحترافيّة والأعمال. برنامج المسجد المرعى: باقة احترافيّة مجّانيّة + 200 ر.س رصيد واتساب. الأندية الطلابيّة: احترافيّة مجّانيّة بسقف 500 عضو مع التحقّق ببريد الجامعة.',
  },
];

// -----------------------------------------------------------------------------
// Main view
// -----------------------------------------------------------------------------

function MhwarPricingTab() {
  const [billing, setBilling] = useStateMP('yearly'); // 'monthly' | 'yearly'
  const [showCompare, setShowCompare] = useStateMP(false);
  const [openFaq, setOpenFaq] = useStateMP(0);

  const handleDownloadPDF = () => exportPricingPDF(billing);

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 32px 80px', direction: 'rtl' }}>

      {/* ===== Hero ===== */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="mono" style={{ fontSize: 10.5, letterSpacing: 2, color: 'var(--accent)', fontWeight: 600 }}>
            MHWAR · PRICING v1
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>·</span>
          <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>الأسعار بالريال السعودي · غير شاملة ضريبة القيمة المضافة 15٪</span>
        </div>
        <h1 style={{
          margin: 0, fontSize: 38, fontWeight: 600, letterSpacing: -1.2,
          maxWidth: 720, lineHeight: 1.2,
        }}>
          خطط تنمو مع مجتمعك
        </h1>
        <p style={{
          margin: '12px 0 22px', fontSize: 14.5, color: 'var(--muted)',
          maxWidth: 680, lineHeight: 1.8,
        }}>
          اختر الباقة المناسبة لحجم مجتمعك، وادفع رسائل واتساب حسب استخدامك الفعلي. بدون التزامات طويلة، مع ضمان استرداد سبعة أيّام على الباقات السنويّة.
        </p>

        {/* Billing toggle */}
        <div style={{
          display: 'inline-flex', padding: 4, background: 'var(--warm)',
          borderRadius: 999, border: '1px solid var(--line)',
        }}>
          <BillingPill active={billing === 'monthly'} onClick={() => setBilling('monthly')}>
            شهري
          </BillingPill>
          <BillingPill active={billing === 'yearly'} onClick={() => setBilling('yearly')}>
            سنوي
            <span style={{
              marginInlineStart: 6, fontSize: 9.5, padding: '2px 7px',
              background: 'oklch(0.92 0.08 145)', color: 'oklch(0.35 0.15 145)',
              borderRadius: 999, fontWeight: 600, letterSpacing: 0.5,
            }}>وفّر 20٪</span>
          </BillingPill>
        </div>
        </div>

        {/* Download PDF button */}
        <button onClick={handleDownloadPDF} style={{
          padding: '11px 18px', borderRadius: 11,
          background: 'var(--ink)', color: '#fff',
          border: 'none', fontSize: 12.5, fontWeight: 500,
          fontFamily: 'inherit', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginTop: 6,
        }}>
          <span style={{ fontSize: 14 }}>⬇</span>
          <span>تنزيل التسعير PDF</span>
        </button>
      </div>

      {/* ===== Plan cards ===== */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
        marginBottom: 26,
      }}>
        {MP_PLANS.map(p => (
          <PlanCard key={p.id} plan={p} billing={billing} />
        ))}
      </div>

      {/* ===== Compare features button ===== */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: showCompare ? 18 : 40 }}>
        <button onClick={() => setShowCompare(s => !s)} style={{
          padding: '11px 22px', borderRadius: 999,
          background: '#fff', border: '1px solid var(--line-2)',
          fontSize: 13, fontWeight: 500, color: 'var(--ink)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span>{showCompare ? 'إخفاء' : 'عرض'} مقارنة المميزات الكاملة</span>
          <span style={{
            display: 'inline-block', transition: 'transform 0.25s',
            transform: showCompare ? 'rotate(180deg)' : 'none',
          }}>▾</span>
        </button>
      </div>

      {/* ===== Comparison matrix ===== */}
      {showCompare && <CompareMatrix />}

      {/* ===== WhatsApp Wallet ===== */}
      <SectionTitle
        eyebrow="WhatsApp Wallet"
        title="محفظة واتساب"
        sub="ادفع مقابل الرسائل التي ترسلها فعلاً — حصّتك الشهريّة المشمولة تُستهلك أوّلاً، ثم رصيد محفظتك."
      />
      <WhatsAppPricing />

      {/* ===== Add-ons ===== */}
      <SectionTitle
        eyebrow="Add-ons"
        title="الإضافات الشهريّة"
        sub="رسوم إضافيّة شفّافة عند تجاوز حدود باقتك — قابلة للإلغاء في نهاية الشهر."
      />
      <AddOnsGrid />

      {/* ===== Special programs ===== */}
      <SectionTitle
        eyebrow="Special Programs"
        title="برامج خاصّة"
        sub="خصومات وامتيازات لجهات معيّنة — تواصل معنا للتفعيل."
      />
      <SpecialPrograms />

      {/* ===== Trust strip ===== */}
      <TrustStrip />

      {/* ===== FAQ ===== */}
      <SectionTitle
        eyebrow="FAQ"
        title="الأسئلة الشائعة"
        sub="إجابات للأسئلة الأكثر تكراراً حول التسعير والفوترة."
      />
      <div style={{
        background: '#fff', border: '1px solid var(--line)',
        borderRadius: 16, overflow: 'hidden', marginBottom: 40,
      }}>
        {MP_FAQ.map((item, i) => (
          <FaqItem
            key={i}
            item={item}
            open={openFaq === i}
            onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            last={i === MP_FAQ.length - 1}
          />
        ))}
      </div>

      {/* ===== Final CTA ===== */}
      <div style={{
        background: 'linear-gradient(135deg, oklch(0.96 0.04 250), oklch(0.97 0.03 270))',
        border: '1px solid var(--line)',
        borderRadius: 18, padding: '40px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 360px' }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>
            ابدأ الآن
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.5, marginBottom: 8 }}>
            ابدأ في 5 دقائق — بدون بطاقة ائتمان
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
            الباقة المجانيّة دائمة وكاملة. ترقَّ حين تحتاج. ضمان استرداد المال 7 أيام على السنوي.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            padding: '13px 24px', borderRadius: 12,
            background: 'var(--ink)', color: '#fff',
            fontSize: 13.5, fontWeight: 500,
          }}>أنشئ حسابك مجّاناً ←</button>
          <button style={{
            padding: '13px 24px', borderRadius: 12,
            background: '#fff', color: 'var(--ink)',
            border: '1px solid var(--line-2)',
            fontSize: 13.5, fontWeight: 500,
          }}>تحدّث مع المبيعات</button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function BillingPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 18px', borderRadius: 999,
      background: active ? '#fff' : 'transparent',
      color: active ? 'var(--ink)' : 'var(--muted)',
      fontSize: 12.5, fontWeight: active ? 600 : 500,
      boxShadow: active ? '0 2px 6px -2px rgba(0,0,0,0.12)' : 'none',
      display: 'inline-flex', alignItems: 'center',
    }}>{children}</button>
  );
}

function PlanCard({ plan, billing }) {
  const isYearly = billing === 'yearly' && plan.priceYearly !== null && plan.priceMonthly !== null && plan.priceMonthly > 0;
  const display = (() => {
    if (plan.id === 'free') return { value: '0', unit: 'ر.س', period: 'دائماً' };
    if (plan.id === 'enterprise') return { value: 'مخصّص', unit: '', period: 'سنوي · من 25,000 ر.س' };
    if (isYearly) {
      return { value: plan.priceYearly.toLocaleString('en-US'), unit: 'ر.س', period: '/ سنة' };
    }
    return { value: plan.priceMonthly.toLocaleString('en-US'), unit: 'ر.س', period: '/ شهر' };
  })();

  return (
    <div style={{
      background: '#fff',
      border: plan.highlight ? `2px solid var(--accent)` : '1px solid var(--line)',
      borderRadius: 16, padding: '24px 20px 20px',
      position: 'relative',
      boxShadow: plan.highlight ? '0 18px 36px -20px oklch(0.45 0.18 270 / 0.4)' : 'none',
      display: 'flex', flexDirection: 'column',
    }}>
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -12, insetInlineStart: 20,
          background: 'var(--accent)', color: '#fff',
          fontSize: 10, fontWeight: 600, padding: '4px 11px', borderRadius: 999,
          letterSpacing: 1.5,
        }}>{plan.badge}</div>
      )}

      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginBottom: 4,
        }}>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>{plan.name}</span>
          <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: 1.5 }}>
            {plan.nameEn.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>{plan.tagline}</div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: display.value === 'مخصّص' ? 24 : 32,
            fontWeight: 600, letterSpacing: -1,
            color: 'var(--ink)',
          }}>{display.value}</span>
          {display.unit && (
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>{display.unit}</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
          {display.period}
          {isYearly && plan.priceMonthly && (
            <span style={{ marginInlineStart: 6, color: 'oklch(0.45 0.15 145)' }}>
              · ~{Math.round(plan.priceYearly / 12)} ر.س/شهر
            </span>
          )}
        </div>
      </div>

      {/* Key limits */}
      <ul style={{
        margin: 0, padding: 0, listStyle: 'none',
        display: 'flex', flexDirection: 'column', gap: 8,
        marginBottom: 18, flex: 1,
      }}>
        {plan.keyLimits.map((kl, i) => (
          <li key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            fontSize: 11.5, gap: 6,
          }}>
            <span style={{ color: 'var(--muted)' }}>{kl.label}</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)', textAlign: 'end' }}>{kl.value}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button style={{
        padding: '11px 14px', borderRadius: 11,
        background: plan.highlight ? 'var(--ink)' : '#fff',
        color: plan.highlight ? '#fff' : 'var(--ink)',
        border: plan.highlight ? 'none' : '1px solid var(--line-2)',
        fontSize: 12.5, fontWeight: 600,
        width: '100%',
      }}>{plan.cta}</button>
    </div>
  );
}

function CompareMatrix() {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--line)',
      borderRadius: 16, overflow: 'hidden', marginBottom: 40,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--warm)' }}>
            <th style={cmpThFirst}>المميّزة</th>
            {MP_PLANS.map(p => (
              <th key={p.id} style={{
                ...cmpTh,
                color: p.highlight ? 'var(--accent)' : 'var(--ink)',
              }}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MP_COMPARE_GROUPS.map((g, gi) => (
            <React.Fragment key={gi}>
              <tr>
                <td colSpan={5} style={{
                  padding: '14px 18px 8px',
                  fontSize: 10.5, fontWeight: 600, letterSpacing: 2,
                  textTransform: 'uppercase', color: 'var(--accent)',
                  background: 'oklch(0.985 0.01 270)',
                  borderTop: gi === 0 ? 'none' : '1px solid var(--line)',
                }}>{g.title}</td>
              </tr>
              {g.rows.map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={cmpTdFirst}>{row.f}</td>
                  {row.v.map((val, vi) => (
                    <td key={vi} style={{
                      ...cmpTd,
                      background: MP_PLANS[vi].highlight ? 'oklch(0.985 0.01 270)' : 'transparent',
                    }}>
                      <CmpValue v={val} />
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CmpValue({ v }) {
  if (v === '✓') return <span style={{ color: 'oklch(0.55 0.15 145)', fontSize: 14, fontWeight: 700 }}>✓</span>;
  if (v === '—') return <span style={{ color: '#c8c7c0', fontSize: 13 }}>—</span>;
  return <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{v}</span>;
}

function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 18, marginTop: 18 }}>
      <div className="mono" style={{
        fontSize: 10.5, letterSpacing: 2, color: 'var(--accent)',
        fontWeight: 600, textTransform: 'uppercase', marginBottom: 6,
      }}>{eyebrow}</div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.5 }}>{title}</h2>
      {sub && (
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted)', maxWidth: 720, lineHeight: 1.7 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function WhatsAppPricing() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginBottom: 40 }}>
      {/* Per-message rates */}
      <div style={{
        background: '#fff', border: '1px solid var(--line)',
        borderRadius: 16, padding: 20,
      }}>
        <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>سعر الرسالة حسب الفئة</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>تُخصم من المحفظة عند الإرسال</div>
          </div>
          <span style={{
            fontSize: 9.5, padding: '3px 8px', borderRadius: 999,
            background: 'oklch(0.96 0.04 145)', color: 'oklch(0.35 0.15 145)',
            fontWeight: 600, letterSpacing: 1,
          }}>SAR / msg</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MP_WA_CATEGORIES.map((c, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 11,
              background: 'oklch(0.985 0.005 145)',
              border: '1px solid var(--line)',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 10, alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{c.kind}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.use}</div>
              </div>
              <div style={{
                fontSize: 18, fontWeight: 600,
                color: 'oklch(0.4 0.15 145)',
                fontFamily: 'IBM Plex Mono, monospace',
                whiteSpace: 'nowrap',
              }}>
                {c.price.toFixed(2)} <span style={{ fontSize: 11, color: 'var(--muted)' }}>ر.س</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 14, padding: '10px 12px',
          background: 'var(--warm)', borderRadius: 9,
          fontSize: 11, color: 'var(--muted)', lineHeight: 1.6,
        }}>
          الأسعار للمملكة العربيّة السعوديّة من Meta + Kapso · قابلة للتغيير عند تغيّر أسعار المصدر
        </div>
      </div>

      {/* Top-up packages */}
      <div style={{
        background: '#fff', border: '1px solid var(--line)',
        borderRadius: 16, padding: 20,
      }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>باقات الشحن</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>كلّما زاد الشحن زادت المكافأة · صلاحيّة 12 شهراً</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MP_WA_TOPUPS.map((t, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              border: '1px solid var(--line)', borderRadius: 10,
              display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 10,
              alignItems: 'center',
              background: t.tag ? 'oklch(0.97 0.03 145)' : '#fff',
            }}>
              <div className="mono" style={{ fontSize: 13, fontWeight: 600, minWidth: 64 }}>
                {t.amount.toLocaleString('en-US')}
                <span style={{ fontSize: 9, color: 'var(--muted)', marginInlineStart: 3 }}>ر.س</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>
                {t.bonus > 0 ? (
                  <span>تحصل على <strong style={{ color: 'oklch(0.4 0.15 145)' }}>{t.credit.toLocaleString('en-US')}</strong> رصيد</span>
                ) : (
                  <span>{t.credit.toLocaleString('en-US')} ر.س رصيد</span>
                )}
                {t.tag && <span style={{
                  marginInlineStart: 6, fontSize: 9, padding: '1px 6px',
                  background: 'oklch(0.4 0.15 145)', color: '#fff',
                  borderRadius: 999, letterSpacing: 0.5, fontWeight: 600,
                }}>{t.tag}</span>}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: t.bonus > 0 ? 'oklch(0.4 0.15 145)' : 'var(--muted)',
                fontFamily: 'IBM Plex Mono, monospace',
              }}>{t.pct}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddOnsGrid() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12, marginBottom: 40,
    }}>
      {MP_ADDONS.map((a, i) => (
        <div key={i} style={{
          background: '#fff', border: '1px solid var(--line)',
          borderRadius: 14, padding: 18,
        }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
            {a.desc}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {a.rows.map((r, j) => (
              <div key={j} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '8px 0',
                borderTop: j === 0 ? 'none' : '1px dashed var(--line)',
                gap: 8,
              }}>
                <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>{r.plan}</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink)', textAlign: 'end' }}>{r.price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SpecialPrograms() {
  const programs = [
    { icon: '◈', title: 'الجمعيّات غير الربحيّة',  desc: 'خصم 30٪ على الاحترافيّة وأعمال', detail: 'يتطلّب توثيقاً' },
    { icon: '◉', title: 'برنامج المسجد المرعى',     desc: 'احترافيّة مجّانيّة', detail: '+ 200 ر.س رصيد واتساب' },
    { icon: '▣', title: 'الأندية الطلابيّة',        desc: 'احترافيّة مجّانيّة', detail: 'سقف 500 عضو · بريد الجامعة' },
    { icon: '▲', title: 'الجهات الحكوميّة',         desc: 'باقة مؤسّسية مخصّصة', detail: 'مع PO وعقود مخصّصة' },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10, marginBottom: 40,
    }}>
      {programs.map((p, i) => (
        <div key={i} style={{
          background: '#fff', border: '1px solid var(--line)',
          borderRadius: 14, padding: 16,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'var(--accent-soft)', color: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, marginBottom: 4,
          }}>{p.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{p.title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>{p.desc}</div>
          <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 'auto' }}>{p.detail}</div>
        </div>
      ))}
    </div>
  );
}

function TrustStrip() {
  const items = [
    { ic: '◇', label: 'فواتير ضريبيّة متوافقة مع ZATCA' },
    { ic: '◇', label: 'إلغاء في أي وقت — بدون عوائق' },
    { ic: '◇', label: 'ضمان استرداد 7 أيام (سنوي)' },
    { ic: '◇', label: 'إيقاف الترقية تلقائيّاً عند سقف الباقة' },
  ];
  return (
    <div style={{
      background: 'var(--warm)', border: '1px solid var(--line)',
      borderRadius: 14, padding: '16px 20px',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
      marginBottom: 40,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8,
            background: '#fff', color: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, flexShrink: 0,
          }}>{it.ic}</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function FaqItem({ item, open, onToggle, last }) {
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: '18px 22px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 14, textAlign: 'start',
      }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{item.q}</span>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          background: open ? 'var(--accent)' : 'var(--warm)',
          color: open ? '#fff' : 'var(--muted)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 600, flexShrink: 0,
          transition: 'all 0.2s',
        }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{
          padding: '0 22px 20px', fontSize: 12.5,
          color: 'var(--ink-2)', lineHeight: 1.85, maxWidth: 820,
        }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const cmpTh = {
  padding: '14px 12px', fontSize: 12, fontWeight: 600,
  textAlign: 'center', color: 'var(--ink)', whiteSpace: 'nowrap',
  borderInlineStart: '1px solid var(--line)',
};
const cmpThFirst = {
  ...cmpTh, textAlign: 'start', minWidth: 220, paddingInlineStart: 22,
  borderInlineStart: 'none',
};
const cmpTd = {
  padding: '11px 12px', fontSize: 12, textAlign: 'center',
  color: 'var(--ink-2)', borderInlineStart: '1px solid var(--line)',
};
const cmpTdFirst = {
  ...cmpTd, textAlign: 'start', paddingInlineStart: 22, color: 'var(--ink)',
  borderInlineStart: 'none',
};

// -----------------------------------------------------------------------------
// PDF Export — opens print-ready window
// -----------------------------------------------------------------------------

function exportPricingPDF(billing) {
  const w = window.open('', '_blank', 'width=1000,height=1200');
  if (!w) { alert('يُرجى السماح بالنوافذ المنبثقة لتنزيل PDF'); return; }

  const isYearly = billing === 'yearly';
  const priceFor = (p) => {
    if (p.id === 'free') return { v: '0', u: 'ر.س', per: 'دائماً' };
    if (p.id === 'enterprise') return { v: 'مخصّص', u: '', per: 'سنوي · من 25,000 ر.س' };
    if (isYearly) return { v: p.priceYearly.toLocaleString('en-US'), u: 'ر.س', per: '/ سنة' };
    return { v: p.priceMonthly.toLocaleString('en-US'), u: 'ر.س', per: '/ شهر' };
  };

  const plansHtml = MP_PLANS.map(p => {
    const pr = priceFor(p);
    return `
      <div class="plan ${p.highlight ? 'hl' : ''}">
        ${p.badge ? `<div class="plan-badge">${p.badge}</div>` : ''}
        <div class="plan-name">${p.name} <span class="plan-en">${p.nameEn.toUpperCase()}</span></div>
        <div class="plan-tag">${p.tagline}</div>
        <div class="plan-price">
          <span class="big">${pr.v}</span>
          ${pr.u ? `<span class="unit">${pr.u}</span>` : ''}
        </div>
        <div class="plan-period">${pr.per}</div>
        <ul class="plan-limits">
          ${p.keyLimits.map(l => `<li><span class="l">${l.label}</span><span class="v">${l.value}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }).join('');

  const compareHtml = MP_COMPARE_GROUPS.map(g => `
    <tr class="grp"><td colspan="5">${g.title}</td></tr>
    ${g.rows.map(r => `
      <tr>
        <td class="f">${r.f}</td>
        ${r.v.map((val, i) => `<td class="v ${MP_PLANS[i].highlight ? 'hl' : ''}">${val === '✓' ? '<b style="color:#1d8a4e">✓</b>' : val === '—' ? '<span style="color:#c8c7c0">—</span>' : val}</td>`).join('')}
      </tr>
    `).join('')}
  `).join('');

  const waCatHtml = MP_WA_CATEGORIES.map(c => `
    <tr>
      <td><b>${c.kind}</b><div class="sub">${c.use}</div></td>
      <td class="num">${c.price.toFixed(2)} <span class="unit-sm">ر.س</span></td>
    </tr>
  `).join('');

  const waTopupHtml = MP_WA_TOPUPS.map(t => `
    <tr ${t.tag ? 'class="ent"' : ''}>
      <td class="num">${t.amount.toLocaleString('en-US')} ر.س</td>
      <td>${t.bonus > 0 ? `<b>${t.credit.toLocaleString('en-US')}</b> رصيد` : `${t.credit.toLocaleString('en-US')} ر.س`} ${t.tag ? `<span class="ent-tag">${t.tag}</span>` : ''}</td>
      <td class="pct">${t.pct}</td>
    </tr>
  `).join('');

  const addonsHtml = MP_ADDONS.map(a => `
    <div class="addon">
      <div class="addon-title">${a.title}</div>
      <div class="addon-desc">${a.desc}</div>
      <table class="addon-table">
        ${a.rows.map(r => `<tr><td>${r.plan}</td><td class="num">${r.price}</td></tr>`).join('')}
      </table>
    </div>
  `).join('');

  const faqHtml = MP_FAQ.map(f => `
    <div class="faq-item">
      <div class="q">${f.q}</div>
      <div class="a">${f.a}</div>
    </div>
  `).join('');

  const today = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  w.document.write(`<!doctype html>
<html dir="rtl" lang="ar"><head>
<meta charset="utf-8">
<title>محور — التسعير والباقات</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif;
    color: #14130f; margin: 0; padding: 0;
    background: #fff; line-height: 1.6;
    font-feature-settings: "ss01";
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page { max-width: 900px; margin: 0 auto; padding: 24px 18px; }
  .mono { font-family: 'IBM Plex Mono', monospace; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 2px solid #14130f; margin-bottom: 22px; }
  .brand { font-size: 18px; font-weight: 700; letter-spacing: -0.4px; }
  .brand small { font-size: 10px; color: #8a877f; font-weight: 400; margin-inline-start: 8px; letter-spacing: 2.5px; }
  .doc-tag { font-size: 10px; padding: 5px 12px; background: #3d3a8c; color: #fff; border-radius: 999px; letter-spacing: 1.5px; }

  /* Hero */
  h1 { font-size: 28px; margin: 0 0 6px; letter-spacing: -0.7px; }
  .lede { color: #6b6a64; font-size: 12.5px; margin: 0 0 14px; line-height: 1.7; max-width: 720px; }
  .vat-note { font-size: 10.5px; color: #8a877f; margin-bottom: 18px; }
  .billing-note { font-size: 11px; color: #3d3a8c; font-weight: 600; padding: 6px 12px; background: #ecebf7; border-radius: 999px; display: inline-block; margin-bottom: 22px; letter-spacing: 0.5px; }

  /* Section */
  h2 { font-size: 16px; font-weight: 600; letter-spacing: -0.3px; margin: 28px 0 6px; padding-top: 6px; }
  .eyebrow { font-size: 9.5px; letter-spacing: 2px; text-transform: uppercase; color: #3d3a8c; font-weight: 600; margin-top: 18px; }
  .sub { font-size: 11px; color: #8a877f; margin-bottom: 12px; line-height: 1.6; }

  /* Plan cards */
  .plans { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; page-break-inside: avoid; }
  .plan { padding: 14px 12px; border: 1px solid #eceae4; border-radius: 12px; position: relative; page-break-inside: avoid; background: #fff; }
  .plan.hl { border-color: #3d3a8c; border-width: 1.5px; background: linear-gradient(180deg, #fafaff, #fff); }
  .plan-badge { position: absolute; top: -9px; right: 14px; background: #3d3a8c; color: #fff; font-size: 8.5px; padding: 3px 8px; border-radius: 999px; letter-spacing: 1px; font-weight: 600; }
  .plan-name { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .plan-en { font-size: 8.5px; color: #8a877f; letter-spacing: 1.5px; font-family: 'IBM Plex Mono', monospace; margin-inline-start: 4px; font-weight: 400; }
  .plan-tag { font-size: 10px; color: #8a877f; line-height: 1.4; min-height: 28px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eceae4; }
  .plan-price { display: flex; align-items: baseline; gap: 4px; }
  .plan-price .big { font-size: 22px; font-weight: 600; letter-spacing: -0.6px; color: #14130f; }
  .plan-price .unit { font-size: 11px; color: #3a3832; font-weight: 500; }
  .plan-period { font-size: 9.5px; color: #8a877f; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eceae4; }
  .plan-limits { list-style: none; padding: 0; margin: 0; }
  .plan-limits li { display: flex; justify-content: space-between; align-items: baseline; gap: 4px; font-size: 9.5px; padding: 3px 0; }
  .plan-limits .l { color: #8a877f; }
  .plan-limits .v { color: #14130f; font-weight: 600; text-align: end; }

  /* Comparison table */
  table.compare { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 16px; page-break-inside: auto; }
  table.compare thead th { background: #f2efe8; padding: 8px 6px; text-align: center; font-weight: 600; font-size: 11px; border: 1px solid #eceae4; }
  table.compare thead th:first-child { text-align: start; padding-inline-start: 12px; }
  table.compare thead th.hl { color: #3d3a8c; }
  table.compare tr.grp td { padding: 8px 12px 4px; font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #3d3a8c; font-weight: 700; background: #fbfaff; border-top: 1px solid #eceae4; }
  table.compare td { padding: 6px 6px; border-bottom: 1px solid #f2efe8; }
  table.compare td.f { padding-inline-start: 12px; color: #14130f; }
  table.compare td.v { text-align: center; color: #3a3832; }
  table.compare td.v.hl { background: #fbfaff; }

  /* WhatsApp tables */
  .wa-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 10px; margin-bottom: 8px; page-break-inside: avoid; }
  .wa-card { border: 1px solid #eceae4; border-radius: 10px; padding: 12px; }
  .wa-card h3 { margin: 0 0 8px; font-size: 12px; font-weight: 600; }
  table.wa { width: 100%; border-collapse: collapse; font-size: 10.5px; }
  table.wa td { padding: 6px 4px; border-bottom: 1px solid #f5f4ef; vertical-align: middle; }
  table.wa tr:last-child td { border-bottom: none; }
  table.wa td.num { text-align: end; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: #1d8a4e; white-space: nowrap; }
  table.wa td.pct { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; color: #1d8a4e; text-align: end; }
  table.wa .sub { font-size: 9.5px; color: #8a877f; margin-top: 1px; }
  table.wa .unit-sm { font-size: 9px; color: #8a877f; font-weight: 400; }
  table.wa tr.ent { background: #f5fbf7; }
  .ent-tag { background: #1d8a4e; color: #fff; font-size: 8.5px; padding: 1px 6px; border-radius: 999px; margin-inline-start: 4px; font-weight: 600; }
  .wa-fine { font-size: 9.5px; color: #8a877f; padding: 8px 10px; background: #f2efe8; border-radius: 6px; margin-top: 10px; }

  /* Add-ons */
  .addons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; page-break-inside: avoid; }
  .addon { border: 1px solid #eceae4; border-radius: 10px; padding: 12px; }
  .addon-title { font-size: 12px; font-weight: 600; margin-bottom: 3px; }
  .addon-desc { font-size: 10px; color: #8a877f; line-height: 1.5; margin-bottom: 8px; min-height: 30px; }
  .addon-table { width: 100%; border-collapse: collapse; font-size: 10px; }
  .addon-table td { padding: 5px 0; border-bottom: 1px dashed #eceae4; }
  .addon-table td:last-child { text-align: end; font-weight: 600; }
  .addon-table tr:last-child td { border-bottom: none; }

  /* Trust */
  .trust { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 12px; background: #f2efe8; border-radius: 10px; margin: 16px 0; page-break-inside: avoid; }
  .trust-item { font-size: 10px; color: #3a3832; display: flex; align-items: center; gap: 6px; }
  .trust-item .ic { width: 22px; height: 22px; border-radius: 6px; background: #fff; color: #3d3a8c; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }

  /* Programs */
  .programs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 18px; page-break-inside: avoid; }
  .program { border: 1px solid #eceae4; border-radius: 10px; padding: 12px; }
  .program .ic { width: 26px; height: 26px; border-radius: 7px; background: #ecebf7; color: #3d3a8c; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 6px; }
  .program-title { font-size: 11.5px; font-weight: 600; margin-bottom: 2px; }
  .program-desc { font-size: 10px; color: #3a3832; }
  .program-detail { font-size: 9.5px; color: #8a877f; margin-top: 4px; }

  /* FAQ */
  .faq-item { padding: 10px 0; border-bottom: 1px solid #eceae4; page-break-inside: avoid; }
  .faq-item:last-child { border-bottom: none; }
  .faq-item .q { font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #14130f; }
  .faq-item .a { font-size: 10.5px; color: #3a3832; line-height: 1.7; }

  /* Footer */
  .footer { margin-top: 30px; padding-top: 14px; border-top: 1px solid #eceae4; display: flex; justify-content: space-between; font-size: 9.5px; color: #8a877f; }

  /* Print controls */
  .print-bar { position: sticky; top: 0; background: #14130f; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; z-index: 100; }
  .print-bar button { padding: 8px 16px; border-radius: 8px; background: #fff; color: #14130f; border: none; font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
  .print-bar .info { font-size: 11px; opacity: 0.85; }

  @media print {
    .print-bar { display: none; }
    body { padding: 0; }
    .page { padding: 0; max-width: none; }
    h2 { page-break-after: avoid; }
  }

  .page-break { page-break-before: always; }
</style>
</head>
<body>
  <div class="print-bar">
    <div class="info">معاينة قابلة للطباعة · اضغط "تنزيل PDF" أو Ctrl/Cmd + P</div>
    <button onclick="window.print()">⬇ تنزيل PDF</button>
  </div>
  <div class="page">
    <div class="header">
      <div class="brand">محور <small>MHWAR</small></div>
      <div class="doc-tag">دليل التسعير v1</div>
    </div>

    <h1>خطط تنمو مع مجتمعك</h1>
    <p class="lede">اختر الباقة المناسبة لحجم مجتمعك، وادفع رسائل واتساب حسب استخدامك الفعلي. بدون التزامات طويلة، مع ضمان استرداد سبعة أيّام على الباقات السنويّة.</p>
    <div class="vat-note">الأسعار بالريال السعودي (SAR) · غير شاملة ضريبة القيمة المضافة 15٪</div>
    <div class="billing-note">الفوترة المعروضة: ${isYearly ? 'سنوي · بخصم 20٪' : 'شهري'}</div>

    <div class="plans">${plansHtml}</div>

    <h2>مقارنة المميزات الكاملة</h2>
    <p class="sub">جميع الباقات والمميزات في جدول واحد للمقارنة السريعة.</p>
    <table class="compare">
      <thead>
        <tr>
          <th>المميّزة</th>
          ${MP_PLANS.map(p => `<th class="${p.highlight ? 'hl' : ''}">${p.name}</th>`).join('')}
        </tr>
      </thead>
      <tbody>${compareHtml}</tbody>
    </table>

    <div class="page-break"></div>

    <div class="eyebrow">WhatsApp Wallet</div>
    <h2>محفظة واتساب</h2>
    <p class="sub">ادفع مقابل الرسائل التي ترسلها فعلاً — حصّتك الشهريّة المشمولة تُستهلك أوّلاً، ثم رصيد محفظتك.</p>
    <div class="wa-grid">
      <div class="wa-card">
        <h3>سعر الرسالة حسب الفئة (ر.س / رسالة)</h3>
        <table class="wa">${waCatHtml}</table>
      </div>
      <div class="wa-card">
        <h3>باقات الشحن — صلاحيّة 12 شهراً</h3>
        <table class="wa">${waTopupHtml}</table>
      </div>
    </div>
    <div class="wa-fine">الأسعار للمملكة العربيّة السعوديّة من Meta + Kapso · قابلة للتغيير عند تغيّر أسعار المصدر · الإرسال الفاشل من Meta يُعاد تلقائيّاً للمحفظة</div>

    <div class="eyebrow">Add-ons</div>
    <h2>الإضافات الشهريّة</h2>
    <p class="sub">رسوم إضافيّة شفّافة عند تجاوز حدود باقتك — قابلة للإلغاء في نهاية الشهر.</p>
    <div class="addons">${addonsHtml}</div>

    <div class="eyebrow">Special Programs</div>
    <h2>برامج خاصّة</h2>
    <p class="sub">خصومات وامتيازات لجهات معيّنة — تواصل معنا للتفعيل.</p>
    <div class="programs">
      <div class="program"><div class="ic">◈</div><div class="program-title">الجمعيّات غير الربحيّة</div><div class="program-desc">خصم 30٪ على الاحترافيّة وأعمال</div><div class="program-detail">يتطلّب توثيقاً</div></div>
      <div class="program"><div class="ic">◉</div><div class="program-title">برنامج المسجد المرعى</div><div class="program-desc">احترافيّة مجّانيّة</div><div class="program-detail">+ 200 ر.س رصيد واتساب</div></div>
      <div class="program"><div class="ic">▣</div><div class="program-title">الأندية الطلابيّة</div><div class="program-desc">احترافيّة مجّانيّة</div><div class="program-detail">سقف 500 عضو · بريد الجامعة</div></div>
      <div class="program"><div class="ic">▲</div><div class="program-title">الجهات الحكوميّة</div><div class="program-desc">باقة مؤسّسية مخصّصة</div><div class="program-detail">مع PO وعقود مخصّصة</div></div>
    </div>

    <div class="trust">
      <div class="trust-item"><span class="ic">◇</span><span>فواتير ضريبيّة متوافقة مع ZATCA</span></div>
      <div class="trust-item"><span class="ic">◇</span><span>إلغاء في أي وقت — بدون عوائق</span></div>
      <div class="trust-item"><span class="ic">◇</span><span>ضمان استرداد 7 أيام (سنوي)</span></div>
      <div class="trust-item"><span class="ic">◇</span><span>تجميد لطيف — لا قطع مفاجئ</span></div>
    </div>

    <div class="page-break"></div>

    <div class="eyebrow">FAQ</div>
    <h2>الأسئلة الشائعة</h2>
    <p class="sub">إجابات للأسئلة الأكثر تكراراً حول التسعير والفوترة.</p>
    <div>${faqHtml}</div>

    <div class="footer">
      <span>محور — منصّة إدارة المجتمعات</span>
      <span>${today} · v1</span>
    </div>
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.focus(); }, 200); };
  </script>
</body></html>`);
  w.document.close();
}

// -----------------------------------------------------------------------------
Object.assign(window, { MhwarPricingTab });
