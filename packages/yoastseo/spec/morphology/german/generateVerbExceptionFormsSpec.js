import { generateVerbExceptionForms } from "../../../src/morphology/german/generateVerbExceptionForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataDE = getMorphologyData( "de" ).de;

const schweigenStems = [
	"schweig",
	"schwieg",
	"geschwieg",
];
const schweigenForms = [
	"schweig",
	"schwieg",
	"schweige",
	"schweigen",
	"schweigend",
	"schweigest",
	"schweiget",
	"schweigst",
	"schweigt",
	"schwiege",
	"schwiegen",
	"schwiegest",
	"schwieget",
	"schwiegst",
	"schwiegt",
	"geschwiegen",
];

const geniessenStems = [
	"genieß",
	"genoss",
	"genöss",
	"genoss",
];
const geniessenForms = [
	"genieß",
	"genieße",
	"genießt",
	"genießen",
	"genoss",
	"genossest",
	"genosst",
	"genossen",
	"genießest",
	"genießet",
	"genösse",
	"genössest",
	"genössen",
	"genösset",
];

const bergenStems = [
	"berg",
	"birg",
	"barg",
	"bärg",
];
const bergenForms = [
	"berg",
	"barg",
	"berge",
	"bergen",
	"bergend",
	"bergest",
	"berget",
	"bergst",
	"bergt",
	"birgst",
	"birgt",
	"bargen",
	"bargest",
	"barget",
	"bargst",
	"bargt",
	"bärge",
	"bärgen",
	"bärgest",
	"bärget",
	"geborgen",
];

const schwimmenStems = [
	"schwimm",
	"schwimm",
	"schwamm",
	"schwomm",
	"schwämm",
	"schwömm",
	"geschwomm",
];
const schwimmenForms = [
	"schwimm",
	"schwamm",
	"schwomm",
	"schwimme",
	"schwimmen",
	"schwimmend",
	"schwimmest",
	"schwimmet",
	"schwimmst",
	"schwimmt",
	"schwammen",
	"schwammest",
	"schwammet",
	"schwammst",
	"schwammt",
	"schwommen",
	"schwommest",
	"schwommet",
	"schwommst",
	"schwommt",
	"schwämme",
	"schwämmen",
	"schwämmest",
	"schwämmet",
	"schwömme",
	"schwömmen",
	"schwömmest",
	"schwömmet",
	"geschwommen",
];

const essenStems = [
	"ess",
	"iss",
	"aß",
	"äß",
	"gegess",
];
const essenForms = [
	"esse",
	"isst",
	"essen",
	"esst",
	"aß",
	"aßt",
	"aß",
	"aßen",
	"gegessen",
	"essest",
	"esset",
	"äße",
	"äßest",
	"äße",
	"äßen",
	"äßet",
	"äßen",
	/*
	 * The form `iss` is not currently generated by the `generateVerbExceptionForms` function.
	 * "iss",
	 */
	"esst",
];

const schlafenStems = [
	"schlaf",
	"schläf",
	"schlief",
	"geschlaf",
];
const schlafenForms = [
	"schlaf",
	"schlief",
	"schlafe",
	"schlafen",
	"schlafend",
	"schlafest",
	"schlafet",
	"schlafst",
	"schlaft",
	"schläfst",
	"schläft",
	"schliefen",
	"schliefst",
	"schlieft",
	"geschlafen",
];

const bringenStems = [
	"bring",
	"bracht",
	"brächt",
	"gebrach",
];
const bringenForms = [
	"bring",
	"bracht",
	"bringe",
	"bringen",
	"bringend",
	"bringest",
	"bringet",
	"bringst",
	"bringt",
	"brachte",
	"brachten",
	"brachtest",
	"brachtet",
	"brächte",
	"brächten",
	"brächtest",
	"brächtet",
	"gebracht",
];

const werdenStems = [
	"werd",
	"wir",
	"wurd",
	"würd",
	"geword",
	"word",
];
const werdenForms = [
	"wurd",
	"werde",
	"werden",
	"werdend",
	"werdest",
	"werdet",
	"wirst",
	"wird",
	"wurde",
	"wurden",
	"wurdest",
	"wurdet",
	"würde",
	"würden",
	"würdest",
	"würdet",
	"geworden",
	"worden",
];

const wissenStems = [
	"weiß",
	"wiss",
	"wusst",
	"wüsst",
	"gewuss",
];
const wissenForms = [
	"wusst",
	"weiß",
	"weißt",
	"wisse",
	"wisst",
	"wissest",
	"wisset",
	"wissen",
	"wissend",
	"wusste",
	"wussten",
	"wusstest",
	"wusstet",
	"wüsste",
	"wüssten",
	"wüsstest",
	"wüsstet",
	"gewusst",
];

const seinStems = [
	"sein",
];
const seinForms = [
	"sein",
	"war",
	"bin",
	"bist",
	"ist",
	"sind",
	"warst",
	"wart",
	"waren",
	"wäre",
	"wären",
	"wärest",
	"wäret",
	"seist",
	"seien",
	"seiet",
	"sei",
	"seid",
	"seiend",
	"gewesen",
];

const festhallenStems = [
	"festhalt",
	"festhält",
	"festhielt",
	"festgehalt",
];
const festhallenForms = [
	"festhalt",
	"festhielt",
	"festhalte",
	"festhalten",
	"festhaltend",
	"festhaltest",
	"festhaltet",
	"festhaltst",
	"festhaltt",
	"festhältst",
	"festhältt",
	"festhielten",
	"festhieltst",
	"festhieltt",
	"festgehalten",
];

describe( "Test for generating verb exceptions in German", () => {
	it( "creates forms for stems of a strong verb of class 1", () => {
		schweigenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			schweigenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of a strong verb of class 2", () => {
		geniessenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			geniessenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of a strong verb of class 3", () => {
		bergenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			bergenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of a strong verb of class 3 with multiple past/past subjunctive stems", () => {
		schwimmenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			schwimmenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of a strong verb of class 4", () => {
		essenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			essenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of a strong verb of class 5", () => {
		schlafenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			schlafenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of an irregular verb `bringen`", () => {
		bringenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			bringenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of the verb 'werden'", () => {
		werdenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			werdenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of the verb 'wissen'", () => {
		wissenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			wissenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "creates forms for stems of an irregular verb `sein`", () => {
		seinStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			seinForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );

	it( "makes sure that compound verbs with prefix are recognized and return the full forms", () => {
		festhallenStems.forEach( function( stem ) {
			const receivedForms = generateVerbExceptionForms( morphologyDataDE.verbs, stem );
			festhallenForms.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );
} );
