// Minimal line icons — 24x24, 1.5px stroke
const Icon = ({ d, size = 18, stroke = 1.5, fill = 'none', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...p}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const IconCalendar = (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>} />;
const IconClock    = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />;
const IconPin      = (p) => <Icon {...p} d={<><path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></>} />;
const IconLink     = (p) => <Icon {...p} d={<><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>} />;
const IconUser     = (p) => <Icon {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>} />;
const IconMail     = (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></>} />;
const IconCheck    = (p) => <Icon {...p} d="M5 12l5 5L20 7" />;
const IconCheckCircle = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></>} />;
const IconArrowL   = (p) => <Icon {...p} d="M15 18l-6-6 6-6" />;
const IconArrowR   = (p) => <Icon {...p} d="M9 18l6-6-6-6" />;
const IconDesktop  = (p) => <Icon {...p} d={<><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>} />;
const IconMobile   = (p) => <Icon {...p} d={<><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></>} />;
const IconCode     = (p) => <Icon {...p} d={<><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/></>} />;
const IconQR       = (p) => <Icon {...p} d={<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/></>} />;
const IconDownload = (p) => <Icon {...p} d={<><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></>} />;
const IconSparkle  = (p) => <Icon {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" />;
const IconX        = (p) => <Icon {...p} d="M6 6l12 12M18 6L6 18" />;
const IconShield   = (p) => <Icon {...p} d={<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></>} />;
const IconCreditCard = (p) => <Icon {...p} d={<><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></>} />;
const IconBell     = (p) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 20a2 2 0 0 0 4 0"/></>} />;
const IconRefresh  = (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>} />;
const IconHeart    = (p) => <Icon {...p} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />;
const IconAward    = (p) => <Icon {...p} d={<><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5"/></>} />;
const IconStar     = (p) => <Icon {...p} d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />;
const IconMsg      = (p) => <Icon {...p} d={<><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>} />;

// Mhwar mark — real brand logo
const MhwarMark = ({ size = 20, variant = 'full' }) => {
  const height = size;
  // Actual logo is ~2167 x 834 (ratio ~2.6)
  const width = variant === 'full' ? height * 2.6 : height;
  return (
    <img
      src="assets/mhwar-logo-cropped.png"
      alt="محور"
      style={{
        height, width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    />
  );
};

// Just the "O" glyph (right side) for compact uses — blue ring
const MhwarGlyph = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a8dcff"/>
        <stop offset="100%" stopColor="#0b3d91"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="50" rx="34" ry="24" transform="rotate(-18 50 50)"
      stroke="url(#mg)" strokeWidth="10" fill="none"/>
  </svg>
);

Object.assign(window, {
  Icon, IconCalendar, IconClock, IconPin, IconLink, IconUser, IconMail, IconCheck,
  IconCheckCircle, IconArrowL, IconArrowR, IconDesktop, IconMobile, IconCode, IconQR,
  IconDownload, IconSparkle, IconX, IconShield, IconCreditCard, IconBell, IconRefresh,
  IconHeart, IconAward, IconStar, IconMsg, MhwarMark, MhwarGlyph
});
