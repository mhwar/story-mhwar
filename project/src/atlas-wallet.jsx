// =============================================================================
// Mhwar Wallet & Cost Simulator — points-based wallet + campaign cost simulator
// Adapted from the est-pricing concept, restyled to Mhwar's theme.
// =============================================================================

const { useState: useStateW, useMemo: useMemoW, useRef: useRefW, useEffect: useEffectW } = React;

// ---- Pricing model (points) ----
// 1 نقطة = 0.10 ر.س (10 نقاط = 1 ر.س)
// سعر البيع بالنقاط لكل رسالة حسب نوعها (يطابق فئات Meta للسعودية + هامش تشغيل).
const W_COST = { marketing: 3.5, service: 1.5, auth: 1.5, authIntl: 2.5, email: 0.05, support: 0 };
const W_TYPE_LABEL = {
  marketing: 'واتساب تسويقي',
  service:   'واتساب خدمي / تذكير',
  auth:      'واتساب مصادقة (OTP)',
  authIntl:  'مصادقة دولية',
  email:     'بريد إلكتروني',
  support:   'رد خدمة عملاء',
};
const W_POINTS_PER_SAR = 10;

// ---- Cost guide (transparent costing behind each point) ----
// meta = تكلفتنا التقديرية (ر.س) · sell = سعر البيع (ر.س) · points = نقاط/رسالة
const W_WA_GUIDE = [
  { id: 'marketing', emoji: '📢', name: 'رسائل تسويقية', what: 'عروض · إعلانات · حملات ترويجية · بث', hue: 25, meta: 0.18, sell: 0.35, points: 3.5, free: false, note: 'الأغلى — تُحتسب دائماً عند الإرسال' },
  { id: 'service', emoji: '🔔', name: 'رسائل خدمية / تحديثات', what: 'تأكيد حضور · تذكير فعالية · تحديث حالة', hue: 220, meta: 0.05, sell: 0.15, points: 1.5, free: false, note: 'مجانيّة داخل نافذة المحادثة (24 ساعة)' },
  { id: 'auth', emoji: '🔐', name: 'رسائل المصادقة (OTP)', what: 'رموز التحقّق · تسجيل الدخول · التحقّق بخطوتين', hue: 145, meta: 0.05, sell: 0.15, points: 1.5, free: false, note: 'سعر منخفض يشجّع بدائل SMS' },
  { id: 'authIntl', emoji: '🌍', name: 'مصادقة دولية', what: 'رموز OTP لأرقام خارج السعودية', hue: 285, meta: 0.12, sell: 0.25, points: 2.5, free: false, note: 'أغلى من المصادقة المحليّة' },
  { id: 'support', emoji: '🎧', name: 'رد خدمة العملاء', what: 'ردّك على رسالة بدأها العميل خلال 24 ساعة', hue: 175, meta: 0, sell: 0, points: 0, free: true, note: 'مجانيّة تماماً — بلا حدود' },
];

// Email cost (Amazon SES) — تُحتسب لكل مستلم
const W_EMAIL_GUIDE = {
  metaPer1000: 0.40,   // ~$0.10 × 3.75 + نقل بيانات
  metaEach: 0.0004,
  sellEach: 0.005,     // 0.05 نقطة
  points: 0.05,
  includedNote: 'يشمل القوالب والتتبّع وإدارة الارتدادات',
};

const W_RECHARGE_PACKAGES = [
  { id: 'start', name: 'الانطلاق',  price: 50,   base: 500,   bonus: 0 },
  { id: 'grow',  name: 'النمو',     price: 200,  base: 2000,  bonus: 180 },
  { id: 'best',  name: 'الأمثل',    price: 500,  base: 5000,  bonus: 600, popular: true },
  { id: 'pro',   name: 'المحترفون', price: 1000, base: 10000, bonus: 1500 },
];

function wBonusRate(amount) {
  if (amount >= 1000) return 0.15;
  if (amount >= 500)  return 0.12;
  if (amount >= 200)  return 0.09;
  return 0;
}

const W_PLANS = [
  {
    id: 'pro', name: 'المجتمع', en: 'COMMUNITY',
    priceMonthly: 199, priceYearly: 1910,
    desc: 'لصنّاع المحتوى والمجتمعات الناشئة التي تبدأ رحلتها.',
    monthlyCredits: 500,
    bestFor: 'المجتمعات الصغيرة والنوادي وصنّاع المحتوى',
    accent: 'var(--accent)',
    rows: [
      { t: '3 مجتمعات · أعضاء بلا حدود', ok: true },
      { t: 'فعاليّات وتذاكر QR بلا حدود', ok: true },
      { t: 'بريد إلكتروني من نطاق محور', ok: true },
      { t: 'واتساب من رقم محور', ok: true },
      { t: 'ردود خدمة العملاء مجانيّة', ok: true, strong: true },
    ],
  },
  {
    id: 'growth', name: 'النمو', en: 'GROWTH',
    priceMonthly: 399, priceYearly: 3830,
    desc: 'للمنصّات النشطة ذات الهويّة المستقلّة والنموّ المتسارع.',
    monthlyCredits: 1200,
    bestFor: 'المنصّات النشطة والمنظّمات المتوسّطة',
    highlight: true, badge: 'الأكثر شيوعاً',
    accent: 'var(--accent)',
    rows: [
      { t: '10 مجتمعات · هويّة ونطاق مخصّص', ok: true },
      { t: 'إرسال من بريد جهتك (نطاقك الخاص)', ok: true, strong: true },
      { t: 'حملات مجدولة + رحلات آليّة', ok: true },
      { t: 'شهادات + عضويّات مدفوعة', ok: true },
      { t: 'تحليلات متقدّمة + تقارير', ok: true },
    ],
  },
  {
    id: 'business', name: 'المؤسّسة', en: 'ENTERPRISE',
    priceMonthly: 799, priceYearly: 7670,
    desc: 'للكيانات ذات العمليّات المتقدّمة والمجتمعات الضخمة.',
    monthlyCredits: 3000,
    bestFor: 'الجمعيّات الكبيرة والهيئات المهنيّة',
    accent: 'oklch(0.5 0.14 30)',
    rows: [
      { t: 'مجتمعات بلا حدود · علامة بيضاء كاملة', ok: true },
      { t: 'واتساب من رقمك الخاص', ok: true, strong: true },
      { t: 'حوكمة: جلسات · تصويت · أرشيف', ok: true },
      { t: 'SSO + سجلّ تدقيق + مدير حساب', ok: true },
      { t: 'دفع وفواتير متوافقة مع ZATCA', ok: true },
    ],
  },
];

// Full feature comparison — grouped (plan order: pro / growth / business)
const W_COMPARE_DEFAULT = [
  {
    title: 'السعة والحدود',
    rows: [
      { f: 'المجتمعات المملوكة',        v: ['3', '10', 'بلا حدود'] },
      { f: 'الأعضاء في المجتمعات',       v: ['بلا حدود', 'بلا حدود', 'بلا حدود'] },
      { f: 'مقاعد المسؤولين',            v: ['3', '50', 'بلا حدود'] },
      { f: 'التخزين',                   v: ['25 جيجابايت', '250 جيجابايت', 'مخصّص'] },
      { f: 'الفعاليّات / شهر',           v: ['بلا حدود', 'بلا حدود', 'بلا حدود'] },
      { f: 'النقاط المجانيّة / شهر',     v: ['500', '1,200', '3,000'] },
    ],
  },
  {
    title: 'التواصل والقنوات',
    rows: [
      { f: 'البريد الإلكتروني',          v: ['من نطاق محور', 'من نطاقك الخاص', 'من نطاقك الخاص'] },
      { f: 'إرسال من بريد جهتك (BYO)',   v: [false, true, true] },
      { f: 'إرسال واتساب',              v: ['من رقم محور', 'من رقم محور', 'من رقمك الخاص'] },
      { f: 'استقبال واتساب (الردود)',   v: [true, true, true] },
      { f: 'ردود خدمة العملاء',         v: ['مجانيّة', 'مجانيّة', 'مجانيّة'] },
      { f: 'رسائل SMS',                 v: [false, true, true] },
      { f: 'مكتبة قوالب واتساب',        v: ['5', '50', 'بلا حدود'] },
      { f: 'استهداف بشرائح',            v: [false, true, true] },
    ],
  },
  {
    title: 'الفعاليّات والإصدار',
    rows: [
      { f: 'صفحة هبوط + تذاكر QR',      v: [true, true, true] },
      { f: 'مصمّم الدعوات المرئي',       v: [true, true, true] },
      { f: 'تذكيرات واتساب آليّة',       v: [true, true, true] },
      { f: 'فعاليّات متعدّدة الأيّام + متحدّثون', v: [false, true, true] },
      { f: 'الشهادات + رمز تحقّق',       v: [false, true, true] },
      { f: 'قوائم انتظار للفعاليّات',     v: [false, true, true] },
    ],
  },
  {
    title: 'الحملات والأتمتة',
    rows: [
      { f: 'إرسال فوري + جدولة',        v: [true, true, true] },
      { f: 'نشرات دوريّة آليّة',         v: [false, true, true] },
      { f: 'رحلات مبنيّة على الحدث',     v: [false, true, true], soon: true },
      { f: 'حملات متعدّدة الخطوات (Drip)', v: [false, true, true] },
      { f: 'اختبار A/B',               v: [false, false, true], soon: true },
    ],
  },
  {
    title: 'الهويّة والتخصيص',
    rows: [
      { f: 'ألوان وسمة مخصّصة',          v: [false, true, true] },
      { f: 'نطاق مخصّص',                v: [false, true, true] },
      { f: 'مستويات عضويّة مدفوعة',      v: [false, true, true] },
      { f: 'علامة بيضاء كاملة',          v: [false, false, true] },
      { f: 'تحقّق بنفاذ (Nafath)',       v: [false, false, true], soon: true },
    ],
  },
  {
    title: 'الحوكمة والمدفوعات',
    rows: [
      { f: 'صفحة دفع + فواتير ZATCA',   v: [false, true, true] },
      { f: 'جلسات ومحاضر',             v: [false, false, true] },
      { f: 'تصويت وقرارات موثّقة',       v: [false, false, true] },
      { f: 'أرشيف بحثي للقرارات',        v: [false, false, true] },
    ],
  },
  {
    title: 'القياس والدعم',
    rows: [
      { f: 'لوحة قياس وتتبّع فوري',      v: ['أساسية', 'متقدّمة', 'متقدّمة + مخصّصة'] },
      { f: 'تصدير التقارير',            v: ['CSV', 'CSV + JSON', 'تصدير كامل'] },
      { f: 'الدعم',                     v: ['بريد · 48 ساعة', 'بريد 24 ساعة + دردشة', 'مدير حساب مخصّص'] },
      { f: 'اتفاقيّة مستوى الخدمة (SLA)', v: ['—', '99.5٪ جاهزية', 'جاهزية 99.9٪ تعاقديّة'] },
      { f: 'الدخول الموحّد (SSO)',       v: [false, false, true] },
      { f: 'الوصول إلى API + Webhooks',  v: [false, false, true] },
      { f: 'سجلّ التدقيق',              v: ['30 يوماً', 'سنة', 'بلا حدود'] },
      { f: 'تجربة مجانيّة 14 يوم',       v: [true, true, true] },
    ],
  },
];

// ---- Editable compare store (persists admin edits to localStorage) ---------
const W_COMPARE_KEY = 'mhwar.wallet.compare.v3';
let W_COMPARE = (() => {
  try { const r = localStorage.getItem(W_COMPARE_KEY); if (r) return JSON.parse(r); } catch (e) {}
  return JSON.parse(JSON.stringify(W_COMPARE_DEFAULT));
})();
const wCompareSubs = new Set();
function wCompareSubscribe(fn) { wCompareSubs.add(fn); return () => wCompareSubs.delete(fn); }
function wSaveCompare(next) {
  W_COMPARE = next;
  try { localStorage.setItem(W_COMPARE_KEY, JSON.stringify(next)); } catch (e) {}
  wCompareSubs.forEach(fn => fn());
}
function wResetCompare() { wSaveCompare(JSON.parse(JSON.stringify(W_COMPARE_DEFAULT))); }
function wCloneCompare() { return JSON.parse(JSON.stringify(W_COMPARE)); }
Object.assign(window, { wResetCompare });

const W_COIN = 'oklch(0.72 0.15 75)';
const W_COIN_DEEP = 'oklch(0.52 0.15 70)';

const wFmt = (n) => Math.round(n).toLocaleString('en-US');

// ---- Coming-soon badge ----------------------------------------------------
// To mark ANY feature as upcoming: add `soon: true` to its row in W_COMPARE
// (or pass <FeatureLabel soon> manually). To hide all badges site-wide, set
// W_SHOW_SOON = false.
const W_SHOW_SOON = true;
function ComingSoonBadge() {
  if (!W_SHOW_SOON) return null;
  return (
    <span style={{
      display: 'inline-block', marginInlineStart: 6, verticalAlign: 'middle',
      fontSize: 9, fontWeight: 700, lineHeight: 1.4, padding: '1px 7px',
      borderRadius: 999, letterSpacing: 0.3,
      color: 'oklch(0.45 0.13 250)', background: 'oklch(0.95 0.04 250)',
      border: '1px solid oklch(0.88 0.05 250)', whiteSpace: 'nowrap',
    }}>قريباً</span>
  );
}
// Feature name + optional coming-soon badge (used across table, cards, report)
function FeatureLabel({ name, soon }) {
  return <span>{name}{soon ? <ComingSoonBadge /> : null}</span>;
}

// =============================================================================
function MhwarWalletSimulator() {
  const [tab, setTab] = useStateW('wallet'); // wallet | plans
  const [billing, setBilling] = useStateW('yearly'); // monthly | yearly
  const [selectedPlanId, setSelectedPlanId] = useStateW(null); // plan detail page
  const [activePlanId, setActivePlanId] = useStateW('growth'); // current subscription

  // Wallet state
  const [balance, setBalance] = useStateW(6500);
  const [freeCredits, setFreeCredits] = useStateW(5000);
  const [paidCredits, setPaidCredits] = useStateW(1500);
  const [log, setLog] = useStateW(() => ([
    { id: 1, title: 'رصيد شهري مجاني — باقة النمو', when: '1 يوليو 2026 · 00:00', amount: 5000, credit: true, icon: '🎁' },
    { id: 2, title: 'شحن المحفظة — حزمة التوفير', when: '2 يوليو 2026 · 14:22', amount: 2180, credit: true, icon: '+' },
    { id: 3, title: 'حملة واتساب — «إطلاق الدورة الجديدة»', when: '5 يوليو 2026 · 09:10 · 400 رسالة تسويقية', amount: 1400, credit: false, icon: '−' },
  ]));

  const lowBalance = balance < 1000;

  const deduct = (amount) => {
    setBalance(b => b - amount);
    setFreeCredits(fc => {
      if (fc >= amount) return fc - amount;
      const rem = amount - fc;
      setPaidCredits(pc => Math.max(0, pc - rem));
      return 0;
    });
  };

  const pushLog = (entry) => setLog(l => [{ id: Date.now(), ...entry }, ...l]);

  const onApplySim = (type, count, cost) => {
    if (type === 'support') {
      window.__wToast?.(`تم إرسال ${wFmt(count)} رد خدمة عملاء مجاناً 🎉`);
      return;
    }
    if (cost > balance) { window.__wToast?.('النقاط غير كافية. يُرجى الشحن أولاً.'); return; }
    deduct(cost);
    pushLog({ title: `إرسال تجريبي — رسائل ${W_TYPE_LABEL[type]}`, when: wNowLabel() + ` · ${wFmt(count)} مستلم`, amount: cost, credit: false, icon: '−' });
    window.__wToast?.(`تم خصم ${wFmt(cost)} نقطة لعدد ${wFmt(count)} مستلم.`);
  };

  const onRecharge = ({ price, base, bonus, auto }) => {
    const total = base + bonus;
    if (total <= 0) { window.__wToast?.('الرجاء تحديد مبلغ صحيح'); return; }
    setBalance(b => b + total);
    setPaidCredits(pc => pc + total);
    pushLog({ title: `شحن المحفظة${bonus > 0 ? ' + مكافأة إضافية' : ''} (${wFmt(price)} ر.س)`, when: wNowLabel(), amount: total, credit: true, icon: '+' });
    setTab('wallet');
    window.__wToast?.(`تم إضافة ${wFmt(total)} نقطة بنجاح${auto ? ' · الشحن التلقائي مُفعّل' : ''}`);
  };

  return (
    <div style={{
      width: '100%', minHeight: '100%', background: 'var(--bg)', direction: 'rtl',
      fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif',
    }}>
      {/* Header / tabs */}
      <div style={{
        background: '#fff', borderBottom: '1px solid var(--line)',
        position: 'sticky', top: 0, zIndex: 30,
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', background: 'var(--warm)', borderRadius: 11, padding: 4 }}>
              <WTab on={tab === 'wallet'} onClick={() => setTab('wallet')}>المحفظة والاستهلاك</WTab>
              <WTab on={tab === 'guide'} onClick={() => setTab('guide')}>دليل التكاليف</WTab>
              <WTab on={tab === 'plans'} onClick={() => setTab('plans')}>الباقات والشحن</WTab>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => window.wOpenReport && window.wOpenReport()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 999, background: 'var(--ink)', color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>⭳ تنزيل التقرير</button>
          {/* Balance pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 14px', borderRadius: 999,
            background: lowBalance ? 'oklch(0.96 0.05 25)' : 'oklch(0.97 0.04 75)',
            border: `1px solid ${lowBalance ? 'oklch(0.85 0.1 25)' : 'oklch(0.88 0.08 75)'}`,
          }}>
            <WCoin sm />
            <span className="mono" style={{ fontWeight: 700, color: lowBalance ? 'oklch(0.5 0.18 25)' : W_COIN_DEEP }}>{wFmt(balance)}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>نقطة</span>
          </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 32px 70px' }}>
        {selectedPlanId ? (
          <PlanDetailPage
            plan={W_PLANS.find(p => p.id === selectedPlanId)}
            billing={billing}
            isCurrent={activePlanId === selectedPlanId}
            onBack={() => setSelectedPlanId(null)}
            onSubscribe={(id) => { setActivePlanId(id); window.__wToast?.('تم تفعيل التجربة المجانيّة 14 يوم 🎉'); setSelectedPlanId(null); }}
            onRecharge={onRecharge}
          />
        ) : tab === 'wallet' ? (
          <WalletPanel
            balance={balance} freeCredits={freeCredits} paidCredits={paidCredits}
            log={log} lowBalance={lowBalance}
            onApplySim={onApplySim} onGotoRecharge={() => setTab('plans')} />
        ) : tab === 'guide' ? (
          <CostGuidePanel />
        ) : (
          <PlansPanel
            billing={billing} setBilling={setBilling}
            activePlanId={activePlanId}
            onSelectPlan={(id) => setSelectedPlanId(id)}
            onRecharge={onRecharge} />
        )}
      </div>

      <WToast />
    </div>
  );
}

// =============================================================================
// WALLET PANEL
// =============================================================================
function WalletPanel({ balance, freeCredits, paidCredits, log, lowBalance, onApplySim, onGotoRecharge }) {
  const coverage = Math.floor(balance / W_COST.marketing);

  return (
    <div>
      {/* low balance banner */}
      {lowBalance && (
        <div style={{
          marginBottom: 22, padding: '14px 18px', borderRadius: 14,
          background: 'oklch(0.97 0.04 75)', borderInlineStart: '4px solid oklch(0.65 0.16 70)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>⚠</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'oklch(0.42 0.13 60)' }}>
              رصيد المحفظة منخفض. ننصح بالشحن لتجنّب توقّف حملاتك.
            </span>
          </div>
          <button onClick={onGotoRecharge} style={wBtn('dark', { padding: '8px 16px', fontSize: 12 })}>اشحن الآن</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Balance hero */}
          <div style={{
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--ink) 0%, #28264f 100%)',
            borderRadius: 20, padding: 28, color: '#fff',
          }}>
            <div style={{ position: 'absolute', top: -60, insetInlineStart: -40, width: 200, height: 200, borderRadius: '50%', background: 'oklch(0.5 0.16 280 / 0.25)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>رصيد المحفظة الحالي</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.14)' }}>باقة النمو 🚀</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                <WCoin />
                <span className="mono" style={{ fontSize: 52, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1 }}>{wFmt(balance)}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>نقطة</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 12, padding: '5px 11px', borderRadius: 8, background: 'rgba(255,255,255,0.1)' }}>🎁 مجاني شهري: <b className="mono">{wFmt(freeCredits)}</b></span>
                <span style={{ fontSize: 12, padding: '5px 11px', borderRadius: 8, background: 'rgba(255,255,255,0.1)' }}>💰 مشحون: <b className="mono">{wFmt(paidCredits)}</b></span>
              </div>
              <p style={{ margin: '0 0 18px', fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                رصيدك يغطّي <b style={{ color: '#fff' }}>~{wFmt(coverage)}</b> رسالة تسويقيّة · أو <b style={{ color: '#fff' }}>عدد لا نهائي</b> من ردود خدمة العملاء (مجانيّة) 🎉
              </p>
              <button onClick={onGotoRecharge} style={{
                ...wBtn('light'), display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>＋ شحن المحفظة</button>
            </div>
          </div>

          {/* Consumption this month */}
          <WCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>الاستهلاك هذا الشهر</h3>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>يوليو 2026</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ConsumptionBar color="oklch(0.6 0.15 145)" label="واتساب (تسويقي)" detail="400 رسالة · 1,400 نقطة" pct={65} />
              <ConsumptionBar color="var(--accent)" label="واتساب (تذكير/خدمي)" detail="450 رسالة · 675 نقطة" pct={30} />
              <ConsumptionBar color="oklch(0.65 0.13 230)" label="بريد إلكتروني إضافي" detail="2,000 رسالة · 100 نقطة" pct={5} />
              <ConsumptionBar color="oklch(0.82 0.02 240)" label="ردود خدمة العملاء" detail="1,200 رسالة · مجاناً" pct={0} free />
            </div>
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>إجمالي النقاط المستهلكة</span>
              <span className="mono" style={{ fontSize: 18, fontWeight: 700 }}>2,175 <span style={{ fontSize: 12, color: 'var(--muted)' }}>نقطة</span></span>
            </div>
          </WCard>

          {/* Transaction log */}
          <WCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>سجلّ المحفظة</h3>
              <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                ⭳ تصدير CSV
              </button>
            </div>
            <div>
              {log.map((tx, i) => (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      display: 'grid', placeItems: 'center', fontSize: 15,
                      background: tx.credit ? 'oklch(0.96 0.05 145)' : 'oklch(0.96 0.04 25)',
                      color: tx.credit ? 'oklch(0.45 0.16 145)' : 'oklch(0.5 0.16 25)',
                    }}>{tx.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{tx.title}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{tx.when}</div>
                    </div>
                  </div>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: tx.credit ? 'oklch(0.45 0.16 145)' : 'var(--ink-2)' }}>
                    {tx.credit ? '+' : '−'}{wFmt(tx.amount)} نقطة
                  </span>
                </div>
              ))}
            </div>
          </WCard>
        </div>

        {/* Right: Simulator */}
        <div style={{ position: 'sticky', top: 84 }}>
          <CostSimulator balance={balance} onApply={onApplySim} />
        </div>
      </div>
    </div>
  );
}

function ConsumptionBar({ color, label, detail, pct, free }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, fontSize: 12 }}>
        <span style={{ fontWeight: 600, color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: color }} />{label}
        </span>
        <span style={{ color: free ? 'oklch(0.45 0.16 145)' : 'var(--muted)', fontWeight: free ? 600 : 400 }} className="mono">{detail}</span>
      </div>
      <div style={{ height: 8, background: 'var(--warm)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

// =============================================================================
// COST SIMULATOR (ring gauge)
// =============================================================================
function CostSimulator({ balance, onApply }) {
  const [type, setType] = useStateW('marketing');
  const [count, setCount] = useStateW(1000);

  const unit = W_COST[type];
  const isSupport = type === 'support';
  const cost = isSupport ? 0 : Math.round(count * unit);
  const remaining = isSupport ? balance : balance - cost;
  const insufficient = !isSupport && remaining < 0;

  const RING = 263.9;
  const ratio = isSupport ? 1 : Math.max(0, Math.min(1, remaining / balance));
  const offset = RING * (1 - ratio);
  const ringColor = isSupport ? 'oklch(0.6 0.15 145)' : insufficient ? 'oklch(0.55 0.2 25)' : (remaining < 500 ? 'oklch(0.7 0.15 70)' : 'var(--accent)');

  const types = [
    { id: 'marketing', label: 'واتساب تسويقي', sub: '3.5 نقاط' },
    { id: 'service',   label: 'خدمي / تذكير',  sub: '1.5 نقطة' },
    { id: 'auth',      label: 'مصادقة (OTP)',  sub: '1.5 نقطة' },
    { id: 'email',     label: 'بريد إلكتروني', sub: '0.05 نقطة' },
    { id: 'support',   label: 'رد خدمة عملاء', sub: 'مجاناً (24 ساعة)', free: true },
  ];

  return (
    <WCard style={{ border: '1.5px solid var(--accent-soft)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>▣</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>محاكي التكلفة</h3>
      </div>
      <p style={{ margin: '0 0 18px', fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>
        احسب كم نقطة ستكلّفك حملتك قبل اعتمادها للإرسال.
      </p>

      {/* Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', width: 158, height: 158 }}>
          <svg width="158" height="158" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--warm)" strokeWidth="9" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={ringColor} strokeWidth="9" strokeLinecap="round"
              strokeDasharray={RING} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.6s, stroke 0.3s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>المتبقّي</span>
            <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: insufficient ? 'oklch(0.55 0.2 25)' : 'var(--ink)' }}>{wFmt(Math.max(0, remaining))}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>نقطة</span>
          </div>
        </div>
      </div>

      {/* Type buttons */}
      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 8 }}>نوع الحملة / الرسالة</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
        {types.map(t => {
          const on = type === t.id;
          return (
            <button key={t.id} onClick={() => setType(t.id)} style={{
              padding: '8px 6px', borderRadius: 9, textAlign: 'center', fontFamily: 'inherit', cursor: 'pointer',
              border: on ? '1.5px solid var(--accent)' : '1.5px solid var(--line)',
              background: on ? 'var(--accent-soft)' : '#fff',
              color: on ? 'var(--accent)' : 'var(--ink-2)',
            }}>
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>{t.label}</div>
              <div style={{ fontSize: 9.5, marginTop: 2, color: t.free ? 'oklch(0.5 0.16 145)' : (on ? 'var(--accent)' : 'var(--muted)'), opacity: t.free ? 1 : 0.75 }}>{t.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Slider */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)' }}>عدد المستلمين</span>
        <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{wFmt(count)}</span>
      </div>
      <input type="range" min={0} max={10000} step={50} value={count} onChange={e => setCount(parseInt(e.target.value, 10))}
        style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 16 }}>
        <span>0</span><span>10,000+</span>
      </div>

      {/* Result box */}
      <div style={{ background: 'var(--warm)', borderRadius: 11, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
          <span style={{ color: 'var(--muted)' }}>التكلفة التقديريّة</span>
          <span className="mono" style={{ fontWeight: 700 }}>{isSupport ? 'مجاناً 🎉' : `${wFmt(cost)} نقطة`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
          <span style={{ color: 'var(--muted)' }}>رصيدك بعد الإرسال</span>
          <span className="mono" style={{ fontWeight: 700, color: insufficient ? 'oklch(0.55 0.2 25)' : 'var(--accent)' }}>{wFmt(Math.max(0, remaining))} نقطة</span>
        </div>
      </div>

      {/* Warning */}
      {insufficient && (
        <div style={{
          background: 'oklch(0.97 0.04 25)', border: '1px solid oklch(0.85 0.1 25)',
          borderRadius: 11, padding: 12, marginBottom: 14,
        }}>
          <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: 'oklch(0.5 0.18 25)' }}>
            ⚠ رصيدك لا يكفي. تحتاج شحن {wFmt(Math.ceil(cost - balance))} نقطة إضافيّة.
          </p>
        </div>
      )}

      <button onClick={() => onApply(type, count, cost)} style={wBtn('primary', { width: '100%' })}>
        تطبيق وإرسال تجريبي
      </button>
    </WCard>
  );
}

// =============================================================================
// PLANS PANEL
// =============================================================================
function PlansPanel({ billing, setBilling, activePlanId, onSelectPlan, onRecharge }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{ display: 'inline-block', marginBottom: 12, fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          شفافية ماليّة بدون رسوم خفيّة 🚀
        </span>
        <h1 style={{ margin: '0 0 10px', fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>باقات مرنة تنمو مع مجتمعك</h1>
        <p style={{ margin: '0 auto 14px', maxWidth: 660, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.85 }}>
          <b>«محور»</b> هي مساحة العمل المتكاملة لإدارة المجتمعات الرقميّة وفعاليّاتها — تجمع بناء المجتمع وإدارة التذاكر وأتمتة التواصل عبر واتساب في نظامٍ واحد. اشتراكٌ ثابت للميزات، ومحفظة نقاط مرنة تدفع فيها مقابل رسائلك فقط.
        </p>
        <p style={{ margin: '0 auto', maxWidth: 600, fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>
          اشترك في الباقة لتفتح أبواب المنصّة، واستخدم محفظتك الذكيّة لدفع تكاليف حملاتك الإضافيّة حسب استهلاكك فقط.
        </p>
      </div>

      {/* Billing toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
        <div style={{ display: 'inline-flex', padding: 4, background: 'var(--warm)', borderRadius: 999, border: '1px solid var(--line)' }}>
          <WBillPill on={billing === 'monthly'} onClick={() => setBilling('monthly')}>شهري</WBillPill>
          <WBillPill on={billing === 'yearly'} onClick={() => setBilling('yearly')}>سنوي<span style={{ marginInlineStart: 6, fontSize: 9.5, padding: '2px 7px', background: 'oklch(0.92 0.08 145)', color: 'oklch(0.35 0.15 145)', borderRadius: 999, fontWeight: 600 }}>وفّر 20٪</span></WBillPill>
        </div>
      </div>

      {/* Plan cards — 3 plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch', marginBottom: 12 }}>
        {W_PLANS.map(p => <PlanCard key={p.id} plan={p} billing={billing} isCurrent={activePlanId === p.id} onSelect={() => onSelectPlan(p.id)} />)}
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginBottom: 32 }}>
        جميع الباقات تشمل <b style={{ color: 'var(--ink-2)' }}>تجربة مجانيّة 14 يوماً</b> · بدون بطاقة ائتمان · إلغاء في أي وقت
      </p>

      {/* Full comparison */}
      <WCompareMatrix billing={billing} onSelectPlan={onSelectPlan} />

      {/* Enterprise */}
      <div style={{
        background: 'linear-gradient(135deg, var(--ink), #28264f)', borderRadius: 20, padding: 30,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap',
        marginBottom: 36, color: '#fff',
      }}>
        <div style={{ flex: '1 1 380px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 21, fontWeight: 600 }}>باقة المؤسّسات والجهات الحكوميّة 🏛️</h3>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 580 }}>
            تبحث عن تسجيل الدخول الموحّد (SSO)، اتفاقيّات مستوى الخدمة (SLA)، خوادم مخصّصة، ومدير حساب خاص؟ لدينا الحل المتكامل لعملياتك.
          </p>
        </div>
        <button style={wBtn('light', { whiteSpace: 'nowrap' })}>تواصل مع المبيعات لتسعير مخصّص</button>
      </div>

      {/* Points explanation */}
      <WCard style={{ textAlign: 'center', marginBottom: 36, padding: 30 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 21, fontWeight: 600 }}>كيف يُخصم من النقاط؟ 🪙</h3>
        <p style={{ margin: '0 auto 22px', maxWidth: 560, fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          تُحتسب رسائل الواتساب بتكلفة شفّافة تطابق التكلفة الرسميّة لشركة Meta لضمان أفضل سعر لحملاتك.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 760, margin: '0 auto' }}>
          {[
            { emoji: '📢', t: 'واتساب تسويقي', v: '3.5 نقاط', free: false },
            { emoji: '🔔', t: 'تذكير / خدمي', v: '1.5 نقطة', free: false },
            { emoji: '✉️', t: 'بريد إضافي', v: '0.05 نقطة', free: false },
            { emoji: '🎧', t: 'ردود خدمة العملاء', v: 'مجانيّة (24 ساعة)', free: true },
          ].map((c, i) => (
            <div key={i} style={{
              padding: 18, borderRadius: 14,
              background: c.free ? 'oklch(0.97 0.04 145)' : 'var(--warm)',
              border: `1px solid ${c.free ? 'oklch(0.9 0.06 145)' : 'var(--line)'}`,
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{c.emoji}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: c.free ? 'oklch(0.4 0.16 145)' : 'var(--ink)' }}>{c.t}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 4, color: c.free ? 'oklch(0.45 0.16 145)' : 'var(--accent)' }}>{c.v}</div>
            </div>
          ))}
        </div>
      </WCard>

      {/* Recharge section */}
      <RechargeSection onRecharge={onRecharge} />
    </div>
  );
}

function WBillPill({ on, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 18px', borderRadius: 999, fontFamily: 'inherit', cursor: 'pointer',
      background: on ? '#fff' : 'transparent', color: on ? 'var(--ink)' : 'var(--muted)',
      fontSize: 12.5, fontWeight: on ? 600 : 500,
      boxShadow: on ? '0 2px 6px -2px rgba(0,0,0,0.12)' : 'none',
      display: 'inline-flex', alignItems: 'center', border: 'none',
    }}>{children}</button>
  );
}

function wPlanPrice(plan, billing) {
  const yearly = billing === 'yearly';
  const value = yearly ? plan.priceYearly : plan.priceMonthly;
  const perMonth = yearly ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;
  return { value, period: yearly ? 'ر.س / سنة' : 'ر.س / شهر', perMonth, yearly };
}

function PlanCard({ plan, billing, isCurrent, onSelect }) {
  const pr = wPlanPrice(plan, billing);
  return (
    <div onClick={onSelect} style={{
      position: 'relative', background: '#fff', borderRadius: 18, padding: 22,
      display: 'flex', flexDirection: 'column', cursor: 'pointer',
      border: plan.highlight ? '2px solid var(--accent)' : '1px solid var(--line)',
      boxShadow: plan.highlight ? '0 18px 40px -22px oklch(0.45 0.18 270 / 0.4)' : 'none',
      transform: plan.highlight ? 'translateY(-6px)' : 'none',
    }}>
      {plan.badge && (
        <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '4px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{plan.badge} ⭐</div>
      )}
      {isCurrent && (
        <div style={{ position: 'absolute', top: 12, insetInlineStart: 14, background: 'oklch(0.95 0.05 145)', color: 'oklch(0.4 0.16 145)', fontSize: 9.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>باقتك الحاليّة</div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4, marginTop: isCurrent ? 14 : 0 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{plan.name}</h3>
        <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1.5 }}>{plan.en}</span>
      </div>
      <p style={{ margin: '0 0 14px', fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, minHeight: 32 }}>{plan.desc}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>{wFmt(pr.value)}</span>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{pr.period}</span>
      </div>
      <div style={{ fontSize: 10.5, color: pr.yearly ? 'oklch(0.45 0.16 145)' : 'transparent', fontWeight: 600, marginBottom: 14, marginTop: 2, minHeight: 14 }}>
        {pr.yearly ? `≈ ${wFmt(pr.perMonth)} ر.س / شهر` : ' '}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 10, marginBottom: 14,
        background: 'oklch(0.97 0.04 75)', border: '1px solid oklch(0.9 0.07 75)',
      }}>
        <WCoin sm />
        <span style={{ fontSize: 11.5, fontWeight: 600, color: W_COIN_DEEP }}>{wFmt(plan.monthlyCredits)} نقطة مجانيّة / شهر</span>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onSelect(); }} style={{ ...wBtn(plan.highlight ? 'primary' : 'outline', { width: '100%', fontSize: 12.5, padding: '11px' }), marginBottom: 16 }}>
        ابدأ التجربة المجانيّة ←
      </button>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {plan.rows.map((r, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11.5, color: r.ok ? 'var(--ink-2)' : 'var(--muted)' }}>
            <span style={{ color: r.ok ? (r.strong ? 'oklch(0.55 0.16 145)' : 'var(--accent)') : 'var(--line-2)', fontWeight: 700, flexShrink: 0 }}>{r.ok ? '✓' : '✕'}</span>
            <span style={{ fontWeight: r.strong ? 600 : 400 }}>{r.t}</span>
          </li>
        ))}
      </ul>
      <button onClick={(e) => { e.stopPropagation(); onSelect(); }} style={{ marginTop: 14, background: 'none', border: 'none', color: 'var(--accent)', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>عرض كل التفاصيل والرصيد ←</button>
    </div>
  );
}

// ---- Full comparison matrix (mirrors pricing tab) ----
function WCompareMatrix({ billing, onSelectPlan }) {
  const [, force] = useStateW(0);
  const [edit, setEdit] = useStateW(false);
  React.useEffect(() => wCompareSubscribe(() => force(x => x + 1)), []);

  const cell = (v) => {
    if (v === true) return <span style={{ color: 'oklch(0.55 0.15 145)', fontSize: 14, fontWeight: 700 }}>✓</span>;
    if (v === false) return <span style={{ color: '#c8c7c0', fontSize: 13 }}>—</span>;
    return <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{v}</span>;
  };

  // ---- mutation helpers ----
  const mutate = (fn) => { const next = wCloneCompare(); fn(next); wSaveCompare(next); };
  const setName = (gi, ri, name) => mutate(c => { c[gi].rows[ri].f = name; });
  const setSoon = (gi, ri, soon) => mutate(c => { c[gi].rows[ri].soon = soon; });
  const setVal  = (gi, ri, vi, val) => mutate(c => { c[gi].rows[ri].v[vi] = val; });
  const addRow  = (gi) => mutate(c => { c[gi].rows.push({ f: 'ميزة جديدة', v: [false, false, false] }); });
  const delRow  = (gi, ri) => mutate(c => { c[gi].rows.splice(ri, 1); });
  const moveRow = (gi, ri, dir) => mutate(c => {
    const rows = c[gi].rows; const ni = ri + dir;
    if (ni < 0 || ni >= rows.length) return;
    [rows[ri], rows[ni]] = [rows[ni], rows[ri]];
  });

  // Cell editor: cycle availability or enter custom text
  const CellEdit = ({ gi, ri, vi, val }) => {
    const isBool = val === true || val === false;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', borderRadius: 7, overflow: 'hidden', border: '1px solid var(--line)' }}>
          <button onClick={() => setVal(gi, ri, vi, true)} title="متاح" style={segBtn(val === true, 'oklch(0.55 0.15 145)')}>✓</button>
          <button onClick={() => setVal(gi, ri, vi, false)} title="غير متاح" style={segBtn(val === false, '#9a9a9a')}>—</button>
          <button onClick={() => setVal(gi, ri, vi, isBool ? 'نص' : (val || 'نص'))} title="نص مخصّص" style={segBtn(!isBool, 'var(--accent)')}>Aa</button>
        </div>
        {!isBool && (
          <input value={val} onChange={e => setVal(gi, ri, vi, e.target.value)}
            style={{ width: 86, fontSize: 10.5, padding: '3px 5px', borderRadius: 6, border: '1px solid var(--line)', textAlign: 'center', fontFamily: 'inherit' }} />
        )}
      </div>
    );
  };

  return (
    <WCard style={{ padding: 0, overflow: 'hidden', marginBottom: 36 }}>
      <div style={{ padding: '18px 22px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>مقارنة المميّزات الكاملة</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
            {edit ? 'وضع التحرير: عدّل الأسماء، حدّد المتاح/غير المتاح، فعّل «قريباً»، أضف أو احذف أو حرّك الميزات.' : 'كل ما تحصل عليه في كل باقة — للمقارنة بسهولة قبل الاختيار.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {edit && <button onClick={() => { if (confirm('استرجاع كل الميزات للوضع الافتراضي؟ سيُلغى كل تعديلاتك.')) wResetCompare(); }}
            style={wBtn('outline', { fontSize: 11.5, padding: '7px 12px' })}>استرجاع الافتراضي</button>}
          <button onClick={() => setEdit(e => !e)} style={wBtn(edit ? 'primary' : 'outline', { fontSize: 11.5, padding: '7px 14px' })}>
            {edit ? '✓ تمّ التحرير' : '✎ تحرير الميزات'}
          </button>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--warm)' }}>
            <th style={{ padding: '12px 22px', textAlign: 'start', fontSize: 12, fontWeight: 600, color: 'var(--muted)', minWidth: 200 }}>المميّزة</th>
            {W_PLANS.map(p => (
              <th key={p.id} style={{ padding: '12px 10px', textAlign: 'center', fontSize: 12.5, fontWeight: 600, color: p.highlight ? 'var(--accent)' : 'var(--ink)', borderInlineStart: '1px solid var(--line)' }}>
                {p.name}
                {p.highlight && <div style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 600 }}>⭐</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {W_COMPARE.map((g, gi) => (
            <React.Fragment key={gi}>
              <tr>
                <td colSpan={4} style={{ padding: '13px 22px 7px', fontSize: 10.5, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--accent)', background: 'oklch(0.985 0.01 270)', borderTop: gi === 0 ? 'none' : '1px solid var(--line)' }}>{g.title}</td>
              </tr>
              {g.rows.map((row, ri) => (
                <tr key={ri} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ padding: '11px 22px', fontSize: 12, color: 'var(--ink)' }}>
                    {edit ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <button onClick={() => moveRow(gi, ri, -1)} title="رفع" style={moveBtn}>▲</button>
                          <button onClick={() => moveRow(gi, ri, +1)} title="تنزيل" style={moveBtn}>▼</button>
                        </div>
                        <input value={row.f} onChange={e => setName(gi, ri, e.target.value)}
                          style={{ flex: 1, fontSize: 12, padding: '5px 8px', borderRadius: 7, border: '1px solid var(--line)', fontFamily: 'inherit', minWidth: 130 }} />
                        <button onClick={() => setSoon(gi, ri, !row.soon)} title="قريباً"
                          style={{ ...wBtn(row.soon ? 'primary' : 'outline', { fontSize: 10, padding: '4px 8px' }), whiteSpace: 'nowrap' }}>قريباً</button>
                        <button onClick={() => { if (confirm(`حذف ميزة «${row.f}»؟`)) delRow(gi, ri); }} title="حذف"
                          style={{ ...moveBtn, color: 'oklch(0.55 0.18 25)', width: 24, height: 24 }}>✕</button>
                      </div>
                    ) : <FeatureLabel name={row.f} soon={row.soon} />}
                  </td>
                  {row.v.map((val, vi) => (
                    <td key={vi} style={{ padding: '11px 10px', textAlign: 'center', borderInlineStart: '1px solid var(--line)', background: W_PLANS[vi].highlight ? 'oklch(0.985 0.01 270)' : 'transparent' }}>
                      {edit ? <CellEdit gi={gi} ri={ri} vi={vi} val={val} /> : cell(val)}
                    </td>
                  ))}
                </tr>
              ))}
              {edit && (
                <tr style={{ borderTop: '1px solid var(--line)' }}>
                  <td colSpan={4} style={{ padding: '8px 22px' }}>
                    <button onClick={() => addRow(gi)} style={wBtn('outline', { fontSize: 11, padding: '6px 12px' })}>+ إضافة ميزة إلى «{g.title}»</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {!edit && (
            <tr style={{ borderTop: '1px solid var(--line)' }}>
              <td style={{ padding: '14px 22px' }} />
              {W_PLANS.map(p => (
                <td key={p.id} style={{ padding: '14px 10px', textAlign: 'center', borderInlineStart: '1px solid var(--line)' }}>
                  <button onClick={() => onSelectPlan(p.id)} style={wBtn(p.highlight ? 'primary' : 'outline', { fontSize: 11.5, padding: '8px 14px' })}>اختيار</button>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </WCard>
  );
}

const moveBtn = { width: 20, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, border: '1px solid var(--line)', background: '#fff', cursor: 'pointer', fontSize: 8, color: 'var(--muted)', fontFamily: 'inherit', padding: 0 };
const segBtn = (on, color) => ({ width: 30, height: 26, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', background: on ? color : '#fff', color: on ? '#fff' : 'var(--muted)' });

// ---- Plan detail page (free credits + add recharge) ----
function PlanDetailPage({ plan, billing, isCurrent, onBack, onSubscribe, onRecharge }) {
  if (!plan) return null;
  const pr = wPlanPrice(plan, billing);
  const coverage = Math.floor(plan.monthlyCredits / W_COST.marketing);
  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 18, display: 'inline-flex', alignItems: 'center', gap: 6 }}>→ الرجوع للباقات</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, alignItems: 'start', marginBottom: 24 }}>
        {/* Plan hero */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--ink) 0%, #28264f 100%)', borderRadius: 20, padding: 28, color: '#fff' }}>
          <div style={{ position: 'absolute', top: -60, insetInlineStart: -40, width: 200, height: 200, borderRadius: '50%', background: 'oklch(0.5 0.16 280 / 0.25)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 700 }}>{plan.name}</span>
              <span className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5 }}>{plan.en}</span>
              {plan.badge && <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.16)' }}>{plan.badge} ⭐</span>}
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 460 }}>{plan.desc}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span className="mono" style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1 }}>{wFmt(pr.value)}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{pr.period}</span>
            </div>
            <div style={{ fontSize: 12, color: pr.yearly ? 'oklch(0.8 0.12 145)' : 'rgba(255,255,255,0.6)', marginBottom: 18 }}>
              {pr.yearly ? `≈ ${wFmt(pr.perMonth)} ر.س / شهر · وفّرت 20٪` : 'يُحاسب شهريّاً'}
            </div>
            <button onClick={() => onSubscribe(plan.id)} disabled={isCurrent} style={{ ...wBtn('light'), opacity: isCurrent ? 0.6 : 1, cursor: isCurrent ? 'default' : 'pointer' }}>
              {isCurrent ? '✓ باقتك الحاليّة' : 'ابدأ التجربة المجانيّة 14 يوم'}
            </button>
          </div>
        </div>

        {/* Free credits highlight */}
        <WCard style={{ borderColor: 'oklch(0.9 0.07 75)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <WCoin />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>الرصيد المجاني الشهري</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>يتجدّد تلقائيّاً كل شهر</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
            <span className="mono" style={{ fontSize: 34, fontWeight: 700, color: W_COIN_DEEP }}>{wFmt(plan.monthlyCredits)}</span>
            <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>نقطة</span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.7 }}>
            تكفي لإرسال <b>~{wFmt(coverage)}</b> رسالة تسويقيّة شهريّاً، أو عدد لا نهائي من ردود خدمة العملاء (مجانيّة) 🎉
          </p>
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--warm)', borderRadius: 10, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>
            النقاط الإضافيّة تُشحن من المحفظة حسب الحاجة — تظهر بالأسفل ↓
          </div>
        </WCard>
      </div>

      {/* Full features for this plan */}
      <WCard style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>كل ما تحصل عليه في باقة {plan.name}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 24px' }}>
          {W_COMPARE.flatMap((g, gi) => g.rows.map((row, ri) => {
            const idx = W_PLANS.findIndex(p => p.id === plan.id);
            const val = row.v[idx];
            if (val === false) return null;
            return (
              <div key={`${gi}-${ri}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: 12, padding: '7px 0', borderBottom: '1px dashed var(--line)' }}>
                <span style={{ color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ color: 'oklch(0.55 0.15 145)', fontWeight: 700 }}>✓</span>{row.f}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--ink)', textAlign: 'end' }}>{val === true ? '' : val}</span>
              </div>
            );
          }))}
        </div>
      </WCard>

      {/* Add recharge on this plan */}
      <RechargeSection onRecharge={onRecharge} heading={`أضف رصيداً على باقة ${plan.name}`} sub="عزّز رصيدك المجاني الشهري بنقاط إضافيّة كلّما احتجت — مع مكافآت على الشحن الأكبر." />
    </div>
  );
}

// =============================================================================
// RECHARGE SECTION
// =============================================================================
function RechargeSection({ onRecharge, heading, sub }) {
  const [mode, setMode] = useStateW('packages'); // packages | custom
  const [pkg, setPkg] = useStateW(W_RECHARGE_PACKAGES.find(p => p.popular));
  const [customAmount, setCustomAmount] = useStateW(300);
  const [auto, setAuto] = useStateW(false);

  const customBase = Math.max(0, customAmount) * W_POINTS_PER_SAR;
  const customRate = wBonusRate(customAmount);
  const customBonus = Math.round(customBase * customRate);

  const active = mode === 'packages'
    ? { price: pkg.price, base: pkg.base, bonus: pkg.bonus }
    : { price: customAmount, base: customBase, bonus: customBonus };
  const total = active.base + active.bonus;

  return (
    <section>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: -0.6 }}>{heading || 'شحن نقاط المحفظة'}</h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted)' }}>{sub || 'كلّما زادت قيمة الشحن، حصلت على رصيد إضافي مجاني يقلّل تكلفة رسائلك 🎁'}</p>
      </div>

      {/* mode toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '24px 0' }}>
        <button onClick={() => setMode('packages')} style={wBtn(mode === 'packages' ? 'primary' : 'outline', { padding: '9px 18px', fontSize: 12.5 })}>باقات التوفير</button>
        <button onClick={() => setMode('custom')} style={wBtn(mode === 'custom' ? 'primary' : 'outline', { padding: '9px 18px', fontSize: 12.5 })}>مبلغ مخصّص</button>
      </div>

      {mode === 'packages' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {W_RECHARGE_PACKAGES.map(p => {
            const on = pkg.id === p.id;
            return (
              <button key={p.id} onClick={() => setPkg(p)} style={{
                position: 'relative', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit',
                background: '#fff', borderRadius: 16, padding: '22px 16px',
                border: on ? '2px solid var(--accent)' : '2px solid var(--line)',
                boxShadow: on ? '0 14px 30px -18px oklch(0.45 0.18 270 / 0.4)' : 'none',
              }}>
                {p.popular && <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 11px', borderRadius: 999, whiteSpace: 'nowrap' }}>الأكثر توفيراً ⭐</span>}
                <div style={{ fontSize: 12.5, fontWeight: 600, color: on ? 'var(--accent)' : 'var(--muted)', marginBottom: 12 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 4 }}>
                  <WCoin sm />
                  <span className="mono" style={{ fontSize: 28, fontWeight: 700 }}>{wFmt(p.base + p.bonus)}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, height: 16, color: p.bonus > 0 ? 'oklch(0.45 0.16 145)' : 'var(--muted)', marginBottom: 14 }}>
                  {p.bonus > 0 ? `+${wFmt(p.bonus)} نقطة مجانية 🎁` : 'بدون نقاط إضافيّة'}
                </div>
                <div style={{ padding: '8px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, background: on ? 'var(--accent-soft)' : 'var(--warm)', color: on ? 'var(--accent)' : 'var(--ink-2)' }} className="mono">{p.price} ر.س</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ maxWidth: 460, margin: '0 auto', background: '#fff', borderRadius: 16, border: '1px solid var(--line)', padding: 24 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 8 }}>حدّد المبلغ الذي تريد شحنه</label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input type="number" min={50} value={customAmount} onChange={e => setCustomAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="mono" style={{ width: '100%', fontSize: 28, fontWeight: 700, border: '2px solid var(--line)', borderRadius: 12, padding: '14px 18px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontWeight: 600 }}>ر.س</span>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: 11, color: 'var(--muted)' }}>الحدّ الأدنى 50 ر.س · كل 1 ر.س = 10 نقاط</p>
          <div style={{ background: 'var(--accent-soft)', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>إجمالي النقاط</span>
            <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: 'var(--accent)' }}>{wFmt(total)} نقطة</span>
          </div>
          <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: 11, fontWeight: 600, color: customRate > 0 ? 'oklch(0.45 0.16 145)' : 'var(--muted)' }}>
            {customRate > 0 ? `يشمل +${wFmt(customBonus)} نقطة مجانية 🎁` : 'اشحن 200 ر.س أو أكثر لتفعيل المكافآت المجانيّة.'}
          </p>
        </div>
      )}

      {/* Checkout */}
      <div style={{ maxWidth: 460, margin: '28px auto 0', background: '#fff', borderRadius: 16, border: '1px solid var(--line)', padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>سيُضاف إلى محفظتك</span>
          <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{wFmt(total)} نقطة</span>
        </div>
        <p style={{ margin: '8px 0 16px', fontSize: 11, color: 'var(--muted)', textAlign: 'left' }} className="mono">المبلغ المطلوب: {wFmt(active.price)} ر.س</p>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, cursor: 'pointer', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>تفعيل الشحن التلقائي 🔄</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>اشحن تلقائيّاً عند انخفاض الرصيد لتجنّب توقّف حملاتك.</div>
          </div>
          <span onClick={() => setAuto(a => !a)} style={{
            width: 44, height: 25, borderRadius: 999, flexShrink: 0, position: 'relative',
            background: auto ? 'var(--accent)' : 'var(--line-2)', transition: 'background 0.2s', cursor: 'pointer',
          }}>
            <span style={{ position: 'absolute', top: 3, right: auto ? 22 : 3, width: 19, height: 19, borderRadius: '50%', background: '#fff', transition: 'right 0.2s' }} />
          </span>
        </label>
        <button onClick={() => onRecharge({ ...active, auto })} style={wBtn('primary', { width: '100%', fontSize: 15, padding: '14px' })}>
          إتمام الدفع والشحن
        </button>
        <p style={{ margin: '12px 0 0', textAlign: 'center', fontSize: 10.5, color: 'var(--muted)' }}>دفع آمن وموثّق عبر مدى · Apple Pay · بطاقة ائتمانيّة</p>
      </div>
    </section>
  );
}

// =============================================================================
// COST GUIDE PANEL — transparent costing for WhatsApp (by type) + Email (SES)
// =============================================================================
function CostGuidePanel() {
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <span style={{ display: 'inline-block', marginBottom: 12, fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          تسعير شفّاف · يطابق تكلفة Meta الرسميّة 🪙
        </span>
        <h1 style={{ margin: '0 0 10px', fontSize: 32, fontWeight: 600, letterSpacing: -1 }}>دليل تكاليف الإرسال</h1>
        <p style={{ margin: '0 auto', maxWidth: 640, fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>
          كل رسالة تُخصم من رصيدك بالنقاط حسب نوعها. <b style={{ color: 'var(--ink-2)' }}>1 نقطة = 0.10 ر.س</b> (10 نقاط = 1 ريال).
          الأسعار أدناه مبنيّة على تكلفة Meta الرسميّة للسعودية (أبريل 2026) + هامش تشغيل بسيط.
        </p>
      </div>

      {/* WhatsApp by type */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>🟢</span>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>واتساب — حسب نوع الرسالة</h2>
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7 }}>
        منذ يوليو 2025، يحتسب Meta لكل رسالة قالب تُسلَّم (لا لكل محادثة). فئة الرسالة تحدّد السعر — والردود داخل نافذة الـ24 ساعة مجانيّة.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12, marginBottom: 14 }}>
        {W_WA_GUIDE.map(g => (
          <div key={g.id} style={{
            background: '#fff', borderRadius: 16, padding: 18,
            border: g.free ? '1px solid oklch(0.9 0.06 145)' : '1px solid var(--line)',
            borderTop: `3px solid oklch(0.6 0.15 ${g.hue})`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 22 }}>{g.emoji}</span>
                <span style={{ fontSize: 14.5, fontWeight: 600 }}>{g.name}</span>
              </div>
              {g.free ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: 'oklch(0.42 0.16 145)', background: 'oklch(0.95 0.05 145)', padding: '4px 10px', borderRadius: 999 }}>مجانيّة</span>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <WCoin sm />
                  <span className="mono" style={{ fontSize: 17, fontWeight: 700, color: W_COIN_DEEP }}>{g.points}</span>
                </div>
              )}
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>{g.what}</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, padding: '8px 10px', background: 'var(--warm)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 2 }}>تكلفتنا</div>
                <div className="mono" style={{ fontSize: 12.5, fontWeight: 600 }}>{g.meta > 0 ? `${g.meta.toFixed(2)} ر.س` : '—'}</div>
              </div>
              <div style={{ flex: 1, padding: '8px 10px', background: 'var(--accent-soft)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 9.5, color: 'var(--accent)', marginBottom: 2 }}>سعرك</div>
                <div className="mono" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>{g.sell > 0 ? `${g.sell.toFixed(2)} ر.س` : 'مجاناً'}</div>
              </div>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5, display: 'flex', gap: 6 }}>
              <span style={{ color: `oklch(0.55 0.15 ${g.hue})` }}>ⓘ</span><span>{g.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Email */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '28px 0 14px' }}>
        <span style={{ fontSize: 20 }}>✉️</span>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>البريد الإلكتروني — Amazon SES</h2>
      </div>
      <WCard style={{ marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 1.4fr', gap: 14, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 4 }}>تكلفة Amazon SES</div>
            <div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>0.40 <span style={{ fontSize: 10, color: 'var(--muted)' }}>ر.س / 1000</span></div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>~0.0004 ر.س للرسالة</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9.5, color: 'var(--accent)', marginBottom: 4 }}>سعرك للرسالة</div>
            <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>0.005 <span style={{ fontSize: 10, color: 'var(--muted)' }}>ر.س</span></div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>= 0.05 نقطة</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 4 }}>1,000 رسالة</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
              <WCoin sm /><span className="mono" style={{ fontSize: 16, fontWeight: 700, color: W_COIN_DEEP }}>50</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>نقطة فقط</div>
          </div>
          <div style={{ padding: '12px 14px', background: 'var(--warm)', borderRadius: 10, fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.7 }}>
            <b>ملاحظة:</b> SES يحتسب <b>لكل مستلم</b> (رسالة واحدة لـ100 شخص = 100 إرسال). السعر يشمل القوالب والتتبّع وإدارة الارتدادات. كل باقة تشمل حصّة بريد شهريّة مجانيّة قبل الخصم من النقاط.
          </div>
        </div>
      </WCard>

      {/* How the point value is derived */}
      <WCard style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600 }}>كيف حدّدنا قيمة النقطة؟ 🧮</h3>
        <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7 }}>
          نبدأ من تكلفة Meta الفعليّة للسعودية، نضيف هامش تشغيل يغطّي البنية والدعم والتطوير، ثم نحوّل الناتج إلى نقاط (0.10 ر.س للنقطة).
        </p>
        <div style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid var(--line)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--warm)' }}>
                {['النوع', 'تكلفتنا', 'سعرك', 'النقاط', 'الهامش'].map((h, i) => (
                  <th key={i} style={{ padding: '11px 14px', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textAlign: i === 0 ? 'start' : 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {W_WA_GUIDE.filter(g => !g.free).map((g, i) => {
                const margin = Math.round((1 - g.meta / g.sell) * 100);
                return (
                  <tr key={g.id} style={{ borderTop: '1px solid var(--line)' }}>
                    <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 500 }}>{g.emoji} {g.name}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--muted)' }}>{g.meta.toFixed(2)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>{g.sell.toFixed(2)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center' }}><span className="mono" style={{ fontWeight: 700, color: W_COIN_DEEP }}>{g.points}</span></td>
                    <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'oklch(0.45 0.16 145)' }}>{margin}%</span>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 500 }}>✉️ بريد إلكتروني (SES)</td>
                <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--muted)' }}>0.0004</td>
                <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>0.005</td>
                <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center' }}><span className="mono" style={{ fontWeight: 700, color: W_COIN_DEEP }}>0.05</span></td>
                <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center' }}><span style={{ fontWeight: 600, color: 'oklch(0.45 0.16 145)' }}>92%</span></td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--line)', background: 'oklch(0.99 0.01 175)' }}>
                <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 500 }}>🎧 رد خدمة العملاء</td>
                <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center', color: 'var(--muted)' }}>0.00</td>
                <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center', fontWeight: 600 }}>مجاناً</td>
                <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center', fontWeight: 700, color: 'oklch(0.45 0.16 145)' }}>0</td>
                <td style={{ padding: '11px 14px', fontSize: 12, textAlign: 'center', color: 'var(--muted)' }}>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, padding: '12px 14px', background: 'oklch(0.97 0.04 75)', borderRadius: 10, fontSize: 11.5, color: 'oklch(0.42 0.13 60)', lineHeight: 1.7 }}>
          ⚠ أسعار Meta تُراجَع دوريّاً (كل ربع تقريباً). نُحدّث قيمة النقطة عند أي تغيّر جوهري في تكلفة المصدر للحفاظ على الهامش.
        </div>
      </WCard>

      {/* What each plan's monthly points buy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 14px' }}>
        <span style={{ fontSize: 20 }}>📦</span>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>النقاط المجانيّة في كل باقة — ماذا تعني؟</h2>
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7 }}>
        كل باقة تمنحك رصيداً مجانيّاً شهريّاً بالنقاط. <b style={{ color: 'var(--ink-2)' }}>السعة تختلف جذريّاً حسب القناة</b> — البريد رخيص جداً (0.05 نقطة) بينما رسائل الواتساب التسويقيّة أعلى (3.5 نقطة).
      </p>
      <WCard style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--warm)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'start', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)' }}>لو صرفت كل النقاط على…</th>
              {W_PLANS.map(p => (
                <th key={p.id} style={{ padding: '12px 12px', textAlign: 'center', fontSize: 12.5, fontWeight: 600, color: p.highlight ? 'var(--accent)' : 'var(--ink)', borderInlineStart: '1px solid var(--line)' }}>
                  {p.name}{p.highlight ? ' ⭐' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'النقاط المجانيّة / شهر', fn: (c) => `${wFmt(c)} نقطة`, head: true },
              { label: 'قيمتها (ر.س)', fn: (c) => `${wFmt(c * 0.10)} ر.س` },
              { label: '📢 رسائل واتساب تسويقيّة', fn: (c) => `~${wFmt(c / 3.5)}` },
              { label: '🔔 رسائل واتساب خدميّة', fn: (c) => `~${wFmt(c / 1.5)}` },
              { label: '🔐 رسائل مصادقة (OTP)', fn: (c) => `~${wFmt(c / 1.5)}` },
              { label: '✉️ رسائل بريد إلكتروني', fn: (c) => `~${wFmt(c * 20)}`, strong: true },
            ].map((row, ri) => (
              <tr key={ri} style={{ borderTop: ri === 0 ? 'none' : '1px solid var(--line)', background: row.head ? 'oklch(0.99 0.01 75)' : 'transparent' }}>
                <td style={{ padding: '11px 16px', fontSize: 12, fontWeight: row.head ? 600 : 500, color: 'var(--ink-2)' }}>{row.label}</td>
                {W_PLANS.map(p => (
                  <td key={p.id} style={{
                    padding: '11px 12px', textAlign: 'center', borderInlineStart: '1px solid var(--line)',
                    background: p.highlight ? 'oklch(0.99 0.01 270)' : 'transparent',
                    fontSize: row.head ? 13 : 12,
                    fontWeight: row.head || row.strong ? 700 : 500,
                    color: row.head ? W_COIN_DEEP : (row.strong ? 'oklch(0.4 0.13 230)' : 'var(--ink)'),
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}>{row.fn(p.monthlyCredits)}</td>
                ))}
              </tr>
            ))}
            <tr style={{ borderTop: '1px solid var(--line)', background: 'oklch(0.99 0.01 175)' }}>
              <td style={{ padding: '11px 16px', fontSize: 12, fontWeight: 500 }}>🎧 ردود خدمة العملاء</td>
              {W_PLANS.map(p => (
                <td key={p.id} style={{ padding: '11px 12px', textAlign: 'center', borderInlineStart: '1px solid var(--line)', fontSize: 12, fontWeight: 600, color: 'oklch(0.42 0.16 145)' }}>بلا حدود</td>
              ))}
            </tr>
          </tbody>
        </table>
      </WCard>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ flex: '1 1 240px', padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 10, fontSize: 11.5, color: 'var(--accent)', lineHeight: 1.7 }}>
          💡 <b>مثال باقة النمو:</b> 5,000 نقطة = 500 ر.س قيمة — تغطّي ~1,428 رسالة تسويقيّة أو ~100,000 بريد إلكتروني.
        </div>
        <div style={{ flex: '1 1 240px', padding: '12px 14px', background: 'oklch(0.97 0.04 145)', borderRadius: 10, fontSize: 11.5, color: 'oklch(0.4 0.14 145)', lineHeight: 1.7 }}>
          ✅ النقاط مرنة: اصرفها على أي قناة تريد — واتساب أو بريد — حسب حملتك. وتجدّد شهريّاً.
        </div>
      </div>

      {/* Competitor comparison */}
      <WCompetitorSection />

      {/* CTA to simulator */}
      <div style={{ textAlign: 'center', padding: '8px 0 8px' }}>
        <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--muted)' }}>جرّب الأرقام على حملتك الفعليّة</p>
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-2)' }}>افتح تبويب <b>«المحفظة والاستهلاك»</b> واستخدم محاكي التكلفة لحساب أي حملة قبل إرسالها.</p>
      </div>
    </div>
  );
}

// =============================================================================
// Competitor comparison (positioning + sending values)
// =============================================================================
const W_PLAT_COMPARE = {
  cols: ['محور', 'Circle', 'Mighty Networks', 'WATI', 'Brevo'],
  rows: [
    { f: 'إدارة مجتمعات ومساحات',          v: [true, true, true, false, false] },
    { f: 'فعاليّات + تذاكر QR + شهادات',    v: [true, false, false, false, false] },
    { f: 'واتساب رسمي (Business API)',      v: [true, false, false, true, 'جزئي'] },
    { f: 'بريد إلكتروني / حملات',           v: [true, 'جزئي', 'جزئي', false, true] },
    { f: 'إرسال من حساب العميل (BYO)',      v: [true, false, false, false, false] },
    { f: 'عربي RTL كامل + لهجة محليّة',      v: [true, false, false, 'جزئي', 'جزئي'] },
    { f: 'توافق PDPL + فواتير ZATCA',       v: [true, false, false, false, false] },
    { f: 'علامة بيضاء كاملة',               v: [true, 'باقة عُليا', 'محدود', true, 'محدود'] },
    { f: 'يبدأ من (شهريّاً)',                v: ['199 ر.س', '~$89', '~$41', '~$49', '~$9'] },
  ],
};
const W_SEND_COMPARE = {
  cols: ['محور', 'WATI / BSP واتساب', 'Brevo', 'Circle / Mighty'],
  rows: [
    { f: 'واتساب تسويقي (السعودية)',  v: ['0.35 ر.س', 'تكلفة Meta + رسوم منصّة', 'غير مدعوم', 'غير مدعوم'] },
    { f: 'واتساب خدمي / مصادقة',      v: ['0.15 ر.س', 'تكلفة Meta + رسوم', 'غير مدعوم', 'غير مدعوم'] },
    { f: 'رد خدمة العملاء (24 ساعة)',  v: ['مجاناً', 'مجاناً (Meta)', '—', '—'] },
    { f: 'بريد لكل 1,000 رسالة',       v: ['~5 ر.س', '—', 'ضمن الباقة', 'محدود / إضافي'] },
    { f: 'رسوم المنصّة الشهريّة',       v: ['من 199 ر.س', 'من ~$49', 'من ~$9', 'من ~$41'] },
  ],
};

function WPlatCell({ v }) {
  if (v === true) return <span style={{ color: 'oklch(0.55 0.15 145)', fontSize: 14, fontWeight: 700 }}>✓</span>;
  if (v === false) return <span style={{ color: '#cfcdc6', fontSize: 13 }}>✕</span>;
  return <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>{v}</span>;
}

function WPlatTable({ data }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
        <thead>
          <tr style={{ background: 'var(--warm)' }}>
            <th style={{ padding: '11px 14px', textAlign: 'start', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', minWidth: 180 }}>المقارنة</th>
            {data.cols.map((c, i) => (
              <th key={c} style={{
                padding: '11px 10px', textAlign: 'center', fontSize: 12, fontWeight: 700,
                color: i === 0 ? 'var(--accent)' : 'var(--ink-2)',
                background: i === 0 ? 'var(--accent-soft)' : 'transparent',
                borderInlineStart: '1px solid var(--line)',
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, ri) => (
            <tr key={ri} style={{ borderTop: '1px solid var(--line)' }}>
              <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 500 }}>{r.f}</td>
              {r.v.map((v, vi) => (
                <td key={vi} style={{
                  padding: '10px', textAlign: 'center', borderInlineStart: '1px solid var(--line)',
                  background: vi === 0 ? 'oklch(0.985 0.012 270)' : 'transparent',
                }}><WPlatCell v={v} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WCompetitorSection() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 14px' }}>
        <span style={{ fontSize: 20 }}>🏁</span>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>محور مقابل المنصّات المنافسة</h2>
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7 }}>
        أغلب المنصّات تتخصّص في جانب واحد: <b>Circle / Mighty</b> للمجتمعات، <b>WATI</b> للواتساب، <b>Brevo</b> للبريد.
        محور يجمعها في منصّة عربيّة واحدة متوافقة مع المنظومة السعوديّة.
      </p>
      <WCard style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
        <WPlatTable data={W_PLAT_COMPARE} />
      </WCard>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 12px' }}>
        <span style={{ fontSize: 18 }}>💸</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>مقارنة قيم الإرسال</h3>
      </div>
      <WCard style={{ padding: 0, overflow: 'hidden', marginBottom: 10 }}>
        <WPlatTable data={W_SEND_COMPARE} />
      </WCard>
      <div style={{ padding: '12px 14px', background: 'oklch(0.97 0.04 75)', borderRadius: 10, fontSize: 11, color: 'oklch(0.42 0.13 60)', lineHeight: 1.7, marginBottom: 28 }}>
        ⚠ أرقام المنافسين تقديريّة لأغراض المقارنة فقط (أبريل 2026) وقد تختلف حسب الباقة والدولة. أسعار محور دقيقة ومؤكّدة.
      </div>
    </div>
  );
}

// =============================================================================
// Shared primitives
// =============================================================================
function WTab({ on, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: on ? 600 : 500,
      background: on ? '#fff' : 'transparent', color: on ? 'var(--accent)' : 'var(--muted)',
      boxShadow: on ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', fontFamily: 'inherit', cursor: 'pointer',
    }}>{children}</button>
  );
}

function WCard({ children, style }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 18, padding: 22, ...style }}>
      {children}
    </div>
  );
}

function WCoin({ sm, muted }) {
  const s = sm ? 24 : 34;
  return (
    <span style={{
      width: s, height: s, borderRadius: '50%', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: muted ? 'var(--line-2)' : `linear-gradient(135deg, ${W_COIN}, ${W_COIN_DEEP})`,
      color: '#fff', fontSize: sm ? 11 : 16, fontWeight: 800,
    }}>ن</span>
  );
}

function wBtn(kind, extra = {}) {
  const base = { borderRadius: 11, fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', border: 'none', padding: '11px 18px', fontSize: 13, ...extra };
  const kinds = {
    primary: { background: 'var(--accent)', color: '#fff' },
    dark:    { background: 'var(--ink)', color: '#fff' },
    light:   { background: '#fff', color: 'var(--accent)' },
    soft:    { background: 'var(--warm)', color: 'var(--ink-2)' },
    outline: { background: '#fff', color: 'var(--ink-2)', border: '1px solid var(--line-2)' },
  };
  return { ...base, ...(kinds[kind] || kinds.primary) };
}

function wNowLabel() {
  const n = new Date();
  return n.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }) + ' · ' + n.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

// Toast (singleton via window.__wToast)
function WToast() {
  const [msg, setMsg] = useStateW('');
  const [show, setShow] = useStateW(false);
  const timer = useRefW(null);
  useEffectW(() => {
    window.__wToast = (text) => {
      setMsg(text); setShow(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), 3200);
    };
    return () => { window.__wToast = null; };
  }, []);
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${show ? 0 : 12}px)`,
      background: 'var(--ink)', color: '#fff', padding: '12px 22px', borderRadius: 12,
      fontSize: 13, fontWeight: 600, zIndex: 200, pointerEvents: 'none',
      opacity: show ? 1 : 0, transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 16px 40px -12px rgba(0,0,0,0.4)',
    }}>
      <span style={{ color: 'oklch(0.7 0.13 270)' }}>✓</span>{msg}
    </div>
  );
}

// =============================================================================
// =============================================================================
// Downloadable report (print-to-PDF) — share with pricing specialists for review
// =============================================================================
function wReportRows(g) {
  return g.rows.map(r => {
    const cells = r.v.map(v => {
      if (v === true) return '<td class="c ok">✓</td>';
      if (v === false) return '<td class="c no">—</td>';
      return `<td class="c">${v}</td>`;
    }).join('');
    return `<tr><td class="f">${r.f}</td>${cells}</tr>`;
  }).join('');
}

function wOpenReport() {
  const w = window.open('', '_blank', 'width=1000,height=1200');
  if (!w) return;
  const date = new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

  const planCards = W_PLANS.map(p => `
    <div class="pcard ${p.highlight ? 'hl' : ''}">
      ${p.badge ? `<div class="pbadge">${p.badge}</div>` : ''}
      <div class="pname">${p.name} <span class="pen">${p.en}</span></div>
      <div class="pdesc">${p.desc}</div>
      <div class="pprice">${wFmt(p.priceMonthly)} <span>ر.س / شهر</span></div>
      <div class="pyear">${wFmt(p.priceYearly)} ر.س سنوياً · وفّر 20٪</div>
      <div class="pcredits">🪙 ${wFmt(p.monthlyCredits)} نقطة مجانية / شهر</div>
      <div class="pbest">${p.bestFor}</div>
      <ul>${p.rows.map(r => `<li class="${r.ok ? 'ok' : 'no'}">${r.ok ? '✓' : '✕'} ${r.t}</li>`).join('')}</ul>
    </div>`).join('');

  const compare = W_COMPARE.map(g => `
    <tr class="grp"><td colspan="4">${g.title}</td></tr>
    ${wReportRows(g)}`).join('');

  const waGuide = W_WA_GUIDE.map(g => {
    const margin = g.free ? '—' : Math.round((1 - g.meta / g.sell) * 100) + '%';
    return `<tr>
      <td class="f">${g.emoji} ${g.name}</td>
      <td>${g.what}</td>
      <td class="c">${g.meta > 0 ? g.meta.toFixed(2) : '—'}</td>
      <td class="c">${g.sell > 0 ? g.sell.toFixed(2) : 'مجاناً'}</td>
      <td class="c b">${g.free ? '0' : g.points}</td>
      <td class="c">${margin}</td>
    </tr>`;
  }).join('');

  const capacity = W_PLANS.map(p => `
    <tr>
      <td class="f">${p.name}</td>
      <td class="c b">${wFmt(p.monthlyCredits)}</td>
      <td class="c">${wFmt(p.monthlyCredits * 0.1)} ر.س</td>
      <td class="c">~${wFmt(p.monthlyCredits / 3.5)}</td>
      <td class="c">~${wFmt(p.monthlyCredits / 1.5)}</td>
      <td class="c">~${wFmt(p.monthlyCredits * 20)}</td>
    </tr>`).join('');

  const platRow = (d) => `<tr>${d.map((v,i)=>{
      const cell = v===true?'<span class="ok">✓</span>':v===false?'<span class="no">✕</span>':v;
      return i===0?`<td class="f">${cell}</td>`:`<td class="c">${cell}</td>`;
    }).join('')}</tr>`;
  const platHead = (cols) => `<tr><th>${cols[0]}</th>${cols.slice(1).map(c=>`<th style="text-align:center">${c}</th>`).join('')}</tr>`;
  const platTable = (data) => `<table><thead>${platHead(['المقارنة',...data.cols])}</thead><tbody>${data.rows.map(r=>platRow([r.f,...r.v])).join('')}</tbody></table>`;
  const compPlat = platTable(W_PLAT_COMPARE);
  const sendComp = platTable(W_SEND_COMPARE);
  const planHeads = W_PLANS.map(p=>`<th style="text-align:center">${p.name}</th>`).join('');

  w.document.write(`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
  <title>تقرير نموذج التسعير — محور</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
    *{box-sizing:border-box}
    body{font-family:'IBM Plex Sans Arabic',system-ui,sans-serif;color:#14130f;line-height:1.7;margin:0;padding:40px;max-width:1000px;margin:0 auto;background:#fff}
    .brow{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #14130f;padding-bottom:14px;margin-bottom:8px}
    .brand{font-size:18px;font-weight:700}.brand small{font-size:10px;color:#8a877f;letter-spacing:2.5px;margin-inline-start:8px}
    .tag{font-size:10px;padding:4px 10px;background:#3d3a8c;color:#fff;border-radius:999px;letter-spacing:1px}
    h1{font-size:26px;margin:14px 0 2px;letter-spacing:-0.5px}
    .sub{color:#8a877f;font-size:12.5px;margin-bottom:22px}
    .intro{background:#f3f1fb;border-radius:12px;padding:16px;font-size:13px;margin-bottom:26px}
    h2{font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#3d3a8c;border-bottom:1px solid #e8e5dd;padding-bottom:7px;margin:30px 0 14px}
    .plans{display:grid;grid-template-columns:repeat(3,1fr);gap:12}
    .pcard{border:1px solid #e8e5dd;border-radius:12px;padding:16px;page-break-inside:avoid}
    .pcard.hl{border:2px solid #3d3a8c}
    .pbadge{display:inline-block;background:#3d3a8c;color:#fff;font-size:9px;font-weight:600;padding:3px 9px;border-radius:999px;margin-bottom:6px}
    .pname{font-size:16px;font-weight:600}.pen{font-size:9px;color:#8a877f;letter-spacing:1.5px}
    .pdesc{font-size:11px;color:#8a877f;margin:4px 0 10px;min-height:30px}
    .pprice{font-size:24px;font-weight:700}.pprice span{font-size:11px;color:#8a877f;font-weight:500}
    .pyear{font-size:10.5px;color:#1f8a5b;margin-bottom:10px}
    .pcredits{font-size:11.5px;font-weight:600;color:#9a6a1a;background:#fdf6e8;border:1px solid #f0e3c8;border-radius:8px;padding:7px 9px;margin-bottom:8px}
    .pbest{font-size:10.5px;color:#6b6a64;margin-bottom:10px}
    .pcard ul{list-style:none;padding:0;margin:0}
    .pcard li{font-size:11px;margin-bottom:5px;color:#3a3832}
    .pcard li.no{color:#a8a7a0}
    table{width:100%;border-collapse:collapse;font-size:11.5px;margin-bottom:8px}
    th{background:#faf7f0;padding:9px 10px;text-align:start;font-weight:600;font-size:10.5px;color:#6b6a64;border:1px solid #e8e5dd}
    td{padding:8px 10px;border:1px solid #eceae4}
    td.f{font-weight:500}td.c{text-align:center}td.b{font-weight:700;color:#9a6a1a}
    td.ok{color:#1f8a5b;font-weight:700;text-align:center}td.no{color:#c8c7c0;text-align:center}
    tr.grp td{background:#f3f1fb;font-weight:700;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#3d3a8c}
    span.ok{color:#1f8a5b;font-weight:700}span.no{color:#cfcdc6}
    .note{background:#fdf6e8;border:1px solid #f0e3c8;border-radius:10px;padding:14px;font-size:12px;margin:14px 0}
    .qbox{background:#f7f6f2;border-radius:12px;padding:18px;margin-top:10px}
    .qbox ol{margin:0;padding-inline-start:20px;font-size:12.5px}.qbox li{margin-bottom:7px}
    .foot{margin-top:36px;padding-top:14px;border-top:1px solid #e8e5dd;font-size:10.5px;color:#8a877f;display:flex;justify-content:space-between}
    @media print{body{padding:18px}.tag{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
    <div class="brow"><div class="brand">محور <small>MHWAR</small></div><div class="tag">مسوّدة للمراجعة · داخلي</div></div>
    <h1>تقرير نموذج التسعير والباقات</h1>
    <div class="sub">اشتراك متدرّج + محفظة نقاط · العملة: الريال السعودي (غير شامل ضريبة القيمة المضافة) · ${date}</div>
    <div class="intro"><b>عن منصّة محور:</b> «محور Mhwar» هي مساحة العمل المتكاملة لإدارة المجتمعات الرقميّة وفعاليّاتها. نُنهي تشتّت الأدوات بدمج بناء المجتمع، وإدارة التذاكر، وأتمتة التواصل في نظام بيئيّ واحد — فبدلاً من اشتراكاتٍ متفرّقة، تُدير مجتمعك وتتواصل معه مباشرةً عبر القناة الأقوى (واتساب) بنظام فوترة هجين وعادل: اشتراك ثابت للميزات، ومحفظة نقاط مرنة تدفع فيها مقابل رسائلك الاستهلاكيّة فقط. محور هي خندقك التقنيّ لتحويل المتابعين إلى مجتمعٍ حقيقيّ وإيراداتٍ مستدامة.</div>
    <div class="intro"><b>ملخّص النموذج:</b> ثلاث باقات (المجتمع · النمو · المؤسّسة) مع تجربة مجانيّة 14 يوم. كل باقة تشمل رصيداً شهريّاً مجانيّاً من النقاط (1 نقطة = 0.10 ر.س)، وما يتجاوزه يُخصم من محفظة النقاط حسب نوع الرسالة. تكاليف الإرسال مبنيّة على أسعار Meta للسعودية (واتساب) و Amazon SES (البريد).</div>

    <h2>الباقات</h2>
    <div class="plans">${planCards}</div>

    <h2>جدول المقارنة الكامل</h2>
    <table><thead><tr><th>الميزة</th>${planHeads}</tr></thead><tbody>${compare}</tbody></table>

    <h2>دليل تكاليف الإرسال (واتساب)</h2>
    <table><thead><tr><th>النوع</th><th>الاستخدام</th><th style="text-align:center">تكلفتنا (ر.س)</th><th style="text-align:center">سعرك (ر.س)</th><th style="text-align:center">نقاط</th><th style="text-align:center">الهامش</th></tr></thead><tbody>${waGuide}
      <tr><td class="f">✉️ بريد إلكتروني (Amazon SES)</td><td>نشرات · تأكيدات · تنبيهات</td><td class="c">0.0004</td><td class="c">0.005</td><td class="c b">0.05</td><td class="c">92%</td></tr>
    </tbody></table>

    <h2>سعة النقاط المجانيّة لكل باقة</h2>
    <table><thead><tr><th>الباقة</th><th style="text-align:center">النقاط/شهر</th><th style="text-align:center">قيمتها</th><th style="text-align:center">واتساب تسويقي</th><th style="text-align:center">واتساب خدمي</th><th style="text-align:center">بريد إلكتروني</th></tr></thead><tbody>${capacity}</tbody></table>
    <div class="note">ℹ السعة تختلف جذريّاً حسب القناة: البريد رخيص جدّاً (0.05 نقطة) مقابل الواتساب التسويقي (3.5 نقطة). ردود خدمة العملاء داخل نافذة 24 ساعة مجانيّة بلا حدود.</div>

    <h2>محور مقابل المنصّات المنافسة</h2>
    ${compPlat}
    <h2>مقارنة قيم الإرسال</h2>
    ${sendComp}
    <div class="note">⚠ أرقام المنافسين تقديريّة لأغراض المقارنة فقط (أبريل 2026) وقد تختلف حسب الباقة والدولة. أسعار محور دقيقة ومؤكّدة.</div>

    <h2>استراتيجية مبيعات الشركات (Enterprise)</h2>
    <div class="intro" style="background:#f0f7f3"><b>دليل إرشاديّ لفريق المبيعات:</b> باقة «المؤسّسة» ليست بيعاً ذاتيّاً (Self-serve) — بل تُغلق عبر تفاوضٍ مباشر مع الكيانات الكبرى (الجهات الحكوميّة، الجامعات، الهيئات المهنيّة). زر «تواصل معنا» يفتح محادثة، لا صفحة دفع. القيمة هنا في الثقة والامتثال، لا في السعر فقط.</div>
    <table><thead><tr><th>الركيزة</th><th>ما نقدّمه</th><th>لماذا يهمّ العميل المؤسّسي</th></tr></thead><tbody>
      <tr><td class="f">مدير حساب مخصّص</td><td>نقطة تواصل بشريّة واحدة + قناة Slack/واتساب مباشرة</td><td>الكيانات الكبرى لا تقبل دعماً عبر التذاكر فقط؛ تريد مسؤولاً باسمٍ ووجه.</td></tr>
      <tr><td class="f">اتفاقيّة مستوى خدمة (SLA)</td><td>ضمان جاهزيّة 99.9٪ + أزمنة استجابة تعاقديّة</td><td>متطلّب إلزاميّ في كرّاسات الشروط الحكوميّة والمناقصات.</td></tr>
      <tr><td class="f">الدخول الموحّد (SSO) والأمان</td><td>SAML/OIDC · سجلّ تدقيق بلا حدود · صلاحيّات دقيقة</td><td>تكامل مع أنظمة الهويّة المؤسّسيّة ومتطلّبات الأمن السيبراني.</td></tr>
      <tr><td class="f">فوترة عبر أوامر الشراء (PO)</td><td>عقود سنويّة · أوامر شراء · توافق ZATCA كامل</td><td>الإدارات الماليّة الحكوميّة تعمل بأوامر الشراء لا ببطاقات الائتمان.</td></tr>
      <tr><td class="f">امتثال وإقامة بيانات</td><td>اتفاقيّة معالجة بيانات (DPA) · توافق PDPL · خيار استضافة داخل المملكة</td><td>شرط قانونيّ لأيّ جهة تتعامل مع بيانات مواطنين.</td></tr>
    </tbody></table>
    <div class="note">📌 مسار الإغلاق المقترح: تأهيل ← عرض توضيحيّ ← إثبات مفهوم (POC) ← مراجعة قانونيّة/أمنيّة ← عرض سعر مخصّص ← توقيع. متوسّط دورة البيع: 2–12 أسبوعاً حسب الجهة. السعر يبدأ من 25,000 ر.س سنويّاً ويُخصّص حسب عدد الأعضاء ومتطلّبات الامتثال.</div>

    <h2>اتفاقيّة مستوى الخدمة (SLA) — باقة المؤسّسة</h2>
    <div class="intro"><b>الالتزام الأساسي:</b> تضمن «محور» جاهزيّة شهريّة لا تقلّ عن <b>99.9٪</b> لخدمات المنصّة الأساسيّة (الوصول للوحة التحكّم، استقبال التسجيلات، تشغيل الفعاليّات). تُحتسب الجاهزيّة شهريّاً وتستثني فترات الصيانة المجدولة المُعلَن عنها مسبقاً (بإشعار 72 ساعة، خارج أوقات الذروة).</div>

    <h3 style="font-size:13px;margin:18px 0 8px;color:#444">أزمنة الاستجابة والحلّ حسب درجة الخطورة</h3>
    <table><thead><tr><th>الدرجة</th><th>التعريف</th><th>زمن الاستجابة</th><th>زمن الحلّ المستهدف</th></tr></thead><tbody>
      <tr><td class="f">حرِجة (P1)</td><td>توقّف كامل للمنصّة أو تعذّر الإرسال لكل المستخدمين</td><td>خلال 30 دقيقة</td><td>خلال 4 ساعات</td></tr>
      <tr><td class="f">عالية (P2)</td><td>تعطّل ميزة أساسيّة دون بديل (تذاكر، تسجيل، فوترة)</td><td>خلال ساعتين</td><td>خلال يوم عمل واحد</td></tr>
      <tr><td class="f">متوسّطة (P3)</td><td>خلل جزئيّ مع وجود حلّ بديل مؤقّت</td><td>خلال 8 ساعات عمل</td><td>خلال 3 أيّام عمل</td></tr>
      <tr><td class="f">منخفضة (P4)</td><td>استفسار أو طلب تحسين أو خلل تجميليّ</td><td>خلال يوم عمل</td><td>حسب خطّة الإصدار</td></tr>
    </tbody></table>

    <h3 style="font-size:13px;margin:18px 0 8px;color:#444">تعويضات الجاهزيّة (Service Credits)</h3>
    <table><thead><tr><th>الجاهزيّة الشهريّة المُحقّقة</th><th>التعويض (من الاشتراك الشهري)</th></tr></thead><tbody>
      <tr><td class="f">أقل من 99.9٪ وحتى 99.0٪</td><td>رصيد 10٪</td></tr>
      <tr><td class="f">أقل من 99.0٪ وحتى 95.0٪</td><td>رصيد 25٪</td></tr>
      <tr><td class="f">أقل من 95.0٪</td><td>رصيد 50٪</td></tr>
    </tbody></table>
    <div class="note">يُطلب التعويض خلال 30 يوماً من الحادثة، ويُضاف كرصيد على الفاتورة التالية (لا يُصرف نقداً). سقف التعويض السنويّ: شهر اشتراك واحد.</div>

    <h3 style="font-size:13px;margin:18px 0 8px;color:#444">قنوات الدعم والتصعيد</h3>
    <table><thead><tr><th>القناة</th><th>التغطية</th><th>الإتاحة</th></tr></thead><tbody>
      <tr><td class="f">مدير حساب مخصّص</td><td>نقطة تواصل بشريّة + قناة Slack/واتساب مباشرة</td><td>أيّام العمل</td></tr>
      <tr><td class="f">خطّ الطوارئ (P1)</td><td>هاتف/واتساب للحوادث الحرِجة فقط</td><td>24×7</td></tr>
      <tr><td class="f">البريد والتذاكر</td><td>كل الدرجات مع تتبّع حالة</td><td>24×7 استقبال</td></tr>
      <tr><td class="f">مراجعات أعمال دوريّة</td><td>تقرير جاهزيّة وأداء + خارطة طريق</td><td>ربع سنويّة</td></tr>
    </tbody></table>

    <h3 style="font-size:13px;margin:18px 0 8px;color:#444">الاستثناءات</h3>
    <div class="note">لا يشمل ضمان الجاهزيّة: الصيانة المجدولة المُعلَنة · أعطال خارجة عن سيطرة محور (مزوّدو Meta / AWS / مشغّلو الاتصالات) · سوء استخدام العميل أو تجاوز الحدود التعاقديّة · القوّة القاهرة. تُقاس الحوادث عبر منصّة مراقبة مستقلّة وتُوثّق في تقرير ما بعد الحادثة (RCA) خلال 5 أيّام عمل.</div>

    <h2>أسئلة موجّهة للمختصّين</h2>
    <div class="qbox"><ol>
      <li>هل توزيع المميزات على الباقات منطقيّ؟ وهل هناك ميزة في المستوى الخطأ؟</li>
      <li>هل الفجوة السعريّة بين الباقات (199 / 399 / 799) مناسبة للسوق السعودي؟</li>
      <li>هل هوامش رسائل الواتساب (49–67٪) كافية ومستدامة مع تقلّب أسعار Meta؟</li>
      <li>هل نموذج «النقاط» واضح للعميل، أم يُفضّل عرض السعر بالريال مباشرة؟</li>
      <li>هل الرصيد المجاني الشهري (500 / 1,200 / 3,000) سخيّ بشكل يهدّد الربحيّة؟</li>
      <li>هل إزالة الباقة المجانيّة (والاكتفاء بتجربة 14 يوم) قرار صحيح؟</li>
      <li>هل تسلسل BYO (بريد جهتك في النمو · واتساب رقمك في الأعمال) منطقيّ كحافز ترقية؟</li>
    </ol></div>

    <div class="foot"><span>محور — نموذج التسعير · مسوّدة v1</span><span>${date}</span></div>
    <script>window.onload=()=>setTimeout(()=>window.print(),500)</script>
  </body></html>`);
  w.document.close();
}

Object.assign(window, { MhwarWalletSimulator, wOpenReport });
