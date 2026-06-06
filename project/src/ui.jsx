// Shared UI: email envelope/shell, buttons, placeholder images, header/footer blocks

const EmailShell = ({ subject, from, children, compact = false }) => (
  <div style={uiStyles.shellWrap}>
    <div style={uiStyles.shellHeader}>
      <div style={uiStyles.shellHeaderRow}>
        <span style={uiStyles.shellFromLabel}>من</span>
        <span style={uiStyles.shellFromValue}>{from}</span>
      </div>
      <div style={uiStyles.shellSubject}>{subject}</div>
    </div>
    <div style={{ ...uiStyles.shellBody, padding: compact ? 0 : 0 }}>
      {children}
    </div>
  </div>
);

const EmailCard = ({ children, accent, style }) => (
  <div style={{
    background: '#fff',
    borderRadius: 20,
    border: '1px solid var(--line)',
    overflow: 'hidden',
    ...(accent ? { boxShadow: `0 0 0 1px ${accent}20, 0 20px 40px -24px rgba(20,19,15,0.12)` } : {}),
    ...style
  }}>
    {children}
  </div>
);

const PlaceholderCover = ({ label = 'غلاف الفعالية', hue = 245, height = 260, eventDate, children }) => (
  <div style={{
    position: 'relative',
    height,
    width: '100%',
    background: `
      linear-gradient(135deg,
        oklch(0.55 0.14 ${hue}) 0%,
        oklch(0.42 0.16 ${hue - 20}) 50%,
        oklch(0.32 0.14 ${hue - 40}) 100%)
    `,
    overflow: 'hidden',
    color: '#fff',
  }}>
    {/* Subtle striped pattern overlay */}
    <div style={{
      position: 'absolute', inset: 0,
      background: `repeating-linear-gradient(45deg,
        transparent 0 40px,
        rgba(255,255,255,0.04) 40px 41px)`,
      pointerEvents: 'none'
    }}/>
    {/* Glow circle */}
    <div style={{
      position: 'absolute', top: '-20%', right: '-10%',
      width: '60%', height: '120%', borderRadius: '50%',
      background: `radial-gradient(circle, oklch(0.75 0.15 ${hue + 30} / 0.35) 0%, transparent 60%)`,
      pointerEvents: 'none'
    }}/>

    {/* Monospace label pinned top-start */}
    <div className="mono" style={{
      position: 'absolute', top: 18, insetInlineStart: 22,
      fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.75)',
    }}>{label}</div>

    {/* Optional small date chip, bottom-start (no overlap with event name) */}
    {eventDate && (
      <div style={{
        position: 'absolute', bottom: 18, insetInlineStart: 22,
        padding: '6px 12px', borderRadius: 999,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.22)',
        fontSize: 11.5, fontWeight: 500,
        color: '#fff'
      }}>{eventDate}</div>
    )}

    {children}
  </div>
);

const Avatar = ({ name, hue = 245, size = 36 }) => {
  const letter = (name || '').trim()[0] || '•';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `oklch(0.88 0.05 ${hue})`,
      color: `oklch(0.35 0.1 ${hue})`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 600, fontSize: size * 0.4,
      border: '1px solid var(--line)'
    }}>{letter}</div>
  );
};

const PrimaryBtn = ({ children, onClick, color = 'var(--ink)', textColor = '#fff', block = true, small = false }) => (
  <button onClick={onClick} style={{
    display: block ? 'block' : 'inline-block',
    width: block ? '100%' : 'auto',
    background: color, color: textColor,
    padding: small ? '10px 18px' : '14px 22px',
    borderRadius: 999,
    fontWeight: 500, fontSize: small ? 14 : 15,
    fontFamily: 'inherit',
    transition: 'transform 0.15s'
  }}>{children}</button>
);

const GhostBtn = ({ children, onClick, block = false }) => (
  <button onClick={onClick} style={{
    display: block ? 'block' : 'inline-flex',
    alignItems: 'center', gap: 6,
    width: block ? '100%' : 'auto',
    background: '#fff',
    border: '1px solid var(--line-2)',
    color: 'var(--ink)',
    padding: '12px 18px',
    borderRadius: 999,
    fontWeight: 500, fontSize: 14,
    fontFamily: 'inherit',
    justifyContent: block ? 'center' : 'flex-start',
  }}>{children}</button>
);

// Clean event meta row (date/location/link)
const MetaRow = ({ icon, title, sub, mono }) => (
  <div style={uiStyles.metaRow}>
    <div style={uiStyles.metaIcon}>{icon}</div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={uiStyles.metaTitle}>{title}</div>
      {sub && <div style={{ ...uiStyles.metaSub, fontFamily: mono ? 'IBM Plex Mono, monospace' : 'inherit' }}>{sub}</div>}
    </div>
  </div>
);

// Client-brand header: logos FIRST (right in RTL), then name + organizer — all right-aligned
const ClientBrandRow = ({ name, logo, hue = 245, parentOrg, parentLogo, parentHue = 220 }) => (
  <div style={{
    padding: '16px 20px',
    borderBottom: '1px solid var(--line)',
    display: 'flex', alignItems: 'center', gap: 14,
    justifyContent: 'flex-start',
    background: '#fff'
  }}>
    {/* Stacked logos — community + organizer badge overlap */}
    <div style={{ position: 'relative', flexShrink: 0, width: 44, height: 44 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: `linear-gradient(135deg, oklch(0.55 0.14 ${hue}) 0%, oklch(0.35 0.14 ${hue - 20}) 100%)`,
        color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 17,
      }}>{logo || (name || '').trim()[0]}</div>
      {parentOrg && (
        <div style={{
          position: 'absolute',
          insetInlineEnd: -4, bottom: -4,
          width: 20, height: 20, borderRadius: '50%',
          background: `oklch(0.45 0.12 ${parentHue})`,
          color: '#fff', fontWeight: 700, fontSize: 10,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>{parentLogo || (parentOrg || '').trim()[0]}</div>
      )}
    </div>

    {/* Name + organizer text — right-aligned */}
    <div style={{ minWidth: 0, textAlign: 'right' }}>
      <div style={{
        fontSize: 15, fontWeight: 700, lineHeight: 1.25,
        letterSpacing: -0.2,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>{name}</div>
      {parentOrg && (
        <div style={{
          fontSize: 12, color: 'var(--muted)', marginTop: 3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          المنظّم: <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{parentOrg}</span>
        </div>
      )}
    </div>
  </div>
);

// Minimal Mhwar footer for client emails (thin strip)
const MhwarFooter = () => (
  <div style={uiStyles.footer}>
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>أُرسل عبر</span>
        <MhwarMark size={14} />
      </div>
      <a href="https://mhwar.sa" className="mono" style={{
        fontSize: 11, color: 'var(--muted)',
        display: 'inline-flex', alignItems: 'center', gap: 4
      }}>
        mhwar.sa <IconArrowL size={11}/>
      </a>
    </div>
    <div style={uiStyles.footerLinks}>
      <a href="#">إلغاء الاشتراك</a>
      <span>·</span>
      <a href="#">تحديث التفضيلات</a>
      <span>·</span>
      <a href="#">المساعدة</a>
    </div>
  </div>
);

// Rich Mhwar footer with CTA — for platform emails (welcome, otp, payment, etc.)
const MhwarFooterCTA = ({ showCta = true }) => (
  <div style={{ background: '#0b2147', color: '#fff' }}>
    {showCta && (
      <div style={{
        padding: '34px 28px 30px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div className="mono" style={{
          fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase',
          color: '#76b6ff', marginBottom: 10
        }}>
          جرّب محور
        </div>
        <div style={{
          fontSize: 19, fontWeight: 600, lineHeight: 1.45,
          letterSpacing: -0.3, marginBottom: 16,
          color: '#fff', textWrap: 'pretty'
        }}>
          أنشئ فعاليتك القادمة في دقائق.<br/>
          دعوات، تأكيدات، وتذكيرات — في مكان واحد.
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href="https://mhwar.sa" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '11px 18px', borderRadius: 999,
            background: '#fff', color: '#0b2147',
            fontSize: 13, fontWeight: 600,
          }}>
            ابدأ مجاناً <IconArrowL size={14}/>
          </a>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '11px 18px', borderRadius: 999,
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 13, fontWeight: 500,
          }}>
            شاهد العرض التوضيحي
          </a>
        </div>
      </div>
    )}

    <div style={{ padding: '20px 28px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 14
      }}>
        <MhwarLogoLight height={22} />
        <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
          <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>الميزات</a>
          <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>الأسعار</a>
          <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>المدونة</a>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)',
        gap: 12, flexWrap: 'wrap'
      }}>
        <div className="mono" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>
          © 2026 MHWAR · الرياض
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
          <a href="#" style={{ color: 'inherit' }}>إلغاء الاشتراك</a>
          <a href="#" style={{ color: 'inherit' }}>الخصوصية</a>
          <a href="#" style={{ color: 'inherit' }}>المساعدة</a>
        </div>
      </div>
    </div>
  </div>
);

// Light logo version (white text for dark backgrounds)
const MhwarLogoLight = ({ height = 20 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <span style={{
      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
      fontSize: height * 0.95, fontWeight: 600,
      color: '#fff', letterSpacing: -0.5, lineHeight: 1
    }}>mhwar</span>
    <svg width={height * 0.9} height={height * 0.9} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="mgl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a8dcff"/>
          <stop offset="100%" stopColor="#4a9eff"/>
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="50" rx="34" ry="24" transform="rotate(-18 50 50)"
        stroke="url(#mgl)" strokeWidth="10" fill="none"/>
    </svg>
  </div>
);

// Platform (Mhwar-branded) header for non-client emails
const PlatformHeader = () => (
  <div style={{
    padding: '22px 28px',
    borderBottom: '1px solid var(--line)',
  }}>
    <MhwarMark size={24} />
  </div>
);

const uiStyles = {
  shellWrap: {
    background: '#fff',
    borderRadius: 18,
    border: '1px solid var(--line)',
    overflow: 'hidden',
    boxShadow: '0 1px 0 rgba(20,19,15,0.02), 0 30px 60px -40px rgba(20,19,15,0.18)',
  },
  shellHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--line)',
    background: '#fbfaf7',
  },
  shellHeaderRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 12, color: 'var(--muted)', marginBottom: 4
  },
  shellFromLabel: { fontSize: 11, color: 'var(--muted)' },
  shellFromValue: { fontSize: 12.5, color: 'var(--ink-2)' },
  shellSubject: { fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.2 },
  shellBody: { background: '#fff' },
  metaRow: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    padding: '12px 0',
  },
  metaIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'var(--warm)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--ink-2)', flexShrink: 0
  },
  metaTitle: { fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4 },
  metaSub: { fontSize: 12.5, color: 'var(--muted)', marginTop: 2, lineHeight: 1.5 },
  footer: {
    padding: '22px 28px',
    borderTop: '1px solid var(--line)',
    background: '#fbfaf7',
  },
  footerRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10
  },
  footerLinks: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 11.5, color: 'var(--muted)',
  },
};

Object.assign(window, {
  EmailShell, EmailCard, PlaceholderCover, Avatar,
  PrimaryBtn, GhostBtn, MetaRow, ClientBrandRow, MhwarFooter, MhwarFooterCTA,
  MhwarLogoLight, PlatformHeader,
  uiStyles
});
