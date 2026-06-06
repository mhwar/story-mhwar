// Templates Hub — unified browser for all 25+ templates.
// Mirrors the visual language of AtlasFeaturesTab (family sidebar + cards + search).
// Reads from the global TEMPLATES array; doesn't duplicate anything.
// Clicking a card calls `onOpen(templateId)` which the parent uses to set the active template.

const { useState: useStateTH, useMemo: useMemoTH } = React;

// ---- Template taxonomy (metadata layer — no changes to the templates themselves) ----
// Families are editorial groupings by intent, not just by sender.
// Each entry maps a template id → { family, channels: [] }.
// channels[0] is the default/primary channel for that template.

const TH_CHANNELS = [
  { id: 'email',    label: 'بريد',     hue: 205, icon: '✉' },
  { id: 'whatsapp', label: 'واتساب',   hue: 145, icon: '⌬' },
  { id: 'web',      label: 'صفحة',     hue: 245, icon: '▤' },
  { id: 'mobile',   label: 'موبايل',   hue: 285, icon: '▣' },
];

const TH_FAMILIES = [
  { id: 'event',        label: 'فعاليات',           hue: 35,  icon: '◈', desc: 'دعوة · تأكيد · تذكير · دخول · تحديث' },
  { id: 'post-event',   label: 'ما بعد الفعالية',    hue: 170, icon: '✎', desc: 'شكر · تقييم · شهادات' },
  { id: 'community',    label: 'مجتمعات ونشرات',     hue: 265, icon: '○', desc: 'نشرات دورية · محتوى مستمر' },
  { id: 'landing',      label: 'صفحات هبوط ومرئيات', hue: 245, icon: '▤', desc: 'صفحات ويب · تصميم دعوات · موبايل' },
  { id: 'access',       label: 'الدخول والهوية',     hue: 220, icon: '◉', desc: 'OTP · كلمات مرور · دعوات فريق' },
  { id: 'lifecycle',    label: 'رحلة المستخدم',      hue: 145, icon: '↗', desc: 'ترحيب · ترقية · نشر فعالية' },
  { id: 'billing',      label: 'الدفع والفوترة',     hue: 95,  icon: '◐', desc: 'تأكيدات · فشل · إيصالات' },
  { id: 'reports',      label: 'التقارير',           hue: 175, icon: '△', desc: 'ملخصات أسبوعية وإحصائيات' },
];

// Per-template metadata: family + channels available (matches what app.jsx's waId map supports).
const TH_TEMPLATE_META = {
  // Client templates — events
  'event-invite':     { family: 'event',      channels: ['email', 'whatsapp'] },
  'rsvp-confirm':     { family: 'event',      channels: ['email', 'whatsapp'] },
  'reminder':         { family: 'event',      channels: ['email', 'whatsapp'] },
  'access-link':      { family: 'event',      channels: ['email', 'whatsapp'] },
  'waitlist':         { family: 'event',      channels: ['email'] },
  'speaker-invite':   { family: 'event',      channels: ['email'] },
  'event-update':     { family: 'event',      channels: ['email'] },

  // Client templates — post-event
  'after-event':      { family: 'post-event', channels: ['email', 'whatsapp'] },
  'feedback':         { family: 'post-event', channels: ['email', 'whatsapp'] },
  'certificate':      { family: 'post-event', channels: ['email', 'whatsapp'] },

  // Client templates — community
  'client-newsletter':{ family: 'community',  channels: ['email'] },

  // Client templates — landing / visual
  'landing-page':     { family: 'landing',    channels: ['web'] },
  'landing-page-dark':{ family: 'landing',    channels: ['mobile'] },
  'invite-designer':  { family: 'landing',    channels: ['web'] },

  // Platform templates — lifecycle
  'welcome':          { family: 'lifecycle',  channels: ['email'] },
  'event-published':  { family: 'lifecycle',  channels: ['email'] },
  'upgrade-nudge':    { family: 'lifecycle',  channels: ['email'] },

  // Platform templates — access
  'team-invite':      { family: 'access',     channels: ['email'] },
  'otp':              { family: 'access',     channels: ['email', 'whatsapp'] },
  'password-reset':   { family: 'access',     channels: ['email'] },

  // Platform templates — billing
  'payment':          { family: 'billing',    channels: ['email', 'whatsapp'] },
  'payment-failed':   { family: 'billing',    channels: ['email'] },

  // Platform templates — community / reports
  'platform-newsletter': { family: 'community', channels: ['email'] },
  'weekly-digest':       { family: 'reports',   channels: ['email'] },
};

// Build the enriched list that the hub renders
function thEnrichTemplates() {
  const raw = window.TEMPLATES || [];
  // exclude hub itself + atlas refs (they aren't "templates")
  return raw
    .filter(t => t.group === 'قوالب العملاء' || t.group === 'قوالب المنصة')
    .map(t => {
      const meta = TH_TEMPLATE_META[t.id] || { family: 'event', channels: ['email'] };
      return { ...t, _family: meta.family, _channels: meta.channels, _sender: t.group === 'قوالب العملاء' ? 'client' : 'platform' };
    });
}

function TemplatesHub({ onOpen }) {
  const templates = useMemoTH(() => thEnrichTemplates(), []);
  const [activeSender, setActiveSender] = useStateTH('all'); // all / client / platform
  const [activeFamily, setActiveFamily] = useStateTH('all');
  const [activeChannel, setActiveChannel] = useStateTH('all');
  const [query, setQuery] = useStateTH('');

  const filtered = useMemoTH(() => {
    return templates.filter(t => {
      if (activeSender !== 'all' && t._sender !== activeSender) return false;
      if (activeFamily !== 'all' && t._family !== activeFamily) return false;
      if (activeChannel !== 'all' && !t._channels.includes(activeChannel)) return false;
      if (query) {
        const hay = `${t.label} ${t.desc || ''}`;
        if (!hay.includes(query.trim())) return false;
      }
      return true;
    });
  }, [templates, activeSender, activeFamily, activeChannel, query]);

  const familyCounts = useMemoTH(() => {
    const m = {};
    templates.forEach(t => { m[t._family] = (m[t._family] || 0) + 1; });
    return m;
  }, [templates]);

  const senderCounts = useMemoTH(() => {
    const m = { client: 0, platform: 0 };
    templates.forEach(t => { m[t._sender]++; });
    return m;
  }, [templates]);

  const channelCounts = useMemoTH(() => {
    const m = {};
    templates.forEach(t => t._channels.forEach(ch => { m[ch] = (m[ch] || 0) + 1; }));
    return m;
  }, [templates]);

  const anyFilter = activeSender !== 'all' || activeFamily !== 'all' || activeChannel !== 'all' || !!query;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 40px 60px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>
      {/* Sidebar */}
      <aside style={{ position: 'sticky', top: 70, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>المُرسِل</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ThSideItem label="كل المُرسِلين" count={templates.length} active={activeSender === 'all'}
              onClick={() => setActiveSender('all')} accent="var(--ink)" />
            <ThSideItem label="قوالب العميل" count={senderCounts.client} active={activeSender === 'client'}
              onClick={() => setActiveSender(activeSender === 'client' ? 'all' : 'client')}
              accent="oklch(0.48 0.14 35)" bg="oklch(0.97 0.02 35)"
              brief="يرسلها العميل لجمهوره — بهويته" />
            <ThSideItem label="قوالب المنصّة" count={senderCounts.platform} active={activeSender === 'platform'}
              onClick={() => setActiveSender(activeSender === 'platform' ? 'all' : 'platform')}
              accent="oklch(0.48 0.14 265)" bg="oklch(0.97 0.02 265)"
              brief="ترسلها محور — بهوية محور" />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>العائلات</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ThSideItem label="الكل" count={templates.length} active={activeFamily === 'all'}
              onClick={() => setActiveFamily('all')} accent="var(--ink)" />
            {TH_FAMILIES.map(fam => (
              <ThSideItem key={fam.id} label={fam.label} count={familyCounts[fam.id] || 0}
                active={activeFamily === fam.id}
                onClick={() => setActiveFamily(activeFamily === fam.id ? 'all' : fam.id)}
                accent={`oklch(0.48 0.14 ${fam.hue})`}
                bg={`oklch(0.96 0.02 ${fam.hue})`}
                brief={fam.desc}
                icon={fam.icon} />
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div>
        <div style={{ marginBottom: 22 }}>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Mhwar · Templates Library
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: -0.5 }}>مكتبة القوالب</h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--ink-2)', maxWidth: 640, lineHeight: 1.75 }}>
            {templates.length} قالبًا جاهزًا — قوالب العميل وقوالب المنصّة في مكان واحد. اضغط أي قالب لمعاينته عبر قنواته المختلفة.
          </p>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>⌕</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث في القوالب بالاسم أو الوصف..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', background: 'transparent' }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{filtered.length}/{templates.length}</span>
        </div>

        {/* Channel pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
          <span style={{ fontSize: 10.5, color: 'var(--muted)', marginLeft: 4, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>القناة</span>
          <ThPill active={activeChannel === 'all'} onClick={() => setActiveChannel('all')} label="الكل" />
          {TH_CHANNELS.map(ch => (
            <ThPill key={ch.id} active={activeChannel === ch.id}
              onClick={() => setActiveChannel(activeChannel === ch.id ? 'all' : ch.id)}
              label={ch.label} count={channelCounts[ch.id] || 0} hue={ch.hue} />
          ))}
          {anyFilter && (
            <button onClick={() => { setActiveSender('all'); setActiveFamily('all'); setActiveChannel('all'); setQuery(''); }}
              style={{ marginInlineStart: 'auto', padding: '6px 10px', borderRadius: 999, background: 'transparent', border: '1px dashed var(--line)', color: 'var(--muted)', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}>
              ✕ مسح الفلاتر
            </button>
          )}
        </div>

        {/* Content */}
        {!anyFilter ? (
          <ThByFamily templates={templates} onOpen={onOpen} />
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--panel)', borderRadius: 12, border: '1px dashed var(--line)' }}>
            <div style={{ fontSize: 28, color: 'var(--muted)', marginBottom: 8 }}>○</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>لا توجد قوالب تطابق البحث</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>جرّب إزالة بعض الفلاتر</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {filtered.map(t => <ThCard key={t.id} t={t} onOpen={() => onOpen(t.id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Grouped-by-family layout (default view when no filters active) ----
function ThByFamily({ templates, onOpen }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {TH_FAMILIES.map(fam => {
        const items = templates.filter(t => t._family === fam.id);
        if (!items.length) return null;
        const accent = `oklch(0.48 0.14 ${fam.hue})`;
        const bg = `oklch(0.97 0.02 ${fam.hue})`;
        return (
          <section key={fam.id}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  display: 'inline-grid', placeItems: 'center',
                  width: 34, height: 34, borderRadius: 9,
                  background: bg, color: accent,
                  fontSize: 18,
                }}>{fam.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{fam.label}</h3>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{fam.desc}</div>
                </div>
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{items.length} قالب</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {items.map(t => <ThCard key={t.id} t={t} onOpen={() => onOpen(t.id)} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ---- Card ----
function ThCard({ t, onOpen }) {
  const isClient = t._sender === 'client';
  const senderHue = isClient ? 35 : 265;
  const accentBg = `oklch(0.97 0.02 ${senderHue})`;
  const accentFg = `oklch(0.42 0.13 ${senderHue})`;
  return (
    <button onClick={onOpen} style={{
      textAlign: 'right',
      padding: 14, background: '#fff',
      border: '1px solid var(--line)', borderRadius: 12,
      fontFamily: 'inherit', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'all .15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${accentFg}`; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px -8px rgba(20,19,15,.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.border = '1px solid var(--line)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{
          display: 'inline-grid', placeItems: 'center',
          width: 36, height: 36, borderRadius: 9,
          background: accentBg, color: accentFg,
          flexShrink: 0,
        }}>{t.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{t.label}</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{t.desc}</div>
        </div>
      </div>

      {/* Channels available */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto' }}>
        {t._channels.map(ch => {
          const meta = TH_CHANNELS.find(c => c.id === ch);
          if (!meta) return null;
          return (
            <span key={ch} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10.5, padding: '3px 8px', borderRadius: 999,
              background: `oklch(0.95 0.03 ${meta.hue})`,
              color: `oklch(0.38 0.14 ${meta.hue})`,
            }}>
              <span style={{ fontSize: 9 }}>{meta.icon}</span>
              {meta.label}
            </span>
          );
        })}
      </div>

      {/* Sender label */}
      <div style={{
        alignSelf: 'flex-start',
        fontSize: 10, padding: '2px 7px', borderRadius: 4,
        background: accentBg, color: accentFg, fontWeight: 600,
        letterSpacing: 0.3,
      }}>{isClient ? 'قالب عميل' : 'قالب منصّة'}</div>
    </button>
  );
}

// ---- Side item (same style as features tab) ----
function ThSideItem({ label, count, active, onClick, accent, bg, brief, icon }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      width: '100%', textAlign: 'right',
      padding: '8px 10px', borderRadius: 8,
      background: active ? (bg || 'var(--panel)') : 'transparent',
      border: active ? `1px solid ${accent}` : '1px solid transparent',
      cursor: 'pointer', fontFamily: 'inherit',
    }}>
      {icon && <span style={{ fontSize: 13, color: active ? accent : 'var(--muted)' }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? accent : 'var(--ink)' }}>{label}</div>
        {brief && <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{brief}</div>}
      </div>
      <span className="mono" style={{ fontSize: 10.5, color: active ? accent : 'var(--muted)' }}>{count}</span>
    </button>
  );
}

// ---- Pill ----
function ThPill({ active, onClick, label, count, hue }) {
  const bg = active ? (hue != null ? `oklch(0.92 0.06 ${hue})` : 'var(--ink)') : '#fff';
  const fg = active ? (hue != null ? `oklch(0.35 0.15 ${hue})` : '#fff') : 'var(--ink-2)';
  return (
    <button onClick={onClick} style={{
      padding: '5px 11px', borderRadius: 999, background: bg, color: fg,
      border: active ? 'none' : '1px solid var(--line)',
      fontSize: 11, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <span>{label}</span>
      {count != null && <span className="mono" style={{ fontSize: 10, opacity: .7 }}>{count}</span>}
    </button>
  );
}

Object.assign(window, {
  TemplatesHub, TH_FAMILIES, TH_CHANNELS, TH_TEMPLATE_META, thEnrichTemplates,
});
