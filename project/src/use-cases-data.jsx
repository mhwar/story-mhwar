// Use cases data for Mhwar platform — NEW STRUCTURE
// Three-level model:
//   ROOT_PATTERNS   — the 3 mutually-exclusive root communication patterns
//   PATTERN_TRAITS  — composable traits that further classify a community
//                      each trait declares which root patterns it's allowed under
//   USE_CASES       — library of community types (reusable "types of community")
//                      each case = { name, desc, suggestedSectors, suggestedTraits, suggestedRootPattern }
//
// In a client community record:
//   { uid, nameSource: 'case'|'custom', caseId, name, size, rootPattern, traits: [], notes }

// --- Root patterns (mutually exclusive) ---
const UC_ROOT_PATTERNS = [
  {
    id: 'مفتوح',
    shortEn: 'Open',
    icon: '○',
    hue: 145,
    desc: 'مجتمع يمكن لأي شخص الانضمام إليه — بناء جمهور مهتمين حول علامة أو موضوع.',
    examples: ['مجتمع عملاء', 'جمهور إعلام', 'خريجين', 'نوادي'],
  },
  {
    id: 'مغلق',
    shortEn: 'Closed',
    icon: '⊡',
    hue: 270,
    desc: 'مجتمع مغلق بصلاحيات — دخول محدد بقائمة أعضاء معتمدين.',
    examples: ['مجلس إدارة', 'لجان تنفيذية', 'جمعيات ملاك', 'VIP'],
  },
  {
    id: 'هجين',
    shortEn: 'Hybrid',
    icon: '⇄',
    hue: 40,
    desc: 'مزيج من الأعضاء الذين يدخلون البوابة والبعض الذين يستقبلون الرسائل فقط.',
    examples: ['أجيال متعددة', 'ورش ممتدة', 'جمعيات'],
  },
];

// --- Pattern traits (composable — multiple can be selected per community) ---
// "allowedRoots" lists which root patterns this trait can be attached to.
// Traits are grouped so the UI can organise them.
const UC_PATTERN_TRAITS = [
  // Monetization (open or hybrid only — closed governance bodies don't monetize)
  { id: 'مدفوع',       group: 'التمويل',        label: 'مدفوع',           desc: 'اشتراك شهري/سنوي',           allowedRoots: ['مفتوح', 'هجين'] },
  { id: 'مجاني',       group: 'التمويل',        label: 'مجاني',           desc: 'بدون رسوم اشتراك',           allowedRoots: ['مفتوح', 'مغلق', 'هجين'] },

  // Direction of flow
  { id: 'إرسال-فقط',   group: 'اتجاه التواصل',  label: 'إرسال فقط',       desc: 'الجهة ترسل، المستلم لا يرد', allowedRoots: ['مفتوح', 'مغلق', 'هجين'] },
  { id: 'تفاعلي',      group: 'اتجاه التواصل',  label: 'تفاعلي',          desc: 'نقاش ومحتوى من الأعضاء',     allowedRoots: ['مفتوح', 'مغلق', 'هجين'] },

  // Branding / visibility of Mhwar
  { id: 'بعلامة-محور',  group: 'العلامة',       label: 'بعلامة محور',     desc: 'محور ظاهرة للأعضاء',         allowedRoots: ['مفتوح', 'مغلق', 'هجين'] },
  { id: 'بعلامة-بيضاء', group: 'العلامة',       label: 'بعلامة بيضاء',    desc: 'White-label — هوية العميل',  allowedRoots: ['مفتوح', 'مغلق', 'هجين'] },

  // Nature of the group
  { id: 'داخلي',        group: 'طبيعة المجتمع',  label: 'داخلي',          desc: 'موظفون داخل الجهة',           allowedRoots: ['مغلق', 'هجين'] },
  { id: 'خارجي',        group: 'طبيعة المجتمع',  label: 'خارجي',          desc: 'جمهور خارج الجهة',            allowedRoots: ['مفتوح', 'مغلق', 'هجين'] },
  { id: 'رسمي',         group: 'طبيعة المجتمع',  label: 'رسمي',           desc: 'هيئة حوكمة أو جهة منظمة',     allowedRoots: ['مغلق'] },
];

// --- Cases = library of community types ---
// Fields: num, name, desc, entity, example, suggestedSectors (was cat),
//          suggestedRootPattern, suggestedTraits
const USE_CASES = [
  { id: 1,  suggestedSectors: ['الحوكمة والمجالس'], name: 'مجلس الإدارة',                 desc: 'مشاركة جداول الأعمال والقرارات والتصويت ومحاضر الاجتماعات في بيئة آمنة ومغلقة',            entity: 'شركة مساهمة',                   example: 'أرامكو / سابك',                    suggestedRootPattern: 'مغلق', suggestedTraits: ['رسمي', 'تفاعلي', 'بعلامة-بيضاء'] },
  { id: 2,  suggestedSectors: ['الحوكمة والمجالس'], name: 'لجنة تنفيذية',                 desc: 'قنوات منفصلة لكل لجنة (مراجعة، مكافآت، استراتيجية) مع إمكانية البث للمجلس الكامل',           entity: 'شركة كبرى',                     example: 'بن لادن / المراعي',                suggestedRootPattern: 'مغلق', suggestedTraits: ['رسمي', 'تفاعلي'] },
  { id: 3,  suggestedSectors: ['الحوكمة والمجالس'], name: 'مساهمو الجمعية العمومية',       desc: 'إبلاغ المساهمين بمواعيد الجمعيات والتصويت بالوكالة ومحاضر ما بعد الاجتماع',                 entity: 'شركة مساهمة عامة',              example: 'STC',                              suggestedRootPattern: 'مغلق', suggestedTraits: ['إرسال-فقط', 'رسمي'] },
  { id: 4,  suggestedSectors: ['التواصل المؤسسي الداخلي'], name: 'موظفو الإدارة العامة',          desc: 'قنوات منظمة حسب القسم والمشروع والموقع بديلاً عن قروبات واتساب المبعثرة',                    entity: 'شركة متوسطة/كبيرة',             example: 'بنك / شركة تقنية',                 suggestedRootPattern: 'مغلق', suggestedTraits: ['داخلي', 'تفاعلي'] },
  { id: 5,  suggestedSectors: ['التواصل المؤسسي الداخلي'], name: 'الموظفون الجدد (تأهيل)',      desc: 'مجموعة خاصة لكل دفعة توظيف مع جداول التدريب والسياسات والأسئلة الشائعة',                     entity: 'أي شركة',                       example: 'نيوم / هيئة الترفيه',              suggestedRootPattern: 'مغلق', suggestedTraits: ['داخلي', 'تفاعلي'] },
  { id: 6,  suggestedSectors: ['التواصل المؤسسي الداخلي'], name: 'الفرق الموزعة / العمل عن بعد', desc: 'ربط الفرق في مدن متعددة (رياض، جدة، دمام، نيوم) بقنوات اجتماعية ولقاءات افتراضية',            entity: 'شركة متعددة الفروع',            example: 'الراجحي / زين',                    suggestedRootPattern: 'مغلق', suggestedTraits: ['داخلي', 'تفاعلي'] },
  { id: 7,  suggestedSectors: ['التواصل المؤسسي الداخلي'], name: 'فرق العمليات الميدانية',      desc: 'جدولة الورديات عبر SMS وتنبيهات السلامة عبر واتساب لفرق لا تستخدم الحاسوب',                   entity: 'إنشاءات / نفط / لوجستيات',       example: 'أرامكو المقاولين',                 suggestedRootPattern: 'هجين', suggestedTraits: ['داخلي', 'إرسال-فقط'] },
  { id: 8,  suggestedSectors: ['التواصل مع العملاء والتسويق'], name: 'عملاء المنتج (تحديثات)',        desc: 'إعلان الميزات الجديدة والإصدارات وتغييرات الخدمة مع تخصيص المحتوى حسب شريحة العميل',        entity: 'SaaS / تطبيق',                  example: 'فودكس / صلة / تمارا',              suggestedRootPattern: 'مفتوح', suggestedTraits: ['خارجي', 'إرسال-فقط', 'مجاني'] },
  { id: 9,  suggestedSectors: ['التواصل مع العملاء والتسويق'], name: 'قاعدة المسوّقين/المتسوقين',     desc: 'تسليم عروض الفلاش والموسمية وبرامج الولاء عبر رسائل مستهدفة حسب السلوك الشرائي',              entity: 'تجزئة / تجارة إلكترونية',        example: 'نون / جرير / إكسترا',              suggestedRootPattern: 'مفتوح', suggestedTraits: ['خارجي', 'إرسال-فقط', 'مجاني'] },
  { id: 10, suggestedSectors: ['التواصل مع العملاء والتسويق'], name: 'برنامج الولاء',                 desc: 'إرسال عروض حسب المستوى (فضي، ذهبي، بلاتيني) مع تحديثات رصيد النقاط والوصول المبكر',          entity: 'علامة تجارية',                   example: 'الشايع / العثيم',                  suggestedRootPattern: 'هجين', suggestedTraits: ['خارجي', 'إرسال-فقط'] },
  { id: 11, suggestedSectors: ['التواصل مع العملاء والتسويق'], name: 'مجتمع عملاء ودعم فني',          desc: 'بناء مجتمع يسأل فيه العملاء ويتبادلون النصائح مما يقلل تذاكر الدعم',                         entity: 'شركة تقنية',                     example: 'سلة / زد',                         suggestedRootPattern: 'مفتوح', suggestedTraits: ['خارجي', 'تفاعلي', 'مجاني'] },
  { id: 12, suggestedSectors: ['التواصل مع العملاء والتسويق'], name: 'مشتركو النشرة البريدية',        desc: 'نشر محتوى عبر الإيميل مع نسخة مختصرة على واتساب وإتاحة النقاش في المجتمع',                   entity: 'إعلام / مؤثر / علامة تجارية',     example: 'ثمانية / مجلة رواد الأعمال',        suggestedRootPattern: 'مفتوح', suggestedTraits: ['خارجي', 'إرسال-فقط', 'مجاني'] },
  { id: 13, suggestedSectors: ['التعليم والتدريب'], name: 'دفعة تدريبية',                 desc: 'مجتمع لكل دفعة مع مواد الدورة وقنوات النقاش وتذكيرات الجدول وتخرج لمجموعة خريجين',             entity: 'معهد / بوتكامب',                 example: 'طويق / إدراك',                     suggestedRootPattern: 'مغلق', suggestedTraits: ['تفاعلي', 'مدفوع'] },
  { id: 14, suggestedSectors: ['التعليم والتدريب'], name: 'أعضاء جمعية مهنية',            desc: 'مجتمعات تعلم مستمر للمهنيين مع ساعات تطوير مهني وندوات ومراجع',                              entity: 'جمعية مهنية',                    example: 'هيئة المهندسين / المحاسبين',        suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مدفوع', 'رسمي'] },
  { id: 15, suggestedSectors: ['التعليم والتدريب'], name: 'أولياء الأمور',               desc: 'إرسال التقارير والغياب والفعاليات والتنبيهات الطارئة مع إمكانية قنوات للصفوف',                entity: 'مدرسة / روضة',                   example: 'دار الفكر / المدارس الأهلية',       suggestedRootPattern: 'هجين', suggestedTraits: ['خارجي', 'إرسال-فقط'] },
  { id: 16, suggestedSectors: ['التعليم والتدريب'], name: 'مشتركو دورة مدفوعة',           desc: 'مجتمع حصري كإضافة للدورة: سؤال وجواب مع المدرب ومحتوى إضافي',                               entity: 'مدرب / صانع محتوى',              example: 'مدرب Udemy / منصة دروس',          suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مدفوع', 'بعلامة-بيضاء'] },
  { id: 17, suggestedSectors: ['التعليم والتدريب'], name: 'طلاب جامعة',                   desc: 'منصة للأندية الطلابية والإعلانات الأكاديمية ومجموعات المواد الدراسية',                        entity: 'جامعة',                          example: 'الملك عبدالعزيز / KAUST',          suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني'] },
  { id: 18, suggestedSectors: ['الفعاليات والمؤتمرات'], name: 'حضور مؤتمر/معرض',              desc: 'بناء مجتمع قبل وأثناء وبعد الفعالية: تعارف، جدول، تحديثات فورية، محتوى ما بعد',               entity: 'منظم فعاليات',                   example: 'LEAP / بيبان',                     suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني', 'خارجي'] },
  { id: 19, suggestedSectors: ['الفعاليات والمؤتمرات'], name: 'مشاركون في ورشة عمل',          desc: 'دورة كاملة: ترويج SMS → تأكيد → مواد مسبقة → متابعة → شهادة',                                entity: 'شركة تدريب',                     example: 'بيوند / مسك',                      suggestedRootPattern: 'هجين', suggestedTraits: ['إرسال-فقط', 'تفاعلي'] },
  { id: 20, suggestedSectors: ['الفعاليات والمؤتمرات'], name: 'عارضون في معرض',               desc: 'مجتمع خاص للعارضين مع تحديثات الأجنحة والخدمات اللوجستية والمواعيد النهائية',                  entity: 'شركة معارض',                     example: 'معارض الرياض / جدة سوبر دوم',        suggestedRootPattern: 'مغلق', suggestedTraits: ['تفاعلي', 'رسمي'] },
  { id: 21, suggestedSectors: ['الفعاليات والمؤتمرات'], name: 'جمهور فعاليات أونلاين',         desc: 'إدارة ندوات ولقاءات افتراضية دورية مع أرشيف المحتوى وقنوات النقاش',                          entity: 'حاضنة / جمعية',                  example: 'حاضنة أعمال',                      suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني'] },
  { id: 22, suggestedSectors: ['القطاع غير الربحي والحكومي'], name: 'المتبرعون',                    desc: 'تقارير أثر مخصصة حسب مستوى التبرع وتذكيرات الزكاة وحملات جمع التبرعات',                      entity: 'جمعية خيرية',                    example: 'إنسان / البر',                     suggestedRootPattern: 'هجين', suggestedTraits: ['خارجي', 'إرسال-فقط'] },
  { id: 23, suggestedSectors: ['القطاع غير الربحي والحكومي'], name: 'أعضاء غرفة تجارية',             desc: 'ربط آلاف الشركات الأعضاء بتحديثات تنظيمية وفعاليات تواصل ومجموعات قطاعية',                    entity: 'غرفة تجارية',                    example: 'غرفة جدة / الرياض',                suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'رسمي', 'مدفوع'] },
  { id: 24, suggestedSectors: ['القطاع غير الربحي والحكومي'], name: 'مواطنو بلدية',                  desc: 'تنبيهات انقطاع الخدمات وجلسات الاستماع العامة واستبيانات رأي المواطنين',                     entity: 'بلدية / أمانة',                  example: 'أمانة جدة / الرياض',               suggestedRootPattern: 'مفتوح', suggestedTraits: ['خارجي', 'إرسال-فقط', 'مجاني', 'رسمي'] },
  { id: 25, suggestedSectors: ['القطاع غير الربحي والحكومي'], name: 'المتطوعون',                     desc: 'تجنيد وتنظيم وتواصل مع المتطوعين: مناوبات عبر واتساب ومواد تدريبية في البوابة',              entity: 'منظمة غير ربحية',                example: 'منصة العطاء',                      suggestedRootPattern: 'هجين', suggestedTraits: ['تفاعلي', 'مجاني'] },
  { id: 26, suggestedSectors: ['القطاع غير الربحي والحكومي'], name: 'أعضاء نقابة مهنية',             desc: 'إدارة أعضاء وبث تغييرات تنظيمية وتصويت على اتفاقيات وتجديد عضويات',                         entity: 'نقابة / جمعية',                  example: 'المهندسين / المحامين',             suggestedRootPattern: 'مغلق', suggestedTraits: ['تفاعلي', 'رسمي', 'مدفوع'] },
  { id: 27, suggestedSectors: ['العقارات والمجمعات السكنية'], name: 'سكّان مجمع سكني',               desc: 'إشعارات صيانة وقواعد المجمع وحجز المرافق وتنبيهات طوارئ للسكان',                             entity: 'شركة إدارة عقارات',              example: 'مجمع الحمراء / درة العروس',         suggestedRootPattern: 'هجين', suggestedTraits: ['خارجي', 'إرسال-فقط'] },
  { id: 28, suggestedSectors: ['العقارات والمجمعات السكنية'], name: 'جمعية ملاك',                    desc: 'إعلانات اجتماعات واعتماد ميزانيات وطلبات صيانة وتصويت على قرارات المبنى',                    entity: 'جمعية ملاك',                     example: 'برج سكني / حي',                    suggestedRootPattern: 'مغلق', suggestedTraits: ['تفاعلي', 'رسمي'] },
  { id: 29, suggestedSectors: ['الصحة والعافية'], name: 'مرضى عيادة',                   desc: 'تأكيد مواعيد ونتائج فحوصات وتذكيرات أدوية وتعليمات متابعة',                                 entity: 'مستشفى / عيادة',                 example: 'مستشفى المملكة',                   suggestedRootPattern: 'مغلق', suggestedTraits: ['خارجي', 'إرسال-فقط'] },
  { id: 30, suggestedSectors: ['الصحة والعافية'], name: 'أعضاء نادٍ رياضي',              desc: 'مجتمع أعضاء النادي مع جداول الحصص ونصائح التغذية وتتبع التقدم',                              entity: 'نادي رياضي',                     example: 'فتنس تايم',                        suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مدفوع', 'خارجي'] },
  { id: 31, suggestedSectors: ['الصحة والعافية'], name: 'مجموعة دعم صحي',                desc: 'مجتمعات خاصة ومراقبة لمرضى أمراض مزمنة (سكري، صحة نفسية) بإشراف متخصصين',                    entity: 'مقدم خدمة صحية',                 example: 'جمعية مرضى',                       suggestedRootPattern: 'مغلق', suggestedTraits: ['تفاعلي'] },
  { id: 32, suggestedSectors: ['صناع المحتوى والإعلام'], name: 'جمهور مؤثر (مدفوع)',            desc: 'مجتمع حصري للمعجبين مع محتوى مبكر وكواليس وتفاعل مباشر مقابل اشتراك شهري',                    entity: 'مؤثر / صانع محتوى',              example: 'يوتيوبر / بودكاستر',               suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مدفوع', 'بعلامة-بيضاء'] },
  { id: 33, suggestedSectors: ['صناع المحتوى والإعلام'], name: 'جمهور وسيلة إعلامية',          desc: 'مجتمع قراء/مستمعين مع نقاشات وتنبيهات أخبار عاجلة عبر واتساب',                               entity: 'وسيلة إعلامية',                  example: 'ثمانية / فنجان',                   suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني'] },
  { id: 34, suggestedSectors: ['صناع المحتوى والإعلام'], name: 'مستمعو بودكاست',               desc: 'نقاش الحلقات واقتراح مواضيع وتفاعل مع الضيوف مع إشعارات الحلقات الجديدة',                    entity: 'بودكاستر',                       example: 'أي بودكاست عربي',                  suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني'] },
  { id: 35, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'شبكة أجيال متعددة',             desc: 'تنظيم يخدم أعضاء من 20 لـ 70 سنة: الشباب بالتطبيق وكبار السن بالـ SMS',                     entity: 'شركة عائلية / جمعية',            example: 'مجموعة عائلية / قبيلة',            suggestedRootPattern: 'هجين', suggestedTraits: ['تفاعلي'] },
  { id: 36, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'قائمة طوارئ وأزمات',            desc: 'قوالب بث طوارئ تُرسل فوراً على جميع القنوات مع تأكيد الوصول',                                entity: 'أي جهة',                         example: 'شركة صناعية / جامعة',              suggestedRootPattern: 'مغلق', suggestedTraits: ['إرسال-فقط', 'رسمي'] },
  { id: 37, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'مجلس قبيلة / عائلي',             desc: 'تنسيق الأعراس والعزاء والعيد وقرارات الأراضي والإرث مع جسر الفجوة التقنية',                  entity: 'عائلة / قبيلة',                  example: 'مجلس قبيلة / عائلة ممتدة',          suggestedRootPattern: 'هجين', suggestedTraits: ['تفاعلي'] },
  { id: 38, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'جماهير نادٍ رياضي',              desc: 'تحديثات المباريات وبيع التذاكر والمنتجات وجلسات تفاعل مع اللاعبين',                         entity: 'نادي رياضي',                     example: 'الاتحاد / الهلال',                 suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني', 'خارجي'] },
  { id: 39, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'رواد أعمال في حاضنة',            desc: 'مجتمع لكل دفعة مع دليل المرشدين وتقويم الفعاليات ومكتبة الموارد',                            entity: 'حاضنة / مسرعة',                  example: 'Flat6Labs / SVC / واعد',          suggestedRootPattern: 'مغلق', suggestedTraits: ['تفاعلي', 'مدفوع'] },
  { id: 40, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'مشترون — مجتمع ما بعد الشراء',   desc: 'مجتمع مشترين يتبادلون المراجعات والنصائح (أزياء/طبخ/إلكترونيات)',                             entity: 'متجر إلكتروني',                  example: 'نمشي / متجر محلي',                suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني', 'خارجي'] },
  { id: 41, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'خريجو جامعة',                    desc: 'تواصل مدى الحياة مع الخريجين: وظائف، إرشاد، لقاءات الدفعات، حملات تبرع',                    entity: 'جامعة',                          example: 'الملك سعود / الفيصل',              suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني'] },
  { id: 42, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'أصحاب امتياز (فرانشايز)',        desc: 'تواصل مركزي مع أصحاب الامتياز: معايير تشغيل، حملات تسويقية، تحديثات القائمة',                 entity: 'علامة فرانشايز',                 example: 'الطازج / كودو / شاورمر',           suggestedRootPattern: 'مغلق', suggestedTraits: ['تفاعلي', 'رسمي'] },
  { id: 43, suggestedSectors: ['حالات متخصصة ومتقدمة'], name: 'مرتادو مسجد/وقف',                 desc: 'إشعارات أوقات الصلاة وجدول رمضان وحلقات القرآن وحملات تبرع',                                  entity: 'مسجد / وقف',                      example: 'مسجد حي / إدارة أوقاف',             suggestedRootPattern: 'مفتوح', suggestedTraits: ['تفاعلي', 'مجاني'] },
];

// Categories (unchanged structure)
const UC_CATEGORIES = [
  { id: 'الحوكمة والمجالس',            short: 'حوكمة',     accent: 'oklch(0.45 0.15 270)',  bg: 'oklch(0.96 0.02 270)',  brief: 'مجالس إدارة، لجان، مساهمين' },
  { id: 'التواصل المؤسسي الداخلي',     short: 'داخلي',     accent: 'oklch(0.48 0.13 225)',  bg: 'oklch(0.96 0.02 225)',  brief: 'موظفون، أقسام، فرق موزعة، عمليات ميدانية' },
  { id: 'التواصل مع العملاء والتسويق', short: 'عملاء',     accent: 'oklch(0.55 0.17 40)',   bg: 'oklch(0.96 0.025 40)',  brief: 'حملات، ولاء، دعم، نشرات بريدية' },
  { id: 'التعليم والتدريب',             short: 'تعليم',     accent: 'oklch(0.48 0.13 165)',  bg: 'oklch(0.96 0.025 165)', brief: 'جامعات، مدارس، دفعات، مدربون' },
  { id: 'الفعاليات والمؤتمرات',          short: 'فعاليات',   accent: 'oklch(0.48 0.17 320)',  bg: 'oklch(0.96 0.03 320)',  brief: 'مؤتمرات، ورش عمل، معارض' },
  { id: 'القطاع غير الربحي والحكومي',    short: 'غير ربحي',  accent: 'oklch(0.47 0.14 145)',  bg: 'oklch(0.96 0.025 145)', brief: 'جمعيات خيرية، بلديات، نقابات، تطوع' },
  { id: 'العقارات والمجمعات السكنية',    short: 'عقارات',    accent: 'oklch(0.52 0.14 70)',   bg: 'oklch(0.96 0.03 70)',   brief: 'جمعيات ملاك، مجمعات سكنية' },
  { id: 'الصحة والعافية',                short: 'صحة',       accent: 'oklch(0.5 0.13 205)',   bg: 'oklch(0.96 0.025 205)', brief: 'عيادات، أندية رياضية، مجموعات دعم' },
  { id: 'صناع المحتوى والإعلام',         short: 'إعلام',     accent: 'oklch(0.5 0.16 350)',   bg: 'oklch(0.96 0.025 350)', brief: 'مؤثرون، بودكاست، مجتمعات جماهير' },
  { id: 'حالات متخصصة ومتقدمة',          short: 'متقدم',     accent: 'oklch(0.45 0.04 30)',   bg: 'oklch(0.96 0.015 30)',  brief: 'طوارئ، أجيال، حاضنات، فرانشايز، أوقاف' },
];

// Legacy alias for back-compat (old store reads it)
const UC_PATTERNS = UC_ROOT_PATTERNS.map(p => ({
  id: p.id, shortEn: p.shortEn, visible: 'yes', icon: p.icon,
  desc: p.desc, examples: p.examples, channels: [], hue: p.hue,
}));

Object.assign(window, { USE_CASES, UC_CATEGORIES, UC_PATTERNS, UC_ROOT_PATTERNS, UC_PATTERN_TRAITS });
