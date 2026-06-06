// Sales Activities — timeline + tasks + activity logger inside the client drawer
const { useState: useStateAC, useMemo: useMemoAC } = React;

// ---- date helpers ----
function acDateLabel(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const today = new Date(); today.setHours(0,0,0,0);
    const yest = new Date(today); yest.setDate(today.getDate() - 1);
    const dd = new Date(d); dd.setHours(0,0,0,0);
    if (dd.getTime() === today.getTime()) return 'اليوم';
    if (dd.getTime() === yest.getTime()) return 'أمس';
    const diffDays = Math.floor((today - dd) / 86400000);
    if (diffDays > 0 && diffDays < 7) return `قبل ${diffDays} أيام`;
    return d.toLocaleDateString('ar', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (_) { return iso; }
}

function acDueLabel(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso); d.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    const diff = Math.round((d - today) / 86400000);
    if (diff === 0) return 'اليوم';
    if (diff === 1) return 'غداً';
    if (diff === -1) return 'أمس';
    if (diff > 0 && diff < 7) return `بعد ${diff} أيام`;
    if (diff < 0) return `متأخّرة ${-diff} يوم`;
    return d.toLocaleDateString('ar', { month: 'short', day: 'numeric' });
  } catch (_) { return iso; }
}

// =========================================================
// Activity timeline section
// =========================================================
function ActivityTimeline({ client, store, api }) {
  const [adding, setAdding] = useStateAC(false);
  const [filter, setFilter] = useStateAC('all');

  const types = window.UC_ACTIVITY_TYPES || [];
  const activities = client.activities || [];
  const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);

  // Sort by date desc
  const sorted = useMemoAC(() => {
    return [...filtered].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [filtered]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          سجل النشاطات ({activities.length})
        </div>
        <button onClick={() => setAdding(true)} style={{
          fontSize: 11.5, padding: '5px 12px', borderRadius: 8,
          background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 500,
        }}>+ تسجيل نشاط</button>
      </div>

      {/* Type filter pills */}
      {activities.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
          <FilterPill on={filter === 'all'} onClick={() => setFilter('all')} label="الكل" count={activities.length} />
          {types.map(t => {
            const n = activities.filter(a => a.type === t.id).length;
            if (n === 0) return null;
            return (
              <FilterPill key={t.id} on={filter === t.id} onClick={() => setFilter(t.id)}
                label={t.label} count={n} icon={t.icon} hue={t.hue} />
            );
          })}
        </div>
      )}

      {/* Timeline */}
      {sorted.length === 0 ? (
        <div style={{
          padding: 28, fontSize: 12, color: 'var(--muted)', textAlign: 'center',
          background: 'var(--warm)', borderRadius: 12, border: '1px dashed var(--line-2)',
        }}>
          لم تُسجَّل أي نشاطات بعد
        </div>
      ) : (
        <div style={{ position: 'relative', paddingInlineStart: 22 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', insetInlineStart: 8, top: 6, bottom: 6,
            width: 1.5, background: 'var(--line)', borderRadius: 2,
          }} />
          {sorted.map(a => (
            <ActivityRow key={a.uid} activity={a} clientUid={client.uid} api={api} store={store} />
          ))}
        </div>
      )}

      {adding && (
        <ActivityFormDialog
          onClose={() => setAdding(false)}
          onSave={(data) => { api.addActivity(client.uid, data); setAdding(false); }}
          store={store}
          clientUid={client.uid}
        />
      )}
    </div>
  );
}

function FilterPill({ on, onClick, label, count, icon, hue = 220 }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 10.5, padding: '4px 10px', borderRadius: 999,
      background: on ? `oklch(0.55 0.15 ${hue})` : '#fff',
      color: on ? '#fff' : 'var(--ink-2)',
      border: on ? 'none' : '1px solid var(--line)',
      fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {icon && <span style={{ fontSize: 10 }}>{icon}</span>}
      {label} <span style={{ opacity: 0.65 }}>· {count}</span>
    </button>
  );
}

function ActivityRow({ activity, clientUid, api, store }) {
  const [editing, setEditing] = useStateAC(false);
  const type = (window.UC_ACTIVITY_TYPES || []).find(t => t.id === activity.type) || { icon: '·', hue: 60, label: '—' };
  const hue = type.hue;

  return (
    <div style={{ position: 'relative', marginBottom: 14, paddingInlineStart: 14 }}>
      {/* Dot */}
      <div style={{
        position: 'absolute', insetInlineStart: -22, top: 4,
        width: 18, height: 18, borderRadius: '50%',
        background: `oklch(0.96 0.06 ${hue})`, color: `oklch(0.35 0.15 ${hue})`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, border: `2px solid #fff`,
        boxShadow: `0 0 0 1.5px oklch(0.55 0.13 ${hue})`,
      }}>{type.icon}</div>

      <div style={{
        background: '#fff', border: '1px solid var(--line)', borderRadius: 10,
        padding: '9px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            fontSize: 9.5, padding: '1px 7px', borderRadius: 999, fontWeight: 600,
            background: `oklch(0.96 0.05 ${hue})`, color: `oklch(0.35 0.15 ${hue})`,
            letterSpacing: 0.3,
          }}>{type.label}</span>
          <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{acDateLabel(activity.date)}</span>
          <span style={{ flex: 1 }} />
          <button onClick={() => setEditing(true)} style={{
            background: 'transparent', border: 'none', color: 'var(--muted)',
            fontSize: 11, cursor: 'pointer',
          }}>✎</button>
          <button onClick={() => { if (confirm('حذف؟')) api.deleteActivity(clientUid, activity.uid); }}
            style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer' }}>×</button>
        </div>
        {activity.title && (
          <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>{activity.title}</div>
        )}
        {activity.body && (
          <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.7, marginTop: 4 }}>
            {activity.body}
          </div>
        )}
        {activity.outcome && (
          <div style={{
            marginTop: 6, fontSize: 10.5, padding: '3px 8px', borderRadius: 6,
            background: 'var(--warm)', color: 'var(--ink-2)', display: 'inline-block',
          }}>النتيجة: {activity.outcome}</div>
        )}
        {activity.linkedTemplate && (
          <div style={{ marginTop: 6, fontSize: 10.5, color: 'oklch(0.4 0.14 220)' }}>
            ↳ قالب: {activity.linkedTemplate}
          </div>
        )}
        {activity.linkedProposal && (
          <div style={{ marginTop: 4, fontSize: 10.5, color: 'oklch(0.4 0.14 260)' }}>
            ↳ مقترح: {activity.linkedProposal}
          </div>
        )}
      </div>

      {editing && (
        <ActivityFormDialog
          initial={activity}
          onClose={() => setEditing(false)}
          onSave={(data) => { api.updateActivity(clientUid, activity.uid, data); setEditing(false); }}
          store={store}
          clientUid={clientUid}
        />
      )}
    </div>
  );
}

// =========================================================
// Activity form dialog (log/edit)
// =========================================================
function ActivityFormDialog({ initial, onClose, onSave, store, clientUid }) {
  const today = new Date().toISOString().slice(0, 10);
  const [d, setD] = useStateAC(() => initial || {
    type: 'call', title: '', body: '', date: today, outcome: '',
    linkedTemplate: '', linkedProposal: '',
  });

  const types = window.UC_ACTIVITY_TYPES || [];

  // Available email/whatsapp templates (from window stores if loaded)
  const emailTemplates = (window.MHWAR_EMAIL_TEMPLATES || []);
  const waTemplates = (window.MHWAR_WHATSAPP_TEMPLATES || []);

  const showTemplateSelector = d.type === 'email' || d.type === 'whatsapp';
  const tplOptions = d.type === 'email' ? emailTemplates : waTemplates;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.5)', zIndex: 320, backdropFilter: 'blur(3px)',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(540px, 94vw)', maxHeight: '90vh', zIndex: 321,
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{initial ? 'تعديل نشاط' : 'تسجيل نشاط'}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>
                ما الذي حدث مع هذا العميل؟
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 8, border: '1px solid var(--line)', background: '#fff', cursor: 'pointer',
            }}>×</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          {/* Type picker */}
          <div style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 600, marginBottom: 8 }}>نوع النشاط</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 6, marginBottom: 16 }}>
            {types.map(t => {
              const on = d.type === t.id;
              return (
                <button key={t.id} type="button" onClick={() => setD({ ...d, type: t.id, linkedTemplate: '' })}
                  style={{
                    padding: '8px 10px', borderRadius: 9,
                    background: on ? `oklch(0.96 0.06 ${t.hue})` : '#fff',
                    border: on ? `1.5px solid oklch(0.55 0.15 ${t.hue})` : '1px solid var(--line)',
                    color: on ? `oklch(0.3 0.15 ${t.hue})` : 'var(--ink-2)',
                    fontSize: 11.5, fontFamily: 'inherit', cursor: 'pointer', fontWeight: on ? 600 : 500,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <span>{t.icon}</span> {t.label}
                </button>
              );
            })}
          </div>

          {/* Title */}
          <AxField label="العنوان">
            <AxInput value={d.title} onChange={v => setD({ ...d, title: v })}
              placeholder={d.type === 'meeting' ? 'اجتماع تقديم عام' :
                d.type === 'call' ? 'مكالمة متابعة' :
                d.type === 'email' ? 'إيميل عرض مبدئي' :
                d.type === 'whatsapp' ? 'تذكير برسالة واتساب' :
                'عنوان قصير'} />
          </AxField>

          {/* Date */}
          <AxField label="التاريخ">
            <AxInput type="date" value={d.date} onChange={v => setD({ ...d, date: v })} />
          </AxField>

          {/* Body */}
          <AxField label={d.type === 'note' ? 'الملاحظة' : 'التفاصيل'}>
            <AxTextarea value={d.body} onChange={v => setD({ ...d, body: v })} rows={3}
              placeholder="ما الذي قيل/أُرسل/قُرّر؟" />
          </AxField>

          {/* Linked template (for email/whatsapp) */}
          {showTemplateSelector && tplOptions.length > 0 && (
            <AxField label="القالب المرسل" hint="ربط النشاط بقالب من مكتبة محور">
              <AxSelect value={d.linkedTemplate} onChange={v => setD({ ...d, linkedTemplate: v })}
                options={[
                  { value: '', label: '— لم يُستخدم قالب —' },
                  ...tplOptions.map(t => ({ value: t.id || t.name, label: t.name || t.id })),
                ]} />
            </AxField>
          )}

          {/* Linked proposal (for proposal type) */}
          {d.type === 'proposal' && (
            <AxField label="رابط المقترح" hint="إن أُرسل رابط مقترح محور">
              <AxInput value={d.linkedProposal} onChange={v => setD({ ...d, linkedProposal: v })}
                placeholder="https://..." />
            </AxField>
          )}

          {/* Outcome (for call/meeting) */}
          {(d.type === 'call' || d.type === 'meeting') && (
            <AxField label="النتيجة" hint="اختياري — كيف انتهى؟">
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {['إيجابي', 'محايد', 'يحتاج متابعة', 'لم يردّ', 'تم رفض'].map(o => (
                  <button key={o} type="button" onClick={() => setD({ ...d, outcome: d.outcome === o ? '' : o })}
                    style={{
                      fontSize: 11, padding: '5px 11px', borderRadius: 999,
                      background: d.outcome === o ? 'var(--ink)' : '#fff',
                      color: d.outcome === o ? '#fff' : 'var(--ink-2)',
                      border: d.outcome === o ? 'none' : '1px solid var(--line)',
                      fontFamily: 'inherit', cursor: 'pointer',
                    }}>
                    {o}
                  </button>
                ))}
              </div>
            </AxField>
          )}
        </div>
        <div style={{
          padding: '12px 18px', borderTop: '1px solid var(--line)', background: '#fbfaf7',
          display: 'flex', gap: 8, justifyContent: 'flex-end',
        }}>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
          <AxBtn onClick={() => onSave(d)}>{initial ? 'حفظ' : 'تسجيل'}</AxBtn>
        </div>
      </div>
    </>
  );
}

// =========================================================
// Tasks list (with checkbox + due date)
// =========================================================
function TasksList({ client, api }) {
  const [adding, setAdding] = useStateAC(false);
  const tasks = client.tasks || [];
  const open = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          المهام ({open.length} مفتوحة)
        </div>
        <button onClick={() => setAdding(true)} style={{
          fontSize: 11.5, padding: '5px 12px', borderRadius: 8,
          background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 500,
        }}>+ مهمة</button>
      </div>

      {tasks.length === 0 ? (
        <div style={{
          padding: 22, fontSize: 12, color: 'var(--muted)', textAlign: 'center',
          background: 'var(--warm)', borderRadius: 12, border: '1px dashed var(--line-2)',
        }}>
          لا مهام معلّقة
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {open.map(t => (
            <TaskRow key={t.uid} task={t} clientUid={client.uid} api={api} />
          ))}
          {done.length > 0 && (
            <details style={{ marginTop: 8 }}>
              <summary style={{ fontSize: 11, color: 'var(--muted)', cursor: 'pointer', padding: '4px 0' }}>
                المنجزة ({done.length})
              </summary>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
                {done.map(t => (
                  <TaskRow key={t.uid} task={t} clientUid={client.uid} api={api} />
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {adding && (
        <TaskFormDialog
          onClose={() => setAdding(false)}
          onSave={(data) => { api.upsertTask(client.uid, data); setAdding(false); }}
        />
      )}
    </div>
  );
}

function TaskRow({ task, clientUid, api }) {
  const overdue = !task.done && task.due && new Date(task.due) < new Date(new Date().setHours(0,0,0,0));
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '8px 11px', background: '#fff',
      border: overdue ? '1px solid oklch(0.85 0.1 25)' : '1px solid var(--line)',
      borderRadius: 9,
      opacity: task.done ? 0.55 : 1,
    }}>
      <button onClick={() => api.toggleTask(clientUid, task.uid)} style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        border: task.done ? 'none' : '1.5px solid var(--line-2)',
        background: task.done ? 'oklch(0.55 0.15 145)' : '#fff',
        color: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{task.done ? '✓' : ''}</button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, color: 'var(--ink)', fontWeight: 500,
          textDecoration: task.done ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{task.title}</div>
        {task.due && (
          <div style={{
            fontSize: 10, marginTop: 1,
            color: overdue ? 'oklch(0.5 0.18 25)' : 'var(--muted)',
            fontWeight: overdue ? 600 : 400,
          }}>
            {overdue && '⚠ '}
            {acDueLabel(task.due)}
          </div>
        )}
      </div>
      <button onClick={() => { if (confirm('حذف؟')) api.deleteTask(clientUid, task.uid); }}
        style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer' }}>×</button>
    </div>
  );
}

function TaskFormDialog({ onClose, onSave, initial }) {
  const [d, setD] = useStateAC(() => initial || {
    title: '', due: '', activityType: 'call', done: false,
  });
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.5)', zIndex: 320, backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(440px, 94vw)', zIndex: 321,
        background: '#fff', borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>إضافة مهمة</div>
        </div>
        <div style={{ padding: 18 }}>
          <AxField label="المهمة" required>
            <AxInput value={d.title} onChange={v => setD({ ...d, title: v })}
              placeholder="مثال: اتصال متابعة بعد إرسال المقترح" />
          </AxField>
          <AxField label="تاريخ الاستحقاق">
            <AxInput type="date" value={d.due} onChange={v => setD({ ...d, due: v })} />
          </AxField>
          <AxField label="النوع المتوقّع">
            <AxSelect value={d.activityType} onChange={v => setD({ ...d, activityType: v })}
              options={(window.UC_ACTIVITY_TYPES || []).map(t => ({ value: t.id, label: t.label }))} />
          </AxField>
        </div>
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line)', background: '#fbfaf7',
          display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
          <AxBtn onClick={() => d.title.trim() && onSave(d)}>إضافة</AxBtn>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  ActivityTimeline, TasksList, ActivityFormDialog, TaskFormDialog,
  acDateLabel, acDueLabel,
});
