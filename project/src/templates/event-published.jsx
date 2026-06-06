// Event Published — confirmation that event is live on Mhwar

const EventPublishedTemplate = ({ data }) => {
  const d = data || {};
  const eventName = d.eventName || 'ملتقى ثراء السنوي 2026';

  return (
    <EmailShell
      from="محور <events@mhwar.sa>"
      subject={d.subject || `«${eventName}» منشورة · الرابط جاهز للمشاركة`}
    >
      <PlatformHeader />

      <div style={{ padding: '40px 28px 12px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px',
          background: 'oklch(0.94 0.08 155)',
          color: 'oklch(0.4 0.15 155)',
          borderRadius: 999,
          fontSize: 11, fontWeight: 500,
          marginBottom: 16,
        }}>
          <IconCheckCircle size={12}/>
          منشورة
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 12px',
          letterSpacing: -0.4, lineHeight: 1.3
        }}>
          فعاليتك مفتوحة للتسجيل
        </h1>
        <p style={{
          fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8,
          margin: '0 0 22px', textWrap: 'pretty'
        }}>
          مرحباً {d.recipientName || 'محمد'}، نُهنِّئك · نُشرت <strong style={{ fontWeight: 600 }}>{eventName}</strong> بنجاح · شارك الرابط أدناه مع جمهورك، وسترى التسجيلات تصل مباشرة في لوحة التحكم.
        </p>

        {/* Event summary card */}
        <div style={{
          border: '1px solid var(--line)',
          borderRadius: 14,
          padding: '18px 18px 4px',
          background: '#fff',
          marginBottom: 18,
        }}>
          <div style={{
            fontSize: 15, fontWeight: 600, marginBottom: 12,
            letterSpacing: -0.2,
          }}>{eventName}</div>
          <MetaRow icon={<IconCalendar size={16}/>} title="18 يونيو 2026" sub="6:00 مساءً"/>
          <MetaRow icon={<IconPin size={16}/>} title="          مركز الملك خالد الحضاري · أبها"/>
          <MetaRow icon={<IconUser size={16}/>} title="سعة 500 مقعد" sub="التسجيل مفتوح الآن"/>
        </div>

        {/* Share link */}
        <div className="mono" style={{
          padding: '12px 14px',
          background: 'var(--warm)', borderRadius: 10,
          fontSize: 12, color: 'var(--ink-2)',
          direction: 'ltr', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 10,
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            mhwar.sa/e/thraa-2026
          </span>
          <button style={{
            padding: '6px 10px', borderRadius: 6,
            background: '#fff', border: '1px solid var(--line-2)',
            fontSize: 11, fontFamily: 'inherit', cursor: 'pointer',
            flexShrink: 0,
          }}>نسخ الرابط</button>
        </div>
      </div>

      <div style={{ padding: '8px 28px 24px' }}>
        <PrimaryBtn color="var(--accent)">افتح لوحة التحكم</PrimaryBtn>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          <GhostBtn block><IconLink size={14}/> مشاركة الرابط</GhostBtn>
          <GhostBtn block><IconQR size={14}/> كود QR للطباعة</GhostBtn>
        </div>
      </div>

      {/* Next-up nudges */}
      <div style={{ padding: '4px 28px 32px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          الخطوات التالية
        </div>
        {[
          { t: 'استورد جهات اتصالك لبدء الدعوات التلقائية', ic: <IconUser size={14}/> },
          { t: 'جهّز قالب التذكير قبل الفعالية بيوم واحد', ic: <IconBell size={14}/> },
          { t: 'راجع صفحة الفعالية قبل مشاركتها', ic: <IconSparkle size={14}/> },
        ].map((it, i) => (
          <a key={i} href="#" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', marginBottom: 6,
            border: '1px solid var(--line)',
            borderRadius: 10, background: '#fff',
            fontSize: 13, color: 'var(--ink-2)',
          }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{it.ic}</span>
            <span style={{ flex: 1 }}>{it.t}</span>
            <IconArrowL size={14} style={{ color: 'var(--muted)' }}/>
          </a>
        ))}
      </div>

      <MhwarFooterCTA showCta={false}/>
    </EmailShell>
  );
};

window.EventPublishedTemplate = EventPublishedTemplate;
