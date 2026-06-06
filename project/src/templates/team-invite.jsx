// Team Invite — invite a collaborator to manage events

const TeamInviteTemplate = ({ data }) => {
  const d = data || {};
  const inviterName = d.inviterName || 'سارة الزهراني';
  const orgName = d.orgName || 'مجتمع ثراء الشبابي';
  const role = d.role || 'محرّر';

  return (
    <EmailShell
      from={`محور <invites@mhwar.sa>`}
      subject={d.subject || `${inviterName} دعتك للانضمام إلى ${orgName}`}
    >
      <PlatformHeader />

      <div style={{ padding: '40px 28px 16px', textAlign: 'center' }}>
        {/* Overlapping avatars */}
        <div style={{
          position: 'relative',
          width: 92, height: 56,
          margin: '0 auto 20px',
        }}>
          <div style={{
            position: 'absolute', insetInlineStart: 0, top: 0,
            width: 56, height: 56, borderRadius: '50%',
            background: `oklch(0.7 0.13 35)`,
            color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20,
            border: '3px solid #fff',
            zIndex: 1,
          }}>س</div>
          <div style={{
            position: 'absolute', insetInlineEnd: 0, top: 0,
            width: 56, height: 56, borderRadius: '50%',
            background: `oklch(0.5 0.14 245)`,
            color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20,
            border: '3px solid #fff',
          }}>
            <IconUser size={22}/>
          </div>
        </div>

        <h1 style={{
          fontSize: 24, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.3, lineHeight: 1.35
        }}>
          {inviterName} تدعوك للانضمام إلى فريقها
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--muted)', lineHeight: 1.75,
          margin: '0 auto', maxWidth: 360, textWrap: 'pretty'
        }}>
          دعتك للانضمام إلى مساحة عمل <strong style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{orgName}</strong> على محور، للتعاون في إدارة الفعاليات.
        </p>
      </div>

      {/* Permissions card */}
      <div style={{ padding: '24px 28px 8px' }}>
        <div style={{
          padding: '18px 18px 6px',
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 12,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>الدور</div>
            <div style={{
              padding: '4px 10px', borderRadius: 999,
              background: 'var(--accent-soft)', color: 'var(--accent)',
              fontSize: 12, fontWeight: 600,
            }}>{role}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>ما يمكنك فعله</div>
          {[
            { t: 'إنشاء الفعاليات وتعديلها', on: true },
            { t: 'إرسال الدعوات والتذكيرات', on: true },
            { t: 'الاطّلاع على التحليلات', on: true },
            { t: 'إدارة الفريق والفوترة', on: false },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderTop: i > 0 ? '1px solid var(--line)' : 'none',
              fontSize: 13,
              color: p.on ? 'var(--ink-2)' : 'var(--muted)',
            }}>
              <span style={{
                color: p.on ? 'oklch(0.55 0.15 155)' : 'var(--line-2)',
                flexShrink: 0,
              }}>
                {p.on ? <IconCheck size={14} stroke={2.5}/> : <IconX size={14}/>}
              </span>
              <span>{p.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 28px 8px' }}>
        <PrimaryBtn color="var(--accent)">قبول الدعوة · انضمّ إلى الفريق</PrimaryBtn>
        <div style={{
          marginTop: 10, fontSize: 12, color: 'var(--muted)',
          textAlign: 'center', lineHeight: 1.7,
        }}>
          الدعوة صالحة لمدة 7 أيام · <a href="#" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>الاعتذار عن الدعوة</a>
        </div>
      </div>

      <div style={{ padding: '16px 28px 32px' }}>
        <div style={{
          padding: '14px 16px',
          background: 'var(--warm)', borderRadius: 10,
          fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.75,
        }}>
          جديد على محور؟ سيُنشأ حسابك تلقائياً عند قبول الدعوة · استخدم نفس بريدك الإلكتروني لتسجيل الدخول.
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.TeamInviteTemplate = TeamInviteTemplate;
