// Platform Newsletter — Mhwar sends to hosts/organizers with product updates + community ideas
// Mhwar-branded · mix of "What's new" + "Ideas for growing your community"

const PlatformNewsletterTemplate = ({ data }) => {
  const d = data || {};
  const issueNum = d.issueNum || '08';
  const issueDate = d.issueDate || 'إبريل 2026';

  return (
    <EmailShell
      from="محور · نشرة المنظّمين <newsletter@mhwar.sa>"
      subject={d.subject || `جديد محور · العدد ${issueNum} · ثلاث أفكار لبناء مجتمعك`}
    >
      <PlatformHeader />

      {/* Hero */}
      <div style={{
        padding: '36px 28px 28px',
        background: 'linear-gradient(180deg, var(--warm) 0%, #fff 100%)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 14, gap: 10,
        }}>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase',
            color: 'var(--accent)', fontWeight: 600,
          }}>
            نشرة المنظّمين · العدد {issueNum}
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
            {issueDate}
          </div>
        </div>
        <h1 style={{
          fontSize: 30, fontWeight: 700, margin: '0 0 10px',
          letterSpacing: -0.6, lineHeight: 1.2,
          textWrap: 'balance',
        }}>
          أربع جديدات · وثلاث أفكار تستحقّ التجربة
        </h1>
        <p style={{
          fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8,
          margin: 0, textWrap: 'pretty', maxWidth: 460,
        }}>
          مرحباً {d.recipientName || 'محمد'} · جمعنا لك في هذا العدد أبرز التحديثات على منصّة محور، ومنها ميزة كنت بانتظارها · ثمّ نشاركك ثلاث أفكار ميدانيّة لبناء مجتمع يدوم حول فعاليّاتك.
        </p>
      </div>

      {/* Section: What's new */}
      <div style={{ padding: '32px 28px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: 'var(--accent-soft)', color: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconSparkle size={14}/>
          </div>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: 1.5, textTransform: 'uppercase',
            color: 'var(--muted)', fontWeight: 600,
          }}>
            جديد على محور
          </div>
        </div>
        <h2 style={{
          fontSize: 21, fontWeight: 700, margin: '0 0 4px',
          letterSpacing: -0.4,
        }}>
          ما أطلقناه هذا الشهر
        </h2>
      </div>

      {/* Feature hero — big one */}
      <div style={{ padding: '18px 20px 8px' }}>
        <div style={{
          border: '1px solid var(--line)',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#fff',
        }}>
          {/* Visual */}
          <div style={{
            aspectRatio: '16 / 9',
            background: `linear-gradient(135deg, oklch(0.95 0.04 250) 0%, oklch(0.88 0.08 35) 100%)`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Mock analytics card floating */}
            <div style={{
              position: 'absolute', top: 24, insetInlineStart: 24,
              background: '#fff', borderRadius: 10,
              padding: '12px 14px',
              boxShadow: '0 10px 30px -10px rgba(20,19,15,0.2)',
              minWidth: 150,
            }}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>
                معدّل الحضور
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 2 }}>
                92%
              </div>
              <div className="mono" style={{
                fontSize: 10, color: 'oklch(0.5 0.15 155)', marginTop: 2,
              }}>↑ 4% عن الشهر الماضي</div>
            </div>
            {/* Mock bars */}
            <div style={{
              position: 'absolute', bottom: 24, insetInlineEnd: 24,
              display: 'flex', alignItems: 'flex-end', gap: 4,
              height: 60,
            }}>
              {[30, 48, 36, 72, 90, 58, 80].map((h, i) => (
                <div key={i} style={{
                  width: 8, height: `${h}%`,
                  background: i === 4 ? 'var(--accent)' : '#fff',
                  borderRadius: 2,
                  opacity: i === 4 ? 1 : 0.9,
                }}/>
              ))}
            </div>
          </div>

          <div style={{ padding: '22px 22px 20px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 10px', borderRadius: 999,
              background: 'var(--accent-soft)', color: 'var(--accent)',
              fontSize: 10.5, fontWeight: 600, letterSpacing: 0.3,
              marginBottom: 12,
            }}>
              جديد · مُتاح للجميع
            </div>
            <h3 style={{
              fontSize: 18, fontWeight: 700, margin: '0 0 8px',
              letterSpacing: -0.3, lineHeight: 1.35,
            }}>
              لوحة تحليلات مُعاد بناؤها من الصفر
            </h3>
            <p style={{
              fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.8,
              margin: '0 0 14px', textWrap: 'pretty',
            }}>
              تعرّف على قمع التسجيل · اكتشف أين يتسرّب جمهورك · قارن أداء فعالياتك جنباً إلى جنب · وصدّر التقارير PDF بنقرة · كل هذا في مكان واحد.
            </p>
            <a href="#" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--accent)', fontWeight: 600,
            }}>
              جرّبها الآن <IconArrowL size={14} stroke={2}/>
            </a>
          </div>
        </div>
      </div>

      {/* Smaller feature grid */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        }}>
          {[
            {
              ic: <IconQR size={16}/>,
              tag: 'محدّث',
              t: 'مسح QR بلا إنترنت',
              s: 'طبّق يعمل عند الباب حتّى في التغطية الضعيفة.',
            },
            {
              ic: <IconMsg size={16}/>,
              tag: 'جديد',
              t: 'قوالب واتساب رسميّة',
              s: 'دعوات وتذكيرات عبر القناة التي يفتحها جمهورك فعلاً.',
            },
            {
              ic: <IconUser size={16}/>,
              tag: 'جديد',
              t: 'صلاحيّات فريق دقيقة',
              s: 'اسمح للمتطوّعين بالتسجيل فقط · دون الاطّلاع على التحليلات.',
            },
            {
              ic: <IconDownload size={16}/>,
              tag: 'تحسين',
              t: 'تصدير قوائم أسرع ×3',
              s: 'قوائم المدعوّين الكبيرة تنزل في ثوانٍ، لا دقائق.',
            },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '16px 14px',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 12,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 10,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{f.ic}</div>
                <div className="mono" style={{
                  fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase',
                  color: 'var(--muted)', fontWeight: 600,
                }}>{f.tag}</div>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600, marginBottom: 4,
                lineHeight: 1.35,
              }}>{f.t}</div>
              <div style={{
                fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6,
              }}>{f.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        margin: '32px 28px 0', height: 1, background: 'var(--line)',
      }}/>

      {/* Section: Ideas */}
      <div style={{ padding: '28px 28px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: 'oklch(0.95 0.08 70)', color: 'oklch(0.45 0.14 50)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconHeart size={14}/>
          </div>
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: 1.5, textTransform: 'uppercase',
            color: 'var(--muted)', fontWeight: 600,
          }}>
            أفكار لبناء مجتمعك
          </div>
        </div>
        <h2 style={{
          fontSize: 21, fontWeight: 700, margin: '0 0 6px',
          letterSpacing: -0.4,
        }}>
          ثلاث فكرات جرّبها منظّمون على محور
        </h2>
        <p style={{
          fontSize: 13, color: 'var(--muted)', lineHeight: 1.7,
          margin: '0 0 4px', textWrap: 'pretty',
        }}>
          اخترنا من أكثر من 400 فعالية، أفكاراً بسيطة تُحدث فرقاً حقيقياً في تجربة الحضور.
        </p>
      </div>

      {/* Ideas cards — big horizontal */}
      <div style={{ padding: '18px 20px 8px' }}>
        {[
          {
            num: '1',
            hue: 35,
            t: 'ابدأ قبل البداية · بعشر دقائق ترحيبيّة',
            s: 'قبل الجلسة الرسميّة، افتح القاعة بعشر دقائق من الموسيقى والحوار · الحضور المبكّر يبني علاقات، ويحوّل الزحام عند الباب إلى لحظة هادئة.',
            author: 'جرّبها · مجتمع ثراء',
          },
          {
            num: '2',
            hue: 155,
            t: 'خصّص مقعداً «للغريب عن المجتمع»',
            s: 'في كل طاولة، احفظ مقعداً لحاضر يأتي للمرة الأولى · أخبر منسّقي الطاولات مسبقاً · هكذا لا يشعر القادم الجديد بالعزلة، ولا يحتاج للكفاح ليجد مكاناً.',
            author: 'جرّبها · نورّ Club',
          },
          {
            num: '3',
            hue: 245,
            t: 'اسأل سؤالاً واحداً بعد 48 ساعة',
            s: 'بعد يومين من الفعاليّة، أرسل رسالة قصيرة بسؤال واحد فقط · «ما الذي ستنفّذه هذا الأسبوع؟» · ردّ واحد يساوي استبياناً كاملاً · والأفكار التي تصلك، ذهب.',
            author: 'جرّبها · ملتقى فَهم',
          },
        ].map((idea, i) => (
          <div key={i} style={{
            padding: '22px 22px',
            marginBottom: 10,
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 14,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div aria-hidden style={{
              position: 'absolute', top: -30, insetInlineEnd: -30,
              width: 100, height: 100, borderRadius: '50%',
              background: `oklch(0.96 0.04 ${idea.hue})`,
            }}/>
            <div style={{ position: 'relative' }}>
              <div style={{
                fontSize: 42, fontWeight: 700, lineHeight: 1,
                color: `oklch(0.55 0.14 ${idea.hue})`,
                letterSpacing: -2,
                marginBottom: 10,
              }}>{idea.num}</div>
              <h3 style={{
                fontSize: 16, fontWeight: 700, margin: '0 0 10px',
                letterSpacing: -0.3, lineHeight: 1.4,
              }}>
                {idea.t}
              </h3>
              <p style={{
                fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.85,
                margin: '0 0 12px', textWrap: 'pretty',
              }}>
                {idea.s}
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 11, color: 'var(--muted)',
                paddingTop: 10,
                borderTop: '1px solid var(--line)',
              }}>
                <IconSparkle size={11}/>
                <span className="mono">{idea.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ margin: '24px 28px 0', height: 1, background: 'var(--line)' }}/>

      {/* Community spotlight */}
      <div style={{ padding: '28px 28px 8px' }}>
        <div className="mono" style={{
          fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 8,
        }}>
          اقتباس من منظّم
        </div>
        <blockquote style={{
          margin: 0, padding: '4px 18px',
          borderInlineStart: '3px solid var(--accent)',
          fontSize: 15, color: 'var(--ink)', lineHeight: 1.8,
          fontWeight: 500, letterSpacing: -0.1,
        }}>
          «محور لم يسهّل علينا إدارة الفعالية فقط · بل أعطانا وقتاً كافياً للتفكير في تجربة الحاضر · وهذا تحديداً ما كان ينقصنا.»
        </blockquote>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginTop: 14, paddingInlineStart: 21,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'oklch(0.7 0.13 35)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
          }}>س</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>سارة الزهراني</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              مديرة مجتمع · ثراء الشبابي
            </div>
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div style={{ padding: '28px 28px 16px' }}>
        <a href="#" style={{
          display: 'flex', alignItems: 'center',
          padding: '18px 20px', gap: 14,
          background: 'var(--ink)', color: '#fff',
          borderRadius: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,0.1)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconSparkle size={18}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
              هل لديك فكرة تستحقّ المشاركة؟
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
              أرسلها لنا · قد تكون نجمة العدد القادم.
            </div>
          </div>
          <IconArrowL size={18} style={{ opacity: 0.7 }}/>
        </a>
      </div>

      {/* Footer note */}
      <div style={{ padding: '8px 28px 20px' }}>
        <div style={{
          fontSize: 11.5, color: 'var(--muted)',
          textAlign: 'center', lineHeight: 1.7,
        }}>
          نشرة المنظّمين من محور · تصل أوّل كل شهر ·{' '}
          <a href="#" style={{ color: 'var(--ink-2)', textDecoration: 'underline' }}>
            إدارة التفضيلات
          </a>
        </div>
      </div>

      <MhwarFooterCTA showCta={false}/>
    </EmailShell>
  );
};

window.PlatformNewsletterTemplate = PlatformNewsletterTemplate;
