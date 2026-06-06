// 7. OTP — email verification code
// Mhwar-branded

const OtpTemplate = ({ data }) => {
  const d = data || {};
  const code = (d.otp || '4 7 2 9 0 6').split(' ');

  return (
    <EmailShell
      from="محور <noreply@mhwar.sa>"
      subject={d.subject || 'رمز تحقّقك: 472906'}
    >
      <PlatformHeader />

      <div style={{ padding: '44px 28px 12px', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20
        }}>
          <IconShield size={24}/>
        </div>

        <h1 style={{
          fontSize: 24, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.3
        }}>
          رمز تحقّقك
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--muted)', lineHeight: 1.7,
          margin: '0 auto', maxWidth: 340
        }}>
          أدخل الرمز التالي لإكمال تسجيل دخولك · صالح لمدّة 10 دقائق فقط.
        </p>
      </div>

      {/* Code blocks */}
      <div style={{ padding: '28px 28px 8px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 8, direction: 'ltr'
        }}>
          {code.map((c, i) => (
            <div key={i} style={{
              aspectRatio: '1 / 1',
              background: '#fff',
              border: '1px solid var(--line-2)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 600,
              fontFamily: 'IBM Plex Mono, monospace',
              color: 'var(--ink)'
            }}>{c}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 28px 12px', textAlign: 'center' }}>
        <PrimaryBtn color="var(--accent)" block={false}>
          نسخ الرمز
        </PrimaryBtn>
      </div>

      <div style={{ padding: '16px 28px 28px' }}>
        <div style={{
          padding: '14px 16px', background: 'var(--warm)',
          borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start'
        }}>
          <div style={{ color: 'var(--muted)', marginTop: 2, flexShrink: 0 }}>
            <IconShield size={16}/>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.7 }}>
            إن لم تطلب هذا الرمز · تجاهل الرسالة · فريق محور لا يطلبه منك أبداً.
          </div>
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.OtpTemplate = OtpTemplate;
