// Edit forms for Category, Pattern, Case, Client.

const { useState: useStateED, useEffect: useEffectED, useMemo: useMemoED } = React;

// =========================================================================
// Category editor
// =========================================================================
function CategoryEditor({ open, value, onClose, onSave }) {
  const [d, setD] = useStateED(() => value || {});
  useEffectED(() => { setD(value || {}); }, [value, open]);

  const colorPair = { accent: d.accent, bg: d.bg };
  const isNew = !d.uid;

  const save = () => {
    if (!d.name?.trim()) return;
    onSave({ ...d, name: d.name.trim(), id: (d.id || d.name).trim() });
    onClose();
  };

  return (
    <AxModal
      open={open}
      title={isNew ? 'إضافة قطاع جديد' : 'تعديل القطاع'}
      subtitle={isNew ? 'القطاعات تصنّف العملاء وتقترح أنواع المجتمعات المناسبة' : null}
      onClose={onClose}
      footer={
        <>
          <AxBtn onClick={save}>حفظ</AxBtn>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
        </>
      }
    >
      <AxField label="اسم القطاع" required>
        <AxInput value={d.name} onChange={v => setD({ ...d, name: v, id: isNew ? v : d.id })} placeholder="مثال: الحوكمة والمجالس" />
      </AxField>
      <AxField label="اختصار" hint="يظهر في البطاقات">
        <AxInput value={d.short} onChange={v => setD({ ...d, short: v })} placeholder="مثال: حوكمة" />
      </AxField>
      <AxField label="وصف مختصر">
        <AxInput value={d.brief} onChange={v => setD({ ...d, brief: v })} placeholder="مثال: مجالس إدارة، لجان، مساهمين" />
      </AxField>
      <AxField label="اللون">
        <AxColorSwatchPicker value={colorPair} onChange={c => setD({ ...d, accent: c.accent, bg: c.bg })} />
      </AxField>
    </AxModal>
  );
}

// =========================================================================
// Pattern editor — now edits the 3 root patterns (rarely used)
// =========================================================================
function PatternEditor({ open, value, onClose, onSave }) {
  const [d, setD] = useStateED(() => value || {});
  useEffectED(() => { setD(value || {}); }, [value, open]);
  const isNew = !d.uid;

  const save = () => {
    const name = (d.name || d.id || '').trim();
    if (!name) return;
    onSave({ ...d, name, id: (d.id || name).trim() });
    onClose();
  };

  return (
    <AxModal
      open={open}
      title={isNew ? 'إضافة نمط رئيسي' : 'تعديل النمط الرئيسي'}
      subtitle="الأنماط الرئيسية الثلاثة (مفتوح / مغلق / هجين) يجب أن تبقى كما هي"
      onClose={onClose}
      width={600}
      footer={
        <>
          <AxBtn onClick={save}>حفظ</AxBtn>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <AxField label="الاسم العربي" required>
          <AxInput value={d.name || d.id} onChange={v => setD({ ...d, name: v, id: isNew ? v : d.id })} placeholder="مثال: مفتوح" />
        </AxField>
        <AxField label="Label إنجليزي">
          <AxInput value={d.shortEn} onChange={v => setD({ ...d, shortEn: v })} placeholder="Open" />
        </AxField>
      </div>
      <AxField label="الوصف">
        <AxTextarea value={d.desc} onChange={v => setD({ ...d, desc: v })} rows={3} />
      </AxField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <AxField label="أيقونة">
          <AxInput value={d.icon} onChange={v => setD({ ...d, icon: v })} placeholder="○" />
        </AxField>
        <AxField label="الدرجة اللونية (Hue)" hint="0–360">
          <input type="range" min={0} max={360} step={5}
            value={d.hue ?? 220}
            onChange={e => setD({ ...d, hue: +e.target.value })}
            style={{ width: '100%' }} />
          <div style={{ marginTop: 6, height: 8, borderRadius: 4, background: `oklch(0.5 0.14 ${d.hue ?? 220})` }} />
        </AxField>
      </div>
      <AxField label="أمثلة" hint="Enter لإضافة">
        <AxTagInput value={d.examples || []} onChange={v => setD({ ...d, examples: v })} placeholder="أضف مثالاً..." />
      </AxField>
    </AxModal>
  );
}

// =========================================================================
// Case editor — new structure
// =========================================================================
function CaseEditor({ open, value, onClose, onSave, categories, patterns, traits }) {
  const [d, setD] = useStateED(() => value || {});
  useEffectED(() => { setD(value || {}); }, [value, open]);
  const isNew = !d.uid;

  // Filter traits compatible with the chosen root pattern
  const compatibleTraits = useMemoED(() => {
    if (!d.suggestedRootPattern) return traits || [];
    return (traits || []).filter(t => !t.allowedRoots || t.allowedRoots.includes(d.suggestedRootPattern));
  }, [traits, d.suggestedRootPattern]);

  const save = () => {
    if (!d.name?.trim()) return;
    // Drop any traits that aren't valid for the selected root
    const validTraitIds = new Set(compatibleTraits.map(t => t.id));
    const cleanedTraits = (d.suggestedTraits || []).filter(tid => validTraitIds.has(tid));
    onSave({
      ...d,
      name: d.name.trim(),
      suggestedSectors: d.suggestedSectors || [],
      suggestedRootPattern: d.suggestedRootPattern || '',
      suggestedTraits: cleanedTraits,
    });
    onClose();
  };

  const toggleSector = (id) => {
    const cur = d.suggestedSectors || [];
    setD({ ...d, suggestedSectors: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] });
  };
  const toggleTrait = (id) => {
    const cur = d.suggestedTraits || [];
    setD({ ...d, suggestedTraits: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] });
  };

  // Group traits by category for display
  const traitsByGroup = useMemoED(() => {
    const g = {};
    compatibleTraits.forEach(t => {
      if (!g[t.group]) g[t.group] = [];
      g[t.group].push(t);
    });
    return g;
  }, [compatibleTraits]);

  return (
    <AxModal
      open={open}
      title={isNew ? 'إضافة نوع مجتمع' : 'تعديل النوع'}
      subtitle="نوع المجتمع = قالب جاهز يمكن استخدامه عند تسجيل عميل"
      onClose={onClose}
      width={680}
      footer={
        <>
          <AxBtn onClick={save}>حفظ</AxBtn>
          <AxBtn kind="secondary" onClick={onClose}>إلغاء</AxBtn>
        </>
      }
    >
      <AxField label="اسم النوع" required>
        <AxInput value={d.name} onChange={v => setD({ ...d, name: v })} placeholder="مثال: مجلس الإدارة" />
      </AxField>
      <AxField label="الوصف">
        <AxTextarea value={d.desc} onChange={v => setD({ ...d, desc: v })} rows={3} placeholder="وصف مختصر لهذا النوع من المجتمعات" />
      </AxField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <AxField label="نوع الجهة">
          <AxInput value={d.entity} onChange={v => setD({ ...d, entity: v })} placeholder="شركة مساهمة" />
        </AxField>
        <AxField label="مثال واقعي">
          <AxInput value={d.example} onChange={v => setD({ ...d, example: v })} placeholder="أرامكو / سابك" />
        </AxField>
      </div>

      <AxField label="النمط الرئيسي المقترح" required>
        <div style={{ display: 'flex', gap: 8 }}>
          {patterns.map(p => {
            const active = d.suggestedRootPattern === p.id;
            return (
              <button key={p.uid} onClick={() => setD({ ...d, suggestedRootPattern: p.id })}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10,
                  border: active ? `2px solid oklch(0.5 0.15 ${p.hue})` : '1px solid var(--line)',
                  background: active ? `oklch(0.97 0.02 ${p.hue})` : '#fff',
                  color: active ? `oklch(0.3 0.15 ${p.hue})` : 'var(--ink-2)',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 600 : 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                }}>
                <span style={{ fontSize: 15 }}>{p.icon}</span>
                {p.id}
              </button>
            );
          })}
        </div>
      </AxField>

      <AxField label="القطاعات المقترحة" hint="يمكن اختيار أكثر من قطاع">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {categories.map(c => {
            const on = (d.suggestedSectors || []).includes(c.id);
            return (
              <button key={c.uid} onClick={() => toggleSector(c.id)}
                style={{
                  padding: '5px 11px', borderRadius: 999,
                  border: on ? 'none' : '1px solid var(--line)',
                  background: on ? c.bg : '#fff',
                  color: on ? c.accent : 'var(--ink-2)',
                  fontFamily: 'inherit', fontSize: 11.5, fontWeight: on ? 600 : 500, cursor: 'pointer',
                }}>
                {c.name || c.id}
              </button>
            );
          })}
        </div>
      </AxField>

      <AxField label="الخصائص المقترحة" hint={d.suggestedRootPattern ? 'الخصائص المتوافقة مع النمط المختار' : 'اختر النمط الرئيسي أولاً'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(traitsByGroup).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>
                {group}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {items.map(t => {
                  const on = (d.suggestedTraits || []).includes(t.id);
                  return (
                    <button key={t.uid} onClick={() => toggleTrait(t.id)}
                      title={t.desc}
                      style={{
                        padding: '4px 10px', borderRadius: 999,
                        border: on ? 'none' : '1px solid var(--line)',
                        background: on ? 'oklch(0.94 0.05 310)' : '#fff',
                        color: on ? 'oklch(0.35 0.15 310)' : 'var(--ink-2)',
                        fontFamily: 'inherit', fontSize: 11, fontWeight: on ? 600 : 500, cursor: 'pointer',
                      }}>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </AxField>
    </AxModal>
  );
}

Object.assign(window, { CategoryEditor, PatternEditor, CaseEditor });
