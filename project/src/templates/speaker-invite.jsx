// 11. Speaker / VIP Invite — private invite with personal details
// Client branded — has more weight/formality

const SpeakerInviteTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const clientName = d.clientName || 'مجتمع ثراء الشبابي';
  const parentOrg = d.parentOrg || 'هيئة تطوير منطقة عسير';

  return (
    <EmailShell
      from={`${clientName} · عبر ${parentOrg} <events@thraa.sa>`}
      subject={d.subject || 'دعوة للمشاركة كمتحدّث ضيف · ملتقى ثراء 2026'}
    >
      <ClientBrandRow name={clientName} parentOrg={parentOrg} hue={hue} />

      <div style={{ padding: '40px 28px 12px' }}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: `oklch(0.45 0.14 ${hue})`, marginBottom: 16
        }}>
          دعوة رسمية · متحدّث ضيف
        </div>
        <h1 style={{
          fontSize: 28, fontWeight: 700, margin: '0 0 14px',
          letterSpacing: -0.5, lineHeight: 1.25
        }}>
          صوتك يثري الحوار
        </h1>
        <p style={{
          fontSize: 15, lineHeight: 1.85, color: 'var(--ink-2)',
          margin: '0 0 24px', textWrap: 'pretty'
        }}>
          أستاذ {d.recipientName || 'محمد'}،<br/>
          يشرّفنا أن ندعوك للمشاركة كمتحدّث في {d.eventName || 'ملتقى ثراء السنوي 2026'} · نؤمن أنّ تجربتك ستُثري الحوار مع أكثر من 300 من الحضور، ونُعدّ لك مساحة تليق بك.
        </p>
      </div>

      {/* Session details card */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden'
        }}>
          <div style={{
            padding: '14px 20px',
            background: `oklch(0.97 0.03 ${hue})`,
            borderBottom: '1px solid var(--line)',
            fontSize: 12, color: `oklch(0.4 0.12 ${hue})`,
            fontWeight: 600, letterSpacing: 0.5
          }}>
            تفاصيل جلستك المقترحة
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, letterSpacing: -0.3 }}>
              مستقبل المحتوى العربي الرقمي
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
              جلسة حوارية · 45 دقيقة
            </div>

            {[
              { ic: <IconCalendar size={15}/>, l: 'الموعد', v: 'الخميس 18 يونيو · 7:30 مساءً' },
              { ic: <IconPin size={15}/>, l: 'المكان', v: 'مسرح السروات · المنصة الرئيسية' },
              { ic: <IconUser size={15}/>, l: 'مع', v: 'د. نورة العتيبي · مُحاوِرة' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                gap: 12, alignItems: 'center',
                padding: '10px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                fontSize: 13
              }}>
                <div style={{ color: 'var(--muted)' }}>{r.ic}</div>
                <div style={{ color: 'var(--muted)' }}>{r.l}</div>
                <div style={{ fontWeight: 500 }}>{r.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perks */}
      <div style={{ padding: '0 28px 12px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          ما أعددناه لك
        </div>
        {[
          'تذكرتا VIP · لك ولمرافقك',
          'توصيل خاص من وإلى المقرّ',
          'غرفة استعداد خاصّة قبل الجلسة',
          'مقابلة مُصوَّرة بعد الجلسة',
        ].map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 0', fontSize: 13.5
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 6,
              background: `oklch(0.94 0.05 ${hue})`,
              color: `oklch(0.4 0.14 ${hue})`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}><IconCheck size={11} stroke={2.5}/></div>
            <span>{p}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 28px 8px', display: 'flex', gap: 8 }}>
        <button style={{
          flex: 1, background: `oklch(0.35 0.14 ${hue})`, color: '#fff',
          border: 'none', padding: '13px 20px', borderRadius: 999,
          fontWeight: 600, fontSize: 14.5, fontFamily: 'inherit', cursor: 'pointer'
        }}>
          أشرّفكم بالحضور
        </button>
        <button style={{
          flex: 1, background: '#fff', color: 'var(--ink-2)',
          border: '1px solid var(--line-2)', padding: '13px 20px', borderRadius: 999,
          fontWeight: 500, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer'
        }}>
          أحتاج معرفة المزيد
        </button>
      </div>

      <div style={{ padding: '16px 28px 28px', fontSize: 12.5,
        color: 'var(--muted)', textAlign: 'center', lineHeight: 1.7 }}>
        لأي استفسار مباشر · <a href="#" style={{ color: 'var(--ink-2)' }}>نورة العتيبي · مسؤولة علاقات المتحدّثين</a>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.SpeakerInviteTemplate = SpeakerInviteTemplate;
