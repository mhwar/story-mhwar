// Landing page — modals (confirm RSVP, modify RSVP)

const LpModalShell = ({ title, sub, onClose, children, hue, maxWidth = 520 }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 100,
    background: 'rgba(20,19,15,0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  }}>
    <div style={{
      maxWidth, width: '100%',
      maxHeight: '90vh', overflowY: 'auto',
      background: '#fff', borderRadius: 20,
      boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        padding: '22px 26px',
        borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.3 }}>{title}</h3>
          {sub && <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{sub}</div>}
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--warm)', color: 'var(--ink-2)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconX size={14} stroke={2}/>
        </button>
      </div>
      {children}
    </div>
  </div>
);

const LpField = ({ label, value, placeholder, readOnly }) => (
  <div>
    <div style={{
      fontSize: 11, fontWeight: 600, color: 'var(--muted)',
      letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6,
    }}>{label}</div>
    <div style={{
      padding: '11px 14px',
      background: readOnly ? 'var(--warm)' : '#fff',
      border: '1px solid var(--line-2)',
      borderRadius: 10,
      fontSize: 14, color: 'var(--ink)',
    }}>{value || placeholder}</div>
  </div>
);

const LpSessionOption = ({ id, title, sub, selected, onClick, hue }) => (
  <button onClick={onClick} style={{
    display: 'block', width: '100%', textAlign: 'right',
    padding: '14px 16px',
    background: selected ? `oklch(0.97 0.03 ${hue})` : '#fff',
    border: `1.5px solid ${selected ? `oklch(0.55 0.14 ${hue})` : 'var(--line-2)'}`,
    borderRadius: 12,
    marginBottom: 8,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: `2px solid ${selected ? `oklch(0.55 0.14 ${hue})` : 'var(--line-2)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: `oklch(0.55 0.14 ${hue})` }}/>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{sub}</div>
      </div>
    </div>
  </button>
);

// ============ CONFIRM MODAL ============
const LpConfirmModal = ({ hue, guestCount, setGuestCount, sessionChoice, setSessionChoice, onClose, onConfirm }) => (
  <LpModalShell
    title="أكّد حضورك"
    sub="خطوة واحدة · تحتاج أقلّ من دقيقة"
    onClose={onClose}
    hue={hue}
  >
    <div style={{ padding: '22px 26px 8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <LpField label="الاسم الكامل" value="محمد الغامدي" readOnly/>
        <LpField label="البريد" value="m.ghamdi@example.sa" readOnly/>
      </div>

      <div className="mono" style={{
        fontSize: 10.5, fontWeight: 600, color: 'var(--muted)',
        letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10,
      }}>اختر ورشة الفترة الثانية</div>
      <LpSessionOption
        id="main" title="الجلسة الرئيسية فقط"
        sub="الحوار + العشاء · الخيار الأوسع"
        selected={sessionChoice === 'main'}
        onClick={() => setSessionChoice('main')}
        hue={hue}
      />
      <LpSessionOption
        id="workshop-a" title="ورشة أ · صناعة سرد قصصي"
        sub="20 مقعداً · نورة القحطاني · 90 دقيقة"
        selected={sessionChoice === 'workshop-a'}
        onClick={() => setSessionChoice('workshop-a')}
        hue={hue}
      />
      <LpSessionOption
        id="workshop-b" title="ورشة ب · من فكرة إلى مشروع"
        sub="15 مقعداً · فيصل المالكي · 90 دقيقة"
        selected={sessionChoice === 'workshop-b'}
        onClick={() => setSessionChoice('workshop-b')}
        hue={hue}
      />

      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{
          fontSize: 10.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10,
        }}>عدد المقاعد</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 14px',
          background: 'var(--warm)',
          borderRadius: 12,
        }}>
          <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#fff', border: '1px solid var(--line-2)',
            fontSize: 18, color: 'var(--ink-2)',
          }}>−</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{guestCount}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{guestCount === 1 ? 'أنت فقط' : `أنت + ${guestCount - 1} مرافق`}</div>
          </div>
          <button onClick={() => setGuestCount(Math.min(2, guestCount + 1))} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#fff', border: '1px solid var(--line-2)',
            fontSize: 18, color: 'var(--ink-2)',
          }}>+</button>
        </div>
        {guestCount > 1 && (
          <div style={{ marginTop: 10 }}>
            <LpField label="اسم المرافق" placeholder="مطلوب لإصدار شارة الدخول"/>
          </div>
        )}
      </div>

      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        marginTop: 20, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.6, cursor: 'pointer',
      }}>
        <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: `oklch(0.35 0.14 ${hue})` }}/>
        <span>أوافق على أن تُرسل لي تذكرتي والتحديثات الهامّة قبل الفعالية · لا رسائل ترويجية.</span>
      </label>
    </div>

    <div style={{
      padding: '18px 26px',
      borderTop: '1px solid var(--line)',
      background: 'var(--warm)',
      display: 'flex', gap: 10, alignItems: 'center',
    }}>
      <button onClick={onClose} style={{
        padding: '12px 20px', borderRadius: 999,
        background: 'transparent', color: 'var(--ink-2)',
        fontSize: 13, fontWeight: 500,
      }}>رجوع</button>
      <button onClick={onConfirm} style={{
        flex: 1,
        padding: '13px 22px', borderRadius: 999,
        background: `oklch(0.35 0.14 ${hue})`, color: '#fff',
        fontSize: 14, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <IconCheck size={15} stroke={2.5}/>
        أكّد المقعد · وأصدر التذكرة
      </button>
    </div>
  </LpModalShell>
);
window.LpConfirmModal = LpConfirmModal;

// ============ MODIFY MODAL ============
const LpModifyModal = ({ hue, guestCount, setGuestCount, sessionChoice, setSessionChoice, onClose, onCancel }) => (
  <LpModalShell
    title="تعديل حضورك"
    sub="يمكنك تعديل تفاصيلك حتى 17 يونيو · 6:00م"
    onClose={onClose}
    hue={hue}
  >
    <div style={{ padding: '22px 26px 8px' }}>
      <div style={{
        padding: '12px 14px', marginBottom: 18,
        background: `oklch(0.97 0.03 ${hue})`,
        border: `1px solid oklch(0.9 0.05 ${hue})`,
        borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <IconCheckCircle size={16} stroke={2.2} style={{ color: `oklch(0.4 0.14 ${hue})`, flexShrink: 0 }}/>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>التذكرة الحالية · TH-2026-0241</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>صدرت 12 إبريل · آخر تعديل قبل 3 أيام</div>
        </div>
      </div>

      <div className="mono" style={{
        fontSize: 10.5, fontWeight: 600, color: 'var(--muted)',
        letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10,
      }}>الجلسة / الورشة</div>
      <LpSessionOption id="main" title="الجلسة الرئيسية فقط" sub="الحوار + العشاء"
        selected={sessionChoice === 'main'} onClick={() => setSessionChoice('main')} hue={hue}/>
      <LpSessionOption id="workshop-a" title="ورشة أ · صناعة سرد قصصي"
        sub="20 مقعداً · متاحة"
        selected={sessionChoice === 'workshop-a'} onClick={() => setSessionChoice('workshop-a')} hue={hue}/>
      <LpSessionOption id="workshop-b" title="ورشة ب · من فكرة إلى مشروع"
        sub="امتلأت · قائمة انتظار"
        selected={sessionChoice === 'workshop-b'} onClick={() => setSessionChoice('workshop-b')} hue={hue}/>

      <div style={{ marginTop: 18, marginBottom: 8 }}>
        <div className="mono" style={{
          fontSize: 10.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10,
        }}>عدد المقاعد</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 14px',
          background: 'var(--warm)',
          borderRadius: 12,
        }}>
          <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#fff', border: '1px solid var(--line-2)',
            fontSize: 18, color: 'var(--ink-2)',
          }}>−</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{guestCount}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{guestCount === 1 ? 'أنت فقط' : `أنت + ${guestCount - 1} مرافق`}</div>
          </div>
          <button onClick={() => setGuestCount(Math.min(2, guestCount + 1))} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#fff', border: '1px solid var(--line-2)',
            fontSize: 18, color: 'var(--ink-2)',
          }}>+</button>
        </div>
      </div>
    </div>

    <div style={{
      padding: '18px 26px',
      borderTop: '1px solid var(--line)',
      background: 'var(--warm)',
      display: 'flex', gap: 10, alignItems: 'center',
    }}>
      <button onClick={onCancel} style={{
        padding: '12px 18px', borderRadius: 999,
        background: 'transparent', color: 'oklch(0.5 0.15 25)',
        border: '1px solid oklch(0.88 0.08 25)',
        fontSize: 12.5, fontWeight: 500,
      }}>إلغاء حضوري</button>
      <button onClick={onClose} style={{
        flex: 1,
        padding: '13px 22px', borderRadius: 999,
        background: `oklch(0.35 0.14 ${hue})`, color: '#fff',
        fontSize: 14, fontWeight: 600,
      }}>
        احفظ التعديلات
      </button>
    </div>
  </LpModalShell>
);
window.LpModifyModal = LpModifyModal;
