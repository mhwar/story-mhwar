// Payment Failed — urgent subscription billing issue

const PaymentFailedTemplate = ({ data }) => {
  const d = data || {};
  return (
    <EmailShell
      from="محور <billing@mhwar.sa>"
      subject={d.subject || 'تعذّر تجديد اشتراكك · يحتاج انتباهك'}
    >
      <PlatformHeader />

      <div style={{ padding: '36px 28px 12px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px',
          background: 'oklch(0.95 0.06 25)',
          color: 'oklch(0.5 0.18 25)',
          borderRadius: 999,
          fontSize: 11, fontWeight: 600,
          marginBottom: 16,
        }}>
          يحتاج إلى إجراء منك
        </div>

        <h1 style={{
          fontSize: 24, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.3, lineHeight: 1.35
        }}>
          تعذّر تجديد اشتراكك
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.8,
          margin: '0 0 20px', textWrap: 'pretty'
        }}>
          مرحباً {d.recipientName || 'محمد'}، حاولنا اليوم تجديد اشتراكك في خطة <strong style={{ fontWeight: 600 }}>محور برو</strong> لكن البنك رفض العملية · حدّث طريقة الدفع خلال 3 أيام لتجنّب أي انقطاع في الخدمة.
        </p>

        {/* Invoice row */}
        <div style={{
          padding: '16px 18px',
          border: '1px solid oklch(0.9 0.05 25)',
          background: 'oklch(0.98 0.02 25)',
          borderRadius: 12,
          marginBottom: 18,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              INV-2026-08741
            </div>
            <div style={{
              padding: '3px 8px', borderRadius: 6,
              background: 'oklch(0.5 0.18 25)', color: '#fff',
              fontSize: 10, fontWeight: 600,
            }}>فشلت المحاولة</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>خطة محور برو · اشتراك شهري</div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 6,
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>299</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>ر.س</div>
          </div>
          <div style={{
            marginTop: 10, paddingTop: 10,
            borderTop: '1px solid oklch(0.9 0.05 25)',
            fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 10,
          }}>
            <IconCreditCard size={14}/>
            <span>Visa •••• 4821 · رصيد غير كافٍ</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 28px 24px' }}>
        <PrimaryBtn color="oklch(0.5 0.18 25)">تحديث طريقة الدفع</PrimaryBtn>
        <div style={{
          marginTop: 10, fontSize: 12, color: 'var(--muted)',
          textAlign: 'center',
        }}>
          سنُعيد المحاولة تلقائياً خلال 3 أيام
        </div>
      </div>

      <div style={{ padding: '8px 28px 32px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          ماذا يحدث إن لم يُجدّد؟
        </div>
        {[
          'فعالياتك الحالية تبقى نشطة حتّى نهاية فترة الاشتراك المدفوعة',
          'لن تتمكّن من إنشاء فعاليات جديدة أو إرسال دعوات جديدة',
          'تُحفظ بياناتك وجهات اتصالك لمدة 90 يوماً لاستئناف الخدمة في أي وقت',
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, padding: '8px 0',
            borderTop: i > 0 ? '1px solid var(--line)' : 'none',
            fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6,
          }}>
            <span style={{ color: 'var(--muted)', flexShrink: 0, marginTop: 4 }}>·</span>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.PaymentFailedTemplate = PaymentFailedTemplate;
