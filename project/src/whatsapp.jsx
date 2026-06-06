// WhatsApp template renderer — Meta-compliant
// Supports: Header (text/image/doc), Body, Footer, Buttons (quick_reply, url, phone, copy_code)
// Variables: {{1}}, {{2}}... rendered as colored pills with tooltips

const { useState: useStateWa } = React;

// Parse body with {{N}} into tokens [{text} | {var: N}]
const tokenize = (text) => {
  if (!text) return [];
  const out = [];
  const re = /\{\{(\d+)\}\}/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ var: parseInt(m[1], 10) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
};

// Colored variable pill with hover tooltip
const VarPill = ({ n, meta }) => {
  const info = meta?.[n - 1];
  const label = info?.label || `متغير ${n}`;
  const sample = info?.sample || '';
  return (
    <span className="wa-var" style={{
      display: 'inline-flex', alignItems: 'center',
      background: '#fff3c4',
      color: '#7a5d00',
      border: '1px dashed #e0b700',
      borderRadius: 6,
      padding: '0 6px',
      fontWeight: 600, fontSize: '0.95em',
      cursor: 'help',
      position: 'relative',
      fontFamily: 'IBM Plex Mono, monospace',
    }}
    title={`${label}${sample ? ' — مثال: ' + sample : ''}`}>
      {`{{${n}}}`}
    </span>
  );
};

// Render body text with inline var pills + WhatsApp markdown (*bold*, _italic_)
const WaBody = ({ text, meta }) => {
  const tokens = tokenize(text);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.var != null) return <VarPill key={i} n={t.var} meta={meta}/>;
        // Simple bold/italic parsing
        const parts = t.text.split(/(\*[^*]+\*|_[^_]+_)/g);
        return parts.map((p, j) => {
          if (/^\*.+\*$/.test(p)) return <strong key={`${i}-${j}`} style={{fontWeight:700}}>{p.slice(1,-1)}</strong>;
          if (/^_.+_$/.test(p)) return <em key={`${i}-${j}`}>{p.slice(1,-1)}</em>;
          return <span key={`${i}-${j}`}>{p}</span>;
        });
      })}
    </>
  );
};

// WhatsApp phone frame — shows one message bubble with full template
const WhatsAppFrame = ({ template }) => {
  const t = template;
  const time = t.time || '3:42 م';
  return (
    <div style={waStyles.phone}>
      {/* Top chrome */}
      <div style={waStyles.chrome}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={waStyles.avatar}>{(t.senderName || 'م').trim()[0]}</div>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:'#fff'}}>{t.senderName || 'محور'}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.7)'}}>عبر WhatsApp Business</div>
          </div>
        </div>
        <div style={{display:'flex',gap:14,color:'#fff',opacity:0.85}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3a6 6 0 0 1 6 6c0 4-6 11-6 11S9 13 9 9a6 6 0 0 1 6-6z M3 11l6 6-6 6"/></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </div>
      </div>

      {/* Chat background */}
      <div style={waStyles.chat}>
        {/* Date pill */}
        <div style={waStyles.datePill}>اليوم</div>

        {/* Message bubble */}
        <div style={waStyles.bubbleWrap}>
          <div style={waStyles.bubble}>
            {/* Header — text or media */}
            {t.header && (
              <div style={waStyles.header}>
                {t.header.type === 'text' && (
                  <div style={{padding:'10px 12px 4px',fontWeight:700,fontSize:15}}>
                    <WaBody text={t.header.text} meta={t.meta}/>
                  </div>
                )}
                {t.header.type === 'image' && (
                  <div style={{
                    aspectRatio: '16/9',
                    background: `linear-gradient(135deg, oklch(0.55 0.14 ${t.header.hue || 245}) 0%, oklch(0.35 0.14 ${(t.header.hue || 245) - 20}) 100%)`,
                    borderRadius: 6,
                    margin: 4,
                    position:'relative',
                    overflow:'hidden',
                    color:'#fff',
                    display:'flex', alignItems:'flex-end',
                    padding: 12,
                  }}>
                    <div style={{
                      position:'absolute', inset:0,
                      background:'repeating-linear-gradient(45deg,transparent 0 30px,rgba(255,255,255,0.04) 30px 31px)',
                    }}/>
                    <div className="mono" style={{
                      fontSize:10, letterSpacing:2, textTransform:'uppercase',
                      opacity:0.85, position:'relative',
                    }}>{t.header.label || 'صورة الرأس'}</div>
                  </div>
                )}
                {t.header.type === 'document' && (
                  <div style={waStyles.docHeader}>
                    <div style={waStyles.docIcon}>📄</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.header.filename || 'document.pdf'}</div>
                      <div style={{fontSize:11,color:'#667781'}}>{t.header.size || '1.2 MB · PDF'}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Body */}
            <div style={waStyles.body}>
              <WaBody text={t.body} meta={t.meta}/>
            </div>

            {/* Footer */}
            {t.footer && (
              <div style={waStyles.footer}>{t.footer}</div>
            )}

            {/* Timestamp */}
            <div style={waStyles.time}>
              {time}
              <svg width="15" height="11" viewBox="0 0 16 11" style={{marginInlineStart:3}}><path fill="#53bdeb" d="M11.1.3l-.7-.3L4 6.4 1.4 3.8l-.7.7 3.3 3.3L11.1.3zM16 .3l-.7-.3-9 9L4.5 7.2l-.7.7 2.5 2.5L16 .3z"/></svg>
            </div>
          </div>

          {/* Buttons — outside bubble for CTA style, inside for quick_reply */}
          {t.buttons?.length > 0 && (
            <div style={{...waStyles.buttons}}>
              {t.buttons.map((b, i) => (
                <button key={i} style={{
                  ...waStyles.actionBtn,
                  borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)',
                }}>
                  {b.type === 'url' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>}
                  {b.type === 'phone' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 13 13 0 0 0 .7 2.8 2 2 0 0 1-.4 2L8 10a16 16 0 0 0 6 6l1.5-1.5a2 2 0 0 1 2-.4 13 13 0 0 0 2.9.7 2 2 0 0 1 1.7 2z"/></svg>}
                  {b.type === 'copy_code' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
                  {b.type === 'quick_reply' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 17l-5-5 5-5M4 12h16"/></svg>}
                  <span>{b.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input bar — disabled/decorative */}
      <div style={waStyles.inputBar}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
        <div style={{flex:1, padding:'8px 12px', background:'#fff', borderRadius:20, color:'#aaa', fontSize:14}}>رسالة</div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </div>
    </div>
  );
};

// Template meta panel — shows category, name, variable legend
const WaMetaPanel = ({ template }) => (
  <div style={waStyles.metaPanel}>
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
      <div style={{
        padding:'3px 10px', borderRadius:999,
        background: template.category === 'AUTHENTICATION' ? '#fef3e1' :
                    template.category === 'MARKETING' ? '#fde7f0' : '#e3f2e8',
        color:     template.category === 'AUTHENTICATION' ? '#b85c00' :
                    template.category === 'MARKETING' ? '#a01958' : '#075e54',
        fontSize:10.5, fontWeight:600, letterSpacing:0.4,
      }}>{template.category}</div>
      <div className="mono" style={{fontSize:11,color:'var(--muted)'}}>
        {template.name}
      </div>
      <div style={{marginInlineStart:'auto',fontSize:10.5,color:'var(--muted)'}}>
        {template.language || 'ar_SA'}
      </div>
    </div>

    <div style={{fontSize:11,fontWeight:600,color:'var(--muted)',letterSpacing:0.8,textTransform:'uppercase',marginBottom:10}}>
      المتغيرات ({template.meta?.length || 0})
    </div>

    {template.meta?.length ? (
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {template.meta.map((m, i) => (
          <div key={i} style={{
            display:'flex',alignItems:'center',gap:10,
            padding:'8px 10px',
            border:'1px solid var(--line)',
            borderRadius:8,
            background:'#fff',
          }}>
            <span style={{
              background:'#fff3c4',color:'#7a5d00',
              border:'1px dashed #e0b700',
              padding:'1px 6px',borderRadius:5,
              fontFamily:'IBM Plex Mono, monospace',
              fontSize:11, fontWeight:600, flexShrink:0,
            }}>{`{{${i+1}}}`}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12.5,fontWeight:500,color:'var(--ink)'}}>{m.label}</div>
              {m.sample && <div style={{fontSize:11,color:'var(--muted)',marginTop:1}}>مثال: {m.sample}</div>}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{fontSize:12,color:'var(--muted)',padding:'10px 0'}}>لا يوجد متغيرات</div>
    )}

    {/* Compliance notes */}
    <div style={{marginTop:18,padding:'12px 14px',background:'var(--warm)',borderRadius:10,fontSize:11.5,color:'var(--muted)',lineHeight:1.7}}>
      <div style={{fontWeight:600,color:'var(--ink-2)',marginBottom:4}}>متوافق مع سياسة Meta</div>
      الفئة: {template.category} · لا يبدأ أو ينتهي بمتغير · لا متغيرات متتالية · الأزرار ضمن الحد المسموح
    </div>
  </div>
);

const waStyles = {
  phone: {
    width: 360, height: 680,
    background:'#000',
    borderRadius:42,
    padding:10,
    boxShadow:'0 30px 60px -20px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.1)',
    display:'flex',flexDirection:'column',
    overflow:'hidden',
    margin:'0 auto',
    fontFamily:'inherit',
  },
  chrome: {
    background:'#075e54',
    padding:'14px 16px 12px',
    display:'flex',alignItems:'center',justifyContent:'space-between',
    borderTopLeftRadius:32, borderTopRightRadius:32,
  },
  avatar: {
    width:36,height:36,borderRadius:'50%',
    background:'#25d366',color:'#fff',
    display:'flex',alignItems:'center',justifyContent:'center',
    fontWeight:700,fontSize:15,
  },
  chat: {
    flex:1,
    background:'#e5ddd5',
    backgroundImage:'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03) 1px, transparent 1px), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.03) 1px, transparent 1px)',
    backgroundSize:'40px 40px',
    padding:'14px 10px',
    overflowY:'auto',
    display:'flex',flexDirection:'column',alignItems:'flex-start',
  },
  datePill: {
    alignSelf:'center',
    background:'rgba(225,245,254,0.92)',
    color:'#54656f',
    fontSize:11.5, fontWeight:500,
    padding:'4px 12px', borderRadius:8,
    marginBottom:14,
    boxShadow:'0 1px 1px rgba(0,0,0,0.05)',
  },
  bubbleWrap: {
    maxWidth:'88%',
    display:'flex',flexDirection:'column',
  },
  bubble: {
    background:'#fff',
    borderRadius:8,
    borderTopRightRadius:0,
    boxShadow:'0 1px 1px rgba(0,0,0,0.08)',
    overflow:'hidden',
    position:'relative',
    color:'#111b21',
    alignSelf:'flex-start',
  },
  header: {
    background:'#fff',
  },
  body: {
    padding:'8px 12px 6px',
    fontSize:14.5, lineHeight:1.55,
    color:'#111b21',
    whiteSpace:'pre-wrap',
    textWrap:'pretty',
  },
  footer: {
    padding:'2px 12px 4px',
    fontSize:12, color:'#667781',
    lineHeight:1.4,
  },
  time: {
    display:'flex',alignItems:'center',justifyContent:'flex-end',
    gap:2,
    padding:'2px 10px 6px',
    fontSize:10.5, color:'#667781',
  },
  docHeader: {
    display:'flex',alignItems:'center',gap:10,
    background:'#f5f6f6',
    margin:4, padding:'10px 12px',
    borderRadius:6,
  },
  docIcon: {
    width:36,height:36,borderRadius:6,
    background:'#fff',
    display:'flex',alignItems:'center',justifyContent:'center',
    fontSize:18,
    boxShadow:'0 1px 2px rgba(0,0,0,0.08)',
  },
  buttons: {
    background:'#fff',
    marginTop:2,
    borderRadius:8,
    boxShadow:'0 1px 1px rgba(0,0,0,0.08)',
    overflow:'hidden',
  },
  actionBtn: {
    width:'100%',
    background:'#fff',
    color:'#00a5f4',
    border:'none',
    padding:'11px 14px',
    fontSize:14.5, fontWeight:500,
    fontFamily:'inherit',
    display:'flex',alignItems:'center',justifyContent:'center',
    gap:8, cursor:'pointer',
  },
  inputBar: {
    background:'#f0f0f0',
    padding:'8px 10px',
    display:'flex',alignItems:'center',gap:8,
    borderBottomLeftRadius:32, borderBottomRightRadius:32,
  },
  metaPanel: {
    width: 300,
    padding: 20,
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 16,
  },
};

Object.assign(window, { WhatsAppFrame, WaMetaPanel, VarPill, WaBody });
