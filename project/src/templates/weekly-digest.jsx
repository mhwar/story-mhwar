// Weekly Digest — event host's performance summary

const WeeklyDigestTemplate = ({ data }) => {
  const d = data || {};
  return (
    <EmailShell
      from="محور <reports@mhwar.sa>"
      subject={d.subject || 'ملخّص أسبوعك على محور · أسبوع 24'}
    >
      <PlatformHeader />

      <div style={{ padding: '36px 28px 12px' }}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 12,
        }}>
          أسبوع 24 · 10 إلى 16 يونيو
        </div>
        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.4, lineHeight: 1.3
        }}>
          كيف سار أسبوعك؟
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--muted)', lineHeight: 1.7,
          margin: 0, textWrap: 'pretty'
        }}>
          نظرة سريعة على أداء فعالياتك · ما يعمل بشكل جيد وأين تحتاج تركيزاً أكبر.
        </p>
      </div>

      {/* Top stats */}
      <div style={{ padding: '24px 20px 8px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        }}>
          {[
            { n: '847',  l: 'تسجيل جديد', t: '+23%', up: true },
            { n: '92%',  l: 'معدّل الحضور', t: '+4%',  up: true },
            { n: '3',    l: 'فعاليات نشطة', t: 'ثابت',    up: null },
            { n: '4.7',  l: 'متوسّط التقييم', t: '−0.1', up: false },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '18px 16px',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{s.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>{s.n}</div>
                <div className="mono" style={{
                  fontSize: 11,
                  color: s.up === true ? 'oklch(0.55 0.15 155)' :
                         s.up === false ? 'oklch(0.55 0.18 25)' : 'var(--muted)',
                }}>
                  {s.up === true ? '↑' : s.up === false ? '↓' : '—'} {s.t}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart — daily registrations */}
      <div style={{ padding: '24px 28px 8px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
          التسجيلات اليوميّة
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 6,
          height: 90, padding: '4px 0',
          borderBottom: '1px solid var(--line)',
        }}>
          {[42, 68, 55, 91, 120, 164, 98].map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: '100%',
                height: `${(v / 164) * 100}%`,
                background: i === 5 ? 'var(--accent)' : `oklch(0.85 0.05 220)`,
                borderRadius: '4px 4px 0 0',
                minHeight: 4,
              }}/>
            </div>
          ))}
        </div>
        <div className="mono" style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 10, color: 'var(--muted)', marginTop: 6,
          padding: '0 2px',
        }}>
          {['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'].map(d => <span key={d}>{d}</span>)}
        </div>
      </div>

      {/* Top event */}
      <div style={{ padding: '24px 28px 8px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          الأعلى أداءً هذا الأسبوع
        </div>
        <a href="#" style={{
          display: 'block',
          padding: '16px 18px',
          border: '1px solid var(--line)',
          borderRadius: 12,
          background: '#fff',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10, gap: 12,
          }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, flex: 1 }}>
              ملتقى ثراء السنوي 2026
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'oklch(0.55 0.15 155)' }}>
              ↑ 23%
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
            <span>324 مسجّلاً</span>
            <span>·</span>
            <span>1,204 مشاهدة</span>
            <span>·</span>
            <span>تحويل 27%</span>
          </div>
        </a>
      </div>

      <div style={{ padding: '20px 28px 32px' }}>
        <PrimaryBtn color="var(--accent)">افتح التقرير الكامل</PrimaryBtn>
      </div>

      <MhwarFooterCTA showCta={false}/>
    </EmailShell>
  );
};

window.WeeklyDigestTemplate = WeeklyDigestTemplate;
