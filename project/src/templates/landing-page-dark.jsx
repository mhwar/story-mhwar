// Landing Page v2 — Dark, mobile-first, inspired by uploaded reference
// Significantly elevated: real hero image placeholder, refined chips, organizer messaging,
// richer sections, sharper hierarchy · Kept as a separate template; original v1 stays intact.

const { useState: useStateLP2 } = React;

const LandingPageDarkTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const [state, setState] = useStateLP2('browse'); // browse | confirmed
  const [showMessage, setShowMessage] = useStateLP2(false);

  return (
    <div style={{
      background: '#0a0a0c',
      color: '#f4f3ef',
      minHeight: '100%',
      fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top bar */}
      <LpDarkTopBar />

      {/* Hero with event image */}
      <LpDarkHero hue={hue} />

      {/* Title + chips */}
      <div style={{ padding: '0 16px 16px' }}>
        <h1 style={{
          fontSize: 24, fontWeight: 700, letterSpacing: -0.5,
          lineHeight: 1.25, margin: '0 0 12px',
          textWrap: 'balance',
        }}>
          انطلاق محور · ليلة البدايات
        </h1>
        <p style={{
          fontSize: 13, color: 'rgba(244,243,239,0.65)', lineHeight: 1.75,
          margin: '0 0 16px', textWrap: 'pretty',
        }}>
          نحتفل بإطلاق محور رسمياً · مساء مفتوح للمؤسّسين الأوائل والمجتمع · حوارات قصيرة، عشاء على طاولات صغيرة، وإعلان الخارطة القادمة.
        </p>

        {/* Chips row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
        }}>
          <DarkChip
            icon={<IconCalendar size={13} stroke={2}/>}
            label="الجمعة · 29 شوال 1447هـ"
          />
          <DarkChip
            icon={<span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'oklch(0.72 0.18 155)',
              boxShadow: '0 0 0 3px oklch(0.72 0.18 155 / 0.2)',
            }}/>}
            label="قائمة · التسجيل مفتوح"
            color="green"
          />
          <DarkChip
            icon={<IconClock size={13} stroke={2}/>}
            label="12:30م — 4:00م"
          />
          <DarkChip
            icon={<IconPin size={13} stroke={2}/>}
            label="حضوري · الرياض"
          />
        </div>
      </div>

      {/* Organizer card */}
      <div style={{ padding: '0 16px 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `linear-gradient(135deg, oklch(0.55 0.14 ${hue}) 0%, oklch(0.35 0.14 ${hue - 20}) 100%)`,
            color: '#fff', fontWeight: 700, fontSize: 17,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>م</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{
              fontSize: 9.5, letterSpacing: 1.5, textTransform: 'uppercase',
              color: 'rgba(244,243,239,0.45)', marginBottom: 4,
            }}>المنظّم</div>
            <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 2 }}>مشتركي محور</div>
            <div style={{ fontSize: 11.5, color: 'rgba(244,243,239,0.5)' }}>Mhwar · فريق المنصّة</div>
          </div>
          <button onClick={() => setShowMessage(true)} style={{
            width: 38, height: 38, borderRadius: 11,
            background: `oklch(0.3 0.14 ${hue})`,
            border: `1px solid oklch(0.45 0.14 ${hue})`,
            color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }} title="مراسلة المنظّم">
            <IconMsg size={16} stroke={2}/>
          </button>
        </div>
      </div>

      {/* About */}
      <DarkSection num="01" hue={hue} title="عن الفعالية">
        <p style={{ fontSize: 14, color: 'rgba(244,243,239,0.75)', lineHeight: 1.9, margin: 0, textWrap: 'pretty' }}>
          ليلة نفتح فيها الأبواب لأول مرة · نعرض رؤيتنا، نسمع منكم، ونبدأ بناء ما سيأتي معاً · مقاعد محدودة لنحافظ على دفء الحوار.
        </p>
        <div style={{
          marginTop: 14,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        }}>
          {[
            { n: '80', l: 'مقعد' },
            { n: '6', l: 'متحدّثين' },
            { n: '3.5', l: 'ساعات' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '12px 10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 22, fontWeight: 700, letterSpacing: -0.8,
                color: `oklch(0.82 0.14 ${hue})`,
              }}>{s.n}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(244,243,239,0.5)', marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </DarkSection>

      {/* Location & join */}
      <DarkSection num="02" hue={hue} title="الموقع والانضمام">
        <div style={{
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 10,
        }}>
          <IconPin size={16} stroke={2} style={{ color: `oklch(0.75 0.14 ${hue})`, flexShrink: 0 }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>مقرّ محور · الرياض</div>
            <div style={{ fontSize: 11.5, color: 'rgba(244,243,239,0.5)', marginTop: 2 }}>حيّ الملقا · شارع الأنصار</div>
          </div>
          <button style={{
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', fontSize: 11.5, fontWeight: 500,
          }}>خريطة</button>
        </div>
        <div style={{
          padding: '12px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <IconLink size={14} stroke={2} style={{ color: 'rgba(244,243,239,0.5)', flexShrink: 0 }}/>
          <div className="mono" style={{
            fontSize: 11.5, color: 'rgba(244,243,239,0.65)',
            flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            mhwar.sa/e/VdgZrNFKyrC6
          </div>
          <button style={{
            padding: '5px 10px', borderRadius: 8,
            background: 'rgba(255,255,255,0.08)',
            color: '#fff', fontSize: 10.5, fontWeight: 500,
          }}>نسخ</button>
        </div>
      </DarkSection>

      {/* Speakers */}
      <DarkSection num="03" hue={hue} title="المتحدّثون">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            { n: 'فهد العتيبي', r: 'مؤسّس محور', h: 245 },
            { n: 'سارة الزهراني', r: 'مديرة المنتج', h: 35 },
            { n: 'عبدالله المالكي', r: 'مستشار نمو', h: 155 },
            { n: 'نوف القحطاني', r: 'رئيسة التصميم', h: 285 },
          ].map((s, i) => (
            <div key={i} style={{
              padding: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, oklch(0.65 0.14 ${s.h}) 0%, oklch(0.4 0.14 ${s.h}) 100%)`,
                color: '#fff', fontWeight: 700, fontSize: 13,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{s.n.trim()[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.n}</div>
                <div style={{ fontSize: 10, color: 'rgba(244,243,239,0.5)', marginTop: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.r}</div>
              </div>
            </div>
          ))}
        </div>
      </DarkSection>

      {/* Attachments */}
      <DarkSection num="04" hue={hue} title="المرفقات">
        {[
          { t: 'جدول الفعاليّة · PDF', s: '240KB · آخر تحديث اليوم', icon: 'pdf' },
          { t: 'كتيّب التعريف · PDF', s: '1.2MB · 12 صفحة', icon: 'pdf' },
          { t: 'خارطة الوصول', s: 'صورة · 480KB', icon: 'img' },
        ].map((att, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: att.icon === 'pdf' ? 'oklch(0.4 0.14 25 / 0.4)' : 'oklch(0.4 0.14 220 / 0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: att.icon === 'pdf' ? 'oklch(0.85 0.14 25)' : 'oklch(0.85 0.14 220)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
              flexShrink: 0,
            }}>{att.icon === 'pdf' ? 'PDF' : 'IMG'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{att.t}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(244,243,239,0.45)', marginTop: 2 }}>{att.s}</div>
            </div>
            <IconDownload size={15} stroke={2} style={{ color: 'rgba(244,243,239,0.5)' }}/>
          </div>
        ))}
      </DarkSection>

      {/* Schedule */}
      <DarkSection num="05" hue={hue} title="جدول الفعاليّة">
        {[
          { t: '12:30م', title: 'قهوة الترحيب', sub: 'تسجيل واستلام الشارة' },
          { t: '1:00م', title: 'كلمة الافتتاح', sub: 'فهد العتيبي · 15 دقيقة' },
          { t: '1:30م', title: 'جلسة · رؤية محور', sub: '3 متحدّثين · حوار مفتوح' },
          { t: '2:30م', title: 'العشاء · طاولات صغيرة', sub: '6 حضور لكل طاولة' },
          { t: '3:45م', title: 'إعلان الخارطة القادمة', sub: 'وختام الفعاليّة' },
        ].map((it, i, arr) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '60px 14px 1fr',
            gap: 10, alignItems: 'flex-start',
            paddingTop: i === 0 ? 0 : 12,
            paddingBottom: i === arr.length - 1 ? 0 : 12,
          }}>
            <div className="mono" style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
              color: 'rgba(244,243,239,0.85)',
              paddingTop: 1,
            }}>{it.t}</div>
            <div style={{ position: 'relative', height: '100%', minHeight: 32 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: `oklch(0.7 0.14 ${hue})`,
                boxShadow: `0 0 0 3px oklch(0.7 0.14 ${hue} / 0.2)`,
                marginTop: 5, marginInline: 'auto',
              }}/>
              {i < arr.length - 1 && (
                <div style={{
                  position: 'absolute', top: 16, bottom: -12, left: '50%',
                  width: 1, background: 'rgba(255,255,255,0.08)',
                }}/>
              )}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{it.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(244,243,239,0.5)', lineHeight: 1.5 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </DarkSection>

      {/* Registration card */}
      <div style={{ padding: '14px 16px 20px' }}>
        <div style={{
          background: `linear-gradient(180deg, oklch(0.2 0.08 ${hue}) 0%, oklch(0.13 0.05 ${hue}) 100%)`,
          border: `1px solid oklch(0.3 0.1 ${hue})`,
          borderRadius: 18,
          padding: 20,
        }}>
          <div className="mono" style={{
            fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
            color: `oklch(0.8 0.14 ${hue})`, fontWeight: 600, marginBottom: 10,
          }}>
            التسجيل في الفعاليّة
          </div>
          <div style={{
            fontSize: 14.5, lineHeight: 1.7, color: 'rgba(244,243,239,0.85)',
            marginBottom: 16, textWrap: 'pretty',
          }}>
            مرحباً · للانضمام إلى الفعاليّة، أكّد حضورك ببريدك الإلكتروني لتصلك التذكرة والتحديثات.
          </div>

          <div style={{
            padding: '12px 14px',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <IconMail size={15} stroke={2} style={{ color: 'rgba(244,243,239,0.5)' }}/>
            <input
              type="email"
              defaultValue="info@mhwar.sa"
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: '#fff', fontSize: 13, fontFamily: 'inherit',
                outline: 'none', direction: 'ltr', textAlign: 'right',
              }}
            />
          </div>

          {state === 'browse' ? (
            <button onClick={() => setState('confirmed')} style={{
              width: '100%',
              padding: '14px 20px', borderRadius: 12,
              background: '#fff', color: 'var(--ink)',
              fontSize: 14.5, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <IconCheck size={15} stroke={2.5}/>
              تأكيد الحضور
            </button>
          ) : (
            <div style={{
              padding: '14px',
              background: 'oklch(0.25 0.1 155)',
              border: '1px solid oklch(0.4 0.14 155)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <IconCheckCircle size={18} stroke={2.2} style={{ color: 'oklch(0.82 0.18 155)' }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>حضورك مؤكّد · MHW-041</div>
                <div style={{ fontSize: 11, color: 'rgba(244,243,239,0.65)', marginTop: 1 }}>
                  التذكرة أُرسلت إلى info@mhwar.sa
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 10.5, color: 'rgba(244,243,239,0.4)',
        }}>
          <span>يتم استضافة الحدث بواسطة</span>
          <MhwarMark size={12}/>
        </div>
      </div>

      {/* Message organizer modal */}
      {showMessage && (
        <DarkMessageModal hue={hue} onClose={() => setShowMessage(false)}/>
      )}
    </div>
  );
};

// ============ Helpers ============

const LpDarkTopBar = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px',
    position: 'sticky', top: 0, zIndex: 20,
    background: 'rgba(10,10,12,0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  }}>
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: 11, color: 'rgba(244,243,239,0.75)',
    }}>
      <IconUser size={11} stroke={2}/>
      مشتركة
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <MhwarGlyph size={20}/>
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.3 }}>Mhwar</span>
    </div>
  </div>
);

const LpDarkHero = ({ hue }) => (
  <div style={{ padding: '12px 16px 16px' }}>
    <div style={{
      position: 'relative',
      aspectRatio: '16 / 10',
      borderRadius: 18,
      overflow: 'hidden',
      background: `linear-gradient(135deg, oklch(0.35 0.14 ${hue}) 0%, oklch(0.15 0.1 ${hue - 30}) 50%, oklch(0.08 0.04 ${hue + 30}) 100%)`,
    }}>
      {/* Decorative grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }} viewBox="0 0 400 250">
        <defs>
          <pattern id="grid-d" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="400" height="250" fill="url(#grid-d)"/>
      </svg>

      {/* Glow */}
      <div aria-hidden style={{
        position: 'absolute', top: '-30%', insetInlineEnd: '-20%',
        width: 280, height: 280, borderRadius: '50%',
        background: `radial-gradient(circle, oklch(0.85 0.18 ${hue + 20} / 0.5) 0%, transparent 60%)`,
      }}/>

      {/* Abstract shape — big M */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ maxWidth: 200 }}>
          <defs>
            <linearGradient id="mh-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)"/>
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="100" rx="70" ry="48"
            transform="rotate(-15 100 100)"
            stroke="url(#mh-grad)" strokeWidth="3" fill="none"/>
          <ellipse cx="100" cy="100" rx="50" ry="32"
            transform="rotate(-15 100 100)"
            stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      {/* Stats chips */}
      <div style={{
        position: 'absolute', top: 14, insetInlineStart: 14,
        display: 'flex', gap: 6,
      }}>
        <div className="mono" style={{
          padding: '5px 10px', borderRadius: 999,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: 10, color: '#fff', letterSpacing: 1,
        }}>الإطلاق الرسمي</div>
      </div>

      {/* Title block */}
      <div style={{
        position: 'absolute', insetInlineStart: 18, insetInlineEnd: 18, bottom: 16,
        color: '#fff',
      }}>
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.7)',
          marginBottom: 6, letterSpacing: 0.3,
        }}>صورة الفعاليّة</div>
        <div style={{
          fontSize: 20, fontWeight: 700, letterSpacing: -0.4,
          lineHeight: 1.3, textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}>
          ليلة نلتقي فيها لأوّل مرة
        </div>
      </div>
    </div>
  </div>
);

const DarkChip = ({ icon, label, color }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 11px', borderRadius: 999,
    background: color === 'green'
      ? 'oklch(0.3 0.12 155 / 0.3)'
      : 'rgba(255,255,255,0.05)',
    border: color === 'green'
      ? '1px solid oklch(0.4 0.14 155 / 0.5)'
      : '1px solid rgba(255,255,255,0.08)',
    fontSize: 11.5,
    color: color === 'green' ? 'oklch(0.85 0.16 155)' : 'rgba(244,243,239,0.85)',
    fontWeight: 500,
  }}>
    {icon}
    <span>{label}</span>
  </div>
);

const DarkSection = ({ num, hue, title, children }) => (
  <div style={{ padding: '18px 16px 0' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
    }}>
      <div style={{
        width: 3, height: 18, borderRadius: 2,
        background: `linear-gradient(180deg, oklch(0.75 0.14 ${hue}) 0%, oklch(0.5 0.14 ${hue}) 100%)`,
      }}/>
      <div className="mono" style={{
        fontSize: 10, color: 'rgba(244,243,239,0.4)',
        letterSpacing: 1.5, fontWeight: 600,
      }}>{num}</div>
      <h2 style={{
        fontSize: 16, fontWeight: 700, letterSpacing: -0.3,
        margin: 0, color: '#fff',
      }}>{title}</h2>
    </div>
    <div style={{ paddingBottom: 4 }}>
      {children}
    </div>
  </div>
);

const DarkMessageModal = ({ hue, onClose }) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 50,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  }}>
    <div style={{
      width: '100%',
      background: '#14141a',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px 20px 0 0',
      padding: 20,
      boxShadow: '0 -20px 40px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        width: 40, height: 4, borderRadius: 2,
        background: 'rgba(255,255,255,0.15)',
        margin: '0 auto 18px',
      }}/>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: `linear-gradient(135deg, oklch(0.55 0.14 ${hue}) 0%, oklch(0.35 0.14 ${hue - 20}) 100%)`,
          color: '#fff', fontWeight: 700, fontSize: 15,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>م</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>مراسلة المنظّم</div>
          <div style={{ fontSize: 11, color: 'rgba(244,243,239,0.5)', marginTop: 2 }}>
            عادةً يردّ خلال ساعتين · ما عدا عطلة نهاية الأسبوع
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(244,243,239,0.7)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconX size={14} stroke={2}/>
        </button>
      </div>

      {/* Quick topics */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14,
      }}>
        {['سؤال عام', 'الوصول للمكان', 'طلب خاص', 'إلغاء الحضور'].map((t, i) => (
          <button key={i} style={{
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(244,243,239,0.8)',
            fontSize: 11.5,
          }}>{t}</button>
        ))}
      </div>

      <textarea
        placeholder="اكتب رسالتك هنا · ستصل مباشرة لفريق المنظّم"
        rows={4}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          color: '#fff',
          fontSize: 13.5, lineHeight: 1.6,
          fontFamily: 'inherit',
          resize: 'none',
          outline: 'none',
        }}
      />

      <button style={{
        width: '100%', marginTop: 12,
        padding: '13px', borderRadius: 12,
        background: '#fff', color: 'var(--ink)',
        fontSize: 14, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <IconMsg size={14} stroke={2}/>
        إرسال الرسالة
      </button>
    </div>
  </div>
);

window.LandingPageDarkTemplate = LandingPageDarkTemplate;
