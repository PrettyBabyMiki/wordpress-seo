/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */
const articles = [ "الـ" ];

const cardinalNumerals = [ "صفر", "واحد", "واحدة", "أحد", "إحدى", "إثنان", "اثنتان", "إثنين", "ثنتين", "إثنتين", "إثنا",
	"إثنى", "إثنتا", "إثنتي", "ثلاث", "ثلاثة", "أربع", "أربعة", "خمس", "خمسة", "ست", "ستة", "سبع", "سبعة", "ثمان",
	"ثمانية", "تسع", "تسعة", "عشر", "عشرة", "عشرون", "ثلاثون", "أربعين", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون",
	"تسعون", "مئة", "مائة", "مئتان", "ثلاثمئة", "ثلاثمائة", "أربعمئة", "أربعمائة", "خمسمئة", "خمسمائة", "ستمئة", "ستمائة",
	"سبعمئة", "سبعمائة", "ثمانمئة", "ثمانمائة", "تسعمئة", "تسعمائة", "ألف", "ألآف", "ألفا", "ألفين", "مليون", "ملايين", "مليار" ];

const ordinalNumerals = [ "الأول", "الأولى", "الثاني", "الثانية", "الثالث", "الثالثة", "الرابع", "الرابعة", "الخامس",
	"الخامسة", "السادس", "السادسة", "السابع", "السابعة", "الثامن", "الثامنة", "التاسع", "التاسعة", "العاشر", "العاشرة",
	"الحادي", "الحادية", "العشرون", "الثلاثون", "الأربعون", "الخمسون", "الستون", "السبعون", "الثمانون", "التسعون",
	"المئة", "المائة" ];

const personalPronounsNominative = [ "أنا", "انت", "هو", "هي", "نحن", "أنتما", "هما", "أنتم", "أنتن", "هم", "هن",
	"وأنا", "وأنت", "وهو", "وانا", "ونحن", "وهي", "وانت", "أنتي", "فهو", "وهم", "وأنتما" ];

const personalPronounsAccusative = [ "إياه", "إياهما", "إياهم", "إياها", "إياكما", "إياهن", "إياك", "إياكم", "إياكن",
	"إياي", "إيانا" ];

const demonstrativePronouns = [ "هذا", "هذه", "هذان", "هذين", "هتان", "هـتين", "ذا", "ذان", "ذين", "أولئ", "ذلك",
	"ذانك", "ذينك", "تلك", "تانك", "تينك", "أولئك", "هؤلاء", "ذاك", "هاتان", "هاتين", "ذه", "هأولئ", "ذلكم", "ذلكم",
	"وهذا", "هذة", "أولئك" ];

const vocativeParticles = [ "يا", "أي", "هيا", "أ", "آ", "أيها", "أيتها" ];

const quantifiers = [ "جميع", "كل", "بعض", "كثير", "كثيرة", "عديد", "عديدة", "لبعض", "قليلا", "كافية", "كافي", "صغير",
	"صغيرة", "قليل", "قليلة", "كثيرا", "بالكثير", "أكثر", "اكبر", "اغلب", "عديدة", "عديد", "قليلون", "أقل", "كل",
	"الكثير", "المزيد", "اكثر", "الأقل", "يكفي", "العديد", "كله", "جميعا", "كلها", "وكل", "كلنا", "كثيرة", "الأكثر",
	"ببعض", "بضعة", "عدة" ];

const reflexivePronouns = [ "نفسي", "نفسك", "نفسه", "نفسها", "أنفسنا", "أنسفكم", "أنفسهم", "أنفسهما", "أنفسكما",
	"أنفسكن", "أنفسهن", "بنفسي" ];

const indefinitePronouns = [ "ليس", "جميع", "الكل", "الجميع", "شخص", "شيء", "شيئا", "أخرى", "آخرين", "أي", "أيا", "من",
	"الآخرين", "أحد", "شئ", "أخرى", "شىء", "احد", "أية", "اخرى", "البعض", "أخر", "الآخر", "أحدهم", "الأخرى", "الشئ",
	"بعضنا", "بشيء", "شي", "الغير" ];

const relativePronouns = [ "الذي", "التي", "الذى", "التى", "الذين", "مالذي", "اللذان", "الذين", "اللتان", "اللاتي", "الذي",
	"اللتين", "اللذين" ];

const intensifiers = [ "جدا", "حقا", "للغاية", "تماما", "فعلا" ];

const interrogativeDeterminers = [ "ماذا", "لمن", "ما", "أي", "أى", "وماذا", "وما", "بماذا", "ماهو", "ماهذا" ];
const interrogativePronouns = [ "من", "ومن" ];
const interrogativeProAdverbs = [ "اين", "كيف", "لماذا", "لم", "سواء", "أينما", "كيفما", "مـتى", "كم", "هل", "أين", "أهذا", "وكيف", "وهل",  ];

const locativeAdverbs = [ "هنا", "هناك", "هنالك" ];
const adverbialGenitives = [ "دائما", "مرة", "مرتين" ];
const otherAuxiliaries = [ "يجب", "سوف", "قد", "أستطيع", "يستطيع", "نستطيع", "تستطيع", "استطيع", "تستطيعين", "استطعت",
	"استطاعت", "استطاع", "استطعتما", "استطاعتا", "استطاعا", "استطعنا", "استطعتن", "استطعتم", "استطعن", "استطاعوا",
	"تستطيعان", "يستطيعان", "تستطعن", "تستطيعون", "يستطعن", "يستطيعون", "تستطيعي", "تستطيعا", "يستطيعا", "تستطيعوا",
	"يستطيعوا", "استطيعت", "استطيعتا", "استطيعا", "استطيعوا", "تستطاعين", "تستطاع", "يستطاع", "نستطاع", "تستطاعان",
	"يستطاعان", "تستطاعون", "يستطاعون", "أستطاع", "تستطاعي", "تستطاعا", "يستطاعا", "يستطاعوا", "تستطاعوا", "استطيعي",
	"يمكنني", "يمكن", "يمكننى", "بإمكانك", "لابد", "ينبغي", "وسوف", "هلا", "بد", "وقد", "ولقد", "يمكنه", "يمكنهما",
	"يمكنهم", "يمكنها", "يمكنكما", "يمكنهن", "يمكنك", "يمكنكم", "يمكنكن", "يمكني", "يمكننا" ];

const copula = [ "لدي", "لديك", "لدينا", "لديه", "لديها", "لديهم", "لديهما", "لديكم", "لديكما", "لديهن", "لديكن", "صبحت",
	"صبح", "صبحتما", "صبحا", "صبحتا", "صبحنا", "صبحتن", "صبحتم", "صبحن", "صبحوا", "أصبح", "تصبحين", "تصبح", "يصبح",
	"تصبحان", "يصبحان", "نصبح", "تصبحن", "تصبحون", "تصبحي", "تصبحا", "يصبحا", "تصبحوا", "يصبحوا", "اصبحي", "اصبحوا",
	"اصبحا", "ابقى", "كان", "كنت", "كانت", "يكون", "كنتما", "كانتا", "كانا", "كنا", "كن", "كانوا", "كنتم", "أكون",
	"تكونين", "تكون", "تكونان", "يكونان", "نكون", "تكونون", "يكن", "يكونون", "تكوني", "تكونا", "يكونا", "تكونوا",
	"يكونوا", "كونا", "كونوا", "كن", "أكن", "اكون", "وكان", "كوني", "اكن", "سنكون", "كنا", "سيكون", "يكن", "ستكون",
	"تكن", "سأكون", "بت", "باتت", "بات", "بتما", "باتتا", "باتا", "بتنا", "بتن", "بتم", "باتوا", "أبيت", "بت", "صرت",
	"صرت", "صار", "صرتما", "صارتا", "صارا", "صرنا", "صرتن", "صرتم", "صرن", "صاروا", "أصير", "تصيرين", "تصير", "يصير",
	"تصيران", "يصيران", "نصير", "تصرن", "يصرن", "تصيرون", "يصيرون", "تصيري", "تصيرا", "يصيرا", "تصيروا", "يصيروا", "ليس",
	"وليس", "ليست", "ليسوا", "ليسا", "ليسنا", "ليسن", "أليس", "اليس", "لست", "لسنا" ];

const prepositions = [ "أن", "في", "على", "إلى", "ان", "عن", "فى", "مع", "الى", "بعد", "بدون", "تحت", "طوال", "علي", "غير",
	"لدى", "حول", "خلال", "لكي", "بين", "الي", "خارج", "بشأن", "فوق", "دون", "لـ", "بـ", "بلا", "بواسطة", "ضد", "أمام",
	"وفي", "وشك", "نحو", "ذو", "أسفل", "ب", "خلف", "بجانب", "عدا", "طبقا", "بعد", "عكس", "منذ" ];

const prepositionPrecedingPronouns = [ "إليه", "إليهما", "إليهم", "إليها", "إليكما", "إليهن", "إليك", "إليكم", "إليكن",
	"إلي", "إلينا", "عليه", "عليهما", "عليهم", "عليها", "عليكما", "عليهن", "عليك", "عليكم", "عليكن", "علي", "علينا",
	"عنه", "عنهما", "عنهم", "عنها", "عنكما", "عنهن", "عنك", "عنكم", "عنكن", "عني", "عننا", "له", "لهما", "لهم", "لها", "لكما", "لهن",
	"لك", "لكم", "لكن", "لي", "لنا", "معه", "معهما", "معهم", "معها", "معكما", "معهن", "معك", "معكم", "معكن", "معي", "معنا", "منه",
	"منهما", "منهم", "منها", "منكم", "منهن", "منك", "منكم", "منكن", "مني", "منا", "فيه", "فيهما", "فيهم", "فيها", "فيكما", "فيهن",
	"فيك", "فيكم", "به", "بهما", "بهم", "بها", "بكما", "بهن", "بك", "بكم", "بكن", "بي", "بنا", "بينهم", "بينهما", "بينكما", "بينكم",
	"بتلك", "بذلك", "فأنت", "بيننا", "بهذا", "بهذه", "فأنا", "فهذا", "فيما", "أجلك", "كهذا", "لأي", "لذلك", "لما", "لنفسك", "لهذا", "لهذه" ];

// Many prepositional adverbs are already listed as preposition.
const prepositionalAdverbs = [ "داخل", "ضمن", "قدما" ];

const coordinatingConjunctions = [ "و", "و/او", "او", "أو" ];

const subordinatingConjunctions = [ "إذا", "لو", "اذا", "وإذا", "أذا" ];

// These verbs are frequently used in interviews to indicate questions and answers.
const interviewVerbs = [ "أقول", "تقول", "تقولين", "تقولان", "يقول", "تقول", "يقولان", "تقولان", "نقول", "تقولون", "تقلن",
	"يقولون", "قلت", "قلتما", "قال", "قالت", "قالا", "قالتا", "قلنا", "قلتما", "قلتن", "قالوا", "قلنا", "تدعي", "يدعي",
	"تدعيان", "تدعون", "يدعون", "يدعين", "ادعيت", "ادعيت", "ادعيتما", "ادعى", "ادعت", "ادعينا", "ادعيتما", "ادعيتن", "ادعوا",
	"ادعينا", "تسأل", "تسألين", "يسأل", "تسأل", "نسأل", "تسألون", "تسألن", "يسألون", "يسألن", "سألت", "سألنا", "سألتم",
	"سألتن", "سألوا", "سألنا", "تشرح", "تشرحين", "يشرح", "تشرح", "نشرح", "تشرحون", "تشرحن", "يشرحون", "يشرحن", "شرحت", "شرح",
	"شرحت", "شرحنا", "شرحتم", "شرحتن", "شرحوا", "شرحنا", "شرحن", "أعتقد", "تعتقد", "تعتقدين", "يعتقد", "تعتقد", "تعتقدون",
	"تعتقدن", "يعتقدون", "يعتقدن", "اعتقدت", "اعتق", "اعتقدت", "أتحدث", "تتحدث", "تتحدثين", "يتحدث", "تتحدث", "نتحدث", "تحدثت",
	"تحدث", "تحدثت", "تحدثوا", "تحدثن", "أعلن", "تعلن", "تعلنين", "يعلن", "تعلن", "نعلن", "يعلنون", "يعلن", "أعلنت", "أعلن",
	"أعلنت", "أعلنا", "أعلنوا", "أعلن", "أناقش", "تناقش", "تناقشين", "يناقش", "تناقش", "نناقش", "تناقشون", "تناقشن", "يناقشون",
	"يناقشن", "ناقشت", "ناقشت", "ناقشت", "ناقشت", "ناقشت", "ناقشنا", "ناقشتم", "ناقشتن", "ناقشوا", "ناقشن", "أفهم", "تفهم",
	"تفهمين", "يفهم", "تفهم", "نفهم", "يفهمون", "يفهمن", "فهمت", "فهم", "فهمت", "فهمنا", "فهموا", "فهمن" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
const additionalTransitionWords = [ "الآن", "كذلك", "ربما", "كما", "لذا", "الان", "الأن", "بما", "أيضا", "بالنسبة",
	"فحسب", "والآن", "بكل", "مما", "ايضا", "بخصوص", "القادمة", "المحتمل", "مازال", "مازلت", "طالما", "قط", "بالتأكيد",
	"بدلا", "بوضوح", "فورا", "حالا", "التالي", "حاليا", "بالعادة", "تقريبا", "ببساطة", "اختياريا", "أحيانا", "أبدا",
	"بالمناسبة", "خاصة", "مؤخرا", "نسبيا" ];

// These verbs convey little meaning.
const delexicalizedVerbs = [ "يعني", "أحتاج", "يعمل", "تعني", "تقوم", "أود", "عندك", "البقاء", "حاولت", "توجد", "دعونا",
	"تفكر", "جئت", "يريدون", "أتيت", "فعلته", "تقصد", "زال", "إرادة‎", "مريد‎", "مراد‎", "أردت‎", "أردت‎", "أردت‎", "أرادت‎",
	"أريد‎", "تريد‎", "تريدين‎", "يريد‎", "تريد‎", "أريد‎", "تريد‎", "يريد‎", "تريد‎", "أرد‎", "ترد‎", "يرد‎", "ترد‎", "أرد‎", "أريدي‎",
	"أردتما", "تريدان‎", "تريدا‎", "تريدا‎", "أريدا‎", "أرادا‎", "أرادتا‎", "يريدان‎", "تريدان‎", "يريدا‎", "تريدا‎", "أردنا‎", "نريد‎",
	"نريد‎", "نرد‎", "أردتم‎", "أردتن‎", "تريدون‎", "تردن‎", "تريدوا‎", "تردن‎", "تريدوا‎", "تردن‎", "أريدوا‎", "أردن‎", "أرادوا‎", "أردن‎",
	"يريدون‎", "يردن‎", "يريدوا‎", "أردت‎", "أراد", "أراد", "أرد‎", "أردت‎", "أريد‎", "أردتما‎", "أريدا‎", "أردنا‎", "أردتم‎", "أريدوا‎",
	"أردت‎", "أريدت‎", "أريدتا‎", "أردتن‎", "أردن‎", "تراد‎", "يراد‎", "ترادان‎", "يرادان‎", "نراد‎", "ترادون‎", "يرادون‎", "ترادين‎",
	"تراد‎", "ترادان‎", "تردن‎", "يردن‎", "تراد‎", "يراد‎", "ترادا‎", "يرادا‎", "نراد‎", "ترادوا‎", "يرادوا‎", "ترادي‎", "تراد‎", "ترادا‎",
	"تردن‎", "يردن‎", "ترد‎", "يرد‎", "ترادا‎", "يرادا‎", "نرد‎", "ترادوا‎", "يرادوا‎", "ترادي‎", "ترد‎", "ترادا‎", "تردن‎", "يردن‎", "أرد‎",
	"اعتقاد‎", "معتقد‎", "معتقد‎", "اعتقدت‎", "اعتقدت‎", "اعتقد", "اعتقدتما‎", "اعتقدا‎", "اعتقدنا‎", "اعتقدتم‎", "اعتقدوا‎", "اعتقدت‎",
	"اعتقدت‎", "اعتقدتا‎", "اعتقدتن‎", "اعتقدن‎", "تعتقد‎", "يعتقد‎", "تعتقدان‎", "يعتقدان‎", "نعتقد‎", "تعتقدون‎", "يعتقدون‎", "تعتقدين‎",
	"تعتقد‎", "تعتقدان‎", "تعتقدن‎", "يعتقدن‎", "تعتقد‎", "يعتقد‎", "تعتقدا‎", "يعتقدا‎", "نعتقد‎", "تعتقدوا‎", "يعتقدوا‎", "تعتقدي‎",
	"تعتقد‎", "تعتقدا‎", "تعتقدن‎", "يعتقدن‎", "تعتقد‎", "يعتقد‎", "تعتقدا‎", "يعتقدا‎", "نعتقد‎", "تعتقدوا‎", "يعتقدوا‎", "تعتقدي‎",
	"تعتقد‎", "تعتقدا‎", "تعتقدن‎", "يعتقدن‎", "اعتقدي‎", "اعتقدن‎", "اعتقد", "اعتقدا‎", "اعتقدوا‎", "اعتقدت‎", "اعتقدت‎", "اعتقد",
	"اعتقدتما‎", "اعتقدا‎", "اعتقدنا‎", "اعتقدتم‎", "اعتقدوا‎", "اعتقدت‎", "اعتقدت‎", "اعتقدتا‎", "اعتقدتن‎", "اعتقدن‎", "أعتقد‎",
	"تعتقد‎", "يعتقد‎", "تعتقدان‎", "يعتقدان‎", "نعتقد‎", "تعتقدون‎", "يعتقدون‎", "تعتقدين‎", "تعتقد‎", "تعتقدان‎", "تعتقدن‎", "يعتقدن‎",
	"أعتقد‎", "تعتقد‎", "يعتقد‎", "تعتقدا‎", "يعتقدا‎", "نعتقد‎", "تعتقدوا‎", "يعتقدوا‎", "تعتقدي‎", "تعتقد‎", "تعتقدا‎", "تعتقدن‎",
	"يعتقدن‎", "أعتقد‎", "تعتقد‎", "يعتقد‎", "تعتقدا‎", "يعتقدا‎", "نعتقد‎", "تعتقدوا‎", "يعتقدوا‎", "تعتقدي‎", "تعتقد‎", "تعتقدا‎",
	"تعتقدن‎", "يعتقدن‎", "اعتقد", "اعتقدا‎", "اعتقدوا‎", "إيجاد‎", "موجد‎", "موجد‎", "أوجدت‎", "أوجدت‎", "أوجد", "أوجدتما‎", "أوجدا‎",
	"أوجدنا‎", "أوجدتم‎", "أوجدوا‎", "أوجدت‎", "أوجدت‎", "أوجدتا‎", "أوجدتن‎", "أوجدن‎", "أوجد", "توجد‎", "يوجد‎", "توجدان‎", "يوجدان‎",
	"نوجد‎", "توجدون‎", "يوجدون‎", "توجدين‎", "توجد‎", "توجدان‎", "توجدن‎", "يوجدن‎", "أوجد", "توجد‎", "يوجد‎", "توجدا‎", "يوجدا‎", "نوجد‎",
	"توجدوا‎", "يوجدوا‎", "توجدي‎", "توجد‎", "توجدا‎", "توجدن‎", "يوجدن‎", "أوجد", "توجد‎", "يوجد‎", "توجدا‎", "يوجدا‎", "نوجد‎", "توجدوا‎",
	"يوجدوا‎", "توجدي‎", "توجد‎", "توجدا‎", "توجدن‎", "يوجدن‎", "أوجد", "أوجدا‎", "أوجدوا‎", "أوجدي‎", "أوجدن‎", "أوجدت‎", "أوجدت‎", "أوجد",
	"أوجدتما‎", "أوجدا‎", "أوجدنا‎", "أوجدتم‎", "أوجدوا‎", "أوجدت‎", "أوجدت‎", "أوجدتا‎", "أوجدتن‎", "أوجدن‎", "أوجد", "توجد‎", "يوجد‎",
	"توجدان‎", "يوجدان‎", "نوجد‎", "توجدون‎", "يوجدون‎", "توجدين‎", "توجد‎", "توجدان‎", "توجدن‎", "يوجدن‎", "أوجد", "توجد‎", "يوجد‎",
	"توجدا‎", "يوجدا‎", "نوجد‎", "توجدوا‎", "يوجدوا‎", "توجدي‎", "توجد‎", "توجدا‎", "توجدن‎", "يوجدن‎", "أوجد", "توجد‎", "يوجد‎", "توجدا‎",
	"يوجدا‎", "نوجد‎", "توجدوا‎", "يوجدوا‎", "توجدي‎", "توجد‎", "توجدا‎", "توجدن‎", "يوجدن‎", "اعتقد", "اريد", "أذهب", "إذهاب‎", "مذهب‎",
	"مذهب‎", "أذهبت‎", "أذهبت‎", "أذهب", "أذهبتما‎", "أذهبا‎", "أذهبنا‎", "أذهبتم‎", "أذهبوا‎", "أذهبت‎", "أذهبت‎", "أذهبتا‎", "أذهبتن‎",
	"أذهبن‎", "أذهب", "تذهب‎", "يذهب‎", "تذهبان‎", "يذهبان‎", "نذهب‎", "تذهبون‎", "يذهبون‎", "تذهبين‎", "تذهب‎", "تذهبان‎", "تذهبن‎",
	"يذهبن‎", "أذهب", "تذهب‎", "يذهب‎", "تذهبا‎", "يذهبا‎", "نذهب‎", "تذهبوا‎", "يذهبوا‎", "تذهبي‎", "تذهب‎", "تذهبا‎", "تذهبن‎", "يذهبن‎",
	"أذهب", "تذهب‎", "يذهب‎", "تذهبا‎", "يذهبا‎", "نذهب‎", "تذهبوا‎", "يذهبوا‎", "تذهبي‎", "تذهب‎", "تذهبا‎", "تذهبن‎", "يذهبن‎", "أذهب",
	"أذهبا‎", "أذهبوا‎", "أذهبي‎", "أذهبن‎", "أذهبت‎", "أذهبت‎", "أذهب", "أذهبتما‎", "أذهبا‎", "أذهبنا‎", "أذهبتم‎", "أذهبوا‎", "أذهبت‎",
	"أذهبت‎", "أذهبتا‎", "أذهبتن‎", "أذهبن‎", "أذهب", "تذهب‎", "يذهب‎", "تذهبان‎", "يذهبان‎", "نذهب‎", "تذهبون‎", "يذهبون‎", "تذهبين‎",
	"تذهب‎", "تذهبان‎", "تذهبن‎", "يذهبن‎", "أذهب", "تذهب‎", "يذهب‎", "تذهبا‎", "يذهبا‎", "نذهب‎", "تذهبوا‎", "يذهبوا‎", "تذهبي‎", "تذهب‎",
	"تذهبا‎", "تذهبن‎", "يذهبن‎", "أذهب", "تذهب‎", "يذهب‎", "تذهبا‎", "يذهبا‎", "نذهب‎", "تذهبوا‎", "يذهبوا‎", "تذهبي‎", "تذهب‎", "تذهبا‎",
	"تذهبن‎", "يذهبن‎", "نذهب", "مذهب‎", "ذاهب‎", "مذهوب‎", "ذهبت‎", "ذهبت‎", "ذهب", "ذهبتما‎", "ذهبا‎", "ذهبنا‎", "ذهبتم‎", "ذهبوا‎",
	"ذهبت‎", "ذهبت‎", "ذهبتا‎", "ذهبتن‎", "ذهبن‎", "أذهب‎", "تذهب‎", "يذهب‎", "تذهبان‎", "يذهبان‎", "نذهب‎", "تذهبون‎", "يذهبون‎", "تذهبين‎",
	"تذهب‎", "تذهبان‎", "تذهبن‎", "يذهبن‎", "أذهب‎", "تذهب‎", "يذهب‎", "تذهبا‎", "يذهبا‎", "نذهب‎", "تذهبوا‎", "يذهبوا‎", "تذهبي‎", "تذهب‎",
	"تذهبا‎", "تذهبن‎", "يذهبن‎", "أذهب‎", "تذهب‎", "يذهب‎", "تذهبا‎", "يذهبا‎", "نذهب‎", "تذهبوا‎", "يذهبوا‎", "تذهبي‎", "تذهب‎", "تذهبا‎",
	"تذهبن‎", "يذهبن‎", "اذهب‎", "اذهبا‎", "اذهبوا‎", "اذهبي‎", "اذهبن‎", "ذهب", "يذهب‎", "يذهب‎", "يذهب‎", "أظن", "ظن", "ظان‎", "مظنون‎",
	"ظننت‎", "ظننت‎", "ظن", "ظننتما‎", "ظنا‎", "ظننا‎", "ظننتم‎", "ظنوا‎", "ظننت‎", "ظنت‎", "ظنتا‎", "ظننتن‎", "ظنن‎", "أظن‎", "تظن‎", "يظن‎",
	"تظنان‎", "يظنان‎", "نظن‎", "تظنون‎", "يظنون‎", "تظنين‎", "تظن‎", "تظنان‎", "تظنن‎", "يظنن‎", "أظن‎", "تظن‎", "يظن‎", "تظنا‎", "يظنا‎",
	"نظن‎", "تظنوا‎", "يظنوا‎", "تظني‎", "تظن‎", "تظنا‎", "تظنن‎", "يظنن‎", "أظنن‎", "تظنا‎", "يظنا‎", "تظنوا‎", "يظنوا‎", "تظنن‎", "تظني‎",
	"تظنا‎", "تظنن‎", "يظنن‎", "أظن", "أظن", "تظن‎", "تظن‎", "يظنن‎", "يظن‎", "ظني‎", "اظنن‎", "يظن‎", "نظنن‎", "نظن‎", "نظن‎", "تظنن‎",
	"تظن‎", "تظن‎", "ظنا‎", "اظنن‎", "ظن", "ظن", "ظنوا‎", "اذهب‎", "اذهبا‎", "اذهبوا‎", "ظننت‎", "ظننت‎", "ظن", "ظننتما‎", "ظنا‎", "ظننا‎",
	"ظننتم‎", "ظنوا‎", "ظننت‎", "ظنت‎", "ظنتا‎", "ظننتن‎", "ظنن‎", "أظن‎", "تظن‎", "يظن‎", "تظنان‎", "يظنان‎", "نظن‎", "تظنون‎", "يظنون‎",
	"تظنين‎", "تظن‎", "تظنان‎", "تظنن‎", "يظنن‎", "أظن‎", "تظن‎", "يظن‎", "تظنا‎", "يظنا‎", "نظن‎", "تظنوا‎", "يظنوا‎", "تظني‎", "تظن‎",
	"تظنا‎", "تظنن‎", "يظنن‎", "أظنن‎", "تظنا‎", "يظنا‎", "تظنوا‎", "يظنوا‎", "أظن‎", "تظني‎", "تظنا‎", "تظنن‎", "يظنن‎", "تظنن‎", "تظن‎",
	"تظن‎", "يظنن‎", "يظن‎", "يظن‎", "نظنن‎", "نظن‎", "نظن‎", "تظنن‎", "تظن‎", "تظن‎", "ذهبت", "تظن", "توجدت‎", "توجدت‎", "توجد", "توجدتما‎",
	"توجدا‎", "توجدنا‎", "توجدتم‎", "توجدوا‎", "توجدت‎", "توجدت‎", "توجدتا‎", "توجدتن‎", "توجدن‎", "أتوجد‎", "ʾتتوجد‎", "يتوجد‎", "تتوجدان‎",
	"يتوجدان‎", "نتوجد‎", "تتوجدون‎", "يتوجدون‎", "تتوجدين‎", "تتوجد‎", "تتوجدان‎", "تتوجدن‎", "يتوجدن‎", "أتوجد‎", "ʾتتوجد‎", "يتوجد‎",
	"تتوجدا‎", "يتوجدا‎", "نتوجد‎", "تتوجدوا‎", "يتوجدوا‎", "تتوجدي‎", "تتوجد‎", "تتوجدا‎", "تتوجدن‎", "يتوجدن‎", "أتوجد‎", "ʾتتوجد‎",
	"يتوجد‎", "تتوجدا‎", "يتوجدا‎", "نتوجد‎", "تتوجدوا‎", "يتوجدوا‎", "تتوجدي‎", "تتوجد‎", "تتوجدا‎", "تتوجدن‎", "يتوجدن‎", "توجد", "توجدا‎",
	"توجدوا‎", "توجدي‎", "توجدن‎", "توجد", "يتوجد‎", "يتوجد‎", "يتوجد‎", "توجد", "متوجد‎", "متوجد‎", "دعاء‎", "داع‎", "مدعو‎", "دعوت‎",
	"دعوت‎", "دعا", "دعوتما‎", "دعوا‎", "دعونا‎", "دعوتم‎", "دعوا‎", "دعوت‎", "دعت‎", "دعتا‎", "دعوتن‎", "دعون‎", "أدعو‎", "تدعو‎", "يدعو‎",
	"تدعوان‎", "يدعوان‎", "ندعو‎", "تدعون‎", "يدعون‎", "تدعين‎", "تدعو‎", "تدعوان‎", "تدعون‎", "يدعون‎", "أدعو‎", "تدعو‎", "يدعو‎", "تدعوا‎",
	"يدعوا‎", "ندعو‎", "تدعوا‎", "يدعوا‎", "تدعي‎", "تدعو‎", "تدعوا‎", "تدعون‎", "يدعون‎", "أدع‎", "تدع‎", "يدع‎", "تدعوا‎", "يدعوا‎",
	"ندع‎", "تدعوا‎", "يدعوا‎", "تدعي‎", "تدع‎", "تدعوا‎", "تدعون‎", "يدعون‎", "ادع‎", "ادعوا‎", "ادعوا‎", "ادعي‎", "ادعون‎", "دعيت‎",
	"دعيت‎", "دعي‎", "دعيتما‎", "دعيا‎", "دعينا‎", "دعيتم‎", "دعوا‎", "دعيت‎", "دعيت‎", "دعيتا‎", "دعيتن‎", "دعين‎", "أدعى‎", "تدعى‎",
	"يدعى‎", "تدعيان‎", "يدعيان‎", "ندعى‎", "تدعون‎", "يدعون‎", "تدعين‎", "تدعى‎", "تدعيان‎", "تدعين‎", "يدعين‎", "أدعى‎", "تدعى‎", "يدعى‎",
	"تدعيا‎", "يدعيا‎", "ندعى‎", "تدعوا‎", "يدعوا‎", "تدعي‎", "تدعى‎", "تدعيا‎", "تدعين‎", "يدعين‎", "أدع‎", "تدع‎", "يدع‎", "تدعيا‎",
	"يدعيا‎", "ندع‎", "تدعوا‎", "يدعوا‎", "تدعي‎", "تدع‎", "تدعيا‎", "تدعين‎", "يدعين‎", "تفكر", "متفكر‎", "متفكر‎", "تفكرت‎", "تفكرت‎",
	"تفكر", "تفكرتما‎", "تفكرا‎", "تفكرنا‎", "تفكرتم‎", "تفكروا‎", "تفكرت‎", "تفكرت‎", "تفكرتا‎", "تفكرتن‎", "تفكرن‎", "أتفكر‎", "تتفكر‎",
	"يتفكر‎", "تتفكران‎", "يتفكران‎", "نتفكر‎", "تتفكرون‎", "يتفكرون‎", "تتفكرين‎", "تتفكر‎", "تتفكران‎", "تتفكرن‎", "يتفكرن‎", "أتفكر‎",
	"تتفكر‎", "يتفكر‎", "تتفكرا‎", "يتفكرا‎", "نتفكر‎", "تتفكروا‎", "يتفكروا‎", "تتفكري‎", "تتفكر‎", "تتفكرا‎", "تتفكرن‎", "يتفكرن‎",
	"أتفكر‎", "تتفكر‎", "يتفكر‎", "تتفكرا‎", "يتفكرا‎", "نتفكر‎", "تتفكروا‎", "يتفكروا‎", "تتفكري‎", "تتفكر‎", "تتفكرا‎", "تتفكرن‎",
	"يتفكرن‎", "تفكر", "تفكرا‎", "تفكروا‎", "تفكري‎", "تفكرن‎", "تفكر", "يتفكر‎", "يتفكر‎", "يتفكر‎", "مجيء‎", "جيء‎", "جيئة‎", "جيئة‎",
	"جاء", "مجيء‎", "جئت‎", "جئت‎", "جاء", "جئتما‎", "جاءا‎", "جئنا‎", "جئتم‎", "جائوا‎", "جاؤوا‎", "جئت‎", "جاءت‎", "جاءتا‎", "جئتن‎",
	"جئن‎", "أجيء‎", "تجيء‎", "يجيء‎", "تجيئان‎", "يجيئان‎", "نجيء‎", "تجيئون‎", "تجيؤون‎", "يجيئون‎", "يجيؤون‎", "تجيئين‎", "تجيء‎",
	"تجيئان‎", "تجئن‎", "يجئن‎", "أجيء‎", "تجيء‎", "يجيء‎", "تجيئا‎", "يجيئا‎", "نجيء‎", "تجيئوا‎", "تجيؤوا‎", "يجيئوا‎", "يجيؤوا‎",
	"تجيئي‎", "تجيء‎", "تجيئا‎", "تجئن‎", "يجئن‎", "أجئ‎", "تجئ‎", "يجئ‎", "تجيئا‎", "يجيئا‎", "نجئ‎", "تجيئوا‎", "تجيؤوا‎", "يجيئوا‎",
	"يجيؤوا‎", "تجيئي‎", "تجئ‎", "تجيئا‎", "تجئن‎", "يجئن‎", "جئ‎", "جيئا‎", "جيئوا‎", "جيؤوا‎", "جيئي‎", "جئن‎", "جئت‎", "جئت‎", "جيء‎",
	"جئتما‎", "جيئا‎", "جئنا‎", "جئتم‎", "جيئوا‎", "جيؤوا‎", "جئت‎", "جيئت‎", "جيئتا‎", "جئتن‎", "جئن‎", "أجاء‎", "تجاء‎", "يجاء‎",
	"تجاءان‎", "يجاءان‎", "نجاء‎", "تجائون‎", "تجاؤون‎", "يجائون‎", "يجاؤون‎", "تجائين‎", "تجاء‎", "تجاءان‎", "تجأن‎", "يجأن‎", "أجاء‎",
	"تجاء‎", "يجاء‎", "تجاءا‎", "يجاءا‎", "نجاء‎", "تجائوا‎", "تجاؤوا‎", "يجائوا‎", "يجاؤوا‎", "تجائي‎", "تجاء‎", "تجاءا‎", "تجأن‎",
	"يجأن‎", "أجأ‎", "تجأ‎", "يجأ‎", "تجاءا‎", "يجاءا‎", "نجأ‎", "تجائوا‎", "تجاؤوا‎", "يجائوا‎", "يجاؤوا‎", "تجائي‎", "تجأ‎", "تجاءا‎",
	"تجأن‎", "يجأن‎", "إرادة‎", "مريد‎", "مراد‎", "أردت‎", "أردت‎", "أراد", "أردتما‎", "أرادا‎", "أردنا‎", "أردتم‎", "أرادوا‎", "أردت‎",
	"أرادت‎", "أرادتا‎", "أردتن‎", "أردن‎", "أريد‎", "تريد‎", "يريد‎", "تريدان‎", "يريدان‎", "نريد‎", "تريدون‎", "يريدون‎", "تريدين‎",
	"تريد‎", "تريدان‎", "تردن‎", "يردن‎", "أريد‎", "تريد‎", "يريد‎", "تريدا‎", "يريدا‎", "نريد‎", "تريدوا‎", "يريدوا‎", "تريدي‎", "تريد‎",
	"تريدا‎", "تردن‎", "يردن‎", "أرد‎", "ترد‎", "يرد‎", "تريدا‎", "يريدا‎", "نرد‎", "تريدوا‎", "يريدوا‎", "تريدي‎", "ترد‎", "تريدا‎", "تردن‎",
	"يردن‎", "أرد‎", "أريدا‎", "أريدوا‎", "أريدي‎", "أردن‎", "أردت‎", "أردت‎", "أريد‎", "أردتما‎", "أريدا‎", "أردنا‎", "أردتم‎", "أريدوا‎",
	"أردت‎", "أريدت‎", "أريدتا‎", "أردتن‎", "أردن‎", "أراد", "تراد‎", "يراد‎", "ترادان‎", "يرادان‎", "نراد‎", "ترادون‎", "يرادون‎", "ترادين‎",
	"تراد‎", "ترادان‎", "تردن‎", "يردن‎", "أراد", "تراد‎", "يراد‎", "ترادا‎", "يرادا‎", "نراد‎", "ترادوا‎", "يرادوا‎", "ترادي‎", "تراد‎",
	"ترادا‎", "تردن‎", "يردن‎", "أرد‎", "ترد‎", "يرد‎", "ترادا‎", "يرادا‎", "نرد‎", "ترادوا‎", "يرادوا‎", "ترادي‎", "ترد‎", "ترادا‎",
	"تردن‎", "يردن‎", "إتيان‎", "أتي‎", "مأتاة‎", "مأتى‎", "آت‎", "مأتي‎", "أتيت‎", "أتيت‎", "أتى", "أتيتما‎", "أتيا‎", "أتينا‎", "أتيتم‎",
	"أتوا‎", "أتيت‎", "أتت‎", "أتتا‎", "أتيتن‎", "أتين‎", "آتي‎", "تأتي‎", "يأتي‎", "تأتيان‎", "يأتيان‎", "نأتي‎", "تأتون‎", "يأتون‎",
	"تأتين‎", "تأتي‎", "تأتيان‎", "تأتين‎", "يأتين‎", "آتي‎", "تأتي‎", "يأتي‎", "تأتيا‎", "يأتيا‎", "نأتي‎", "تأتوا‎", "يأتوا‎", "تأتي‎",
	"تأتي‎", "تأتيا‎", "تأتين‎", "يأتين‎", "آت‎", "تأت‎", "يأت‎", "تأتيا‎", "يأتيا‎", "نأت‎", "تأتوا‎", "يأتوا‎", "تأتي‎", "تأت‎", "تأتيا‎",
	"تأتين‎", "يأتين‎", "ايت‎", "ايتيا‎", "ايتوا‎", "ايتي‎", "ايتين‎", "أتيت‎", "أتيت‎", "أتي‎", "أتيتما‎", "أتيا‎", "أتينا‎", "أتيتم‎",
	"أتوا‎", "أتيت‎", "أتيت‎", "أتيتا‎", "أتيتن‎", "أتين‎", "أوتى‎", "تؤتى‎", "يؤتى‎", "تؤتيان‎", "يؤتيان‎", "نؤتى‎", "تؤتون‎", "يؤتون‎",
	"تؤتين‎", "تؤتى‎", "تؤتيان‎", "تؤتين‎", "يؤتين‎", "أوتى‎", "تؤتى‎", "يؤتى‎", "تؤتيا‎", "يؤتيا‎", "نؤتى‎", "تؤتوا‎", "يؤتوا‎", "تؤتي‎",
	"تؤتى‎", "تؤتيا‎", "تؤتين‎", "يؤتين‎", "أوت‎", "تؤت‎", "يؤت‎", "تؤتيا‎", "يؤتيا‎", "نؤت‎", "تؤتوا‎", "يؤتوا‎", "تؤتي‎", "تؤت‎", "تؤتيا‎",
	"تؤتين‎", "يؤتين‎", "فعلته", "فعل", "فعل", "فاعل‎", "مفعول‎", "فعلت‎", "فعلت‎", "فعل", "فعلتما‎", "فعلا‎", "فعلنا‎", "فعلتم‎", "فعلوا‎",
	"فعلت‎", "فعلت‎", "فعلتا‎", "فعلتن‎", "فعلن‎", "أفعل‎", "تفعل‎", "يفعل‎", "تفعلان‎", "يفعلان‎", "نفعل‎", "تفعلون‎", "يفعلون‎", "تفعلين‎",
	"تفعل‎", "تفعلان‎", "تفعلن‎", "يفعلن‎", "أفعل‎", "تفعل‎", "يفعل‎", "تفعلا‎", "يفعلا‎", "نفعل‎", "تفعلوا‎", "يفعلوا‎", "تفعلي‎", "تفعل‎",
	"تفعلا‎", "تفعلن‎", "يفعلن‎", "أفعل‎", "تفعل‎", "يفعل‎", "تفعلا‎", "يفعلا‎", "نفعل‎", "تفعلوا‎", "يفعلوا‎", "تفعلي‎", "تفعل‎", "تفعلا‎",
	"تفعلن‎", "يفعلن‎", "افعل‎", "افعلا‎", "افعلوا‎", "افعلي‎", "افعلن‎", "فعلت‎", "فعلت‎", "فعل", "فعلتما‎", "فعلا‎", "فعلنا‎", "فعلتم‎",
	"فعلوا‎", "فعلت‎", "فعلت‎", "فعلتا‎", "فعلتن‎", "فعلن‎", "أفعل‎", "تفعل‎", "يفعل‎", "تفعلان‎", "يفعلان‎", "نفعل‎", "تفعلون‎", "يفعلون‎",
	"تفعلين‎", "تفعل‎", "تفعلان‎", "تفعلن‎", "يفعلن‎", "أفعل‎", "تفعل‎", "يفعل‎", "تفعلا‎", "يفعلا‎", "نفعل‎", "تفعلوا‎", "يفعلوا‎", "تفعلي‎",
	"تفعل‎", "تفعلا‎", "تفعلن‎", "يفعلن‎", "أفعل‎", "تفعل‎", "يفعل‎", "تفعلا‎", "يفعلا‎", "نفعل‎", "تفعلوا‎", "يفعلوا‎", "تفعلي‎", "تفعل‎", "تفعلا‎",
	"تفعلن‎", "يفعلن‎", "قصد", "مقصد‎", "قاصد‎", "مقصود‎", "قصدت‎", "قصدت‎", "قصد", "قصدتما‎", "قصدا‎", "قصدنا‎", "قصدتم‎", "قصدوا‎",
	"قصدت‎", "قصدت‎", "قصدتا‎", "قصدتن‎", "قصدن‎", "أقصد‎", "تقصد‎", "يقصد‎", "تقصدان‎", "يقصدان‎", "نقصد‎", "تقصدون‎", "يقصدون‎", "تقصدين‎",
	"تقصد‎", "تقصدان‎", "تقصدن‎", "يقصدن‎", "أقصد‎", "تقصد‎", "يقصد‎", "تقصدا‎", "يقصدا‎", "نقصد‎", "تقصدوا‎", "يقصدوا‎", "تقصدي‎", "تقصد‎",
	"تقصدا‎", "تقصدن‎", "يقصدن‎", "أقصد‎", "تقصد‎", "يقصد‎", "تقصدا‎", "يقصدا‎", "نقصد‎", "تقصدوا‎", "يقصدوا‎", "تقصدي‎", "تقصد‎", "تقصدا‎",
	"تقصدن‎", "يقصدن‎", "اقصد‎", "اقصدا‎", "اقصدوا‎", "اقصدي‎", "اقصدن‎", "قصدت‎", "قصدت‎", "قصد", "قصدتما‎", "قصدا‎", "قصدنا‎", "قصدتم‎",
	"قصدوا‎", "قصدت‎", "قصدت‎", "قصدتا‎", "قصدتن‎", "قصدن‎", "أقصد‎", "تقصد‎", "يقصد‎", "تقصدان‎", "يقصدان‎", "نقصد‎", "تقصدون‎", "يقصدون‎",
	"تقصدين‎", "تقصد‎", "تقصدان‎", "تقصدن‎", "يقصدن‎", "أقصد‎", "تقصد‎", "يقصد‎", "تقصدا‎", "يقصدا‎", "نقصد‎", "تقصدوا‎", "يقصدوا‎", "تقصدي‎",
	"تقصد‎", "تقصدا‎", "تقصدن‎", "يقصدن‎", "أقصد‎", "تقصد‎", "يقصد‎", "تقصدا‎", "يقصدا‎", "نقصد‎", "تقصدوا‎", "يقصدوا‎", "تقصدي‎", "تقصد‎",
	"تقصدا‎", "تقصدن‎", "يقصدن‎", "زائل‎", "زلت‎", "زلت‎", "زال", "زلتما‎", "زالا‎", "زلنا‎", "زلتم‎", "زالوا‎", "زلت‎", "زالت‎", "زالتا‎",
	"زلتن‎", "زلن‎", "أزال‎", "تزال‎", "يزال‎", "تزالان‎", "يزالان‎", "نزال‎", "تزالون‎", "يزالون‎", "تزالين‎", "تزال‎", "تزالان‎", "تزلن‎",
	"يزلن‎", "أزال‎", "تزال‎", "يزال‎", "تزالا‎", "يزالا‎", "نزال‎", "تزالوا‎", "يزالوا‎", "تزالي‎", "تزال‎", "تزالا‎", "تزلن‎", "يزلن‎",
	"أزل‎", "تزل‎", "يزل‎", "تزالا‎", "يزالا‎", "نزل‎", "تزالوا‎", "يزالوا‎", "تزالي‎", "تزل‎", "تزالا‎", "تزلن‎", "يزلن‎", "زل‎", "زالا‎",
	"زالوا‎", "زالي‎", "زلن‎", "عملت‎", "عملت‎", "عمل", "عملتما‎", "عملا‎", "عملنا‎", "عملتم‎", "عملوا‎", "عملت‎", "عملت‎", "عملتا‎",
	"عملتن‎", "عملن‎", "أعمل‎", "تعمل‎", "يعمل‎", "تعملان‎", "يعملان‎", "نعمل‎", "تعملون‎", "يعملون‎", "تعملين‎", "تعملن‎", "يعملن‎",
	"أعمل‎", "تعمل‎", "يعمل‎", "تعملا‎", "يعملا‎", "نعمل‎", "تعملوا‎", "يعملوا‎", "تعملي‎", "أعمل‎", "تعمل‎", "يعمل‎", "نعمل‎", "اعمل‎",
	"اعملا‎", "اعملوا‎", "اعملي‎", "اعملن‎", "عملت‎", "عملت‎", "عمل", "عملتما‎", "عملا‎", "عملنا‎", "عملتم‎", "عملوا‎", "عملت‎", "عملت‎",
	"عملتا‎", "عملتن‎", "عملن‎", "أعمل‎", "تعمل‎", "يعمل‎", "تعملان‎", "يعملان‎", "نعمل‎", "تعملون‎", "يعملون‎", "تعملين‎", "تعملن‎", "يعملن‎",
	"أعمل", "تعمل‎", "يعمل‎", "تعملا‎", "يعملا‎", "نعمل‎", "تعملوا‎", "يعملوا‎", "تعملي‎", "أعمل‎", "تعمل‎", "يعمل‎", "نعمل‎", "عملت‎",
	"عننت‎", "عننت‎", "عن", "عننتما‎", "عنا‎", "عننا‎", "عننتم‎", "عنوا‎", "عننت‎", "عنت‎", "عنتا‎", "عننتن‎", "عنن‎", "أعن‎", "أعن‎",
	"تعن‎", "تعن‎", "يعن‎", "يعن‎", "تعنان‎", "تعنان‎", "يعنان‎", "يعنان‎", "نعن‎", "نعن‎", "تعنون‎", "تعنون‎", "يعنون‎", "يعنون‎",
	"تعنين‎", "تعنين‎", "تعنن‎", "تعنن‎", "يعنن‎", "يعنن‎", "أعن‎", "أعن‎", "تعن‎", "تعن‎", "يعن‎", "يعن‎", "تعنا‎", "تعنا‎", "يعنا‎",
	"يعنا‎", "نعن‎", "نعن‎", "تعنوا‎", "تعنوا‎", "يعنوا‎", "يعنوا‎", "تعني‎", "تعني‎", "أعن‎", "أعنن‎", "أعن‎", "أعنن‎", "تعن‎", "تعنن‎",
	"تعن‎", "تعنن‎", "يعن‎", "يعنن‎", "يعن‎", "يعنن‎", "نعن‎", "نعنن‎", "نعن‎", "نعنن‎", "عن", "عن", "اعنن‎", "عن", "عن", "اعنن‎", "عنا‎",
	"عنا‎", "‎عنوا‎", "عني‎", "عني‎", "اعنن‎", "اعنن‎", "يعن‎", "يعن‎", "يعن‎", "يعنن‎", "قمت‎", "قمت‎", "قام", "قمتما‎", "قاما‎", "قمنا‎",
	"قمتم‎", "قاموا‎", "قمت‎", "قامت‎", "قامتا‎", "قمتن‎", "قمن‎", "أقوم‎", "تقوم‎", "يقوم‎", "تقومان‎", "يقومان‎", "نقوم‎", "تقومون‎",
	"يقومون‎", "تقومين‎", "تقمن‎", "يقمن‎", "أقوم‎", "تقوم‎", "يقوم‎", "تقوما‎", "يقوما‎", "نقوم‎", "تقوموا‎", "يقوموا‎", "تقومي‎", "أقم‎",
	"تقم‎", "يقم‎", "نقم‎", "قم‎", "قوما‎", "قوموا‎", "قومي‎", "قيم‎", "يقام‎", "يقام‎", "يقم‎", "وددت‎", "وددت‎", "ود", "وددتما‎", "ودا‎",
	"وددنا‎", "وددتم‎", "ودوا‎", "وددت‎", "ودت‎", "ودتا‎", "وددتن‎", "وددن‎", "أود‎", "تود‎", "يود‎", "تودان‎", "يودان‎", "نود‎", "تودون‎",
	"يودون‎", "تودين‎", "توددن‎", "يوددن‎", "أود‎", "تود‎", "يود‎", "تودا‎", "يودا‎", "نود‎", "تودوا‎", "يودوا‎", "تودي‎", "أود‎", "أودد‎",
	"تود‎", "تودد‎", "يود‎", "يودد‎", "نود‎", "نودد‎", "ود", "ايدد‎", "ودي‎", "ايددن‎", "وددت‎", "وددت‎", "ود", "وددتما‎", "ودا‎", "وددنا‎",
	"وددتم‎", "ودوا‎", "وددت‎", "ودت‎", "ودتا‎", "وددتن‎", "وددن‎", "أود‎", "تود‎", "يود‎", "تودان‎", "يودان‎", "نود‎", "تودون‎", "يودون‎",
	"تودين‎", "توددن‎", "يوددن‎", "أود‎", "تود‎", "يود‎", "تودا‎", "يودا‎", "نود‎", "تودوا‎", "يودوا‎", "تودي‎", "أود‎", "أودد‎", "تود‎",
	"تودد‎", "يود‎", "يودد‎", "نود‎", "نودد‎", "حاولت‎", "حاولت‎", "حاول", "حاولتما‎", "حاولا‎", "حاولنا‎", "حاولتم‎", "حاولوا‎", "حاولت‎",
	"حاولت‎", "حاولتا‎", "حاولتن‎", "حاولن‎", "أحاول‎", "تحاول‎", "يحاول‎", "تحاولان‎", "يحاولان‎", "نحاول‎", "تحاولون‎", "يحاولون‎", "تحاولين‎",
	"تحاولن‎", "يحاولن‎", "أحاول‎", "تحاول‎", "يحاول‎", "تحاولا‎", "يحاولا‎", "نحاول‎", "تحاولوا‎", "يحاولوا‎", "تحاولي‎", "أحاول‎", "تحاول‎",
	"يحاول‎", "نحاول‎", "حاول", "حاولا‎", "حاولوا‎", "حاولي‎", "حاولن‎", "حوولت‎", "حوولت‎", "حوول‎", "حوولتما‎", "حوولا‎", "حوولنا‎", "حوولتم‎",
	"حوولوا‎", "حوولت‎", "حوولت‎", "حوولتا‎", "حوولتن‎", "حوولن‎", "أحاول‎", "تحاول‎", "يحاول‎", "تحاولان‎", "يحاولان‎", "نحاول‎", "تحاولون‎",
	"يحاولون‎", "تحاولين‎", "تحاولن‎", "يحاولن‎", "أحاول‎", "تحاول‎", "يحاول‎", "تحاولا‎", "يحاولا‎", "نحاول‎", "تحاولوا‎", "يحاولوا‎", "تحاولي‎",
	"أحاول‎", "تحاول‎", "يحاول‎", "نحاول‎", "احتجت‎", "احتجت‎", "احتاج", "احتجتما‎", "احتاجا‎", "احتجنا‎", "احتجتم‎", "احتاجوا‎", "احتجت‎",
	"احتاجت‎", "احتاجتا‎", "احتجتن‎", "احتجن‎", "أحتاج‎", "تحتاج‎", "يحتاج‎", "تحتاجان‎", "يحتاجان‎", "نحتاج‎", "تحتاجون‎", "يحتاجون‎",
	"تحتاجين‎", "تحتجن‎", "يحتجن‎", "أحتاج‎", "تحتاج‎", "يحتاج‎", "تحتاجا‎", "يحتاجا‎", "نحتاج‎", "تحتاجوا‎", "يحتاجوا‎", "تحتاجي‎",
	"أحتج‎", "تحتج‎", "يحتج‎", "نحتج‎", "احتج‎", "احتاجي‎", "احتجت‎", "احتجت‎", "احتيج‎", "احتجتما‎", "احتيجا‎", "احتجنا‎", "احتجتم‎",
	"احتيجوا‎", "احتجت‎", "احتيجت‎", "احتيجتا‎", "احتجتن‎", "احتجن‎", "أحتاج‎", "تحتاج‎", "يحتاج‎", "تحتاجان‎", "يحتاجان‎", "نحتاج‎",
	"تحتاجون‎", "يحتاجون‎", "تحتاجين‎", "تحتجن‎", "يحتجن‎", "أحتاج‎", "تحتاج‎", "يحتاج‎", "تحتاجا‎", "يحتاجا‎", "نحتاج‎", "تحتاجوا‎",
	"يحتاجوا‎", "تحتاجي‎", "أحتج‎", "تحتج‎", "يحتج‎", "نحتج‎", "عنيت‎", "عنيت‎", "عنى", "عنيتما‎", "عنيا‎", "عنينا‎", "عنيتم‎", "عنوا‎",
	"عنيت‎", "عنت‎", "عنتا‎", "عنيتن‎", "عنين‎", "أعني‎", "تعني‎", "يعني‎", "تعنيان‎", "يعنيان‎", "نعني‎", "تعنون‎", "يعنون‎", "تعنين‎",
	"يعنين‎", "أعني‎", "تعني‎", "يعني‎", "تعنيا‎", "يعنيا‎", "نعني‎", "تعنوا‎", "يعنوا‎", "أعن‎", "تعن‎", "يعن‎", "نعن‎", "اعن‎", "اعنيا‎",
	"اعنوا‎", "اعني‎", "اعنين‎", "عنيت‎", "عنيت‎", "عني‎", "عنيتما‎", "عنيا‎", "عنينا‎", "عنيتم‎", "عنوا‎", "عنيت‎", "عنيت‎", "عنيتا‎",
	"عنيتن‎", "عنين‎", "أعنى‎", "تعنى‎", "يعنى‎", "تعنيان‎", "يعنيان‎", "نعنى‎", "تعنون‎", "يعنون‎", "تعنين‎", "يعنين‎", "تعنيا‎", "يعنيا‎",
	"تعنوا‎", "يعنوا‎", "تعني‎", "أعن‎", "تعن‎", "يعن‎", "نعن‎", "يعنين", "عندي‎", "عندنا‎", "عندك‎", "عندك‎", "عندكما‎", "عندكم‎", "عندكن‎",
	"عنده‎", "عندها‎", "عندهما‎", "عندهم‎", "عندهن‎", "بقاء", "البقاء‎", "بقاء", "البقاء‎", "بقاء", "بقاء", "البقاء‎", "بقاء", "بقاء",
	"البقاء‎", "بقاء" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
const generalAdjectivesAdverbs = [ "جيد", "آخر", "رائع", "أفضل", "جيدة", "نفس", "فقط", "مجرد", "كبير", "الأفضل", "عظيم",
	"جميلة", "كبيرة", "رائعة", "جديد", "صغيرة", "الصغير", "متأكد", "مهما", "صغير", "جيدا", "الصغيرة", "أكبر", "جديدة",
	"افضل", "الجديد", "طويلة", "ممكن", "اخر", "طويل", "الممكن", "الخاصة", "سيئة", "الكبير", "حقيقي", "بعيدا", "الجيد",
	"مهم", "الجديدة", "كثير", "الكبيرة", "القليل", "ممتاز", "الحقيقي", "سيء", "معا", "قليل", "بعيد", "واضح", "مختلف",
	"متأكدة", "الصعب", "أسوأ", "حوالي", "كامل", "سيئ", "بالإمكان", "بكثير", "خاص", "سوية", "مختلفة", "قريب",
	"الأخير", "الأخيرة", "الافضل", "خير" ];

const interjections = [ "واو", "هيا", "آه", "هيه", "هاى", "أوه", "أخخ", "هووه", "صه", "أوبس", "أها", "آخ", "أح", "شو", "ههههه" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
const recipeWords = [ "كلغ", "ملغ", "الكوارت", "جرام", "ربع جالون", "ربع ", "كوارتات", "لتر", "سنتيلتر", "مليمتر", "دزينة",
	"ملاعق", "ذراع", "قبضة", "قدم عربية", "قصبة", "بريد" ];

const timeWords = [ "اليوم", "يوم", "ليلة", "دقيقة", "ساعة", "عام", "دقائق", "سنة", "الساعة", "أيام", "العام", "الأسبوع",
	"غدا", "ساعات", "أمس", "أشهر", "الأيام", "شهر", "السنة", "الغد", "يوما", "ثانية", "ثوان", "أسبوع", "أسابيع", "أسبوعا",
	"بالأمس" ];

const vagueNouns = [ "الأمر", "الأشياء", "الشيء", "الأمور", "الامر", "أشياء", "جزء", "الاشياء", "الامور", "الطريقة", "طريقا",
	"طرق", "قطعة", "الأجزاء", "مادة", "مرات", "بالمئة", "جانب", "جوانب", "بند", "عنصر", "عناصر", "بنود", "فكرة", "موضوع",
	"تفصيل", "تفاصيل", "فرق", "فروق" ];

const miscellaneous = [ "نعم", "حسنا", "إنه", "إني", "إنها", "إنك", "إنكم", "إنهم", "إنكما", "إنهما", "إننا", "إنهن",
	"فإن", "إنني", "كلا", "أجل", "أنه", "أنك", "انها", "أنها", "بأن", "أنني", "أنكم", "أنهما", "أنكما", "أنهن", "أنهم",
	"انك", "أني", "أننا", "انهم", "بأنك", "لأنه", "بأنه", "اني", "أننى", "انني", "اننا", "بأنني", "اننى", "بأني", "بأنها",
	"وأن", "بأننا", "للتو", "ها", "رجاء", "تفضل", "اجل", "حالك", "فضلك", "أرجوك", "هكذا", "انة", "بلى", "أعلى", "انى",
	"لا", "لن", "لم", "ولا", "ألا", "ولم", "ولن", "عدم", "فلا", "فلن", "يلا", "يلة" ];

const titlesPreceding = [ "السيد", "السيدة", "افندم", "سعادتك", "استاذة", "استاذ", "مدام", "أستاذ", "أسـتاذة", "الأخ", "الأخت" ];

const transitionWords = [ "عندما", "مثل", "بالطبع", "لأن", "إذن", "بشكل", "متى", "حتى", "قبل", "ثم", "عند", "حيث", "بينما",
	"لمدة", "مثلك", "حين", "بأي", "زلت", "وعندما", "أثناء", "حينما", "أولا", "لاحقا", "أما", "وإلا", "لفترة", "كلما", "عندنا",
	"إلا", "الا" ];

/**
 * Returns function words for english.
 *
 * @returns {Object} English function words.
 */
export default function() {
	return {
		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, generalAdjectivesAdverbs ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( articles, prepositions, prepositionPrecedingPronouns, coordinatingConjunctions,
			demonstrativePronouns, intensifiers, quantifiers ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, adverbialGenitives, personalPronounsNominative, personalPronounsAccusative,
			reflexivePronouns, interjections, cardinalNumerals, otherAuxiliaries, copula, interviewVerbs,
			delexicalizedVerbs, indefinitePronouns, subordinatingConjunctions, interrogativeDeterminers,
			interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, miscellaneous, prepositionalAdverbs,
			recipeWords, timeWords, vagueNouns, vocativeParticles, relativePronouns ),

		// These categories are used in the passive voice assessment. If they directly precede a participle, the sentence part is not passive.
		cannotDirectlyPrecedePassiveParticiple: [].concat( articles, prepositions, demonstrativePronouns, ordinalNumerals, quantifiers ),

		/*
		These categories are used in the passive voice assessment. If they appear between an auxiliary and a participle,
		the sentence part is not passive.
		*/
		cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat( otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs ),

		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, reflexivePronouns,
			personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, interrogativeDeterminers,
			interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous, titlesPreceding, vocativeParticles, relativePronouns, prepositionPrecedingPronouns ),
	};
}
