// 1. Event Invitation — from client to their audience
// Branded with client logo/colors, Mhwar is only in footer

const EventInviteTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const clientName = d.clientName || 'مجتمع ثراء الشبابي';
  const parentOrg = d.parentOrg || 'هيئة تطوير منطقة عسير';
  const eventName = d.eventName || 'ملتقى ثراء السنوي 2026';

  return (
    <EmailShell
      from={`${clientName} · عبر محور <events@thraa.sa>`}
      subject={d.subject || `دعوة لحضور ${eventName}`}
    >
      <ClientBrandRow name={clientName} parentOrg={parentOrg} hue={hue} />

      <PlaceholderCover
        label="دعوة حضور"
        hue={hue}
        height={240}
        eventDate="18 يونيو · 6:00م"
      />

      <div style={{ padding: '28px 28px 20px' }}>
        <h1 style={{
          fontSize: 26, lineHeight: 1.25, fontWeight: 700,
          margin: '0 0 14px', letterSpacing: -0.4,
        }}>
          {eventName}
        </h1>
        <p style={{
          fontSize: 15, lineHeight: 1.85, color: 'var(--ink-2)',
          margin: '0 0 24px', textWrap: 'pretty'
        }}>
          مرحباً {d.recipientName || 'محمد'}،<br />
          {d.body || 'يسعدنا دعوتك إلى ملتقى ثراء السنوي · مساحة تجمع صنّاع المحتوى ورواد الأعمال في قلب أبها، لليلة من الحوار والمعرفة وعلاقات تدوم · مقعدك بانتظارك.'}
        </p>

        <div style={{
          padding: '4px 0 20px',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          marginBottom: 24
        }}>
          <MetaRow
            icon={<IconCalendar size={18} />}
            title={d.date || 'الخميس 18 يونيو 2026'}
            sub={d.time || '6:00 مساءً — 10:00 مساءً · بتوقيت الرياض'}
          />
          <MetaRow
            icon={<IconPin size={18} />}
            title={d.venue || '            مركز الملك خالد الحضاري · أبها'}
            sub={d.venueSub || 'قاعة السروات · الدور الثاني'}
          />
          <MetaRow
            icon={<IconLink size={18} />}
            title="بث مباشر متاح"
            sub="            يُرسل الرابط قبل الفعالية بساعة"
            mono
          />
        </div>

        {/* Horizontal action row — RSVP primary + 2 ghost */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
          <button style={{
            flex: '2 1 0',
            background: `oklch(0.35 0.12 ${hue})`,
            color: '#fff',
            border: 'none',
            padding: '13px 16px',
            borderRadius: 999,
            fontWeight: 600, fontSize: 14.5,
            fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            <IconCheck size={15} stroke={2.5}/> سأحضر · أكّد مقعدي
          </button>
          <button title="إضافة إلى التقويم" style={actionBtnStyle}>
            <IconCalendar size={16} />
          </button>
          <button title="صفحة الفعالية" style={actionBtnStyle}>
            <IconLink size={16} />
          </button>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 24,
          marginTop: 10, fontSize: 11, color: 'var(--muted)'
        }}>
          <span>تقويمي</span>
          <span>صفحة الفعالية</span>
        </div>

        <div style={{
          marginTop: 24, padding: '16px 18px',
          background: 'var(--warm)', borderRadius: 12,
          fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7
        }}>
          <strong style={{ fontWeight: 600 }}>تنويه:</strong> المقاعد محدودة، والتأكيد المبكّر يضمن مكانك · لا نُصدر تذاكر ورقية، هويتك تكفي للدخول.
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

const actionBtnStyle = {
  flex: '0 0 52px',
  background: '#fff',
  border: '1px solid var(--line-2)',
  borderRadius: 999,
  color: 'var(--ink-2)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

window.EventInviteTemplate = EventInviteTemplate;
