// Sales Deal — tier, value, probability, scope (linked features/cases), linked proposals
const { useState: useStateDL, useMemo: useMemoDL } = React;

function DealBox({ client, store, api }) {
  const deal = client.deal || {};
  const tiers = window.UC_TIERS || [];
  const tier = tiers.find(t => t.id === deal.tier);
  const value = window.spDealValue ? window.spDealValue(deal) : 0;
  const weighted = value * ((deal.probability ?? 0) / 100);

  const [editing, setEditing] = useStateDL(false);
  const [scopeOpen, setScopeOpen] = useStateDL(false);

  const linkedFeatures = (deal.scope?.features || [])
    .map(uid => (store.features || []).find(f => f.uid === uid))
    .filter(Boolean);
  const linkedCases = (deal.scope?.cases || [])
    .map(uid => (store.cases || []).find(c => c.uid === uid))
    .filter(Boolean);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          الصفقة
        </div>
        <button onClick={() => setEditing(true)} style={{
          fontSize: 11.5, padding: '5px 12px', borderRadius: 8,
          background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 500,
        }}>تعديل</button>
      </div>

      <div style={{
        background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
        padding: 14, marginBottom: 12,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
          <DealMetric label="الباقة" value={tier ? tier.label : '—'}
            tone={tier ? `oklch(0.55 0.15 ${tier.hue})` : null} />
          <DealMetric label="قيمة" value={value > 0 ? window.spFmtCurrency(value) : '—'}
            sub={value > 0 ? (deal.acv ? 'ACV سنوياً' : 'تقدير') : ''} />
          <DealMetric label="احتمالية" value={`${deal.probability ?? 0}%`}
            sub={value > 0 ? `${window.spFmtCurrency(weighted)} مرجّحة` : ''} />
        </div>

        {deal.expectedClose && (
          <div style={{
            fontSize: 11.5, padding: '7px 11px', borderRadius: 9,
            background: 'oklch(0.97 0.025 60)', color: 'var(--ink-2)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: 'var(--muted)', fontSize: 10 }}>الإغلاق المتوقّع</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
              {new Date(deal.expectedClose).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        )}

        {deal.lostReason && (
          <div style={{
            marginTop: 10, fontSize: 11, padding: '8px 11px', borderRadius: 8,
            background: 'oklch(0.96 0.04 25)', color: 'oklch(0.4 0.15 25)',
          }}>
            <strong>سبب الخسارة:</strong> {deal.lostReason}
          </div>
        )}
      </div>

      {/* Scope summary */}
      <div style={{
        background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
        padding: 14, marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
            نطاق العرض ({linkedFeatures.length} ميزة · {linkedCases.length} حالة)
          </div>
          <button onClick={() => setScopeOpen(true)} style={{
            fontSize: 11, padding: '4px 10px', borderRadius: 7,
            background: '#fff', border: '1px solid var(--line)', cursor: 'pointer',
            fontFamily: 'inherit', color: 'var(--ink-2)',
          }}>تعديل</button>
        </div>

        {linkedFeatures.length === 0 && linkedCases.length === 0 ? (
          <div style={{ fontSize: 11.5, color: 'var(--muted)', padding: '8px 0' }}>
            لم يُحدَّد نطاق بعد — اربط ميزات وحالات استخدام للعرض
          </div>
        ) : (
          <>
            {linkedFeatures.length > 0 && (
              <div style={{ marginBottom: linkedCases.length ? 10 : 0 }}>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: 1.4, fontWeight: 600, marginBottom: 5 }}>
                  ميزات
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {linkedFeatures.map(f => (
                    <span key={f.uid} style={{
                      fontSize: 10.5, padding: '3px 9px', borderRadius: 999,
                      background: `oklch(0.96 0.05 ${f.hue})`, color: `oklch(0.35 0.14 ${f.hue})`,
                      fontWeight: 500,
                    }}>{f.icon} {f.name}</span>
                  ))}
                </div>
              </div>
            )}
            {linkedCases.length > 0 && (
              <div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: 1.4, fontWeight: 600, marginBottom: 5 }}>
                  حالات استخدام
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {linkedCases.map(c => (
                    <span key={c.uid} style={{
                      fontSize: 10.5, padding: '3px 9px', borderRadius: 999,
                      background: '#fbfaf7', color: 'var(--ink)', border: '1px solid var(--line)',
                    }}>{c.name}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Linked proposals */}
      {(deal.linkedProposals || []).length > 0 && (
        <div style={{
          background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: 14,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            مقترحات مُرسلة ({deal.linkedProposals.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {(deal.linkedProposals || []).map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 10px', background: '#fbfaf7', borderRadius: 7,
                fontSize: 11.5,
              }}>
                <span style={{ color: 'var(--muted)' }}>◈</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.label || 'مقترح'}
                  </div>
                  {p.sentAt && (
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                      {window.acDateLabel ? window.acDateLabel(p.sentAt) : p.sentAt}
                    </div>
                  )}
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener" style={{
                    fontSize: 10.5, color: 'oklch(0.4 0.16 220)', textDecoration: 'none', flexShrink: 0,
                  }}>فتح ↗</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {editing && (
        <DealEditDialog deal={deal} onClose={() => setEditing(false)}
          onSave={(patch) => { api.updateDeal(client.uid, patch); setEditing(false); }} />
      )}

      {scopeOpen && (
        <ScopePickerDialog
          deal={deal} store={store} client={client}
          onClose={() => setScopeOpen(false)}
          onSave={(scope) => { api.updateDeal(client.uid, { scope }); setScopeOpen(false); }}
        />
      )}
    </div>
  );
}

function DealMetric({ label, value, sub, tone }) {
  return (
    <div style={{ padding: '10px 12px', background: 'var(--warm)', borderRadius: 9 }}>
      <div style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: 1.4, fontWeight: 600, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: tone || 'var(--ink)', marginTop: 4, letterSpacing: -0.2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function DealEditDialog({ deal, onClose, onSave }) {
  const [d, setD] = useStateDL(() => ({
    tier: deal.tier || '',
    mrr: deal.mrr || '',
    acv: deal.acv || '',
    probability: deal.probability ?? 30,
    expectedClose: deal.expectedClose || '',
    lostReason: deal.lostReason || '',
  }));
  const tiers = window.UC_TIERS || [];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.5)', zIndex: 320, backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(540px, 94vw)', maxHeight: '90vh', zIndex: 321,
        background: '#fff', borderRadius: 14, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>تعديل الصفقة</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>الباقة، القيمة، الاحتمالية، تاريخ الإغلاق المتوقّع</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          <AxField label="الباقة المتوقّعة">
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tiers.length + 1}, 1fr)`, gap: 5 }}>
              <button type="button" onClick={() => setD({ ...d, tier: '' })}
                style={{
                  padding: '9px 8px', borderRadius: 8, fontFamily: 'inherit', fontSize: 11.5,
                  background: !d.tier ? 'var(--ink)' : '#fff',
                  color: !d.tier ? '#fff' : 'var(--ink-2)',
                  border: !d.tier ? 'none' : '1px solid var(--line)',
                  cursor: 'pointer', fontWeight: 500,
                }}>—</button>
              {tiers.map(t => {
                const on = d.tier === t.id;
                return (
                  <button key={t.id} type="button" onClick={() => setD({ ...d, tier: t.id })}
                    style={{
                      padding: '9px 8px', borderRadius: 8, fontFamily: 'inherit', fontSize: 11.5,
                      background: on ? `oklch(0.55 0.15 ${t.hue})` : '#fff',
                      color: on ? '#fff' : 'var(--ink-2)',
                      border: on ? 'none' : '1px solid var(--line)',
                      cursor: 'pointer', fontWeight: 600,
                    }}>{t.label}</button>
                );
              })}
            </div>
          </AxField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AxField label="MRR (شهري)" hint="ر.س — اختياري">
              <AxInput type="number" value={d.mrr} onChange={v => setD({ ...d, mrr: v })} placeholder="0" />
            </AxField>
            <AxField label="ACV (سنوي)" hint="ر.س — يستخدم لقيمة الصفقة">
              <AxInput type="number" value={d.acv} onChange={v => setD({ ...d, acv: v })} placeholder="0" />
            </AxField>
          </div>

          <AxField label={`احتمالية الإغلاق (${d.probability}%)`}>
            <input type="range" min="0" max="100" step="5"
              value={d.probability}
              onChange={e => setD({ ...d, probability: parseInt(e.target.value, 10) })}
              style={{ width: '100%', accentColor: 'oklch(0.55 0.15 145)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--muted)', marginTop: 3 }}>
              <span>0% بارد</span><span>50% محتمل</span><span>100% مؤكّد</span>
            </div>
          </AxField>

          <AxField label="تاريخ الإغلاق المتوقّع">
            <AxInput type="date" value={d.expectedClose} onChange={v => setD({ ...d, expectedClose: v })} />
          </AxField>

          <AxField label="سبب الخسارة" hint="إن كانت الصفقة في حالة خسارة">
            <AxTextarea value={d.lostReason} onChange={v => setD({ ...d, lostReason: v })} rows={2}
              placeholder="مثال: السعر، توقيت غير مناسب، اختار منافس..." />
          </AxField>
        </div>
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line)', background: '#fbfaf7',
          display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
          <AxBtn onClick={() => onSave(d)}>حفظ</AxBtn>
        </div>
      </div>
    </>
  );
}

function ScopePickerDialog({ deal, store, client, onClose, onSave }) {
  const [features, setFeatures] = useStateDL(deal.scope?.features || []);
  const [cases, setCases] = useStateDL(deal.scope?.cases || []);

  // Pre-suggest cases derived from client communities
  const suggestedCaseIds = useMemoDL(() => {
    return (client.communities || [])
      .map(c => c.caseId).filter(Boolean);
  }, [client.communities]);

  // Group features by family
  const featuresByFamily = useMemoDL(() => {
    const m = new Map();
    (store.features || []).forEach(f => {
      const fam = f.family || 'عام';
      if (!m.has(fam)) m.set(fam, []);
      m.get(fam).push(f);
    });
    return Array.from(m.entries());
  }, [store.features]);

  const toggleFeature = (uid) =>
    setFeatures(features.includes(uid) ? features.filter(x => x !== uid) : [...features, uid]);
  const toggleCase = (uid) =>
    setCases(cases.includes(uid) ? cases.filter(x => x !== uid) : [...cases, uid]);

  const [tab, setTab] = useStateDL('features');

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,19,15,0.55)', zIndex: 320, backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(720px, 94vw)', maxHeight: '88vh', zIndex: 321,
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>نطاق العرض</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>
                ميزات وحالات الاستخدام المُختارة لهذه الصفقة — تنعكس في المقترح.
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 8, border: '1px solid var(--line)', background: '#fff', cursor: 'pointer',
            }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 14 }}>
            <button onClick={() => setTab('features')} style={{
              padding: '7px 14px', borderRadius: 8, fontFamily: 'inherit',
              background: tab === 'features' ? 'var(--ink)' : '#fff',
              color: tab === 'features' ? '#fff' : 'var(--ink-2)',
              border: tab === 'features' ? 'none' : '1px solid var(--line)',
              fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
            }}>
              ميزات ({features.length})
            </button>
            <button onClick={() => setTab('cases')} style={{
              padding: '7px 14px', borderRadius: 8, fontFamily: 'inherit',
              background: tab === 'cases' ? 'var(--ink)' : '#fff',
              color: tab === 'cases' ? '#fff' : 'var(--ink-2)',
              border: tab === 'cases' ? 'none' : '1px solid var(--line)',
              fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
            }}>
              حالات استخدام ({cases.length})
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {tab === 'features' ? (
            featuresByFamily.map(([fam, list]) => (
              <div key={fam} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: 1.4, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
                  {fam}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 5 }}>
                  {list.map(f => {
                    const on = features.includes(f.uid);
                    return (
                      <button key={f.uid} type="button" onClick={() => toggleFeature(f.uid)}
                        style={{
                          padding: '8px 10px', borderRadius: 8, textAlign: 'start',
                          background: on ? `oklch(0.96 0.05 ${f.hue})` : '#fff',
                          border: on ? `1.5px solid oklch(0.55 0.15 ${f.hue})` : '1px solid var(--line)',
                          cursor: 'pointer', fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                        <span style={{ fontSize: 13, color: `oklch(0.45 0.15 ${f.hue})` }}>{f.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink)' }}>{f.name}</div>
                          {f.shortAr && (
                            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {f.shortAr}
                            </div>
                          )}
                        </div>
                        {on && <span style={{ color: `oklch(0.55 0.15 ${f.hue})`, fontSize: 11 }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <>
              {suggestedCaseIds.length > 0 && (
                <div style={{
                  padding: '10px 13px', marginBottom: 12,
                  background: 'oklch(0.97 0.025 60)', borderRadius: 9,
                  border: '1px dashed oklch(0.88 0.05 60)',
                }}>
                  <div style={{ fontSize: 10.5, color: 'oklch(0.4 0.13 45)', fontWeight: 600, letterSpacing: 1.2, marginBottom: 5 }}>
                    مقترحة من مجتمعات هذا العميل
                  </div>
                  <button type="button" onClick={() => setCases(Array.from(new Set([...cases, ...suggestedCaseIds])))}
                    style={{
                      fontSize: 10.5, padding: '4px 10px', borderRadius: 6,
                      background: '#fff', border: '1px solid oklch(0.88 0.05 60)',
                      cursor: 'pointer', fontFamily: 'inherit', color: 'oklch(0.4 0.14 45)',
                    }}>
                    + إضافة الكل
                  </button>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 5 }}>
                {(store.cases || []).map(uc => {
                  const on = cases.includes(uc.uid);
                  const sug = suggestedCaseIds.includes(uc.uid);
                  return (
                    <button key={uc.uid} type="button" onClick={() => toggleCase(uc.uid)}
                      style={{
                        padding: '8px 10px', borderRadius: 8, textAlign: 'start',
                        background: on ? 'oklch(0.96 0.04 145)' : '#fff',
                        border: on ? '1.5px solid oklch(0.55 0.15 145)' : sug ? '1.5px dashed oklch(0.85 0.05 60)' : '1px solid var(--line)',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink)' }}>
                        {uc.name} {sug && !on && <span style={{ color: 'oklch(0.5 0.15 45)', fontSize: 9 }}>★</span>}
                      </div>
                      {uc.desc && (
                        <div style={{
                          fontSize: 10, color: 'var(--muted)', marginTop: 3, lineHeight: 1.5,
                          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>{uc.desc}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line)', background: '#fbfaf7',
          display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--ink)' }}>{features.length}</strong> ميزة ·
            <strong style={{ color: 'var(--ink)', marginInlineStart: 4 }}>{cases.length}</strong> حالة
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
            <AxBtn onClick={() => onSave({ features, cases })}>حفظ النطاق</AxBtn>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { DealBox, DealEditDialog, ScopePickerDialog });
