// Landing page — sections part 2 (about, agenda, speakers, venue, community, FAQ, CTA, footer)
// Plus modals (confirm, modify) and QR pattern

// ============ QR pattern (deterministic pseudo-random) ============
const QrPattern = ({ size = 100, hue = 245 }) => {
  const grid = 17;
  const cell = size / grid;
  const cells = [];
  // Seeded pattern
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const isCorner =
        (r < 7 && c < 7) ||
        (r < 7 && c >= grid - 7) ||
        (r >= grid - 7 && c < 7);
      if (isCorner) continue;
      // Pseudo-random based on r,c
      const v = (r * 31 + c * 17 + r * c * 3) % 100;
      if (v < 45) cells.push({ r, c });
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      {/* 3 finder squares */}
      {[[0,0],[0,grid-7],[grid-7,0]].map(([r,c],i) => (
        <g key={i}>
          <rect x={c*cell} y={r*cell} width={cell*7} height={cell*7} fill="var(--ink)"/>
          <rect x={(c+1)*cell} y={(r+1)*cell} width={cell*5} height={cell*5} fill="#fff"/>
          <rect x={(c+2)*cell} y={(r+2)*cell} width={cell*3} height={cell*3} fill="var(--ink)"/>
        </g>
      ))}
      {cells.map((p, i) => (
        <rect key={i} x={p.c*cell} y={p.r*cell} width={cell} height={cell} fill="var(--ink)"/>
      ))}
    </svg>
  );
};
window.QrPattern = QrPattern;

// ============ ABOUT ============
const LpAbout = ({ hue }) => (
  <section id="about" style={{ padding: '72px 36px', maxWidth: 1040, margin: '0 auto' }}>
    <div className="mono" style={{
      fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
      color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600, marginBottom: 14,
    }}>01 · عن الملتقى</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
      <h2 style={{
        fontSize: 38, lineHeight: 1.2, fontWeight: 700,
        margin: 0, letterSpacing: -0.8, textWrap: 'balance',
      }}>
        نلتقي لنصنع فرقاً · لا لمجرّد الحضور
      </h2>
      <div>
        <p style={{ fontSize: 15.5, lineHeight: 1.9, color: 'var(--ink-2)', margin: '0 0 18px', textWrap: 'pretty' }}>
          على مدى ثلاث نسخ، جمع ملتقى ثراء أكثر من 900 شاب وشابّة من ثماني مناطق · هذه السنة نرفع السقف · 12 جلسة حوار، 3 ورش مصغّرة، وجلسة عشاء تُدار حولها طاولات صغيرة يجمع فيها كلّ حاضر بثلاثة لم يلتقِهم من قبل.
        </p>
        <p style={{ fontSize: 15.5, lineHeight: 1.9, color: 'var(--ink-2)', margin: 0, textWrap: 'pretty' }}>
          الحضور مجاني، بدعم من هيئة تطوير منطقة عسير · لكن المقاعد محدودة عمداً، لنحمي جودة المحادثة.
        </p>
      </div>
    </div>
    {/* Numbers */}
    <div style={{
      marginTop: 48, padding: '32px 0',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
    }}>
      {[
        { n: '324', l: 'مدعوّ مختار' },
        { n: '18', l: 'متحدّث' },
        { n: '12', l: 'جلسة حوار' },
        { n: '4', l: 'ساعات كثيفة' },
      ].map((s, i) => (
        <div key={i}>
          <div style={{
            fontSize: 52, fontWeight: 700, letterSpacing: -2,
            lineHeight: 1, color: `oklch(0.35 0.14 ${hue})`,
          }}>{s.n}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>{s.l}</div>
        </div>
      ))}
    </div>
  </section>
);
window.LpAbout = LpAbout;

// ============ AGENDA ============
const LpAgenda = ({ hue }) => {
  const items = [
    { t: '5:30م', title: 'الأبواب مفتوحة · قهوة الترحيب', sub: 'تسجيل واستلام الشارة · مساحة مفتوحة للتعارف', type: 'open' },
    { t: '6:15م', title: 'كلمة الافتتاح', sub: 'سارة الزهراني · مديرة المجتمع', type: 'keynote' },
    { t: '6:30م', title: 'جلسة حوار · مستقبل صناعة المحتوى المحلي', sub: '4 متحدّثين · 45 دقيقة + أسئلة', type: 'panel' },
    { t: '7:30م', title: 'استراحة وورشتان متوازيتان', sub: 'أ · صناعة سرد قصصي · ب · تحويل الفكرة لمشروع', type: 'workshop' },
    { t: '8:30م', title: 'عشاء على طاولات صغيرة', sub: '6 حضور لكل طاولة · منسّق حوار لكل طاولة', type: 'meal' },
    { t: '9:30م', title: 'كلمة ختام + إعلان النسخة القادمة', sub: 'تركي الشهري', type: 'keynote' },
    { t: '10:00م', title: 'نهاية رسميّة · ردهة مفتوحة حتى 11م', sub: 'استمرار المحادثات على الشاي والحلوى', type: 'open' },
  ];
  const typeColor = {
    keynote: 35, panel: hue, workshop: 155, meal: 50, open: 220
  };
  return (
    <section id="agenda" style={{
      background: 'var(--warm)',
      padding: '72px 36px',
    }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600, marginBottom: 14,
        }}>02 · الأجندة</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 60, marginBottom: 40, alignItems: 'end' }}>
          <h2 style={{
            fontSize: 38, lineHeight: 1.2, fontWeight: 700, margin: 0, letterSpacing: -0.8,
          }}>
            أربع ساعات · سبع محطّات
          </h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink-2)', margin: 0, textWrap: 'pretty' }}>
            الأجندة مُصمَّمة لتتنفّس · حوارات قصيرة، فواصل طويلة، ومساحة تعارف في كل محطّة · لا شيء يُستعجَل.
          </p>
        </div>

        <div>
          {items.map((it, i) => {
            const h = typeColor[it.type] ?? hue;
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '90px 16px 1fr auto',
                gap: 20, alignItems: 'center',
                padding: '20px 0',
                borderTop: i > 0 ? '1px solid oklch(0.9 0.015 50)' : 'none',
              }}>
                <div>
                  <div className="mono" style={{
                    fontSize: 14, fontWeight: 600, letterSpacing: 0.3,
                    color: 'var(--ink)',
                  }}>{it.t}</div>
                </div>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: `oklch(0.6 0.14 ${h})`,
                  boxShadow: `0 0 0 4px oklch(0.95 0.04 ${h})`,
                }}/>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2, marginBottom: 3 }}>{it.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{it.sub}</div>
                </div>
                <div className="mono" style={{
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
                  padding: '4px 10px', borderRadius: 999,
                  background: `oklch(0.96 0.04 ${h})`,
                  color: `oklch(0.4 0.14 ${h})`,
                  fontWeight: 600,
                }}>
                  {{keynote: 'كلمة', panel: 'جلسة', workshop: 'ورشة', meal: 'عشاء', open: 'ترحيب'}[it.type]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
window.LpAgenda = LpAgenda;

// ============ SPEAKERS ============
const LpSpeakers = ({ hue }) => {
  const speakers = [
    { n: 'سارة الزهراني', r: 'مديرة المجتمع · ثراء', h: 35 },
    { n: 'تركي الشهري', r: 'مستشار أثر اجتماعي', h: 155 },
    { n: 'نورة القحطاني', r: 'كاتبة ومُحاوِرة', h: 285 },
    { n: 'عبدالله الغامدي', r: 'مؤسّس منصّة محلية', h: 50 },
    { n: 'ريما العسيري', r: 'باحثة في صناعة المحتوى', h: 220 },
    { n: 'فيصل المالكي', r: 'ريادي أعمال', h: 10 },
  ];
  return (
    <section id="speakers" style={{ padding: '72px 36px', maxWidth: 1040, margin: '0 auto' }}>
      <div className="mono" style={{
        fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
        color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600, marginBottom: 14,
      }}>03 · المتحدّثون</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 60, marginBottom: 40, alignItems: 'end' }}>
        <h2 style={{ fontSize: 38, lineHeight: 1.2, fontWeight: 700, margin: 0, letterSpacing: -0.8 }}>
          أصوات تستحقّ أن تُسمع
        </h2>
        <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink-2)', margin: 0, textWrap: 'pretty' }}>
          18 متحدّثاً من تخصّصات متقاطعة · اخترنا من يملكون شيئاً ليقولوه، لا من يملكون لقباً فحسب.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {speakers.map((s, i) => (
          <div key={i} style={{
            padding: 20,
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 16,
            transition: 'transform 0.2s',
          }}>
            <div style={{
              aspectRatio: '1',
              borderRadius: 12,
              background: `linear-gradient(135deg, oklch(0.85 0.1 ${s.h}) 0%, oklch(0.55 0.14 ${s.h}) 100%)`,
              marginBottom: 16,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 72, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
                letterSpacing: -2,
              }}>{s.n.trim()[0]}</div>
              <div className="mono" style={{
                position: 'absolute', bottom: 10, insetInlineStart: 12,
                fontSize: 9.5, letterSpacing: 1.5, textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.85)',
              }}>صورة المتحدّث</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2, marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{s.r}</div>
          </div>
        ))}
      </div>
      <a href="#" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        marginTop: 24, fontSize: 13.5,
        color: `oklch(0.35 0.14 ${hue})`, fontWeight: 600,
      }}>
        شاهد جميع المتحدّثين الثمانية عشر <IconArrowL size={14} stroke={2}/>
      </a>
    </section>
  );
};
window.LpSpeakers = LpSpeakers;

// ============ VENUE ============
const LpVenue = ({ hue }) => (
  <section id="venue" style={{
    background: '#14130f', color: '#fff',
    padding: '72px 36px',
  }}>
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div className="mono" style={{
        fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
        color: `oklch(0.75 0.12 ${hue})`, fontWeight: 600, marginBottom: 14,
      }}>04 · المكان</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: 38, lineHeight: 1.15, fontWeight: 700, margin: '0 0 20px', letterSpacing: -0.8 }}>
            مركز الملك خالد الحضاري · أبها
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(255,255,255,0.72)', margin: '0 0 28px', textWrap: 'pretty' }}>
            قاعة السروات · الدور الثاني · موقف سيارات مجاني · قاعة مؤهّلة بالكامل لذوي الإعاقة · خدمة تعهيد مواصلات من فندقَي الشريك بالمجان.
          </p>

          <div style={{ display: 'grid', gap: 14 }}>
            {[
              { l: 'الموقع', v: 'مركز الملك خالد الحضاري · أبها' },
              { l: 'القاعة', v: 'قاعة السروات · الدور الثاني' },
              { l: 'المواقف', v: 'مجاناً · 600 موقف' },
              { l: 'الوصول', v: 'مؤهّل لذوي الإعاقة الحركية والبصرية' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '90px 1fr', gap: 16,
                paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>{r.l}</div>
                <div style={{ fontSize: 13.5, color: '#fff' }}>{r.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button style={{
              padding: '11px 20px', borderRadius: 999,
              background: '#fff', color: 'var(--ink)',
              fontSize: 13, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <IconPin size={14} stroke={2}/>
              افتح على الخريطة
            </button>
            <button style={{
              padding: '11px 20px', borderRadius: 999,
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: 13, fontWeight: 500,
            }}>
              طلب توصيل من الفندق
            </button>
          </div>
        </div>

        {/* Map placeholder */}
        <div style={{
          aspectRatio: '4 / 5',
          borderRadius: 16,
          background: `
            linear-gradient(135deg, oklch(0.25 0.08 ${hue}) 0%, oklch(0.18 0.06 ${hue + 20}) 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Mock streets */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 500">
            <g stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none">
              <path d="M0 120 L400 100"/>
              <path d="M0 220 L400 190"/>
              <path d="M0 320 L400 310"/>
              <path d="M0 420 L400 400"/>
              <path d="M80 0 L100 500"/>
              <path d="M200 0 L220 500"/>
              <path d="M320 0 L330 500"/>
            </g>
            <g stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none">
              <path d="M0 250 L400 240"/>
              <path d="M250 0 L265 500"/>
            </g>
          </svg>
          {/* Pin */}
          <div style={{
            position: 'absolute', top: '45%', insetInlineEnd: '40%',
            transform: 'translate(50%, -50%)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: `oklch(0.65 0.2 ${hue})`,
              boxShadow: `0 0 0 8px oklch(0.65 0.2 ${hue} / 0.2), 0 0 0 16px oklch(0.65 0.2 ${hue} / 0.1)`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              <IconPin size={22} stroke={2}/>
            </div>
          </div>
          <div style={{
            position: 'absolute', bottom: 16, insetInlineStart: 16,
            padding: '10px 14px',
            background: 'rgba(20,19,15,0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div className="mono" style={{
              fontSize: 9.5, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
            }}>أبها · 18.2164° N</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, color: '#fff' }}>مركز الملك خالد</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
window.LpVenue = LpVenue;

// ============ COMMUNITY ============
const LpCommunity = ({ hue }) => (
  <section style={{ padding: '72px 36px', maxWidth: 1040, margin: '0 auto' }}>
    <div className="mono" style={{
      fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
      color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600, marginBottom: 14,
    }}>05 · المجتمع</div>
    <h2 style={{ fontSize: 38, lineHeight: 1.15, fontWeight: 700, margin: '0 0 40px', letterSpacing: -0.8, maxWidth: 700 }}>
      أصوات من النسخ السابقة
    </h2>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {[
        { q: 'أول مرّة أحضر فعالية لا أشعر فيها بالغربة · وجدت أصدقاء قبل أن أجد فكرة.', n: 'نوف · طالبة تصميم', h: 35 },
        { q: 'بعد الجلسة بأسبوع، تواصل معي أحد الحضور وبدأنا مشروعاً مشتركاً.', n: 'عبدالله · ريادي', h: 155 },
        { q: 'الطاولات الصغيرة غيّرت فكرتي عن الفعاليات · لا مكان للمتفرّج هنا.', n: 'ريما · كاتبة', h: 245 },
      ].map((t, i) => (
        <div key={i} style={{
          padding: 24,
          background: `oklch(0.98 0.02 ${t.h})`,
          borderRadius: 16,
          border: `1px solid oklch(0.93 0.03 ${t.h})`,
        }}>
          <div style={{
            fontSize: 40, lineHeight: 0.8, color: `oklch(0.55 0.14 ${t.h})`,
            fontWeight: 700, marginBottom: 12,
          }}>"</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink-2)', marginBottom: 16, textWrap: 'pretty' }}>
            {t.q}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 500 }}>— {t.n}</div>
        </div>
      ))}
    </div>
  </section>
);
window.LpCommunity = LpCommunity;

// ============ FAQ ============
const LpFaq = ({ hue }) => {
  const [open, setOpen] = React.useState(0);
  const faqs = [
    { q: 'هل الحضور مجّاني فعلاً؟', a: 'نعم · بدعم من هيئة تطوير منطقة عسير · لا رسوم على التذكرة، وسيُقدَّم العشاء كاملاً.' },
    { q: 'أحضر لأول مرة · هل سأكون في مكاني؟', a: '42% من الحضور هم من يحضرون لأول مرة · خصّصنا مقعداً لكل قادم جديد على كل طاولة، وسيكون منسّق الطاولة في انتظارك.' },
    { q: 'هل يمكنني اصطحاب مرافق؟', a: 'نعم · يُمكنك تسجيل مرافق واحد عند تأكيد الحضور · نحتاج اسمه الكامل لإصدار شارة الدخول.' },
    { q: 'ماذا لو تغيّر ظرفي؟', a: 'يمكنك تعديل أو إلغاء حضورك حتى 17 يونيو الساعة 6م من هذه الصفحة نفسها · نُتيح مقعدك فوراً لقائمة الانتظار.' },
    { q: 'هل هناك بثّ مباشر؟', a: 'الكلمات والجلسات الرئيسية فقط · الورش والعشاء حضوريّان فقط، لأن تفاعلهما لا يمكن نقله · يُرسَل رابط البثّ قبل الفعالية بساعة.' },
    { q: 'قواعد التصوير؟', a: 'سيكون هناك مصوّر رسمي · إذا كنت تفضّل ألاّ تظهر، أخبر منسّق التسجيل عند الدخول وستحصل على شارة ملوّنة بشكل مختلف.' },
  ];
  return (
    <section id="faq" style={{
      background: 'var(--warm)',
      padding: '72px 36px',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600, marginBottom: 14, textAlign: 'center',
        }}>06 · أسئلة متكرّرة</div>
        <h2 style={{
          fontSize: 38, lineHeight: 1.15, fontWeight: 700, margin: '0 0 48px',
          letterSpacing: -0.8, textAlign: 'center',
        }}>
          ما الذي تحتاج معرفته قبل القدوم؟
        </h2>
        <div>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{
                background: '#fff',
                borderRadius: 14,
                border: '1px solid oklch(0.9 0.015 50)',
                marginBottom: 8,
                overflow: 'hidden',
              }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                  width: '100%', textAlign: 'right',
                  padding: '18px 22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 16,
                  fontSize: 15, fontWeight: 600,
                  color: 'var(--ink)',
                }}>
                  <span>{f.q}</span>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: isOpen ? `oklch(0.35 0.14 ${hue})` : `oklch(0.96 0.03 ${hue})`,
                    color: isOpen ? '#fff' : `oklch(0.4 0.14 ${hue})`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 400,
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 22px 20px',
                    fontSize: 14, lineHeight: 1.85, color: 'var(--ink-2)',
                    textWrap: 'pretty',
                  }}>{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
window.LpFaq = LpFaq;

// ============ CTA STRIP ============
const LpCtaStrip = ({ hue, state, onConfirm, onViewTicket }) => (
  <section style={{
    padding: '80px 36px',
    background: `linear-gradient(135deg, oklch(0.35 0.14 ${hue}) 0%, oklch(0.25 0.14 ${hue - 20}) 100%)`,
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div aria-hidden style={{
      position: 'absolute', top: '-40%', insetInlineEnd: '-10%',
      width: 400, height: 400, borderRadius: '50%',
      background: `radial-gradient(circle, oklch(0.75 0.15 ${hue + 30} / 0.4) 0%, transparent 70%)`,
    }}/>
    <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
      <div className="mono" style={{
        fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.65)', marginBottom: 16,
      }}>الخميس · 18 يونيو 2026</div>
      <h2 style={{ fontSize: 46, lineHeight: 1.1, fontWeight: 700, margin: '0 0 18px', letterSpacing: -1.2, textWrap: 'balance' }}>
        {state === 'confirmed' ? 'نراك هناك · مقعدك بانتظارك' : 'المقاعد تُحجَز بسرعة · احجز مقعدك الآن'}
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', margin: '0 0 32px', maxWidth: 520, marginInline: 'auto' }}>
        {state === 'confirmed'
          ? 'شاركها مع صديق قد يستفيد · كل مقعد نمنحه، نجد له قيمة.'
          : 'التسجيل يستغرق أقلّ من دقيقة · لا رسوم · لا بطاقة ائتمان · فقط اسمك وبريدك.'}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {state === 'confirmed' ? (
          <>
            <button onClick={onViewTicket} style={{
              padding: '16px 32px', borderRadius: 999,
              background: '#fff', color: `oklch(0.35 0.14 ${hue})`,
              fontSize: 15, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <IconQR size={16}/>
              عرض تذكرتي
            </button>
            <button style={{
              padding: '16px 28px', borderRadius: 999,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: 15, fontWeight: 500,
            }}>
              شارك الدعوة
            </button>
          </>
        ) : (
          <button onClick={onConfirm} style={{
            padding: '16px 36px', borderRadius: 999,
            background: '#fff', color: `oklch(0.35 0.14 ${hue})`,
            fontSize: 16, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <IconCheck size={16} stroke={2.5}/>
            أكّد حضوري · مجّاناً
          </button>
        )}
      </div>
    </div>
  </section>
);
window.LpCtaStrip = LpCtaStrip;

// ============ FOOTER ============
const LpFooter = ({ hue, clientName, parentOrg }) => (
  <footer style={{
    padding: '48px 36px 32px',
    background: '#fbfaf7',
    borderTop: '1px solid var(--line)',
  }}>
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40,
        paddingBottom: 32,
        borderBottom: '1px solid var(--line)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, oklch(0.55 0.14 ${hue}) 0%, oklch(0.35 0.14 ${hue - 20}) 100%)`,
              color: '#fff', fontWeight: 700, fontSize: 16,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>ث</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{clientName}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>المنظّم: {parentOrg}</div>
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0, maxWidth: 280 }}>
            مجتمع شبابي يصنع مساحات للحوار والعمل · من أبها، للسعودية.
          </p>
        </div>
        {[
          { t: 'الملتقى', l: ['عن الفعالية', 'الأجندة', 'المتحدّثون', 'المكان'] },
          { t: 'المجتمع', l: ['نشرتنا الشهرية', 'فعاليّات سابقة', 'كن متطوّعاً', 'كن راعياً'] },
          { t: 'تواصل', l: ['hello@thraa.sa', 'تويتر', 'إنستغرام', 'لينكدإن'] },
        ].map((col, i) => (
          <div key={i}>
            <div className="mono" style={{
              fontSize: 10.5, letterSpacing: 1.5, textTransform: 'uppercase',
              color: 'var(--muted)', fontWeight: 600, marginBottom: 14,
            }}>{col.t}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.l.map((link, j) => (
                <a key={j} href="#" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{link}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, flexWrap: 'wrap',
      }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
          © 2026 {clientName} · جميع الحقوق محفوظة
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>تُنظَّم عبر</span>
          <MhwarMark size={14}/>
        </div>
      </div>
    </div>
  </footer>
);
window.LpFooter = LpFooter;
