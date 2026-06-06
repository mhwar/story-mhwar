// Client Newsletter — a community/organization sends their monthly newsletter to subscribers
// Fully client-branded · Mhwar appears only in footer

const ClientNewsletterTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;
  const clientName = d.clientName || 'مجتمع ثراء الشبابي';
  const parentOrg = d.parentOrg || 'هيئة تطوير منطقة عسير';
  const issueNum = d.issueNum || '12';
  const issueDate = d.issueDate || 'إبريل 2026';

  return (
    <EmailShell
      from={`${clientName} · عبر محور <newsletter@thraa.sa>`}
      subject={d.subject || `نشرة ثراء · العدد ${issueNum} · ${issueDate}`}
    >
      <ClientBrandRow name={clientName} parentOrg={parentOrg} hue={hue} />

      {/* Masthead */}
      <div style={{
        padding: '36px 28px 24px',
        background: `linear-gradient(180deg, oklch(0.97 0.03 ${hue}) 0%, #fff 100%)`,
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 14, gap: 10
        }}>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase',
            color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600,
          }}>
            نشرة ثراء · العدد {issueNum}
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 0.5 }}>
            {issueDate}
          </div>
        </div>

        <h1 style={{
          fontSize: 30, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.6, lineHeight: 1.2,
          textWrap: 'balance'
        }}>
          حين يلتقي الحوار بالعمل
        </h1>
        <p style={{
          fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8,
          margin: 0, textWrap: 'pretty', maxWidth: 460
        }}>
          مرحباً {d.recipientName || 'محمد'} · في عدد هذا الشهر نستعيد معكم أبرز لحظات ملتقى ثراء السنوي، ونفتح نافذة على ما يُعَدّ للمرحلة القادمة · خمس دقائق من القراءة، وفكرة جديدة ربما تُغيّر أسبوعك.
        </p>
      </div>

      {/* Issue index */}
      <div style={{ padding: '24px 28px 8px' }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1.5, textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          في هذا العدد
        </div>
        {[
          { n: '01', t: 'قصّة الغلاف · ماذا صنعنا في ثراء 2026' },
          { n: '02', t: 'حوار مع ضيف · تركي الشهري يكتب عن الاستدامة' },
          { n: '03', t: 'فعالياتنا القادمة · ثلاث محطّات قبل الصيف' },
          { n: '04', t: 'من المجتمع · أصوات من الجلسات الجانبيّة' },
        ].map((it, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr',
            gap: 12, alignItems: 'baseline',
            padding: '10px 0',
            borderTop: i > 0 ? '1px solid var(--line)' : 'none',
          }}>
            <span className="mono" style={{
              fontSize: 11, color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600,
            }}>{it.n}</span>
            <span style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
              {it.t}
            </span>
          </div>
        ))}
      </div>

      {/* Cover story — full-bleed placeholder */}
      <div style={{ padding: '24px 20px 8px' }}>
        <div style={{
          position: 'relative',
          aspectRatio: '16 / 10',
          borderRadius: 14,
          overflow: 'hidden',
          background: `linear-gradient(135deg, oklch(0.75 0.12 ${hue}) 0%, oklch(0.45 0.16 ${hue + 20}) 100%)`,
        }}>
          {/* Decorative shapes */}
          <div aria-hidden style={{
            position: 'absolute', insetInlineEnd: -40, bottom: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
          }}/>
          <div aria-hidden style={{
            position: 'absolute', insetInlineStart: 30, top: 40,
            width: 80, height: 80, borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.25)',
          }}/>
          <div style={{
            position: 'absolute', insetInlineStart: 20, bottom: 20,
            insetInlineEnd: 20, color: '#fff',
          }}>
            <div className="mono" style={{
              fontSize: 10.5, letterSpacing: 1.5, opacity: 0.85, marginBottom: 6,
            }}>
              قصّة الغلاف
            </div>
            <div style={{
              fontSize: 20, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.3,
            }}>
              324 حاضراً · 12 جلسة · ليلة تلخّص عاماً
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 28px 8px' }}>
        <div className="mono" style={{
          fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 6,
        }}>01 · قصّة الغلاف</div>
        <h2 style={{
          fontSize: 20, fontWeight: 700, margin: '0 0 10px', letterSpacing: -0.3,
          lineHeight: 1.35,
        }}>
          ثراء 2026 · حين يصنع الحضور الفرق
        </h2>
        <p style={{
          fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.85, margin: '0 0 14px',
          textWrap: 'pretty',
        }}>
          اجتمع في أبها أكثر من 324 شاباً وشابّة من ثماني مناطق · خرجنا بثلاث مبادرات جديدة يقودها المجتمع نفسه، وخطّة تمويل لستّ جلسات مصغّرة قبل نهاية العام. في المقالة الكاملة نرصد ما قيل، وما يُعَدّ حالياً.
        </p>
        <a href="#" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: `oklch(0.35 0.14 ${hue})`, fontWeight: 600,
        }}>
          اقرأ القصّة كاملة <IconArrowL size={14} stroke={2}/>
        </a>
      </div>

      {/* Divider */}
      <div style={{
        margin: '28px 28px 8px',
        height: 1, background: 'var(--line)',
      }}/>

      {/* Guest column */}
      <div style={{ padding: '12px 28px 8px' }}>
        <div className="mono" style={{
          fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 6,
        }}>02 · مقال ضيف</div>
        <h2 style={{
          fontSize: 19, fontWeight: 700, margin: '0 0 14px', letterSpacing: -0.3,
          lineHeight: 1.35,
        }}>
          لماذا تحتاج فعالياتنا إلى تعريف جديد للاستدامة؟
        </h2>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
          padding: '12px 14px',
          background: 'var(--warm)', borderRadius: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: `oklch(0.55 0.15 ${hue})`, color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, flexShrink: 0,
          }}>ت</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>تركي الشهري</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>
              مستشار أثر اجتماعي · عضو فريق ثراء
            </div>
          </div>
        </div>
        <blockquote style={{
          margin: 0,
          padding: '4px 16px',
          borderInlineStart: `3px solid oklch(0.55 0.15 ${hue})`,
          fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.8,
          fontStyle: 'normal',
        }}>
          «الفعالية التي لا تترك أثراً بعد أسبوع من انتهائها · لم تحدث فعلاً · الأثر يبدأ من اللحظة التي يخرج فيها الضيف من القاعة، لا حين يدخلها.»
        </blockquote>
        <a href="#" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 14,
          fontSize: 13, color: `oklch(0.35 0.14 ${hue})`, fontWeight: 600,
        }}>
          اقرأ المقال كاملاً <IconArrowL size={14} stroke={2}/>
        </a>
      </div>

      <div style={{ margin: '28px 28px 8px', height: 1, background: 'var(--line)' }}/>

      {/* Upcoming events — 3 cards */}
      <div style={{ padding: '12px 20px 8px' }}>
        <div style={{ padding: '0 8px' }}>
          <div className="mono" style={{
            fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 6,
          }}>03 · فعاليّات قادمة</div>
          <h2 style={{
            fontSize: 19, fontWeight: 700, margin: '0 0 16px', letterSpacing: -0.3,
          }}>
            ثلاث محطّات قبل الصيف
          </h2>
        </div>

        {[
          { m: 'مايو', d: '08', w: 'الخميس', t: 'صالون ثراء · جلسة حوار مغلقة', sub: 'مقاعد محدودة · دعوة خاصة', seats: '20 / 30' },
          { m: 'مايو', d: '22', w: 'الخميس', t: 'ورشة صناعة المحتوى المحلي', sub: 'تدريب عملي · مجاني', seats: '15 / 40' },
          { m: 'يونيو', d: '12', w: 'الجمعة', t: 'لقاء المبدعين الشباب', sub: 'أبها · مفتوح للجميع', seats: 'التسجيل قريباً' },
        ].map((e, i) => (
          <a key={i} href="#" style={{
            display: 'grid', gridTemplateColumns: '72px 1fr auto',
            gap: 14, alignItems: 'center',
            padding: '14px 14px', marginBottom: 8,
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 12,
          }}>
            <div style={{
              textAlign: 'center',
              padding: '10px 6px',
              background: `oklch(0.97 0.03 ${hue})`,
              borderRadius: 10,
            }}>
              <div className="mono" style={{
                fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase',
                color: `oklch(0.45 0.14 ${hue})`, fontWeight: 600,
              }}>{e.m}</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, marginTop: 2 }}>{e.d}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{e.w}</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{e.t}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{e.sub}</div>
              <div className="mono" style={{
                fontSize: 10.5, color: `oklch(0.45 0.14 ${hue})`,
                marginTop: 4, fontWeight: 500,
              }}>{e.seats}</div>
            </div>
            <IconArrowL size={16} style={{ color: 'var(--muted)' }}/>
          </a>
        ))}
      </div>

      <div style={{ margin: '28px 28px 8px', height: 1, background: 'var(--line)' }}/>

      {/* Voices from community */}
      <div style={{ padding: '12px 28px 8px' }}>
        <div className="mono" style={{
          fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 6,
        }}>04 · من المجتمع</div>
        <h2 style={{
          fontSize: 19, fontWeight: 700, margin: '0 0 14px', letterSpacing: -0.3,
        }}>
          أصوات من الجلسات الجانبيّة
        </h2>

        {[
          { q: 'أول مرّة أحضر فعالية لا أشعر فيها بالغربة · وجدت أصدقاء قبل أن أجد فكرة.', n: 'نوف · طالبة تصميم' },
          { q: 'بعد الجلسة بأسبوع، تواصل معي أحد الحضور وبدأنا مشروعاً مشتركاً.', n: 'عبدالله · ريادي' },
        ].map((q, i) => (
          <div key={i} style={{
            padding: '14px 16px', marginBottom: 8,
            background: '#fff', border: '1px solid var(--line)',
            borderRadius: 12,
          }}>
            <div style={{
              fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.75,
              marginBottom: 8, textWrap: 'pretty',
            }}>
              «{q.q}»
            </div>
            <div className="mono" style={{
              fontSize: 10.5, color: 'var(--muted)', letterSpacing: 0.3,
            }}>— {q.n}</div>
          </div>
        ))}
      </div>

      {/* Share with friend */}
      <div style={{ padding: '24px 28px 32px' }}>
        <div style={{
          padding: '22px 20px', textAlign: 'center',
          background: `oklch(0.97 0.03 ${hue})`, borderRadius: 14,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
            وصلتك هذه النشرة من صديق؟
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
            اشترك لتصلك مباشرة في بداية كل شهر · لا إزعاج · إلغاء بنقرة.
          </div>
          <PrimaryBtn block={false} small color={`oklch(0.35 0.14 ${hue})`}>
            أريد الاشتراك في النشرة
          </PrimaryBtn>
        </div>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.ClientNewsletterTemplate = ClientNewsletterTemplate;
