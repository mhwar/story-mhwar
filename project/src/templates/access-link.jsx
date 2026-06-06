// 9. Access Link — live stream URL or venue entry link
// Client branded — sent shortly before/at event start

const AccessLinkTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const clientName = d.clientName || 'مجتمع ثراء الشبابي';
  const parentOrg = d.parentOrg || 'هيئة تطوير منطقة عسير';

  return (
    <EmailShell
      from={`${clientName} · عبر ${parentOrg} <events@thraa.sa>`}
      subject={d.subject || 'رابط الدخول إلى البث المباشر · لمقعدك فقط'}
    >
      <ClientBrandRow name={clientName} parentOrg={parentOrg} hue={hue} />

      <div style={{ padding: '36px 28px 8px' }}>
        {/* Live pulse indicator */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px 6px 10px', borderRadius: 999,
          background: 'oklch(0.95 0.1 20)', color: 'oklch(0.5 0.2 25)',
          fontSize: 12, fontWeight: 600, marginBottom: 18
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'oklch(0.55 0.25 25)',
            boxShadow: '0 0 0 0 oklch(0.55 0.25 25 / 0.6)',
            animation: 'pulse 1.6s infinite'
          }}/>
          LIVE · على الهواء الآن
        </div>
        <style>{`@keyframes pulse {
          0% { box-shadow: 0 0 0 0 oklch(0.55 0.25 25 / 0.6); }
          70% { box-shadow: 0 0 0 10px oklch(0.55 0.25 25 / 0); }
          100% { box-shadow: 0 0 0 0 oklch(0.55 0.25 25 / 0); }
        }`}</style>

        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 14px',
          letterSpacing: -0.4, lineHeight: 1.3
        }}>
          البث بدأ · تفضّل بالدخول
        </h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink-2)', margin: '0 0 24px' }}>
          أهلاً {d.recipientName || 'محمد'}،<br/>
          هذا رابطك الخاص لحضور {d.eventName || 'ملتقى ثراء السنوي'} · الرابط مرتبط بتذكرتك وحدها، لذا لا تشاركه مع غيرك.
        </p>

        {/* Giant access block */}
        <div style={{
          position: 'relative',
          padding: '24px 22px',
          background: `linear-gradient(135deg, oklch(0.97 0.03 ${hue}) 0%, #fff 100%)`,
          border: `1px solid oklch(0.9 0.04 ${hue})`,
          borderRadius: 16,
          marginBottom: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: `oklch(0.4 0.14 ${hue})`,
              color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconLink size={16}/>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
              رابطك الخاص · لمقعدك فقط
            </div>
          </div>
          <div className="mono" style={{
            fontSize: 13, color: 'var(--ink-2)',
            padding: '10px 12px', background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 8,
            direction: 'ltr', textAlign: 'left',
            wordBreak: 'break-all',
            marginBottom: 12
          }}>
            live.thraa.sa/stream/m7md-9482fa
          </div>
          <button style={{
            width: '100%',
            background: `oklch(0.35 0.14 ${hue})`,
            color: '#fff', border: 'none',
            padding: '14px 22px',
            borderRadius: 999,
            fontWeight: 600, fontSize: 15,
            fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, cursor: 'pointer'
          }}>
            ادخل إلى البث المباشر <IconArrowL size={16} stroke={2}/>
          </button>
        </div>

        {/* Quick info row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1, background: 'var(--line)',
          borderRadius: 12, overflow: 'hidden',
          border: '1px solid var(--line)',
          marginBottom: 24
        }}>
          {[
            { l: 'الموعد', v: '6:00 مساءً' },
            { l: 'المدة', v: 'نحو 4 ساعات' },
            { l: 'جودة البث', v: 'HD 1080p' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '12px 10px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 3 }}>{s.l}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '14px 16px',
          background: 'var(--warm)', borderRadius: 10,
          fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.7
        }}>
          <strong style={{ fontWeight: 600 }}>لأفضل تجربة:</strong> تأكّد من اتصال إنترنت مستقر · التسجيل يبقى متاحاً 30 يوماً على نفس الرابط.
        </div>
      </div>

      <div style={{ padding: '20px 28px 4px', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        لم يصلك الرابط؟ <a href="#" style={{ color: 'var(--ink-2)', textDecoration: 'underline' }}>تواصل مع الدعم</a>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.AccessLinkTemplate = AccessLinkTemplate;
