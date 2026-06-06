// Feedback / Survey — post-event pulse with embedded 1-tap rating + full survey link
// Client branded. Can be sent standalone or as a follow-up after "After Event" email.

const FeedbackTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const clientName = d.clientName || 'شركة نورّ';
  const eventName = d.eventName || 'ملتقى نورّ 2026';

  // Emoji-free — use faces drawn with icon strokes
  const faces = [
    { v: 1, label: 'مخيّب',   mouth: 'M8 16c1.5-2 6.5-2 8 0',   eyes: ['M8.5 10l1.5 1.5M8.5 11.5L10 10', 'M14 10l1.5 1.5M14 11.5L15.5 10'] },
    { v: 2, label: 'مقبول',  mouth: 'M8 15h8',                  eyes: ['M9 10v1.5', 'M15 10v1.5'] },
    { v: 3, label: 'جيّد',    mouth: 'M8 14c1.5 1.5 6.5 1.5 8 0', eyes: ['M9 10v1.5', 'M15 10v1.5'] },
    { v: 4, label: 'ممتاز',  mouth: 'M8 13c1.5 3 6.5 3 8 0',    eyes: ['M9 10v1.5', 'M15 10v1.5'] },
  ];

  return (
    <EmailShell
      from={`${clientName} <feedback@nour.co>`}
      subject={d.subject || `رأيك في ${eventName} · دقيقتان لا أكثر`}
    >
      <ClientBrandRow name={clientName} hue={hue} />

      {/* Opening */}
      <div style={{ padding: '40px 28px 8px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px',
          background: `oklch(0.95 0.04 ${hue})`,
          color: `oklch(0.4 0.14 ${hue})`,
          borderRadius: 999,
          fontSize: 11, fontWeight: 500,
          marginBottom: 16,
        }}>
          <IconMsg size={12}/>
          استبيان قصير · دقيقتان لا أكثر
        </div>
        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.5, lineHeight: 1.3
        }}>
          رأيك يصنع الفارق
        </h1>
        <p style={{
          fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.75,
          margin: '0 auto', maxWidth: 380, textWrap: 'pretty'
        }}>
          شكراً لحضورك <strong style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{eventName}</strong> · دقيقتان من وقتك ترفعان جودة الفعالية القادمة.
        </p>
      </div>

      {/* One-tap overall rating — faces */}
      <div style={{ padding: '32px 28px 4px' }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600,
          letterSpacing: 0.3,
          marginBottom: 14, textAlign: 'center',
          color: 'var(--ink-2)',
        }}>
          أيّ الوجوه الأقرب لشعورك؟
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
        }}>
          {faces.map(f => (
            <a key={f.v} href="#" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, padding: '14px 6px',
              border: '1px solid var(--line)',
              borderRadius: 14,
              background: '#fff',
              transition: 'all 0.15s',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke={`oklch(0.4 0.14 ${hue})`} strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9.5"/>
                {f.eyes.map((e, i) => <path key={i} d={e}/>)}
                <path d={f.mouth}/>
              </svg>
              <div style={{
                fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 500,
              }}>{f.label}</div>
            </a>
          ))}
        </div>

        <div style={{
          fontSize: 10.5, color: 'var(--muted)', marginTop: 10,
          textAlign: 'center',
        }}>
          اختر الأقرب إلى إحساسك · تُحفظ إجابتك تلقائياً
        </div>
      </div>

      {/* Star rating for recommendation */}
      <div style={{ padding: '24px 28px 8px' }}>
        <div style={{
          padding: '20px',
          background: 'var(--warm)',
          borderRadius: 14,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 13, fontWeight: 500,
            marginBottom: 12, color: 'var(--ink-2)',
            lineHeight: 1.6,
          }}>
            ما احتمال أن توصي صديقاً بحضور فعالياتنا القادمة؟
          </div>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 4,
            marginBottom: 8,
          }}>
            {[1, 2, 3, 4, 5].map(n => (
              <a key={n} href="#" style={{
                padding: 6,
                color: n <= 4 ? `oklch(0.6 0.16 75)` : 'var(--line-2)',
                display: 'inline-flex',
              }}>
                <IconStar size={26} stroke={1.5} />
              </a>
            ))}
          </div>
          <div className="mono" style={{
            fontSize: 10, color: 'var(--muted)',
          }}>
            ضعيف → ممتاز
          </div>
        </div>
      </div>

      {/* Three quick topic tags — click to dive deeper */}
      <div style={{ padding: '24px 28px 8px' }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          أيّ محور تودّ التعليق عليه؟
        </div>
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
        }}>
          {['المحتوى والجلسات', 'المتحدّثون', 'المكان والتنظيم', 'فرص التواصل', 'التسجيل والدخول', 'اقتراح عام'].map((t, i) => (
            <a key={i} href="#" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 14px',
              background: '#fff',
              border: '1px solid var(--line-2)',
              borderRadius: 999,
              fontSize: 13, color: 'var(--ink-2)',
              fontWeight: 500,
            }}>
              {t}
            </a>
          ))}
        </div>
      </div>

      {/* Full survey CTA */}
      <div style={{ padding: '24px 28px 32px' }}>
        <a href="#" style={{
          display: 'flex', alignItems: 'center',
          padding: '18px 20px',
          background: 'var(--ink)',
          color: '#fff',
          borderRadius: 14,
          gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,0.1)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconSparkle size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
              الاستبيان الكامل · 8 أسئلة سريعة
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
              تعمّق أكثر وشاركنا التفاصيل
            </div>
          </div>
          <IconArrowL size={18} style={{ opacity: 0.7 }}/>
        </a>

        <div style={{
          marginTop: 14,
          fontSize: 11.5, color: 'var(--muted)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          ردودك سرّية ولا ترتبط باسمك · تُستخدم تجميعياً فقط.
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.FeedbackTemplate = FeedbackTemplate;
