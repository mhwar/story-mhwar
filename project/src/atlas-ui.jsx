// Shared primitives for Atlas tabs: modal, form fields, segmented toggle, tag input, confirm.

const { useState: useStateAX, useEffect: useEffectAX, useRef: useRefAX, useMemo: useMemoAX } = React;

// -------- Modal --------
function AxModal({ open, title, subtitle, onClose, width = 560, children, footer }) {
  useEffectAX(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.45)', zIndex: 300,
        backdropFilter: 'blur(3px)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 301,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, pointerEvents: 'none',
      }}>
        <div style={{
          pointerEvents: 'auto',
          width, maxWidth: '95vw', maxHeight: '92vh',
          background: '#fff', borderRadius: 16,
          boxShadow: '0 30px 80px -20px rgba(20,19,15,0.35)',
          display: 'flex', flexDirection: 'column',
          direction: 'rtl',
        }}>
          <div style={{
            padding: '18px 22px', borderBottom: '1px solid var(--line)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>{title}</h3>
              {subtitle && <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--muted)' }}>{subtitle}</div>}
            </div>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--warm)', border: 'none',
              fontSize: 16, color: 'var(--ink-2)', cursor: 'pointer',
            }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
            {children}
          </div>
          {footer && (
            <div style={{
              padding: '14px 22px', borderTop: '1px solid var(--line)',
              display: 'flex', gap: 10, justifyContent: 'flex-start',
              background: '#fbfaf7',
            }}>{footer}</div>
          )}
        </div>
      </div>
    </>
  );
}

// -------- Confirm --------
function AxConfirm({ open, title, message, confirmLabel = 'تأكيد', onConfirm, onClose, destructive }) {
  return (
    <AxModal
      open={open}
      title={title}
      onClose={onClose}
      width={420}
      footer={
        <>
          <button
            onClick={() => { onConfirm?.(); onClose?.(); }}
            style={{
              padding: '9px 18px', borderRadius: 10,
              background: destructive ? 'oklch(0.5 0.18 25)' : 'var(--ink)',
              color: '#fff', border: 'none', fontSize: 13, fontWeight: 500,
              fontFamily: 'inherit', cursor: 'pointer',
            }}
          >{confirmLabel}</button>
          <button onClick={onClose} style={{
            padding: '9px 18px', borderRadius: 10,
            background: 'var(--warm)', color: 'var(--ink)', border: 'none',
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}>إلغاء</button>
        </>
      }
    >
      <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>{message}</div>
    </AxModal>
  );
}

// -------- Form field --------
function AxField({ label, hint, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>
          {label}{required && <span style={{ color: 'oklch(0.55 0.15 25)', marginInlineStart: 4 }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const axInputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1px solid var(--line)', borderRadius: 9,
  fontSize: 13, fontFamily: 'inherit', color: 'var(--ink)',
  background: '#fff', outline: 'none',
  transition: 'border-color 0.15s',
};

function AxInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={axInputStyle}
      onFocus={e => e.target.style.borderColor = 'var(--ink-2)'}
      onBlur={e => e.target.style.borderColor = 'var(--line)'}
    />
  );
}

function AxTextarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...axInputStyle, resize: 'vertical', lineHeight: 1.7 }}
      onFocus={e => e.target.style.borderColor = 'var(--ink-2)'}
      onBlur={e => e.target.style.borderColor = 'var(--line)'}
    />
  );
}

function AxSelect({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      style={{ ...axInputStyle, cursor: 'pointer' }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// -------- Tag / chip multi-select --------
function AxChipMulti({ value = [], options, onChange }) {
  const toggle = (v) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v));
    else onChange([...value, v]);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(o => {
        const active = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            style={{
              padding: '5px 11px', borderRadius: 999,
              border: active ? '1px solid var(--ink)' : '1px solid var(--line)',
              background: active ? 'var(--ink)' : '#fff',
              color: active ? '#fff' : 'var(--ink-2)',
              fontSize: 11.5, fontWeight: 500, fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >{o.label}</button>
        );
      })}
    </div>
  );
}

// -------- Free-form tag input (comma separated, yields array) --------
function AxTagInput({ value = [], onChange, placeholder }) {
  const [draft, setDraft] = useStateAX('');
  const commit = () => {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft('');
  };
  return (
    <div style={{
      border: '1px solid var(--line)', borderRadius: 9,
      padding: '6px 8px',
      display: 'flex', flexWrap: 'wrap', gap: 5,
      background: '#fff',
    }}>
      {value.map((v, i) => (
        <span key={i} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 9px', borderRadius: 999,
          background: 'var(--warm)', color: 'var(--ink)',
          fontSize: 11.5, fontWeight: 500,
        }}>
          {v}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, ix) => ix !== i))}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', padding: 0, marginInlineStart: 2 }}
          >×</button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ''}
        style={{
          flex: 1, minWidth: 80, border: 'none', outline: 'none',
          fontFamily: 'inherit', fontSize: 12.5, color: 'var(--ink)',
          padding: '4px 6px', background: 'transparent',
        }}
      />
    </div>
  );
}

// -------- Color swatch picker (OKLCH presets) --------
const AX_PRESET_COLORS = [
  { accent: 'oklch(0.45 0.15 270)', bg: 'oklch(0.96 0.02 270)' },
  { accent: 'oklch(0.48 0.13 225)', bg: 'oklch(0.96 0.02 225)' },
  { accent: 'oklch(0.55 0.17 40)',  bg: 'oklch(0.96 0.025 40)' },
  { accent: 'oklch(0.48 0.13 165)', bg: 'oklch(0.96 0.025 165)' },
  { accent: 'oklch(0.48 0.17 320)', bg: 'oklch(0.96 0.03 320)' },
  { accent: 'oklch(0.47 0.14 145)', bg: 'oklch(0.96 0.025 145)' },
  { accent: 'oklch(0.52 0.14 70)',  bg: 'oklch(0.96 0.03 70)' },
  { accent: 'oklch(0.5 0.13 205)',  bg: 'oklch(0.96 0.025 205)' },
  { accent: 'oklch(0.5 0.16 350)',  bg: 'oklch(0.96 0.025 350)' },
  { accent: 'oklch(0.45 0.04 30)',  bg: 'oklch(0.96 0.015 30)' },
];

function AxColorSwatchPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {AX_PRESET_COLORS.map((c, i) => {
        const active = value?.accent === c.accent;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(c)}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: c.bg, border: active ? `2px solid ${c.accent}` : '1px solid var(--line)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              background: c.accent,
            }} />
          </button>
        );
      })}
    </div>
  );
}

// -------- Primary / secondary buttons --------
function AxBtn({ kind = 'primary', onClick, children, icon, type = 'button', small }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: small ? '6px 12px' : '9px 16px',
    borderRadius: small ? 8 : 10,
    fontSize: small ? 12 : 13, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer', border: 'none',
    transition: 'filter 0.15s',
  };
  const styles = {
    primary: { ...base, background: 'var(--ink)', color: '#fff' },
    secondary: { ...base, background: 'var(--warm)', color: 'var(--ink)' },
    ghost: { ...base, background: 'transparent', color: 'var(--ink-2)' },
    danger: { ...base, background: 'oklch(0.96 0.03 25)', color: 'oklch(0.5 0.18 25)' },
    outline: { ...base, background: '#fff', color: 'var(--ink)', border: '1px solid var(--line)' },
  };
  return (
    <button type={type} onClick={onClick} style={styles[kind] || styles.primary}
      onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
      onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
    >
      {icon && <span style={{ fontSize: small ? 11 : 13, opacity: 0.85 }}>{icon}</span>}
      {children}
    </button>
  );
}

// -------- Tabs header --------
function AxTabs({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 2,
      borderBottom: '1px solid var(--line)',
      paddingInline: 40, background: '#fff',
      position: 'sticky', top: 0, zIndex: 50,
      overflowX: 'auto',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              padding: '14px 18px',
              border: 'none', background: 'transparent',
              borderBottom: isActive ? '2px solid var(--ink)' : '2px solid transparent',
              marginBottom: -1,
              color: isActive ? 'var(--ink)' : 'var(--ink-2)',
              fontSize: 13.5, fontWeight: isActive ? 600 : 500,
              fontFamily: 'inherit', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              whiteSpace: 'nowrap',
            }}
          >
            {t.icon && <span style={{ fontSize: 13, opacity: 0.7 }}>{t.icon}</span>}
            {t.label}
            {typeof t.badge !== 'undefined' && (
              <span className="mono" style={{
                padding: '1px 7px', borderRadius: 999,
                background: isActive ? 'var(--ink)' : 'var(--warm)',
                color: isActive ? '#fff' : 'var(--muted)',
                fontSize: 10.5,
              }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// -------- Empty state --------
function AxEmpty({ icon = '○', title, message, action }) {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 20px',
      background: '#fff', border: '1px dashed var(--line)', borderRadius: 14,
    }}>
      <div style={{ fontSize: 32, opacity: 0.35, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{title}</div>
      {message && <div style={{ fontSize: 12.5, color: 'var(--muted)', maxWidth: 380, margin: '0 auto 16px', lineHeight: 1.7 }}>{message}</div>}
      {action}
    </div>
  );
}

Object.assign(window, {
  AxModal, AxConfirm, AxField, AxInput, AxTextarea, AxSelect,
  AxChipMulti, AxTagInput, AxColorSwatchPicker, AxBtn, AxTabs, AxEmpty,
  AX_PRESET_COLORS, axInputStyle,
});
