// Main app — navigation, device toggle, tweaks integration

const { useState, useEffect, useMemo, useRef } = React;

const TEMPLATES = [
  { id: 'event-invite',  Comp: EventInviteTemplate,  group: 'قوالب العملاء', label: 'دعوة لفعالية',        desc: 'من العميل لجمهوره', icon: <IconMail/>, branded: 'client' },
  { id: 'rsvp-confirm',  Comp: RsvpConfirmTemplate,  group: 'قوالب العملاء', label: 'تأكيد الحضور',         desc: 'مع تذكرة + QR',     icon: <IconQR/>, branded: 'client' },
  { id: 'reminder',      Comp: ReminderTemplate,     group: 'قوالب العملاء', label: 'تذكير قبل الفعالية',   desc: 'قبل 24 ساعة',       icon: <IconBell/>, branded: 'client' },
  { id: 'access-link',   Comp: AccessLinkTemplate,   group: 'قوالب العملاء', label: 'رابط الدخول / البث',   desc: 'عند بدء الفعالية',  icon: <IconLink/>, branded: 'client' },
  { id: 'waitlist',      Comp: WaitlistTemplate,     group: 'قوالب العملاء', label: 'قائمة الانتظار',       desc: 'مقعد متاح الآن',    icon: <IconClock/>, branded: 'client' },
  { id: 'speaker-invite',Comp: SpeakerInviteTemplate,group: 'قوالب العملاء', label: 'دعوة متحدث / VIP',     desc: 'دعوة خاصة',         icon: <IconSparkle/>, branded: 'client' },
  { id: 'after-event',   Comp: AfterEventTemplate,   group: 'قوالب العملاء', label: 'رسالة ما بعد',          desc: 'شكر + مواد',        icon: <IconHeart/>, branded: 'client' },
  { id: 'feedback',      Comp: FeedbackTemplate,     group: 'قوالب العملاء', label: 'استبيان التقييم',      desc: 'تقييم سريع + استبيان', icon: <IconStar/>, branded: 'client' },
  { id: 'certificate',   Comp: CertificateTemplate,  group: 'قوالب العملاء', label: 'شهادة الحضور',         desc: 'شهادة رسمية + تحميل', icon: <IconAward/>, branded: 'client' },
  { id: 'event-update',  Comp: EventUpdateTemplate,  group: 'قوالب العملاء', label: 'تغيير موعد / مكان',    desc: 'تحديث هام',         icon: <IconRefresh/>, branded: 'client' },
  { id: 'client-newsletter', Comp: ClientNewsletterTemplate, group: 'قوالب العملاء', label: 'نشرة شهريّة للمجتمع',  desc: 'من العميل لمشتركيه', icon: <IconMsg/>, branded: 'client' },
  { id: 'landing-page', Comp: LandingPageTemplate, group: 'قوالب العملاء', label: 'صفحة هبوط الفعالية', desc: 'صفحة ويب كاملة · RSVP + تذكرة', icon: <IconDesktop/>, branded: 'client', fullPage: true },
  { id: 'landing-page-dark', Comp: LandingPageDarkTemplate, group: 'قوالب العملاء', label: 'صفحة هبوط · داكنة', desc: 'موبايل · مراسلة المنظّم', icon: <IconMobile/>, branded: 'client', mobileOnly: true },
  { id: 'invite-designer', Comp: InviteDesignerTemplate, group: 'قوالب العملاء', label: 'استوديو بطاقات الدعوة', desc: 'تصميم بطاقة جاهزة للنشر · PNG/PDF', icon: <IconSparkle/>, branded: 'client', designerFullBleed: true },
  { id: 'welcome',       Comp: WelcomeTemplate,      group: 'قوالب المنصة',  label: 'ترحيب بمستخدم جديد',   desc: 'Onboarding',        icon: <IconSparkle/>, branded: 'mhwar' },
  { id: 'event-published',Comp: EventPublishedTemplate,group: 'قوالب المنصة', label: 'نشر فعالية',           desc: 'الفعالية أصبحت حيّة', icon: <IconCheckCircle/>, branded: 'mhwar' },
  { id: 'team-invite',   Comp: TeamInviteTemplate,   group: 'قوالب المنصة',  label: 'دعوة عضو فريق',        desc: 'صلاحيات + قبول',    icon: <IconUser/>, branded: 'mhwar' },
  { id: 'weekly-digest', Comp: WeeklyDigestTemplate, group: 'قوالب المنصة',  label: 'تقرير أسبوعي',         desc: 'ملخّص الأداء',       icon: <IconMsg/>, branded: 'mhwar' },
  { id: 'otp',           Comp: OtpTemplate,          group: 'قوالب المنصة',  label: 'رمز تحقق (OTP)',       desc: 'تسجيل الدخول',      icon: <IconShield/>, branded: 'mhwar' },
  { id: 'password-reset',Comp: PasswordResetTemplate,group: 'قوالب المنصة',  label: 'إعادة تعيين كلمة المرور', desc: 'رابط آمن',       icon: <IconShield/>, branded: 'mhwar' },
  { id: 'payment',       Comp: PaymentTemplate,      group: 'قوالب المنصة',  label: 'تأكيد دفع / إيصال',    desc: 'اشتراك',            icon: <IconCreditCard/>, branded: 'mhwar' },
  { id: 'payment-failed',Comp: PaymentFailedTemplate,group: 'قوالب المنصة',  label: 'فشل الدفع',            desc: 'يحتاج انتباه',      icon: <IconCreditCard/>, branded: 'mhwar' },
  { id: 'upgrade-nudge', Comp: UpgradeNudgeTemplate, group: 'قوالب المنصة',  label: 'اقتراح ترقية',         desc: 'حدود الخطة',        icon: <IconSparkle/>, branded: 'mhwar' },
  { id: 'platform-newsletter', Comp: PlatformNewsletterTemplate, group: 'قوالب المنصة', label: 'نشرة المنظّمين',       desc: 'جديد + أفكار',      icon: <IconMsg/>, branded: 'mhwar' },
  { id: 'templates-hub', Comp: null, group: 'مراجع داخلية', label: 'مكتبة القوالب', desc: '25 قالب — عملاء ومنصّة', icon: <IconMail/>, branded: 'mhwar', hubView: true, hideDevice: true, designerFullBleed: true },
  { id: 'use-cases', Comp: UseCasesView, group: 'مراجع داخلية', label: 'الأطلس', desc: 'الحالات · القطاعات · الأنماط', icon: <IconSparkle/>, branded: 'mhwar', designerFullBleed: true, hideDevice: true, atlasMode: 'atlas' },
  { id: 'features', Comp: UseCasesView, group: 'مراجع داخلية', label: 'المميزات', desc: 'خارطة منتج المنصّة', icon: <IconStar/>, branded: 'mhwar', designerFullBleed: true, hideDevice: true, atlasMode: 'features' },
  { id: 'needs-tool', Comp: UseCasesView, group: 'مراجع داخلية', label: 'إدارة المبيعات', desc: 'العملاء · الصفقات · الاستكشاف', icon: <IconUser/>, branded: 'mhwar', designerFullBleed: true, hideDevice: true, atlasMode: 'clients' },
  { id: 'pricing', Comp: UseCasesView, group: 'مراجع داخلية', label: 'الأسعار والباقات', desc: 'باقات الاشتراك', icon: <IconCreditCard/>, branded: 'mhwar', designerFullBleed: true, hideDevice: true, atlasMode: 'pricing' },
  { id: 'wallet-sim', Comp: MhwarWalletSimulator, group: 'مراجع داخلية', label: 'محاكي الأسعار', desc: 'المحفظة · النقاط · محاكي التكلفة', icon: <IconCreditCard/>, branded: 'mhwar', designerFullBleed: true, hideDevice: true, walletView: true },

  // Legal & reference placeholders (structure registered, content pending)
  { id: 'ref-terms',    Comp: RefSection, group: 'قانوني ومرجعي', label: 'الشروط والأحكام',       desc: 'اتفاقية الاستخدام',            icon: <IconShield/>,      branded: 'mhwar', designerFullBleed: true, hideDevice: true, refId: 'terms' },
  { id: 'ref-privacy',  Comp: RefSection, group: 'قانوني ومرجعي', label: 'سياسة الخصوصية',        desc: 'PDPL · حماية البيانات',        icon: <IconShield/>,      branded: 'mhwar', designerFullBleed: true, hideDevice: true, refId: 'privacy' },
  { id: 'ref-sla',      Comp: RefSection, group: 'قانوني ومرجعي', label: 'مستوى الخدمة (SLA)',     desc: 'وعود الأداء والدعم',          icon: <IconCheckCircle/>, branded: 'mhwar', designerFullBleed: true, hideDevice: true, refId: 'sla' },
  { id: 'ref-roadmap',  Comp: RefSection, group: 'قانوني ومرجعي', label: 'خارطة الطريق',           desc: 'ما نبنيه · متى · ولماذا',      icon: <IconRefresh/>,     branded: 'mhwar', designerFullBleed: true, hideDevice: true, refId: 'roadmap' },
  { id: 'ref-glossary', Comp: RefSection, group: 'قانوني ومرجعي', label: 'قاموس المصطلحات',        desc: 'مفردات المنصّة الموحّدة',     icon: <IconCode/>,        branded: 'mhwar', designerFullBleed: true, hideDevice: true, refId: 'glossary' },
];

const GROUPS = ['مراجع داخلية', 'قانوني ومرجعي'];
// Every template from 'قوالب العملاء' and 'قوالب المنصة' is now browsed via the templates hub (id: 'templates-hub').
// The templates themselves remain in TEMPLATES[] for rendering purposes.
const TEMPLATES_IN_SIDEBAR = id => {
  const t = TEMPLATES.find(x => x.id === id);
  return t && (t.group === 'مراجع داخلية');
};

// Read initial tweaks
function readTweaks() {
  try {
    const el = document.getElementById('tweaks-config');
    const m = el.textContent.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : {};
  } catch { return {}; }
}

function App() {
  const initial = readTweaks();
  const [activeId, setActiveId] = useState(() => {
    return localStorage.getItem('mhwar:active') || 'event-invite';
  });
  const [device, setDevice] = useState(initial.device || 'desktop');
  const [channel, setChannel] = useState(() => localStorage.getItem('mhwar:channel') || 'email');
  const [variant, setVariant] = useState(initial.variant || 'modern');
  const [tweaksOn, setTweaksOn] = useState(false);
  const [sideCollapsed, setSideCollapsed] = useState(() => localStorage.getItem('mhwar:sideCollapsed') === '1');

  useEffect(() => {
    localStorage.setItem('mhwar:sideCollapsed', sideCollapsed ? '1' : '0');
  }, [sideCollapsed]);

  // Persist active template + channel
  useEffect(() => {
    localStorage.setItem('mhwar:active', activeId);
  }, [activeId]);
  useEffect(() => {
    localStorage.setItem('mhwar:channel', channel);
  }, [channel]);

  // Tweaks integration
  useEffect(() => {
    const handler = (ev) => {
      if (ev.data?.type === '__activate_edit_mode') setTweaksOn(true);
      if (ev.data?.type === '__deactivate_edit_mode') setTweaksOn(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // Keyboard nav — only cycle through actual templates (skip hub + references)
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const realTemplates = TEMPLATES.filter(t => t.group === 'قوالب العملاء' || t.group === 'قوالب المنصة');
      const idx = realTemplates.findIndex(t => t.id === activeId);
      if (idx < 0) return; // on hub / atlas — don't cycle
      if (e.key === 'ArrowDown' || e.key === 'j') {
        setActiveId(realTemplates[(idx + 1) % realTemplates.length].id);
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        setActiveId(realTemplates[(idx - 1 + realTemplates.length) % realTemplates.length].id);
      }
      if (e.key === 'd') setDevice(d => d === 'desktop' ? 'mobile' : 'desktop');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId]);

  const active = TEMPLATES.find(t => t.id === activeId) || TEMPLATES[0];
  const activeIdx = TEMPLATES.findIndex(t => t.id === activeId);

  // Remember last non-landing email template so "إيميل" returns to it
  useEffect(() => {
    if (channel === 'email' && active.id !== 'landing-page' && active.id !== 'landing-page-dark') {
      localStorage.setItem('mhwar:lastEmail', active.id);
    }
  }, [active.id, channel]);

  const setTweakKey = (k, v) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  // Map template id → WA template id
  const waId = {
    'event-invite': 'event_invite',
    'rsvp-confirm': 'rsvp_confirm',
    'reminder': 'reminder',
    'access-link': 'access_link',
    'after-event': 'feedback',
    'feedback': 'feedback',
    'certificate': 'certificate',
    'otp': 'otp',
    'payment': 'payment',
  }[active.id];
  const waTpl = waId ? WA_TEMPLATES[waId] : null;

  return (
    <>
    {window.RoadmapFeatureEditor ? <window.RoadmapFeatureEditor/> : null}
    <div style={{ ...appStyles.root, gridTemplateColumns: `${sideCollapsed ? 64 : 320}px 1fr` }}>
      {/* Sidebar */}
      <aside style={appStyles.sidebar} data-screen-label="Nav Sidebar">
        <div style={{ ...appStyles.sideHeader, padding: sideCollapsed ? '18px 10px 14px' : '20px 20px 16px' }}>
          {sideCollapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <MhwarMark size={24}/>
              <button
                onClick={() => setSideCollapsed(false)}
                title="توسيع الشريط الجانبي"
                style={appStyles.sideToggleBtn}
              >
                <IconArrowL size={14}/>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MhwarMark size={24}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>محور · القوالب</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {TEMPLATES.length} قالب بريد
                </div>
              </div>
              <button
                onClick={() => setSideCollapsed(true)}
                title="طيّ الشريط الجانبي"
                style={appStyles.sideToggleBtn}
              >
                <IconArrowR size={14}/>
              </button>
            </div>
          )}
        </div>

        <div style={{ ...appStyles.sideScroll, padding: sideCollapsed ? '10px 8px' : '14px 12px' }}>
          {GROUPS.map(g => (
            <div key={g} style={{ marginBottom: sideCollapsed ? 4 : 8 }}>
              {!sideCollapsed && <div style={appStyles.groupLabel}>{g}</div>}
              {sideCollapsed && <div style={appStyles.groupDivider} />}
              {TEMPLATES.filter(t => t.group === g).map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  title={sideCollapsed ? `${t.label} — ${t.desc}` : undefined}
                  style={sideCollapsed ? {
                    ...appStyles.navItemCollapsed,
                    ...(t.id === activeId ? appStyles.navItemActiveCollapsed : {})
                  } : {
                    ...appStyles.navItem,
                    ...(t.id === activeId ? appStyles.navItemActive : {})
                  }}
                >
                  <div style={{
                    ...appStyles.navIcon,
                    ...(t.id === activeId ? appStyles.navIconActive : {})
                  }}>
                    {t.icon}
                  </div>
                  {!sideCollapsed && (
                    <>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                        <div style={appStyles.navLabel}>{t.label}</div>
                        <div style={appStyles.navDesc}>{t.desc}</div>
                      </div>
                      {t.id === activeId && <IconArrowL size={14} style={{ color: 'var(--muted)' }}/>}
                    </>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {!sideCollapsed && (
          <div style={appStyles.sideFooter}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
              ↑↓ للتنقل · D لتبديل الجهاز
            </div>
          </div>
        )}
      </aside>

      {/* Main preview */}
      <main style={appStyles.main} data-screen-label={active.hubView ? 'Templates Hub' : `Template ${activeIdx+1}: ${active.label}`}>
        {/* Toolbar */}
        <div style={appStyles.toolbar}>
          {active.hubView ? (
            /* Toolbar for hub */
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="mono" style={{
                  fontSize: 11, color: 'var(--muted)',
                  padding: '4px 10px', background: '#fff',
                  border: '1px solid var(--line)', borderRadius: 999
                }}>Library</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>مكتبة القوالب</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>
                    كل القوالب في مكان واحد — عميل ومنصّة
                  </div>
                </div>
              </div>
              <div />
            </>
          ) : (
          <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Back-to-library (only for actual templates) */}
            {(active.group === 'قوالب العملاء' || active.group === 'قوالب المنصة') && (
              <button onClick={() => setActiveId('templates-hub')}
                title="العودة للمكتبة"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 999,
                  background: '#fff', border: '1px solid var(--line)',
                  color: 'var(--ink-2)', fontSize: 12, fontWeight: 500,
                  fontFamily: 'inherit', cursor: 'pointer',
                }}>
                <span style={{ fontSize: 14 }}>←</span>
                <span>المكتبة</span>
              </button>
            )}
            <div className="mono" style={{
              fontSize: 11, color: 'var(--muted)',
              padding: '4px 10px', background: '#fff',
              border: '1px solid var(--line)', borderRadius: 999
            }}>
              {String(activeIdx + 1).padStart(2, '0')} / {String(TEMPLATES.length).padStart(2, '0')}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>
                {active.label}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>
                {(channel === 'whatsapp' && (active.group === 'قوالب العملاء' || active.group === 'قوالب المنصة'))
                  ? (waTpl ? `WhatsApp · ${waTpl.category} · ${waTpl.name}` : 'لا يوجد نسخة WhatsApp لهذا القالب')
                  : (active.branded === 'client'
                      ? 'يُرسله العميل إلى جمهوره · هوية العميل أساسية'
                      : 'ترسله منصة محور · هوية محور أساسية')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Unified channel switcher — shown ONLY for real templates
                (not the hub, atlas, features, needs-tool, pricing, or legal refs). */}
            {(active.group === 'قوالب العملاء' || active.group === 'قوالب المنصة') && (() => {
              const isLanding      = active.id === 'landing-page';
              const isLandingDark  = active.id === 'landing-page-dark';
              const isWeb          = channel === 'email' && isLanding;
              const isMob          = channel === 'email' && isLandingDark;
              const isEmail        = channel === 'email' && !isLanding && !isLandingDark;
              const isWa           = channel === 'whatsapp';

              const go = (mode) => {
                if (mode === 'email') {
                  setChannel('email');
                  if (isLanding || isLandingDark) setActiveId(localStorage.getItem('mhwar:lastEmail') || 'event-invite');
                } else if (mode === 'whatsapp') {
                  setChannel('whatsapp');
                  if (isLanding || isLandingDark) setActiveId(localStorage.getItem('mhwar:lastEmail') || 'event-invite');
                } else if (mode === 'web') {
                  setChannel('email');
                  setDevice('desktop');
                  setActiveId('landing-page');
                } else if (mode === 'mobile') {
                  setChannel('email');
                  setActiveId('landing-page-dark');
                }
              };

              const items = [
                { k: 'email',    l: 'إيميل',  active: isEmail, ic: <IconMail size={14}/> },
                { k: 'whatsapp', l: 'واتساب', active: isWa,    ic: <IconMsg size={14}/> },
                { k: 'web',      l: 'ويب',    active: isWeb,   ic: <IconDesktop size={14}/> },
                { k: 'mobile',   l: 'جوال',   active: isMob,   ic: <IconMobile size={14}/> },
              ];
              return (
                <div style={appStyles.deviceToggle}>
                  {items.map(it => (
                    <button key={it.k} onClick={() => go(it.k)}
                      style={{
                        ...appStyles.deviceBtn,
                        ...(it.active ? appStyles.deviceBtnActive : {}),
                        ...(it.k === 'whatsapp' && it.active ? { background: '#25d366', color: '#fff' } : {}),
                      }}>
                      {it.ic}<span>{it.l}</span>
                    </button>
                  ))}
                </div>
              );
            })()}

            {/* Prev/next — cycle real templates only */}
            {(() => {
              const realTemplates = TEMPLATES.filter(t => t.group === 'قوالب العملاء' || t.group === 'قوالب المنصة');
              const rIdx = realTemplates.findIndex(t => t.id === activeId);
              if (rIdx < 0) return null;
              return (
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setActiveId(realTemplates[(rIdx - 1 + realTemplates.length) % realTemplates.length].id)}
                    style={appStyles.iconBtn}><IconArrowR size={16}/></button>
                  <button onClick={() => setActiveId(realTemplates[(rIdx + 1) % realTemplates.length].id)}
                    style={appStyles.iconBtn}><IconArrowL size={16}/></button>
                </div>
              );
            })()}
          </div>
          </>
          )}
        </div>

        {/* Canvas */}
        <div style={appStyles.canvas}>
          {active.hubView ? (
            <div style={{ margin: '-48px -32px -80px', height: 'calc(100vh - 70px)', overflowY: 'auto', background: 'var(--bg)' }}>
              <TemplatesHub onOpen={(id) => { setActiveId(id); setChannel('email'); }} />
            </div>
          ) : (channel === 'whatsapp' && (active.group === 'قوالب العملاء' || active.group === 'قوالب المنصة')) ? (
            waTpl ? (
              <div style={{ display:'flex', gap:32, alignItems:'flex-start', justifyContent:'center', flexWrap:'wrap' }}>
                <WhatsAppFrame template={waTpl} />
                <WaMetaPanel template={waTpl} />
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--muted)' }}>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--ink-2)', marginBottom:8 }}>لا يوجد نسخة WhatsApp لهذا القالب</div>
                <div style={{ fontSize:13 }}>جرّب: دعوة فعالية, تأكيد الحضور, تذكير, رابط الدخول, الشهادة, التقييم, OTP, الدفع</div>
              </div>
            )
          ) : (
            active.designerFullBleed ? (
              <div style={{ margin: '-48px -32px -80px', height: 'calc(100vh - 70px)', overflowY: (active.refId || active.walletView) ? 'auto' : 'visible' }}>
                <active.Comp data={{ variant, mode: active.atlasMode, refId: active.refId }}/>
              </div>
            ) : active.mobileOnly ? (
              <DeviceFrame device="mobile" bare>
                <div className="lp-mobile-wrap" style={{ maxHeight: '812px', height: '812px', overflowY: 'auto', position: 'relative' }}>
                  <active.Comp data={{ variant, isMobile: true }}/>
                </div>
              </DeviceFrame>
            ) : active.fullPage ? (
              device === 'mobile' ? (
                <DeviceFrame device="mobile">
                  <div className="lp-mobile-wrap" style={{ maxHeight: '760px', overflowY: 'auto' }}>
                    <active.Comp data={{ variant, isMobile: true }}/>
                  </div>
                </DeviceFrame>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ChromeWindow
                    tabs={[{ title: `${active.label} · thraa.sa` }]}
                    url="thraa.sa/events/thraa-2026"
                    width={Math.min(1120, window.innerWidth - 420)}
                    height={Math.min(760, window.innerHeight - 180)}
                  >
                    <active.Comp data={{ variant }}/>
                  </ChromeWindow>
                </div>
              )
            ) : (
              <DeviceFrame device={device}>
                <active.Comp data={{ variant }}/>
              </DeviceFrame>
            )
          )}
        </div>
      </main>

      {/* Tweaks panel */}
      {tweaksOn && (
        <div style={appStyles.tweaksPanel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Tweaks</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>محفوظ تلقائياً</div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={appStyles.tweakLabel}>الجهاز</div>
            <div style={appStyles.segmented}>
              {['desktop', 'mobile'].map(v => (
                <button key={v} onClick={() => { setDevice(v); setTweakKey('device', v); }}
                  style={{
                    ...appStyles.segBtn,
                    ...(device === v ? appStyles.segBtnActive : {})
                  }}>{v === 'desktop' ? 'ويب' : 'جوال'}</button>
              ))}
            </div>

            <div style={{ ...appStyles.tweakLabel, marginTop: 16 }}>الاتجاه البصري</div>
            <div style={appStyles.segmented}>
              {[
                { k: 'modern', l: 'عصري' },
                { k: 'soft', l: 'دافئ' }
              ].map(v => (
                <button key={v.k} onClick={() => { setVariant(v.k); setTweakKey('variant', v.k); }}
                  style={{
                    ...appStyles.segBtn,
                    ...(variant === v.k ? appStyles.segBtnActive : {})
                  }}>{v.l}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

// Device wrapper
function DeviceFrame({ device, children, bare }) {
  if (device === 'mobile') {
    return (
      <div style={{
        width: 390, margin: '0 auto',
        background: '#14130f', borderRadius: 44, padding: 10,
        boxShadow: '0 30px 80px -30px rgba(20,19,15,0.35)'
      }}>
        <div style={{
          background: 'var(--bg)', borderRadius: 36, overflow: 'hidden',
          position: 'relative'
        }}>
          {!bare && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 24px 8px', fontSize: 14, fontWeight: 600
            }}>
              <span className="mono">9:41</span>
              <div style={{
                width: 90, height: 28, background: '#14130f', borderRadius: 999,
                position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)'
              }}/>
              <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 11 }}>●●●●</span>
              </span>
            </div>
          )}
          <div style={bare ? { padding: 0 } : { padding: '8px 12px 16px' }}>
            {children}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  );
}

const appStyles = {
  root: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    height: '100vh',
    background: 'var(--bg)',
    transition: 'grid-template-columns .2s ease'
  },
  sidebar: {
    display: 'flex', flexDirection: 'column',
    background: '#fbfaf7',
    borderInlineStart: '1px solid var(--line)',
    overflow: 'hidden'
  },
  sideToggleBtn: {
    width: 26, height: 26, borderRadius: 7,
    background: '#fff', border: '1px solid var(--line)',
    color: 'var(--ink-2)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontFamily: 'inherit', padding: 0,
    transition: 'background .15s'
  },
  groupDivider: {
    height: 1, background: 'var(--line)',
    margin: '6px 8px 4px'
  },
  navItemCollapsed: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', padding: '8px 4px',
    borderRadius: 10,
    marginBottom: 2,
    background: 'transparent', border: 'none',
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'background 0.15s'
  },
  navItemActiveCollapsed: {
    background: '#fff',
    boxShadow: '0 1px 2px rgba(20,19,15,0.04), 0 0 0 1px var(--line)'
  },
  sideHeader: {
    padding: '20px 20px 16px',
    borderBottom: '1px solid var(--line)'
  },
  sideScroll: {
    flex: 1, overflowY: 'auto',
    padding: '14px 12px',
  },
  sideFooter: {
    padding: '12px 20px',
    borderTop: '1px solid var(--line)',
  },
  groupLabel: {
    fontSize: 10.5, fontWeight: 600,
    color: 'var(--muted)', letterSpacing: 1.5,
    textTransform: 'uppercase',
    padding: '10px 8px 6px'
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    width: '100%', padding: '10px 10px',
    borderRadius: 10,
    color: 'var(--ink-2)',
    marginBottom: 2,
    transition: 'background 0.15s'
  },
  navItemActive: {
    background: '#fff',
    boxShadow: '0 1px 2px rgba(20,19,15,0.04), 0 0 0 1px var(--line)',
    color: 'var(--ink)'
  },
  navIcon: {
    width: 32, height: 32, borderRadius: 8,
    background: '#fff', border: '1px solid var(--line)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--ink-2)', flexShrink: 0
  },
  navIconActive: {
    background: 'var(--accent-soft)',
    borderColor: 'transparent',
    color: 'var(--accent)'
  },
  navLabel: { fontSize: 13.5, fontWeight: 500, lineHeight: 1.3 },
  navDesc: { fontSize: 11.5, color: 'var(--muted)', marginTop: 2 },
  main: {
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden'
  },
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 24px',
    borderBottom: '1px solid var(--line)',
    background: 'rgba(246,245,242,0.9)',
    backdropFilter: 'blur(8px)'
  },
  deviceToggle: {
    display: 'flex', background: '#fff',
    border: '1px solid var(--line)', borderRadius: 999,
    padding: 3
  },
  deviceBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 999,
    fontSize: 12.5, color: 'var(--muted)',
    fontFamily: 'inherit', fontWeight: 500
  },
  deviceBtnActive: {
    background: 'var(--ink)', color: '#fff',
  },
  iconBtn: {
    width: 34, height: 34, borderRadius: 10,
    background: '#fff', border: '1px solid var(--line)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--ink-2)'
  },
  canvas: {
    flex: 1, overflowY: 'auto',
    padding: '48px 32px 80px',
    background: 'radial-gradient(ellipse at top, #fff 0%, var(--bg) 70%)'
  },
  tweaksPanel: {
    position: 'fixed',
    bottom: 20, insetInlineEnd: 20,
    width: 260,
    background: '#fff',
    borderRadius: 14,
    border: '1px solid var(--line)',
    boxShadow: '0 20px 60px -20px rgba(20,19,15,0.25)',
    zIndex: 100
  },
  tweakLabel: {
    fontSize: 11, fontWeight: 600, color: 'var(--muted)',
    letterSpacing: 1, textTransform: 'uppercase',
    marginBottom: 8
  },
  segmented: {
    display: 'flex', background: 'var(--warm)',
    borderRadius: 10, padding: 3, gap: 2
  },
  segBtn: {
    flex: 1, padding: '8px 10px',
    fontSize: 12.5, borderRadius: 8,
    color: 'var(--muted)', fontFamily: 'inherit', fontWeight: 500
  },
  segBtnActive: { background: '#fff', color: 'var(--ink)',
    boxShadow: '0 1px 2px rgba(20,19,15,0.06)' }
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
