// 2. RSVP Confirmation — to attendee after they confirmed
// Client branded

const RsvpConfirmTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;

  return (
    <EmailShell
      from={`${d.clientName || 'شركة نورّ'} <events@nour.co>`}
      subject={d.subject || 'آكدنا حضورك · تذكرتك جاهزة'}
    >
      <ClientBrandRow name={d.clientName || 'شركة نورّ'} hue={hue} />

      <div style={{ padding: '40px 28px 24px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `oklch(0.94 0.05 ${hue})`,
          color: `oklch(0.4 0.12 ${hue})`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <IconCheck size={28} stroke={2} />
        </div>
        <h1 style={{
          fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: -0.3
        }}>
          حضورك مؤكّد · بانتظارك
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: 0, lineHeight: 1.7 }}>
          حجزنا لك مقعداً في{' '}
          <strong style={{ color: 'var(--ink-2)', fontWeight: 600 }}>
            {d.eventName || 'ملتقى نورّ السنوي 2026'}
          </strong>
        </p>
      </div>

      {/* Ticket card */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid var(--line-2)',
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            padding: '18px 22px',
            background: `oklch(0.96 0.04 ${hue})`,
            borderBottom: '1px dashed var(--line-2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--muted)' }}>
                TICKET · NR-2026-0428
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
                {d.recipientName || 'محمد المطيري'}
              </div>
            </div>
            <div className="mono" style={{
              fontSize: 11, color: `oklch(0.4 0.1 ${hue})`,
              padding: '4px 10px', background: '#fff',
              borderRadius: 999, fontWeight: 500
            }}>مُؤكَّد</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '20px 22px', gap: 16 }}>
            <div style={{
              width: 96, height: 96, flexShrink: 0,
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <QrPattern size={76} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                امسح هذا الرمز عند البوّابة للدخول
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.5 }}>
                {d.date || 'الخميس 18 يونيو · 6:00 مساءً'}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
                {d.venue || 'إثراء · قاعة الحوار'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 28px 28px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <GhostBtn block><IconDownload size={15} /> تنزيل التذكرة</GhostBtn>
          <GhostBtn block><IconCalendar size={15} /> إضافة إلى التقويم</GhostBtn>
        </div>
        <div style={{
          marginTop: 20, fontSize: 13, color: 'var(--muted)',
          lineHeight: 1.8, textAlign: 'center'
        }}>
          تغيّرت خططك؟{' '}
          <a href="#" style={{ color: 'var(--ink-2)', textDecoration: 'underline' }}>
            ألغِ حجزك
          </a>{' '}
          ليستفيد منه شخص آخر من قائمة الانتظار.
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

// Simple QR-like pattern (placeholder)
const QrPattern = ({ size = 80 }) => {
  const cells = 9;
  const pattern = React.useMemo(() => {
    const arr = [];
    // deterministic pseudo pattern
    for (let i = 0; i < cells * cells; i++) {
      arr.push(((i * 7 + i % 3 + Math.floor(i / cells)) % 3) !== 0);
    }
    // corners
    const corner = (r, c) => {
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        arr[(r+i) * cells + (c+j)] = i === 0 || i === 2 || j === 0 || j === 2;
      }
    };
    corner(0,0); corner(0,cells-3); corner(cells-3,0);
    return arr;
  }, []);
  const s = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff"/>
      {pattern.map((on, i) => on ? (
        <rect key={i}
          x={(i % cells) * s} y={Math.floor(i / cells) * s}
          width={s} height={s} fill="#14130f"/>
      ) : null)}
    </svg>
  );
};

Object.assign(window, { RsvpConfirmTemplate, QrPattern });
