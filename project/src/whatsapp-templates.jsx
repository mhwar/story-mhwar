// WhatsApp template definitions — Meta-compliant
// Each: name, category, language, header?, body, footer?, buttons?, meta (var labels + samples)

const WA_TEMPLATES = {
  event_invite: {
    name: 'event_invitation_v1',
    category: 'MARKETING',
    language: 'ar_SA',
    senderName: 'مجتمع ثراء',
    header: { type: 'image', hue: 245, label: 'غلاف الفعالية' },
    body:
`مرحباً *{{1}}* 👋

يسرّنا دعوتك لحضور *{{2}}*

📅 التاريخ: {{3}}
📍 المكان: {{4}}

المقاعد محدودة, نرجو تأكيد الحضور.`,
    footer: 'أُرسل عبر محور · mhwar.sa',
    buttons: [
      { type: 'url', text: 'تأكيد الحضور' },
      { type: 'url', text: 'تفاصيل الفعالية' },
    ],
    meta: [
      { label: 'اسم المستلم', sample: 'محمد' },
      { label: 'اسم الفعالية', sample: 'ملتقى ثراء السنوي 2026' },
      { label: 'تاريخ الفعالية', sample: 'الخميس 18 يونيو · 6:00م' },
      { label: 'الموقع', sample: 'مركز الملك خالد الحضاري, أبها' },
    ],
  },

  rsvp_confirm: {
    name: 'rsvp_confirmation_v2',
    category: 'UTILITY',
    language: 'ar_SA',
    senderName: 'مجتمع ثراء',
    header: { type: 'text', text: '✅ تم تأكيد حضورك' },
    body:
`أهلاً *{{1}}*, تم تسجيل حضورك في *{{2}}*.

🎟️ رقم التذكرة: *{{3}}*
📅 {{4}}
📍 {{5}}

احفظ هذه الرسالة واعرض رمز QR عند الدخول.`,
    footer: 'للإلغاء أو التعديل، تواصل معنا',
    buttons: [
      { type: 'url', text: 'عرض التذكرة ورمز QR' },
      { type: 'url', text: 'إضافة للتقويم' },
      { type: 'quick_reply', text: 'إلغاء الحضور' },
    ],
    meta: [
      { label: 'اسم المستلم', sample: 'محمد' },
      { label: 'اسم الفعالية', sample: 'ملتقى ثراء السنوي 2026' },
      { label: 'رقم التذكرة', sample: 'THR-4821' },
      { label: 'تاريخ الفعالية', sample: 'الخميس 18 يونيو · 6:00م' },
      { label: 'الموقع', sample: 'مركز الملك خالد الحضاري' },
    ],
  },

  reminder: {
    name: 'event_reminder_24h_v1',
    category: 'UTILITY',
    language: 'ar_SA',
    senderName: 'مجتمع ثراء',
    body:
`⏰ تذكير: *{{1}}* يبدأ غداً

الوقت: {{2}}
الموقع: {{3}}

عند الوصول توجّه إلى *{{4}}* لتسليم التذكرة.
نراك غداً 👋`,
    footer: 'للوصول: استخدم بوابة الزوار',
    buttons: [
      { type: 'url', text: 'الاتجاهات على الخريطة' },
      { type: 'url', text: 'عرض التذكرة' },
    ],
    meta: [
      { label: 'اسم الفعالية', sample: 'ملتقى ثراء السنوي 2026' },
      { label: 'وقت البداية', sample: '6:00 مساءً' },
      { label: 'الموقع', sample: 'مركز الملك خالد الحضاري, أبها' },
      { label: 'نقطة التسجيل', sample: 'مدخل البوابة الرئيسية' },
    ],
  },

  access_link: {
    name: 'event_access_link_v1',
    category: 'UTILITY',
    language: 'ar_SA',
    senderName: 'مجتمع ثراء',
    header: { type: 'text', text: '🔴 البث الحي بدأ' },
    body:
`أهلاً *{{1}}*,

*{{2}}* بدأ الآن. رابط الدخول المباشر الخاص بك:

{{3}}

الرابط سري ومرتبط بحسابك — لا تشاركه مع أحد.`,
    footer: 'الرابط صالح لمدة 24 ساعة',
    buttons: [
      { type: 'url', text: 'انضم للبث الآن' },
      { type: 'copy_code', text: 'نسخ الرابط' },
    ],
    meta: [
      { label: 'اسم المستلم', sample: 'محمد' },
      { label: 'اسم الفعالية', sample: 'ملتقى ثراء السنوي 2026' },
      { label: 'رابط الدخول', sample: 'live.thraa.sa/j/xK8f2a' },
    ],
  },

  certificate: {
    name: 'attendance_certificate_v1',
    category: 'UTILITY',
    language: 'ar_SA',
    senderName: 'مجتمع ثراء',
    header: { type: 'document', filename: 'certificate-THR-2026-0487.pdf', size: '842 KB · PDF' },
    body:
`تهانينا *{{1}}* 🏆

شهادة حضورك في *{{2}}* جاهزة ومرفقة بهذه الرسالة.

رقم الشهادة: *{{3}}*
تاريخ الإصدار: {{4}}

يمكنك التحقق من صحّتها عبر الرابط أدناه.`,
    footer: 'شهادة رسمية صادرة عبر محور',
    buttons: [
      { type: 'url', text: 'تحقّق من الشهادة' },
      { type: 'url', text: 'أضف إلى LinkedIn' },
    ],
    meta: [
      { label: 'اسم المستلم', sample: 'محمد بن عبدالعزيز' },
      { label: 'اسم الفعالية', sample: 'ملتقى ثراء السنوي 2026' },
      { label: 'رقم الشهادة', sample: 'THR-2026-0487' },
      { label: 'تاريخ الإصدار', sample: '21 يونيو 2026' },
    ],
  },

  feedback: {
    name: 'event_feedback_survey_v1',
    category: 'UTILITY',
    language: 'ar_SA',
    senderName: 'مجتمع ثراء',
    body:
`شكراً *{{1}}* لحضورك *{{2}}*.

كيف كانت تجربتك بشكل عام؟
اضغط الزر المناسب — الاستبيان يستغرق دقيقتين فقط.`,
    footer: 'ردودك سرية وتساعدنا على التحسين',
    buttons: [
      { type: 'quick_reply', text: '😍 ممتازة' },
      { type: 'quick_reply', text: '🙂 جيدة' },
      { type: 'quick_reply', text: '😐 مقبولة' },
      { type: 'url', text: 'الاستبيان الكامل' },
    ],
    meta: [
      { label: 'اسم المستلم', sample: 'محمد' },
      { label: 'اسم الفعالية', sample: 'ملتقى ثراء السنوي 2026' },
    ],
  },

  otp: {
    name: 'login_otp_v1',
    category: 'AUTHENTICATION',
    language: 'ar_SA',
    senderName: 'محور',
    body:
`*{{1}}* هو رمز التحقق الخاص بك.

لا تشارك هذا الرمز مع أي شخص.`,
    footer: 'الرمز صالح لمدة 10 دقائق',
    buttons: [
      { type: 'copy_code', text: 'نسخ الرمز' },
    ],
    meta: [
      { label: 'رمز OTP', sample: '472906' },
    ],
  },

  payment: {
    name: 'payment_confirmation_v1',
    category: 'UTILITY',
    language: 'ar_SA',
    senderName: 'محور',
    header: { type: 'text', text: '✅ تم استلام الدفع' },
    body:
`شكراً *{{1}}*, تم تأكيد دفعتك بنجاح.

المبلغ: *{{2}}*
الوصف: {{3}}
رقم العملية: {{4}}

ستصلك فاتورة ضريبية عبر البريد خلال دقائق.`,
    footer: 'للاستفسار: support@mhwar.sa',
    buttons: [
      { type: 'url', text: 'عرض الفاتورة' },
      { type: 'phone', text: 'الدعم الفني' },
    ],
    meta: [
      { label: 'اسم العميل', sample: 'محمد' },
      { label: 'المبلغ', sample: '450 ر.س' },
      { label: 'الوصف', sample: 'اشتراك محور — خطة النمو (شهري)' },
      { label: 'رقم العملية', sample: 'TXN-9a3f-2026' },
    ],
  },
};

window.WA_TEMPLATES = WA_TEMPLATES;
