/* ============================================================
   PROPOSAL — Client-facing persuasion deck
   Single export: buildProposalHTML(ctx)
   ctx = {
     client, cat, communities,
     resolvePattern, resolveTraits, resolveSourceCase,
     detailComIds, includeInvestment, shareLink,
   }
   Narrative:
     1. Cover
     2. Problem (personalized pains)
     3. Solution
     4. Matrix (all communities + legend explaining patterns)
     5..N. Community detail (optional — per-community custom copy)
     N+1. Roadmap (30/60/90)
     N+2. Investment (OPTIONAL — only when includeInvestment = true)
     N+3. Next step
   ============================================================ */

window.buildProposalHTML = function(ctx) {
  const {
    client, cat, communities,
    resolvePattern, resolveTraits, resolveSourceCase,
    detailComIds = [], includeInvestment = false, shareLink = '',
  } = ctx;

  // ---- helpers ----
  function hashCode(s) {
    let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    return h;
  }
  const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  // Wrap numbers so RTL Arabic text never mirrors them, and they use tabular figures.
  const N = (n) => `<span class="num">${esc(n)}</span>`;
  const num = (n) => String(n).padStart(2, '0');
  const dateStr = new Date().toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' });
  const sectorHue = cat ? (cat.accent?.match(/\d+(?=\))/)?.[0] || 60) : 60;
  const proposalNo = `MH-${new Date().getFullYear()}-${String(Math.abs(hashCode(client.uid || client.name || '')) % 1000).padStart(3,'0')}`;

  const detailCommunities = communities.filter(c => detailComIds.includes(c.uid));
  const totalTraits = communities.reduce((s, c) => s + (resolveTraits(c)?.length || 0), 0);
  const patternsSet = new Set(communities.map(c => resolvePattern(c)?.id).filter(Boolean));

  // total slides: cover, problem, solution, matrix, [details…], roadmap, [investment?], next
  const totalSlides = 6 + detailCommunities.length + (includeInvestment ? 1 : 0) + 1;

  const slideHead = (label, pageIdx, opts = {}) => `
    <div class="slide-head${opts.dark ? ' dark' : ''}">
      <div class="brand-row">
        <div class="brand${opts.dark ? ' inv' : ''}">محور <small>MHWAR</small></div>
        ${label ? `<div class="section-tag">${label}</div>` : ''}
        <div class="page-num${opts.dark ? ' inv' : ''}">${N(num(pageIdx))} / ${N(num(totalSlides))}</div>
      </div>
    </div>`;

  const slideFoot = (opts = {}) => `
    <div class="slide-foot${opts.dark ? ' inv' : ''}">
      <span>مقترح · ${esc(client.name)}</span>
      <span>${N(proposalNo)} · ${dateStr}</span>
    </div>`;

  // ---------- 1. Cover ----------
  const coverSlide = `
    <section class="slide cover" style="--hue:${sectorHue}">
      <div class="slide-grid">
        <div class="cover-top">
          <div class="brand-row">
            <div class="brand">محور <small>MHWAR</small></div>
            <div class="cover-badge">
              <span class="cb-k">مقترح</span>
              <span class="cb-v">${N(proposalNo)}</span>
            </div>
          </div>
        </div>
        <div class="cover-body">
          <div class="overline">مقترح شراكة · مخصّص</div>
          <h1 class="cover-title">
            <span class="ct-line1">منصّة واحدة</span>
            <span class="ct-line2">لإدارة <em>${esc(client.name)}</em></span>
            <span class="ct-line3">ومجتمعاتها الـ${N(communities.length)}.</span>
          </h1>
          <p class="cover-lede">
            وثيقة أُعدّت بعد حوارنا. تشرح كيف يكون محور البنية التحتية لتواصلكم مع
            <strong>${N(communities.length)} مجتمع${communities.length === 1 ? '' : 'اً'}</strong>،
            بأنماط تواصل متخصّصة و${N(totalTraits)} خاصية موصوفة لاحتياجكم.
          </p>
          <div class="cover-meta">
            ${cat ? `<div class="cm-cell"><div class="cm-k">القطاع</div><div class="cm-v">${esc(cat.name)}</div></div>` : ''}
            <div class="cm-cell"><div class="cm-k">المجتمعات</div><div class="cm-v">${N(communities.length)}</div></div>
            <div class="cm-cell"><div class="cm-k">خصائص</div><div class="cm-v">${N(totalTraits)}</div></div>
            <div class="cm-cell"><div class="cm-k">أنماط تواصل</div><div class="cm-v">${N(patternsSet.size)}</div></div>
          </div>
        </div>
        <div class="cover-foot">
          <span>مُعدّ خصّيصاً لـ <strong>${esc(client.name)}</strong></span>
          <span>${dateStr}</span>
        </div>
      </div>
    </section>`;

  // ---------- 2. Problem ----------
  const pains = derivePains(communities, resolvePattern, resolveTraits, client);
  const problemSlide = `
    <section class="slide problem">
      <div class="slide-grid">
        ${slideHead('الوضع الحالي', 2)}
        <div class="problem-body">
          <div class="problem-intro">
            <div class="overline">لماذا نحن هنا</div>
            <h2 class="section-title">${N(communities.length)} مجتمع بحاجة كلٌّ منها<br/>لتواصل مختلف — بأدوات مختلفة.</h2>
            <p class="section-lede">
              تواصلكم اليوم موزّع على أدوات منفصلة، وكلّ مجتمع يحتاج نمط تواصل خاصّ.
              هذه الفجوات تكلّف وقت الفرق، تُشتّت التجربة على مجتمعاتكم، وتضيّع قياس الأثر.
            </p>
          </div>
          <div class="pain-grid">
            ${pains.map((pain, i) => `
              <div class="pain-card">
                <div class="pain-num">${N(i + 1)}</div>
                <div class="pain-title">${pain.title}</div>
                <div class="pain-desc">${pain.desc}</div>
                <div class="pain-cost">${pain.cost}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ${slideFoot()}
      </div>
    </section>`;

  // ---------- 3. Solution ----------
  const solutionSlide = `
    <section class="slide solution">
      <div class="slide-grid">
        ${slideHead('الحل المقترح', 3)}
        <div class="solution-body">
          <div class="solution-hero">
            <div class="overline">محور · في جملة</div>
            <h2 class="solution-statement">
              محور منصّة واحدة تُدير <em>${N(communities.length)} مجتمع</em> من مجتمعاتكم،
              لكلٍّ منها نمط تواصل، هويّتها، قنواتها، وحالات استخدامها —
              <u>تحت سقف واحد.</u>
            </h2>
          </div>
          <div class="principles">
            <div class="principle">
              <div class="p-icon" style="--hue:25">⊕</div>
              <div class="p-title">مجتمع واحد = تجربة مكتملة</div>
              <div class="p-desc">لكلّ مجتمع صفحة، قنوات، قوالب، وقياسات مستقلّة — بدل خلطها في أداة عامة.</div>
            </div>
            <div class="principle">
              <div class="p-icon" style="--hue:220">◊</div>
              <div class="p-title">أنماط تواصل جاهزة</div>
              <div class="p-desc">مفتوح · هجين · مغلق — كلّ نمط يحمل قواعده وقوالبه فور تفعيله.</div>
            </div>
            <div class="principle">
              <div class="p-icon" style="--hue:145">△</div>
              <div class="p-title">قياس شفّاف</div>
              <div class="p-desc">لوحة واحدة تقيس الوصول، المشاركة، والحضور لكل مجتمع — بأرقام حقيقية.</div>
            </div>
          </div>
        </div>
        ${slideFoot()}
      </div>
    </section>`;

  // ---------- 4. Matrix ----------
  // Build a legend of the patterns actually present + the trait groups seen.
  const presentPatternIds = Array.from(patternsSet);
  const presentPatterns = presentPatternIds
    .map(id => communities.find(c => resolvePattern(c)?.id === id))
    .map(c => resolvePattern(c))
    .filter(Boolean);
  // unique trait groups across all communities
  const groupSet = new Set();
  communities.forEach(c => resolveTraits(c).forEach(t => t.group && groupSet.add(t.group)));
  const groupList = Array.from(groupSet);

  const matrixCards = communities.map((com, i) => {
    const pat = resolvePattern(com);
    const traits = resolveTraits(com);
    const hue = pat?.hue ?? 60;
    const isDetailed = detailComIds.includes(com.uid);
    const priority = getPriority(com, traits);
    return `
      <div class="mc${isDetailed ? ' mc-detailed' : ''}" style="--hue:${hue}">
        <div class="mc-head">
          <span class="mc-idx">${N(i + 1)}</span>
          <div class="mc-name">${esc(com.name || 'مجتمع')}</div>
          ${isDetailed ? '<span class="mc-flag">مُفصَّل</span>' : ''}
        </div>
        ${pat ? `<div class="mc-pattern-row">
          <span class="mc-pattern"><span class="mc-pat-icon">${pat.icon}</span> ${esc(pat.shortEn || pat.id)}</span>
          ${com.size ? `<span class="mc-size">${N(esc(com.size))}</span>` : ''}
        </div>` : ''}
        <div class="mc-priority" data-level="${priority.level}">
          <span class="mcp-k">أولوية الأثر</span>
          <span class="mcp-bars">
            <span class="${priority.level >= 1 ? 'on' : ''}"></span>
            <span class="${priority.level >= 2 ? 'on' : ''}"></span>
            <span class="${priority.level >= 3 ? 'on' : ''}"></span>
          </span>
          <span class="mcp-label">${priority.label}</span>
        </div>
        ${traits.length > 0 ? `<div class="mc-cases">
          ${traits.slice(0, 4).map(t => `<span class="mc-case">${esc(t.label || t.id)}</span>`).join('')}
          ${traits.length > 4 ? `<span class="mc-more">+ ${N(traits.length - 4)}</span>` : ''}
        </div>` : ''}
      </div>`;
  }).join('');

  const legendBlock = `
    <div class="legend">
      <div class="legend-col">
        <div class="legend-k">أنماط التواصل الرئيسية</div>
        <div class="legend-items">
          ${presentPatterns.map(p => `
            <div class="legend-item" style="--hue:${p.hue ?? 60}">
              <span class="legend-icon">${p.icon}</span>
              <div class="legend-text">
                <div class="legend-t">${esc(p.shortEn || p.id)}</div>
                <div class="legend-d">${esc(p.desc || '').slice(0, 90)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ${groupList.length > 0 ? `
        <div class="legend-col">
          <div class="legend-k">مجموعات الخصائص المعنيّة</div>
          <div class="legend-groups">
            ${groupList.map(g => `<span class="legend-group">${esc(g)}</span>`).join('')}
          </div>
          <div class="legend-hint">كل مجتمع يحمل مزيجاً خاصّاً من الخصائص — راجع صفحات التفصيل.</div>
        </div>
      ` : ''}
    </div>`;

  const matrixSlide = `
    <section class="slide matrix">
      <div class="slide-grid">
        ${slideHead('خريطة المجتمعات', 4)}
        <div class="matrix-body">
          <div class="matrix-intro">
            <div class="overline">مجتمعاتكم على محور</div>
            <h2 class="section-title">${N(communities.length)} مجتمع${communities.length === 1 ? '' : 'اً'} — ${N(patternsSet.size)} نمط تواصل</h2>
            <p class="section-lede">
              هذه الخريطة تُظهر كلّ مجتمع، نمط التواصل المناسب له، وأولوية الأثر الموصى بها.
              ${detailCommunities.length > 0 ? `المجتمعات المُعلَّمة <strong>مُفصَّلة</strong> في الشرائح التالية.` : ''}
            </p>
          </div>
          <div class="matrix-grid" data-count="${Math.min(communities.length, 8)}">
            ${matrixCards || '<div class="muted-big">لم تُسجَّل مجتمعات بعد</div>'}
          </div>
          ${legendBlock}
        </div>
        ${slideFoot()}
      </div>
    </section>`;

  // ---------- 5..N. Detail slides ----------
  const detailSlides = detailCommunities.map((com, i) => {
    const pat = resolvePattern(com);
    const traits = resolveTraits(com);
    const src = resolveSourceCase(com);
    const hue = pat?.hue ?? 60;
    const slideNum = 5 + i;
    const comName = esc(com.name || `المجتمع ${i + 1}`);

    // traits by group
    const traitsByGroup = new Map();
    traits.forEach(t => {
      const g = t.group || 'خصائص';
      if (!traitsByGroup.has(g)) traitsByGroup.set(g, []);
      traitsByGroup.get(g).push(t);
    });

    const copy = paintCommunity(com, pat, traits);

    return `
      <section class="slide detail" style="--hue:${hue}">
        <div class="slide-grid">
          ${slideHead(`تفصيل · ${comName}`, slideNum)}
          <div class="detail-body-v2">
            <div class="detail-left">
              <div class="overline">المجتمع ${N(i + 1)} من ${N(detailCommunities.length)}</div>
              <h2 class="detail-title">${comName}</h2>
              <div class="detail-meta-row">
                ${com.size ? `<div class="dm-pill size"><span class="dm-k">الحجم</span><span class="dm-v">${N(esc(com.size))}</span></div>` : ''}
                ${pat ? `<div class="dm-pill pat"><span class="dm-icon">${pat.icon}</span><span class="dm-v">${esc(pat.shortEn || pat.id)}</span></div>` : ''}
                ${src ? `<div class="dm-pill src"><span class="dm-k">مرجع</span><span class="dm-v">${esc(src.name)}</span></div>` : ''}
              </div>
              ${pat ? `<div class="detail-pat-desc">${esc(pat.desc || '')}</div>` : ''}

              <div class="three-cols">
                <div class="tc-col tc-today">
                  <div class="tc-label">اليوم</div>
                  <div class="tc-text">${copy.today}</div>
                </div>
                <div class="tc-col tc-mhwar">
                  <div class="tc-label">عبر محور</div>
                  <div class="tc-text">${copy.mhwar}</div>
                </div>
                <div class="tc-col tc-impact">
                  <div class="tc-label">الأثر</div>
                  <div class="tc-text">${copy.impact}</div>
                </div>
              </div>
            </div>

            <div class="detail-right">
              <div class="dc-label">خصائص موصوفة (${N(traits.length)})</div>
              ${traits.length === 0 ? '<div class="muted-big">لم تُحدَّد خصائص بعد</div>' : `
                <div class="dc-trait-groups">
                  ${Array.from(traitsByGroup.entries()).map(([g, items]) => `
                    <div class="dc-trait-group">
                      <div class="dc-trait-glabel">${esc(g)}</div>
                      <div class="dc-trait-chips">
                        ${items.map(t => `
                          <div class="dc-trait-chip">
                            <div class="dc-trait-label">${esc(t.label || t.id)}</div>
                            ${t.desc ? `<div class="dc-trait-desc">${esc(t.desc)}</div>` : ''}
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
              ${com.notes ? `<div class="dc-notes"><div class="dc-notes-k">ملاحظات خاصّة</div><div class="dc-notes-v">${esc(com.notes)}</div></div>` : ''}
            </div>
          </div>
          ${slideFoot()}
        </div>
      </section>`;
  }).join('');

  // ---------- Roadmap ----------
  const roadmapNum = 5 + detailCommunities.length;
  const firstBatchCount = Math.min(communities.length, 2);
  const remainingCount = Math.max(0, communities.length - 2);
  const roadmapSlide = `
    <section class="slide roadmap">
      <div class="slide-grid">
        ${slideHead('خارطة التفعيل', roadmapNum)}
        <div class="roadmap-body">
          <div class="roadmap-intro">
            <div class="overline">من التوقيع للتشغيل الكامل</div>
            <h2 class="section-title">خطّة ${N(90)} يوماً واضحة<br/>لتفعيل مجتمعاتكم على محور.</h2>
          </div>
          <div class="phases">
            <div class="phase p1">
              <div class="phase-head">
                <div class="phase-num">${N(1)}</div>
                <div class="phase-period">أوّل ${N(30)} يوم</div>
              </div>
              <div class="phase-title">التأسيس والإطلاق</div>
              <ul class="phase-list">
                <li>تهيئة الحساب وربط الهويّة البصرية</li>
                <li>إطلاق <strong>أوّل ${N(firstBatchCount)} مجتمع</strong> من مجتمعاتكم</li>
                <li>تدريب فريق العمل على الأنماط والقوالب</li>
                <li>أوّل فعاليّة حقيقية — حيّ</li>
              </ul>
            </div>
            <div class="phase p2">
              <div class="phase-head">
                <div class="phase-num">${N(2)}</div>
                <div class="phase-period">${N(31)}–${N(60)} يوم</div>
              </div>
              <div class="phase-title">التوسّع</div>
              <ul class="phase-list">
                <li>إطلاق المجتمعات المتبقّية (${N(remainingCount)} مجتمع)</li>
                <li>تفعيل قنوات تواصل متقدّمة (واتساب/إيميل/SMS)</li>
                <li>قوالب تواصل مخصّصة لكل نمط</li>
                <li>لوحة قياس مُخصّصة لاحتياجاتكم</li>
              </ul>
            </div>
            <div class="phase p3">
              <div class="phase-head">
                <div class="phase-num">${N(3)}</div>
                <div class="phase-period">${N(61)}–${N(90)} يوم</div>
              </div>
              <div class="phase-title">التحسين والنموّ</div>
              <ul class="phase-list">
                <li>مراجعة الأثر مع فريقكم — بيانات حقيقية</li>
                <li>تحسين القوالب بناءً على أداء الفعاليّات</li>
                <li>أتمتة التواصل المتكرّر</li>
                <li>خطّة نموّ السنة الأولى</li>
              </ul>
            </div>
          </div>
        </div>
        ${slideFoot()}
      </div>
    </section>`;

  // ---------- Investment (OPTIONAL) ----------
  const investmentNum = roadmapNum + 1;
  const recommendedTier = communities.length <= 2 ? 0 : communities.length <= 5 ? 1 : 2;
  const tiers = [
    { name: 'البداية',  sub: 'حتى مجتمعين',          price: '1,797', features: ['مجتمعان كاملان','فعاليات غير محدودة','دعم عادي','تدريب لساعتين'] },
    { name: 'النموّ',   sub: 'حتى 5 مجتمعات',        price: '2,994', features: ['5 مجتمعات','قنوات واتساب مستقلّة','دعم مُسرَّع','تدريب لفريقكم','مدير حساب'] },
    { name: 'الشراكة',  sub: '10 مجتمعات أو أكثر',   price: '5,734', features: ['10+ مجتمعات','قنوات واتساب لكل مجتمع','دعم 24/5','تدريب متقدّم','مدير حساب مخصّص','SLA 99.9%'] },
  ];
  const investmentSlide = includeInvestment ? `
    <section class="slide investment">
      <div class="slide-grid">
        ${slideHead('الاستثمار', investmentNum)}
        <div class="investment-body">
          <div class="investment-intro">
            <div class="overline">ثلاث باقات · واحدة موصى بها لكم</div>
            <h2 class="section-title">استثمار واضح، بلا مفاجآت.</h2>
            <p class="section-lede">
              الباقات تشمل المنصّة، دعم الإطلاق، التدريب، والتحديثات.
              بناءً على ${N(communities.length)} مجتمع — نوصي بـ <strong>باقة ${['البداية','النموّ','الشراكة'][recommendedTier]}</strong>.
            </p>
          </div>
          <div class="tiers">
            ${tiers.map((tier, i) => `
              <div class="tier ${i === recommendedTier ? 'tier-reco' : ''}">
                ${i === recommendedTier ? '<div class="tier-badge">موصى بها لكم</div>' : ''}
                <div class="tier-head">
                  <div class="tier-name">${tier.name}</div>
                  <div class="tier-sub">${tier.sub}</div>
                </div>
                <div class="tier-price">
                  <span class="tp-amt">${N(tier.price)}</span>
                  <span class="tp-cur">ر.س</span>
                  <span class="tp-per">/ شهرياً</span>
                </div>
                <ul class="tier-features">
                  ${tier.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
        ${slideFoot()}
      </div>
    </section>` : '';

  // ---------- Next step (CTA) ----------
  const nextNum = investmentNum + (includeInvestment ? 1 : 0);
  const nextSlide = `
    <section class="slide next">
      <div class="slide-grid">
        ${slideHead('', nextNum, { dark: true })}
        <div class="next-body">
          <div class="overline inv">الخطوة التالية</div>
          <h2 class="next-title">جاهزون للبدء<br/>معكم.</h2>
          <p class="next-lede">
            خلال الأيّام القادمة، خطوتنا التالية: اجتماع استعراض النظام حيّاً،
            وإطلاق <strong>أوّل مجتمع</strong> من مجتمعاتكم الـ${N(communities.length)}.
          </p>
          <div class="next-steps">
            <div class="ns-step"><span class="ns-num">${N(1)}</span><span class="ns-t">تأكيد المقترح${includeInvestment ? ' والباقة' : ''}</span></div>
            <div class="ns-step"><span class="ns-num">${N(2)}</span><span class="ns-t">جلسة تأسيس (${N(90)} دقيقة)</span></div>
            <div class="ns-step"><span class="ns-num">${N(3)}</span><span class="ns-t">إطلاق أوّل مجتمع خلال أسبوعين</span></div>
          </div>
          <div class="next-cta">
            <div class="cta-btn">احجزوا اجتماع الإطلاق</div>
            <div class="cta-contact">
              <div class="cc-k">للتواصل المباشر</div>
              <div class="cc-v">فريق محور · hello@mhwar.sa</div>
            </div>
          </div>
        </div>
        ${slideFoot({ dark: true })}
      </div>
    </section>`;

  // ---------- Compose ----------
  const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
    <title>مقترح محور · ${esc(client.name)}</title>
    <style>${proposalCSS()}</style>
  </head><body>
    <div class="toolbar">
      <span class="hint">${N(totalSlides)} شريحة · ${N(proposalNo)}</span>
      ${shareLink ? `<button onclick="navigator.clipboard.writeText('${shareLink.replace(/'/g, "\\'")}'); this.textContent='نُسخ ✓'; setTimeout(()=>this.textContent='نسخ رابط المشاركة', 1500);">نسخ رابط المشاركة</button>` : ''}
      <button onclick="window.print()">حفظ PDF</button>
    </div>
    <div class="deck">
      ${coverSlide}
      ${problemSlide}
      ${solutionSlide}
      ${matrixSlide}
      ${detailSlides}
      ${roadmapSlide}
      ${investmentSlide}
      ${nextSlide}
    </div>
    <script>
      // Scale slides to fit viewport width (screen only; print uses 1920px)
      (function() {
        const slides = document.querySelectorAll('.slide');
        function scaleAll() {
          const vw = Math.min(document.documentElement.clientWidth, window.innerWidth);
          const avail = vw - 48;
          const scale = Math.min(1, avail / 1920);
          slides.forEach(s => {
            s.style.transform = 'scale(' + scale + ')';
            s.style.transformOrigin = 'top center';
            s.style.marginBottom = ((1080 * scale) - 1080 + 28) + 'px';
          });
        }
        scaleAll();
        window.addEventListener('resize', scaleAll);
        requestAnimationFrame(scaleAll);
      })();
    </script>
  </body></html>`;

  return { html, title: `مقترح محور — ${client.name}`, proposalNo, totalSlides };
};

// ============================================================
// Heuristics: pains, priority, per-community personalized copy
// ============================================================
function derivePains(communities, resolvePattern, resolveTraits, client) {
  const n = communities.length;
  const patterns = new Set(communities.map(c => resolvePattern(c)?.id).filter(Boolean));
  const hasMultiplePatterns = patterns.size >= 2;
  const hasOpen = patterns.has('مفتوح');
  const hasClosed = patterns.has('مغلق');
  const hasHybrid = patterns.has('هجين');

  // count trait presence across all communities
  const allTraits = communities.flatMap(c => resolveTraits(c));
  const traitIds = new Set(allTraits.map(t => t.id));
  const hasPaid = traitIds.has('مدفوع');
  const hasOfficial = traitIds.has('رسمي');
  const hasInteractive = traitIds.has('تفاعلي');
  const hasSendOnly = traitIds.has('إرسال-فقط');

  const pains = [];

  // Pain 1: fragmentation (always, but personalized by n)
  pains.push({
    title: 'تواصل مُشتَّت',
    desc: `${n === 1 ? 'مجتمعكم يُدار' : `${n} مجتمعات تُدار`} عبر مجموعات واتساب وإكسل ونماذج جوجل متفرّقة — لا جهة مرجعية واحدة، ولا صورة كاملة.`,
    cost: 'الكلفة: ساعات إدارية أسبوعياً',
  });

  // Pain 2: tone / audience mismatch — personalized by pattern mix
  if (hasMultiplePatterns || (hasOpen && hasClosed)) {
    pains.push({
      title: 'مجتمعات مختلفة، نفس الأداة',
      desc: hasOfficial
        ? 'من مجالس الحوكمة للجماهير المفتوحة — كلّها تستخدم نفس القناة والقالب بينما تحتاج لغة ونمط تواصل مختلف تماماً.'
        : 'جمهوركم ينقسم طبيعيّاً بين مجتمعات مفتوحة ومغلقة، لكن الأداة لا تفرّق — ما يُرسَل للكلّ يضعف أثره على الكلّ.',
      cost: 'الكلفة: ضعف في الانخراط والثقة',
    });
  } else if (hasSendOnly && !hasInteractive) {
    pains.push({
      title: 'بثّ بلا صدى',
      desc: 'الرسائل تُرسل، لكن لا سبيل لقياس الفتح أو التفاعل أو الردود بشكل منظّم — تواصل باتجاه واحد دون تغذية راجعة.',
      cost: 'الكلفة: قرارات بلا بيانات',
    });
  } else {
    pains.push({
      title: 'غياب القوالب المخصّصة',
      desc: 'كل رسالة وكل دعوة تُكتب من الصفر. ولا سجل موحّد لما أُرسل ومتى — أخطاء التكرار والنسيان واردة.',
      cost: 'الكلفة: ساعات إعداد أسبوعية',
    });
  }

  // Pain 3: measurement / monetization — personalized
  if (hasPaid) {
    pains.push({
      title: 'إيرادات بلا أثر مُقاس',
      desc: 'اشتراكات ورسوم تُحصَّل، لكن ربطها بقيمة حقيقية يصل للعضو — غير واضح. التجديد يصبح مقامرة.',
      cost: 'الكلفة: تسرّب إيرادات صامت',
    });
  } else if (hasInteractive) {
    pains.push({
      title: 'تفاعل لا يُوثَّق',
      desc: 'نقاشات قيّمة تحدث داخل مجتمعاتكم، لكنها تضيع في سجل مجموعات واتساب — لا أرشيف، لا بحث، لا استخلاص.',
      cost: 'الكلفة: معرفة تُفقد شهرياً',
    });
  } else {
    pains.push({
      title: 'قياس أثر ضعيف',
      desc: 'عدد المُرسل إليهم معروف — أمّا من فتح، من حضر، ومن تفاعل فغير مرئي. القرارات بلا بيانات حقيقية.',
      cost: 'الكلفة: فرص ضائعة مع كل فعاليّة',
    });
  }

  return pains;
}

// Impact priority — 3 = عالية, 2 = متوسطة, 1 = تأسيسية
// Heuristic: official + paid/interactive bumps priority; send-only without other traits → lower.
function getPriority(com, traits) {
  const ids = new Set((traits || []).map(t => t.id));
  let score = 1;
  if (ids.has('رسمي')) score += 1;
  if (ids.has('مدفوع')) score += 1;
  if (ids.has('تفاعلي')) score += 0.5;
  if ((traits || []).length >= 3) score += 0.5;
  if (ids.has('إرسال-فقط') && !ids.has('رسمي') && !ids.has('مدفوع')) score -= 0.5;
  const level = score >= 2.5 ? 3 : score >= 1.5 ? 2 : 1;
  return {
    level,
    label: level === 3 ? 'عالية' : level === 2 ? 'متوسطة' : 'تأسيسية',
  };
}

// Personalized copy per community — uses name + pattern + actual trait ids
function paintCommunity(com, pat, traits) {
  const name = com.name || 'هذا المجتمع';
  const pid = pat?.id || '';
  const pShort = pat?.shortEn || pat?.id || '';
  const ids = new Set((traits || []).map(t => t.id));

  const has = (x) => ids.has(x);
  const joinList = (arr) => arr.join(' · ');

  // -------- TODAY (current pain, per this community) --------
  let today;
  if (has('رسمي') && pid === 'مغلق') {
    today = `${name} اليوم في مجموعة خاصّة — محاضره وقراراته تعيش في مرفقات واتساب ورسائل بريد متناثرة، دون أرشيف رسمي قابل للاستدعاء.`;
  } else if (has('مدفوع')) {
    today = `${name} يدفعون رسوماً، لكنّ قيمة ما يصلهم مشتّتة بين قناة إعلان وقناة محتوى ومجموعة نقاش — تجربة غير متناسبة مع الرسوم.`;
  } else if (has('إرسال-فقط') && !has('تفاعلي')) {
    today = `${name} يستقبل بثّاً جماعيّاً دوريّاً، دون رؤية لمن فتح، من تجاوب، ومن انسحب.`;
  } else if (has('تفاعلي') && pid === 'مفتوح') {
    today = `${name} ينشأ تفاعلهم في مجموعات واتساب مفتوحة — بلا قواعد واضحة، بلا تصنيف، ومع فقدان التاريخ كلّ ٣ أشهر.`;
  } else if (pid === 'هجين') {
    today = `${name} يمتدّ عبر قنوات متعدّدة — بعضها عام وبعضها داخلي — ولا يميّز أحدٌ بوضوح من يرى ماذا، فتتسرّب المعلومات أو تُحجب.`;
  } else if (has('داخلي')) {
    today = `${name} يُدار كمجموعة داخلية مؤقّتة — التوجيهات تضيع بين تحديثات متفرّقة ورسائل فردية.`;
  } else {
    today = `${name} اليوم بلا صفحة ولا هويّة موحّدة — التواصل موزّع على أدوات منفصلة ومعرفة شفهيّة داخل الفريق.`;
  }

  // -------- MHWAR (what we give them) --------
  const mhwarBits = [];
  if (pid === 'مغلق') mhwarBits.push(`صفحة خاصّة بـ ${name} بصلاحيات محدّدة`);
  else if (pid === 'هجين') mhwarBits.push(`صفحة ${name} بقسمين: عامّ وأعضاء`);
  else if (pid === 'مفتوح') mhwarBits.push(`صفحة ${name} عامّة بهويّتكم`);
  else mhwarBits.push(`صفحة كاملة لـ ${name}`);

  if (has('رسمي')) mhwarBits.push('قوالب جلسات ومحاضر وتصويت');
  if (has('مدفوع')) mhwarBits.push('إدارة اشتراكات وصلاحيات محتوى');
  if (has('تفاعلي')) mhwarBits.push('نقاشات منظَّمة وأرشيف قابل للبحث');
  if (has('إرسال-فقط')) mhwarBits.push('بثّ متعدّد القنوات مع قياس الوصول');
  if (has('بعلامة-بيضاء')) mhwarBits.push('هويّة بصريّة خاصّة بكم (white-label)');

  const mhwar = joinList(mhwarBits) + '.';

  // -------- IMPACT (business outcome) --------
  let impact;
  if (has('رسمي') && pid === 'مغلق') {
    impact = `قرارات موثّقة · استمرارية معرفية · وقت الاجتماعات يُستثمر بدل إعادة الشرح.`;
  } else if (has('مدفوع')) {
    impact = `ربط واضح بين الرسوم والقيمة · تجديد اشتراك مبنيّ على استخدام فعلي · تسرّب أقل.`;
  } else if (has('تفاعلي') && has('مدفوع')) {
    impact = `مجتمع حيّ يُبرّر الاشتراك تلقائيّاً · أعضاء يتحوّلون لمسوّقين.`;
  } else if (has('إرسال-فقط') && pid !== 'مفتوح') {
    impact = `وصول مُؤكَّد لكل عضو · قياس الفتح والاستجابة · سجلّ واحد لما أُرسل ومتى.`;
  } else if (pid === 'هجين') {
    impact = `ثقة أعلى من الأعضاء (خصوصية واضحة) · وصول أوسع للمحتوى العام في نفس الوقت.`;
  } else if (pid === 'مفتوح' && has('تفاعلي')) {
    impact = `نموّ عضوي · تفاعل قابل للقياس · قرارات محتوى مبنيّة على بيانات.`;
  } else {
    impact = `توفير وقت · تجربة موحّدة · قياس شفّاف لأثر التواصل.`;
  }

  return { today, mhwar, impact };
}

// ============================================================
// CSS — kept as function for readability
// ============================================================
function proposalCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
    @page { size: 1920px 1080px; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif; color: #14130f; line-height: 1.7; background: #e8e6e0; }
    .deck { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 28px 0; }

    /* Numbers: isolate from RTL text and use tabular figures so Arabic copy
       never mirrors Latin digits and columns align. */
    .num { unicode-bidi: isolate; font-feature-settings: 'tnum' 1, 'lnum' 1; }

    .slide { position: relative; width: 1920px; height: 1080px; background: #fff; overflow: hidden;
      box-shadow: 0 30px 60px -30px rgba(20,19,15,0.25); transform-origin: top center; }
    .slide-grid { position: absolute; inset: 0; padding: 68px 88px 58px; display: flex; flex-direction: column; }

    .slide-head { margin-bottom: 44px; flex-shrink: 0; }
    .slide-head.dark { color: #fff; }
    .brand-row { display: flex; align-items: center; justify-content: space-between;
      padding-bottom: 20px; border-bottom: 1px solid oklch(0.9 0.02 60); }
    .slide-head.dark .brand-row { border-color: rgba(255,255,255,0.15); }
    .brand { font-size: 26px; font-weight: 700; letter-spacing: -0.6px; }
    .brand small { font-size: 12px; color: #6b6a64; font-weight: 400; margin-inline-start: 10px; letter-spacing: 3.5px; }
    .brand.inv { color: #fff; }
    .brand.inv small { color: rgba(255,255,255,0.55); }
    .section-tag { font-size: 14px; color: oklch(0.45 0.14 260); letter-spacing: 4px; font-weight: 600; }
    .page-num { font-size: 14px; color: #6b6a64; letter-spacing: 2px; }
    .page-num.inv { color: rgba(255,255,255,0.55); }

    .slide-foot { position: absolute; bottom: 32px; inset-inline: 88px;
      display: flex; justify-content: space-between; font-size: 13px; color: #8b8a84; letter-spacing: 1.3px; }
    .slide-foot.inv { color: rgba(255,255,255,0.4); }

    .overline { font-size: 15px; color: oklch(0.45 0.15 var(--hue, 45)); letter-spacing: 5px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
    .overline.inv { color: oklch(0.75 0.17 60); }
    .muted-big { padding: 40px; text-align: center; color: #9b9a94; font-size: 20px; font-style: italic; }

    .section-title { font-size: 78px; font-weight: 600; letter-spacing: -2.5px; line-height: 1.06; margin: 0 0 18px; max-width: 1600px; }
    .section-lede { font-size: 22px; color: #3b3a34; max-width: 1300px; line-height: 1.65; margin: 0; }
    .section-lede strong { color: oklch(0.35 0.15 var(--hue, 260)); font-weight: 600; }

    /* ===== COVER ===== */
    .cover { background: linear-gradient(155deg,
      oklch(0.98 0.03 var(--hue)) 0%,
      oklch(0.96 0.05 var(--hue)) 60%,
      oklch(0.92 0.08 var(--hue)) 100%); }
    .cover::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 12px; background: oklch(0.48 0.18 var(--hue)); z-index: 2; }
    .cover::after { content: ''; position: absolute; top: -160px; inset-inline-start: -160px; width: 600px; height: 600px;
      background: radial-gradient(circle, oklch(0.82 0.14 var(--hue) / 0.5), transparent 70%); pointer-events: none; }
    .cover .slide-grid { justify-content: space-between; }
    .cover-top { position: relative; z-index: 1; }
    .cover-badge { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px;
      background: #fff; border-radius: 999px; border: 1px solid oklch(0.88 0.05 var(--hue));
      box-shadow: 0 6px 20px -10px oklch(0.4 0.15 var(--hue) / 0.35); }
    .cb-k { font-size: 12px; color: #6b6a64; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; }
    .cb-v { font-size: 14px; font-weight: 700; color: oklch(0.3 0.17 var(--hue)); letter-spacing: 1px; }
    .cover-body { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 1560px; }
    .cover-title { font-size: 110px; font-weight: 600; letter-spacing: -3.8px; line-height: 1.02; margin: 0 0 38px; display: flex; flex-direction: column; }
    .cover-title .ct-line1 { color: oklch(0.25 0.08 var(--hue)); }
    .cover-title .ct-line2 { color: #14130f; }
    .cover-title .ct-line3 { color: oklch(0.25 0.08 var(--hue)); font-size: 78px; margin-top: 12px; }
    .cover-title em { font-style: normal; color: oklch(0.42 0.2 var(--hue)); font-weight: 700; }
    .cover-lede { font-size: 24px; color: #2b2a24; max-width: 1200px; line-height: 1.65; margin: 0 0 54px; }
    .cover-lede strong { color: oklch(0.35 0.17 var(--hue)); font-weight: 700; }
    .cover-meta { display: flex; gap: 18px; flex-wrap: wrap; }
    .cm-cell { padding: 24px 32px; background: #fff; border: 1px solid oklch(0.9 0.04 var(--hue));
      border-radius: 18px; box-shadow: 0 10px 40px -18px rgba(0,0,0,0.15); flex: 1; min-width: 180px; }
    .cm-k { font-size: 12px; color: #6b6a64; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; font-weight: 600; }
    .cm-v { font-size: 36px; font-weight: 700; letter-spacing: -1px; color: oklch(0.3 0.17 var(--hue)); line-height: 1.1; }
    .cover-foot { position: relative; z-index: 1; display: flex; justify-content: space-between; padding-top: 22px; border-top: 1px solid oklch(0.85 0.06 var(--hue));
      font-size: 15px; color: #3b3a34; }
    .cover-foot strong { color: oklch(0.3 0.17 var(--hue)); font-weight: 700; }

    /* ===== PROBLEM ===== */
    .problem { background: #fbfaf7; }
    .problem::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: oklch(0.55 0.18 30); }
    .problem-body { flex: 1; display: flex; flex-direction: column; gap: 48px; }
    .problem-intro { max-width: 1500px; }
    .problem-intro .overline { color: oklch(0.55 0.18 30); }
    .problem-intro .section-title { color: #14130f; font-size: 72px; }
    .pain-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; flex: 1; }
    .pain-card { padding: 36px 32px; background: #fff; border-radius: 22px;
      border: 1px solid oklch(0.92 0.03 30); border-inline-start: 6px solid oklch(0.55 0.18 30);
      display: flex; flex-direction: column; gap: 14px; }
    .pain-num { width: 44px; height: 44px; border-radius: 12px; background: oklch(0.55 0.18 30); color: #fff;
      display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; }
    .pain-title { font-size: 30px; font-weight: 600; color: #14130f; letter-spacing: -0.8px; line-height: 1.15; }
    .pain-desc { font-size: 18px; color: #3b3a34; line-height: 1.7; flex: 1; }
    .pain-cost { font-size: 14px; color: oklch(0.45 0.18 30); font-weight: 600; letter-spacing: 0.5px;
      padding: 10px 14px; background: oklch(0.97 0.03 30); border-radius: 10px; border: 1px dashed oklch(0.8 0.08 30); }

    /* ===== SOLUTION ===== */
    .solution { background: linear-gradient(180deg, #fff 0%, oklch(0.98 0.015 145) 100%); }
    .solution::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: oklch(0.5 0.15 145); }
    .solution-body { flex: 1; display: flex; flex-direction: column; gap: 64px; }
    .solution-hero { max-width: 1700px; }
    .solution-hero .overline { color: oklch(0.45 0.15 145); }
    .solution-statement { font-size: 62px; font-weight: 600; letter-spacing: -2px; line-height: 1.2; margin: 0; color: #14130f; max-width: 1700px; }
    .solution-statement em { font-style: normal; color: oklch(0.4 0.16 145); font-weight: 700; }
    .solution-statement u { text-decoration: none; display: block; margin-top: 12px; color: oklch(0.25 0.14 145); }
    .principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .principle { padding: 38px 32px; background: #fff; border-radius: 22px; border: 1px solid oklch(0.93 0.02 60);
      display: flex; flex-direction: column; gap: 16px; }
    .p-icon { width: 64px; height: 64px; border-radius: 16px; background: oklch(0.96 0.05 var(--hue));
      color: oklch(0.4 0.17 var(--hue)); display: inline-flex; align-items: center; justify-content: center;
      font-size: 32px; font-weight: 700; }
    .p-title { font-size: 28px; font-weight: 600; color: #14130f; letter-spacing: -0.7px; line-height: 1.2; }
    .p-desc { font-size: 18px; color: #3b3a34; line-height: 1.7; }

    /* ===== MATRIX ===== */
    .matrix { background: linear-gradient(180deg, #fff 0%, oklch(0.98 0.015 260) 100%); }
    .matrix::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: oklch(0.45 0.15 260); }
    .matrix-body { flex: 1; display: flex; flex-direction: column; gap: 22px; }
    .matrix-intro { max-width: 1500px; }
    .matrix-intro .overline { color: oklch(0.45 0.15 260); }
    .matrix-intro .section-title { font-size: 60px; }
    .matrix-grid { display: grid; gap: 14px; flex: 1; }
    .matrix-grid[data-count="1"] { grid-template-columns: 1fr; max-width: 900px; }
    .matrix-grid[data-count="2"] { grid-template-columns: 1fr 1fr; }
    .matrix-grid[data-count="3"] { grid-template-columns: repeat(3, 1fr); }
    .matrix-grid[data-count="4"] { grid-template-columns: repeat(4, 1fr); }
    .matrix-grid[data-count="5"], .matrix-grid[data-count="6"] { grid-template-columns: repeat(3, 1fr); }
    .matrix-grid[data-count="7"], .matrix-grid[data-count="8"] { grid-template-columns: repeat(4, 1fr); }

    .mc { padding: 18px 20px; background: #fff; border: 1px solid oklch(0.92 0.025 var(--hue));
      border-radius: 16px; border-inline-start: 5px solid oklch(0.55 0.15 var(--hue));
      display: flex; flex-direction: column; gap: 9px;
      box-shadow: 0 2px 6px -2px oklch(0.4 0.08 var(--hue) / 0.08); }
    .mc-detailed { background: linear-gradient(180deg, oklch(0.99 0.015 var(--hue)) 0%, #fff 100%);
      box-shadow: 0 10px 28px -14px oklch(0.4 0.15 var(--hue) / 0.35);
      border-color: oklch(0.85 0.08 var(--hue)); }
    .mc-head { display: flex; align-items: center; gap: 9px; }
    .mc-idx { width: 28px; height: 28px; border-radius: 8px; background: oklch(0.55 0.15 var(--hue)); color: #fff;
      display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
    .mc-name { font-size: 18px; font-weight: 600; color: oklch(0.22 0.13 var(--hue)); flex: 1; letter-spacing: -0.3px; line-height: 1.2; }
    .mc-flag { font-size: 9.5px; padding: 3px 8px; background: oklch(0.55 0.15 var(--hue)); color: #fff; border-radius: 999px; letter-spacing: 1.5px; font-weight: 700; white-space: nowrap; }
    .mc-pattern-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .mc-pattern { font-size: 12.5px; color: oklch(0.3 0.14 var(--hue)); font-weight: 600;
      padding: 4px 10px; background: oklch(0.96 0.04 var(--hue)); border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; }
    .mc-pat-icon { font-size: 14px; }
    .mc-size { font-size: 12px; color: #6b6a64; font-weight: 500; padding: 4px 9px; background: #fbfaf7; border: 1px solid #e8e5dd; border-radius: 8px; }
    .mc-priority { display: flex; align-items: center; gap: 9px; padding: 7px 11px;
      background: oklch(0.98 0.01 60); border-radius: 9px; border: 1px solid oklch(0.94 0.02 60); }
    .mcp-k { font-size: 10.5px; color: #6b6a64; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; flex: 1; }
    .mcp-bars { display: inline-flex; gap: 3px; }
    .mcp-bars span { display: inline-block; width: 6px; height: 14px; border-radius: 2px; background: oklch(0.9 0.02 60); }
    .mcp-bars span.on { background: oklch(0.55 0.17 60); }
    .mc-priority[data-level="3"] .mcp-bars span.on { background: oklch(0.55 0.17 30); }
    .mc-priority[data-level="1"] .mcp-bars span.on { background: oklch(0.65 0.1 230); }
    .mcp-label { font-size: 11px; font-weight: 700; color: #14130f; letter-spacing: 0.5px; }
    .mc-cases { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
    .mc-case { font-size: 11px; padding: 3px 9px; background: #fbfaf7; border: 1px solid #e8e5dd; border-radius: 999px; color: #3b3a34; }
    .mc-more { font-size: 11px; padding: 3px 9px; color: oklch(0.4 0.14 var(--hue)); font-weight: 700; }

    /* legend — explains patterns + trait groups in use */
    .legend { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; padding: 18px 22px;
      background: oklch(0.97 0.012 260); border: 1px solid oklch(0.92 0.018 260); border-radius: 14px; }
    .legend-col { display: flex; flex-direction: column; gap: 10px; }
    .legend-k { font-size: 10.5px; color: #6b6a64; letter-spacing: 2.5px; text-transform: uppercase; font-weight: 700; }
    .legend-items { display: flex; flex-wrap: wrap; gap: 16px; }
    .legend-item { display: flex; gap: 10px; align-items: flex-start; padding: 9px 13px;
      background: #fff; border: 1px solid oklch(0.92 0.03 var(--hue)); border-radius: 10px;
      border-inline-start: 4px solid oklch(0.55 0.15 var(--hue)); min-width: 240px; flex: 1; }
    .legend-icon { font-size: 18px; color: oklch(0.4 0.17 var(--hue)); font-weight: 700; line-height: 1; padding-top: 2px; }
    .legend-text { flex: 1; min-width: 0; }
    .legend-t { font-size: 13px; font-weight: 700; color: oklch(0.25 0.13 var(--hue)); letter-spacing: -0.2px; }
    .legend-d { font-size: 11px; color: #3b3a34; margin-top: 2px; line-height: 1.5; }
    .legend-groups { display: flex; flex-wrap: wrap; gap: 6px; }
    .legend-group { font-size: 11px; padding: 4px 11px; background: #fff; border: 1px solid oklch(0.88 0.03 260);
      border-radius: 999px; color: oklch(0.3 0.12 260); font-weight: 600; }
    .legend-hint { font-size: 10.5px; color: #6b6a64; font-style: italic; line-height: 1.5; }

    /* ===== DETAIL ===== */
    .detail { background: linear-gradient(165deg, #fff 0%, oklch(0.99 0.018 var(--hue)) 100%); }
    .detail::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 10px; background: oklch(0.55 0.15 var(--hue)); }
    .detail-body-v2 { flex: 1; display: grid; grid-template-columns: 1.15fr 1fr; gap: 52px; align-items: flex-start; padding-top: 6px; }
    .detail-left { display: flex; flex-direction: column; }
    .detail-left .overline { color: oklch(0.48 0.15 var(--hue)); }
    .detail-title { font-size: 72px; font-weight: 600; letter-spacing: -2.2px; line-height: 1.04;
      margin: 0 0 24px; color: oklch(0.2 0.13 var(--hue)); }
    .detail-meta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
    .dm-pill { padding: 12px 18px; border-radius: 13px; display: inline-flex; align-items: center; gap: 10px;
      border: 1px solid oklch(0.92 0.03 var(--hue)); background: #fff; }
    .dm-pill.size { background: #fbfaf7; }
    .dm-pill.pat { background: oklch(0.96 0.04 var(--hue)); border-color: oklch(0.88 0.06 var(--hue)); }
    .dm-k { font-size: 11px; color: #6b6a64; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; }
    .dm-icon { font-size: 20px; color: oklch(0.4 0.17 var(--hue)); }
    .dm-v { font-size: 15px; font-weight: 600; color: oklch(0.3 0.13 var(--hue)); }
    .dm-pill.size .dm-v { color: #3b3a34; }
    .detail-pat-desc { font-size: 17px; color: #2b2a24; line-height: 1.7;
      padding: 18px 22px; background: oklch(0.97 0.02 var(--hue)); border-radius: 14px;
      border-inline-start: 4px solid oklch(0.55 0.15 var(--hue)); margin: 0 0 28px; }

    .three-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .tc-col { padding: 18px 20px; border-radius: 14px; display: flex; flex-direction: column; gap: 10px; }
    .tc-today { background: oklch(0.97 0.02 30); border: 1px solid oklch(0.92 0.04 30); }
    .tc-mhwar { background: oklch(0.97 0.04 var(--hue)); border: 1px solid oklch(0.88 0.06 var(--hue)); }
    .tc-impact { background: oklch(0.97 0.04 145); border: 1px solid oklch(0.88 0.06 145); }
    .tc-label { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; }
    .tc-today .tc-label { color: oklch(0.48 0.15 30); }
    .tc-mhwar .tc-label { color: oklch(0.4 0.16 var(--hue)); }
    .tc-impact .tc-label { color: oklch(0.4 0.16 145); }
    .tc-text { font-size: 14px; color: #2b2a24; line-height: 1.65; text-wrap: pretty; }

    .detail-right { padding-top: 8px; }
    .dc-label { font-size: 13px; color: oklch(0.48 0.15 var(--hue)); letter-spacing: 4px; text-transform: uppercase; font-weight: 700; margin-bottom: 18px; }
    .dc-trait-groups { display: flex; flex-direction: column; gap: 16px; }
    .dc-trait-group { padding: 0; }
    .dc-trait-glabel { font-size: 12px; color: #6b6a64; letter-spacing: 2.5px; text-transform: uppercase; font-weight: 700; margin-bottom: 10px; }
    .dc-trait-chips { display: flex; flex-direction: column; gap: 8px; }
    .dc-trait-chip { padding: 14px 18px; background: #fff; border: 1px solid oklch(0.94 0.025 var(--hue));
      border-radius: 12px; border-inline-start: 3px solid oklch(0.55 0.15 var(--hue)); }
    .dc-trait-label { font-size: 16px; font-weight: 600; color: oklch(0.22 0.13 var(--hue)); margin-bottom: 4px; }
    .dc-trait-desc { font-size: 13px; color: #3b3a34; line-height: 1.6; }
    .dc-notes { margin-top: 18px; padding: 16px 20px; background: #fbfaf7; border-radius: 12px;
      border: 1px dashed oklch(0.85 0.05 var(--hue)); }
    .dc-notes-k { font-size: 11px; color: #6b6a64; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; font-weight: 700; }
    .dc-notes-v { font-size: 14px; color: #3b3a34; line-height: 1.7; }

    /* ===== ROADMAP ===== */
    .roadmap { background: #fff; }
    .roadmap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px;
      background: linear-gradient(90deg, oklch(0.55 0.18 30) 0%, oklch(0.55 0.17 60) 50%, oklch(0.5 0.15 145) 100%); }
    .roadmap-body { flex: 1; display: flex; flex-direction: column; gap: 44px; }
    .roadmap-intro .overline { color: oklch(0.5 0.17 60); }
    .phases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; flex: 1; position: relative; }
    .phases::before { content: ''; position: absolute; top: 30px; left: 10%; right: 10%; height: 3px;
      background: repeating-linear-gradient(90deg, oklch(0.85 0.05 60) 0 10px, transparent 10px 20px); }
    .phase { background: #fff; border: 1px solid oklch(0.92 0.02 60); border-radius: 20px; padding: 32px 28px;
      display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 1; }
    .phase.p1 { border-color: oklch(0.82 0.1 30); background: linear-gradient(165deg, #fff, oklch(0.99 0.018 30)); }
    .phase.p2 { border-color: oklch(0.82 0.1 60); background: linear-gradient(165deg, #fff, oklch(0.99 0.018 60)); }
    .phase.p3 { border-color: oklch(0.82 0.1 145); background: linear-gradient(165deg, #fff, oklch(0.99 0.018 145)); }
    .phase-head { display: flex; align-items: center; gap: 14px; }
    .phase-num { width: 60px; height: 60px; border-radius: 50%; color: #fff;
      display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700;
      flex-shrink: 0; box-shadow: 0 8px 20px -6px rgba(0,0,0,0.25); }
    .phase.p1 .phase-num { background: oklch(0.55 0.18 30); }
    .phase.p2 .phase-num { background: oklch(0.55 0.17 60); }
    .phase.p3 .phase-num { background: oklch(0.5 0.15 145); }
    .phase-period { font-size: 14px; color: #6b6a64; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; }
    .phase-title { font-size: 30px; font-weight: 600; color: #14130f; letter-spacing: -0.8px; line-height: 1.2; }
    .phase-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .phase-list li { font-size: 16px; color: #2b2a24; line-height: 1.6; padding-inline-start: 20px; position: relative; }
    .phase-list li::before { content: ''; position: absolute; inset-inline-start: 0; top: 10px; width: 8px; height: 8px; border-radius: 50%; background: #8b8a84; }
    .phase.p1 .phase-list li::before { background: oklch(0.55 0.18 30); }
    .phase.p2 .phase-list li::before { background: oklch(0.55 0.17 60); }
    .phase.p3 .phase-list li::before { background: oklch(0.5 0.15 145); }
    .phase-list li strong { color: oklch(0.3 0.15 60); font-weight: 700; }

    /* ===== INVESTMENT ===== */
    .investment { background: #fbfaf7; }
    .investment::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: oklch(0.45 0.15 260); }
    .investment-body { flex: 1; display: flex; flex-direction: column; gap: 36px; }
    .investment-intro { max-width: 1500px; }
    .investment-intro .overline { color: oklch(0.45 0.15 260); }
    .tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; flex: 1; }
    .tier { padding: 36px 32px; background: #fff; border: 1px solid oklch(0.92 0.02 60); border-radius: 22px;
      display: flex; flex-direction: column; gap: 18px; position: relative; }
    .tier-reco { border: 2px solid oklch(0.48 0.18 var(--hue, 30)); transform: scale(1.03);
      box-shadow: 0 25px 50px -20px oklch(0.4 0.18 30 / 0.35); background: linear-gradient(165deg, #fff, oklch(0.99 0.02 30)); }
    .tier-badge { position: absolute; top: -14px; inset-inline-end: 24px; padding: 6px 16px;
      background: oklch(0.48 0.18 30); color: #fff; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; }
    .tier-head { border-bottom: 1px solid oklch(0.92 0.02 60); padding-bottom: 16px; }
    .tier-name { font-size: 32px; font-weight: 700; color: #14130f; letter-spacing: -0.7px; }
    .tier-sub { font-size: 14px; color: #6b6a64; margin-top: 4px; }
    .tier-price { display: flex; align-items: baseline; gap: 8px; }
    .tp-amt { font-size: 52px; font-weight: 700; color: #14130f; letter-spacing: -1.5px; }
    .tp-cur { font-size: 20px; color: #6b6a64; font-weight: 600; }
    .tp-per { font-size: 15px; color: #6b6a64; margin-inline-start: 6px; }
    .tier-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; }
    .tier-features li { font-size: 15px; color: #2b2a24; line-height: 1.5; padding-inline-start: 24px; position: relative; }
    .tier-features li::before { content: '✓'; position: absolute; inset-inline-start: 0; top: 0;
      color: oklch(0.5 0.15 145); font-weight: 700; font-size: 16px; }
    .tier-reco .tier-features li::before { color: oklch(0.48 0.18 30); }

    /* ===== NEXT (CTA) ===== */
    .next { background: #14130f; color: #fff; }
    .next::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 8px;
      background: linear-gradient(90deg, oklch(0.75 0.17 60), oklch(0.62 0.2 30)); }
    .next-body { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 1600px; }
    .next-title { font-size: 140px; font-weight: 700; letter-spacing: -5px; line-height: 0.95; margin: 0 0 36px; color: #fff; }
    .next-lede { font-size: 26px; color: rgba(255,255,255,0.75); max-width: 1200px; line-height: 1.65; margin: 0 0 52px; }
    .next-lede strong { color: oklch(0.8 0.17 60); font-weight: 700; }
    .next-steps { display: flex; gap: 32px; margin-bottom: 52px; flex-wrap: wrap; }
    .ns-step { display: flex; align-items: center; gap: 12px; padding: 14px 22px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; }
    .ns-num { width: 32px; height: 32px; border-radius: 10px; background: oklch(0.75 0.17 60); color: #14130f;
      display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; }
    .ns-t { font-size: 17px; color: #fff; font-weight: 500; }
    .next-cta { display: flex; align-items: center; gap: 40px; flex-wrap: wrap; }
    .cta-btn { padding: 26px 48px; background: oklch(0.75 0.17 60); color: #14130f; border-radius: 999px;
      font-size: 22px; font-weight: 700; letter-spacing: 0.3px; white-space: nowrap; box-shadow: 0 12px 32px -10px oklch(0.5 0.17 60 / 0.5); }
    .cta-contact { border-inline-start: 1px solid rgba(255,255,255,0.15); padding-inline-start: 32px; }
    .cc-k { font-size: 12px; color: rgba(255,255,255,0.45); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; }
    .cc-v { font-size: 18px; color: #fff; font-weight: 500; }

    @media print {
      html, body { background: #fff; }
      body { margin: 0; }
      .deck { gap: 0; padding: 0; }
      .slide { width: 1920px; height: 1080px; transform: none !important;
        margin: 0 !important; box-shadow: none; page-break-after: always; break-after: page; }
      .slide:last-child { page-break-after: auto; break-after: auto; }
    }

    .toolbar { position: fixed; top: 16px; inset-inline-end: 16px; z-index: 99;
      background: rgba(20,19,15,0.92); color: #fff; padding: 10px 14px; border-radius: 10px;
      font-size: 12px; display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 24px -8px rgba(0,0,0,0.3); }
    .toolbar button { background: oklch(0.75 0.17 60); color: #14130f;
      border: none; padding: 7px 14px; border-radius: 7px;
      font-family: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
    .toolbar button:hover { background: oklch(0.72 0.19 55); }
    .toolbar .hint { color: rgba(255,255,255,0.6); }
    @media print { .toolbar { display: none !important; } }
  `;
}
