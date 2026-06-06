// 4. After Event — thank you + follow up
// Client branded

const AfterEventTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;

  return (
    <EmailShell
      from={`${d.clientName || 'شركة نورّ'} <events@nour.co>`}
      subject={d.subject || 'شكراً على حضورك · مواد الملتقى جاهزة'}
    >
      <ClientBrandRow name={d.clientName || 'شركة نورّ'} hue={hue} />

      <div style={{ padding: '44px 28px 8px', textAlign: 'center' }}>
        <div style={{
          fontSize: 48, marginBottom: 8,
          color: `oklch(0.45 0.12 ${hue})`,
        }}>
          <IconHeart size={48} stroke={1.3} />
        </div>
        <h1 style={{
          fontSize: 28, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.5
        }}>
          ليلة استثنائية · صنعتها بحضورك
        </h1>
        <p style={{
          fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.7,
          margin: '0 auto', maxWidth: 380, textWrap: 'pretty'
        }}>
حضورك منح {d.eventName || 'ملتقى نورّ 2026'} روحه الخاصّة · نتمنّى أن تكون قد خرجت بفكرة ملهمة، أو لقاء جديد، أو لحظة تستحقّ التذكّر.
        </p>
      </div>

      {/* Stats strip */}
      <div style={{ padding: '32px 20px 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          borderRadius: 14, overflow: 'hidden',
          border: '1px solid var(--line)'
        }}>
          {[
          { n: '324', l: 'حضروا' },
            { n: '12', l: 'تحدّثوا' },
            { n: '48', l: 'لقاء جانبي' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '18px 10px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid var(--line)' : 'none',
              background: '#fff'
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>{s.n}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow up actions */}
      <div style={{ padding: '28px 28px 8px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
          مواد وذكريات الملتقى
        </div>

        {[
          { ic: <IconDownload size={16}/>, t: 'تسجيلات الجلسات', s: 'متاحة للمشاهدة حتّى 30 يوماً' },
          { ic: <IconLink size={16}/>, t: 'ألبوم الصور', s: '214 صورة جاهزة للتنزيل' },
          { ic: <IconSparkle size={16}/>, t: 'شاركنا رأيك', s: 'دقيقتان تساعدان في تحسين القادم' },
        ].map((it, i) => (
          <a key={i} href="#" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 16px', marginBottom: 8,
            border: '1px solid var(--line)',
            borderRadius: 12,
            transition: 'background 0.15s'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `oklch(0.94 0.05 ${hue})`,
              color: `oklch(0.4 0.12 ${hue})`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
            }}>{it.ic}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{it.t}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{it.s}</div>
            </div>
            <IconArrowL size={16} style={{ color: 'var(--muted)' }}/>
          </a>
        ))}
      </div>

      <div style={{ padding: '20px 28px 32px' }}>
        <div style={{
          padding: '20px',
          background: 'var(--warm)', borderRadius: 14,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
            نلتقي في 2027 · وأنت أوّل المدعوّين
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
            سجّل اهتمامك لتصلك الدعوة قبل الجميع
          </div>
          <PrimaryBtn block={false} small color={`oklch(0.35 0.12 ${hue})`}>
            سجّلني للدورة القادمة
          </PrimaryBtn>
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.AfterEventTemplate = AfterEventTemplate;
