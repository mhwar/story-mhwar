// Certificate delivery — client sends an attendance/completion certificate

const CertificateTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const clientName = d.clientName || 'مجتمع ثراء الشبابي';
  const parentOrg = d.parentOrg || 'هيئة تطوير منطقة عسير';
  const eventName = d.eventName || 'ملتقى ثراء السنوي 2026';
  const recipientName = d.recipientName || 'محمد بن عبدالعزيز الشهري';
  const certId = d.certId || 'THR-2026-0487';
  const issuedDate = d.issuedDate || '21 يونيو 2026';

  return (
    <EmailShell
      from={`${clientName} <certs@thraa.sa>`}
      subject={d.subject || `شهادتك من «${eventName}» جاهزة للتحميل`}
    >
      <ClientBrandRow name={clientName} parentOrg={parentOrg} hue={hue} />

      {/* Celebratory header */}
      <div style={{
        padding: '40px 28px 8px',
        textAlign: 'center',
        background: `linear-gradient(180deg, oklch(0.97 0.02 ${hue}) 0%, #fff 100%)`,
      }}>
        <div className="mono" style={{
          fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase',
          color: `oklch(0.45 0.14 ${hue})`, marginBottom: 12,
        }}>
          شهادة · Certificate
        </div>
        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.5, lineHeight: 1.25
        }}>
          تمّ إصدار شهادتك
        </h1>
        <p style={{
          fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.7,
          margin: '0 auto', maxWidth: 360, textWrap: 'pretty'
        }}>
          شكراً لمشاركتك في <strong style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{eventName}</strong> · يمكنك تحميل الشهادة الرسمية أو إضافتها إلى ملفّك المهني على LinkedIn.
        </p>
      </div>

      {/* Certificate preview card — tilted, with deep shadow */}
      <div style={{ padding: '32px 28px 8px' }}>
        <div style={{
          position: 'relative',
          perspective: '1000px',
        }}>
          <div style={{
            background: '#fdfbf7',
            border: `1px solid oklch(0.88 0.04 ${hue})`,
            borderRadius: 14,
            padding: '28px 24px 22px',
            boxShadow: `0 20px 40px -20px oklch(0.4 0.1 ${hue} / 0.35), 0 4px 12px rgba(0,0,0,0.06)`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Corner flourish */}
            <div aria-hidden style={{
              position: 'absolute', top: -30, left: -30,
              width: 120, height: 120, borderRadius: '50%',
              background: `oklch(0.92 0.06 ${hue})`, opacity: 0.5,
            }}/>
            <div aria-hidden style={{
              position: 'absolute', bottom: -40, right: -40,
              width: 140, height: 140, borderRadius: '50%',
              background: `oklch(0.94 0.05 ${hue + 20})`, opacity: 0.5,
            }}/>

            <div style={{ position: 'relative' }}>
              {/* Ribbon */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 11px',
                background: `oklch(0.35 0.14 ${hue})`, color: '#fff',
                borderRadius: 999,
                fontSize: 10.5, fontWeight: 600,
                letterSpacing: 0.3,
                marginBottom: 18
              }}>
                <IconAward size={12} stroke={2.5}/>
                شهادة حضور
              </div>

              <div style={{
                fontSize: 11.5, color: 'var(--muted)',
                marginBottom: 4,
              }}>
                تُمنح هذه الشهادة إلى
              </div>
              <div style={{
                fontSize: 22, fontWeight: 700,
                letterSpacing: -0.4, lineHeight: 1.25,
                marginBottom: 18,
                color: 'var(--ink)',
                borderBottom: `1px dashed oklch(0.82 0.06 ${hue})`,
                paddingBottom: 14,
              }}>
                {recipientName}
              </div>

              <div style={{
                fontSize: 12.5, color: 'var(--ink-2)',
                lineHeight: 1.75, marginBottom: 20,
                textWrap: 'pretty',
              }}>
                تقديراً لحضوره كامل فعاليات <strong style={{ fontWeight: 600 }}>{eventName}</strong>، التي أُقيمت في {d.venue || 'مركز الملك خالد الحضاري · أبها'} بتاريخ {d.eventDate || '18 يونيو 2026'}.
              </div>

              {/* Footer row — id + date + seal */}
              <div style={{
                display: 'flex', alignItems: 'flex-end',
                justifyContent: 'space-between', gap: 12,
                marginTop: 8, paddingTop: 14,
                borderTop: '1px solid var(--line)',
              }}>
                <div>
                  <div className="mono" style={{
                    fontSize: 10, color: 'var(--muted)', letterSpacing: 0.5,
                  }}>CERT. ID</div>
                  <div className="mono" style={{
                    fontSize: 11.5, fontWeight: 500, color: 'var(--ink-2)',
                    marginTop: 2,
                  }}>{certId}</div>
                  <div style={{
                    fontSize: 10.5, color: 'var(--muted)', marginTop: 6,
                  }}>صدرت بتاريخ {issuedDate}</div>
                </div>

                {/* Seal / stamp */}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  border: `1.5px solid oklch(0.45 0.14 ${hue})`,
                  color: `oklch(0.45 0.14 ${hue})`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                  transform: 'rotate(-6deg)',
                  flexShrink: 0,
                }}>
                  <div className="mono" style={{
                    fontSize: 7, letterSpacing: 0.8, opacity: 0.8,
                  }}>OFFICIAL</div>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, marginTop: 2 }}>
                    {(clientName || '').trim()[0]}
                  </div>
                  <div className="mono" style={{
                    fontSize: 6.5, letterSpacing: 0.5, opacity: 0.7,
                    marginTop: 2,
                  }}>2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verify strip under card */}
          <a href="#" className="mono" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, marginTop: 14,
            fontSize: 11, color: 'var(--muted)',
          }}>
            <IconShield size={12}/>
            التحقّق من صحّة الشهادة · verify.thraa.sa/{certId.toLowerCase()}
          </a>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '28px 28px 8px' }}>
        <button style={{
          width: '100%',
          background: `oklch(0.35 0.14 ${hue})`,
          color: '#fff',
          border: 'none',
          padding: '14px 20px',
          borderRadius: 999,
          fontWeight: 600, fontSize: 15,
          fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, cursor: 'pointer',
          marginBottom: 10,
        }}>
          <IconDownload size={16} stroke={2.5}/>
          تحميل الشهادة PDF
        </button>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        }}>
          <GhostBtn block>
            <IconLink size={14}/> نسخ رابط المشاركة
          </GhostBtn>
          <GhostBtn block>
            <IconSparkle size={14}/> أضفها إلى LinkedIn
          </GhostBtn>
        </div>
      </div>

      {/* What's included */}
      <div style={{ padding: '24px 28px 32px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
          تفاصيل الشهادة
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          {[
            { k: 'الاسم الكامل', v: recipientName.split(' ').slice(0, 2).join(' ') + '…' },
            { k: 'المدة', v: '4 ساعات' },
            { k: 'تاريخ الإصدار', v: issuedDate },
            { k: 'رقم التحقّق', v: certId, mono: true },
          ].map((it, i) => (
            <div key={i} style={{
              padding: '12px 14px',
              border: '1px solid var(--line)',
              borderRadius: 10,
              background: '#fff',
            }}>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 3 }}>{it.k}</div>
              <div style={{
                fontSize: 12.5, fontWeight: 500, color: 'var(--ink)',
                fontFamily: it.mono ? 'IBM Plex Mono, monospace' : 'inherit',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{it.v}</div>
            </div>
          ))}
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.CertificateTemplate = CertificateTemplate;
