// Plan Upgrade Nudge — user hit a limit on their current plan

const UpgradeNudgeTemplate = ({ data }) => {
  const d = data || {};

  return (
    <EmailShell
      from="محور <hello@mhwar.sa>"
      subject={d.subject || 'اقتربت من حدود خطتك · حان وقت الترقية'}
    >
      <PlatformHeader />

      <div style={{ padding: '36px 28px 8px' }}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 14
        }}>اقتراح من محور</div>

        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 12px',
          letterSpacing: -0.4, lineHeight: 1.3
        }}>
          نموّك تجاوز خطتك الحالية
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.8,
          margin: 0, textWrap: 'pretty'
        }}>
          مرحباً {d.recipientName || 'محمد'}، استخدامك هذا الشهر تجاوز 85% من حدود خطتك الحالية · ترقية بسيطة تُبقي فعالياتك تعمل بلا توقف.
        </p>
      </div>

      {/* Usage meters */}
      <div style={{ padding: '24px 28px 8px' }}>
        {[
          { l: 'الفعاليات النشطة', used: 4, total: 5, pct: 80 },
          { l: 'المدعوون هذا الشهر', used: 847, total: 1000, pct: 85 },
          { l: 'أعضاء الفريق', used: 3, total: 3, pct: 100, full: true },
        ].map((m, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 12.5, marginBottom: 6,
            }}>
              <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{m.l}</span>
              <span className="mono" style={{
                color: m.full ? 'oklch(0.55 0.18 25)' : 'var(--muted)',
                fontWeight: m.full ? 600 : 400,
              }}>
                {m.used} / {m.total}
              </span>
            </div>
            <div style={{
              height: 6, borderRadius: 999,
              background: 'var(--line)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${m.pct}%`, height: '100%',
                background: m.full ? 'oklch(0.55 0.18 25)' :
                           m.pct > 80 ? 'oklch(0.6 0.16 75)' : 'var(--accent)',
                borderRadius: 999,
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Plan comparison */}
      <div style={{ padding: '24px 28px 8px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
          الحلّ: خطة محور برو
        </div>

        <div style={{
          padding: '20px 20px 16px',
          background: 'var(--ink)', color: '#fff',
          borderRadius: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.8 }}>299</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>ر.س / شهري</div>
          </div>

          {[
            'فعاليات غير محدودة',
            '10,000 مدعوّ شهرياً',
            'فريق حتّى 10 أعضاء',
            'تحليلات متقدّمة وتقارير PDF',
            'دعم مخصّص عبر الواتساب',
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', fontSize: 13,
              borderTop: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <span style={{ color: 'oklch(0.8 0.15 155)', flexShrink: 0 }}>
                <IconCheck size={14} stroke={2.5}/>
              </span>
              {t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 28px 12px' }}>
        <PrimaryBtn color="var(--accent)">رقِّ خطتي إلى برو</PrimaryBtn>
        <GhostBtn block><IconMsg size={14}/> احجز استشارة مجانية مع الفريق</GhostBtn>
      </div>

      <div style={{ padding: '8px 28px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.7 }}>
          تجربة مجانية 14 يوماً · إلغاء في أي وقت · دون بطاقة
        </div>
      </div>

      <MhwarFooterCTA showCta={false}/>
    </EmailShell>
  );
};

window.UpgradeNudgeTemplate = UpgradeNudgeTemplate;
