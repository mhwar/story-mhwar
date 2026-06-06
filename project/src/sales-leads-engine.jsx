// =================================================================
// SALES — Discovery Engine
// Automated lead-discovery bots with editable platforms, keywords,
// schedules, and a simulated "Run Now" experience.
// =================================================================

const { useState: useStateLE, useMemo: useMemoLE, useEffect: useEffectLE, useRef: useRefLE } = React;

// =========================================================
// MAIN MODAL — landing screen for the engine
// =========================================================
function LdEngineModal({ store, api, onClose }) {
  // 'list' | 'editor' | 'running' | 'history'
  const [view, setView] = useStateLE('list');
  const [editingAgent, setEditingAgent] = useStateLE(null);
  const [runningAgent, setRunningAgent] = useStateLE(null);

  const agents = store.discoveryAgents || [];
  const runs = store.agentRuns || [];

  const totalFound = agents.reduce((s, a) => s + (a.foundCount || 0), 0);
  const activeCount = agents.filter(a => a.active).length;
  const lastRun = runs[0];

  return (
    <div onClick={onClose} style={leOverlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fdfdfb', borderRadius: 16, width: '92vw', maxWidth: 1100,
        height: '90vh', maxHeight: 820, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--line)',
          background: `linear-gradient(135deg, oklch(0.97 0.02 190) 0%, oklch(0.99 0.01 200) 100%)`,
          display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          {/* Bot icon */}
          <div style={{
            width: 44, height: 44, borderRadius: 11, flexShrink: 0,
            background: 'linear-gradient(135deg, oklch(0.45 0.12 190), oklch(0.55 0.14 200))',
            color: '#fff', display: 'grid', placeItems: 'center',
            fontSize: 22, fontWeight: 600,
            boxShadow: '0 4px 14px oklch(0.45 0.12 190 / 0.35)',
          }}>◎</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>بوت الاستكشاف الآلي</h2>
              <span style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.06em' }}>
                MHWAR · DISCOVERY ENGINE
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55 }}>
              يبحث في المنصّات والمواقع التي تحدّدها، يجمع العملاء المحتملين تلقائيًا، ويضيفهم لقمع الاستكشاف.
              يمكنك تعديل المنصّات والكلمات والجدولة في أي وقت.
            </div>

            {/* Top stats */}
            <div style={{ display: 'flex', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
              <LeStat label="بوت نشط" value={activeCount} hint={`من ${agents.length}`} hue={145} />
              <LeStat label="عملاء اكتُشفوا" value={totalFound} hint="إجمالي" hue={190} />
              <LeStat label="عمليات تشغيل" value={runs.length} hint={lastRun ? leRel(lastRun.ranAt) : '—'} hue={220} />
            </div>
          </div>

          <button onClick={onClose} style={leCloseBtn}>✕</button>
        </div>

        {/* View tabs */}
        <div style={{
          padding: '0 22px',
          borderBottom: '1px solid var(--line)',
          background: '#fff',
          display: 'flex', gap: 4,
        }}>
          <LeTab on={view === 'list'} onClick={() => setView('list')} count={agents.length}>البوتات</LeTab>
          <LeTab on={view === 'history'} onClick={() => setView('history')} count={runs.length}>سجل التشغيل</LeTab>
          <div style={{ flex: 1 }} />
          {view === 'list' && (
            <button onClick={() => { setEditingAgent({}); setView('editor'); }} style={{
              margin: '8px 0', padding: '7px 14px', borderRadius: 8,
              background: 'oklch(0.45 0.12 190)', color: '#fff',
              border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>+ بوت جديد</button>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 22, background: '#faf9f6' }}>
          {view === 'list' && (
            <LeAgentsList
              agents={agents}
              api={api}
              onEdit={(a) => { setEditingAgent(a); setView('editor'); }}
              onRun={(a) => { setRunningAgent(a); setView('running'); }}
            />
          )}
          {view === 'editor' && (
            <LeAgentEditor
              agent={editingAgent}
              store={store}
              onCancel={() => { setEditingAgent(null); setView('list'); }}
              onSave={(a) => { api.upsertAgent(a); setEditingAgent(null); setView('list'); }}
            />
          )}
          {view === 'history' && (
            <LeHistoryList runs={runs} agents={agents} />
          )}
          {view === 'running' && runningAgent && (
            <LeRunOverlay
              agent={runningAgent}
              store={store}
              api={api}
              onDone={() => { setRunningAgent(null); setView('list'); }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes leScan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes lePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
        @keyframes leTick { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes leSlideIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

// =========================================================
// AGENTS LIST
// =========================================================
function LeAgentsList({ agents, api, onEdit, onRun }) {
  if (agents.length === 0) {
    return (
      <div style={{
        background: '#fff', border: '1px dashed var(--line)', borderRadius: 12,
        padding: 50, textAlign: 'center', color: 'var(--muted)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.4 }}>◎</div>
        <div style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>لا توجد بوتات بعد</div>
        <div style={{ fontSize: 11.5 }}>أنشئ بوتك الأول لبدء جمع العملاء المحتملين تلقائيًا.</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {agents.map(a => (
        <LeAgentCard key={a.uid} agent={a} api={api} onEdit={() => onEdit(a)} onRun={() => onRun(a)} />
      ))}
    </div>
  );
}

function LeAgentCard({ agent, api, onEdit, onRun }) {
  const platforms = agent.platforms || [];
  const sched = (window.UC_AGENT_SCHEDULES || []).find(s => s.id === agent.schedule) || { label: agent.schedule };
  const sectorMeta = (window.useAtlasStore ? null : null); // sector lookup happens via UC_… outside, but fine to skip here
  const last = agent.lastRunAt ? leRel(agent.lastRunAt) : 'لم يعمل بعد';
  const next = agent.active && agent.schedule !== 'manual'
    ? leNextRunHint(agent.lastRunAt, agent.schedule)
    : null;

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
      padding: 14, display: 'flex', alignItems: 'flex-start', gap: 12,
      opacity: agent.active ? 1 : 0.7,
    }}>
      {/* Status indicator */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: agent.active
          ? 'linear-gradient(135deg, oklch(0.55 0.16 145), oklch(0.5 0.14 165))'
          : 'oklch(0.92 0.01 240)',
        color: agent.active ? '#fff' : 'var(--muted)',
        display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 600,
        position: 'relative',
      }}>
        ◎
        {agent.active && (
          <span style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 10, height: 10, borderRadius: '50%',
            background: 'oklch(0.6 0.18 145)',
            border: '2px solid #fff',
            animation: 'lePulse 2s infinite',
          }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title + schedule */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{agent.name}</span>
          <span style={{
            padding: '1.5px 8px', borderRadius: 4, fontSize: 10,
            background: agent.active ? 'oklch(0.95 0.05 145)' : 'oklch(0.94 0.01 240)',
            color: agent.active ? 'oklch(0.4 0.16 145)' : 'var(--muted)',
            fontWeight: 500,
          }}>{sched.icon || ''} {sched.label}</span>
          {!agent.active && (
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>· مُعطّل</span>
          )}
        </div>

        {agent.description && (
          <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginBottom: 8, lineHeight: 1.5 }}>
            {agent.description}
          </div>
        )}

        {/* Platforms + keywords */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 4, letterSpacing: '0.04em' }}>المنصّات</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {platforms.map(p => <LePlatChip key={p} id={p} />)}
              {platforms.length === 0 && <span style={{ fontSize: 10.5, color: 'var(--muted)', fontStyle: 'italic' }}>لم تُحدَّد</span>}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 4, letterSpacing: '0.04em' }}>كلمات البحث</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(agent.keywords || []).slice(0, 6).map((k, i) => (
                <span key={i} style={{
                  padding: '1.5px 6px', borderRadius: 3, fontSize: 10,
                  background: '#f5f3ee', color: 'var(--ink-2)',
                }}>{k}</span>
              ))}
              {(agent.keywords || []).length > 6 && (
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>+{agent.keywords.length - 6}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap',
          paddingTop: 8, borderTop: '1px solid var(--line)',
          fontSize: 10.5, color: 'var(--muted)',
        }}>
          <span>عمليات: <strong style={{ color: 'var(--ink)' }}>{agent.runCount || 0}</strong></span>
          <span>عملاء: <strong style={{ color: 'oklch(0.4 0.16 145)' }}>{agent.foundCount || 0}</strong></span>
          <span>آخر تشغيل: <strong style={{ color: 'var(--ink)' }}>{last}</strong></span>
          {next && <span style={{ color: 'oklch(0.4 0.13 200)' }}>القادم: {next}</span>}
        </div>
      </div>

      {/* Actions column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignItems: 'flex-end' }}>
        <button onClick={onRun} style={{
          padding: '7px 14px', borderRadius: 7,
          background: 'oklch(0.45 0.12 190)', color: '#fff',
          border: 'none', fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit', whiteSpace: 'nowrap',
        }}>▶ شغّل الآن</button>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => api.toggleAgentActive(agent.uid)} title={agent.active ? 'إيقاف' : 'تفعيل'} style={leMiniBtn}>
            {agent.active ? '⏸' : '▶'}
          </button>
          <button onClick={onEdit} title="تعديل" style={leMiniBtn}>✎</button>
          <button onClick={() => { if (confirm(`حذف البوت «${agent.name}»؟`)) api.deleteAgent(agent.uid); }} title="حذف" style={{ ...leMiniBtn, color: 'oklch(0.5 0.18 25)' }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// AGENT EDITOR
// =========================================================
function LeAgentEditor({ agent, store, onCancel, onSave }) {
  const isNew = !agent.uid;
  const [draft, setDraft] = useStateLE(() => ({
    uid: agent.uid || '',
    name: agent.name || '',
    description: agent.description || '',
    sector: agent.sector || '',
    platforms: agent.platforms || ['linkedin', 'google'],
    keywords: agent.keywords || [],
    excludedKeywords: agent.excludedKeywords || [],
    regions: agent.regions || ['SA'],
    schedule: agent.schedule || 'weekly',
    active: agent.active ?? true,
  }));
  const [kwDraft, setKwDraft] = useStateLE('');
  const [kwExcDraft, setKwExcDraft] = useStateLE('');
  const [customPlat, setCustomPlat] = useStateLE({ label: '', url: '' });

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  // Custom platforms (added inline by user) live in `platforms` as `custom:label`
  const allPlats = useMemoLE(() => {
    const builtin = window.UC_DISCOVERY_PLATFORMS || [];
    const customOnes = draft.platforms
      .filter(p => p.startsWith('custom:'))
      .map(p => ({
        id: p, label: p.slice(7), icon: '✦', hue: 240, kind: 'custom',
        desc: 'مصدر مخصص أضفته',
      }));
    return [...builtin.filter(p => p.id !== 'custom'), ...customOnes];
  }, [draft.platforms]);

  const togglePlatform = (id) => {
    const has = draft.platforms.includes(id);
    set('platforms', has ? draft.platforms.filter(p => p !== id) : [...draft.platforms, id]);
  };

  const addKeyword = () => {
    const v = kwDraft.trim();
    if (!v) return;
    if (draft.keywords.includes(v)) { setKwDraft(''); return; }
    set('keywords', [...draft.keywords, v]);
    setKwDraft('');
  };
  const removeKeyword = (k) => set('keywords', draft.keywords.filter(x => x !== k));

  const addExcluded = () => {
    const v = kwExcDraft.trim();
    if (!v) return;
    if (draft.excludedKeywords.includes(v)) { setKwExcDraft(''); return; }
    set('excludedKeywords', [...draft.excludedKeywords, v]);
    setKwExcDraft('');
  };
  const removeExcluded = (k) => set('excludedKeywords', draft.excludedKeywords.filter(x => x !== k));

  const addCustomPlat = () => {
    const v = customPlat.label.trim();
    if (!v) return;
    const id = `custom:${v}`;
    if (!draft.platforms.includes(id)) {
      set('platforms', [...draft.platforms, id]);
    }
    setCustomPlat({ label: '', url: '' });
  };

  const toggleRegion = (id) => {
    const has = draft.regions.includes(id);
    set('regions', has ? draft.regions.filter(r => r !== id) : [...draft.regions, id]);
  };

  const canSave = draft.name.trim() && draft.keywords.length > 0 && draft.platforms.length > 0;

  const sectors = (store.categories || []).map(c => ({ id: c.id, label: c.label }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
      {/* Main column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <LeSection title="الأساسيات" desc="ما الذي يبحث عنه هذا البوت؟">
          <LeFieldRow>
            <LeField label="اسم البوت" required>
              <input value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="مثال: جامعات سعودية تبحث عن خريجين"
                style={leInput} />
            </LeField>
            <LeField label="القطاع المستهدف">
              <select value={draft.sector} onChange={(e) => set('sector', e.target.value)} style={leInput}>
                <option value="">— عام —</option>
                {sectors.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </LeField>
          </LeFieldRow>
          <LeField label="وصف مختصر">
            <textarea value={draft.description} onChange={(e) => set('description', e.target.value)}
              placeholder="ما الإشارة التي يتتبّعها هذا البوت؟ (مثلاً: جامعات تُعلن عن لقاءات خرّيجين)"
              rows={2} style={{ ...leInput, resize: 'vertical', fontFamily: 'inherit' }} />
          </LeField>
        </LeSection>

        <LeSection title="المنصّات والمواقع" desc="أين يبحث البوت؟ يمكنك إضافة مصادر مخصصة (مواقع، RSS، صفحات شركات).">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 }}>
            {(window.UC_DISCOVERY_PLATFORMS || []).filter(p => p.id !== 'custom').map(p => (
              <LePlatformToggle key={p.id} plat={p}
                on={draft.platforms.includes(p.id)}
                onToggle={() => togglePlatform(p.id)} />
            ))}
          </div>

          {/* Custom platforms list */}
          {draft.platforms.filter(p => p.startsWith('custom:')).length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.04em' }}>مصادر مخصصة</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {draft.platforms.filter(p => p.startsWith('custom:')).map(p => (
                  <span key={p} style={{
                    padding: '4px 8px', borderRadius: 6, fontSize: 11,
                    background: 'oklch(0.96 0.02 240)', color: 'oklch(0.35 0.14 240)',
                    border: '1px solid oklch(0.88 0.04 240)',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}>
                    ✦ {p.slice(7)}
                    <button onClick={() => togglePlatform(p)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'oklch(0.5 0.16 25)', fontSize: 13, padding: 0, lineHeight: 1, fontFamily: 'inherit',
                    }}>✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add custom */}
          <div style={{ marginTop: 12, padding: 10, background: '#faf9f6', borderRadius: 8, border: '1px dashed var(--line)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 6 }}>+ أضف مصدرًا مخصصًا (موقع، صفحة، RSS)</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={customPlat.label} onChange={(e) => setCustomPlat({ ...customPlat, label: e.target.value })}
                placeholder="اسم المصدر (مثل: موقع التدريب الفني)"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomPlat(); } }}
                style={{ ...leInput, flex: 1 }} />
              <button onClick={addCustomPlat} disabled={!customPlat.label.trim()} style={{
                padding: '8px 14px', borderRadius: 7,
                background: customPlat.label.trim() ? 'oklch(0.4 0.13 240)' : 'oklch(0.92 0.01 240)',
                color: customPlat.label.trim() ? '#fff' : 'var(--muted)',
                border: 'none', fontSize: 11, fontWeight: 600,
                cursor: customPlat.label.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              }}>إضافة</button>
            </div>
          </div>
        </LeSection>

        <LeSection title="كلمات البحث" desc="ما الكلمات التي ستحدد ما إذا كانت النتيجة عميلًا محتملاً؟">
          <div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 6 }}>كلمات يجب أن تظهر</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={kwDraft} onChange={(e) => setKwDraft(e.target.value)}
                placeholder="مثال: عمادة الخريجين, alumni director"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                style={{ ...leInput, flex: 1 }} />
              <button onClick={addKeyword} disabled={!kwDraft.trim()} style={leAddBtn(190)}>إضافة</button>
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
              {draft.keywords.map(k => (
                <span key={k} style={leKwChipStyle(190)}>
                  {k}
                  <button onClick={() => removeKeyword(k)} style={leKwClose}>✕</button>
                </span>
              ))}
              {draft.keywords.length === 0 && <span style={{ fontSize: 10.5, color: 'var(--muted)', fontStyle: 'italic' }}>أضف كلمة واحدة على الأقل</span>}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 6 }}>كلمات استبعاد (اختياري)</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={kwExcDraft} onChange={(e) => setKwExcDraft(e.target.value)}
                placeholder="مثال: دورة قصيرة"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExcluded(); } }}
                style={{ ...leInput, flex: 1 }} />
              <button onClick={addExcluded} disabled={!kwExcDraft.trim()} style={leAddBtn(25)}>استبعاد</button>
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
              {draft.excludedKeywords.map(k => (
                <span key={k} style={leKwChipStyle(25)}>
                  ⊘ {k}
                  <button onClick={() => removeExcluded(k)} style={leKwClose}>✕</button>
                </span>
              ))}
            </div>
          </div>
        </LeSection>
      </div>

      {/* Side column: schedule + regions + actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 0 }}>
        <LeSection title="الجدولة" desc="متى يعمل البوت تلقائيًا؟">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(window.UC_AGENT_SCHEDULES || []).map(s => (
              <button key={s.id} onClick={() => set('schedule', s.id)} style={{
                padding: '8px 10px', borderRadius: 7,
                border: `1.5px solid ${draft.schedule === s.id ? 'oklch(0.45 0.12 190)' : 'var(--line)'}`,
                background: draft.schedule === s.id ? 'oklch(0.97 0.02 190)' : '#fff',
                color: draft.schedule === s.id ? 'oklch(0.3 0.14 190)' : 'var(--ink)',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'right',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                <span style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{s.desc}</div>
                </span>
                {draft.schedule === s.id && <span style={{ color: 'oklch(0.45 0.16 190)' }}>✓</span>}
              </button>
            ))}
          </div>
        </LeSection>

        <LeSection title="المناطق المستهدفة">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {(window.UC_REGIONS || []).map(r => (
              <button key={r.id} onClick={() => toggleRegion(r.id)} style={{
                padding: '5px 10px', borderRadius: 5, fontSize: 11,
                border: `1.5px solid ${draft.regions.includes(r.id) ? 'oklch(0.4 0.13 240)' : 'var(--line)'}`,
                background: draft.regions.includes(r.id) ? 'oklch(0.97 0.02 240)' : '#fff',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{r.flag} {r.label}</button>
            ))}
          </div>
        </LeSection>

        <LeSection title="الحالة">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)}
              style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 12 }}>البوت مفعّل (يعمل تلقائيًا حسب الجدول)</span>
          </label>
        </LeSection>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '10px', borderRadius: 8,
            background: '#fff', border: '1px solid var(--line)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>إلغاء</button>
          <button onClick={() => onSave(draft)} disabled={!canSave} style={{
            flex: 1, padding: '10px', borderRadius: 8,
            background: canSave ? 'oklch(0.45 0.12 190)' : 'oklch(0.92 0.01 240)',
            color: canSave ? '#fff' : 'var(--muted)',
            border: 'none', fontSize: 12, fontWeight: 600,
            cursor: canSave ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
          }}>{isNew ? 'إنشاء البوت' : 'حفظ التغييرات'}</button>
        </div>

        {!canSave && (
          <div style={{ fontSize: 10.5, color: 'oklch(0.5 0.16 25)', textAlign: 'center' }}>
            لإكمال الحفظ: اسم + منصّة واحدة + كلمة بحث واحدة على الأقل
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// RUN OVERLAY — simulated discovery in progress
// =========================================================
function LeRunOverlay({ agent, store, api, onDone }) {
  // 'scanning' | 'collecting' | 'review'
  const [phase, setPhase] = useStateLE('scanning');
  const [platStates, setPlatStates] = useStateLE(() =>
    (agent.platforms || []).map(p => ({ id: p, status: 'queued', count: 0, log: [] }))
  );
  const [foundLeads, setFoundLeads] = useStateLE([]);
  const [tickIdx, setTickIdx] = useStateLE(0);
  const startedAt = useRefLE(Date.now());

  // Simulate platform-by-platform scanning
  useEffectLE(() => {
    if (phase !== 'scanning') return;
    if (tickIdx >= platStates.length) {
      // All platforms scanned — gather leads & move to review
      const allLeads = [];
      platStates.forEach(p => {
        const pool = leMockPool(agent, p.id);
        const n = p.count;
        for (let i = 0; i < n; i++) {
          if (pool[i]) allLeads.push({ ...pool[i], platform: p.id });
        }
      });
      setFoundLeads(allLeads);
      setPhase('review');
      return;
    }

    const platId = platStates[tickIdx].id;
    const delay = 700 + Math.random() * 800;

    // Mark scanning
    setPlatStates(ps => ps.map((p, i) => i === tickIdx ? { ...p, status: 'scanning' } : p));

    const t = setTimeout(() => {
      // Decide how many "found"
      const found = Math.floor(Math.random() * 3) + (agent.keywords.length >= 3 ? 1 : 0);
      const log = leScanLog(platId, agent);
      setPlatStates(ps => ps.map((p, i) => i === tickIdx ? { ...p, status: 'done', count: found, log } : p));
      setTickIdx(tickIdx + 1);
    }, delay);

    return () => clearTimeout(t);
  }, [phase, tickIdx]);

  const totalFound = platStates.reduce((s, p) => s + p.count, 0);
  const completed = platStates.filter(p => p.status === 'done').length;
  const progress = platStates.length === 0 ? 0 : Math.round(100 * completed / platStates.length);

  const confirmAdd = () => {
    const duration = Math.round((Date.now() - startedAt.current) / 1000);
    api.applyAgentRun(agent.uid, {
      leads: foundLeads,
      duration,
      platforms: agent.platforms,
      keywords: agent.keywords,
    });
    onDone();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header status */}
      <div style={{
        background: 'linear-gradient(135deg, oklch(0.97 0.02 190), oklch(0.99 0.01 200))',
        border: '1px solid oklch(0.88 0.04 190)',
        borderRadius: 12, padding: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: phase === 'review' ? 'oklch(0.55 0.16 145)' : 'oklch(0.45 0.12 190)',
            color: '#fff', display: 'grid', placeItems: 'center', fontSize: 20,
          }}>{phase === 'review' ? '✓' : '◎'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {phase === 'review'
                ? `اكتمل البحث · عُثر على ${totalFound} عميل محتمل`
                : `يبحث: ${agent.name}`}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {phase === 'scanning'
                ? `يفحص ${agent.platforms.length} منصّة بكلمات: ${(agent.keywords || []).slice(0, 3).join('، ')}${agent.keywords.length > 3 ? '…' : ''}`
                : 'راجع النتائج قبل إضافتها لقمع العملاء المحتملين.'}
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: phase === 'review' ? 'oklch(0.4 0.16 145)' : 'oklch(0.4 0.12 190)' }}>
            {phase === 'review' ? '✓' : `${progress}%`}
          </div>
        </div>

        {/* Progress bar */}
        {phase === 'scanning' && (
          <div style={{ height: 6, background: 'oklch(0.95 0.02 190)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: 'linear-gradient(90deg, oklch(0.55 0.14 190), oklch(0.6 0.16 200))',
              transition: 'width 0.4s ease',
            }} />
          </div>
        )}
      </div>

      {/* Platform scan list */}
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, letterSpacing: '0.04em' }}>سجل البحث</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {platStates.map((p) => (
            <LePlatScanRow key={p.id} state={p} />
          ))}
        </div>
      </div>

      {/* Review found leads */}
      {phase === 'review' && (
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>العملاء المحتملون المُكتشفون</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>سيُضافون لقائمة العملاء المحتملين بحالة «جديد»</div>
          </div>
          {foundLeads.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
              لم يجد البوت نتائج هذه الجولة. جرّب توسيع الكلمات أو إضافة منصّات.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {foundLeads.map((l, i) => <LeFoundLeadRow key={i} lead={l} />)}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={onDone} style={{
              flex: 1, padding: '10px', borderRadius: 8,
              background: '#fff', border: '1px solid var(--line)',
              fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>تجاهل</button>
            <button onClick={confirmAdd} disabled={foundLeads.length === 0} style={{
              flex: 2, padding: '10px', borderRadius: 8,
              background: foundLeads.length > 0 ? 'oklch(0.55 0.16 145)' : 'oklch(0.92 0.01 240)',
              color: foundLeads.length > 0 ? '#fff' : 'var(--muted)',
              border: 'none', fontSize: 12, fontWeight: 600,
              cursor: foundLeads.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
            }}>+ أضِف {foundLeads.length} للقائمة</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LePlatScanRow({ state }) {
  const meta = (window.UC_DISCOVERY_PLATFORMS || []).find(p => p.id === state.id) || {
    label: state.id.startsWith('custom:') ? state.id.slice(7) : state.id, icon: '✦', hue: 240,
  };

  const statusColor = state.status === 'done' ? 145 : state.status === 'scanning' ? 190 : 240;

  return (
    <div style={{
      padding: '10px 12px', borderRadius: 8,
      border: `1px solid oklch(0.92 0.02 ${statusColor})`,
      background: state.status === 'scanning' ? 'oklch(0.99 0.01 190)' : '#fff',
      display: 'flex', alignItems: 'center', gap: 10,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Scanning shimmer */}
      {state.status === 'scanning' && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent 0%, oklch(0.95 0.04 190 / 0.5) 50%, transparent 100%)',
          animation: 'leScan 1.4s infinite linear',
        }} />
      )}

      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background: `oklch(0.95 0.04 ${meta.hue})`, color: `oklch(0.35 0.14 ${meta.hue})`,
        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
        flexShrink: 0,
      }}>{meta.icon}</div>

      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{meta.label}</div>
        {state.status === 'queued' && <div style={{ fontSize: 10, color: 'var(--muted)' }}>في قائمة الانتظار…</div>}
        {state.status === 'scanning' && <div style={{ fontSize: 10, color: 'oklch(0.4 0.13 190)' }}>جاري الفحص…</div>}
        {state.status === 'done' && state.log[0] && (
          <div style={{ fontSize: 10, color: 'var(--muted)' }} className="mono">{state.log[0]}</div>
        )}
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
        {state.status === 'done' && (
          <span style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
            background: state.count > 0 ? 'oklch(0.95 0.05 145)' : 'oklch(0.95 0.01 240)',
            color: state.count > 0 ? 'oklch(0.4 0.16 145)' : 'var(--muted)',
            animation: 'leTick 0.3s ease',
          }}>
            {state.count > 0 ? `+${state.count} نتيجة` : 'لا نتائج'}
          </span>
        )}
        {state.status === 'scanning' && (
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            border: '2px solid oklch(0.92 0.02 190)',
            borderTopColor: 'oklch(0.45 0.12 190)',
            animation: 'leSpin 0.7s linear infinite',
          }} />
        )}
      </div>

      <style>{`@keyframes leSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function LeFoundLeadRow({ lead }) {
  const platMeta = (window.UC_DISCOVERY_PLATFORMS || []).find(p => p.id === lead.platform);
  const platLabel = platMeta?.label || (lead.platform?.startsWith('custom:') ? lead.platform.slice(7) : lead.platform) || '—';
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 7, background: '#faf9f6',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'leSlideIn 0.3s ease',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: 'oklch(0.95 0.04 190)', color: 'oklch(0.4 0.14 190)',
        display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700,
        flexShrink: 0,
      }}>◎</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{lead.name}</div>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>
          {lead.contactName ? `${lead.contactName} · ` : ''}عبر <strong>{platLabel}</strong>
          {lead.matchedKeyword ? ` · «${lead.matchedKeyword}»` : ''}
        </div>
      </div>
      <span style={{
        padding: '1.5px 7px', borderRadius: 3, fontSize: 9.5, fontWeight: 600,
        background: lead.score >= 70 ? 'oklch(0.95 0.05 145)' : lead.score >= 40 ? 'oklch(0.95 0.06 55)' : 'oklch(0.95 0.04 220)',
        color: lead.score >= 70 ? 'oklch(0.4 0.16 145)' : lead.score >= 40 ? 'oklch(0.4 0.16 55)' : 'oklch(0.4 0.14 220)',
      }}>{lead.score}</span>
    </div>
  );
}

// =========================================================
// HISTORY
// =========================================================
function LeHistoryList({ runs, agents }) {
  if (runs.length === 0) {
    return (
      <div style={{
        background: '#fff', border: '1px dashed var(--line)', borderRadius: 12,
        padding: 50, textAlign: 'center', color: 'var(--muted)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.4 }}>◔</div>
        <div style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 4 }}>لا توجد عمليات تشغيل بعد</div>
        <div style={{ fontSize: 11.5 }}>سيظهر هنا سجل كل تشغيل لكل بوت — مع المنصّات والكلمات والنتائج.</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {runs.map(r => (
        <div key={r.uid} style={{
          background: '#fff', border: '1px solid var(--line)', borderRadius: 10,
          padding: 12, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: r.leadsFound > 0 ? 'oklch(0.95 0.05 145)' : 'oklch(0.96 0.01 240)',
            color: r.leadsFound > 0 ? 'oklch(0.4 0.16 145)' : 'var(--muted)',
            display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0,
          }}>{r.leadsFound > 0 ? `+${r.leadsFound}` : '0'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.agentName}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>
              {leRel(r.ranAt)} · {r.platforms.length} منصّة · {r.keywords.length} كلمة بحث
              {r.duration ? ` · ${r.duration}ث` : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =========================================================
// SUB-COMPONENTS
// =========================================================
function LeStat({ label, value, hint, hue }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 2 }}>
        <span style={{
          fontSize: 22, fontWeight: 700, color: `oklch(0.35 0.14 ${hue})`,
          unicodeBidi: 'plaintext', fontFeatureSettings: '"tnum"',
        }}>{value}</span>
        <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{hint}</span>
      </div>
    </div>
  );
}

function LeTab({ on, onClick, count, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 14px', background: 'none', border: 'none',
      borderBottom: `2px solid ${on ? 'oklch(0.45 0.12 190)' : 'transparent'}`,
      color: on ? 'oklch(0.3 0.14 190)' : 'var(--muted)',
      fontSize: 12, fontWeight: on ? 600 : 500,
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {children}
      {count !== undefined && (
        <span style={{
          padding: '0 6px', borderRadius: 99, fontSize: 9.5,
          background: on ? 'oklch(0.94 0.04 190)' : 'oklch(0.95 0.005 240)',
          color: on ? 'oklch(0.35 0.14 190)' : 'var(--muted)',
        }}>{count}</span>
      )}
    </button>
  );
}

function LePlatChip({ id }) {
  const isCustom = id.startsWith('custom:');
  const meta = isCustom
    ? { label: id.slice(7), icon: '✦', hue: 240 }
    : (window.UC_DISCOVERY_PLATFORMS || []).find(p => p.id === id) || { label: id, icon: '·', hue: 240 };
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 500,
      background: `oklch(0.96 0.03 ${meta.hue})`, color: `oklch(0.38 0.13 ${meta.hue})`,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <span style={{ fontWeight: 700 }}>{meta.icon}</span> {meta.label}
    </span>
  );
}

function LePlatformToggle({ plat, on, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      padding: '10px', borderRadius: 8, textAlign: 'right',
      border: `1.5px solid ${on ? `oklch(0.45 0.12 ${plat.hue})` : 'var(--line)'}`,
      background: on ? `oklch(0.98 0.015 ${plat.hue})` : '#fff',
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: 9,
      transition: 'all 0.15s',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: `oklch(${on ? '0.4' : '0.94'} ${on ? '0.13' : '0.03'} ${plat.hue})`,
        color: on ? '#fff' : `oklch(0.4 0.13 ${plat.hue})`,
        display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
      }}>{plat.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: on ? `oklch(0.3 0.14 ${plat.hue})` : 'var(--ink)' }}>{plat.label}</div>
        <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plat.desc}</div>
      </div>
      <span style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${on ? `oklch(0.45 0.12 ${plat.hue})` : 'var(--line)'}`,
        background: on ? `oklch(0.45 0.12 ${plat.hue})` : '#fff',
        color: '#fff', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700,
      }}>{on ? '✓' : ''}</span>
    </button>
  );
}

function LeSection({ title, desc, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: 14 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{title}</div>
        {desc && <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2, lineHeight: 1.5 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function LeFieldRow({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>{children}</div>;
}
function LeField({ label, required, children }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 4 }}>
        {label} {required && <span style={{ color: 'oklch(0.5 0.16 25)' }}>*</span>}
      </div>
      {children}
    </div>
  );
}

// =========================================================
// HELPERS — mocked discovery
// =========================================================
function leRel(iso) {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'الآن';
  if (m < 60) return `قبل ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} س`;
  const d = Math.floor(h / 24);
  if (d < 7) return `قبل ${d} يوم`;
  return `قبل ${Math.floor(d / 7)} أ`;
}

function leNextRunHint(lastRunAt, schedule) {
  const map = { hourly: 'خلال ساعة', daily: 'غدًا', weekly: 'الأسبوع القادم', biweekly: 'بعد أسبوعين', monthly: 'الشهر القادم' };
  return map[schedule] || null;
}

function leScanLog(platId, agent) {
  const k = (agent.keywords || [])[0] || '—';
  const map = {
    linkedin: [`بحث: "${k}" · موقع السعودية · فلتر: شركات`, `فحص ٢١ ملف · ٣ مطابقة قوية`],
    twitter: [`بحث: from:companies "${k}"`, `فحص ١٤ منشور حديث`],
    'meta-ads': [`Meta Ad Library · "${k}" · SA region`, `فحص ٨ معلنين نشطين`],
    'google-ads': [`Google Ads keyword overlap: "${k}"`, `فحص ١٢ صفحة هبوط`],
    google: [`بحث: "${k}" site:.sa`, `فحص ٢٠ نتيجة عضوية`],
    tiktok: [`بحث: #${k.replace(/\s/g, '')} · تجارية`, `فحص ٧ حسابات`],
    'news-rss': [`فحص ٤٠ خبر اليوم · فلترة بالكلمة`, `وُجدت ٣ مقالات ذات صلة`],
    'product-hunt': [`Daily launches · فلترة بالكلمة`, `فحص ١٢ منتج`],
    wamda: [`بحث الأخبار · "${k}"`, `فحص ١٥ مقالة`],
    bayt: [`بحث الإعلانات · "${k}"`, `فحص ٢٢ إعلان وظيفة`],
  };
  if (platId.startsWith('custom:')) return [`فحص ${platId.slice(7)} · "${k}"`];
  return map[platId] || [`فحص ${platId} · "${k}"`];
}

// Mock pool of plausible Saudi-context leads, varied by sector
function leMockPool(agent, platformId) {
  const sector = agent.sector;
  const k = (agent.keywords || [])[0] || '';

  const POOLS = {
    universities: [
      { name: 'جامعة الملك فيصل', contactName: 'د. سعد العتيبي', contactRole: 'عميد الخريجين', email: 'alumni@kfu.edu.sa', sector: 'universities', score: 78, size: '15K+ خرّيج' },
      { name: 'جامعة الإمام عبدالرحمن', contactName: 'أ. ندى الزهراني', contactRole: 'مدير علاقات الخريجين', email: 'alumni@iau.edu.sa', sector: 'universities', score: 72, size: '40K+ خرّيج' },
      { name: 'جامعة جدة', contactName: 'د. تركي الشهري', contactRole: 'وكيل التطوير', email: 'dev@uj.edu.sa', sector: 'universities', score: 65, size: '60K+ خرّيج' },
      { name: 'جامعة طيبة', contactName: '', contactRole: '', email: '', website: 'taibahu.edu.sa', sector: 'universities', score: 55 },
    ],
    'training-programs': [
      { name: 'Tuwaiq Academy', contactName: 'م. خالد الحربي', contactRole: 'مدير التواصل', email: 'partners@tuwaiq.edu.sa', sector: 'training-programs', score: 82, size: 'دفعات ٥٠٠+ متدرب' },
      { name: 'Misk Academy', contactName: '', contactRole: '', website: 'misk.org.sa/academy', sector: 'training-programs', score: 75 },
      { name: 'برنامج تمكين الرقمي', contactName: 'أ. ريم القحطاني', contactRole: 'منسق دفعات', email: 'reem@tamkeen.sa', sector: 'training-programs', score: 70 },
      { name: 'مهارات المستقبل', contactName: '', email: 'info@futureskills.sa', sector: 'training-programs', score: 60 },
      { name: 'كوديوب', contactName: 'م. عبدالله الزهراني', contactRole: 'COO', sector: 'training-programs', score: 68 },
    ],
    'real-estate': [
      { name: 'روشن - مشروع سدرة', contactName: '', contactRole: '', website: 'roshn.sa', sector: 'real-estate', score: 80, size: '٣٠٠٠ وحدة' },
      { name: 'مشروع الواجهة الجديدة', contactName: 'أ. منصور القحطاني', contactRole: 'مدير تجاري', sector: 'real-estate', score: 65 },
      { name: 'كومباوند المروج', contactName: '', email: 'sales@al-murooj.sa', sector: 'real-estate', score: 58, size: '١٢٠ فيلا' },
    ],
    government: [
      { name: 'هيئة تطوير محافظة جدة', contactName: '', website: 'jda.gov.sa', sector: 'government', score: 70 },
      { name: 'الأمانة - مبادرة الأحياء', contactName: 'أ. هند المالكي', contactRole: 'مدير برامج', sector: 'government', score: 68 },
    ],
    'tech-edu': [
      { name: 'منصة درّاك', contactName: '', email: 'team@durrak.com', sector: 'tech-edu', score: 72 },
      { name: 'Almentor MENA', contactName: 'م. أحمد الراشد', contactRole: 'B2B Lead', sector: 'tech-edu', score: 70 },
      { name: 'Coursera for Business KSA', contactName: '', sector: 'tech-edu', score: 65 },
    ],
    corporate: [
      { name: 'بنك الرياض - برنامج الخريجين', contactName: 'أ. خلود السعيد', contactRole: 'L&D Senior Manager', sector: 'corporate', score: 78 },
      { name: 'stc - أكاديمية المواهب', contactName: '', email: 'talent@stc.com.sa', sector: 'corporate', score: 75 },
      { name: 'أرامكو - برنامج الخرّيجين الجدد', contactName: '', sector: 'corporate', score: 80 },
    ],
  };

  const pool = (POOLS[sector] || POOLS['training-programs']).slice();
  // Shuffle a bit
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // Annotate matched keyword
  return pool.map(l => ({ ...l, matchedKeyword: k, source: 'auto-discovered' }));
}

// =========================================================
// STYLES
// =========================================================
const leOverlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(20, 20, 28, 0.65)',
  display: 'grid', placeItems: 'center', zIndex: 200, padding: 16,
  backdropFilter: 'blur(4px)',
};
const leCloseBtn = {
  width: 32, height: 32, borderRadius: 7, border: 'none', background: 'rgba(255,255,255,0.6)',
  cursor: 'pointer', fontSize: 14, color: 'var(--ink-2)', flexShrink: 0, fontFamily: 'inherit',
};
const leMiniBtn = {
  width: 28, height: 28, borderRadius: 6, border: '1px solid var(--line)',
  background: '#fff', cursor: 'pointer', fontSize: 11, color: 'var(--ink-2)',
  fontFamily: 'inherit', display: 'grid', placeItems: 'center',
};
const leInput = {
  width: '100%', padding: '8px 10px', borderRadius: 7,
  border: '1px solid var(--line)', background: '#fff',
  fontSize: 12, fontFamily: 'inherit', color: 'var(--ink)',
  boxSizing: 'border-box',
};
const leAddBtn = (hue) => ({
  padding: '8px 14px', borderRadius: 7,
  background: `oklch(0.4 0.13 ${hue})`, color: '#fff',
  border: 'none', fontSize: 11, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
});
const leKwChipStyle = (hue) => ({
  padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 500,
  background: `oklch(0.97 0.025 ${hue})`, color: `oklch(0.35 0.14 ${hue})`,
  border: `1px solid oklch(0.9 0.04 ${hue})`,
  display: 'inline-flex', alignItems: 'center', gap: 5,
});
const leKwClose = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 12, padding: 0, lineHeight: 1, fontFamily: 'inherit',
  color: 'oklch(0.5 0.16 25)',
};

// =========================================================
// EXPORT
// =========================================================
Object.assign(window, {
  LdEngineModal,
});
