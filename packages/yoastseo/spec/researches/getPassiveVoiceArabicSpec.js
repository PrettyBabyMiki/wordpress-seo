import passiveVoice from "../../src/languages/legacy/researches/getPassiveVoice.js";
import Paper from "../../src/values/Paper.js";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice", function() {
		const paper = new Paper( "كتب الولد الخطاب.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice", function() {
		const paper = new Paper( "هذا الكتاب كتبه مؤلف مشهور.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice for passive that is identical to its active counterpart without diacritics", function() {
		const paper = new Paper( "غير أنه يتعين أن يوازي ذلك معالجة المسائل العرضية.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice for passive that is identical to its active counterpart with a damma on the initial letter", function() {
		// Passive: يُوازي.
		const paper = new Paper( "غير أنه يتعين أن يُوازي ذلك معالجة المسائل العرضية.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: أُنشئت.
		const paper = new Paper( "أُنشئت الشركة في الثمانينيات.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: تجوهلت
		const paper = new Paper( "والجدير بالذكر أن هذه اقتراحات تجوهلت.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: دعيت preceded by و
		const paper = new Paper( "ودعيت هذه المجموعات للإدلاء بملاحظات ختامية في الجلسة الأخيرة.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice", function() {
		// Passive: أُبلغت preceded by و
		const paper = new Paper( " وأُبلغت في اليوم التالي بأن سبب التأجيل هو حالة الحمل.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );
	it( "returns active voice", function() {
		const paper = new Paper( " بدلاً من رميها، يمكنك زرع فص الثوم الذي ينبت على عمق حوالي ١ بوصة في وعاء ٤ بوصات وسقيه.", { locale: "ar" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );
} );
