// Invitation Designer — full-page template
// Live canvas preview + side control panel
// 6 beautiful card styles, customizable colors/fonts/details, export PNG + PDF

const { useState: useStateID, useRef: useRefID, useEffect: useEffectID } = React;

// ---------- 6 card styles ----------
// Each takes a `cfg` object and renders a 1080x1350 (4:5) card

const IDcard1Minimal = ({ cfg }) => (
  // Style 1: Soft Minimal — generous whitespace, serif title, subtle emblem
  <div style={{
    width: '100%', height: '100%',
    background: cfg.bg,
    padding: '90px 72px',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: cfg.bodyFont,
    color: cfg.ink,
    position: 'relative'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div className="mono" style={{ fontSize: 14, letterSpacing: 2.5, textTransform: 'uppercase', color: cfg.accent, fontWeight: 600 }}>
        {cfg.eyebrow}
      </div>
      {cfg.logo ? (
        <img src={cfg.logo} alt="" style={{ maxHeight: 44, maxWidth: 140, objectFit: 'contain' }} />
      ) : (
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: `1.5px solid ${cfg.ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: cfg.titleFont, fontSize: 18, fontWeight: 600, color: cfg.ink
        }}>
          {cfg.initial}
        </div>
      )}
    </div>

    <div>
      <div style={{ fontSize: 15, color: cfg.muted, marginBottom: 18, letterSpacing: 0.3 }}>
        {cfg.invitationLine}
      </div>
      <h1 style={{
        fontFamily: cfg.titleFont,
        fontSize: 76, lineHeight: 1.05,
        letterSpacing: -1.5,
        margin: '0 0 28px',
        fontWeight: 500,
        color: cfg.ink,
      }}>
        {cfg.title}
      </h1>
      <p style={{
        fontSize: 18, lineHeight: 1.7,
        color: cfg.muted,
        maxWidth: 560,
        margin: 0,
      }}>
        {cfg.description}
      </p>
    </div>

    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24, paddingTop: 28,
      borderTop: `1px solid ${cfg.ink}15`,
    }}>
      {[
        { l: 'التاريخ', v: cfg.date },
        { l: 'التوقيت', v: cfg.time },
        { l: 'المكان', v: cfg.venue },
      ].map((x, i) => (
        <div key={i}>
          <div className="mono" style={{ fontSize: 10.5, color: cfg.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
            {x.l}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: cfg.ink, lineHeight: 1.4 }}>{x.v}</div>
        </div>
      ))}
    </div>
  </div>
);

const IDcard2Bold = ({ cfg }) => (
  // Style 2: Bold Statement — large type filling the frame, color block
  <div style={{
    width: '100%', height: '100%',
    background: cfg.accent,
    padding: '72px 64px',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: cfg.bodyFont,
    color: cfg.onAccent,
    position: 'relative'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 14px', borderRadius: 999,
        border: `1.5px solid ${cfg.onAccent}`,
        fontSize: 13, fontWeight: 600, letterSpacing: 0.3
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.onAccent }} />
        {cfg.eyebrow}
      </div>
      {cfg.logo && <img src={cfg.logo} alt="" style={{ maxHeight: 40, maxWidth: 140, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
    </div>

    <h1 style={{
      fontFamily: cfg.titleFont,
      fontSize: 128, lineHeight: 0.95,
      letterSpacing: -4,
      margin: 0,
      fontWeight: 700,
    }}>
      {cfg.title}
    </h1>

    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 28, marginBottom: 28,
      }}>
        <div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 8 }}>
            الموعد
          </div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{cfg.date}</div>
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 2 }}>{cfg.time}</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 8 }}>
            المكان
          </div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{cfg.venue}</div>
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 2 }}>{cfg.city}</div>
        </div>
      </div>
      <div style={{
        paddingTop: 20,
        borderTop: `1px solid ${cfg.onAccent}30`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 13, opacity: 0.85,
      }}>
        <div>{cfg.invitationLine}</div>
        <div className="mono" style={{ letterSpacing: 0.5 }}>{cfg.host}</div>
      </div>
    </div>
  </div>
);

const IDcard3Editorial = ({ cfg }) => (
  // Style 3: Editorial — classical poster, rule lines, centered
  <div style={{
    width: '100%', height: '100%',
    background: cfg.bg,
    padding: '80px 72px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'space-between',
    fontFamily: cfg.bodyFont, color: cfg.ink,
    textAlign: 'center'
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {cfg.logo ? (
        <img src={cfg.logo} alt="" style={{ maxHeight: 50, maxWidth: 160, objectFit: 'contain' }} />
      ) : (
        <div style={{
          fontFamily: cfg.titleFont, fontSize: 32, letterSpacing: -0.5,
          color: cfg.accent, fontWeight: 500,
        }}>{cfg.host}</div>
      )}
      <div style={{ width: 48, height: 1, background: cfg.ink + '40' }} />
      <div className="mono" style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: cfg.muted }}>
        {cfg.eyebrow}
      </div>
    </div>

    <div style={{ maxWidth: 600 }}>
      <div style={{ fontSize: 16, color: cfg.muted, marginBottom: 24, fontStyle: 'italic' }}>
        {cfg.invitationLine}
      </div>
      <h1 style={{
        fontFamily: cfg.titleFont,
        fontSize: 68, lineHeight: 1.1,
        letterSpacing: -1,
        margin: '0 0 24px',
        fontWeight: 500,
        color: cfg.ink,
      }}>
        {cfg.title}
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.7, color: cfg.muted, margin: 0 }}>
        {cfg.description}
      </p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 48, height: 1, background: cfg.ink + '40' }} />
      <div style={{ fontSize: 20, fontFamily: cfg.titleFont, fontWeight: 500, color: cfg.ink }}>
        {cfg.date} · {cfg.time}
      </div>
      <div style={{ fontSize: 14, color: cfg.muted }}>
        {cfg.venue}{cfg.city ? ` · ${cfg.city}` : ''}
      </div>
    </div>
  </div>
);

const IDcard4Gradient = ({ cfg }) => {
  // Style 4: Modern Gradient — soft radial gradient, asymmetric
  const grad = `radial-gradient(ellipse at 20% 30%, ${cfg.accent}40 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, ${cfg.accent}25 0%, transparent 55%), ${cfg.bg}`;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: grad,
      padding: '72px 64px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: cfg.bodyFont, color: cfg.ink,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {cfg.logo ? (
          <img src={cfg.logo} alt="" style={{ maxHeight: 44, maxWidth: 140, objectFit: 'contain' }} />
        ) : (
          <div style={{
            fontSize: 18, fontWeight: 700, fontFamily: cfg.titleFont, color: cfg.ink,
          }}>{cfg.host}</div>
        )}
        <div style={{
          padding: '7px 13px', borderRadius: 999,
          background: '#fff', border: `1px solid ${cfg.ink}15`,
          fontSize: 12, fontWeight: 600, color: cfg.accent, letterSpacing: 0.5,
        }}>
          {cfg.eyebrow}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 15, color: cfg.muted, marginBottom: 16 }}>
          {cfg.invitationLine}
        </div>
        <h1 style={{
          fontFamily: cfg.titleFont,
          fontSize: 92, lineHeight: 1,
          letterSpacing: -2.2,
          margin: '0 0 24px',
          fontWeight: 600,
          background: `linear-gradient(135deg, ${cfg.ink} 0%, ${cfg.accent} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {cfg.title}
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: cfg.muted, maxWidth: 520, margin: 0 }}>
          {cfg.description}
        </p>
      </div>

      <div style={{
        display: 'flex', gap: 14, flexWrap: 'wrap'
      }}>
        {[
          { l: 'التاريخ', v: cfg.date },
          { l: 'التوقيت', v: cfg.time },
          { l: 'المكان', v: cfg.venue },
        ].map((x, i) => (
          <div key={i} style={{
            flex: '1 1 160px',
            padding: '16px 18px',
            background: '#ffffffcc',
            backdropFilter: 'blur(6px)',
            border: `1px solid ${cfg.ink}12`,
            borderRadius: 14,
          }}>
            <div className="mono" style={{ fontSize: 10, color: cfg.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
              {x.l}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: cfg.ink }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IDcard5Frame = ({ cfg }) => (
  // Style 5: Classic Frame — formal inner border, symmetric
  <div style={{
    width: '100%', height: '100%',
    background: cfg.bg,
    padding: 40,
    fontFamily: cfg.bodyFont, color: cfg.ink,
    display: 'flex',
  }}>
    <div style={{
      flex: 1,
      border: `1px solid ${cfg.accent}60`,
      padding: '64px 56px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* corner flourishes */}
      {[[0,0],[0,'auto'],['auto',0],['auto','auto']].map(([t,l], i) => {
        const top = t === 'auto' ? 'auto' : 20, bottom = t === 'auto' ? 20 : 'auto';
        const left = l === 'auto' ? 'auto' : 20, right = l === 'auto' ? 20 : 'auto';
        return (
          <div key={i} style={{
            position: 'absolute', top, left, right, bottom,
            width: 24, height: 24,
            borderTop: i < 2 ? `1px solid ${cfg.accent}` : 'none',
            borderBottom: i >= 2 ? `1px solid ${cfg.accent}` : 'none',
            borderRight: (i === 1 || i === 3) ? `1px solid ${cfg.accent}` : 'none',
            borderLeft: (i === 0 || i === 2) ? `1px solid ${cfg.accent}` : 'none',
          }} />
        );
      })}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {cfg.logo ? (
          <img src={cfg.logo} alt="" style={{ maxHeight: 46, maxWidth: 150, objectFit: 'contain' }} />
        ) : (
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            border: `1.5px solid ${cfg.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: cfg.titleFont, fontSize: 22, color: cfg.accent,
          }}>
            {cfg.initial}
          </div>
        )}
        <div className="mono" style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: cfg.muted }}>
          {cfg.eyebrow}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 15, color: cfg.muted, marginBottom: 20, fontStyle: 'italic' }}>
          {cfg.invitationLine}
        </div>
        <h1 style={{
          fontFamily: cfg.titleFont,
          fontSize: 62, lineHeight: 1.1,
          letterSpacing: -0.8,
          margin: '0 0 20px',
          fontWeight: 500,
          color: cfg.ink,
        }}>
          {cfg.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ width: 30, height: 1, background: cfg.accent }} />
          <div className="mono" style={{ fontSize: 13, letterSpacing: 1.8, color: cfg.accent, textTransform: 'uppercase' }}>
            {cfg.host}
          </div>
          <div style={{ width: 30, height: 1, background: cfg.accent }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: cfg.ink, fontFamily: cfg.titleFont }}>
          {cfg.date}
        </div>
        <div style={{ fontSize: 14, color: cfg.muted }}>
          {cfg.time} · {cfg.venue}
        </div>
      </div>
    </div>
  </div>
);

const IDcard6Split = ({ cfg }) => (
  // Style 6: Split — color half + white half, two-column composition
  <div style={{
    width: '100%', height: '100%',
    display: 'grid', gridTemplateRows: '1.1fr 1fr',
    fontFamily: cfg.bodyFont,
    position: 'relative',
  }}>
    <div style={{
      background: cfg.accent, color: cfg.onAccent,
      padding: '60px 56px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="mono" style={{ fontSize: 12, letterSpacing: 2.2, textTransform: 'uppercase', opacity: 0.85 }}>
          {cfg.eyebrow}
        </div>
        {cfg.logo ? (
          <img src={cfg.logo} alt="" style={{ maxHeight: 40, maxWidth: 130, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        ) : (
          <div style={{ fontSize: 15, fontWeight: 600, opacity: 0.9 }}>{cfg.host}</div>
        )}
      </div>

      <h1 style={{
        fontFamily: cfg.titleFont,
        fontSize: 88, lineHeight: 0.98,
        letterSpacing: -2.5,
        margin: 0, fontWeight: 600,
      }}>
        {cfg.title}
      </h1>
    </div>

    <div style={{
      background: cfg.bg, color: cfg.ink,
      padding: '48px 56px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <p style={{ fontSize: 17, lineHeight: 1.7, color: cfg.muted, margin: 0, maxWidth: 560 }}>
        {cfg.description}
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        paddingTop: 20, borderTop: `1px solid ${cfg.ink}15`,
      }}>
        {[
          { l: 'التاريخ', v: cfg.date },
          { l: 'التوقيت', v: cfg.time },
          { l: 'المكان', v: cfg.venue },
        ].map((x, i) => (
          <div key={i}>
            <div className="mono" style={{ fontSize: 10.5, color: cfg.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
              {x.l}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: cfg.ink }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CARD_STYLES = [
  { id: 'minimal',   label: 'بسيط',   Comp: IDcard1Minimal },
  { id: 'bold',      label: 'جريء',   Comp: IDcard2Bold },
  { id: 'editorial', label: 'كلاسيكي',Comp: IDcard3Editorial },
  { id: 'gradient',  label: 'متدرّج', Comp: IDcard4Gradient },
  { id: 'frame',     label: 'إطار',   Comp: IDcard5Frame },
  { id: 'split',     label: 'مُقسَّم',  Comp: IDcard6Split },
];

// ---------- color palettes ----------
const PALETTES = [
  { id: 'ivory',    name: 'عاجي',   bg: '#FAF7F2', ink: '#1A1A1A', muted: '#6b6257', accent: '#8B5A3C', onAccent: '#FAF7F2' },
  { id: 'mint',     name: 'نعناعي', bg: '#F5F8F4', ink: '#1F2A24', muted: '#637368', accent: '#3E7A5A', onAccent: '#F5F8F4' },
  { id: 'rose',     name: 'وردي',   bg: '#FBF4F4', ink: '#2A1F21', muted: '#7a6468', accent: '#B4576E', onAccent: '#FBF4F4' },
  { id: 'sky',      name: 'سماوي',  bg: '#F4F7FB', ink: '#1B2233', muted: '#5f6a80', accent: '#3D5A8A', onAccent: '#F4F7FB' },
  { id: 'sand',     name: 'رملي',   bg: '#F6F1E9', ink: '#2A2419', muted: '#7a6e5a', accent: '#B88746', onAccent: '#FFFBF4' },
  { id: 'charcoal', name: 'فحمي',   bg: '#1A1A1A', ink: '#F5F5F0', muted: '#a5a39b', accent: '#D4A574', onAccent: '#1A1A1A' },
  { id: 'forest',   name: 'غابي',   bg: '#1F2B25', ink: '#F0F4EF', muted: '#9aaca1', accent: '#C8A96A', onAccent: '#1F2B25' },
  { id: 'plum',     name: 'برقوقي', bg: '#FBF7FA', ink: '#2B1F2C', muted: '#735e74', accent: '#6A3E74', onAccent: '#FBF7FA' },
];

const FONT_PAIRS = [
  { id: 'serif',   name: 'كلاسيكي',    title: '"Playfair Display", "Amiri", serif',   body: '"IBM Plex Sans Arabic", system-ui, sans-serif' },
  { id: 'display', name: 'عرض حديث',   title: '"Fraunces", "Amiri", serif',           body: '"IBM Plex Sans Arabic", system-ui, sans-serif' },
  { id: 'sans',    name: 'عصري',       title: '"IBM Plex Sans Arabic", sans-serif',   body: '"IBM Plex Sans Arabic", system-ui, sans-serif' },
  { id: 'mono',    name: 'تقني',       title: '"IBM Plex Sans Arabic", sans-serif',   body: '"IBM Plex Sans Arabic", system-ui, sans-serif' },
];

// ============================================================
// MAIN
// ============================================================
const InviteDesignerTemplate = ({ data }) => {
  const d = data || {};
  const [styleIdx, setStyleIdx] = useStateID(0);
  const [paletteId, setPaletteId] = useStateID('ivory');
  const [fontId, setFontId] = useStateID('serif');
  const [content, setContent] = useStateID({
    host: d.host || 'أكاديمية ثراء',
    initial: 'ث',
    eyebrow: d.eyebrow || 'دعوة حضور',
    invitationLine: d.invitationLine || 'يُسعدنا دعوتكم للمشاركة في',
    title: d.eventName || 'ملتقى ثراء السنوي',
    description: d.description || 'ليلة مختارة لأصحاب الأثر، نستعيد فيها ما بنيناه ونستشرف فصلاً جديداً من العطاء.',
    date: d.date || '14 شوّال 1447',
    time: d.time || '7:00 مساءً',
    venue: d.venue || 'مركز الملك فهد الثقافي',
    city: d.city || 'الرياض',
  });
  const [logo, setLogo] = useStateID(null);
  const [customAccent, setCustomAccent] = useStateID(null);
  const canvasRef = useRefID(null);
  const frameRef = useRefID(null);
  const [exporting, setExporting] = useStateID(false);
  const [toast, setToast] = useStateID(null);

  // Auto-scale the 1080×1350 card to fit the frame's available width/height
  useEffectID(() => {
    const updateScale = () => {
      if (!frameRef.current) return;
      const rect = frameRef.current.getBoundingClientRect();
      const scaleW = rect.width / 1080;
      const scaleH = rect.height / 1350;
      const scale = Math.min(scaleW, scaleH);
      frameRef.current.style.setProperty('--preview-scale', scale.toFixed(3));
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (frameRef.current) ro.observe(frameRef.current);
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const palette = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
  const fonts = FONT_PAIRS.find(f => f.id === fontId) || FONT_PAIRS[0];
  const StyleComp = CARD_STYLES[styleIdx].Comp;

  const cfg = {
    ...content,
    bg: palette.bg,
    ink: palette.ink,
    muted: palette.muted,
    accent: customAccent || palette.accent,
    onAccent: palette.onAccent,
    titleFont: fonts.title,
    bodyFont: fonts.body,
    logo,
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ---- EXPORTS ----
  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.body.appendChild(s);
  });

  const exportPNG = async () => {
    setExporting(true);
    try {
      await loadScript('https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js');
      const node = canvasRef.current;
      const dataUrl = await window.htmlToImage.toPng(node, {
        pixelRatio: 2,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
      const a = document.createElement('a');
      a.download = 'دعوة.png';
      a.href = dataUrl;
      a.click();
      showToast('تم تصدير الصورة');
    } catch (err) {
      console.error(err);
      showToast('تعذّر التصدير');
    }
    setExporting(false);
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      await loadScript('https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js');
      await loadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js');
      const node = canvasRef.current;
      const dataUrl = await window.htmlToImage.toPng(node, { pixelRatio: 2 });
      const { jsPDF } = window.jspdf;
      // 4:5 at A4 portrait width: use 210mm wide, height = 210 * 1.25 = 262.5mm
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, 262.5] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 262.5);
      pdf.save('دعوة.pdf');
      showToast('تم تصدير الملف');
    } catch (err) {
      console.error(err);
      showToast('تعذّر التصدير');
    }
    setExporting(false);
  };

  const copyImage = async () => {
    setExporting(true);
    try {
      await loadScript('https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js');
      const node = canvasRef.current;
      const blob = await window.htmlToImage.toBlob(node, { pixelRatio: 2 });
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('تم نسخ الصورة');
    } catch (err) {
      console.error(err);
      showToast('تعذّر النسخ');
    }
    setExporting(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'oklch(0.98 0.003 240)',
      fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif',
      display: 'grid',
      gridTemplateColumns: 'clamp(280px, 30vw, 340px) 1fr',
    }}>
      {/* ============ SIDEBAR CONTROLS ============ */}
      <aside style={{
        background: '#fff',
        borderInlineStart: '1px solid oklch(0.92 0.005 240)',
        borderInlineEnd: '1px solid oklch(0.92 0.005 240)',
        padding: 0,
        overflowY: 'auto',
        maxHeight: '100vh',
      }}>
        <div style={{ padding: '24px 24px 0' }}>
          <div className="mono" style={{ fontSize: 11, color: 'oklch(0.55 0.005 240)', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 6 }}>
            مصمّم الدعوات
          </div>
          <h1 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: -0.3, color: 'oklch(0.2 0.01 240)' }}>
            صمّم دعوتك
          </h1>
          <p style={{ fontSize: 13, color: 'oklch(0.5 0.01 240)', margin: '0 0 20px', lineHeight: 1.6 }}>
            غيّر النمط والألوان والتفاصيل — المعاينة تُحدَّث فوراً، والتصدير بنقرة.
          </p>
        </div>

        {/* Style picker */}
        <Section title="النمط">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {CARD_STYLES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStyleIdx(i)}
                style={{
                  aspectRatio: '4 / 5',
                  borderRadius: 8,
                  border: i === styleIdx ? '2px solid oklch(0.3 0.01 240)' : '1px solid oklch(0.9 0.005 240)',
                  background: '#fff',
                  cursor: 'pointer',
                  padding: 0,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <StylePreview id={s.id} palette={palette} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '4px 6px',
                  background: i === styleIdx ? 'oklch(0.3 0.01 240)' : '#fff',
                  color: i === styleIdx ? '#fff' : 'oklch(0.35 0.01 240)',
                  fontSize: 10, fontWeight: 600, textAlign: 'center',
                  borderTop: '1px solid oklch(0.9 0.005 240)',
                }}>
                  {s.label}
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* Palette */}
        <Section title="الألوان">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {PALETTES.map(p => (
              <button
                key={p.id}
                onClick={() => { setPaletteId(p.id); setCustomAccent(null); }}
                title={p.name}
                style={{
                  aspectRatio: '1',
                  borderRadius: 10,
                  border: p.id === paletteId ? '2px solid oklch(0.3 0.01 240)' : '1px solid oklch(0.92 0.005 240)',
                  background: p.bg,
                  cursor: 'pointer',
                  padding: 0,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                }}>
                  <div style={{ background: p.bg }} />
                  <div style={{ background: p.accent }} />
                </div>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '2px 0', background: '#ffffff', fontSize: 9.5,
                  textAlign: 'center', color: 'oklch(0.35 0.01 240)',
                }}>
                  {p.name}
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11.5, color: 'oklch(0.5 0.01 240)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>لون مُخصَّص:</span>
              <input
                type="color"
                value={customAccent || palette.accent}
                onChange={(e) => setCustomAccent(e.target.value)}
                style={{ width: 34, height: 26, border: '1px solid oklch(0.9 0.005 240)', borderRadius: 6, padding: 0, cursor: 'pointer', background: 'transparent' }}
              />
              {customAccent && (
                <button
                  onClick={() => setCustomAccent(null)}
                  style={{ fontSize: 10.5, padding: '3px 8px', border: '1px solid oklch(0.9 0.005 240)', borderRadius: 5, background: '#fff', cursor: 'pointer', color: 'oklch(0.45 0.01 240)' }}
                >
                  إعادة
                </button>
              )}
            </label>
          </div>
        </Section>

        {/* Typography */}
        <Section title="الخطوط">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FONT_PAIRS.map(f => (
              <button
                key={f.id}
                onClick={() => setFontId(f.id)}
                style={{
                  padding: '7px 12px', borderRadius: 7,
                  border: f.id === fontId ? '1.5px solid oklch(0.3 0.01 240)' : '1px solid oklch(0.9 0.005 240)',
                  background: f.id === fontId ? 'oklch(0.96 0.005 240)' : '#fff',
                  fontSize: 12, fontWeight: 500, color: 'oklch(0.25 0.01 240)',
                  cursor: 'pointer',
                  fontFamily: f.title,
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </Section>

        {/* Content */}
        <Section title="محتوى الدعوة">
          <Field label="الجهة المنظّمة" value={content.host} onChange={v => setContent({ ...content, host: v })} />
          <Field label="عنوان الفعاليّة" value={content.title} onChange={v => setContent({ ...content, title: v })} />
          <Field label="الوصف" value={content.description} onChange={v => setContent({ ...content, description: v })} textarea />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="التاريخ" value={content.date} onChange={v => setContent({ ...content, date: v })} />
            <Field label="التوقيت" value={content.time} onChange={v => setContent({ ...content, time: v })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="المكان" value={content.venue} onChange={v => setContent({ ...content, venue: v })} />
            <Field label="المدينة" value={content.city} onChange={v => setContent({ ...content, city: v })} />
          </div>
          <Field label="شارة (eyebrow)" value={content.eyebrow} onChange={v => setContent({ ...content, eyebrow: v })} />
          <Field label="جملة الدعوة" value={content.invitationLine} onChange={v => setContent({ ...content, invitationLine: v })} />
        </Section>

        {/* Logo */}
        <Section title="الشعار">
          {logo ? (
            <div style={{
              padding: 14, background: 'oklch(0.97 0.005 240)',
              border: '1px solid oklch(0.92 0.005 240)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <img src={logo} alt="" style={{ maxHeight: 32, maxWidth: 80, objectFit: 'contain' }} />
              <button
                onClick={() => setLogo(null)}
                style={{ marginInlineStart: 'auto', fontSize: 11.5, padding: '5px 10px', border: '1px solid oklch(0.88 0.005 240)', background: '#fff', borderRadius: 6, cursor: 'pointer', color: 'oklch(0.45 0.01 240)' }}
              >
                إزالة
              </button>
            </div>
          ) : (
            <label style={{
              display: 'block',
              padding: 14, borderRadius: 8,
              border: '1.5px dashed oklch(0.88 0.005 240)',
              textAlign: 'center', cursor: 'pointer',
              fontSize: 12.5, color: 'oklch(0.5 0.01 240)',
            }}>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              ↑ ارفع الشعار (PNG/SVG)
            </label>
          )}
        </Section>

        {/* Export */}
        <Section title="التصدير">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={exportPNG}
              disabled={exporting}
              style={{
                padding: '11px 14px', borderRadius: 8,
                background: 'oklch(0.2 0.01 240)', color: '#fff',
                border: 'none', cursor: exporting ? 'wait' : 'pointer',
                fontSize: 13, fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              {exporting ? 'جارٍ التصدير...' : '⬇ صورة PNG'}
            </button>
            <button
              onClick={exportPDF}
              disabled={exporting}
              style={{
                padding: '11px 14px', borderRadius: 8,
                background: '#fff', color: 'oklch(0.2 0.01 240)',
                border: '1px solid oklch(0.88 0.005 240)',
                cursor: exporting ? 'wait' : 'pointer',
                fontSize: 13, fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              ⬇ ملف PDF
            </button>
            <button
              onClick={copyImage}
              disabled={exporting}
              style={{
                padding: '11px 14px', borderRadius: 8,
                background: '#fff', color: 'oklch(0.4 0.01 240)',
                border: '1px solid oklch(0.92 0.005 240)',
                cursor: exporting ? 'wait' : 'pointer',
                fontSize: 12.5, fontWeight: 500,
                fontFamily: 'inherit',
              }}
            >
              📋 نسخ كصورة
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'oklch(0.55 0.01 240)', marginTop: 10, lineHeight: 1.6 }}>
            مقاس التصدير: 1080×1350 (Instagram-ready). PDF بحجم A4 ممتدّ.
          </div>
        </Section>

        <div style={{ height: 40 }} />
      </aside>

      {/* ============ CANVAS PREVIEW ============ */}
      <div style={{
        padding: 40,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: `
          radial-gradient(circle at 20% 20%, oklch(0.94 0.005 240) 0%, transparent 60%),
          radial-gradient(circle at 80% 80%, oklch(0.96 0.005 240) 0%, transparent 60%),
          oklch(0.985 0.003 240)
        `,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'auto',
      }}>
        <div style={{
          fontSize: 11.5,
          color: 'oklch(0.5 0.01 240)',
          marginBottom: 18,
          letterSpacing: 0.3,
        }}>
          المعاينة · 1080 × 1350
        </div>
        {/* Preview frame — auto-scales inner 1080×1350 card to fit available width */}
        <div
          ref={frameRef}
          style={{
            width: '100%',
            maxWidth: 560,
            aspectRatio: '1080 / 1350',
            position: 'relative',
          }}
        >
          <div
            ref={canvasRef}
            dir="rtl"
            style={{
              width: 1080, height: 1350,
              background: '#fff',
              borderRadius: 28,
              boxShadow: '0 30px 80px -30px rgba(20,30,50,.25), 0 8px 24px -10px rgba(20,30,50,.12)',
              overflow: 'hidden',
              position: 'absolute',
              top: 0, left: 0,
              transform: 'scale(var(--preview-scale, 0.44))',
              transformOrigin: 'top left',
            }}
          >
            <StyleComp cfg={cfg} />
          </div>
        </div>

        <div style={{
          marginTop: 20,
          display: 'flex', gap: 14,
          fontSize: 11.5,
          color: 'oklch(0.5 0.01 240)',
        }}>
          <span>النمط: {CARD_STYLES[styleIdx].label}</span>
          <span>·</span>
          <span>اللوحة: {palette.name}</span>
          <span>·</span>
          <span>الخط: {fonts.name}</span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24, left: '50%',
          transform: 'translateX(-50%)',
          background: 'oklch(0.2 0.01 240)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 10px 30px rgba(0,0,0,.2)',
          zIndex: 100,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
};

// ---------- sub-components ----------
const Section = ({ title, children }) => (
  <div style={{
    padding: '18px 24px',
    borderTop: '1px solid oklch(0.94 0.005 240)',
  }}>
    <div className="mono" style={{
      fontSize: 10.5,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      color: 'oklch(0.5 0.01 240)',
      marginBottom: 12,
      fontWeight: 600,
    }}>
      {title}
    </div>
    {children}
  </div>
);

const Field = ({ label, value, onChange, textarea }) => {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: 'oklch(0.5 0.01 240)', marginBottom: 4 }}>{label}</div>
      <Tag
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 2 : undefined}
        style={{
          width: '100%',
          padding: '7px 10px',
          borderRadius: 6,
          border: '1px solid oklch(0.92 0.005 240)',
          background: '#fff',
          fontSize: 12.5,
          fontFamily: 'inherit',
          color: 'oklch(0.2 0.01 240)',
          resize: textarea ? 'vertical' : 'none',
          boxSizing: 'border-box',
        }}
      />
    </label>
  );
};

// Preview mini — simple color block to represent each style in style picker
const StylePreview = ({ id, palette }) => {
  const bg = palette.bg, accent = palette.accent, ink = palette.ink;
  switch (id) {
    case 'minimal':
      return (
        <div style={{ width: '100%', height: '100%', background: bg, padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ width: 12, height: 2, background: accent }} />
          <div>
            <div style={{ width: '70%', height: 6, background: ink, marginBottom: 3, borderRadius: 1 }} />
            <div style={{ width: '40%', height: 6, background: ink, borderRadius: 1 }} />
          </div>
          <div style={{ width: '100%', height: 1, background: ink, opacity: 0.15 }} />
        </div>
      );
    case 'bold':
      return (
        <div style={{ width: '100%', height: '100%', background: accent, padding: 8, display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ width: 24, height: 8, background: palette.onAccent, marginBottom: 2, borderRadius: 1 }} />
            <div style={{ width: 18, height: 8, background: palette.onAccent, borderRadius: 1 }} />
          </div>
        </div>
      );
    case 'editorial':
      return (
        <div style={{ width: '100%', height: '100%', background: bg, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: `1px solid ${accent}` }} />
          <div>
            <div style={{ width: 36, height: 5, background: ink, marginBottom: 2, borderRadius: 1 }} />
            <div style={{ width: 28, height: 4, background: ink, opacity: 0.5, margin: '0 auto', borderRadius: 1 }} />
          </div>
          <div style={{ width: 16, height: 1, background: accent }} />
        </div>
      );
    case 'gradient':
      return (
        <div style={{ width: '100%', height: '100%', background: `radial-gradient(circle at 30% 30%, ${accent}50, ${bg})`, padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ width: '60%', height: 6, background: ink, marginBottom: 2, borderRadius: 1 }} />
          <div style={{ width: '35%', height: 6, background: ink, borderRadius: 1 }} />
        </div>
      );
    case 'frame':
      return (
        <div style={{ width: '100%', height: '100%', background: bg, padding: 6 }}>
          <div style={{ width: '100%', height: '100%', border: `1px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 20, height: 5, background: ink, borderRadius: 1 }} />
          </div>
        </div>
      );
    case 'split':
      return (
        <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateRows: '1.1fr 1fr' }}>
          <div style={{ background: accent, padding: 6, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ width: '75%', height: 7, background: palette.onAccent, borderRadius: 1 }} />
          </div>
          <div style={{ background: bg, padding: 6, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ width: '50%', height: 3, background: ink, opacity: 0.5, borderRadius: 1 }} />
          </div>
        </div>
      );
    default: return null;
  }
};
