// Sales Leads — top-of-funnel discovery & qualification.
// Manual add · Bulk paste import · Discovery Playbooks per sector · Promote to client.
// All state via useAtlasStore. Mirrors visual language of sales-pipeline.jsx.

const { useState: useStateLD, useMemo: useMemoLD, useEffect: useEffectLD } = React;

// ------- helpers -------
function ldDaysSince(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d)) return null;
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  } catch (_) { return null; }
}

function ldRelativeAr(iso) {
  const days = ldDaysSince(iso);
  if (days === null) return '—';
  if (days === 0) return 'اليوم';
  if (days === 1) return 'أمس';
  if (days < 7) return `قبل ${days} أيام`;
  if (days < 30) return `قبل ${Math.floor(days/7)} أسابيع`;
  if (days < 365) return `قبل ${Math.floor(days/30)} شهر`;
  return `قبل ${Math.floor(days/365)} سنة`;
}

function ldStatusMeta(id) {
  return (window.UC_LEAD_STATUSES || []).find(s => s.id === id)
    || (window.UC_LEAD_STATUSES || [])[0];
}
function ldSourceMeta(id) {
  return (window.UC_LEAD_SOURCES || []).find(s => s.id === id)
    || { id: 'manual', label: 'يدوي', family: 'outbound', icon: '✎', hue: 220 };
}
function ldSectorMeta(catId, store) {
  return (store?.categories || []).find(c => c.id === catId);
}

// =========================================================
// Main tab
// =========================================================
function LeadsTab({ store, api }) {
  const leads = api.leads || [];
  const statuses = window.UC_LEAD_STATUSES || [];
  const sources  = window.UC_LEAD_SOURCES  || [];

  // Filter / view state
  const [search, setSearch]   = useStateLD('');
  const [statusF, setStatusF] = useStateLD('all');     // all | <id>
  const [familyF, setFamilyF] = useStateLD('all');     // all | outbound | inbound | partner
  const [sectorF, setSectorF] = useStateLD('all');     // all | <id>
  const [sortBy, setSortBy]   = useStateLD('score');   // score | recent | name

  // Modal state
  const [editorState, setEditorState] = useStateLD({ open: false, lead: null });
  const [bulkOpen, setBulkOpen] = useStateLD(false);
  const [pbOpen, setPbOpen] = useStateLD(false);
  const [engineOpen, setEngineOpen] = useStateLD(false);
  const [detailUid, setDetailUid] = useStateLD(null);
  const [promoteUid, setPromoteUid] = useStateLD(null);

  // Filter
  const filtered = useMemoLD(() => {
    const q = search.trim().toLowerCase();
    let arr = leads.filter(l => {
      if (statusF !== 'all' && l.status !== statusF) return false;
      if (sectorF !== 'all' && l.sector !== sectorF) return false;
      if (familyF !== 'all') {
        const sm = ldSourceMeta(l.source);
        if (sm.family !== familyF) return false;
      }
      if (q) {
        const hay = [l.name, l.contactName, l.email, l.phone, l.notes, l.website, ...(l.tags || [])]
          .join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sortBy === 'score')   arr.sort((a, b) => (b.score || 0) - (a.score || 0));
    if (sortBy === 'recent')  arr.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    if (sortBy === 'name')    arr.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ar'));
    return arr;
  }, [leads, search, statusF, familyF, sectorF, sortBy]);

  // KPIs
  const kpis = useMemoLD(() => {
    const open = leads.filter(l => l.status !== 'converted' && l.status !== 'disqualified');
    const qualified = leads.filter(l => l.status === 'qualified');
    const converted = leads.filter(l => l.status === 'converted');
    const total = leads.length;
    const conv = total ? Math.round((converted.length / total) * 100) : 0;
    const avgScore = open.length
      ? Math.round(open.reduce((s, l) => s + (l.score || 0), 0) / open.length)
      : 0;
    return { open: open.length, qualified: qualified.length, converted: converted.length, conv, avgScore };
  }, [leads]);

  // Source breakdown by family
  const familyBreak = useMemoLD(() => {
    const out = { outbound: 0, inbound: 0, partner: 0, automated: 0 };
    leads.forEach(l => {
      const sm = ldSourceMeta(l.source);
      if (sm.family) out[sm.family] = (out[sm.family] || 0) + 1;
    });
    return out;
  }, [leads]);

  const detail = leads.find(l => l.uid === detailUid);
  const promoteLead = leads.find(l => l.uid === promoteUid);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 40px 60px' }}>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        <LdKpi label="عملاء محتملون مفتوحون" value={kpis.open} suffix={`من ${leads.length}`} hue={220} />
        <LdKpi label="مؤهّلون جاهزون للتشخيص" value={kpis.qualified} hue={145} />
        <LdKpi label="تحوّلوا إلى عملاء" value={kpis.converted} hue={280} />
        <LdKpi label="معدل التحويل" value={kpis.conv + '%'} hue={45} />
        <LdKpi label="متوسط نقاط التأهيل" value={kpis.avgScore} hue={200} />
      </div>

      {/* Source family breakdown */}
      <div style={{
        background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
        padding: 14, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>توزيع المصادر</div>
          <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>كيف يصلنا العملاء المحتملون؟</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
          <LdFamilyBar label="استكشاف خارجي (نحن نبادر)" count={familyBreak.outbound} total={leads.length} hue={200} note="تواصل بارد · لينكدإن · فعاليات" />
          <LdFamilyBar label="استقطاب داخلي (يأتون إلينا)" count={familyBreak.inbound} total={leads.length} hue={145} note="موقع · محتوى · إعلانات" />
          <LdFamilyBar label="شراكات وإحالات" count={familyBreak.partner} total={leads.length} hue={280} note="عملاء · شركاء · موزعون" />
          <LdFamilyBar label="بوت استكشاف آلي" count={familyBreak.automated} total={leads.length} hue={190} note="بحث مجدول · إعلانات · لينكدإن" />
        </div>
      </div>

      {/* Action bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        marginBottom: 14,
      }}>
        <button
          onClick={() => setEditorState({ open: true, lead: null })}
          style={ldBtnPrimary()}
        >+ إضافة عميل محتمل</button>

        <button
          onClick={() => setBulkOpen(true)}
          style={ldBtnGhost()}
        >⇪ استيراد جماعي</button>

        <button
          onClick={() => setPbOpen(true)}
          style={ldBtnGhost(280)}
        >★ أدلّة الاستكشاف</button>

        <button
          onClick={() => setEngineOpen(true)}
          style={{
            ...ldBtnGhost(190),
            position: 'relative',
            paddingInlineEnd: 14,
          }}
        >
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: 'oklch(0.55 0.16 145)', marginInlineEnd: 6, verticalAlign: 'middle',
            boxShadow: '0 0 0 3px oklch(0.55 0.16 145 / 0.18)',
            animation: 'ldPulse 2s infinite',
          }} />
          ◎ بوت الاستكشاف الآلي
        </button>

        <div style={{ flex: 1 }} />

        <input
          placeholder="ابحث بالاسم، البريد، أو الوسوم…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line)',
            fontSize: 12, fontFamily: 'inherit', minWidth: 240, background: '#fff',
          }}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={ldSelectStyle()}>
          <option value="score">ترتيب: النقاط</option>
          <option value="recent">ترتيب: التحديث</option>
          <option value="name">ترتيب: الاسم</option>
        </select>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <LdChipGroup label="الحالة">
          <LdChip on={statusF === 'all'} onClick={() => setStatusF('all')} hue={220}>الكل · {leads.length}</LdChip>
          {statuses.map(s => {
            const n = leads.filter(l => l.status === s.id).length;
            if (n === 0 && s.id !== 'new') return null;
            return <LdChip key={s.id} on={statusF === s.id} onClick={() => setStatusF(s.id)} hue={s.hue}>{s.label} · {n}</LdChip>;
          })}
        </LdChipGroup>

        <LdChipGroup label="المصدر">
          <LdChip on={familyF === 'all'} onClick={() => setFamilyF('all')} hue={220}>الكل</LdChip>
          <LdChip on={familyF === 'outbound'} onClick={() => setFamilyF('outbound')} hue={200}>خارجي · {familyBreak.outbound}</LdChip>
          <LdChip on={familyF === 'inbound'} onClick={() => setFamilyF('inbound')} hue={145}>داخلي · {familyBreak.inbound}</LdChip>
          <LdChip on={familyF === 'partner'} onClick={() => setFamilyF('partner')} hue={280}>شراكات · {familyBreak.partner}</LdChip>
          <LdChip on={familyF === 'automated'} onClick={() => setFamilyF('automated')} hue={190}>◎ آلي · {familyBreak.automated}</LdChip>
        </LdChipGroup>

        <LdChipGroup label="القطاع">
          <LdChip on={sectorF === 'all'} onClick={() => setSectorF('all')} hue={220}>الكل</LdChip>
          {(store.categories || []).map(c => {
            const n = leads.filter(l => l.sector === c.id).length;
            if (n === 0) return null;
            return <LdChip key={c.id} on={sectorF === c.id} onClick={() => setSectorF(c.id)} hue={c.hue || 220}>{c.label} · {n}</LdChip>;
          })}
        </LdChipGroup>
      </div>

      {/* Lead list */}
      {filtered.length === 0 ? (
        <LdEmptyState
          onAdd={() => setEditorState({ open: true, lead: null })}
          onBulk={() => setBulkOpen(true)}
          onPlaybook={() => setPbOpen(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 10 }}>
          {filtered.map(l => (
            <LdLeadCard
              key={l.uid}
              lead={l}
              store={store}
              onOpen={() => setDetailUid(l.uid)}
              onPromote={() => setPromoteUid(l.uid)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {editorState.open && (
        <LdEditor
          lead={editorState.lead}
          store={store}
          onClose={() => setEditorState({ open: false, lead: null })}
          onSave={(payload) => {
            api.upsertLead(payload);
            setEditorState({ open: false, lead: null });
          }}
        />
      )}

      {bulkOpen && (
        <LdBulkImport
          store={store}
          onClose={() => setBulkOpen(false)}
          onSave={(rows) => {
            api.bulkAddLeads(rows);
            setBulkOpen(false);
          }}
        />
      )}

      {pbOpen && (
        <LdPlaybooksLibrary
          store={store}
          onClose={() => setPbOpen(false)}
          onUsePlaybook={(pb) => {
            // Pre-fill manual editor from playbook
            setPbOpen(false);
            setEditorState({
              open: true,
              lead: {
                sector: pb.sector,
                source: (pb.sources && pb.sources[0]) || 'cold-outreach',
                status: 'new',
                score: pb.expectedScore || 50,
                notes: `[دليل: ${pb.title}]\n\n${pb.outreach}`,
                tags: ['من-دليل'],
              },
            });
          }}
        />
      )}

      {engineOpen && (
        <LdEngineModal
          store={store}
          api={api}
          onClose={() => setEngineOpen(false)}
        />
      )}

      {detail && (
        <LdDetailDrawer
          lead={detail}
          store={store}
          api={api}
          onClose={() => setDetailUid(null)}
          onEdit={() => { setEditorState({ open: true, lead: detail }); setDetailUid(null); }}
          onPromote={() => { setPromoteUid(detail.uid); setDetailUid(null); }}
          onDelete={() => { api.deleteLead(detail.uid); setDetailUid(null); }}
        />
      )}

      {promoteLead && (
        <LdPromoteDialog
          lead={promoteLead}
          onClose={() => setPromoteUid(null)}
          onConfirm={(stage) => {
            const newClientUid = api.promoteLeadToClient(promoteLead.uid, { stage });
            setPromoteUid(null);
            // Also dispatch event so Pipeline tab can highlight if needed.
            if (newClientUid) {
              window.dispatchEvent(new CustomEvent('mhwar:lead-promoted', { detail: { leadUid: promoteLead.uid, clientUid: newClientUid } }));
            }
          }}
        />
      )}
    </div>
  );
}

// =========================================================
// KPI tile + family bar + chip primitives
// =========================================================
function LdKpi({ label, value, suffix, hue = 220 }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
      padding: '12px 14px',
      borderTop: `3px solid oklch(0.55 0.13 ${hue})`,
    }}>
      <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 0.4, marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5 }}>{value}</span>
        {suffix && <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{suffix}</span>}
      </div>
    </div>
  );
}

function LdFamilyBar({ label, count, total, hue, note }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{
      padding: '10px 12px', background: `oklch(0.985 0.012 ${hue})`,
      border: `1px solid oklch(0.92 0.04 ${hue})`, borderRadius: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: `oklch(0.35 0.16 ${hue})` }}>{label}</div>
        <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{count} · {pct}%</div>
      </div>
      <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: '#fff', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `oklch(0.55 0.15 ${hue})`, transition: 'width .3s' }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 5 }}>{note}</div>
    </div>
  );
}

function LdChipGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 10.5, color: 'var(--muted)', marginInlineEnd: 2 }}>{label}:</span>
      {children}
    </div>
  );
}
function LdChip({ on, onClick, hue = 220, children }) {
  return (
    <button onClick={onClick} type="button" style={{
      padding: '5px 10px', borderRadius: 999, fontFamily: 'inherit',
      background: on ? `oklch(0.96 0.05 ${hue})` : '#fff',
      border: on ? `1.5px solid oklch(0.55 0.13 ${hue})` : '1px solid var(--line)',
      color: on ? `oklch(0.32 0.16 ${hue})` : 'var(--ink-2)',
      fontSize: 11, fontWeight: 500, cursor: 'pointer',
    }}>{children}</button>
  );
}

function ldBtnPrimary() {
  return {
    padding: '9px 16px', borderRadius: 9, background: 'var(--ink)', color: '#fff',
    border: 'none', fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
    cursor: 'pointer', letterSpacing: 0.2,
  };
}
function ldBtnGhost(hue) {
  return {
    padding: '9px 14px', borderRadius: 9,
    background: hue ? `oklch(0.97 0.03 ${hue})` : '#fff',
    color: hue ? `oklch(0.35 0.16 ${hue})` : 'var(--ink-2)',
    border: hue ? `1px solid oklch(0.85 0.06 ${hue})` : '1px solid var(--line)',
    fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
    cursor: 'pointer',
  };
}
function ldSelectStyle() {
  return {
    padding: '7px 10px', borderRadius: 8, border: '1px solid var(--line)',
    background: '#fff', fontSize: 11.5, fontFamily: 'inherit', cursor: 'pointer',
  };
}

// Empty state
function LdEmptyState({ onAdd, onBulk, onPlaybook }) {
  return (
    <div style={{
      padding: '60px 24px', textAlign: 'center',
      background: '#fff', border: '1px dashed var(--line)', borderRadius: 14,
    }}>
      <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.4 }}>◇</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>لا توجد نتائج بهذه الفلاتر</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 18, maxWidth: 480, margin: '0 auto 18px' }}>
        ابدأ ببناء قمعك: أدخل عميلًا محتملًا يدويًا، استورد قائمة دفعة واحدة، أو استكشف من خلال أدلّة الاستكشاف الجاهزة.
      </div>
      <div style={{ display: 'inline-flex', gap: 8 }}>
        <button onClick={onAdd} style={ldBtnPrimary()}>+ إضافة يدوية</button>
        <button onClick={onBulk} style={ldBtnGhost()}>⇪ استيراد جماعي</button>
        <button onClick={onPlaybook} style={ldBtnGhost(280)}>★ أدلّة الاستكشاف</button>
      </div>
    </div>
  );
}

// =========================================================
// Lead card
// =========================================================
function LdLeadCard({ lead, store, onOpen, onPromote }) {
  const status = ldStatusMeta(lead.status);
  const source = ldSourceMeta(lead.source);
  const sector = ldSectorMeta(lead.sector, store);
  const score  = lead.score || 0;
  const isClosed = lead.status === 'converted' || lead.status === 'disqualified';

  return (
    <div onClick={onOpen} style={{
      background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
      padding: 14, cursor: 'pointer', transition: 'all .15s',
      opacity: isClosed ? 0.7 : 1,
      position: 'relative',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-3, #888)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Top row: status + source */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 9.5, fontWeight: 600,
          background: `oklch(0.94 0.06 ${status.hue})`, color: `oklch(0.32 0.16 ${status.hue})`,
        }}>{status.label}</span>
        <span title={source.label} style={{
          padding: '2px 7px', borderRadius: 4, fontSize: 9.5, fontWeight: 500,
          background: `oklch(0.97 0.025 ${source.hue})`, color: `oklch(0.4 0.13 ${source.hue})`,
          border: `1px solid oklch(0.9 0.04 ${source.hue})`,
        }}>{source.icon} {source.label}</span>
        {lead.discoveredBy && (
          <span title={`اكتُشف عبر: ${lead.platformFound || 'بوت آلي'}`} style={{
            padding: '2px 7px', borderRadius: 4, fontSize: 9.5, fontWeight: 600,
            background: 'oklch(0.95 0.05 190)', color: 'oklch(0.35 0.15 190)',
            border: '1px solid oklch(0.85 0.06 190)',
          }}>◎ آلي</span>
        )}
        <div style={{ flex: 1 }} />
        {/* Score circle */}
        <LdScoreBadge score={score} />
      </div>

      {/* Name */}
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 4 }}>{lead.name}</div>

      {/* Sector */}
      {sector && (
        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 8 }}>
          {sector.label}{lead.size ? ` · ${lead.size}` : ''}
        </div>
      )}

      {/* Contact line */}
      {(lead.contactName || lead.email || lead.phone) && (
        <div style={{
          padding: 8, background: 'oklch(0.985 0.003 240)', borderRadius: 7,
          fontSize: 10.5, color: 'var(--ink-2)', marginBottom: 8,
        }}>
          {lead.contactName && <div style={{ fontWeight: 500 }}>{lead.contactName}{lead.contactRole ? ` · ${lead.contactRole}` : ''}</div>}
          {lead.email && <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{lead.email}</div>}
          {lead.phone && !lead.email && <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{lead.phone}</div>}
        </div>
      )}

      {/* Tags */}
      {(lead.tags || []).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {lead.tags.slice(0, 4).map((t, i) => (
            <span key={i} style={{
              padding: '1.5px 6px', borderRadius: 3, fontSize: 9.5,
              background: '#f5f3ee', color: 'var(--muted)',
            }}>#{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 8, borderTop: '1px solid var(--line)', fontSize: 10, color: 'var(--muted)',
      }}>
        <span>تحديث: {ldRelativeAr(lead.updatedAt)}</span>
        {!isClosed && lead.status === 'qualified' && (
          <button onClick={(e) => { e.stopPropagation(); onPromote(); }} style={{
            padding: '4px 10px', borderRadius: 6, fontSize: 10.5, fontWeight: 600,
            background: 'oklch(0.55 0.16 145)', color: '#fff',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}>↗ تحويل لعميل</button>
        )}
        {lead.status === 'converted' && (
          <span style={{ color: 'oklch(0.4 0.16 280)', fontWeight: 600 }}>✓ تم تحويله</span>
        )}
      </div>
    </div>
  );
}

function LdScoreBadge({ score }) {
  const hue = score >= 70 ? 145 : score >= 40 ? 55 : 220;
  return (
    <div title={`نقاط التأهيل: ${score}/100`} style={{
      width: 36, height: 36, borderRadius: '50%',
      background: `conic-gradient(oklch(0.55 0.15 ${hue}) ${score * 3.6}deg, oklch(0.94 0.02 ${hue}) 0)`,
      display: 'grid', placeItems: 'center',
    }}>
      <div className="mono" style={{
        width: 28, height: 28, borderRadius: '50%', background: '#fff',
        display: 'grid', placeItems: 'center',
        fontSize: 11, fontWeight: 600, color: `oklch(0.32 0.18 ${hue})`,
      }}>{score}</div>
    </div>
  );
}

Object.assign(window, {
  LeadsTab,
  ldStatusMeta, ldSourceMeta, ldSectorMeta,
  ldDaysSince, ldRelativeAr,
  ldBtnPrimary, ldBtnGhost, ldSelectStyle,
});
