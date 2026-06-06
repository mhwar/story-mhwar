// 10. Waitlist — spot opened up
// Client branded — time-sensitive

const WaitlistTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const clientName = d.clientName || 'مجتمع ثراء الشبابي';
  const parentOrg = d.parentOrg || 'هيئة تطوير منطقة عسير';

  return (
    <EmailShell
      from={`${clientName} · عبر ${parentOrg} <events@thraa.sa>`}
      subject={d.subject || 'توفّر مقعد لك · أكّد حجزك خلال 24 ساعة'}
    >
      <ClientBrandRow name={clientName} parentOrg={parentOrg} hue={hue} />

      <div style={{ padding: '44px 28px 8px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: `linear-gradient(135deg, oklch(0.75 0.18 ${hue + 20}) 0%, oklch(0.55 0.2 ${hue}) 100%)`,
          color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          boxShadow: `0 10px 30px -10px oklch(0.5 0.2 ${hue} / 0.4)`
        }}>
          <IconSparkle size={26}/>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 10px', letterSpacing: -0.4 }}>
          جاء دورك · مقعدك بانتظارك
        </h1>
        <p style={{
          fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.7,
          margin: '0 auto', maxWidth: 380
        }}>
          كنت على قائمة انتظار <strong style={{ color: 'var(--ink-2)' }}>{d.eventName || 'ملتقى ثراء'}</strong>، وتوفّر الآن مقعد بعد اعتذار أحد المسجّلين · أكّد حجزك خلال المهلة لتضمن مكانك.
        </p>
      </div>

      {/* Countdown card */}
      <div style={{ padding: '28px 20px 20px' }}>
        <div style={{
          padding: '22px',
          border: `1px solid oklch(0.88 0.08 30)`,
          background: 'oklch(0.98 0.02 40)',
          borderRadius: 14,
          textAlign: 'center'
        }}>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase',
            color: 'oklch(0.5 0.18 30)', marginBottom: 10
          }}>
            المهلة تنتهي خلال
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, direction: 'ltr' }}>
            {[
              { n: '23', l: 'ساعة' },
              { n: '45', l: 'دقيقة' },
              { n: '12', l: 'ثانية' }
            ].map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center' }}>
                  <div className="mono" style={{
                    fontSize: 32, fontWeight: 700,
                    color: 'var(--ink)', lineHeight: 1, letterSpacing: -1
                  }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{s.l}</div>
                </div>
                {i < 2 && <div style={{ fontSize: 28, color: 'var(--muted)',
                  lineHeight: 1, alignSelf: 'center', marginTop: -6 }}>:</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 28px 20px' }}>
        <button style={{
          width: '100%',
          background: `oklch(0.35 0.14 ${hue})`,
          color: '#fff', border: 'none',
          padding: '14px 22px', borderRadius: 999,
          fontWeight: 600, fontSize: 15, fontFamily: 'inherit',
          cursor: 'pointer'
        }}>
          أحجز هذا المقعد
        </button>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center',
          marginTop: 12, lineHeight: 1.6 }}>
          إن انتهت المهلة دون تأكيد · ينتقل المقعد تلقائياً للتالي في القائمة.
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.WaitlistTemplate = WaitlistTemplate;
