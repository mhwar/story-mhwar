// Sales Leads — modals: Editor, Bulk Import, Playbooks Library, Detail Drawer, Promote Dialog.
// Companion to sales-leads.jsx — depends on its globals.

const { useState: useStateLE, useMemo: useMemoLE, useEffect: useEffectLE } = React;

// =========================================================
// Shared modal shell
// =========================================================
function LeModalShell({ title, subtitle, onClose, width = 640, children, footer }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,15,20,0.45)', zIndex: 80,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '60px 20px 40px', overflowY: 'auto',
      backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: width,
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.4)', overflow: 'hidden',
        direction: 'rtl', fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif',
      }}>
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="إغلاق" style={{
            border: 'none', background: 'transparent', fontSize: 20, color: 'var(--muted)', cursor: 'pointer',
          }}>×</button>
        </div>
        <div>{children}</div>
        {footer && (
          <div style={{
            padding: '14px 22px', borderTop: '1px solid var(--line)',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            background: 'oklch(0.99 0.003 240)',
          }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

// Field primitives
function LeField({ label, hint, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-2)', marginBottom: 4 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{hint}</div>}
    </label>
  );
}
const leInput = {
  width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--line)',
  fontSize: 12.5, fontFamily: 'inherit', background: '#fff',
};
const leTextarea = { ...leInput, minHeight: 70, resize: 'vertical', lineHeight: 1.6 };

// =========================================================
// LdEditor — manual add/edit
// =========================================================
function LdEditor({ lead, store, onClose, onSave }) {
  const isEdit = !!(lead && lead.uid);
  const [form, setForm] = useStateLE({
    uid: lead?.uid || '',
    name: lead?.name || '',
    sector: lead?.sector || (store.categories?.[0]?.id) || '',
    source: lead?.source || 'manual',
    status: lead?.status || 'new',
    score: lead?.score ?? 50,
    contactName: lead?.contactName || '',
    contactRole: lead?.contactRole || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    website: lead?.website || '',
    size: lead?.size || '',
    notes: lead?.notes || '',
    tags: (lead?.tags || []).join(', '),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const sources  = window.UC_LEAD_SOURCES  || [];
  const statuses = window.UC_LEAD_STATUSES || [];
  const sectors  = store.categories || [];

  const save = () => {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <LeModalShell
      title={isEdit ? 'تعديل عميل محتمل' : 'عميل محتمل جديد'}
      subtitle="أدخل بيانات العميل المحتمل لإضافته إلى قمع المبيعات"
      width={720}
      onClose={onClose}
      footer={<>
        <button onClick={onClose} style={ldBtnGhost()}>إلغاء</button>
        <button onClick={save} disabled={!form.name.trim()} style={{ ...ldBtnPrimary(), opacity: form.name.trim() ? 1 : 0.5 }}>
          {isEdit ? 'حفظ' : 'إضافة'}
        </button>
      </>}
    >
      <div style={{ padding: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
          <LeField label="اسم الجهة *" hint="اسم الشركة، البرنامج، أو المؤسسة">
            <input style={leInput} value={form.name} onChange={e => set('name', e.target.value)} placeholder="مثال: جامعة الملك سعود — عمادة الخريجين" />
          </LeField>
          <LeField label="حجم تقريبي" hint="عدد المستفيدين/الموظفين">
            <input style={leInput} value={form.size} onChange={e => set('size', e.target.value)} placeholder="2,400 متدرّب" />
          </LeField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <LeField label="القطاع">
            <select style={leInput} value={form.sector} onChange={e => set('sector', e.target.value)}>
              <option value="">— اختر —</option>
              {sectors.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </LeField>
          <LeField label="المصدر" hint="من أين وصلنا؟">
            <select style={leInput} value={form.source} onChange={e => set('source', e.target.value)}>
              <optgroup label="استكشاف خارجي">
                {sources.filter(s => s.family === 'outbound').map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </optgroup>
              <optgroup label="استقطاب داخلي">
                {sources.filter(s => s.family === 'inbound').map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </optgroup>
              <optgroup label="شراكات">
                {sources.filter(s => s.family === 'partner').map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </optgroup>
            </select>
          </LeField>
          <LeField label="الحالة">
            <select style={leInput} value={form.status} onChange={e => set('status', e.target.value)}>
              {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </LeField>
        </div>

        {/* Score slider */}
        <LeField label={`نقاط التأهيل: ${form.score}/100`} hint="كم هو مناسب لمنتجنا؟ (≥70 ساخن، 40–69 دافئ، <40 بارد)">
          <input type="range" min={0} max={100} step={5} value={form.score}
            onChange={e => set('score', parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--ink)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>
            <span>غير مناسب</span><span>محتمل</span><span>مناسب جدًا</span>
          </div>
        </LeField>

        {/* Contact info */}
        <div style={{ marginTop: 4, marginBottom: 8, fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: 0.3 }}>جهة التواصل</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <LeField label="الاسم">
            <input style={leInput} value={form.contactName} onChange={e => set('contactName', e.target.value)} placeholder="م. سارة العتيبي" />
          </LeField>
          <LeField label="المنصب">
            <input style={leInput} value={form.contactRole} onChange={e => set('contactRole', e.target.value)} placeholder="مديرة تطوير البرامج" />
          </LeField>
          <LeField label="البريد">
            <input style={leInput} value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@example.com" />
          </LeField>
          <LeField label="الجوال">
            <input style={leInput} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+9665XXXXXXXX" />
          </LeField>
          <LeField label="الموقع">
            <input style={leInput} value={form.website} onChange={e => set('website', e.target.value)} placeholder="example.com" />
          </LeField>
          <LeField label="وسوم" hint="افصلها بفواصل">
            <input style={leInput} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="خريجين، إيميل دوري" />
          </LeField>
        </div>

        <LeField label="ملاحظات" hint="ما الذي نعرفه عنه؟ ما إشارات الاهتمام؟">
          <textarea style={leTextarea} value={form.notes} onChange={e => set('notes', e.target.value)}
            placeholder="مصدر الإحالة، احتياج العميل، ملاحظات من اللقاء…" />
        </LeField>
      </div>
    </LeModalShell>
  );
}

// =========================================================
// LdBulkImport — paste rows
// =========================================================
function LdBulkImport({ store, onClose, onSave }) {
  const sectors = store.categories || [];
  const sources = window.UC_LEAD_SOURCES || [];

  const [text, setText]   = useStateLE('');
  const [defSector, setDefSector] = useStateLE('');
  const [defSource, setDefSource] = useStateLE('bulk-import');
  const [hasHeader, setHasHeader] = useStateLE(true);

  // Parse: split lines, split by tab/comma, infer columns by position:
  // name, contactName, email, phone, website, size, sector(id), source(id), notes
  const parsed = useMemoLE(() => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return [];
    const start = hasHeader ? 1 : 0;
    return lines.slice(start).map(line => {
      const cols = line.split(/\t|,/).map(c => c.trim());
      const sectorTry = cols[6] || defSector;
      const sectorMatch = sectors.find(s => s.id === sectorTry || s.label === sectorTry);
      const sourceTry = cols[7] || defSource;
      const sourceMatch = sources.find(s => s.id === sourceTry || s.label === sourceTry);
      return {
        name: cols[0] || '',
        contactName: cols[1] || '',
        email: cols[2] || '',
        phone: cols[3] || '',
        website: cols[4] || '',
        size: cols[5] || '',
        sector: sectorMatch?.id || defSector,
        source: sourceMatch?.id || defSource,
        notes: cols[8] || '',
        score: 50,
        status: 'new',
      };
    }).filter(r => r.name);
  }, [text, hasHeader, defSector, defSource]);

  const save = () => {
    if (!parsed.length) return;
    onSave(parsed);
  };

  return (
    <LeModalShell
      title="استيراد جماعي للعملاء المحتملين"
      subtitle="ألصق صفوفًا من Excel أو Sheets أو CSV (اسم، جهة تواصل، بريد، جوال، موقع، حجم، قطاع، مصدر، ملاحظات)"
      width={820}
      onClose={onClose}
      footer={<>
        <button onClick={onClose} style={ldBtnGhost()}>إلغاء</button>
        <button onClick={save} disabled={!parsed.length} style={{ ...ldBtnPrimary(), opacity: parsed.length ? 1 : 0.5 }}>
          استيراد {parsed.length} عميل محتمل
        </button>
      </>}
    >
      <div style={{ padding: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
          <LeField label="القطاع الافتراضي">
            <select style={leInput} value={defSector} onChange={e => setDefSector(e.target.value)}>
              <option value="">— بدون —</option>
              {sectors.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </LeField>
          <LeField label="المصدر الافتراضي">
            <select style={leInput} value={defSource} onChange={e => setDefSource(e.target.value)}>
              {sources.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </LeField>
          <LeField label="السطر الأول؟">
            <select style={leInput} value={hasHeader ? 'yes' : 'no'} onChange={e => setHasHeader(e.target.value === 'yes')}>
              <option value="yes">عناوين الأعمدة (تجاوزها)</option>
              <option value="no">يحتوي بيانات (لا تتجاوزه)</option>
            </select>
          </LeField>
        </div>

        <LeField label="الصق البيانات هنا" hint="استخدم Tab أو فاصلة (,) كفاصل للأعمدة. الترتيب: الاسم، جهة التواصل، البريد، الجوال، الموقع، الحجم، القطاع، المصدر، الملاحظات">
          <textarea
            style={{ ...leTextarea, minHeight: 180, fontFamily: 'monospace', fontSize: 12, direction: 'ltr', textAlign: 'left' }}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`اسم	جهة تواصل	بريد	جوال	موقع	حجم	قطاع	مصدر	ملاحظات\nجامعة المثال	د. أحمد	a@example.com	+9665...	example.edu.sa	30k	universities	linkedin	من ملتقى الخريجين`}
          />
        </LeField>

        {/* Preview */}
        {parsed.length > 0 && (
          <div style={{
            border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', marginTop: 8,
          }}>
            <div style={{ padding: '8px 12px', background: 'oklch(0.985 0.003 240)', fontSize: 11, fontWeight: 600 }}>
              معاينة · {parsed.length} صف صالح
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: '#fff', position: 'sticky', top: 0 }}>
                    <th style={leTh}>الاسم</th>
                    <th style={leTh}>جهة التواصل</th>
                    <th style={leTh}>القطاع</th>
                    <th style={leTh}>المصدر</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.slice(0, 10).map((r, i) => {
                    const sec = sectors.find(s => s.id === r.sector);
                    const src = sources.find(s => s.id === r.source);
                    return (
                      <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                        <td style={leTd}>{r.name}</td>
                        <td style={leTd}>{r.contactName || '—'}</td>
                        <td style={leTd}>{sec?.label || '—'}</td>
                        <td style={leTd}>{src?.label || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {parsed.length > 10 && (
                <div style={{ padding: '6px 12px', fontSize: 10, color: 'var(--muted)' }}>
                  + {parsed.length - 10} صف آخر…
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </LeModalShell>
  );
}
const leTh = { padding: '7px 10px', textAlign: 'right', fontSize: 10, fontWeight: 600, color: 'var(--muted)' };
const leTd = { padding: '6px 10px', fontSize: 11 };

// =========================================================
// LdPlaybooksLibrary — discovery strategies per sector
// =========================================================
function LdPlaybooksLibrary({ store, onClose, onUsePlaybook }) {
  const playbooks = window.UC_DISCOVERY_PLAYBOOKS || [];
  const sources   = window.UC_LEAD_SOURCES || [];
  const sectors   = store.categories || [];
  const [openId, setOpenId] = useStateLE(playbooks[0]?.id || null);

  return (
    <LeModalShell
      title="أدلّة استكشاف العملاء المحتملين"
      subtitle="استراتيجيات جاهزة لكل قطاع: من أين تبحث، ماذا تتأكد، وكيف تبدأ التواصل."
      width={920}
      onClose={onClose}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 480 }}>

        {/* Sidebar list */}
        <div style={{ borderInlineEnd: '1px solid var(--line)', background: 'oklch(0.985 0.003 240)' }}>
          {playbooks.map(pb => {
            const sector = sectors.find(s => s.id === pb.sector);
            const on = openId === pb.id;
            return (
              <button key={pb.id} onClick={() => setOpenId(pb.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'right',
                  padding: '12px 14px',
                  background: on ? '#fff' : 'transparent',
                  border: 'none',
                  borderInlineStart: on ? `3px solid oklch(0.55 0.15 ${pb.hue})` : '3px solid transparent',
                  cursor: 'pointer', fontFamily: 'inherit',
                  borderBottom: '1px solid var(--line)',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16, color: `oklch(0.5 0.16 ${pb.hue})` }}>{pb.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{pb.title}</span>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                  {sector?.label || pb.sector}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div style={{ padding: 22, overflowY: 'auto', maxHeight: 600 }}>
          {(() => {
            const pb = playbooks.find(p => p.id === openId);
            if (!pb) return <div style={{ color: 'var(--muted)', fontSize: 12 }}>اختر دليلًا لعرض تفاصيله</div>;
            const sector = sectors.find(s => s.id === pb.sector);

            return (
              <div>
                <div style={{
                  padding: 14, borderRadius: 10,
                  background: `oklch(0.97 0.025 ${pb.hue})`,
                  border: `1px solid oklch(0.9 0.04 ${pb.hue})`,
                  marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: `oklch(0.32 0.16 ${pb.hue})` }}>{pb.title}</div>
                    {sector && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sector.label}</div>}
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.7, color: 'var(--ink-2)' }}>{pb.summary}</div>
                </div>

                {/* Recommended sources */}
                <LePbSection title="القنوات المقترحة" hue={pb.hue}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(pb.sources || []).map(sid => {
                      const sm = sources.find(s => s.id === sid);
                      if (!sm) return null;
                      return (
                        <span key={sid} style={{
                          padding: '4px 10px', borderRadius: 5, fontSize: 11,
                          background: `oklch(0.97 0.025 ${sm.hue})`, color: `oklch(0.35 0.14 ${sm.hue})`,
                          border: `1px solid oklch(0.9 0.04 ${sm.hue})`,
                        }}>{sm.icon} {sm.label}</span>
                      );
                    })}
                  </div>
                </LePbSection>

                {/* Where to look */}
                <LePbSection title="أين نبحث؟" hue={pb.hue}>
                  <ul style={lePbList}>
                    {(pb.where || []).map((w, i) => <li key={i} style={lePbLi}>{w}</li>)}
                  </ul>
                </LePbSection>

                {/* Qualification signals */}
                <LePbSection title="إشارات التأهيل" hue={pb.hue}>
                  <ul style={lePbList}>
                    {(pb.signals || []).map((s, i) => <li key={i} style={lePbLi}>{s}</li>)}
                  </ul>
                </LePbSection>

                {/* Outreach script */}
                <LePbSection title="رسالة التواصل الأولى" hue={pb.hue}>
                  <div style={{
                    padding: 14, background: '#fbfaf7', border: '1px dashed var(--line)',
                    borderRadius: 9, fontSize: 12.5, lineHeight: 1.8, color: 'var(--ink)',
                  }}>“{pb.outreach}”</div>
                </LePbSection>

                <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
                  <button onClick={() => onUsePlaybook(pb)} style={{
                    ...ldBtnPrimary(),
                    background: `oklch(0.45 0.16 ${pb.hue})`,
                  }}>
                    + ابدأ من هذا الدليل
                  </button>
                  <button onClick={onClose} style={ldBtnGhost()}>إغلاق</button>
                  <div style={{ flex: 1 }} />
                  <div style={{ fontSize: 10.5, color: 'var(--muted)', alignSelf: 'center' }}>
                    نقاط متوقعة: {pb.expectedScore}/100
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </LeModalShell>
  );
}

function LePbSection({ title, hue, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color: `oklch(0.45 0.16 ${hue})`,
        letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8,
      }}>{title}</div>
      {children}
    </div>
  );
}
const lePbList = { margin: 0, padding: 0, listStyle: 'none' };
const lePbLi   = {
  padding: '7px 12px', marginBottom: 4, background: '#fff',
  border: '1px solid var(--line)', borderRadius: 7,
  fontSize: 12, lineHeight: 1.7, color: 'var(--ink-2)',
  position: 'relative', paddingInlineStart: 22,
};

// =========================================================
// LdDetailDrawer — read-only view + actions + activities
// =========================================================
function LdDetailDrawer({ lead, store, api, onClose, onEdit, onPromote, onDelete }) {
  const [activityOpen, setActivityOpen] = useStateLE(false);
  const [activityForm, setActivityForm] = useStateLE({ type: 'note', title: '', body: '' });

  const status = ldStatusMeta(lead.status);
  const source = ldSourceMeta(lead.source);
  const sector = ldSectorMeta(lead.sector, store);
  const isClosed = lead.status === 'converted' || lead.status === 'disqualified';

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,15,20,0.45)', zIndex: 75,
      display: 'flex', justifyContent: 'flex-start',
      backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', height: '100vh', width: '100%', maxWidth: 560,
        boxShadow: '0 0 60px -10px rgba(0,0,0,0.4)', overflow: 'auto',
        direction: 'rtl', fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 22px 14px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{
                padding: '3px 9px', borderRadius: 5, fontSize: 10.5, fontWeight: 600,
                background: `oklch(0.94 0.06 ${status.hue})`, color: `oklch(0.32 0.16 ${status.hue})`,
              }}>{status.label}</span>
              <span style={{
                padding: '3px 9px', borderRadius: 5, fontSize: 10.5, fontWeight: 500,
                background: `oklch(0.97 0.025 ${source.hue})`, color: `oklch(0.4 0.13 ${source.hue})`,
                border: `1px solid oklch(0.9 0.04 ${source.hue})`,
              }}>{source.icon} {source.label}</span>
            </div>
            <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer', color: 'var(--muted)' }}>×</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{lead.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>
                {sector?.label || '—'}{lead.size ? ` · ${lead.size}` : ''}
              </div>
            </div>
            <LdScoreBadge score={lead.score || 0} />
          </div>
        </div>

        {/* Action bar */}
        <div style={{
          padding: '12px 22px', display: 'flex', gap: 8, flexWrap: 'wrap',
          background: 'oklch(0.985 0.003 240)', borderBottom: '1px solid var(--line)',
        }}>
          {!isClosed && (
            <button onClick={onPromote} style={{
              ...ldBtnPrimary(),
              background: 'oklch(0.5 0.16 145)',
            }}>↗ تحويل لعميل</button>
          )}
          <button onClick={onEdit} style={ldBtnGhost()}>✎ تعديل</button>
          <button onClick={() => setActivityOpen(true)} style={ldBtnGhost(220)}>+ تسجيل نشاط</button>
          <div style={{ flex: 1 }} />
          <button onClick={() => {
            if (confirm('حذف هذا العميل المحتمل؟ لا يمكن التراجع.')) onDelete();
          }} style={{ ...ldBtnGhost(20), color: 'oklch(0.45 0.18 25)' }}>حذف</button>
        </div>

        <div style={{ padding: 22 }}>
          {/* Contact info */}
          {(lead.contactName || lead.email || lead.phone || lead.website) && (
            <LeDrawerSection title="بيانات التواصل">
              {lead.contactName && <LeDrRow k="جهة التواصل" v={`${lead.contactName}${lead.contactRole ? ` · ${lead.contactRole}` : ''}`} />}
              {lead.email && <LeDrRow k="البريد" v={lead.email} mono />}
              {lead.phone && <LeDrRow k="الجوال" v={lead.phone} mono />}
              {lead.website && <LeDrRow k="الموقع" v={lead.website} mono />}
            </LeDrawerSection>
          )}

          {/* Tags */}
          {(lead.tags || []).length > 0 && (
            <LeDrawerSection title="الوسوم">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {lead.tags.map((t, i) => (
                  <span key={i} style={{
                    padding: '3px 9px', borderRadius: 4, fontSize: 11,
                    background: '#f5f3ee', color: 'var(--ink-2)',
                  }}>#{t}</span>
                ))}
              </div>
            </LeDrawerSection>
          )}

          {/* Notes */}
          {lead.notes && (
            <LeDrawerSection title="ملاحظات">
              <div style={{
                padding: 12, background: '#fbfaf7', border: '1px solid var(--line)',
                borderRadius: 8, fontSize: 12.5, lineHeight: 1.8, color: 'var(--ink-2)',
                whiteSpace: 'pre-wrap',
              }}>{lead.notes}</div>
            </LeDrawerSection>
          )}

          {/* Activities timeline */}
          <LeDrawerSection title={`الأنشطة · ${(lead.activities || []).length}`}>
            {(lead.activities || []).length === 0 && (
              <div style={{
                padding: 18, textAlign: 'center', fontSize: 11.5, color: 'var(--muted)',
                border: '1px dashed var(--line)', borderRadius: 8,
              }}>لا توجد أنشطة بعد — سجّل أول مكالمة أو رسالة.</div>
            )}
            {(lead.activities || []).map(act => {
              const at = (window.UC_ACTIVITY_TYPES || []).find(t => t.id === act.type) || { label: act.type, icon: '◇', hue: 220 };
              return (
                <div key={act.uid} style={{
                  padding: 10, marginBottom: 6,
                  background: '#fff', border: '1px solid var(--line)', borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center',
                      background: `oklch(0.95 0.05 ${at.hue})`, color: `oklch(0.35 0.16 ${at.hue})`,
                      fontSize: 11,
                    }}>{at.icon}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600 }}>{act.title || at.label}</span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{ldRelativeAr(act.date)}</span>
                  </div>
                  {act.body && <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.7, paddingInlineStart: 30 }}>{act.body}</div>}
                </div>
              );
            })}
          </LeDrawerSection>

          {/* Promoted info */}
          {lead.status === 'converted' && lead.promotedTo && (
            <div style={{
              padding: 12, background: 'oklch(0.96 0.04 280)', border: '1px solid oklch(0.85 0.08 280)',
              borderRadius: 8, fontSize: 12, color: 'oklch(0.32 0.16 280)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            }}>
              <span>✓ تم تحويل هذا العميل المحتمل إلى ملف عميل ضمن خط الصفقات</span>
              <button onClick={() => {
                window.dispatchEvent(new CustomEvent('mhwar:open-client', { detail: { uid: lead.promotedTo } }));
                onClose();
              }} style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: 'oklch(0.45 0.16 280)', color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>فتح ملف العميل</button>
            </div>
          )}
        </div>

        {/* Activity inline form */}
        {activityOpen && (
          <div style={{
            position: 'sticky', bottom: 0, padding: 16,
            background: '#fff', borderTop: '1px solid var(--line)',
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <select value={activityForm.type} onChange={e => setActivityForm(f => ({ ...f, type: e.target.value }))} style={leInput}>
                {(window.UC_ACTIVITY_TYPES || []).map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
              <input style={leInput} placeholder="عنوان قصير" value={activityForm.title}
                onChange={e => setActivityForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <textarea style={{ ...leTextarea, minHeight: 50 }} placeholder="تفاصيل…" value={activityForm.body}
              onChange={e => setActivityForm(f => ({ ...f, body: e.target.value }))} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <button onClick={() => setActivityOpen(false)} style={ldBtnGhost()}>إلغاء</button>
              <button onClick={() => {
                if (!activityForm.title.trim() && !activityForm.body.trim()) return;
                api.addLeadActivity(lead.uid, activityForm);
                setActivityForm({ type: 'note', title: '', body: '' });
                setActivityOpen(false);
              }} style={ldBtnPrimary()}>تسجيل</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LeDrawerSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1,
        textTransform: 'uppercase', marginBottom: 8,
      }}>{title}</div>
      {children}
    </div>
  );
}
function LeDrRow({ k, v, mono }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', padding: '6px 0',
      borderBottom: '1px solid var(--line)', fontSize: 12,
    }}>
      <span style={{ color: 'var(--muted)' }}>{k}</span>
      <span className={mono ? 'mono' : ''} style={{ color: 'var(--ink)', textAlign: 'left' }}>{v}</span>
    </div>
  );
}
// fix typo bridge
function LeDrRow_unused() {} // placeholder retained

// =========================================================
// LdPromoteDialog — confirm + pick starting stage
// =========================================================
function LdPromoteDialog({ lead, onClose, onConfirm }) {
  const [stage, setStage] = useStateLE('outreach');
  const stages = (window.UC_STAGES || []).filter(s => s.kind === 'open');

  return (
    <LeModalShell
      title="تحويل إلى عميل"
      subtitle="سيتم إنشاء ملف عميل كامل بربطه ضمن خط الصفقات. ستبقى بطاقة العميل المحتمل كأرشيف للمصدر."
      width={520}
      onClose={onClose}
      footer={<>
        <button onClick={onClose} style={ldBtnGhost()}>إلغاء</button>
        <button onClick={() => onConfirm(stage)} style={{ ...ldBtnPrimary(), background: 'oklch(0.5 0.16 145)' }}>
          ↗ تحويل إلى عميل
        </button>
      </>}
    >
      <div style={{ padding: 22 }}>
        <div style={{
          padding: 14, background: '#fbfaf7', border: '1px solid var(--line)',
          borderRadius: 9, marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{lead.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
            {ldSourceMeta(lead.source).label} · نقاط: {lead.score}/100
          </div>
        </div>

        <LeField label="ابدأ في مرحلة:" hint="إلى أي عمود في خط الصفقات نضعه؟">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {stages.map(s => (
              <button key={s.id} onClick={() => setStage(s.id)} type="button" style={{
                padding: '10px 12px', borderRadius: 8, fontFamily: 'inherit',
                background: stage === s.id ? `oklch(0.94 0.06 ${s.hue})` : '#fff',
                border: stage === s.id ? `1.5px solid oklch(0.55 0.13 ${s.hue})` : '1px solid var(--line)',
                color: stage === s.id ? `oklch(0.32 0.16 ${s.hue})` : 'var(--ink-2)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', textAlign: 'right',
              }}>
                <div style={{ fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{s.desc}</div>
              </button>
            ))}
          </div>
        </LeField>
      </div>
    </LeModalShell>
  );
}

Object.assign(window, {
  LdEditor, LdBulkImport, LdPlaybooksLibrary, LdDetailDrawer, LdPromoteDialog,
});
