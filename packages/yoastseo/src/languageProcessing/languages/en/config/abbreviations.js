/**
 * Returns a list with abbreviations. Originally created for use in yoastseo/src/languageProcessing/helpers/sentence/SentenceTokenizer.js
 * Abbreviations were originally sourced from: https://github.com/Yoast/YoastSEO.js/issues/698
 * IMPORTANT! For the use in the SentenceTokenizer it is important that:
 * - all abbreviations end in a full stop.
 * - all abbreviations should contain more than one letter to prevent clashes with the check for initials.
 * @type {Array} The list with abbreviations.
 */
export default [
	"A.D.",
	"Adm.",
	"Adv.",
	"B.C.",
	"Br.",
	"Brig.",
	"Cmrd.",
	"Col.",
	"Cpl.",
	"Cpt.",
	"Dr.",
	"Esq.",
	"Fr.",
	"Gen.",
	"Gov.",
	"Hon.",
	"Jr.",
	"Lieut.",
	"Lt.",
	"Maj.",
	"Mr.",
	"Mrs.",
	"Ms.",
	"Msgr.",
	"Mx.",
	"No.",
	"Pfc.",
	"Pr.",
	"Prof.",
	"Pvt.",
	"Rep.",
	"Reps.",
	"Rev.",
	"Rt. Hon.",
	"Sen.",
	"Sens.",
	"Sgt.",
	"Sps.",
	"Sr.",
	"St.",
	"vs.",
	"i.e.",
	"e.g.",
	"viz.",
	"Mt.",
];
