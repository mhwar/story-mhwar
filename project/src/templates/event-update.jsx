// 5. Event Update — moved date/location
// Client branded

const EventUpdateTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;

  return (
    <EmailShell
      from={`${d.clientName || 'شركة نورّ'} <events@nour.co>`}
      subject={d.subject || 'تحديث · تأجيل موعد الملتقى أسبوعاً'}
    >
      <ClientBrandRow name={d.clientName || 'شركة نورّ'} hue={hue} />

      <div style={{ padding: '32px 28px 20px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'oklch(0.94 0.08 70)', color: 'oklch(0.45 0.12 50)',
          fontSize: 12, fontWeight: 500, marginBottom: 16
        }}>
          <IconRefresh size={13}/> تحديث الموعد
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 14px',
          letterSpacing: -0.4, lineHeight: 1.3
        }}>
          تأجّل الملتقى أسبوعاً
        </h1>

        <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink-2)', margin: '0 0 24px' }}>
          أهلاً {d.recipientName || 'محمد'}،<br/>
          لظرف خارج عن إرادتنا تأجّلت الفعالية أسبوعاً واحداً · نعتذر عن أي إرباك، ونتطلّع للقائك في الموعد الجديد.
        </p>

        {/* Diff card — before / after */}
        <div style={{
          border: '1px solid var(--line)', borderRadius: 14,
          overflow: 'hidden', marginBottom: 20
        }}>
          <div style={{
            padding: '14px 18px',
            background: '#fbfaf7',
            borderBottom: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12.5, color: 'var(--muted)'
          }}>
            <span>الموعد السابق</span>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
            textDecoration: 'line-through', color: 'var(--muted)', fontSize: 14
          }}>
            <IconCalendar size={16}/>
            <span>الخميس 18 يونيو · 6:00 مساءً</span>
          </div>
          <div style={{
            padding: '14px 18px', borderTop: '1px solid var(--line)',
            background: `oklch(0.97 0.03 ${hue})`,
            borderBottom: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12.5, color: `oklch(0.4 0.12 ${hue})`, fontWeight: 600
          }}>
            الموعد الجديد
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <IconCalendar size={16} style={{ color: `oklch(0.4 0.12 ${hue})` }}/>
              <span style={{ fontSize: 15, fontWeight: 600 }}>الخميس 25 يونيو 2026</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <IconClock size={16} style={{ color: `oklch(0.4 0.12 ${hue})` }}/>
              <span style={{ fontSize: 14 }}>6:00 إلى 10:00 مساءً</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <IconPin size={16} style={{ color: `oklch(0.4 0.12 ${hue})` }}/>
              <span style={{ fontSize: 14 }}>نفس المكان · إثراء · قاعة الحوار</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PrimaryBtn color={`oklch(0.35 0.12 ${hue})`}>
            أؤكّد حضوري في الموعد الجديد
          </PrimaryBtn>
          <GhostBtn block>الموعد لا يناسبني · اعتذرت عن الحضور</GhostBtn>
        </div>

        <div style={{
          marginTop: 22, fontSize: 12.5, color: 'var(--muted)',
          textAlign: 'center', lineHeight: 1.7
        }}>
          تذكرتك الحالية صالحة للموعد الجديد دون أي إجراء إضافي.<br/>
          للاستفسار · <a href="#" style={{ color: 'var(--ink-2)', textDecoration: 'underline' }}>events@nour.co</a>
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.EventUpdateTemplate = EventUpdateTemplate;
