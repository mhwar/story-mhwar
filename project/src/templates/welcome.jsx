// 6. Welcome — new user onboarding on Mhwar
// Mhwar-branded

const WelcomeTemplate = ({ data }) => {
  const d = data || {};
  return (
    <EmailShell
      from="محور <hello@mhwar.sa>"
      subject={d.subject || 'أهلاً بك في محور · ابدأ من هنا'}
    >
      <PlatformHeader />

      <div style={{ padding: '40px 28px 16px' }}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 14
        }}>ابدأ من هنا</div>

        <h1 style={{
          fontSize: 30, fontWeight: 700, margin: '0 0 14px',
          letterSpacing: -0.6, lineHeight: 1.25
        }}>
          أهلاً {d.recipientName || 'محمد'}،<br/>
          سعداء بانضمامك إلى محور
        </h1>
        <p style={{
          fontSize: 15, lineHeight: 1.85, color: 'var(--ink-2)',
          margin: 0, textWrap: 'pretty'
        }}>
          محور منصّة متكاملة لإدارة فعالياتك · من إرسال الدعوات وتأكيد الحضور، إلى التذكير والمتابعة بعد الفعالية · في مكان واحد.
        </p>
      </div>

      {/* Getting started checklist */}
      <div style={{ padding: '28px 28px 8px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase' }}>
          خطواتك الأولى
        </div>
        {[
          { n: '1', t: 'أنشئ فعاليتك الأولى', s: 'ابدأ من قالب جاهز أو شكّلها من الصفر', done: true },
          { n: '2', t: 'خصّص هويتك', s: 'ارفع شعارك وألوانك لتظهر في دعواتك' },
          { n: '3', t: 'ادعُ جمهورك', s: 'استورد جهات اتصالك أو شارك رابط التسجيل' },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', marginBottom: 8,
            border: '1px solid var(--line)',
            borderRadius: 12,
            background: s.done ? 'var(--accent-soft)' : '#fff',
            opacity: s.done ? 0.9 : 1
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: s.done ? 'var(--accent)' : '#fff',
              border: s.done ? 'none' : '1px solid var(--line-2)',
              color: s.done ? '#fff' : 'var(--ink-2)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600, flexShrink: 0
            }}>
              {s.done ? <IconCheck size={14} stroke={2.5}/> : s.n}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500,
                textDecoration: s.done ? 'line-through' : 'none',
                color: s.done ? 'var(--muted)' : 'var(--ink)'
              }}>{s.t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{s.s}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 28px 28px' }}>
        <PrimaryBtn color="var(--accent)">افتح لوحة التحكم</PrimaryBtn>
        <div style={{
          marginTop: 18, padding: '16px', borderRadius: 12,
          background: 'var(--warm)',
          display: 'flex', alignItems: 'flex-start', gap: 12
        }}>
          <IconSparkle size={18} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }}/>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            <strong style={{ fontWeight: 600 }}>نصيحة:</strong> جرّب فعالية صغيرة أولاً لتشعر بالمنصّة · يمكنك نسخها لاحقاً لأي فعالية أكبر.
          </div>
        </div>
      </div>

      <MhwarFooterCTA />
    </EmailShell>
  );
};

window.WelcomeTemplate = WelcomeTemplate;
