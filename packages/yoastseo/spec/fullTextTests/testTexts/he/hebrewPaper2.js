import Paper from "../../../../src/values/Paper.js";
import content from "./hebrewPaper2.html";

const name = "hebrewPaper2";

const paper = new Paper( content, {
	keyword: "כוכב wikipedia",
	synonyms: "",
	description: "כוכב הוא גרם שמיים דמוי-כדור המורכב מחומר במצב צבירה פלזמה וגז. כוכב, מפיק קרינה משל עצמו על ידי היתוך גרעיני ופולט אותה לחלל החיצון.",
	title: "כוכב",
	titleWidth: 450,
	locale: "he_IL",
	permalink: "https://he.wikipedia.org/wiki/%D7%9B%D7%95%D7%9B%D7%91",
	url: "%D7%9B%D7%95%D7%9B%D7%91",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f' target='_blank'>Make sure the topic is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 7 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: The meta description has been specified, but it does not contain the keyphrase. <a href='https://yoa.st/33l' target='_blank'>Fix that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textImages: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: " +
			"Images on this page do not have alt attributes that reflect the topic of your text. " +
			"<a href='https://yoa.st/33d' target='_blank'>Add your keyphrase or synonyms to the alt tags of relevant images</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 718 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 2,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Not all the words from your keyphrase \"כוכב wikipedia\" appear in the SEO title. <a href='https://yoa.st/33h' target='_blank'>For the best SEO results write the exact match of your keyphrase in the SEO title, and put the keyphrase at the beginning of the title</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: (Part of) your keyphrase does not appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!",
	},
	urlLength: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	urlStopWords: {
		isApplicable: false,
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		isApplicable: false,
		score: 6,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 52.4 in the test, which is considered fairly difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences to improve readability</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: 1 section of your text is longer than 300 words and is not separated by any subheadings. <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 51.3% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 17.6% of the sentences contain passive voice, which is more than the recommended maximum of 10%. <a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
	},
};

export {
	name,
	paper,
	expectedResults,
};

export default {
	name: name,
	paper: paper,
	expectedResults: expectedResults,
};

