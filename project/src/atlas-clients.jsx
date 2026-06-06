// Client assessment tool — reimagined hierarchy:
//   Client (Jeha) → multiple Communities (each: name + size + pattern + multiple useCases)
// Export: short colored client deck (cover + communities matrix + per-selected-community detail + CTA)

const { useState: useStateCL, useMemo: useMemoCL, useRef: useRefCL } = React;

const CL_PRIORITY_COLORS = {
  hot:  { bg: 'oklch(0.96 0.05 25)',  fg: 'oklch(0.5 0.18 25)',  label: 'ساخن',  dot: 'oklch(0.55 0.2 25)' },
  warm: { bg: 'oklch(0.97 0.04 55)',  fg: 'oklch(0.5 0.14 55)',  label: 'دافئ',  dot: 'oklch(0.6 0.15 55)' },
  cold: { bg: 'oklch(0.96 0.03 220)', fg: 'oklch(0.45 0.12 220)', label: 'بارد', dot: 'oklch(0.55 0.13 220)' },
};
const CL_STAGE_LABELS = {
  discovery: 'اكتشاف', evaluation: 'تقييم', negotiation: 'تفاوض',
  'closed-won': 'مغلق · ربح', 'closed-lost': 'مغلق · خسارة',
};

// Utility: normalize a community record — migrate legacy shapes to the new one.
// NEW shape:
//   { uid, nameSource: 'case'|'custom', caseId, name, size, rootPattern, traits: [traitId...], notes }
// Legacy shapes:
//   a) { useCases: [uid...], pattern, name, notes }   — container of many cases
//   b) { caseIds: [...] }                             — older multi-case
//   c) { caseId, pattern, name, notes }               — older 1-case
function normalizeCommunity(com) {
  if (!com) return null;
  // Already new shape
  if (com.nameSource && (com.traits !== undefined || com.rootPattern !== undefined)) {
    return {
      uid: com.uid || ucUid('com'),
      nameSource: com.nameSource === 'case' ? 'case' : 'custom',
      caseId: com.caseId || null,
      name: com.name || '',
      size: com.size || '',
      rootPattern: com.rootPattern || '',
      traits: Array.isArray(com.traits) ? com.traits.filter(Boolean) : [],
      notes: com.notes || '',
    };
  }
  // Migrate from legacy — take first useCase (if any) as the case reference
  const legacyCases = com.useCases || com.caseIds || (com.caseId ? [com.caseId] : []);
  const firstCaseUid = Array.isArray(legacyCases) ? legacyCases[0] : null;
  return {
    uid: com.uid || ucUid('com'),
    nameSource: firstCaseUid ? 'case' : 'custom',
    caseId: firstCaseUid || null,
    name: com.name || '',
    size: com.size || '',
    rootPattern: com.pattern || com.rootPattern || '',
    traits: Array.isArray(com.traits) ? com.traits.filter(Boolean) : [],
    notes: com.notes || '',
  };
}

// =========================================================
// Main Clients tab
// =========================================================
function AtlasClientsTab({ store, api }) {
  const [editingClient, setEditingClient] = useStateCL(null);
  const [detailId, setDetailId] = useStateCL(null);
  const [query, setQuery] = useStateCL('');
  const [priorityFilter, setPriorityFilter] = useStateCL('all');

  // Listen for cross-tab open requests (from Dashboard, Pipeline)
  React.useEffect(() => {
    const handler = (e) => {
      const uid = e?.detail?.uid;
      if (uid) setDetailId(uid);
    };
    window.addEventListener('mhwar:open-client', handler);
    return () => window.removeEventListener('mhwar:open-client', handler);
  }, []);

  const filtered = useMemoCL(() => {
    return store.clients.filter(c => {
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
      if (query) {
        const q = query.trim();
        const hay = `${c.name} ${c.contactName} ${c.email} ${c.phone} ${c.sector}`;
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [store.clients, query, priorityFilter]);

  const editingClientObj = editingClient === 'new'
    ? null
    : store.clients.find(c => c.uid === editingClient);

  const detailClient = detailId ? store.clients.find(c => c.uid === detailId) : null;

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 40px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, gap: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.3 }}>أداة احتياج العميل</h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted)', maxWidth: 660, lineHeight: 1.7 }}>
            سجّل بيانات الجهة ثم أضف مجتمعاتها (شرائح جمهورها). كل مجتمع له اسم وحجم ونمط تواصل، ويجمع تحته مجموعة من حالات الاستخدام.
          </p>
        </div>
        <AxBtn icon="+" onClick={() => setEditingClient('new')}>عميل جديد</AxBtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 22 }}>
        <MiniStat label="إجمالي" value={store.clients.length} />
        <MiniStat label="ساخن" value={store.clients.filter(c => c.priority === 'hot').length} tone="hot" />
        <MiniStat label="دافئ" value={store.clients.filter(c => c.priority === 'warm').length} tone="warm" />
        <MiniStat label="بارد" value={store.clients.filter(c => c.priority === 'cold').length} tone="cold" />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 12px', background: '#fff', border: '1px solid var(--line)', borderRadius: 10,
        }}>
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>⌕</span>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="ابحث باسم الجهة، جهة الاتصال، القطاع..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['all', 'hot', 'warm', 'cold'].map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)} style={{
              padding: '7px 13px', borderRadius: 999,
              background: priorityFilter === p ? 'var(--ink)' : '#fff',
              color: priorityFilter === p ? '#fff' : 'var(--ink-2)',
              border: priorityFilter === p ? 'none' : '1px solid var(--line)',
              fontSize: 11.5, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              {p === 'all' ? 'الكل' : CL_PRIORITY_COLORS[p].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <AxEmpty icon="☷"
          title={store.clients.length === 0 ? 'لا يوجد عملاء بعد' : 'لا توجد نتائج'}
          message={store.clients.length === 0 ? 'ابدأ بإضافة أول عميل لبناء دراسة احتياجه' : 'جرّب تغيير الفلتر'}
          action={store.clients.length === 0 && <AxBtn icon="+" onClick={() => setEditingClient('new')}>عميل جديد</AxBtn>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map(c => (
            <ClientCard key={c.uid} client={c} store={store}
              onOpen={() => setDetailId(c.uid)}
              onEdit={() => setEditingClient(c.uid)} />
          ))}
        </div>
      )}

      {editingClient !== null && (
        <ClientEditor open value={editingClient === 'new' ? null : editingClientObj}
          store={store} api={api}
          onClose={() => setEditingClient(null)}
          onSave={(data) => { api.upsertClient(data); setEditingClient(null); }}
          onDelete={editingClient !== 'new' && editingClientObj ? () => {
            api.deleteClient(editingClientObj.uid); setEditingClient(null);
          } : null} />
      )}

      {detailClient && (
        <ClientDetailDrawer client={detailClient} store={store} api={api}
          onClose={() => setDetailId(null)}
          onEdit={() => { setEditingClient(detailClient.uid); setDetailId(null); }} />
      )}
    </div>
  );
}

function MiniStat({ label, value, tone }) {
  const c = tone ? CL_PRIORITY_COLORS[tone] : null;
  return (
    <div style={{
      padding: '14px 16px', background: c?.bg || '#fff',
      border: '1px solid var(--line)', borderRadius: 12,
    }}>
      <div style={{ fontSize: 22, fontWeight: 600, color: c?.fg || 'var(--ink)', letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>{label}</div>
    </div>
  );
}

// =========================================================
// Client card (summary)
// =========================================================
function ClientCard({ client, store, onOpen, onEdit }) {
  const cat = store.categories.find(c => c.id === client.sector);
  const p = CL_PRIORITY_COLORS[client.priority] || CL_PRIORITY_COLORS.warm;
  const communities = (client.communities || []).map(normalizeCommunity);
  const nComm = communities.length;
  const rootsSet = new Set(communities.map(c => c.rootPattern).filter(Boolean));
  const nRoots = rootsSet.size;

  return (
    <div style={{
      padding: 18, background: '#fff',
      border: '1px solid var(--line)', borderRadius: 14,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 10.5, padding: '2px 8px', borderRadius: 999,
              background: p.bg, color: p.fg, fontWeight: 600,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot }} />
              {p.label}
            </span>
            {client.stage && (
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{CL_STAGE_LABELS[client.stage] || client.stage}</span>
            )}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {client.name}
          </div>
          {cat && <div style={{ fontSize: 11.5, color: cat.accent, marginTop: 3 }}>{cat.name}</div>}
        </div>
        <IconBtn onClick={onEdit}>✎</IconBtn>
      </div>

      {client.contactName && (
        <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
          {client.contactName}{client.contactRole ? ` · ${client.contactRole}` : ''}
        </div>
      )}

      <div onClick={onOpen} style={{
        cursor: 'pointer', padding: '10px 12px', background: 'var(--warm)', borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
          <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginInlineEnd: 4 }}>{nComm}</span>
          مجتمع ·
          <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginInline: 4 }}>{nRoots}</span>
          نمط رئيسي
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>تفاصيل →</span>
      </div>
    </div>
  );
}

// =========================================================
// Client editor — two-step wizard-like form
// =========================================================
function ClientEditor({ open, value, store, api, onClose, onSave, onDelete }) {
  const emptyClient = () => ({
    name: '', sector: '', contactName: '', contactRole: '', email: '', phone: '',
    priority: 'warm', stage: 'discovery', size: '', lastContact: '', notes: '',
    communities: [],
  });

  const [d, setD] = useStateCL(() => {
    if (!value) return emptyClient();
    const v = { ...value };
    v.communities = (v.communities || []).map(normalizeCommunity);
    return v;
  });
  const [confirmDel, setConfirmDel] = useStateCL(false);

  React.useEffect(() => {
    if (!value) { setD(emptyClient()); return; }
    const v = { ...value };
    v.communities = (v.communities || []).map(normalizeCommunity);
    setD(v);
  }, [value, open]);

  // ---- community mutation helpers ----
  const addCommunity = (seed) => {
    const base = { uid: ucUid('com'), nameSource: 'custom', caseId: null, name: '', size: '', rootPattern: '', traits: [], notes: '' };
    setD({
      ...d,
      communities: [ ...(d.communities || []), { ...base, ...(seed || {}) } ],
    });
  };
  const updateCommunity = (uid, patch) => {
    setD({ ...d, communities: d.communities.map(c => c.uid === uid ? { ...c, ...patch } : c) });
  };
  const removeCommunity = (uid) => {
    setD({ ...d, communities: d.communities.filter(c => c.uid !== uid) });
  };
  const duplicateCommunity = (uid) => {
    const src = d.communities.find(c => c.uid === uid);
    if (!src) return;
    const copy = { ...src, uid: ucUid('com'), name: (src.name || '') + ' — نسخة' };
    setD({ ...d, communities: [...d.communities, copy] });
  };

  const save = () => {
    if (!d.name?.trim()) return;
    onSave({ ...d, name: d.name.trim() });
  };

  const isNew = !value;

  return (
    <AxModal open={open}
      title={isNew ? 'عميل جديد' : 'تعديل بيانات العميل'}
      subtitle="1 — بيانات الجهة · 2 — مجتمعاتها (شرائح جمهور)، ولكل مجتمع نمط وحالات"
      onClose={onClose} width={820}
      footer={
        <>
          <AxBtn onClick={save}>{isNew ? 'إنشاء العميل' : 'حفظ التعديلات'}</AxBtn>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
          {onDelete && (
            <div style={{ marginInlineStart: 'auto' }}>
              <AxBtn kind="danger" onClick={() => setConfirmDel(true)}>حذف العميل</AxBtn>
            </div>
          )}
        </>
      }
    >
      {/* STEP 1 — identity */}
      <StepHeader num={1} title="بيانات الجهة" subtitle="معلومات أساسية عن العميل وجهة الاتصال" />

      <FormSection label="الهويّة">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
          <AxField label="اسم الشركة/الجهة" required>
            <AxInput value={d.name} onChange={v => setD({ ...d, name: v })} placeholder="مثال: أرامكو السعودية" />
          </AxField>
          <AxField label="القطاع الأساسي">
            <AxSelect value={d.sector} onChange={v => setD({ ...d, sector: v })}
              options={[{ value: '', label: '— اختر —' }, ...store.categories.map(c => ({ value: c.id, label: c.name }))]} />
          </AxField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <AxField label="الأولوية">
            <div style={{ display: 'flex', gap: 6 }}>
              {['hot', 'warm', 'cold'].map(p => {
                const c = CL_PRIORITY_COLORS[p]; const active = d.priority === p;
                return (
                  <button key={p} type="button" onClick={() => setD({ ...d, priority: p })} style={{
                    flex: 1, padding: '8px 10px', borderRadius: 9,
                    background: active ? c.bg : '#fff', color: active ? c.fg : 'var(--ink-2)',
                    border: active ? `1.5px solid ${c.fg}44` : '1px solid var(--line)',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </AxField>
          <AxField label="مرحلة البيع">
            <AxSelect value={d.stage} onChange={v => setD({ ...d, stage: v })}
              options={Object.entries(CL_STAGE_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          </AxField>
          <AxField label="حجم الجهة الإجمالي" hint="موظفون / أعضاء / عملاء">
            <AxInput value={d.size} onChange={v => setD({ ...d, size: v })} placeholder="مثال: 5000" />
          </AxField>
        </div>
      </FormSection>

      <FormSection label="جهة الاتصال">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <AxField label="الاسم">
            <AxInput value={d.contactName} onChange={v => setD({ ...d, contactName: v })} placeholder="أحمد السالم" />
          </AxField>
          <AxField label="المنصب">
            <AxInput value={d.contactRole} onChange={v => setD({ ...d, contactRole: v })} placeholder="مدير التواصل المؤسسي" />
          </AxField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <AxField label="البريد">
            <AxInput type="email" value={d.email} onChange={v => setD({ ...d, email: v })} placeholder="a@co.sa" />
          </AxField>
          <AxField label="الجوال">
            <AxInput type="tel" value={d.phone} onChange={v => setD({ ...d, phone: v })} placeholder="+9665..." />
          </AxField>
          <AxField label="آخر تواصل">
            <AxInput type="date" value={d.lastContact} onChange={v => setD({ ...d, lastContact: v })} />
          </AxField>
        </div>
      </FormSection>

      {/* STEP 2 — communities */}
      <StepHeader num={2} title="مجتمعات الجهة" subtitle="أضف كل شريحة جمهور في الجهة كمجتمع مستقل، ثم اختر نمط تواصله وحالاته" />

      <CommunitiesBuilder
        sector={d.sector}
        communities={d.communities || []}
        store={store}
        api={api}
        onAdd={addCommunity}
        onUpdate={updateCommunity}
        onRemove={removeCommunity}
        onDuplicate={duplicateCommunity}
      />

      <FormSection label="ملاحظات حرّة على العميل">
        <AxTextarea value={d.notes} onChange={v => setD({ ...d, notes: v })} rows={3}
          placeholder="ملاحظات، اعتراضات، سياق خاص..." />
      </FormSection>

      <AxConfirm open={confirmDel} title="حذف العميل"
        message="سيتم حذف بيانات هذا العميل ومجتمعاته نهائياً."
        confirmLabel="حذف" destructive
        onConfirm={() => { if (onDelete) onDelete(); }}
        onClose={() => setConfirmDel(false)} />
    </AxModal>
  );
}

function StepHeader({ num, title, subtitle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 18,
      padding: '12px 14px', background: 'var(--warm)', borderRadius: 12,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: 'var(--ink)', color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600, flexShrink: 0,
      }}>{num}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.6 }}>{subtitle}</div>
      </div>
    </div>
  );
}

// =========================================================
// Communities builder — list of community cards + add button + suggestions
// =========================================================
function CommunitiesBuilder({ sector, communities, store, api, onAdd, onUpdate, onRemove, onDuplicate }) {
  const suggestions = useMemoCL(() => {
    if (!sector) return [];
    return (store.cases || [])
      .filter(uc => (uc.suggestedSectors || []).includes(sector))
      .slice(0, 6);
  }, [store.cases, sector]);

  const quickAddFromSuggestion = (uc) => {
    // Seed a new community FROM this case: name from case, rootPattern + traits pre-filled from case's suggestions
    const com = {
      uid: ucUid('com'),
      nameSource: 'case',
      caseId: uc.uid,
      name: uc.name,
      size: '',
      rootPattern: uc.suggestedRootPattern || '',
      traits: [...(uc.suggestedTraits || [])],
      notes: '',
    };
    onAdd(com);
  };

  return (
    <>
      {/* Sector-based suggestions banner */}
      {sector && suggestions.length > 0 && (
        <div style={{
          padding: '12px 14px', marginBottom: 14,
          background: 'oklch(0.98 0.02 60)',
          border: '1px solid oklch(0.93 0.04 60)', borderRadius: 12,
        }}>
          <div style={{ fontSize: 11, color: 'oklch(0.4 0.1 40)', fontWeight: 600, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
            أنواع مجتمعات شائعة في قطاع {store.categories.find(c => c.id === sector)?.name || sector}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.6 }}>
            انقر على نوع مجتمع لإضافته مع تعبئة النمط والخصائص تلقائياً من المكتبة.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggestions.map(uc => (
              <button key={uc.uid} type="button" onClick={() => quickAddFromSuggestion(uc)}
                style={{
                  fontSize: 11.5, padding: '5px 11px', borderRadius: 999,
                  background: '#fff', color: 'oklch(0.35 0.1 40)',
                  border: '1px solid oklch(0.92 0.04 60)', fontFamily: 'inherit', cursor: 'pointer',
                }}>
                + {uc.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Existing communities */}
      {communities.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
          {communities.map((com, i) => (
            <CommunityCard key={com.uid} idx={i + 1} com={com}
              store={store} api={api} sector={sector}
              onChange={(patch) => onUpdate(com.uid, patch)}
              onRemove={() => onRemove(com.uid)}
              onDuplicate={() => onDuplicate(com.uid)}
            />
          ))}
        </div>
      )}

      {/* Add button */}
      <button type="button" onClick={() => onAdd()}
        style={{
          width: '100%', padding: '14px', borderRadius: 12,
          border: '1.5px dashed var(--line-2)', background: '#fbfaf7',
          cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 13, fontWeight: 600, color: 'var(--ink-2)',
          marginBottom: 20,
        }}>
        + إضافة مجتمع جديد
      </button>
    </>
  );
}

// =========================================================
// CommunityCard — NEW: name (from case OR custom) + rootPattern + traits
// =========================================================
function CommunityCard({ idx, com, store, api, sector, onChange, onRemove, onDuplicate }) {
  const [expanded, setExpanded] = useStateCL(!com.name && !com.rootPattern);
  const [caseLibOpen, setCaseLibOpen] = useStateCL(false);

  const rootPat = store.patterns.find(p => p.id === com.rootPattern);
  const hue = rootPat?.hue ?? 60;
  const sourceCase = com.caseId ? (store.cases || []).find(c => c.uid === com.caseId) : null;

  // Traits compatible with the current rootPattern
  const compatibleTraits = useMemoCL(() => {
    if (!com.rootPattern) return store.traits || [];
    return (store.traits || []).filter(t => !t.allowedRoots || t.allowedRoots.includes(com.rootPattern));
  }, [store.traits, com.rootPattern]);

  // Group traits by group
  const traitsByGroup = useMemoCL(() => {
    const m = new Map();
    compatibleTraits.forEach(t => {
      const g = t.group || 'خصائص';
      if (!m.has(g)) m.set(g, []);
      m.get(g).push(t);
    });
    return Array.from(m.entries());
  }, [compatibleTraits]);

  const selectedTraits = (com.traits || [])
    .map(tid => (store.traits || []).find(t => t.id === tid))
    .filter(Boolean);

  const toggleTrait = (traitId) => {
    const has = (com.traits || []).includes(traitId);
    onChange({ traits: has ? com.traits.filter(t => t !== traitId) : [...(com.traits || []), traitId] });
  };

  // When rootPattern changes, drop any traits that are no longer compatible
  const setRootPattern = (id) => {
    const newTraits = (com.traits || []).filter(tid => {
      const t = (store.traits || []).find(x => x.id === tid);
      return t && (!t.allowedRoots || t.allowedRoots.includes(id));
    });
    onChange({ rootPattern: id, traits: newTraits });
  };

  // Pick from case library — updates name, caseId, and SUGGESTS pattern + traits
  const pickFromCase = (uc, { replacePatternTraits = true } = {}) => {
    const patch = { nameSource: 'case', caseId: uc.uid, name: uc.name };
    if (replacePatternTraits) {
      patch.rootPattern = uc.suggestedRootPattern || com.rootPattern || '';
      patch.traits = [...(uc.suggestedTraits || [])];
    }
    onChange(patch);
    setCaseLibOpen(false);
  };

  const clearCaseLink = () => {
    onChange({ nameSource: 'custom', caseId: null });
  };

  return (
    <div style={{
      border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden',
      background: rootPat ? `oklch(0.995 0.008 ${hue})` : '#fff',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
        background: rootPat ? `oklch(0.98 0.02 ${hue})` : '#fbfaf7',
        borderBottom: expanded ? `1px solid oklch(0.94 0.02 ${hue})` : 'none',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: rootPat ? `oklch(0.55 0.15 ${hue})` : 'var(--ink)', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, flexShrink: 0,
        }}>{idx}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
            {com.name || <span style={{ color: 'var(--muted)', fontWeight: 500 }}>— مجتمع بلا اسم —</span>}
            {com.nameSource === 'case' && sourceCase && (
              <span title="مرتبط بنوع من المكتبة"
                style={{ fontSize: 9, padding: '1px 6px', borderRadius: 999,
                  background: 'oklch(0.94 0.04 260)', color: 'oklch(0.4 0.15 260)', letterSpacing: 0.5, fontWeight: 600 }}>
                من المكتبة
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {rootPat ? <span>{rootPat.icon} {rootPat.name || rootPat.id}</span> : <span>لم يُحدّد نمط</span>}
            {com.size && <span>· {com.size}</span>}
            {selectedTraits.length > 0 && <span>· {selectedTraits.length} خاصية</span>}
          </div>
        </div>
        <button type="button" onClick={onDuplicate} title="تكرار"
          style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid var(--line)',
            background: '#fff', fontSize: 12, cursor: 'pointer', color: 'var(--muted)' }}>⧉</button>
        <button type="button" onClick={onRemove} title="حذف"
          style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid var(--line)',
            background: '#fff', color: 'oklch(0.5 0.15 25)', fontSize: 12, cursor: 'pointer' }}>×</button>
        <button type="button" onClick={() => setExpanded(!expanded)}
          style={{ padding: '6px 12px', fontSize: 11.5, borderRadius: 8,
            border: '1px solid var(--line)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
          {expanded ? 'طيّ' : 'فتح'}
        </button>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: 16 }}>
          {/* Name source toggle */}
          <AxField label="اسم المجتمع" hint="اختر من مكتبة الأنواع، أو اكتب اسماً مخصّصاً">
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <button type="button"
                onClick={() => { if (com.nameSource !== 'case') setCaseLibOpen(true); else setCaseLibOpen(true); }}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 9,
                  background: com.nameSource === 'case' ? `oklch(0.96 0.04 ${hue})` : '#fff',
                  border: com.nameSource === 'case' ? `1.5px solid oklch(0.55 0.15 ${hue})` : '1px solid var(--line)',
                  fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'start',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: com.nameSource === 'case' ? `oklch(0.55 0.15 ${hue})` : 'var(--warm)',
                  color: com.nameSource === 'case' ? '#fff' : 'var(--muted)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                }}>☰</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink)' }}>
                    {com.nameSource === 'case' && sourceCase ? sourceCase.name : 'من مكتبة الأنواع'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                    {com.nameSource === 'case' ? 'اضغط لتغيير النوع' : `اختر من ${store.cases?.length || 0} نوع`}
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => onChange({ nameSource: 'custom', caseId: null })}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 9,
                  background: com.nameSource === 'custom' ? `oklch(0.96 0.04 ${hue})` : '#fff',
                  border: com.nameSource === 'custom' ? `1.5px solid oklch(0.55 0.15 ${hue})` : '1px solid var(--line)',
                  fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'start',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: com.nameSource === 'custom' ? `oklch(0.55 0.15 ${hue})` : 'var(--warm)',
                  color: com.nameSource === 'custom' ? '#fff' : 'var(--muted)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                }}>✎</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink)' }}>اسم مخصّص</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>اكتب اسم المجتمع يدوياً</div>
                </div>
              </button>
            </div>

            {/* name input — always editable, but show context when linked to case */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
              <AxInput value={com.name} onChange={v => onChange({ name: v })}
                placeholder={com.nameSource === 'case' ? 'اسم ظاهر (يمكن تعديله)' : 'مثال: موظفو الإدارة العامة'} />
              <AxInput value={com.size} onChange={v => onChange({ size: v })} placeholder="الحجم · 2000" />
            </div>

            {com.nameSource === 'case' && sourceCase?.desc && (
              <div style={{
                marginTop: 10, padding: '10px 12px',
                background: `oklch(0.98 0.02 ${hue})`,
                border: `1px dashed oklch(0.9 0.05 ${hue})`, borderRadius: 9,
                fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.65,
              }}>
                <strong style={{ color: `oklch(0.35 0.15 ${hue})`, fontSize: 10.5, letterSpacing: 1, marginInlineEnd: 6 }}>مكتبة</strong>
                {sourceCase.desc}
              </div>
            )}
          </AxField>

          {/* Root pattern */}
          <AxField label="النمط الرئيسي (واحد فقط)" required>
            <RootPatternPicker patterns={store.patterns} value={com.rootPattern} onChange={setRootPattern} />
          </AxField>

          {/* Traits */}
          <AxField label={`خصائص المجتمع (${selectedTraits.length})`}
            hint={com.rootPattern ? 'اختر ما يصف المجتمع (متعدد)' : 'اختر النمط الرئيسي أولاً لتظهر الخصائص المتوافقة'}>
            {!com.rootPattern ? (
              <div style={{ padding: 16, background: 'var(--warm)', borderRadius: 10, fontSize: 11.5, color: 'var(--muted)', textAlign: 'center' }}>
                اختر النمط الرئيسي أعلاه أولاً
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {traitsByGroup.map(([group, items]) => (
                  <div key={group}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1.5, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
                      {group}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {items.map(t => {
                        const on = (com.traits || []).includes(t.id);
                        return (
                          <button key={t.id} type="button" onClick={() => toggleTrait(t.id)}
                            title={t.desc || ''}
                            style={{
                              fontSize: 11.5, padding: '6px 12px', borderRadius: 999,
                              background: on ? `oklch(0.55 0.15 ${hue})` : '#fff',
                              color: on ? '#fff' : 'var(--ink-2)',
                              border: on ? 'none' : '1px solid var(--line)',
                              cursor: 'pointer', fontFamily: 'inherit', fontWeight: on ? 600 : 500,
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                            }}>
                            <span style={{ fontSize: 9 }}>{on ? '✓' : '+'}</span>
                            {t.label || t.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AxField>

          <AxField label="ملاحظات المجتمع">
            <AxTextarea value={com.notes} onChange={v => onChange({ notes: v })} rows={2}
              placeholder="خصوصيات، اعتبارات، تفاصيل مهمة..." />
          </AxField>
        </div>
      )}

      {/* Case library picker */}
      {caseLibOpen && (
        <CaseLibraryPicker
          store={store} sector={sector}
          selectedId={com.caseId}
          onClose={() => setCaseLibOpen(false)}
          onPick={(uc) => pickFromCase(uc)}
        />
      )}
    </div>
  );
}

// =========================================================
// CaseLibraryPicker — single-pick from case library (to name a community)
// =========================================================
function CaseLibraryPicker({ store, sector, selectedId, onClose, onPick }) {
  const [q, setQ] = useStateCL('');

  const grouped = useMemoCL(() => {
    const m = new Map();
    (store.cases || []).forEach(uc => {
      if (q && !`${uc.name} ${uc.desc || ''}`.includes(q.trim())) return;
      // group by first suggested sector
      const sec = (uc.suggestedSectors || [])[0] || 'عام';
      if (!m.has(sec)) m.set(sec, []);
      m.get(sec).push(uc);
    });
    // put client sector first
    return Array.from(m.entries()).sort((a, b) => {
      if (a[0] === sector) return -1;
      if (b[0] === sector) return 1;
      return 0;
    });
  }, [store.cases, q, sector]);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.5)', zIndex: 300, backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(720px, 94vw)', maxHeight: '86vh', zIndex: 301,
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>اختر نوع مجتمع من المكتبة</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.6 }}>
                سيُعبّأ النمط والخصائص المقترحة للنوع تلقائياً — يمكنك تعديلها لاحقاً.
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line)',
              background: '#fff', fontSize: 15, cursor: 'pointer',
            }}>×</button>
          </div>
          <div style={{
            marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: '#fbfaf7', border: '1px solid var(--line)', borderRadius: 10,
          }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>⌕</span>
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder={`ابحث في ${store.cases?.length || 0} نوع...`}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 12.5, fontFamily: 'inherit', background: 'transparent' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
          {grouped.map(([secName, list]) => (
            <div key={secName} style={{ marginBottom: 10 }}>
              <div style={{
                padding: '8px 12px', fontSize: 10.5, letterSpacing: 1.5,
                color: secName === sector ? 'oklch(0.4 0.17 45)' : 'var(--muted)',
                fontWeight: 600, textTransform: 'uppercase',
              }}>
                {secName} {secName === sector && '· قطاع العميل'}
              </div>
              {list.map(uc => {
                const isSel = selectedId === uc.uid;
                const rootPat = store.patterns.find(p => p.id === uc.suggestedRootPattern);
                const hue = rootPat?.hue ?? 60;
                return (
                  <button key={uc.uid} type="button" onClick={() => onPick(uc)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%',
                      padding: '10px 12px', margin: '2px 0',
                      border: isSel ? `1.5px solid oklch(0.55 0.15 ${hue})` : '1px solid transparent',
                      background: isSel ? `oklch(0.97 0.03 ${hue})` : '#fff',
                      borderRadius: 9, textAlign: 'start', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                    <span style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: 7,
                      background: `oklch(0.95 0.05 ${hue})`, color: `oklch(0.4 0.15 ${hue})`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, marginTop: 1,
                    }}>{rootPat?.icon || '•'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>
                        {uc.name}
                      </div>
                      {uc.desc && (
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.6,
                          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {uc.desc}
                        </div>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                        {rootPat && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999,
                            background: `oklch(0.94 0.05 ${hue})`, color: `oklch(0.35 0.15 ${hue})`, fontWeight: 600 }}>
                            {rootPat.icon} {uc.suggestedRootPattern}
                          </span>
                        )}
                        {(uc.suggestedTraits || []).slice(0, 4).map(tid => (
                          <span key={tid} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999,
                            background: '#fbfaf7', color: 'var(--ink-2)', border: '1px solid var(--line)' }}>
                            {tid}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// =========================================================
// Root pattern picker — radio-style with description
// =========================================================
function RootPatternPicker({ patterns, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {patterns.map(p => {
        const active = value === p.id;
        return (
          <button key={p.id} type="button" onClick={() => onChange(p.id)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              background: active ? `oklch(0.97 0.03 ${p.hue})` : '#fff',
              border: active ? `1.5px solid oklch(0.55 0.15 ${p.hue})` : '1px solid var(--line)',
              textAlign: 'start', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s',
            }}>
            <span style={{
              flexShrink: 0, width: 26, height: 26, borderRadius: 7,
              background: `oklch(0.95 0.05 ${p.hue})`, color: `oklch(0.4 0.17 ${p.hue})`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600,
            }}>{p.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{p.name || p.id}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// =========================================================
// Form section helper
// =========================================================
function FormSection({ label, hint, action, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid var(--line)' }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', letterSpacing: 1.2, textTransform: 'uppercase' }}>{label}</span>
          {hint && <span style={{ marginInlineStart: 8, fontSize: 11, color: 'var(--muted)' }}>{hint}</span>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// =========================================================
// Client detail drawer — read-only + export
// =========================================================
function ClientDetailDrawer({ client, store, api, onClose, onEdit }) {
  const cat = store.categories.find(c => c.id === client.sector);
  const p = CL_PRIORITY_COLORS[client.priority] || CL_PRIORITY_COLORS.warm;
  const [drawerTab, setDrawerTab] = useStateCL('overview');

  // Stage meta
  const stageId = window.ucMigrateStage ? window.ucMigrateStage(client.stage) : client.stage;
  const stageMeta = (window.UC_STAGES || []).find(s => s.id === stageId) || (window.UC_STAGES || [])[0];
  const dealValue = window.spDealValue ? window.spDealValue(client.deal) : 0;

  const communities = (client.communities || []).map(normalizeCommunity);
  const resolvePattern = (com) => com.rootPattern ? store.patterns.find(p => p.id === com.rootPattern) : null;
  const resolveTraits = (com) => (com.traits || []).map(tid => (store.traits || []).find(t => t.id === tid)).filter(Boolean);
  const resolveSourceCase = (com) => com.caseId ? (store.cases || []).find(c => c.uid === com.caseId) : null;
  // Legacy compat: the old model had useCases — keep a thin shim so historical clients still render
  const resolveCases = (com) => (com.useCases || []).map(uid => store.cases.find(c => c.uid === uid)).filter(Boolean);

  const totalTraits = communities.reduce((s, c) => s + resolveTraits(c).length, 0);
  const patternsSet = new Set(communities.map(c => c.rootPattern).filter(Boolean));

  // export dialog state — choose which communities to detail
  const [exportOpen, setExportOpen] = useStateCL(false);

  const exportJSON = () => {
    const data = {
      client,
      communities: communities.map(com => ({
        ...com,
        patternObj: resolvePattern(com),
        casesObjs: resolveCases(com),
      })),
      category: cat,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client.name}-دراسة احتياج.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openPrintWindow = (title, html) => {
    const w = window.open('', '_blank', 'width=1000,height=1100');
    if (!w) return;
    w.document.write(html);
    w.document.title = title;
    w.document.close();
  };

  // ============================================================
  // SALES REPORT — internal colored A4 pages
  // ============================================================
  const exportSalesPDF = () => {
    const communitiesHtml = communities.map((com, i) => {
      const pat = resolvePattern(com);
      const traits = resolveTraits(com);
      const src = resolveSourceCase(com);
      const hue = pat?.hue ?? 60;
      // group traits by group label
      const traitsByGroup = new Map();
      traits.forEach(t => {
        const g = t.group || 'خصائص';
        if (!traitsByGroup.has(g)) traitsByGroup.set(g, []);
        traitsByGroup.get(g).push(t);
      });
      return `
        <div class="comm" style="--hue:${hue}">
          <div class="comm-head">
            <span class="idx">${i + 1}</span>
            <div style="flex:1">
              <div class="comm-name">${com.name || 'مجتمع بلا اسم'}</div>
              <div class="comm-meta">
                ${pat ? `<span class="pat-pill">${pat.icon} ${pat.name || pat.id}</span>` : ''}
                ${com.size ? `<span class="size-pill">${com.size}</span>` : ''}
                ${src ? `<span class="src-pill">من المكتبة · ${src.name}</span>` : ''}
                <span class="count-pill">${traits.length} خاصية</span>
              </div>
            </div>
          </div>
          ${pat ? `<div class="pat-desc">${pat.desc || ''}</div>` : ''}
          ${traits.length ? `<div class="cases-title">الخصائص الموصوفة</div>
            ${Array.from(traitsByGroup.entries()).map(([g, items]) => `
              <div class="trait-group">
                <div class="trait-group-lbl">${g}</div>
                <div class="trait-chips">
                  ${items.map(t => `<span class="trait-chip" title="${(t.desc || '').replace(/"/g, '&quot;')}">${t.label || t.id}</span>`).join('')}
                </div>
              </div>
            `).join('')}` : '<div class="muted-line">لم تُحدَّد خصائص بعد</div>'}
          ${com.notes ? `<div class="notes-lbl">ملاحظات</div><div class="notes">${com.notes}</div>` : ''}
        </div>
      `;
    }).join('');

    const checklist = [
      { k: 'القطاع', v: cat?.name || '—' },
      { k: 'الأولوية', v: p.label, badge: true },
      { k: 'مرحلة البيع', v: CL_STAGE_LABELS[client.stage] || '—' },
      { k: 'حجم الجهة', v: client.size || '—' },
      { k: 'آخر تواصل', v: client.lastContact || '—' },
      { k: 'جهة الاتصال', v: client.contactName || '—' },
    ];

    const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
      <title>تقرير المبيعات — ${client.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif; color: #14130f; line-height: 1.7; margin: 0; padding: 36px 40px; background: #fff; max-width: 840px; margin-inline: auto; }
        .brand-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 2px solid #14130f; margin-bottom: 20px; }
        .brand { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
        .brand small { font-size: 10.5px; color: #6b6a64; font-weight: 400; margin-inline-start: 8px; letter-spacing: 2px; }
        .doc-tag { font-size: 10px; padding: 4px 10px; background: #14130f; color: #fff; border-radius: 999px; letter-spacing: 2px; }
        h1 { font-size: 30px; margin: 0 0 4px; letter-spacing: -0.6px; font-weight: 600; }
        .subtitle { color: #6b6a64; font-size: 13px; margin-bottom: 24px; }
        .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 26px; }
        .meta-cell { padding: 13px 14px; background: #fbfaf7; border: 1px solid #e8e5dd; border-radius: 10px; }
        .meta-cell .k { font-size: 10px; color: #6b6a64; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px; }
        .meta-cell .v { font-size: 13.5px; font-weight: 500; }
        .priority { display: inline-block; padding: 3px 11px; border-radius: 99px; font-size: 11px; font-weight: 600; background: ${p.bg}; color: ${p.fg}; }
        h2 { font-size: 11.5px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #6b6a64; border-bottom: 1px solid #e8e5dd; padding-bottom: 8px; margin: 24px 0 14px; }
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 22px; }
        .sm { padding: 14px; background: #14130f; color: #fff; border-radius: 10px; }
        .sm .n { font-size: 28px; font-weight: 600; letter-spacing: -1px; }
        .sm .l { font-size: 11px; color: #a8a7a0; letter-spacing: 1px; margin-top: 2px; }
        .notes-box { padding: 14px; background: oklch(0.98 0.02 60); border: 1px solid oklch(0.93 0.03 60); border-radius: 10px; font-size: 12.5px; margin-bottom: 22px; }
        .comm { border: 1px solid oklch(0.92 0.03 var(--hue)); border-radius: 12px; padding: 16px; margin-bottom: 12px; page-break-inside: avoid;
                background: linear-gradient(180deg, oklch(0.99 0.015 var(--hue)) 0%, #fff 40%); }
        .comm-head { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; }
        .idx { width: 30px; height: 30px; border-radius: 8px; background: oklch(0.55 0.15 var(--hue)); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0; }
        .comm-name { font-size: 16px; font-weight: 600; color: oklch(0.3 0.13 var(--hue)); }
        .comm-meta { font-size: 11px; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 6px; }
        .pat-pill { padding: 2px 9px; background: oklch(0.95 0.05 var(--hue)); color: oklch(0.35 0.15 var(--hue)); border-radius: 999px; font-weight: 600; }
        .size-pill, .count-pill { padding: 2px 9px; background: #fbfaf7; border: 1px solid #e8e5dd; border-radius: 999px; color: #6b6a64; }
        .src-pill { padding: 2px 9px; background: oklch(0.97 0.02 var(--hue)); border: 1px dashed oklch(0.85 0.05 var(--hue)); border-radius: 999px; color: oklch(0.35 0.15 var(--hue)); font-weight: 500; }
        .trait-group { margin-bottom: 10px; }
        .trait-group-lbl { font-size: 10px; color: #6b6a64; letter-spacing: 1.5px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px; }
        .trait-chips { display: flex; flex-wrap: wrap; gap: 5px; }
        .trait-chip { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11.5px; background: oklch(0.96 0.04 var(--hue)); color: oklch(0.32 0.14 var(--hue)); font-weight: 500; }
        .pat-desc { padding: 10px 12px; background: oklch(0.97 0.02 var(--hue)); border-radius: 8px; font-size: 12px; color: oklch(0.25 0.08 var(--hue)); margin-bottom: 10px; }
        .cases-title { font-size: 10.5px; color: #6b6a64; letter-spacing: 1.2px; text-transform: uppercase; margin: 8px 0 6px; }
        .cases { margin: 0; padding-inline-start: 18px; }
        .cases li { margin-bottom: 6px; font-size: 12.5px; }
        .case-desc { font-size: 11.5px; color: #6b6a64; font-weight: 400; margin-top: 2px; line-height: 1.6; }
        .muted-line { font-size: 11.5px; color: #9b9a94; font-style: italic; }
        .notes-lbl { font-size: 10px; color: #6b6a64; letter-spacing: 1.2px; text-transform: uppercase; margin-top: 10px; margin-bottom: 4px; }
        .notes { font-size: 12px; color: #2b2a24; padding: 8px 10px; background: #fbfaf7; border-radius: 6px; }
        .foot { margin-top: 36px; padding-top: 14px; border-top: 1px solid #e8e5dd; font-size: 10.5px; color: #6b6a64; display: flex; justify-content: space-between; }
        @media print { body { padding: 18px 22px; } }
      </style>
    </head><body>
      <div class="brand-row">
        <div class="brand">محور <small>MHWAR</small></div>
        <div class="doc-tag">داخلي · مبيعات</div>
      </div>
      <h1>${client.name}</h1>
      <div class="subtitle">تقرير دراسة احتياج · مُعدّ لفريق المبيعات</div>
      <div class="meta">
        ${checklist.map(c => `<div class="meta-cell"><div class="k">${c.k}</div><div class="v">${c.badge ? `<span class="priority">${c.v}</span>` : c.v}</div></div>`).join('')}
      </div>
      <h2>ملخّص الاحتياج</h2>
      <div class="summary-grid">
        <div class="sm"><div class="n">${communities.length}</div><div class="l">مجتمعات</div></div>
        <div class="sm"><div class="n">${totalTraits}</div><div class="l">خصائص موصوفة</div></div>
        <div class="sm"><div class="n">${patternsSet.size}</div><div class="l">أنماط تواصل</div></div>
      </div>
      ${client.notes ? `<h2>ملاحظات داخلية</h2><div class="notes-box">${client.notes}</div>` : ''}
      <h2>المجتمعات (${communities.length})</h2>
      ${communitiesHtml || '<div class="notes-box">لم تُسجَّل مجتمعات بعد</div>'}
      <div class="foot">
        <span>${communities.length} مجتمع · ${totalTraits} خاصية · ${patternsSet.size} نمط</span>
        <span>${new Date().toLocaleDateString('ar')} · داخلي — لا يُشارك مع العميل</span>
      </div>
      <script>window.onload = () => setTimeout(() => window.print(), 400);</script>
    </body></html>`;

    openPrintWindow(`تقرير المبيعات — ${client.name}`, html);
  };

  // ============================================================
  // CLIENT DECK — compact, colorful, user-selected detail communities
  // ============================================================
  // ============================================================
  // CLIENT PROPOSAL — 8-slide persuasion deck (delegated to buildProposalHTML)
  // ============================================================
  const exportClientPDF = (detailComIds, opts = {}) => {
    const { includeInvestment = false } = opts;
    // Build a shareable link that encodes client + communities into the URL hash.
    // proposal.html (served from the same folder) decodes and renders the same deck.
    let shareLink = '';
    try {
      const payload = {
        client,
        cat,
        communities,
        patterns: store.patterns,
        traits: store.traits,
        cases: store.cases,
        detailComIds,
        includeInvestment,
        ts: Date.now(),
      };
      const json = JSON.stringify(payload);
      // UTF-8 safe base64 encode
      const b64 = btoa(unescape(encodeURIComponent(json)));
      const origin = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
      shareLink = origin + 'proposal.html#' + b64;
    } catch (e) { console.warn('share link encode failed', e); }

    const { html, title } = window.buildProposalHTML({
      client, cat, communities,
      resolvePattern, resolveTraits, resolveSourceCase,
      detailComIds,
      includeInvestment,
      shareLink,
    });
    openPrintWindow(title, html);
  };

  // Copy share link to clipboard (used by dedicated button in drawer)
  const copyShareLink = (detailComIds = [], opts = {}) => {
    const { includeInvestment = false } = opts;
    try {
      const payload = {
        client, cat, communities,
        patterns: store.patterns,
        traits: store.traits,
        cases: store.cases,
        detailComIds,
        includeInvestment,
        ts: Date.now(),
      };
      const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const origin = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
      const link = origin + 'proposal.html#' + b64;
      navigator.clipboard.writeText(link);
      return link;
    } catch (e) { return ''; }
  };


  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.4)', zIndex: 200, backdropFilter: 'blur(2px)' }} />
      <aside style={{
        position: 'fixed', top: 0, bottom: 0, insetInlineEnd: 0,
        width: 'min(620px, 96vw)', background: '#fff', zIndex: 201,
        boxShadow: '-20px 0 60px -20px rgba(20,19,15,0.2)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '22px 24px', borderBottom: '1px solid var(--line)', background: p.bg,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 10.5, fontWeight: 600, padding: '2px 9px', borderRadius: 999,
                background: '#fff', color: p.fg,
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot }} />
                {p.label}
              </span>
              {cat && <span style={{ fontSize: 11, color: cat.accent, fontWeight: 500 }}>{cat.name}</span>}
            </div>
            <h2 style={{ margin: 0, fontSize: 23, fontWeight: 600, letterSpacing: -0.3 }}>{client.name}</h2>
            {client.contactName && (
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-2)' }}>
                {client.contactName}{client.contactRole ? ` · ${client.contactRole}` : ''}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 10, background: '#fff',
            border: '1px solid var(--line)', fontSize: 16, color: 'var(--ink-2)', cursor: 'pointer',
          }}>×</button>
        </div>

        {/* Drawer tabs */}
        <div style={{
          display: 'flex', gap: 2, padding: '0 16px', borderBottom: '1px solid var(--line)',
          background: '#fff', overflowX: 'auto', flexShrink: 0,
        }}>
          {[
            { id: 'overview',   label: 'نظرة عامة' },
            { id: 'deal',       label: 'الصفقة', badge: dealValue ? window.spFmtCurrency(dealValue) : null },
            { id: 'activity',   label: 'النشاط', badge: (client.activities || []).length || null },
            { id: 'tasks',      label: 'المهام',  badge: (client.tasks || []).filter(t => !t.done).length || null },
            { id: 'contacts',   label: 'الجهات', badge: (client.contacts || []).length || null },
            { id: 'needs',      label: 'الاحتياج', badge: (client.communities || []).length || null },
          ].map(t => {
            const active = drawerTab === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setDrawerTab(t.id)} style={{
                padding: '12px 14px', background: 'transparent', border: 'none',
                borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
                fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                color: active ? 'var(--ink)' : 'var(--muted)', fontWeight: active ? 600 : 500,
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}>
                {t.label}
                {t.badge !== null && t.badge !== undefined && (
                  <span className="mono" style={{
                    fontSize: 9.5, padding: '1px 6px', borderRadius: 999,
                    background: active ? 'var(--ink)' : 'oklch(0.95 0.01 240)',
                    color: active ? '#fff' : 'var(--muted)',
                  }}>{t.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: drawerTab === 'overview' ? 24 : 0 }}>
        {drawerTab === 'deal' && (
          <div style={{ padding: 22 }}>
            {window.DealBox ? (
              <window.DealBox client={client} api={api} stages={window.UC_STAGES || []} tiers={window.UC_TIERS || []} />
            ) : <div style={{ color: 'var(--muted)' }}>تحميل…</div>}
          </div>
        )}
        {drawerTab === 'activity' && (
          <div style={{ padding: 22 }}>
            {window.ActivityTimeline ? (
              <window.ActivityTimeline client={client} api={api} types={window.UC_ACTIVITY_TYPES || []} />
            ) : <div style={{ color: 'var(--muted)' }}>تحميل…</div>}
          </div>
        )}
        {drawerTab === 'tasks' && (
          <div style={{ padding: 22 }}>
            {window.TasksList ? (
              <window.TasksList client={client} api={api} />
            ) : <div style={{ color: 'var(--muted)' }}>تحميل…</div>}
          </div>
        )}
        {drawerTab === 'contacts' && (
          <div style={{ padding: 22 }}>
            {window.ContactsList ? (
              <window.ContactsList client={client} api={api} />
            ) : <div style={{ color: 'var(--muted)' }}>تحميل…</div>}
          </div>
        )}
        {drawerTab === 'needs' && (
          <div style={{ padding: 24 }}>
            <Section label={`المجتمعات (${communities.length})`}>
              {communities.length === 0 ? (
                <div style={{ padding: 18, background: 'var(--warm)', borderRadius: 10, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                  لم يُسجّل مجتمع بعد — افتح المحرّر لإضافة مجتمعات.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {communities.map((com, i) => {
                    const pat = resolvePattern(com);
                    const traits = resolveTraits(com);
                    const hue = pat?.hue ?? 60;
                    // group traits by group label for hierarchy
                    const groups = new Map();
                    traits.forEach(t => {
                      const g = t.group || 'خصائص';
                      if (!groups.has(g)) groups.set(g, []);
                      groups.get(g).push(t);
                    });
                    return (
                      <div key={com.uid} style={{
                        border: '1px solid var(--line)', borderRadius: 12, padding: 14,
                        background: '#fff', overflow: 'hidden',
                      }}>
                        {/* Header row: index + name + pattern pill on the side */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div className="mono" style={{
                            width: 22, height: 22, borderRadius: 6,
                            background: 'oklch(0.96 0.005 240)', color: 'var(--muted)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 1,
                          }}>{i + 1}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.2,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {com.name || 'مجتمع'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                              {pat && (
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                                  background: `oklch(0.96 0.04 ${hue})`,
                                  color: `oklch(0.4 0.16 ${hue})`,
                                  border: `1px solid oklch(0.9 0.04 ${hue})`,
                                }}>
                                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: `oklch(0.55 0.18 ${hue})` }} />
                                  {pat.name || pat.id}
                                </span>
                              )}
                              {com.size && (
                                <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                                  · {com.size}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Traits section */}
                        {traits.length > 0 && (
                          <div style={{
                            marginTop: 12, paddingTop: 11,
                            borderTop: '1px dashed oklch(0.93 0.005 240)',
                          }}>
                            {Array.from(groups.entries()).map(([gName, items], gi) => (
                              <div key={gName} style={{ marginTop: gi === 0 ? 0 : 9 }}>
                                <div style={{
                                  fontSize: 9.5, color: 'var(--muted)',
                                  letterSpacing: 1.2, textTransform: 'uppercase',
                                  marginBottom: 5, fontWeight: 600,
                                }}>{gName}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {items.map(t => (
                                    <span key={t.id} title={t.desc || ''} style={{
                                      fontSize: 10.5, padding: '2px 9px', borderRadius: 6,
                                      background: 'oklch(0.97 0.005 240)',
                                      color: 'var(--ink-2)',
                                      fontWeight: 500,
                                    }}>{t.label || t.id}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {com.notes && (
                          <div style={{
                            marginTop: 10, paddingTop: 10,
                            borderTop: '1px dashed oklch(0.93 0.005 240)',
                            fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.7,
                          }}>{com.notes}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          </div>
        )}
        {drawerTab === 'overview' && (
        <React.Fragment>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
            <MiniStat label="مجتمعات" value={communities.length} />
            <MiniStat label="خصائص موصوفة" value={totalTraits} />
            <MiniStat label="أنماط مختلفة" value={patternsSet.size} />
          </div>

          <Section label="التواصل">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 14px', background: '#fbfaf7', borderRadius: 12, border: '1px solid var(--line)' }}>
              <Pair label="البريد" value={client.email || '—'} />
              <Pair label="الجوال" value={client.phone || '—'} />
              <Pair label="حجم الجهة" value={client.size || '—'} />
              <Pair label="مرحلة البيع" value={CL_STAGE_LABELS[client.stage] || '—'} />
              <Pair label="آخر تواصل" value={client.lastContact || '—'} />
            </div>
          </Section>

          {client.notes && (
            <Section label="ملاحظات">
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, padding: '12px 14px', background: 'oklch(0.98 0.015 60)', borderRadius: 10 }}>
                {client.notes}
              </div>
            </Section>
          )}

          <Section label={`المجتمعات (${communities.length})`}>
            {communities.length === 0 ? (
              <div style={{ padding: 18, background: 'var(--warm)', borderRadius: 10, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                لم يُسجّل مجتمع بعد
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {communities.map((com, i) => {
                  const pat = resolvePattern(com);
                  const cases = resolveCases(com);
                  const hue = pat?.hue ?? 60;
                  return (
                    <div key={com.uid} style={{
                      border: `1px solid oklch(0.94 0.02 ${hue})`, borderRadius: 12, padding: 14,
                      background: `oklch(0.995 0.008 ${hue})`,
                      borderInlineStart: `4px solid oklch(0.55 0.15 ${hue})`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 7,
                          background: `oklch(0.55 0.15 ${hue})`, color: '#fff',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 600,
                        }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{com.name || 'مجتمع'}</div>
                          <div style={{ fontSize: 11, marginTop: 2, color: 'var(--muted)', display: 'flex', gap: 8 }}>
                            {pat && <span style={{ color: `oklch(0.4 0.14 ${hue})` }}>{pat.icon} {pat.name}</span>}
                            {com.size && <span>· {com.size}</span>}
                          </div>
                        </div>
                      </div>

                      {cases.length > 0 && (
                        <div style={{ marginTop: 6 }}>
                          <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 6, letterSpacing: 1.2 }}>
                            حالات الاستخدام ({cases.length})
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                            {cases.map(c => (
                              <span key={c.uid} style={{
                                fontSize: 11, padding: '3px 9px', borderRadius: 999,
                                background: '#fff', color: 'var(--ink)',
                                border: `1px solid oklch(0.92 0.02 ${hue})`, fontWeight: 500,
                              }}>{c.name}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {com.notes && (
                        <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.7, padding: '8px 10px', background: '#fff', borderRadius: 8 }}>
                          {com.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </React.Fragment>
        )}
        </div>

        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--line)', background: '#fbfaf7' }}>
          <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 }}>
            تصدير التقرير
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <button onClick={exportSalesPDF} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
              padding: '12px 14px', background: 'var(--ink)', color: '#fff',
              border: 'none', borderRadius: 12, cursor: 'pointer', textAlign: 'start', fontFamily: 'inherit',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <span style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(255,255,255,0.15)', borderRadius: 999, letterSpacing: 1 }}>داخلي</span>
                <span>تقرير المبيعات</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                تقرير ملوّن قصير لفريق المبيعات
              </div>
            </button>
            <button onClick={() => setExportOpen(true)} disabled={communities.length === 0} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
              padding: '12px 14px', background: 'oklch(0.97 0.04 60)', color: 'var(--ink)',
              border: '1px solid oklch(0.88 0.06 60)', borderRadius: 12, textAlign: 'start', fontFamily: 'inherit',
              cursor: communities.length ? 'pointer' : 'not-allowed',
              opacity: communities.length ? 1 : 0.5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <span style={{ fontSize: 10, padding: '2px 7px', background: 'oklch(0.6 0.17 45)', color: '#fff', borderRadius: 999, letterSpacing: 1 }}>للعميل</span>
                <span>مقترح محور</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
                عرض ملوّن مختصر — اختر مجتمعات للتفصيل
              </div>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <AxBtn onClick={onEdit} icon="✎">تعديل</AxBtn>
            <AxBtn kind="outline" icon="⇗" onClick={() => {
              const link = copyShareLink([]);
              if (link) {
                // small inline toast via state would be ideal, but keep it simple
                window.alert('تم نسخ الرابط — يمكنك إرساله للعميل مباشرة.\n\nالرابط يفتح المقترح في المتصفح بنفس التصميم.');
              }
            }}>نسخ رابط المشاركة</AxBtn>
            <AxBtn kind="outline" icon="{}" onClick={exportJSON}>JSON</AxBtn>
          </div>
        </div>
      </aside>

      {exportOpen && (
        <ExportClientDialog
          communities={communities}
          resolvePattern={resolvePattern}
          resolveCases={resolveCases}
          onClose={() => setExportOpen(false)}
          onExport={(ids, opts) => { setExportOpen(false); exportClientPDF(ids, opts); }}
        />
      )}
    </>
  );
}

// =========================================================
// Export dialog — user chooses which communities to detail
// =========================================================
function ExportClientDialog({ communities, resolvePattern, resolveCases, onClose, onExport }) {
  const [selected, setSelected] = useStateCL(() => {
    // default: first 2 communities
    return communities.slice(0, Math.min(2, communities.length)).map(c => c.uid);
  });
  const [includeInvestment, setIncludeInvestment] = useStateCL(false);

  const toggle = (uid) => {
    setSelected(s => s.includes(uid) ? s.filter(x => x !== uid) : (s.length >= 3 ? s : [...s, uid]));
  };

  // cover + problem + solution + matrix + details + roadmap + (investment?) + next
  const totalSlides = 6 + selected.length + (includeInvestment ? 1 : 0) + 1;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.55)', zIndex: 310, backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(620px, 94vw)', maxHeight: '86vh', zIndex: 311,
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', background: 'oklch(0.98 0.025 60)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10.5, letterSpacing: 2, color: 'oklch(0.5 0.14 45)', fontWeight: 600, marginBottom: 4 }}>
                مقترح للعميل — تخصيص
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>اختر مجتمعاً أو 3 للتفصيل</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.6, maxWidth: 460 }}>
                شريحة "المجتمعات المتوافقة" ستعرض كل مجتمعاتك، ثم شريحة تفصيلية لكل مجتمع محدّد هنا.
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid var(--line)',
              background: '#fff', fontSize: 15, cursor: 'pointer',
            }}>×</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.5, fontWeight: 600, textTransform: 'uppercase', marginBottom: 10 }}>
            اختر 1–3 مجتمعات للتفصيل ({selected.length} / 3)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {communities.map((com, i) => {
              const pat = resolvePattern(com);
              const cases = resolveCases(com);
              const hue = pat?.hue ?? 60;
              const isSel = selected.includes(com.uid);
              const disabled = !isSel && selected.length >= 3;
              return (
                <button key={com.uid} type="button" onClick={() => toggle(com.uid)} disabled={disabled}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    border: isSel ? `2px solid oklch(0.55 0.15 ${hue})` : '1px solid var(--line)',
                    background: isSel ? `oklch(0.97 0.03 ${hue})` : '#fff',
                    borderRadius: 12, textAlign: 'start', fontFamily: 'inherit',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                  }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6,
                    border: isSel ? 'none' : '1.5px solid var(--line)',
                    background: isSel ? `oklch(0.55 0.15 ${hue})` : '#fff',
                    color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{isSel ? '✓' : ''}</span>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, background: `oklch(0.55 0.15 ${hue})`, color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{com.name || 'مجتمع'}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {pat ? `${pat.icon} ${pat.name}` : 'لا نمط'} · {cases.length} حالة
                      {com.size ? ` · ${com.size}` : ''}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--line)', background: '#fbfaf7' }}>
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
            padding: '10px 12px', background: '#fff', border: `1px solid ${includeInvestment ? 'oklch(0.8 0.12 30)' : 'var(--line)'}`,
            borderRadius: 10,
          }}>
            <input type="checkbox" checked={includeInvestment}
              onChange={e => setIncludeInvestment(e.target.checked)}
              style={{ margin: '3px 0 0', accentColor: 'oklch(0.55 0.18 30)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>إظهار شريحة الاستثمار</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.6 }}>
                افتراضيّاً مخفيّة — فعّلها فقط إن كان المقترح يتضمّن ثمناً جاهزاً للعرض.
                الباقات الثلاث (البداية، النموّ، الشراكة) تظهر مع توصية تلقائية بناءً على عدد المجتمعات.
              </div>
            </div>
          </label>
        </div>

        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--line)', background: '#fbfaf7',
          display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, fontSize: 12, color: 'var(--muted)' }}>
            سيُنتج <strong style={{ color: 'var(--ink)' }}>{totalSlides} شرائح</strong>
          </div>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
          <AxBtn onClick={() => onExport(selected, { includeInvestment })} disabled={selected.length === 0}>تصدير العرض</AxBtn>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  AtlasClientsTab, ClientEditor, ClientDetailDrawer, CL_PRIORITY_COLORS, CL_STAGE_LABELS,
  normalizeCommunity,
});
