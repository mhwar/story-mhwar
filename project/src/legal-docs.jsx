// Legal documents — Terms & Privacy in the mhwar.com visual style.
// Sidebar TOC on the right, numbered sections on the left, inline edit + add.
// Content persisted in localStorage under 'mhwar:legal.v1'.

const { useState: useStateLD, useEffect: useEffectLD, useMemo: useMemoLD, useRef: useRefLD } = React;

const LEGAL_STORAGE_KEY = 'mhwar:legal.v2';

// ---------- Default content (privacy scraped from mhwar.com screenshots) ----------
const LEGAL_DEFAULTS = {
  privacy: {
    title: 'سياسة الخصوصية',
    subtitle: 'نلتزم بحماية خصوصيتكم وشفافية كاملة حول كيفية تعاملنا مع بياناتكم.',
    updated: '22 أبريل 2026',
    sections: [
      {
        id: 'intro',
        title: 'مقدمة',
        icon: '◇',
        blocks: [
          { type: 'p', text: 'نُقدّر ثقتكم في نظام محور، ونلتزم بحماية خصوصيتكم والبيانات التي تشاركونها عند استخدام منصتنا. توضح هذه السياسة كيفية جمع واستخدام وتخزين ومعالجة المعلومات المتعلقة بالمستخدمين. باستخدامك للمنصة، فإنك توافق على الشروط المذكورة أدناه.' },
        ],
      },
      {
        id: 'collect',
        title: 'المعلومات التي نجمعها',
        icon: '▤',
        blocks: [
          { type: 'p', text: 'قد نقوم بجمع الأنواع التالية من المعلومات:' },
          { type: 'h', text: 'أ. بيانات التعريف الشخصية' },
          { type: 'list', items: [
            'الاسم الكامل',
            'البريد الإلكتروني',
            'رقم الجوال',
            'العنوان (عند الحاجة)',
            'المحتوى المُرسل من قِبلك',
            'أي معلومات تقوم بإدخالها ضمن نماذج التسجيل أو الطلبات أو الاستفسارات',
          ]},
          { type: 'h', text: 'ب. بيانات الاستخدام' },
          { type: 'p', text: 'يتم جمع بيانات غير مباشرة من خلال تفاعلك مع المنصة، وتشمل:' },
          { type: 'list', items: [
            'عنوان الـ IP',
            'نوع المتصفح ونظام التشغيل',
            'الصفحات التي تمت زيارتها',
            'توقيت الدخول والخروج',
            'سلوك التصفح داخل المنصة',
          ]},
        ],
      },
      {
        id: 'use',
        title: 'كيفية استخدام المعلومات',
        icon: '⚙',
        blocks: [
          { type: 'p', text: 'نستخدم المعلومات التي نجمعها للأغراض التالية:' },
          { type: 'list', items: [
            'تحسين وتطوير خدماتنا وتجربة المستخدم',
            'إدارة حسابات المستخدمين والطلبات',
            'إرسال إشعارات وتنبيهات متعلقة بالخدمة',
            'الرد على استفسارات الدعم الفني',
            'ضمان الامتثال القانوني والسياسات الداخلية',
          ]},
        ],
      },
      {
        id: 'protect',
        title: 'حماية البيانات',
        icon: '♥',
        blocks: [
          { type: 'p', text: 'نلتزم باتخاذ الإجراءات المناسبة لحماية بياناتك:' },
          { type: 'list', items: [
            'استخدام بروتوكولات أمان وتقنيات تشفير مناسبة',
            'تقييد الوصول إلى البيانات الحساسة للمخوّلين فقط',
            'مراجعة دورية لإجراءات الأمان والتخزين',
          ]},
          { type: 'note', text: 'لا يمكن ضمان أمان تام 100٪ على الإنترنت، ونحث المستخدمين على اختيار كلمات مرور قوية وعدم مشاركتها مع الآخرين.' },
        ],
      },
      {
        id: 'sharing',
        title: 'مشاركة المعلومات',
        icon: '↹',
        blocks: [
          { type: 'p', text: 'لا نشارك معلوماتك الشخصية مع أي طرف ثالث، إلا في الحالات التالية:' },
          { type: 'list', items: [
            'بأمر قانوني أو جهة تنظيمية مختصة',
            'عند الضرورة للتعامل مع خدمات أطراف خارجية داعمة للمنصة (مثل مزودي الدفع)، وذلك وفق اتفاقيات حماية البيانات',
            'في حالات إساءة استخدام المنصة أو خرق الشروط',
          ]},
        ],
      },
      {
        id: 'delete',
        title: 'حذف الحساب والبيانات',
        icon: '⌫',
        blocks: [
          { type: 'p', text: 'يحق لك طلب حذف حسابك وجميع بياناتك نهائياً عبر التواصل معنا على البريد الإلكتروني التالي:' },
          { type: 'email', text: 'info@mhwar.sa' },
        ],
      },
      {
        id: 'children',
        title: 'خصوصية الأطفال',
        icon: '⁂',
        blocks: [
          { type: 'p', text: 'لا تستهدف خدماتنا الأطفال دون سن 18 عاماً. إذا تبيّن لنا جمع بيانات من قُصّر دون علم أو موافقة ولي الأمر، فسيتم حذفها فوراً.' },
        ],
      },
      {
        id: 'thirdparty',
        title: 'روابط ومواقع الطرف الثالث',
        icon: '⇗',
        blocks: [
          { type: 'p', text: 'قد تحتوي منصتنا على روابط لمواقع أو خدمات خارجية. لسنا مسؤولين عن محتوى أو ممارسات الخصوصية لتلك المواقع، ويخضع استخدامها لسياسات تلك الأطراف.' },
        ],
      },
      {
        id: 'updates',
        title: 'تحديث السياسة',
        icon: '↻',
        blocks: [
          { type: 'p', text: 'نحتفظ بحق تعديل سياسة الخصوصية في أي وقت. سيتم إشعار المستخدمين بالتغييرات الجوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة. يُرجى مراجعة هذه الصفحة دورياً.' },
        ],
      },
      {
        id: 'disclaimer',
        title: 'إخلاء المسؤولية',
        icon: '⊘',
        blocks: [
          { type: 'p', text: 'نظام محور غير مسؤول عن أي أضرار مباشرة أو غير مباشرة قد تنجم عن استخدامك أو عدم قدرتك على استخدام المنصة، بما في ذلك فقدان البيانات أو التعطيل المؤقت للخدمة.' },
        ],
      },
      {
        id: 'contact',
        title: 'الاتصال بنا',
        icon: '✉',
        blocks: [
          { type: 'p', text: 'للاستفسارات أو الملاحظات المتعلقة بسياسة الخصوصية، يُرجى التواصل معنا عبر:' },
          { type: 'email', text: 'info@mhwar.sa' },
        ],
      },
    ],
  },
  terms: {
    title: 'شروط الاستخدام',
    subtitle: 'باستخدامك منصّة محور فإنك توافق على الالتزام بهذه الشروط والأحكام.',
    updated: '22 أبريل 2026',
    sections: [
      {
        id: 'intro',
        title: 'مقدمة',
        icon: '▤',
        blocks: [
          { type: 'p', text: 'أهلًا بك في منصة نظام محور. باستخدامك للمنصة أو أي من خدماتنا، فإنك توافق على الالتزام بشروط الاستخدام التالية. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام المنصة.' },
        ],
      },
      {
        id: 'service',
        title: 'طبيعة الخدمة',
        icon: '◈',
        blocks: [
          { type: 'p', text: 'نظام محور هو منصة إلكترونية تُمكّن المستخدمين من إدارة وحجز الطاولات، بيع الكراسي للمباريات، إدارة الطلبات، وبيع التذاكر الخاصة بالمطاعم والمقاهي. يتم تقديم الخدمة كما هي دون أي ضمانات صريحة أو ضمنية.' },
        ],
      },
      {
        id: 'signup',
        title: 'شروط التسجيل',
        icon: '♣',
        blocks: [
          { type: 'list', items: [
            'يجب أن يكون عمر المستخدم 18 عامًا أو أكثر.',
            'يلتزم المستخدم بتقديم بيانات دقيقة وحديثة عند التسجيل.',
            'يُمنع مشاركة بيانات الدخول مع أطراف أخرى.',
            'يحق لإدارة المنصة تعليق أو إلغاء الحساب في حال الإخلال بالشروط أو استخدام غير مشروع.',
          ]},
        ],
      },
      {
        id: 'duties',
        title: 'التزامات المستخدم',
        icon: '✓',
        blocks: [
          { type: 'list', items: [
            'استخدام المنصة لأغراض قانونية فقط.',
            'عدم استخدام المنصة للإساءة أو الاحتيال أو نشر محتوى مخالف للقانون أو الأدب العام.',
            'تحمل كامل المسؤولية عن المعلومات والمحتوى الذي يقوم المستخدم بنشره أو رفعه.',
          ]},
        ],
      },
      {
        id: 'ip',
        title: 'حقوق الملكية الفكرية',
        icon: '©',
        blocks: [
          { type: 'p', text: 'جميع حقوق الملكية الفكرية للمنصة ومحتواها وخدماتها مملوكة لـ نظام محور، ويُحظر نسخ أو إعادة استخدام أو استغلال أي جزء من المنصة دون إذن كتابي مسبق.' },
        ],
      },
      {
        id: 'disclaimer',
        title: 'إخلاء المسؤولية',
        icon: '⊙',
        blocks: [
          { type: 'list', items: [
            'نظام محور لا يتحمل أي مسؤولية عن دقة أو قانونية المحتوى أو الفعاليات أو العروض التي تتم عبر المنصة.',
            'لا نتحمل أي مسؤولية عن الخسائر أو الأضرار الناتجة عن استخدام المنصة.',
            'نظام محور غير مسؤول عن أي تعاملات مالية تتم بين المنظمين والمستخدمين عبر المنصة.',
          ]},
        ],
      },
      {
        id: 'payments',
        title: 'سياسة الدفع والاسترداد',
        icon: '◐',
        blocks: [
          { type: 'list', items: [
            'تختلف سياسات الدفع والاسترداد حسب طبيعة كل طلب أو فعالية.',
            'يُرجى قراءة شروط كل عرض أو فعالية قبل الحجز أو الدفع.',
            'تحتفظ المنصة بحقها في تحصيل رسوم الخدمة أو رسوم إضافية حسب الاشتراك أو الخدمات المقدمة.',
          ]},
        ],
      },
      {
        id: 'changes',
        title: 'التعديلات على الشروط',
        icon: '✎',
        blocks: [
          { type: 'p', text: 'يحتفظ نظام محور بحق تعديل شروط الاستخدام في أي وقت، وسيتم إعلام المستخدمين بالتحديثات الجوهرية. استمرارك في استخدام المنصة بعد التعديلات يُعد قبولًا بالشروط الجديدة.' },
        ],
      },
      {
        id: 'termination',
        title: 'إنهاء الحساب',
        icon: '⊗',
        blocks: [
          { type: 'list', items: [
            'يمكن للمستخدم إنهاء حسابه في أي وقت عبر طلب ذلك من خلال البريد الإلكتروني الرسمي.',
            'ويحق للمنصة إنهاء أو تعليق الحساب في أي وقت عند وجود مخالفات أو شبهات إساءة استخدام.',
          ]},
        ],
      },
      {
        id: 'law',
        title: 'القانون المطبق والاختصاص القضائي',
        icon: '⚖',
        blocks: [
          { type: 'p', text: 'تخضع هذه الشروط لقوانين المملكة العربية السعودية، وأي نزاع ينشأ يُحال للمحاكم المختصة في السعودية.' },
        ],
      },
      {
        id: 'contact',
        title: 'الاتصال بنا',
        icon: '✉',
        blocks: [
          { type: 'p', text: 'للاستفسارات المتعلقة بشروط الاستخدام، يرجى التواصل معنا عبر:' },
          { type: 'email', text: 'info@mhwar.sa' },
        ],
      },
    ],
  },
};

// ---------- Store ----------
function loadLegal() {
  try {
    const raw = localStorage.getItem(LEGAL_STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(LEGAL_DEFAULTS));
    const parsed = JSON.parse(raw);
    // ensure both docs exist
    return {
      privacy: parsed.privacy || JSON.parse(JSON.stringify(LEGAL_DEFAULTS.privacy)),
      terms: parsed.terms || JSON.parse(JSON.stringify(LEGAL_DEFAULTS.terms)),
    };
  } catch (e) {
    return JSON.parse(JSON.stringify(LEGAL_DEFAULTS));
  }
}
function saveLegal(data) {
  try { localStorage.setItem(LEGAL_STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

// ---------- Printable export ----------
function buildLegalDocHtml(doc) {
  let body = `<h1>${doc.title}</h1><p class="lead">${doc.subtitle || ''}</p><p style="font-size:12px;color:#8a877f">آخر تحديث: ${doc.updated || ''}</p>`;
  (doc.sections || []).forEach((sec, idx) => {
    body += `<h2>${idx + 1}. ${sec.title || ''}</h2>`;
    (sec.blocks || []).forEach(b => {
      if (b.type === 'h') body += `<h3>${b.text || ''}</h3>`;
      else if (b.type === 'list') body += `<ul>${(b.items || []).map(it => `<li>${it}</li>`).join('')}</ul>`;
      else if (b.type === 'note') body += `<div class="note">${b.text || ''}</div>`;
      else if (b.type === 'email') body += `<p><a href="mailto:${b.email || b.value || ''}">${b.email || b.value || ''}</a></p>`;
      else body += `<p>${b.text || ''}</p>`;
    });
  });
  return body;
}

// ---------- Main component ----------
function LegalDoc({ data }) {
  const docKey = data?.docKey || 'privacy';
  const [store, setStore] = useStateLD(loadLegal);
  const doc = store[docKey] || LEGAL_DEFAULTS[docKey];
  const [activeId, setActiveId] = useStateLD(doc.sections[0]?.id);
  const [editingSection, setEditingSection] = useStateLD(null); // section id in edit mode
  const [editingHeader, setEditingHeader] = useStateLD(false);

  useEffectLD(() => { saveLegal(store); }, [store]);
  useEffectLD(() => {
    setActiveId(doc.sections[0]?.id);
    setEditingSection(null);
    setEditingHeader(false);
  }, [docKey]);

  // Intersection observer for active section
  const bodyRef = useRefLD(null);
  useEffectLD(() => {
    if (!bodyRef.current) return;
    const sectionEls = [...bodyRef.current.querySelectorAll('[data-section-id]')];
    if (!sectionEls.length) return;
    const onScroll = () => {
      const scroller = bodyRef.current;
      if (!scroller) return;
      const top = scroller.scrollTop + 100;
      let curr = sectionEls[0].dataset.sectionId;
      for (const el of sectionEls) {
        if (el.offsetTop <= top) curr = el.dataset.sectionId;
      }
      setActiveId(curr);
    };
    const scroller = bodyRef.current;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [doc.sections.length, docKey]);

  const updateDoc = (patch) => setStore(s => ({ ...s, [docKey]: { ...s[docKey], ...patch } }));
  const updateSection = (sid, patch) => updateDoc({
    sections: doc.sections.map(s => s.id === sid ? { ...s, ...patch } : s),
  });
  const addSection = () => {
    const newId = 'sec_' + Date.now().toString(36);
    updateDoc({
      sections: [...doc.sections, {
        id: newId,
        title: '',
        icon: '◇',
        blocks: [],
        isEmpty: true,
      }],
    });
    setEditingSection(newId);
    setTimeout(() => {
      bodyRef.current?.querySelector(`[data-section-id="${newId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };
  const removeSection = (sid) => {
    if (!confirm('حذف هذا القسم؟')) return;
    updateDoc({ sections: doc.sections.filter(s => s.id !== sid) });
    setEditingSection(null);
  };
  const resetDoc = () => {
    if (!confirm('استعادة النص الأصلي؟ سيتم فقد أي تعديلات.')) return;
    setStore(s => ({ ...s, [docKey]: JSON.parse(JSON.stringify(LEGAL_DEFAULTS[docKey])) }));
    setEditingSection(null);
  };

  const scrollToSection = (sid) => {
    const el = bodyRef.current?.querySelector(`[data-section-id="${sid}"]`);
    if (el && bodyRef.current) {
      bodyRef.current.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' });
    }
    setActiveId(sid);
  };

  return (
    <div style={legalStyles.root} dir="rtl" ref={bodyRef}>
      <div style={legalStyles.page}>
        {/* Header */}
        <div style={legalStyles.header}>
          {editingHeader ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 720, margin: '0 auto', width: '100%' }}>
              <input
                value={doc.title}
                onChange={(e) => updateDoc({ title: e.target.value })}
                style={legalStyles.titleInput}
                placeholder="عنوان المستند"
              />
              <textarea
                value={doc.subtitle}
                onChange={(e) => updateDoc({ subtitle: e.target.value })}
                rows={2}
                style={legalStyles.subtitleInput}
                placeholder="وصف قصير"
              />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label style={{ fontSize: 12, color: 'var(--muted)' }}>تاريخ التحديث:</label>
                <input
                  value={doc.updated}
                  onChange={(e) => updateDoc({ updated: e.target.value })}
                  style={{ ...legalStyles.smallInput, flex: 1 }}
                  placeholder="مثلاً: 22 أبريل 2026"
                />
                <button onClick={() => setEditingHeader(false)} style={legalStyles.btnPrimary}>تم</button>
              </div>
            </div>
          ) : (
            <>
              <h1 style={legalStyles.title}>{doc.title}</h1>
              <div style={legalStyles.updated}>آخر تحديث: {doc.updated}</div>
              <div style={legalStyles.subtitle}>{doc.subtitle}</div>
              <div style={legalStyles.headerActions}>
                <button onClick={() => (window.refPrintDoc ? window.refPrintDoc(doc.title, buildLegalDocHtml(doc)) : null)} style={legalStyles.btnGhost} title="تنزيل المستند">⭳ تنزيل</button>
                <button onClick={() => setEditingHeader(true)} style={legalStyles.btnGhost} title="تعديل الترويسة">✎ تعديل</button>
                <button onClick={resetDoc} style={legalStyles.btnGhost} title="استعادة النص الأصلي">↻ استعادة</button>
              </div>
            </>
          )}
        </div>

        {/* Body grid: TOC on right (first in DOM for RTL), content on left */}
        <div style={legalStyles.grid}>
          {/* TOC */}
          <aside style={legalStyles.toc}>
            <div style={legalStyles.tocLabel}>المحتويات</div>
            <div style={legalStyles.tocList}>
              {doc.sections.map((sec, idx) => {
                const active = sec.id === activeId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    style={{ ...legalStyles.tocItem, ...(active ? legalStyles.tocItemActive : {}) }}
                  >
                    {active && <span style={legalStyles.tocBar}/>}
                    <span style={legalStyles.tocText}>{sec.title || 'بدون عنوان'}</span>
                    <span className="mono" style={legalStyles.tocNum}>{String(idx + 1).padStart(2, '0')}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Sections */}
          <div style={legalStyles.content}>
            {doc.sections.map((sec, idx) => (
              <SectionCard
                key={sec.id}
                section={sec}
                index={idx}
                isEditing={editingSection === sec.id}
                onEdit={() => setEditingSection(sec.id)}
                onDoneEdit={() => setEditingSection(null)}
                onChange={(patch) => updateSection(sec.id, patch)}
                onRemove={() => removeSection(sec.id)}
              />
            ))}
            <button onClick={addSection} style={legalStyles.addBtn}>
              <span style={{ fontSize: 16, marginInlineEnd: 6 }}>+</span> إضافة قسم جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Section card ----------
function SectionCard({ section, index, isEditing, onEdit, onDoneEdit, onChange, onRemove }) {
  const sec = section;
  const isEmpty = !sec.title?.trim() && (!sec.blocks || sec.blocks.length === 0);

  const updateBlock = (i, patch) => {
    const blocks = [...(sec.blocks || [])];
    blocks[i] = { ...blocks[i], ...patch };
    onChange({ blocks });
  };
  const addBlock = (type) => {
    const b = type === 'list' ? { type: 'list', items: [''] }
            : type === 'h'    ? { type: 'h', text: '' }
            : type === 'note' ? { type: 'note', text: '' }
            : type === 'email'? { type: 'email', text: '' }
            : { type: 'p', text: '' };
    onChange({ blocks: [...(sec.blocks || []), b] });
  };
  const removeBlock = (i) => {
    onChange({ blocks: (sec.blocks || []).filter((_, j) => j !== i) });
  };

  return (
    <section data-section-id={sec.id} style={legalStyles.section}>
      <div style={legalStyles.sectionHead}>
        {isEditing ? (
          <>
            <input
              value={sec.icon || ''}
              onChange={(e) => onChange({ icon: e.target.value })}
              style={{ ...legalStyles.iconInput }}
              placeholder="◇"
              maxLength={2}
            />
            <input
              value={sec.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              style={legalStyles.sectionTitleInput}
              placeholder="عنوان القسم"
              autoFocus
            />
            <span className="mono" style={legalStyles.sectionNum}>{String(index + 1).padStart(2, '0')}</span>
          </>
        ) : (
          <>
            <div style={legalStyles.sectionIcon}>{sec.icon || '◇'}</div>
            <h2 style={legalStyles.sectionTitle}>{sec.title || <em style={{ color: 'var(--faint)', fontStyle: 'normal' }}>بدون عنوان — انقر للتعديل</em>}</h2>
            <span className="mono" style={legalStyles.sectionNum}>{String(index + 1).padStart(2, '0')}</span>
            <div style={legalStyles.sectionTools}>
              <button onClick={onEdit} style={legalStyles.toolBtn} title="تعديل القسم">✎</button>
              <button onClick={onRemove} style={legalStyles.toolBtn} title="حذف القسم">✕</button>
            </div>
          </>
        )}
      </div>

      <div style={legalStyles.sectionBody}>
        {isEmpty && !isEditing && (
          <div style={legalStyles.emptyBlock}>
            <div style={legalStyles.emptyDot}>○</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 4 }}>هذا القسم فارغ</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>انقر على ✎ لإضافة محتوى.</div>
            </div>
          </div>
        )}

        {(sec.blocks || []).map((b, i) => (
          <BlockView
            key={i}
            block={b}
            isEditing={isEditing}
            onChange={(patch) => updateBlock(i, patch)}
            onRemove={() => removeBlock(i)}
          />
        ))}

        {isEditing && (
          <div style={legalStyles.editBar}>
            <button onClick={() => addBlock('p')}     style={legalStyles.editBtn}>+ فقرة</button>
            <button onClick={() => addBlock('h')}     style={legalStyles.editBtn}>+ عنوان فرعي</button>
            <button onClick={() => addBlock('list')}  style={legalStyles.editBtn}>+ قائمة</button>
            <button onClick={() => addBlock('note')}  style={legalStyles.editBtn}>+ تنبيه</button>
            <button onClick={() => addBlock('email')} style={legalStyles.editBtn}>+ بريد</button>
            <div style={{ flex: 1 }}/>
            <button onClick={onDoneEdit} style={legalStyles.btnPrimary}>تم</button>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Block view (p / h / list / note / email) ----------
function BlockView({ block, isEditing, onChange, onRemove }) {
  if (block.type === 'p') {
    return (
      <div style={legalStyles.blockWrap}>
        {isEditing ? (
          <textarea
            value={block.text || ''}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={3}
            style={legalStyles.textArea}
            placeholder="اكتب الفقرة..."
          />
        ) : (
          <p style={legalStyles.p}>{block.text}</p>
        )}
        {isEditing && <button onClick={onRemove} style={legalStyles.rmBtn}>✕</button>}
      </div>
    );
  }
  if (block.type === 'h') {
    return (
      <div style={legalStyles.blockWrap}>
        {isEditing ? (
          <input
            value={block.text || ''}
            onChange={(e) => onChange({ text: e.target.value })}
            style={legalStyles.textInput}
            placeholder="عنوان فرعي"
          />
        ) : (
          <h3 style={legalStyles.h3}>{block.text}</h3>
        )}
        {isEditing && <button onClick={onRemove} style={legalStyles.rmBtn}>✕</button>}
      </div>
    );
  }
  if (block.type === 'note') {
    return (
      <div style={legalStyles.blockWrap}>
        {isEditing ? (
          <textarea
            value={block.text || ''}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={2}
            style={legalStyles.textArea}
            placeholder="نصّ تنبيه"
          />
        ) : (
          <div style={legalStyles.note}>
            <span style={legalStyles.noteIcon}>⚠</span>
            <span><b>تنويه:</b> {block.text}</span>
          </div>
        )}
        {isEditing && <button onClick={onRemove} style={legalStyles.rmBtn}>✕</button>}
      </div>
    );
  }
  if (block.type === 'email') {
    return (
      <div style={legalStyles.blockWrap}>
        {isEditing ? (
          <input
            value={block.text || ''}
            onChange={(e) => onChange({ text: e.target.value })}
            style={legalStyles.textInput}
            placeholder="email@example.com"
          />
        ) : (
          <a href={`mailto:${block.text}`} style={legalStyles.emailLink}>
            {block.text} <span style={{ opacity: 0.6, marginInlineStart: 6 }}>✉</span>
          </a>
        )}
        {isEditing && <button onClick={onRemove} style={legalStyles.rmBtn}>✕</button>}
      </div>
    );
  }
  if (block.type === 'list') {
    const items = block.items || [];
    return (
      <div style={legalStyles.blockWrap}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: 'var(--faint)', fontSize: 14 }}>•</span>
                <input
                  value={it}
                  onChange={(e) => {
                    const next = [...items]; next[i] = e.target.value;
                    onChange({ items: next });
                  }}
                  style={{ ...legalStyles.textInput, flex: 1 }}
                  placeholder="عنصر قائمة"
                />
                <button
                  onClick={() => onChange({ items: items.filter((_, j) => j !== i) })}
                  style={legalStyles.rmBtnInline}
                  title="حذف"
                >✕</button>
              </div>
            ))}
            <button onClick={() => onChange({ items: [...items, ''] })} style={legalStyles.editBtnInline}>+ عنصر</button>
          </div>
        ) : (
          <ul style={legalStyles.ul}>
            {items.map((it, i) => <li key={i} style={legalStyles.li}>{it}</li>)}
          </ul>
        )}
        {isEditing && <button onClick={onRemove} style={legalStyles.rmBtn}>✕ حذف القائمة</button>}
      </div>
    );
  }
  return null;
}

// ---------- Styles ----------
const legalStyles = {
  root: {
    height: '100%', overflowY: 'auto',
    background: 'var(--bg, #faf8f3)',
    color: 'var(--ink, #14130f)',
    fontFamily: 'inherit',
  },
  page: {
    maxWidth: 1240, margin: '0 auto',
    padding: '60px 48px 120px',
  },
  header: {
    textAlign: 'center', marginBottom: 60,
    position: 'relative',
  },
  title: {
    fontSize: 56, fontWeight: 700,
    letterSpacing: -1, lineHeight: 1.1,
    margin: '0 0 12px',
  },
  titleInput: {
    fontSize: 40, fontWeight: 700, letterSpacing: -0.8,
    textAlign: 'center', width: '100%',
    border: '1px dashed var(--line)', borderRadius: 10,
    padding: '8px 14px', fontFamily: 'inherit',
    background: '#fff',
  },
  updated: {
    fontSize: 12, color: 'var(--muted)',
    marginBottom: 14, fontFamily: 'var(--mono, ui-monospace, monospace)',
  },
  subtitle: {
    fontSize: 14.5, color: 'var(--ink-2)',
    maxWidth: 620, margin: '0 auto',
    lineHeight: 1.6,
  },
  subtitleInput: {
    fontSize: 14, textAlign: 'center', width: '100%',
    border: '1px dashed var(--line)', borderRadius: 10,
    padding: '8px 14px', fontFamily: 'inherit', resize: 'vertical',
    background: '#fff', color: 'var(--ink-2)',
  },
  smallInput: {
    fontSize: 12, padding: '6px 10px',
    border: '1px solid var(--line)', borderRadius: 8,
    fontFamily: 'inherit', background: '#fff',
  },
  headerActions: {
    marginTop: 18, display: 'flex', gap: 8, justifyContent: 'center',
  },
  btnGhost: {
    padding: '6px 12px', borderRadius: 999,
    background: '#fff', border: '1px solid var(--line)',
    color: 'var(--ink-2)', fontSize: 12,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  btnPrimary: {
    padding: '8px 16px', borderRadius: 8,
    background: 'var(--ink)', color: '#fff',
    border: 'none', fontSize: 12.5, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '220px minmax(0, 1fr)',
    gap: 60,
    alignItems: 'start',
  },
  content: {
    display: 'flex', flexDirection: 'column', gap: 8,
    minWidth: 0,
  },

  // Sections
  section: {
    padding: '32px 0',
    borderBottom: '1px solid var(--line)',
  },
  sectionHead: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 16,
  },
  sectionIcon: {
    width: 28, height: 28, borderRadius: 14,
    background: 'oklch(0.94 0.02 70)',
    color: 'var(--ink-2)',
    display: 'grid', placeItems: 'center',
    fontSize: 14, flexShrink: 0,
    border: '1px solid var(--line)',
  },
  sectionTitle: {
    fontSize: 22, fontWeight: 600, letterSpacing: -0.3,
    margin: 0, flex: 1,
  },
  sectionTitleInput: {
    fontSize: 22, fontWeight: 600, letterSpacing: -0.3,
    flex: 1, border: '1px dashed var(--line)', borderRadius: 8,
    padding: '4px 10px', fontFamily: 'inherit',
    background: '#fff',
  },
  iconInput: {
    width: 40, height: 32, textAlign: 'center',
    border: '1px dashed var(--line)', borderRadius: 8,
    fontFamily: 'inherit', fontSize: 14, background: '#fff',
  },
  sectionNum: {
    fontSize: 12, color: 'var(--muted)',
  },
  sectionTools: {
    display: 'flex', gap: 4, opacity: 0, transition: 'opacity .15s',
  },
  toolBtn: {
    width: 28, height: 28, borderRadius: 7,
    background: '#fff', border: '1px solid var(--line)',
    color: 'var(--ink-2)', fontSize: 12,
    fontFamily: 'inherit', cursor: 'pointer',
    display: 'inline-grid', placeItems: 'center',
  },
  sectionBody: {
    paddingInlineStart: 40,
  },

  // Blocks
  blockWrap: {
    position: 'relative', marginBottom: 12,
  },
  p: {
    fontSize: 14, color: 'var(--ink-2)',
    lineHeight: 1.9, margin: '0 0 12px',
  },
  h3: {
    fontSize: 15, fontWeight: 600, color: 'var(--ink)',
    margin: '16px 0 8px',
  },
  ul: {
    listStyle: 'none', padding: 0, margin: '0 0 12px',
  },
  li: {
    fontSize: 14, color: 'var(--ink-2)',
    lineHeight: 1.85, padding: '2px 16px 2px 0',
    position: 'relative',
  },
  note: {
    display: 'flex', gap: 10, alignItems: 'flex-start',
    padding: '12px 14px', borderRadius: 10,
    background: 'oklch(0.97 0.03 70)',
    border: '1px solid oklch(0.92 0.04 70)',
    fontSize: 13, color: 'var(--ink-2)',
    lineHeight: 1.7, margin: '12px 0',
  },
  noteIcon: {
    color: 'oklch(0.55 0.12 60)', fontSize: 14, flexShrink: 0,
  },
  emailLink: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '12px 18px', borderRadius: 10,
    background: '#fff', border: '1px solid var(--line)',
    color: '#2b6cb8', fontSize: 14.5, fontWeight: 500,
    textDecoration: 'none',
  },

  // Editing bars / inputs
  textInput: {
    fontSize: 14, padding: '8px 12px',
    border: '1px solid var(--line)', borderRadius: 8,
    fontFamily: 'inherit', background: '#fff',
    color: 'var(--ink)', width: '100%',
  },
  textArea: {
    fontSize: 14, padding: '10px 12px',
    border: '1px solid var(--line)', borderRadius: 8,
    fontFamily: 'inherit', background: '#fff',
    color: 'var(--ink)', width: '100%',
    resize: 'vertical', lineHeight: 1.7,
  },
  editBar: {
    display: 'flex', flexWrap: 'wrap', gap: 6,
    padding: '12px 0 0',
    borderTop: '1px dashed var(--line)',
    marginTop: 14,
    alignItems: 'center',
  },
  editBtn: {
    padding: '5px 10px', borderRadius: 6,
    background: '#fff', border: '1px solid var(--line)',
    color: 'var(--ink-2)', fontSize: 11.5,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  editBtnInline: {
    padding: '4px 10px', borderRadius: 6,
    background: 'transparent', border: '1px dashed var(--line)',
    color: 'var(--muted)', fontSize: 11.5,
    fontFamily: 'inherit', cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  rmBtn: {
    position: 'absolute', top: -8, insetInlineEnd: -8,
    width: 22, height: 22, borderRadius: 11,
    background: '#fff', border: '1px solid var(--line)',
    color: 'var(--ink-2)', fontSize: 11,
    fontFamily: 'inherit', cursor: 'pointer',
    display: 'grid', placeItems: 'center',
  },
  rmBtnInline: {
    width: 24, height: 24, borderRadius: 6,
    background: '#fff', border: '1px solid var(--line)',
    color: 'var(--ink-2)', fontSize: 10,
    fontFamily: 'inherit', cursor: 'pointer',
  },

  // Empty
  emptyBlock: {
    display: 'flex', gap: 12, alignItems: 'center',
    padding: '14px 18px', borderRadius: 10,
    background: '#fbfaf7', border: '1px dashed var(--line)',
    marginBottom: 10,
  },
  emptyDot: {
    width: 28, height: 28, borderRadius: 14,
    display: 'grid', placeItems: 'center',
    border: '1px dashed var(--line)', color: 'var(--faint)',
    fontSize: 14,
  },
  addBtn: {
    marginTop: 32, padding: '16px',
    background: '#fbfaf7', border: '1px dashed var(--line)',
    borderRadius: 12, color: 'var(--ink-2)',
    fontSize: 13, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '100%',
  },

  // TOC
  toc: {
    position: 'sticky', top: 24,
    display: 'flex', flexDirection: 'column', gap: 2,
    paddingInlineEnd: 20,
    borderInlineEnd: '1px solid var(--line)',
  },
  tocLabel: {
    fontSize: 12, color: 'var(--ink-2)',
    fontWeight: 600, marginBottom: 10,
    paddingInlineEnd: 4,
  },
  tocList: {
    display: 'flex', flexDirection: 'column', gap: 0,
  },
  tocItem: {
    position: 'relative',
    display: 'flex', alignItems: 'center',
    gap: 10, padding: '8px 4px',
    background: 'transparent', border: 'none',
    color: 'var(--muted)', fontSize: 12.5,
    fontFamily: 'inherit', cursor: 'pointer',
    textAlign: 'right', justifyContent: 'space-between',
    transition: 'color .15s',
  },
  tocItemActive: {
    color: 'var(--ink)', fontWeight: 600,
  },
  tocBar: {
    position: 'absolute', insetInlineEnd: -6, top: 6, bottom: 6,
    width: 2, background: 'var(--ink)',
  },
  tocText: {
    flex: 1, minWidth: 0, overflow: 'hidden',
    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  tocNum: {
    fontSize: 10.5, color: 'var(--faint)',
    flexShrink: 0,
  },
};

// Hover reveal for section tools
if (typeof document !== 'undefined' && !document.getElementById('legal-hover-style')) {
  const s = document.createElement('style');
  s.id = 'legal-hover-style';
  s.textContent = `
    [data-section-id]:hover > div:first-child > div:last-child { opacity: 1 !important; }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { LegalDoc });
