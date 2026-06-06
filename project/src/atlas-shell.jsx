// Atlas shell — ties Overview, Cases, Categories, Patterns, Clients together via tabs.
// Replaces the old static UseCasesView as the full-bleed screen.

const { useState: useStateAS, useMemo: useMemoAS } = React;

function AtlasShell({ data } = {}) {
  const mode = data?.mode || 'atlas'; // 'atlas' | 'clients' | 'pricing' | 'features'
  const api = useAtlasStore();
  const { store, categories, patterns, traits, cases, clients, leads } = api;

  // Per-mode storage so the atlas sub-tab is remembered independently
  const storageKey = `mhwar.atlas.tab.${mode}`;
  const defaultTab = mode === 'clients' ? 'leads'
                   : mode === 'pricing' ? 'pricing'
                   : mode === 'features' ? 'features'
                   : 'overview';
  const allowedTabs = mode === 'atlas'
    ? ['overview', 'cases', 'categories', 'patterns']
    : mode === 'clients' ? ['leads', 'pipeline', 'clients', 'dashboard']
    : mode === 'features' ? ['features']
    : ['pricing', 'estimator'];

  const [tab, setTab] = useStateAS(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && allowedTabs.includes(saved)) return saved;
    } catch {}
    return defaultTab;
  });
  // Snap to allowed tab if mode changed
  React.useEffect(() => {
    if (!allowedTabs.includes(tab)) setTab(defaultTab);
  }, [mode]);
  const goTab = (t) => {
    setTab(t);
    try { localStorage.setItem(storageKey, t); } catch {}
  };

  // Editor state for category/pattern/case
  const [editor, setEditor] = useStateAS({ kind: null, data: null });
  const openEditor = (kind, data) => setEditor({ kind, data: data || {} });
  const closeEditor = () => setEditor({ kind: null, data: null });

  // Confirm state
  const [confirmState, setConfirmState] = useStateAS({ open: false });
  const confirmDelete = (cfg) => setConfirmState({ open: true, ...cfg });

  const openClientsCount = (clients || []).filter(c => {
    const s = window.ucMigrateStage ? window.ucMigrateStage(c.stage) : c.stage;
    const meta = (window.UC_STAGES || []).find(x => x.id === s);
    return meta?.kind === 'open';
  }).length;
  const openLeadsCount = (leads || []).filter(l => {
    const meta = (window.UC_LEAD_STATUSES || []).find(x => x.id === l.status);
    return meta && meta.kind !== 'closed' && meta.kind !== 'positive' || l.status === 'qualified' || l.status === 'nurture' || l.status === 'new' || l.status === 'contacted';
  }).length;
  const allTabs = [
    { id: 'overview',   label: 'نظرة عامة' },
    { id: 'cases',      label: 'الحالات',     badge: cases.length },
    { id: 'categories', label: 'القطاعات',    badge: categories.length },
    { id: 'patterns',   label: 'الأنماط',     badge: patterns.length },
    { id: 'leads',      label: 'العملاء المحتملون', badge: openLeadsCount },
    { id: 'pipeline',   label: 'خط الصفقات',   badge: openClientsCount },
    { id: 'clients',    label: 'العملاء',      badge: clients.length },
    { id: 'dashboard',  label: 'لوحة المبيعات' },
    { id: 'features',   label: 'المميزات',    badge: (store.features || []).length },
    { id: 'pricing',    label: 'الباقات' },
    { id: 'estimator',  label: 'محاكي الأسعار' },
  ];
  const tabs = allTabs.filter(t => allowedTabs.includes(t.id));

  // Per-mode hero copy
  const hero = mode === 'clients' ? {
    eyebrow: 'Mhwar · Sales CRM',
    title: 'إدارة المبيعات',
    body: 'قمع كامل من اكتشاف العميل المحتمل حتى التشغيل: استكشاف وأدلّة، خط الصفقات (Kanban)، ملفات العملاء، الأنشطة، المهام، والتقارير.',
  } : mode === 'pricing' ? {
    eyebrow: 'Mhwar · Pricing',
    title: 'الأسعار والباقات',
    body: 'مرجع داخلي لباقات الاشتراك والأسعار.',
  } : mode === 'features' ? {
    eyebrow: 'Mhwar · Product Map',
    title: 'مُميزات المنصّة',
    body: 'خارطة شاملة لكل القدرات: منشور وقيد التطوير ومخطّط ومقترح. قابلة للتحرير والتحديث بالكامل.',
  } : {
    eyebrow: 'Mhwar · Internal Atlas',
    title: 'أطلس حالات الاستخدام',
    body: 'مرجع داخلي كامل: قطاعات، أنماط تواصل، وحالات استخدام. كل البيانات قابلة للتعديل والإضافة والحذف.',
  };

  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: 'oklch(0.985 0.003 240)',
      fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif',
      direction: 'rtl',
    }}>
      {/* Hero */}
      <div style={{ padding: '30px 40px 20px', background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
              {hero.eyebrow}
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.6 }}>
              {hero.title}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--ink-2)', maxWidth: 760, lineHeight: 1.7 }}>
              {hero.body}
            </p>
          </div>
          <button
            onClick={() => confirmDelete({
              title: 'إعادة تعيين كامل؟',
              message: 'سيتم حذف كل التعديلات والعملاء واستعادة البيانات الأصلية الافتراضية. لا يمكن التراجع.',
              confirmLabel: 'إعادة تعيين',
              destructive: true,
              onConfirm: () => api.resetAll(),
            })}
            style={{
              padding: '7px 13px', borderRadius: 8,
              background: '#fff', border: '1px solid var(--line)',
              color: 'var(--muted)', fontSize: 11.5, fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >↻ إعادة التعيين</button>
        </div>
      </div>

      {/* Tabs — only when there are multiple */}
      {tabs.length > 1 && <AxTabs tabs={tabs} active={tab} onChange={goTab} />}

      {/* Content */}
      {tab === 'overview' && <AtlasOverviewTab store={store} goTab={goTab} />}
      {tab === 'cases' && <AtlasCasesTab store={store} api={api} openEditor={openEditor} confirmDelete={confirmDelete} />}
      {tab === 'categories' && <AtlasCategoriesTab store={store} api={api} openEditor={openEditor} confirmDelete={confirmDelete} />}
      {tab === 'patterns' && <AtlasPatternsTab store={store} api={api} openEditor={openEditor} confirmDelete={confirmDelete} />}
      {tab === 'features' && <AtlasFeaturesTab store={store} api={api} />}
      {tab === 'leads' && <LeadsTab store={store} api={api} />}
      {tab === 'pipeline' && <SalesPipelineBoard store={store} api={api}
        onOpenClient={(uid) => { goTab('clients'); setTimeout(() => window.dispatchEvent(new CustomEvent('mhwar:open-client', { detail: { uid } })), 50); }}
      />}
      {tab === 'clients' && <AtlasClientsTab store={store} api={api} />}
      {tab === 'dashboard' && <SalesDashboard store={store} api={api}
        onOpenClient={(uid) => { goTab('clients'); setTimeout(() => window.dispatchEvent(new CustomEvent('mhwar:open-client', { detail: { uid } })), 50); }}
        onGotoPipeline={() => goTab('pipeline')}
      />}
      {tab === 'pricing' && <MhwarPricingTab />}

      {/* Modals */}
      <CategoryEditor
        open={editor.kind === 'category'}
        value={editor.data}
        onClose={closeEditor}
        onSave={api.upsertCategory}
      />
      <PatternEditor
        open={editor.kind === 'pattern'}
        value={editor.data}
        onClose={closeEditor}
        onSave={api.upsertPattern}
      />
      <CaseEditor
        open={editor.kind === 'case'}
        value={editor.data}
        categories={categories}
        patterns={patterns}
        traits={traits}
        onClose={closeEditor}
        onSave={api.upsertCase}
      />
      <AxConfirm
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel || 'حذف'}
        destructive={confirmState.destructive ?? true}
        onConfirm={confirmState.onConfirm}
        onClose={() => setConfirmState({ open: false })}
      />
    </div>
  );
}

// Replace the old UseCasesView export with the new shell
Object.assign(window, { UseCasesView: AtlasShell, AtlasShell });
