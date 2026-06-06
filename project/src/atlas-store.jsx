// Unified storage + CRUD layer for Mhwar use-case atlas + client assessment tool.
// Backed by localStorage with sensible seeding from the static seed data.

const UC_STORAGE_KEY = 'mhwar.atlas.v2';

// ---- utilities ----
function ucUid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function ucDeepClone(x) {
  return JSON.parse(JSON.stringify(x));
}

// ---- default shape ----
function ucBuildDefaults() {
  // Seed categories, patterns, cases from the original static data
  const categories = (window.UC_CATEGORIES || []).map((c, i) => ({
    uid: ucUid('cat'),
    id: c.id,          // stable semantic id (Arabic name, used as FK)
    name: c.id,        // display name — editable (we keep id stable separately)
    short: c.short,
    accent: c.accent,
    bg: c.bg,
    brief: c.brief,
    order: i,
    builtin: true,
  }));

  const patterns = (window.UC_PATTERNS || []).map((p, i) => ({
    uid: ucUid('pat'),
    id: p.id,
    name: p.id,
    shortEn: p.shortEn,
    visible: p.visible,
    icon: p.icon,
    desc: p.desc,
    examples: [...p.examples],
    channels: [...p.channels],
    hue: p.hue,
    order: i,
    builtin: true,
  }));

  const cases = (window.USE_CASES || []).map((u, i) => ({
    uid: ucUid('uc'),
    num: u.id,
    name: u.name,
    desc: u.desc,
    entity: u.entity,
    example: u.example,
    suggestedSectors: u.suggestedSectors || [],
    suggestedRootPattern: u.suggestedRootPattern || '',
    suggestedTraits: u.suggestedTraits || [],
    order: i,
    builtin: true,
  }));

  const traits = (window.UC_PATTERN_TRAITS || []).map((t, i) => ({
    uid: ucUid('tr'), id: t.id, label: t.label, group: t.group,
    desc: t.desc, allowedRoots: t.allowedRoots || [], order: i, builtin: true,
  }));

  return {
    version: 2,
    categories,
    patterns,
    traits,
    cases,
    features: ucBuildFeatures(),
    clients: [],
    leads: ucBuildLeads(),
    discoveryAgents: ucBuildAgents(),
    agentRuns: [],
  };
}

// ---- seed discovery agents ----
function ucBuildAgents() {
  const day = (n) => new Date(Date.now() - n * 86400000).toISOString();
  return [
    {
      uid: ucUid('ag'),
      name: 'الجامعات وعمادات الخريجين',
      description: 'يبحث في لينكدإن عن وكلاء عمادة الخريجين في الجامعات السعودية.',
      sector: 'universities',
      platforms: ['linkedin', 'google'],
      keywords: ['عميد الخريجين', 'عمادة الخريجين', 'alumni director', 'alumni relations'],
      excludedKeywords: [],
      regions: ['SA'],
      schedule: 'weekly',
      active: true,
      lastRunAt: day(2),
      runCount: 4,
      foundCount: 11,
      createdAt: day(30),
    },
    {
      uid: ucUid('ag'),
      name: 'برامج تدريبية مع دفعات نشطة',
      description: 'يرصد إعلانات البرامج التدريبية الجديدة عبر Meta Ads + Google.',
      sector: 'training-programs',
      platforms: ['meta-ads', 'google', 'linkedin'],
      keywords: ['برنامج تدريبي', 'دفعة جديدة', 'منحة تدريبية', 'bootcamp', 'tamheer'],
      excludedKeywords: ['دورة قصيرة', 'ساعة فقط'],
      regions: ['SA', 'AE'],
      schedule: 'daily',
      active: true,
      lastRunAt: day(1),
      runCount: 18,
      foundCount: 27,
      createdAt: day(45),
    },
    {
      uid: ucUid('ag'),
      name: 'مشاريع عقارية كبرى',
      description: 'يرصد إطلاقات المشاريع السكنية الجديدة في السعودية.',
      sector: 'real-estate',
      platforms: ['twitter', 'news-rss', 'linkedin'],
      keywords: ['مشروع سكني', 'مدينة', 'مجتمع سكني', 'compound', 'مرافق'],
      excludedKeywords: [],
      regions: ['SA'],
      schedule: 'weekly',
      active: false,
      lastRunAt: '',
      runCount: 0,
      foundCount: 0,
      createdAt: day(7),
    },
  ];
}

// ---- seed leads ----
// Plausible mock pool so the funnel doesn't look empty on first run.
function ucBuildLeads() {
  const now = new Date().toISOString();
  const day = (n) => new Date(Date.now() - n * 86400000).toISOString();
  const seed = [
    { name: 'برنامج موهبة الوطني', sector: 'training-programs', source: 'event',     status: 'qualified',  score: 85, contactName: 'م. سارة العتيبي', contactRole: 'مديرة تطوير البرامج', email: 'sara@mawhiba.example', phone: '+9665XXXXXXXX', website: 'mawhiba.org', size: '2,400 متدرّب', notes: 'لقاء في مؤتمر التدريب — أبدت اهتمامًا واضحًا بمجتمعات الدفعات + إيميلات المسارات.', tags: ['دفعات','أكاديمي'], createdAt: day(3), updatedAt: day(1) },
    { name: 'جامعة الملك سعود — عمادة الخريجين', sector: 'universities', source: 'inbound', status: 'contacted', score: 70, contactName: 'د. عبدالله الزهراني', contactRole: 'وكيل عمادة الخريجين', email: 'alumni@ksu.edu.sa.example', phone: '', website: 'ksu.edu.sa', size: '40k+ خريج', notes: 'وصلنا عبر نموذج الموقع — يحتاج حلًا لشبكة الخريجين والإعلانات الدورية.', tags: ['خريجين','إيميل دوري'], createdAt: day(7), updatedAt: day(2) },
    { name: 'مطوّر سكني — مشروع الواجهة', sector: 'real-estate', source: 'referral', status: 'new', score: 55, contactName: 'أ. ماجد الحربي', contactRole: 'مدير تجربة السكان', email: '', phone: '+9665XXXXXXXX', website: '', size: '1,800 وحدة', notes: 'إحالة من عميل حالي — يبحث عن منصة لمجتمع السكان وتفعيل الفعاليات.', tags: ['سكان','مغلق'], createdAt: day(2), updatedAt: day(2) },
    { name: 'هيئة حكومية — برنامج المتطوعين', sector: 'gov', source: 'cold-outreach', status: 'new', score: 45, contactName: '', contactRole: '', email: '', phone: '', website: '', size: '12,000 متطوع', notes: 'تم رصدها من إعلان توظيف متطوعين — لم يبدأ التواصل بعد.', tags: ['متطوعين'], createdAt: day(1), updatedAt: day(1) },
    { name: 'أكاديمية تقنية ناشئة', sector: 'edtech', source: 'ads-meta', status: 'disqualified', score: 20, contactName: 'م. ريم', contactRole: 'مؤسّسة', email: 'reem@example.com', phone: '', website: '', size: '~80 طالب', notes: 'حجم صغير جدًا — لا يتناسب مع باقاتنا حاليًا. نُبقيها لمراجعة لاحقة.', tags: ['صغير'], createdAt: day(10), updatedAt: day(5) },
  ];
  return seed.map((l, i) => ({
    uid: ucUid('ld'),
    activities: [],
    promotedTo: '', // client uid after promotion
    ...l,
  }));
}

// ---- Features: platform capabilities library ----
// A new internal reference: the services/capabilities Mhwar delivers,
// grouped by family (channels, events, identity, governance, etc.)
function ucBuildFeatures() {
  return (window.UC_FEATURES_SEED || []).map((f, i) => ({
    uid: ucUid('ft'),
    id: f.id,
    name: f.name,
    family: f.family,
    shortAr: f.shortAr || '',
    desc: f.desc || '',
    icon: f.icon || '◇',
    hue: f.hue ?? 220,
    channels: f.channels || [],
    useWith: f.useWith || [],
    templates: f.templates || [],
    status: f.status || 'live',
    priority: f.priority || 'p2',
    notes: f.notes || '',
    visibility: f.visibility || 'included',
    order: i,
    builtin: true,
  }));
}

// ---- load / save ----
function ucLoadStore() {
  try {
    const raw = localStorage.getItem(UC_STORAGE_KEY);
    if (!raw) {
      const seed = ucBuildDefaults();
      localStorage.setItem(UC_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    // Backfill if new seed fields arrived after creation
    if (!parsed.clients) parsed.clients = [];
    if (!parsed.leads) parsed.leads = ucBuildLeads();
    if (!parsed.discoveryAgents) parsed.discoveryAgents = ucBuildAgents();
    if (!parsed.agentRuns) parsed.agentRuns = [];
    if (!parsed.categories || !parsed.categories.length) parsed.categories = ucBuildDefaults().categories;
    if (!parsed.patterns || !parsed.patterns.length) parsed.patterns = ucBuildDefaults().patterns;
    if (!parsed.traits || !parsed.traits.length) parsed.traits = ucBuildDefaults().traits;
    if (!parsed.cases || !parsed.cases.length) parsed.cases = ucBuildDefaults().cases;
    if (!parsed.features || !parsed.features.length) {
      parsed.features = ucBuildFeatures();
      localStorage.setItem(UC_STORAGE_KEY, JSON.stringify(parsed));
    } else {
      // Migration: backfill status/priority/notes on older stored features,
      // and add any newly-seeded features not yet present by stable id.
      let migrated = false;
      const seedById = new Map((window.UC_FEATURES_SEED || []).map(s => [s.id, s]));
      parsed.features = parsed.features.map(f => {
        const seed = seedById.get(f.id);
        const next = { ...f };
        if (next.status == null) { next.status = seed?.status || 'live'; migrated = true; }
        if (next.priority == null) { next.priority = seed?.priority || 'p2'; migrated = true; }
        if (next.notes == null) { next.notes = seed?.notes || ''; migrated = true; }
        return next;
      });
      const existingIds = new Set(parsed.features.map(f => f.id));
      (window.UC_FEATURES_SEED || []).forEach((s, i) => {
        if (!existingIds.has(s.id)) {
          parsed.features.push({
            uid: ucUid('ft'), id: s.id, name: s.name, family: s.family,
            shortAr: s.shortAr || '', desc: s.desc || '', icon: s.icon || '◇',
            hue: s.hue ?? 220, channels: s.channels || [], useWith: s.useWith || [],
            templates: s.templates || [], status: s.status || 'live',
            priority: s.priority || 'p2', notes: s.notes || '',
            visibility: 'included', order: parsed.features.length, builtin: true,
          });
          migrated = true;
        }
      });
      if (migrated) localStorage.setItem(UC_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('atlas store load failed', e);
    return ucBuildDefaults();
  }
}

function ucSaveStore(store) {
  try {
    localStorage.setItem(UC_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('atlas store save failed', e);
  }
}

function ucResetStore() {
  localStorage.removeItem(UC_STORAGE_KEY);
  return ucLoadStore();
}

// ---- store hook: single source of truth ----
function useAtlasStore() {
  const [store, setStore] = React.useState(() => ucLoadStore());

  const persist = React.useCallback((next) => {
    ucSaveStore(next);
    setStore(next);
  }, []);

  // CATEGORIES
  const upsertCategory = (cat) => {
    const next = ucDeepClone(store);
    const idx = next.categories.findIndex(c => c.uid === cat.uid);
    if (idx >= 0) {
      const prevId = next.categories[idx].id;
      next.categories[idx] = { ...next.categories[idx], ...cat };
      // If id changed, propagate to cases
      if (cat.id && cat.id !== prevId) {
        next.cases.forEach(c => { if (c.cat === prevId) c.cat = cat.id; });
      }
    } else {
      next.categories.push({
        uid: ucUid('cat'),
        id: cat.id || cat.name,
        name: cat.name,
        short: cat.short || '',
        accent: cat.accent || 'oklch(0.5 0.12 240)',
        bg: cat.bg || 'oklch(0.96 0.02 240)',
        brief: cat.brief || '',
        order: next.categories.length,
        builtin: false,
        ...cat,
      });
    }
    persist(next);
  };

  const deleteCategory = (uid) => {
    const next = ucDeepClone(store);
    const cat = next.categories.find(c => c.uid === uid);
    if (!cat) return;
    next.categories = next.categories.filter(c => c.uid !== uid);
    // Cases that reference this category → null FK (will appear in "uncategorized")
    next.cases.forEach(c => { if (c.cat === cat.id) c.cat = '__orphan__'; });
    persist(next);
  };

  // PATTERNS
  const upsertPattern = (pat) => {
    const next = ucDeepClone(store);
    const idx = next.patterns.findIndex(p => p.uid === pat.uid);
    if (idx >= 0) {
      const prevId = next.patterns[idx].id;
      next.patterns[idx] = { ...next.patterns[idx], ...pat };
      if (pat.id && pat.id !== prevId) {
        next.cases.forEach(c => { if (c.pattern === prevId) c.pattern = pat.id; });
      }
    } else {
      next.patterns.push({
        uid: ucUid('pat'),
        id: pat.id || pat.name,
        name: pat.name,
        shortEn: pat.shortEn || '',
        visible: pat.visible || 'yes',
        icon: pat.icon || '○',
        desc: pat.desc || '',
        examples: pat.examples || [],
        channels: pat.channels || [],
        hue: pat.hue ?? 220,
        order: next.patterns.length,
        builtin: false,
        ...pat,
      });
    }
    persist(next);
  };

  const deletePattern = (uid) => {
    const next = ucDeepClone(store);
    const pat = next.patterns.find(p => p.uid === uid);
    if (!pat) return;
    next.patterns = next.patterns.filter(p => p.uid !== uid);
    next.cases.forEach(c => { if (c.pattern === pat.id) c.pattern = '__orphan__'; });
    persist(next);
  };

  // CASES
  const upsertCase = (uc) => {
    const next = ucDeepClone(store);
    const idx = next.cases.findIndex(c => c.uid === uc.uid);
    if (idx >= 0) {
      next.cases[idx] = { ...next.cases[idx], ...uc };
    } else {
      const maxNum = next.cases.reduce((m, c) => Math.max(m, c.num || 0), 0);
      next.cases.push({
        uid: ucUid('uc'),
        num: maxNum + 1,
        name: uc.name,
        desc: uc.desc || '',
        entity: uc.entity || '',
        example: uc.example || '',
        suggestedSectors: uc.suggestedSectors || [],
        suggestedRootPattern: uc.suggestedRootPattern || '',
        suggestedTraits: uc.suggestedTraits || [],
        order: next.cases.length,
        builtin: false,
        ...uc,
      });
    }
    persist(next);
  };

  const deleteCase = (uid) => {
    const next = ucDeepClone(store);
    next.cases = next.cases.filter(c => c.uid !== uid);
    // Also remove from any client community that referenced it
    next.clients.forEach(cl => {
      (cl.communities || []).forEach(com => {
        com.caseIds = (com.caseIds || []).filter(id => id !== uid);
      });
    });
    persist(next);
  };

  // CLIENTS
  const upsertClient = (client) => {
    const next = ucDeepClone(store);
    const now = new Date().toISOString();
    const idx = next.clients.findIndex(c => c.uid === client.uid);
    if (idx >= 0) {
      next.clients[idx] = { ...next.clients[idx], ...client, updatedAt: now };
    } else {
      next.clients.unshift({
        uid: ucUid('cl'),
        name: client.name || 'عميل جديد',
        sector: client.sector || '',
        contactName: client.contactName || '',
        contactRole: client.contactRole || '',
        email: client.email || '',
        phone: client.phone || '',
        priority: client.priority || 'warm',
        stage: client.stage || 'outreach',
        size: client.size || '',
        lastContact: client.lastContact || '',
        notes: client.notes || '',
        communities: client.communities || [],
        // CRM extensions
        contacts: client.contacts || [],         // [{uid,name,role,roleType,email,phone,notes,primary}]
        activities: client.activities || [],     // [{uid,type,title,body,date,outcome,linkedTemplate,linkedProposal}]
        tasks: client.tasks || [],               // [{uid,title,due,done,doneAt,activityType}]
        deal: client.deal || {                   // single active deal per client
          tier: '',                              // starter | growth | partnership
          mrr: '',                               // optional monthly value
          acv: '',                               // optional annual contract value
          probability: 30,                       // 0-100
          expectedClose: '',                     // ISO date
          scope: { features: [], cases: [] },    // linked feature uids + case uids
          linkedProposals: [],                   // [{label,url,sentAt}]
          lostReason: '',
        },
        createdAt: now,
        updatedAt: now,
        ...client,
      });
    }
    persist(next);
  };

  const deleteClient = (uid) => {
    const next = ucDeepClone(store);
    next.clients = next.clients.filter(c => c.uid !== uid);
    persist(next);
  };

  // Sub-entity helpers (contacts / activities / tasks / deal patch)
  const _patchClient = (clientUid, patchFn) => {
    const next = ucDeepClone(store);
    const idx = next.clients.findIndex(c => c.uid === clientUid);
    if (idx < 0) return;
    next.clients[idx] = patchFn(next.clients[idx]);
    next.clients[idx].updatedAt = new Date().toISOString();
    persist(next);
  };

  const upsertContact = (clientUid, contact) => _patchClient(clientUid, c => {
    const list = c.contacts || [];
    const i = list.findIndex(x => x.uid === contact.uid);
    if (i >= 0) list[i] = { ...list[i], ...contact };
    else list.push({ uid: ucUid('ct'), name: '', role: '', roleType: 'other', email: '', phone: '', notes: '', primary: list.length === 0, ...contact });
    return { ...c, contacts: list };
  });
  const deleteContact = (clientUid, contactUid) => _patchClient(clientUid, c => ({
    ...c, contacts: (c.contacts || []).filter(x => x.uid !== contactUid),
  }));

  const addActivity = (clientUid, activity) => _patchClient(clientUid, c => ({
    ...c,
    lastContact: (activity.date || new Date().toISOString().slice(0, 10)),
    activities: [
      { uid: ucUid('ac'), type: 'note', title: '', body: '', date: new Date().toISOString().slice(0, 10),
        outcome: '', linkedTemplate: '', linkedProposal: '', ...activity },
      ...(c.activities || []),
    ],
  }));
  const updateActivity = (clientUid, activityUid, patch) => _patchClient(clientUid, c => ({
    ...c, activities: (c.activities || []).map(a => a.uid === activityUid ? { ...a, ...patch } : a),
  }));
  const deleteActivity = (clientUid, activityUid) => _patchClient(clientUid, c => ({
    ...c, activities: (c.activities || []).filter(a => a.uid !== activityUid),
  }));

  const upsertTask = (clientUid, task) => _patchClient(clientUid, c => {
    const list = c.tasks || [];
    const i = list.findIndex(x => x.uid === task.uid);
    if (i >= 0) list[i] = { ...list[i], ...task };
    else list.unshift({ uid: ucUid('tk'), title: '', due: '', done: false, doneAt: '', activityType: 'call', ...task });
    return { ...c, tasks: list };
  });
  const toggleTask = (clientUid, taskUid) => _patchClient(clientUid, c => ({
    ...c,
    tasks: (c.tasks || []).map(t => t.uid === taskUid
      ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : '' }
      : t),
  }));
  const deleteTask = (clientUid, taskUid) => _patchClient(clientUid, c => ({
    ...c, tasks: (c.tasks || []).filter(t => t.uid !== taskUid),
  }));

  const updateDeal = (clientUid, dealPatch) => _patchClient(clientUid, c => ({
    ...c, deal: { ...(c.deal || {}), ...dealPatch },
  }));

  const setStage = (clientUid, stage) => _patchClient(clientUid, c => ({ ...c, stage }));

  const resetAll = () => {
    const fresh = ucResetStore();
    setStore(fresh);
  };

  // FEATURES
  const upsertFeature = (ft) => {
    const next = ucDeepClone(store);
    if (!next.features) next.features = [];
    const idx = next.features.findIndex(f => f.uid === ft.uid);
    if (idx >= 0) {
      next.features[idx] = { ...next.features[idx], ...ft };
    } else {
      next.features.push({
        uid: ucUid('ft'),
        id: ft.id || ft.name,
        name: ft.name,
        family: ft.family || 'channels',
        shortAr: ft.shortAr || '',
        desc: ft.desc || '',
        icon: ft.icon || '◇',
        hue: ft.hue ?? 220,
        channels: ft.channels || [],
        useWith: ft.useWith || [],
        templates: ft.templates || [],
        status: ft.status || 'idea',
        priority: ft.priority || 'p2',
        notes: ft.notes || '',
        visibility: ft.visibility || 'included',
        order: next.features.length,
        builtin: false,
        ...ft,
      });
    }
    persist(next);
  };

  const deleteFeature = (uid) => {
    const next = ucDeepClone(store);
    next.features = (next.features || []).filter(f => f.uid !== uid);
    persist(next);
  };

  // LEADS — top of funnel (before promoting to client)
  const upsertLead = (lead) => {
    const next = ucDeepClone(store);
    const now = new Date().toISOString();
    if (!next.leads) next.leads = [];
    const idx = next.leads.findIndex(l => l.uid === lead.uid);
    if (idx >= 0) {
      next.leads[idx] = { ...next.leads[idx], ...lead, updatedAt: now };
    } else {
      next.leads.unshift({
        uid: ucUid('ld'),
        name: lead.name || 'عميل محتمل',
        sector: lead.sector || '',
        source: lead.source || 'manual',
        status: lead.status || 'new',
        score: lead.score ?? 50,
        contactName: lead.contactName || '',
        contactRole: lead.contactRole || '',
        email: lead.email || '',
        phone: lead.phone || '',
        website: lead.website || '',
        size: lead.size || '',
        notes: lead.notes || '',
        tags: lead.tags || [],
        activities: lead.activities || [],
        promotedTo: '',
        createdAt: now,
        updatedAt: now,
        ...lead,
      });
    }
    persist(next);
  };

  const deleteLead = (uid) => {
    const next = ucDeepClone(store);
    next.leads = (next.leads || []).filter(l => l.uid !== uid);
    persist(next);
  };

  const bulkAddLeads = (leads) => {
    const next = ucDeepClone(store);
    const now = new Date().toISOString();
    if (!next.leads) next.leads = [];
    leads.forEach(l => {
      next.leads.unshift({
        uid: ucUid('ld'),
        name: l.name || 'عميل محتمل',
        sector: l.sector || '',
        source: l.source || 'bulk-import',
        status: l.status || 'new',
        score: l.score ?? 50,
        contactName: l.contactName || '',
        contactRole: l.contactRole || '',
        email: l.email || '',
        phone: l.phone || '',
        website: l.website || '',
        size: l.size || '',
        notes: l.notes || '',
        tags: l.tags || [],
        activities: [],
        promotedTo: '',
        createdAt: now,
        updatedAt: now,
      });
    });
    persist(next);
  };

  const addLeadActivity = (leadUid, activity) => {
    const next = ucDeepClone(store);
    const now = new Date().toISOString();
    const idx = (next.leads || []).findIndex(l => l.uid === leadUid);
    if (idx < 0) return;
    if (!next.leads[idx].activities) next.leads[idx].activities = [];
    next.leads[idx].activities.unshift({
      uid: ucUid('la'),
      type: activity.type || 'note',
      title: activity.title || '',
      body: activity.body || '',
      date: activity.date || now,
    });
    next.leads[idx].updatedAt = now;
    persist(next);
  };

  // DISCOVERY AGENTS — automation engine for lead discovery
  const upsertAgent = (agent) => {
    const next = ucDeepClone(store);
    const now = new Date().toISOString();
    if (!next.discoveryAgents) next.discoveryAgents = [];
    const idx = next.discoveryAgents.findIndex(a => a.uid === agent.uid);
    if (idx >= 0) {
      next.discoveryAgents[idx] = { ...next.discoveryAgents[idx], ...agent, updatedAt: now };
    } else {
      next.discoveryAgents.unshift({
        uid: ucUid('ag'),
        name: agent.name || 'بوت استكشاف جديد',
        description: agent.description || '',
        sector: agent.sector || '',
        platforms: agent.platforms || [],
        keywords: agent.keywords || [],
        excludedKeywords: agent.excludedKeywords || [],
        regions: agent.regions || ['SA'],
        schedule: agent.schedule || 'manual',
        active: agent.active ?? true,
        lastRunAt: '',
        runCount: 0,
        foundCount: 0,
        createdAt: now,
        ...agent,
      });
    }
    persist(next);
  };

  const deleteAgent = (uid) => {
    const next = ucDeepClone(store);
    next.discoveryAgents = (next.discoveryAgents || []).filter(a => a.uid !== uid);
    persist(next);
  };

  const toggleAgentActive = (uid) => {
    const next = ucDeepClone(store);
    const idx = (next.discoveryAgents || []).findIndex(a => a.uid === uid);
    if (idx < 0) return;
    next.discoveryAgents[idx].active = !next.discoveryAgents[idx].active;
    persist(next);
  };

  // Apply the result of an agent run: append created leads + log the run.
  // The simulation itself happens in the UI layer (sales-leads-engine.jsx),
  // which calls this with the discovered leads.
  const applyAgentRun = (agentUid, run) => {
    const next = ucDeepClone(store);
    const now = new Date().toISOString();
    const ai = (next.discoveryAgents || []).findIndex(a => a.uid === agentUid);
    if (ai < 0) return;

    // Add discovered leads
    if (!next.leads) next.leads = [];
    const createdLeadUids = [];
    (run.leads || []).forEach(l => {
      const uid = ucUid('ld');
      createdLeadUids.push(uid);
      next.leads.unshift({
        uid,
        name: l.name || 'عميل محتمل آلي',
        sector: l.sector || next.discoveryAgents[ai].sector,
        source: l.source || 'auto-discovered',
        status: 'new',
        score: l.score ?? 50,
        contactName: l.contactName || '',
        contactRole: l.contactRole || '',
        email: l.email || '',
        phone: l.phone || '',
        website: l.website || '',
        size: l.size || '',
        notes: l.notes || `[اكتُشف عبر بوت: ${next.discoveryAgents[ai].name}]\nالكلمة المفتاحية: ${l.matchedKeyword || '—'}\nالمنصّة: ${l.platform || '—'}`,
        tags: ['آلي', ...(l.tags || [])],
        activities: [],
        promotedTo: '',
        discoveredBy: agentUid,
        platformFound: l.platform || '',
        createdAt: now,
        updatedAt: now,
      });
    });

    // Update agent stats
    next.discoveryAgents[ai].lastRunAt = now;
    next.discoveryAgents[ai].runCount = (next.discoveryAgents[ai].runCount || 0) + 1;
    next.discoveryAgents[ai].foundCount = (next.discoveryAgents[ai].foundCount || 0) + (run.leads || []).length;

    // Log run
    if (!next.agentRuns) next.agentRuns = [];
    next.agentRuns.unshift({
      uid: ucUid('rn'),
      agentUid,
      agentName: next.discoveryAgents[ai].name,
      ranAt: now,
      duration: run.duration || 0,
      leadsFound: (run.leads || []).length,
      leadUids: createdLeadUids,
      platforms: run.platforms || next.discoveryAgents[ai].platforms,
      keywords: run.keywords || next.discoveryAgents[ai].keywords,
    });
    // Cap history to last 50 runs
    if (next.agentRuns.length > 50) next.agentRuns = next.agentRuns.slice(0, 50);

    persist(next);
  };
  const promoteLeadToClient = (leadUid, overrides = {}) => {
    const next = ucDeepClone(store);
    const now = new Date().toISOString();
    const li = (next.leads || []).findIndex(l => l.uid === leadUid);
    if (li < 0) return null;
    const lead = next.leads[li];

    const clientUid = ucUid('cl');
    const newClient = {
      uid: clientUid,
      name: lead.name,
      sector: lead.sector || '',
      contactName: lead.contactName || '',
      contactRole: lead.contactRole || '',
      email: lead.email || '',
      phone: lead.phone || '',
      priority: lead.score >= 70 ? 'hot' : lead.score >= 40 ? 'warm' : 'cold',
      stage: overrides.stage || 'outreach',
      size: lead.size || '',
      lastContact: now,
      notes: lead.notes ? `[من العملاء المحتملين] ${lead.notes}` : '',
      communities: [],
      contacts: lead.contactName ? [{
        uid: ucUid('ct'),
        name: lead.contactName,
        role: lead.contactRole || '',
        roleType: 'champion',
        email: lead.email || '',
        phone: lead.phone || '',
        notes: '',
        primary: true,
      }] : [],
      activities: (lead.activities || []).map(a => ({
        uid: ucUid('ac'),
        type: a.type || 'note',
        title: a.title || '',
        body: a.body || '',
        date: a.date || now,
        outcome: '',
      })).concat([{
        uid: ucUid('ac'),
        type: 'note',
        title: 'تحويل من العملاء المحتملين',
        body: `المصدر: ${lead.source || 'يدوي'} · النقاط: ${lead.score}`,
        date: now,
      }]),
      tasks: [],
      deal: {
        tier: '',
        mrr: '',
        acv: '',
        probability: lead.score >= 70 ? 40 : lead.score >= 40 ? 25 : 15,
        expectedClose: '',
        scope: { features: [], cases: [] },
        linkedProposals: [],
        lostReason: '',
      },
      createdAt: now,
      updatedAt: now,
    };
    next.clients.unshift(newClient);

    // Mark lead as converted (don't delete — keeps source history clean)
    next.leads[li] = {
      ...lead,
      status: 'converted',
      promotedTo: clientUid,
      updatedAt: now,
    };

    persist(next);
    return clientUid;
  };

  return {
    store,
    categories: store.categories,
    patterns: store.patterns,
    traits: store.traits || [],
    cases: store.cases,
    clients: store.clients,
    features: store.features || [],
    leads: store.leads || [],
    upsertCategory, deleteCategory,
    upsertPattern, deletePattern,
    upsertCase, deleteCase,
    upsertClient, deleteClient,
    upsertContact, deleteContact,
    addActivity, updateActivity, deleteActivity,
    upsertTask, toggleTask, deleteTask,
    updateDeal, setStage,
    upsertFeature, deleteFeature,
    upsertLead, deleteLead, bulkAddLeads, addLeadActivity, promoteLeadToClient,
    discoveryAgents: store.discoveryAgents || [],
    agentRuns: store.agentRuns || [],
    upsertAgent, deleteAgent, toggleAgentActive, applyAgentRun,
    resetAll,
  };
}

// ---- suggestion engine ----
// Given a client sector (category id), suggest the top cases that include that sector in suggestedSectors.
function ucSuggestCases(store, sector) {
  if (!sector) return [];
  return store.cases
    .filter(c => (c.suggestedSectors || []).includes(sector) || c.cat === sector)
    .slice(0, 10);
}

// Priority / stage enums
const UC_PRIORITIES = [
  { id: 'hot',  label: 'ساخن',   hue: 25  },
  { id: 'warm', label: 'دافئ',   hue: 55  },
  { id: 'cold', label: 'بارد',   hue: 220 },
];

// Mhwar-specific sales pipeline stages
const UC_STAGES = [
  { id: 'outreach',    label: 'تواصل أولي',  short: 'أولي',    hue: 260, kind: 'open',  desc: 'بدأ التواصل ولم يُحجز اجتماع بعد' },
  { id: 'discovery',   label: 'ورشة تشخيص', short: 'تشخيص',   hue: 230, kind: 'open',  desc: 'حُجز/أُجري لقاء فهم احتياج العميل' },
  { id: 'proposal',    label: 'مقترح',      short: 'مقترح',   hue: 200, kind: 'open',  desc: 'أُرسل العرض/المقترح ينتظر الرد' },
  { id: 'poc',         label: 'POC · تجربة', short: 'تجربة',   hue: 170, kind: 'open',  desc: 'تجربة تقنية أو مرحلة إثبات قيمة' },
  { id: 'contract',    label: 'تعاقد',      short: 'تعاقد',   hue: 45,  kind: 'open',  desc: 'تفاوض الشروط وتوقيع العقد' },
  { id: 'launch',      label: 'إطلاق',      short: 'إطلاق',   hue: 120, kind: 'won',   desc: 'تم التوقيع — مرحلة التهيئة والإطلاق' },
  { id: 'live',        label: 'تشغيل',      short: 'تشغيل',   hue: 145, kind: 'won',   desc: 'العميل في الإنتاج — يستخدم المنصّة' },
  { id: 'closed-lost', label: 'مغلق · خسارة', short: 'خسارة', hue: 20,  kind: 'lost',  desc: 'لم تنجح الصفقة' },
];

// Map legacy stage ids → new stage ids (for client records created before the rename)
const UC_STAGE_LEGACY_MAP = {
  'evaluation':  'discovery',
  'negotiation': 'contract',
  'closed-won':  'live',
};

function ucMigrateStage(s) {
  if (!s) return 'outreach';
  return UC_STAGE_LEGACY_MAP[s] || s;
}

// Contact roles within a client account
const UC_CONTACT_ROLES = [
  { id: 'decision', label: 'صاحب القرار',   short: 'قرار',     hue: 145, desc: 'يملك صلاحية التوقيع والميزانية' },
  { id: 'champion', label: 'حليف داخلي',     short: 'حليف',     hue: 200, desc: 'يدفع الصفقة من داخل العميل' },
  { id: 'influencer', label: 'مؤثّر',         short: 'مؤثّر',    hue: 260, desc: 'يؤثّر في القرار لكن لا يوقّع' },
  { id: 'user',     label: 'مستخدم تقني',    short: 'مستخدم',   hue: 60,  desc: 'سيستخدم المنصّة بشكل مباشر' },
  { id: 'blocker',  label: 'معارض',          short: 'معارض',    hue: 25,  desc: 'يقاوم الصفقة' },
  { id: 'other',    label: 'أخرى',           short: 'أخرى',     hue: 220, desc: '' },
];

// Activity types — what the sales team logs against a deal/client
const UC_ACTIVITY_TYPES = [
  { id: 'call',       label: 'مكالمة',           icon: '☎', hue: 200 },
  { id: 'meeting',    label: 'اجتماع',           icon: '◉', hue: 260 },
  { id: 'email',      label: 'إيميل مُرسل',       icon: '✉', hue: 220 },
  { id: 'whatsapp',   label: 'رسالة واتساب',     icon: '◆', hue: 145 },
  { id: 'note',       label: 'ملاحظة داخلية',    icon: '✎', hue: 60  },
  { id: 'proposal',   label: 'مقترح مُرسل',       icon: '◈', hue: 45  },
  { id: 'file',       label: 'ملف/مرفق',         icon: '⎙', hue: 280 },
];

// Subscription tiers (informational — names mirror the pricing module)
const UC_TIERS = [
  { id: 'starter',     label: 'البداية',  short: 'Starter',     hue: 220 },
  { id: 'growth',      label: 'النمو',    short: 'Growth',      hue: 145 },
  { id: 'partnership', label: 'الشراكة',  short: 'Partnership', hue: 280 },
];

// Lead status — top-of-funnel stages BEFORE promoting to a client/deal
const UC_LEAD_STATUSES = [
  { id: 'new',           label: 'جديد',         short: 'جديد',     hue: 220, kind: 'open',     desc: 'لم يبدأ التواصل بعد' },
  { id: 'contacted',     label: 'تم التواصل',   short: 'تواصل',    hue: 200, kind: 'open',     desc: 'أُرسلت رسالة أولى أو تمت مكالمة قصيرة' },
  { id: 'qualified',     label: 'مؤهّل',         short: 'مؤهّل',    hue: 145, kind: 'positive', desc: 'استوفى معايير العميل المثالي ومستعد لتشخيص' },
  { id: 'nurture',       label: 'متابعة لاحقة',  short: 'متابعة',   hue: 55,  kind: 'open',     desc: 'مهتمّ لكن غير جاهز الآن — نُبقي عليه دافئًا' },
  { id: 'disqualified',  label: 'غير مناسب',     short: 'مستبعد',   hue: 20,  kind: 'closed',   desc: 'لا يستوفي المعايير — مؤرشف' },
  { id: 'converted',     label: 'تم تحويله',     short: 'تحوّل',    hue: 280, kind: 'positive', desc: 'تمّ ترقيته إلى عميل ضمن خط الصفقات' },
];

// Lead sources — how/where a lead entered our funnel.
// Three families: outbound (we pursued them), inbound (they came to us), partner (third-party).
const UC_LEAD_SOURCES = [
  // outbound
  { id: 'manual',         label: 'إدخال يدوي',         family: 'outbound', icon: '✎',  hue: 220, desc: 'أضافه أحد الفريق يدويًا من ملاحظة أو لقاء غير رسمي' },
  { id: 'cold-outreach',  label: 'تواصل مباشر',        family: 'outbound', icon: '↗',  hue: 200, desc: 'وصلنا إليه عبر بريد/مكالمة باردة بناءً على بحث' },
  { id: 'linkedin',       label: 'لينكدإن',            family: 'outbound', icon: 'in', hue: 215, desc: 'تم رصده عبر بحث/تواصل في لينكدإن' },
  { id: 'event',          label: 'فعالية / مؤتمر',     family: 'outbound', icon: '◉',  hue: 260, desc: 'تعرفنا عليه في حدث أو مؤتمر مهني' },
  // inbound
  { id: 'inbound',        label: 'نموذج الموقع',       family: 'inbound',  icon: '⤓',  hue: 145, desc: 'عبأ نموذج التواصل في موقعنا أو صفحة الهبوط' },
  { id: 'content',        label: 'محتوى / مدوّنة',     family: 'inbound',  icon: '✦',  hue: 170, desc: 'وصلنا عبر مقال أو دليل أو ندوة عبر الإنترنت' },
  { id: 'ads-meta',       label: 'إعلان ميتا',         family: 'inbound',  icon: 'M',  hue: 220, desc: 'حملة على فيسبوك/إنستجرام' },
  { id: 'ads-x',          label: 'إعلان منصة X',       family: 'inbound',  icon: 'X',  hue: 0,   desc: 'حملة على منصة X (تويتر سابقًا)' },
  { id: 'ads-google',     label: 'إعلان جوجل',         family: 'inbound',  icon: 'G',  hue: 35,  desc: 'حملة بحث/عرض على جوجل' },
  { id: 'ads-tiktok',     label: 'إعلان تيك توك',      family: 'inbound',  icon: 'T',  hue: 320, desc: 'حملة على تيك توك' },
  // partner
  { id: 'referral',       label: 'إحالة من عميل',      family: 'partner',  icon: '⇆',  hue: 280, desc: 'أحاله أحد عملائنا الحاليين' },
  { id: 'partner',        label: 'شريك',               family: 'partner',  icon: '◈',  hue: 240, desc: 'وصلنا عبر شريك أو موزّع' },
  { id: 'bulk-import',    label: 'استيراد جماعي',      family: 'partner',  icon: '⇪',  hue: 60,  desc: 'استُورد ضمن قائمة (CSV/لصق)' },
  // automated
  { id: 'auto-discovered', label: 'بوت استكشاف آلي',   family: 'automated', icon: '◎', hue: 190, desc: 'اكتُشف تلقائيًا عبر بوت بحث مجدول' },
];

// Discovery platforms — what the automation engine can search.
// Users can add custom ones via the agent editor.
const UC_DISCOVERY_PLATFORMS = [
  { id: 'linkedin',   label: 'لينكدإن',           icon: 'in', hue: 215, desc: 'بحث في الملفات والمنشورات والشركات', kind: 'social' },
  { id: 'twitter',    label: 'منصة X (تويتر)',    icon: 'X',  hue: 0,   desc: 'بحث في حسابات الشركات والمنشورات', kind: 'social' },
  { id: 'meta-ads',   label: 'مكتبة إعلانات Meta', icon: 'M', hue: 220, desc: 'يكتشف الشركات النشطة في الإعلانات', kind: 'ads' },
  { id: 'google-ads', label: 'إعلانات جوجل',      icon: 'G',  hue: 35,  desc: 'يرصد الكلمات المفتاحية المُموَّلة', kind: 'ads' },
  { id: 'tiktok',     label: 'تيك توك',           icon: 'T',  hue: 320, desc: 'حسابات الشركات النشطة', kind: 'social' },
  { id: 'google',     label: 'بحث جوجل',          icon: '▣',  hue: 145, desc: 'يبحث في صفحات الويب العامة', kind: 'web' },
  { id: 'news-rss',   label: 'الأخبار · RSS',     icon: '◐',  hue: 25,  desc: 'يرصد الأخبار والإعلانات الرسمية', kind: 'web' },
  { id: 'product-hunt', label: 'Product Hunt',    icon: '◭',  hue: 15,  desc: 'إطلاقات منتجات تقنية ناشئة', kind: 'web' },
  { id: 'wamda',      label: 'وامِض',             icon: 'و', hue: 280, desc: 'أخبار ريادة الأعمال في المنطقة', kind: 'web' },
  { id: 'bayt',       label: 'بيت / لينكدإن جوبس', icon: '◇', hue: 200, desc: 'إعلانات توظيف تكشف نمو الفرق', kind: 'jobs' },
  { id: 'custom',     label: 'مصدر مخصص',          icon: '+',  hue: 240, desc: 'منصة/موقع/RSS تضيفه يدويًا', kind: 'custom' },
];

// Schedule frequencies for agents
const UC_AGENT_SCHEDULES = [
  { id: 'manual',   label: 'يدوي فقط',  desc: 'يعمل عند الضغط على «شغّل الآن»', icon: '✦' },
  { id: 'hourly',   label: 'كل ساعة',   desc: 'مناسب لإشارات سريعة (إعلانات + أخبار)', icon: '◔' },
  { id: 'daily',    label: 'يومي',      desc: 'يعمل صباحًا قبل بدء يوم الفريق', icon: '◐' },
  { id: 'weekly',   label: 'أسبوعي',    desc: 'كل يوم أحد — مناسب لأغلب القطاعات', icon: '◑' },
  { id: 'biweekly', label: 'كل أسبوعين', desc: 'لقطاعات ذات حركة بطيئة', icon: '◒' },
  { id: 'monthly',  label: 'شهري',      desc: 'مراجعة شاملة لقطاع كبير', icon: '◓' },
];

// Region targets — Saudi-first
const UC_REGIONS = [
  { id: 'SA', label: 'السعودية',  flag: '🇸🇦' },
  { id: 'AE', label: 'الإمارات',   flag: '🇦🇪' },
  { id: 'KW', label: 'الكويت',    flag: '🇰🇼' },
  { id: 'BH', label: 'البحرين',   flag: '🇧🇭' },
  { id: 'OM', label: 'عُمان',      flag: '🇴🇲' },
  { id: 'QA', label: 'قطر',       flag: '🇶🇦' },
  { id: 'EG', label: 'مصر',       flag: '🇪🇬' },
  { id: 'JO', label: 'الأردن',    flag: '🇯🇴' },
];

// Discovery Playbooks — sector-targeted strategies for finding & qualifying leads.
// Each playbook lists: where to look, qualifying signals, and a starter outreach line.
const UC_DISCOVERY_PLAYBOOKS = [
  {
    id: 'pb-universities',
    sector: 'universities',
    title: 'الجامعات وعمادات الخريجين',
    icon: '◐',
    hue: 215,
    summary: 'استهداف وكلاء عمادات الخريجين والمراكز الطلابية في الجامعات السعودية والخليجية.',
    sources: ['linkedin', 'event', 'inbound', 'cold-outreach'],
    where: [
      'ابحث في لينكدإن عن "عميد الخريجين" / "وكيل عمادة الطلاب" + اسم الجامعة',
      'فعاليات: ملتقيات وزارة التعليم، معارض الخريجين السنوية',
      'مواقع الجامعات → صفحة "خريجينا" → التقط بريد العمادة',
    ],
    signals: [
      'وجود قائمة بريدية للخريجين بأكثر من 5 آلاف اسم',
      'خطة استراتيجية تذكر "ربط الخريجين" أو "مجتمع الخريجين"',
      'لديهم فعاليات سنوية للخريجين تحتاج تنظيم رقمي',
    ],
    outreach: 'لاحظنا اهتمام {اسم الجامعة} بتفعيل شبكة الخريجين. لدينا تجربة مع جامعات مماثلة في تشغيل مجتمعات الخريجين كقناة موحدة (إيميل دوري + فعاليات + توظيف). هل نحجز 20 دقيقة لعرض كيف نوفّر 60% من جهد الفريق؟',
    expectedScore: 70,
  },
  {
    id: 'pb-training-programs',
    sector: 'training-programs',
    title: 'البرامج التدريبية والمنح',
    icon: '◇',
    hue: 145,
    summary: 'برامج تدريب وطنية، منح، معسكرات تأهيلية بدفعات منتظمة.',
    sources: ['inbound', 'event', 'linkedin', 'referral'],
    where: [
      'مواقع الإعلان عن البرامج: موهبة، توكلنا، طاقات، المهارة، أكاديمية طويق',
      'لينكدإن: "مدير برامج تدريبية" / "Program Manager" + شركات تدريب سعودية',
      'فعاليات: ملتقى المسؤولية الاجتماعية، أسبوع الموارد البشرية',
    ],
    signals: [
      'يطلق دفعات ≥ 3 سنويًا أو دفعة واحدة كبيرة (>500 متدرّب)',
      'يستخدم حاليًا تجميعات واتساب أو إكسل لإدارة المتدربين',
      'يحتاج توثيق نتائج للجهة الممولة (تقارير دورية)',
    ],
    outreach: 'مرحبًا — رأينا إعلان دفعة {اسم البرنامج}. أغلب البرامج المماثلة تخسر 30%+ من المتدربين بسبب التواصل المشتت. منصة محور توحّد قنوات الدفعة (إيميل + بوابة + تنبيهات) مع تقارير جاهزة للجهة الممولة. متى يناسبكم لقاء قصير؟',
    expectedScore: 75,
  },
  {
    id: 'pb-real-estate',
    sector: 'real-estate',
    title: 'المطورون العقاريون ومجتمعات السكان',
    icon: '◰',
    hue: 25,
    summary: 'مشاريع سكنية كبرى تحتاج قناة موحدة للسكان ومالكي الوحدات.',
    sources: ['cold-outreach', 'event', 'linkedin', 'referral'],
    where: [
      'هيئة العقار، ملتقى العقار، Cityscape Riyadh',
      'لينكدإن: "مدير تجربة السكان" / "Resident Experience Lead"',
      'مواقع المطورين الكبار → قسم "المشاريع الجارية" → التقط جهة التواصل',
    ],
    signals: [
      'مشروع سكني فعّال بأكثر من 500 وحدة',
      'إدارة مرافق داخلية لديها فريق خدمة عملاء',
      'يستخدم حاليًا جروب واتساب لكل مشروع — يعاني من الفوضى',
    ],
    outreach: 'لاحظنا إطلاق مشروع {اسم المشروع}. أكثر شكاوى السكان تأتي من غياب قناة موحدة — وأكثر التشغيل مشتت بين واتساب وإيميل. ساعدنا مطورين سعوديين على بناء بوابة سكان واحدة بفعاليات وإعلانات وصيانة في مكان واحد. نحجز عرض 20 دقيقة؟',
    expectedScore: 65,
  },
  {
    id: 'pb-gov',
    sector: 'gov',
    title: 'الجهات الحكومية وبرامج المتطوعين',
    icon: '◆',
    hue: 200,
    summary: 'هيئات ووزارات لديها مجتمعات متطوعين، شركاء، أو مستفيدين دائمين.',
    sources: ['referral', 'partner', 'event', 'cold-outreach'],
    where: [
      'منصة العمل التطوعي، منصة شركاء، إعلانات الهيئات',
      'مؤتمرات الحوكمة الحكومية وأسبوع الحكومة الرقمية',
      'إحالات: عملاؤنا في قطاعات مساندة (التعليم، الصحة) لديهم شركاء حكوميون',
    ],
    signals: [
      'مجتمع متطوعين أو شركاء فعّال >2,000 شخص',
      'تواجدهم على نتيس وSaudi Volunteer Hub',
      'جهة تشغيل تابعة (وكالة/شركة) — أسرع في الشراء من الجهة الأم',
    ],
    outreach: 'مرحبًا — نلاحظ نشاط {اسم الجهة} في برامج المتطوعين. لدينا حلول جاهزة للتواصل الدوري مع المتطوعين تتوافق مع متطلبات الحوكمة الحكومية. هل من المناسب التقديم عبر منصة اعتماد، أو لقاء استكشافي مع فريقكم أولًا؟',
    expectedScore: 60,
  },
  {
    id: 'pb-edtech',
    sector: 'edtech',
    title: 'منصات التعليم والتقنية الناشئة',
    icon: '⊛',
    hue: 280,
    summary: 'منصات تعليم رقمي ومنتجات SaaS تحتاج قناة بريدية + إشعارات للمستخدمين.',
    sources: ['ads-meta', 'ads-google', 'content', 'linkedin'],
    where: [
      'product hunt (السعودية + الإمارات)، Wamda، Magnitt',
      'لينكدإن: "Founder" / "CEO" + "EdTech" + Saudi Arabia',
      'ندواتنا واطلاع المحتوى: نشر دليل "كيف تبني قناة بريدية لمنصتك"',
    ],
    signals: [
      'قاعدة مستخدمين فعّالة ≥ 5,000',
      'لا يستخدمون أداة بريدية احترافية حاليًا (أو يستخدمون SendGrid فقط)',
      'يبحثون عن هويّة محلية للقناة البريدية + دعم بالعربية',
    ],
    outreach: 'تابعنا نمو {اسم المنتج} الأخير — رائع. عادة في هذه المرحلة، التواصل مع المستخدمين يصبح اختناقًا. نُساعد منصات سعودية مماثلة على بناء قناة موحدة (إيميل + إشعارات + بوابة) خلال أسبوعين. مهتم بدليل سريع كنّا أعددناه لمنصات في مرحلتكم؟',
    expectedScore: 60,
  },
  {
    id: 'pb-corporate',
    sector: 'corporate',
    title: 'الشركات الكبرى وفرق التوظيف',
    icon: '◧',
    hue: 240,
    summary: 'شركات وقطاعات لديها مجتمع موظفين/مرشّحين/شركاء يحتاج تواصل دوري.',
    sources: ['linkedin', 'referral', 'event', 'inbound'],
    where: [
      'Saudi HR Forum، Saudi Recruiters Network',
      'لينكدإن: "Talent Acquisition Lead" / "Employer Branding"',
      'إحالات من شركاء الموارد البشرية والاستشاريين',
    ],
    signals: [
      'برنامج تأهيل موظفين جدد دوري (>50 موظف/شهر)',
      'مجتمع المرشحين/الخريجين كأصل للتوظيف',
      'تستخدم حاليًا قوالب إيميل في outlook بدون أتمتة',
    ],
    outreach: 'فِرق التوظيف في الشركات المماثلة تخسر مرشحين قيّمين بسبب صمت الإيميل بين المراحل. نُساعد على بناء قناة "Talent Community" مع تتبع تفاعل ودعوات لأنشطة EmployerBranding. هل نحجز ربع ساعة لعرض النموذج؟',
    expectedScore: 65,
  },
];

Object.assign(window, {
  ucLoadStore, ucSaveStore, ucResetStore, ucBuildDefaults, ucBuildLeads, ucBuildAgents,
  ucUid, ucDeepClone,
  useAtlasStore, ucSuggestCases,
  UC_PRIORITIES, UC_STAGES, UC_STAGE_LEGACY_MAP, ucMigrateStage,
  UC_CONTACT_ROLES, UC_ACTIVITY_TYPES, UC_TIERS,
  UC_LEAD_STATUSES, UC_LEAD_SOURCES, UC_DISCOVERY_PLAYBOOKS,
  UC_DISCOVERY_PLATFORMS, UC_AGENT_SCHEDULES, UC_REGIONS,
});
