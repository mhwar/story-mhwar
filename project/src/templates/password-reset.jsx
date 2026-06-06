// Password Reset — Mhwar-branded security email

const PasswordResetTemplate = ({ data }) => {
  const d = data || {};
  return (
    <EmailShell
      from="محور <security@mhwar.sa>"
      subject={d.subject || 'إعادة تعيين كلمة المرور · تصلح لـ 30 دقيقة'}
    >
      <PlatformHeader />

      <div style={{ padding: '40px 28px 12px', textAlign: 'center' }}>
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
          إعادة تعيين كلمة المرور
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--muted)', lineHeight: 1.7,
          margin: '0 auto', maxWidth: 360
        }}>
          مرحباً {d.recipientName || 'محمد'}، وصلنا طلب لإعادة تعيين كلمة مرور حسابك في محور · اضغط الزرّ أدناه للمتابعة · الرابط صالح لمدّة 30 دقيقة.
        </p>
      </div>

      <div style={{ padding: '24px 28px 8px' }}>
        <PrimaryBtn color="var(--accent)">عيّن كلمة مرور جديدة</PrimaryBtn>
        <div className="mono" style={{
          marginTop: 16, padding: '12px 14px',
          background: 'var(--warm)', borderRadius: 10,
          fontSize: 11, color: 'var(--muted)',
          direction: 'ltr', textAlign: 'left',
          wordBreak: 'break-all', lineHeight: 1.6,
        }}>
          mhwar.sa/auth/reset?token=3f91a2c7b8d4e5f609a1b2c3d4e5f6
        </div>
      </div>

      <div style={{ padding: '20px 28px 32px' }}>
        <div style={{
          padding: '16px', background: '#fff',
          border: '1px solid var(--line)', borderRadius: 12,
          display: 'flex', gap: 12, alignItems: 'flex-start'
        }}>
          <div style={{ color: 'var(--muted)', flexShrink: 0, marginTop: 2 }}>
            <IconShield size={16}/>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>
            لم تطلب ذلك؟ تجاهل الرسالة، وستبقى كلمة مرورك كما هي · لا يتغيّر شيء ما لم تضغط الرابط.
          </div>
        </div>

        <div style={{
          marginTop: 14, fontSize: 11.5, color: 'var(--muted)',
          textAlign: 'center', lineHeight: 1.7,
        }}>
          طُلب من IP <span className="mono">192.168.1.4</span> · الرياض، السعودية
          <br/>
          اليوم · 3:42 مساءً
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.PasswordResetTemplate = PasswordResetTemplate;
