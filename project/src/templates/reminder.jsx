// 3. Reminder — sent day-of or day-before
// Client branded

const ReminderTemplate = ({ data }) => {
  const d = data || {};
  const hue = d.hue ?? 245;

  return (
    <EmailShell
      from={`${d.clientName || 'شركة نورّ'} <events@nour.co>`}
      subject={d.subject || 'نلتقي غداً · تذكير بالموعد'}
    >
      <ClientBrandRow name={d.clientName || 'شركة نورّ'} hue={hue} />

      <div style={{ padding: '36px 28px 8px' }}>
        <div className="mono" style={{
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: `oklch(0.45 0.12 ${hue})`, marginBottom: 12
        }}>
          تذكير · باقٍ 24 ساعة
        </div>
        <h1 style={{
          fontSize: 26, fontWeight: 700, margin: '0 0 14px',
          letterSpacing: -0.4, lineHeight: 1.3
        }}>
          باقٍ يوم واحد على موعدنا
        </h1>
        <p style={{
          fontSize: 15, lineHeight: 1.8, color: 'var(--ink-2)',
          margin: '0 0 20px'
        }}>
تذكير ودّي بموعد {d.eventName || 'ملتقى نورّ'} · ننصحك بالوصول قبل 15 دقيقة من البداية لتتجنّب الزحام عند البوّابة، وتحجز مقعدك المفضّل.
        </p>
      </div>

      {/* Big date block */}
      <div style={{ padding: '0 28px 24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '110px 1fr', gap: 18,
          padding: '22px 22px',
          background: 'var(--warm)', borderRadius: 14
        }}>
          <div style={{
            background: '#fff', borderRadius: 12,
            textAlign: 'center', padding: '14px 10px',
            border: '1px solid var(--line)'
          }}>
            <div className="mono" style={{
              fontSize: 10, letterSpacing: 1.5, color: `oklch(0.5 0.15 ${hue})`,
              textTransform: 'uppercase', fontWeight: 600
            }}>يونيو</div>
            <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1, margin: '6px 0' }}>18</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>الخميس</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <IconClock size={15} />
              <span style={{ fontSize: 14.5, fontWeight: 500 }}>6:00 إلى 10:00 مساءً</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <IconPin size={15} />
              <span style={{ fontSize: 14 }}>إثراء · قاعة الحوار</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconUser size={15} />
              <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>
                {d.recipientName || 'محمد المطيري'} · تذكرة مؤكّدة
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 28px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--ink-2)' }}>
          قبل الخروج · ثلاث خطوات سريعة
        </div>
        {[
          { t: 'احفظ تذكرتك في جوّالك', s: 'دخول سريع · تعمل حتّى دون إنترنت' },
          { t: 'خطّط لوصولك مبكّراً', s: 'مواقف مخصّصة متاحة عند المدخل الرئيسي' },
          { t: 'لباس مناسب للقاعة', s: 'كاجوال راقٍ · القاعة مكيّفة' },
        ].map((i, idx) => (
          <div key={idx} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '10px 0',
            borderTop: idx === 0 ? 'none' : '1px solid var(--line)'
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6,
              background: `oklch(0.94 0.05 ${hue})`,
              color: `oklch(0.4 0.12 ${hue})`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 1, flexShrink: 0
            }}>
              <IconCheck size={12} stroke={2.5}/>
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{i.t}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{i.s}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 28px 28px', display: 'flex', gap: 8 }}>
        <PrimaryBtn color={`oklch(0.35 0.12 ${hue})`}>افتح تذكرتي</PrimaryBtn>
      </div>

      <MhwarFooter />
    </EmailShell>
  );
};

window.ReminderTemplate = ReminderTemplate;
