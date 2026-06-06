// Sales Contacts — multiple stakeholders per client account
const { useState: useStateCT } = React;

function ContactsList({ client, api }) {
  const [editing, setEditing] = useStateCT(null);
  const contacts = client.contacts || [];
  const roles = window.UC_CONTACT_ROLES || [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          جهات الاتصال ({contacts.length})
        </div>
        <button onClick={() => setEditing('new')} style={{
          fontSize: 11.5, padding: '5px 12px', borderRadius: 8,
          background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 500,
        }}>+ جهة اتصال</button>
      </div>

      {contacts.length === 0 ? (
        <div style={{
          padding: 20, fontSize: 12, color: 'var(--muted)', textAlign: 'center',
          background: 'var(--warm)', borderRadius: 12, border: '1px dashed var(--line-2)',
        }}>
          لم تُسجَّل جهات اتصال بعد
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
          {contacts.map(ct => {
            const role = roles.find(r => r.id === ct.roleType) || roles[roles.length - 1];
            const hue = role.hue;
            return (
              <div key={ct.uid} style={{
                background: '#fff', border: '1px solid var(--line)', borderRadius: 11,
                padding: 12, position: 'relative',
                borderInlineStart: `3px solid oklch(0.55 0.15 ${hue})`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 9.5, padding: '1.5px 7px', borderRadius: 999, fontWeight: 600,
                        background: `oklch(0.95 0.06 ${hue})`, color: `oklch(0.35 0.15 ${hue})`,
                      }}>{role.label}</span>
                      {ct.primary && (
                        <span style={{
                          fontSize: 9, padding: '1.5px 6px', borderRadius: 999, fontWeight: 600,
                          background: 'oklch(0.94 0.06 45)', color: 'oklch(0.4 0.16 45)',
                        }}>★ الرئيسي</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 5,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ct.name || '—'}
                    </div>
                    {ct.role && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ct.role}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button onClick={() => setEditing(ct.uid)} style={{
                      background: 'transparent', border: 'none', color: 'var(--muted)',
                      fontSize: 12, cursor: 'pointer', padding: 4,
                    }}>✎</button>
                    <button onClick={() => { if (confirm('حذف؟')) api.deleteContact(client.uid, ct.uid); }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', padding: 4 }}>×</button>
                  </div>
                </div>
                {(ct.email || ct.phone) && (
                  <div style={{ fontSize: 10.5, color: 'var(--ink-2)', display: 'flex', flexDirection: 'column', gap: 2,
                    paddingTop: 6, borderTop: '1px solid var(--line)' }}>
                    {ct.email && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✉ {ct.email}</span>}
                    {ct.phone && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>☎ {ct.phone}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <ContactFormDialog
          initial={editing === 'new' ? null : contacts.find(c => c.uid === editing)}
          existingPrimary={contacts.find(c => c.primary)}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            // If marking as primary, unset others
            if (data.primary) {
              contacts.forEach(c => {
                if (c.uid !== data.uid && c.primary) {
                  api.upsertContact(client.uid, { ...c, primary: false });
                }
              });
            }
            api.upsertContact(client.uid, data);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ContactFormDialog({ initial, existingPrimary, onClose, onSave }) {
  const [d, setD] = useStateCT(() => initial || {
    name: '', role: '', roleType: 'decision', email: '', phone: '', notes: '',
    primary: !existingPrimary,
  });
  const roles = window.UC_CONTACT_ROLES || [];
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.5)', zIndex: 320, backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(520px, 94vw)', maxHeight: '90vh', zIndex: 321,
        background: '#fff', borderRadius: 14, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{initial ? 'تعديل جهة اتصال' : 'جهة اتصال جديدة'}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>كل صفقة فيها أكثر من شخص — صنّفهم لتعرف القرار من المؤثّر</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          {/* Role type — radio grid */}
          <AxField label="الدور في الصفقة" required>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {roles.map(r => {
                const on = d.roleType === r.id;
                return (
                  <button key={r.id} type="button" onClick={() => setD({ ...d, roleType: r.id })}
                    style={{
                      padding: '9px 11px', borderRadius: 9, textAlign: 'start',
                      background: on ? `oklch(0.96 0.06 ${r.hue})` : '#fff',
                      border: on ? `1.5px solid oklch(0.55 0.15 ${r.hue})` : '1px solid var(--line)',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: on ? `oklch(0.3 0.15 ${r.hue})` : 'var(--ink)' }}>{r.label}</div>
                    {r.desc && (
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, lineHeight: 1.5 }}>{r.desc}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </AxField>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
            <AxField label="الاسم" required>
              <AxInput value={d.name} onChange={v => setD({ ...d, name: v })} placeholder="فهد المالكي" />
            </AxField>
            <AxField label="المنصب">
              <AxInput value={d.role} onChange={v => setD({ ...d, role: v })} placeholder="مدير التسويق" />
            </AxField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AxField label="البريد">
              <AxInput type="email" value={d.email} onChange={v => setD({ ...d, email: v })} placeholder="f@co.sa" />
            </AxField>
            <AxField label="الجوال">
              <AxInput type="tel" value={d.phone} onChange={v => setD({ ...d, phone: v })} placeholder="+9665..." />
            </AxField>
          </div>
          <AxField label="ملاحظات">
            <AxTextarea value={d.notes} onChange={v => setD({ ...d, notes: v })} rows={2}
              placeholder="ميوله، ما يحركه، أسلوب التواصل..." />
          </AxField>

          <label style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 8,
            padding: '9px 12px', background: '#fbfaf7', borderRadius: 9, cursor: 'pointer',
          }}>
            <input type="checkbox" checked={d.primary} onChange={e => setD({ ...d, primary: e.target.checked })}
              style={{ accentColor: 'oklch(0.55 0.16 45)' }} />
            <span style={{ fontSize: 12, color: 'var(--ink)' }}>الجهة الرئيسية للتواصل</span>
            {existingPrimary && existingPrimary.uid !== d.uid && d.primary && (
              <span style={{ fontSize: 10, color: 'var(--muted)', marginInlineStart: 'auto' }}>سيستبدل {existingPrimary.name}</span>
            )}
          </label>
        </div>
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line)', background: '#fbfaf7',
          display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
          <AxBtn onClick={() => d.name.trim() && onSave(d)}>{initial ? 'حفظ' : 'إضافة'}</AxBtn>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ContactsList, ContactFormDialog });
