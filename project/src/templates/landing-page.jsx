// Event Landing Page — full web page (not email) for client events
// Has multiple states: browse, confirming, confirmed (ticket view), modifying, cancelled
// Rendered inside a browser window frame by app.jsx

const { useState: useStateLP } = React;

const LandingPageTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const clientName = 'مجتمع ثراء الشبابي';
  const parentOrg = 'هيئة تطوير منطقة عسير';
  const eventName = 'ملتقى ثراء السنوي 2026';

  // state: 'browse' | 'confirming' | 'confirmed' | 'modifying' | 'cancelled'
  const [state, setState] = useStateLP('browse');
  const [guestCount, setGuestCount] = useStateLP(1);
  const [sessionChoice, setSessionChoice] = useStateLP('main'); // main | workshop-a | workshop-b

  return (
    <div className="lp-light" style={{
      background: '#fff',
      minHeight: '100%',
      fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif',
      color: 'var(--ink)',
      position: 'relative',
    }}>
      {/* Top navigation */}
      <LpNav hue={hue} clientName={clientName} state={state} onManage={() => setState('confirmed')} />

      {/* HERO */}
      <LpHero
        hue={hue}
        eventName={eventName}
        clientName={clientName}
        parentOrg={parentOrg}
        state={state}
        onConfirm={() => setState('confirming')}
        onViewTicket={() => setState('confirmed')}
      />

      {/* STATUS BAR — appears when confirmed */}
      {state === 'confirmed' && (
        <LpConfirmedStatus
          hue={hue}
          onModify={() => setState('modifying')}
          onCancel={() => setState('cancelled')}
        />
      )}
      {state === 'cancelled' && (
        <LpCancelledStatus
          hue={hue}
          onRejoin={() => setState('confirmed')}
        />
      )}

      {/* ABOUT */}
      <LpAbout hue={hue} />

      {/* AGENDA */}
      <LpAgenda hue={hue} />

      {/* SPEAKERS */}
      <LpSpeakers hue={hue} />

      {/* VENUE */}
      <LpVenue hue={hue} />

      {/* COMMUNITY */}
      <LpCommunity hue={hue} />

      {/* FAQ */}
      <LpFaq hue={hue} />

      {/* CTA */}
      <LpCtaStrip
        hue={hue}
        state={state}
        onConfirm={() => setState('confirming')}
        onViewTicket={() => setState('confirmed')}
      />

      {/* FOOTER */}
      <LpFooter hue={hue} clientName={clientName} parentOrg={parentOrg} />

      {/* MODALS */}
      {state === 'confirming' && (
        <LpConfirmModal
          hue={hue}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          sessionChoice={sessionChoice}
          setSessionChoice={setSessionChoice}
          onClose={() => setState('browse')}
          onConfirm={() => setState('confirmed')}
        />
      )}
      {state === 'modifying' && (
        <LpModifyModal
          hue={hue}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          sessionChoice={sessionChoice}
          setSessionChoice={setSessionChoice}
          onClose={() => setState('confirmed')}
          onCancel={() => setState('cancelled')}
        />
      )}
    </div>
  );
};

// =============== NAV ===============
const LpNav = ({ hue, clientName, state, onManage }) => (
  <nav style={{
    position: 'sticky', top: 0, zIndex: 40,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--line)',
    padding: '14px 36px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: `linear-gradient(135deg, oklch(0.55 0.14 ${hue}) 0%, oklch(0.35 0.14 ${hue - 20}) 100%)`,
        color: '#fff', fontWeight: 700, fontSize: 14,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>ث</div>
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>{clientName}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 13 }}>
      <a href="#about" style={{ color: 'var(--ink-2)' }}>عن الفعالية</a>
      <a href="#agenda" style={{ color: 'var(--ink-2)' }}>الأجندة</a>
      <a href="#speakers" style={{ color: 'var(--ink-2)' }}>المتحدّثون</a>
      <a href="#venue" style={{ color: 'var(--ink-2)' }}>المكان</a>
      <a href="#faq" style={{ color: 'var(--ink-2)' }}>أسئلة</a>
      {state === 'confirmed' ? (
        <button onClick={onManage} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 999,
          background: `oklch(0.95 0.04 ${hue})`,
          color: `oklch(0.35 0.14 ${hue})`,
          fontSize: 12.5, fontWeight: 600,
          border: `1px solid oklch(0.88 0.06 ${hue})`,
        }}>
          <IconCheckCircle size={14} stroke={2}/>
          حضورك مؤكّد
        </button>
      ) : (
        <button style={{
          padding: '8px 16px', borderRadius: 999,
          background: 'var(--ink)', color: '#fff',
          fontSize: 12.5, fontWeight: 600,
        }}>
          أكّد حضورك
        </button>
      )}
    </div>
  </nav>
);

// =============== HERO ===============
const LpHero = ({ hue, eventName, clientName, parentOrg, state, onConfirm, onViewTicket }) => (
  <section id="hero" style={{
    position: 'relative',
    padding: '72px 36px 56px',
    background: `linear-gradient(180deg, oklch(0.98 0.015 ${hue}) 0%, #fff 100%)`,
    overflow: 'hidden',
  }}>
    {/* Decorative mesh */}
    <div aria-hidden style={{
      position: 'absolute', top: -100, insetInlineEnd: -100,
      width: 400, height: 400, borderRadius: '50%',
      background: `radial-gradient(circle, oklch(0.85 0.1 ${hue} / 0.35) 0%, transparent 70%)`,
      pointerEvents: 'none',
    }}/>
    <div aria-hidden style={{
      position: 'absolute', bottom: -150, insetInlineStart: -80,
      width: 350, height: 350, borderRadius: '50%',
      background: `radial-gradient(circle, oklch(0.85 0.12 ${hue + 30} / 0.2) 0%, transparent 70%)`,
      pointerEvents: 'none',
    }}/>

    <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative' }}>
      {/* Eyebrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 22,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 999,
          background: '#fff',
          border: `1px solid oklch(0.88 0.06 ${hue})`,
          color: `oklch(0.35 0.14 ${hue})`,
          fontSize: 11.5, fontWeight: 600, letterSpacing: 0.3,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: `oklch(0.55 0.15 ${hue})`,
          }}/>
          التسجيل مفتوح · مقاعد محدودة
        </div>
        <div className="mono" style={{
          fontSize: 11, color: 'var(--muted)', letterSpacing: 1,
        }}>
          النسخة الرابعة · 2026
        </div>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 64, lineHeight: 1.05, fontWeight: 700,
        margin: '0 0 22px', letterSpacing: -2,
        textWrap: 'balance',
        maxWidth: 780,
      }}>
        {eventName}
      </h1>

      {/* Lede */}
      <p style={{
        fontSize: 18, lineHeight: 1.7, color: 'var(--ink-2)',
        margin: '0 0 32px', maxWidth: 640,
        textWrap: 'pretty',
      }}>
        ليلة واحدة تجمع صنّاع المحتوى ورواد الأعمال في قلب أبها · اثنتا عشرة جلسة حواريّة، ومساحة لعلاقات تدوم · انضمّ إلى 324 مدعوّاً من ثماني مناطق.
      </p>

      {/* Meta grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, marginBottom: 36,
        padding: '20px 24px',
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 16,
        boxShadow: '0 10px 30px -20px rgba(20,19,15,0.1)',
      }}>
        {[
          { ic: <IconCalendar size={16}/>, l: 'التاريخ', v: '18 يونيو 2026', s: 'الخميس' },
          { ic: <IconClock size={16}/>, l: 'التوقيت', v: '6:00م — 10:00م', s: 'بتوقيت الرياض' },
          { ic: <IconPin size={16}/>, l: 'المكان', v: 'مركز الملك خالد · أبها', s: 'قاعة السروات' },
          { ic: <IconUser size={16}/>, l: 'الحضور', v: '324 مدعوّ', s: '42% يحضرون لأول مرة' },
        ].map((m, i) => (
          <div key={i} style={{
            borderInlineStart: i > 0 ? '1px solid var(--line)' : 'none',
            paddingInlineStart: i > 0 ? 16 : 0,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: 'var(--muted)', letterSpacing: 1,
              textTransform: 'uppercase', fontWeight: 600, marginBottom: 8,
            }}>
              <span style={{ color: `oklch(0.45 0.14 ${hue})` }}>{m.ic}</span>
              {m.l}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{m.v}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{m.s}</div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {state === 'confirmed' ? (
          <>
            <button onClick={onViewTicket} style={{
              padding: '15px 28px', borderRadius: 999,
              background: `oklch(0.35 0.14 ${hue})`, color: '#fff',
              fontSize: 15, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <IconQR size={17}/>
              عرض تذكرتي
            </button>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: 'var(--ink-2)', fontWeight: 500,
              padding: '8px 14px',
              background: `oklch(0.96 0.05 155)`,
              color: `oklch(0.4 0.14 155)`,
              borderRadius: 999,
            }}>
              <IconCheckCircle size={15} stroke={2.2}/>
              مقعدك محفوظ · رقم التذكرة TH-2026-0241
            </div>
          </>
        ) : state === 'cancelled' ? (
          <>
            <button onClick={onConfirm} style={{
              padding: '15px 28px', borderRadius: 999,
              background: 'var(--ink)', color: '#fff',
              fontSize: 15, fontWeight: 600,
            }}>
              استرجع مقعدك
            </button>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              ألغيت حضورك · يمكنك استرجاعه حتى 17 يونيو
            </div>
          </>
        ) : (
          <>
            <button onClick={onConfirm} style={{
              padding: '15px 28px', borderRadius: 999,
              background: 'var(--ink)', color: '#fff',
              fontSize: 15, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <IconCheck size={17} stroke={2.5}/>
              أكّد حضورك · مجّاناً
            </button>
            <button style={{
              padding: '15px 24px', borderRadius: 999,
              background: '#fff',
              border: '1px solid var(--line-2)',
              color: 'var(--ink)',
              fontSize: 15, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <IconCalendar size={16}/>
              أضف إلى تقويمي
            </button>
            <div style={{
              fontSize: 12.5, color: 'var(--muted)',
              marginInlineStart: 8,
            }}>
              <span style={{ color: `oklch(0.4 0.14 ${hue})`, fontWeight: 600 }}>238</span> / 324 مقعد متاح
            </div>
          </>
        )}
      </div>
    </div>
  </section>
);

// =============== CONFIRMED STATUS BAR (ticket strip) ===============
const LpConfirmedStatus = ({ hue, onModify, onCancel }) => (
  <section style={{
    padding: '24px 36px',
    background: `oklch(0.98 0.02 ${hue})`,
    borderTop: `1px solid oklch(0.9 0.04 ${hue})`,
    borderBottom: `1px solid oklch(0.9 0.04 ${hue})`,
  }}>
    <div style={{
      maxWidth: 1040, margin: '0 auto',
      display: 'grid', gridTemplateColumns: '140px 1fr auto',
      gap: 24, alignItems: 'center',
    }}>
      {/* QR */}
      <div style={{
        position: 'relative',
        background: '#fff',
        padding: 12,
        borderRadius: 12,
        border: '1px solid var(--line)',
        aspectRatio: '1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <QrPattern hue={hue} size={100}/>
      </div>

      {/* Details */}
      <div>
        <div className="mono" style={{
          fontSize: 10.5, letterSpacing: 1.5, textTransform: 'uppercase',
          color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600, marginBottom: 8,
        }}>
          تذكرة الدخول · TH-2026-0241
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, marginBottom: 8 }}>
          محمد الغامدي · سأحضر
        </div>
        <div style={{
          display: 'flex', gap: 24, fontSize: 13, color: 'var(--ink-2)',
          flexWrap: 'wrap',
        }}>
          <span><strong style={{ fontWeight: 600 }}>الخميس 18 يونيو</strong> · 6:00م</span>
          <span style={{ color: 'var(--line-2)' }}>·</span>
          <span>مقعد <span className="mono">B-14</span> · الجلسة الرئيسية</span>
          <span style={{ color: 'var(--line-2)' }}>·</span>
          <span>+1 مرافق</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
        <button style={{
          padding: '10px 18px', borderRadius: 999,
          background: '#fff', color: 'var(--ink)',
          border: '1px solid var(--line-2)',
          fontSize: 13, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          justifyContent: 'center',
        }}>
          <IconDownload size={14} stroke={2}/>
          حفظ التذكرة
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onModify} style={{
            flex: 1,
            padding: '8px 14px', borderRadius: 999,
            background: 'transparent', color: 'var(--ink-2)',
            border: '1px solid var(--line-2)',
            fontSize: 12, fontWeight: 500,
          }}>
            تعديل
          </button>
          <button onClick={onCancel} style={{
            flex: 1,
            padding: '8px 14px', borderRadius: 999,
            background: 'transparent', color: 'oklch(0.5 0.15 25)',
            border: '1px solid oklch(0.88 0.08 25)',
            fontSize: 12, fontWeight: 500,
          }}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </section>
);

const LpCancelledStatus = ({ hue, onRejoin }) => (
  <section style={{
    padding: '20px 36px',
    background: 'oklch(0.98 0.015 25)',
    borderTop: '1px solid oklch(0.9 0.05 25)',
    borderBottom: '1px solid oklch(0.9 0.05 25)',
  }}>
    <div style={{
      maxWidth: 1040, margin: '0 auto',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: '#fff', border: '1px solid oklch(0.9 0.06 25)',
        color: 'oklch(0.5 0.15 25)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconX size={18} stroke={2}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600 }}>
          ألغيت حضورك · مقعدك متاح الآن للقائمة الانتظار
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
          يمكنك استرجاعه حتى 17 يونيو، ما لم تُحجز المقاعد بالكامل.
        </div>
      </div>
      <button onClick={onRejoin} style={{
        padding: '10px 18px', borderRadius: 999,
        background: 'var(--ink)', color: '#fff',
        fontSize: 13, fontWeight: 600,
      }}>
        استرجع مقعدي
      </button>
    </div>
  </section>
);

window.LandingPageTemplate = LandingPageTemplate;
window.LpQrPattern = () => null; // placeholder export marker
