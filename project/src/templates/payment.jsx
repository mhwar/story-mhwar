// 8. Payment Confirmation — invoice/receipt
// Mhwar-branded

const PaymentTemplate = ({ data }) => {
  const d = data || {};

  return (
    <EmailShell
      from="محور <billing@mhwar.sa>"
      subject={d.subject || 'إيصال دفعك · MHW-2041'}
    >
      <PlatformHeader />

      <div style={{ padding: '36px 28px 20px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'oklch(0.95 0.06 150)', color: 'oklch(0.4 0.12 150)',
          fontSize: 12, fontWeight: 500, marginBottom: 16
        }}>
          <IconCheckCircle size={13}/> تمّ استلام دفعتك
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 8px',
          letterSpacing: -0.4
        }}>
          شكراً لاشتراكك في محور
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: 0, lineHeight: 1.7 }}>
          خطة النموّ مُفعّلة · بدأت دورتك في 18 أبريل 2026
        </p>
      </div>

      {/* Receipt */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          border: '1px solid var(--line)', borderRadius: 14,
          overflow: 'hidden', background: '#fff'
        }}>
          {/* Summary rows */}
          <div style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14,
              display: 'flex', justifyContent: 'space-between' }}>
              <span>رقم الإيصال</span>
              <span className="mono">MHW-2041</span>
            </div>

            {[
              { k: 'خطة النموّ', v: 'اشتراك شهري', p: '249.00 ر.س' },
              { k: 'رسوم بوابة الدفع', v: 'مشمولة في الخطة', p: '0.00 ر.س' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                alignItems: 'baseline', gap: 8,
                padding: '12px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--line)'
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{r.k}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{r.v}</div>
                </div>
                <div className="mono" style={{ fontSize: 14 }}>{r.p}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '18px 22px',
            background: 'var(--warm)',
            borderTop: '1px solid var(--line)',
            display: 'grid', gridTemplateColumns: '1fr auto',
            alignItems: 'baseline'
          }}>
            <div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>الإجمالي المدفوع</div>
            </div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
              249.00 ر.س
            </div>
          </div>

          {/* Card info */}
          <div style={{
            padding: '16px 22px',
            borderTop: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: 13, color: 'var(--ink-2)'
          }}>
            <IconCreditCard size={18} style={{ color: 'var(--muted)' }}/>
            <span>بطاقة مدى تنتهي بـ <span className="mono">•• 4201</span></span>
            <span style={{ marginInlineStart: 'auto', fontSize: 12, color: 'var(--muted)' }}>
              18 أبريل · 3:42 مساءً
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 28px 12px', display: 'flex', gap: 8 }}>
        <GhostBtn block><IconDownload size={15}/> تنزيل الإيصال</GhostBtn>
        <GhostBtn block>إدارة الاشتراك</GhostBtn>
      </div>

      <div style={{
        padding: '20px 28px 28px', fontSize: 12.5,
        color: 'var(--muted)', lineHeight: 1.7, textAlign: 'center'
      }}>
        التجديد التلقائي في 18 مايو 2026 · يمكنك الإلغاء في أي وقت من إعدادات الفوترة.
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.PaymentTemplate = PaymentTemplate;
