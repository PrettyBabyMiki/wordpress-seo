var passiveAuxiliaries = require( "./passivevoice-german/auxiliaries.js" )();
var transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an array with exceptions for the keyword suggestion researcher.
 * @returns {Array} The array filled with exceptions.
 */

var articles = [ "das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines" ];
var numerals = [ "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf",
	"zwoelf", "dreizehn", "vierzehn", "fünfzehn", "fuenfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn",
	"zwanzig", "erste", "zweite", "dritte", "vierte", "fünfte", "fuenfte", "sechste", "siebte", "achte", "neunte",
	"zehnte", "elfte", "zwölfte", "zwoelfte", "dreizehnte", "vierzehnte", "fünfzehnte", "sechzehnte", "siebzehnte",
	"achtzehnte", "nehnzehnte", "zwanzigste", "hundert", "einhundert", "zweihundert", "zweihundert", "dreihundert",
	"vierhundert", "fünfhundert", "fuenfhundert", "sechshundert", "siebenhundert", "achthundert", "neunhundert",
	"tausend", "million", "milliarde", "billion", "billiarde" ];
var personalPronounsNominative = [ "ich", "du", "er", "sie", "es", "wir", "ihr", "sie" ];
var personalPronounsAccusative = [ "mich", "dich", "ihn", "sie", "es", "uns", "euch" ];
var personalPronounsDative = [ "mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen" ];
var demonstrativePronouns = [ "denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses",
	"jene",	"jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches" ];
var possessivePronouns = [ "mein", "meine", "meinem", "meiner", "meines", "dein", "deine", "deinem", "deiner",
	"deines", "sein", "seine", "seinem", "seiner", "seines", "ihr", "ihre", "ihrem", "ihren", "ihrer", "ihres",
	"unser", "unsere", "unserem", "unseren", "unserer", "unseres", "euer", "eure", "eurem", "euren", "eurer",
	"eures" ];


var quantifiers = [ "manche", "manch", "viele", "viel", "vieler", "vielen", "vielem", "alle", "aller", "alles",
	"allen", "allem", "allerlei", "solcherlei", "einige", "etliche", "manch", "wenige", "weniger", "wenigen",
	"wenigem", "weniges", "wenig", "wenigerer", "wenigeren", "wenigerem", "wenigere", "wenigeres", "wenig",
	"bisschen", "paar", "irgendwelche", "kein", "keines", "keinem", "keinen", "keine", "mehrere", "nichts",
	"etwas", "genug", "mehrere", "mehrerer", "mehreren", "mehrerem", "mehreres", "verschiedene", "verschiedener",
	"verschiedenen", "verschiedenem", "verschiedenes", "verschiedne", "verschiedner", "verschiednen", "verschiednem",
	"verschiednes", "art", "arten", "sorte", "sorten" ];


var reflexivePronouns = [ "myself", "yourself", "himself", "herself", "itself", "oneself", "ourselves", "yourselves", "themselves" ];
var indefinitePronouns = [ "none", "nobody", "everyone", "everybody", "someone", "somebody", "anyone", "anybody", "nothing",
	"everything", "something", "anything", "each", "another", "other", "whatever", "whichever", "whoever", "whomever",
	"whomsoever", "whosoever", "others", "neither", "both", "either", "any", "such" ];

var indefinitePronouns = [ "andere", "beide", "einer", "etwas", "irgendetwas", "irgendein", "irgendwas", "irgendwer",
	"jeder", "jedes", "jedem", "jeden", "jede", "jedweder", "jeglicher", "jedermann", "jemand", "irgendjemand",
	"man", "meinesgleichen", "niemand",	"sämtlich", "saemtlich", "solche", "solcher", "solchen", "solchem", "solches"];

var indefinitePronounsPossessive  = [ "one's", "nobody's", "everyone's", "everybody's", "someone's", "somebody's", "anyone's",
	"anybody's", "nothing's", "everything's", "something's", "anything's", "whoever's", "others'", "other's", "another's",
	"neither's", "either's" ];

// All relativePronouns are already included in other lists (interrogativeDeterminers, interrogativePronouns)
var relativePronouns = [];
var interrogativeDeterminers = [ "which", "what", "whose" ];
var interrogativePronouns = [ "who", "whom" ];
var interrogativeProAdverbs = [ "where", "whither", "whence", "how", "why", "whether", "wherever", "whomever", "whenever",
	"however", "whyever", "whoever", "whatever", "wheresoever", "whomsoever", "whensoever", "howsoever", "whysoever", "whosoever",
	"whatsoever", "whereso", "whomso", "whenso", "howso", "whyso", "whoso", "whatso" ];
var pronominalAdverbs = [ "therefor", "therein", "hereby", "hereto", "wherein", "therewith", "herewith", "wherewith", "thereby" ];
var locativeAdverbs = [ "there", "here", "whither", "thither", "hither", "whence", "thence", "hence" ];
var adverbialGenitives = [ "always", "afterwards", "towards", "once", "twice", "thrice", "amidst", "amongst", "midst", "whilst" ];
var otherAuxiliaries = [ "can", "cannot", "can't", "could", "couldn't", "could've", "dare", "dares", "dared", "daring", "do",
	"don't", "does", "doesn't", "did", "didn't", "doing", "done", "have", "haven't", "had", "hadn't", "has", "hasn't", "having",
	"i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "it'd", "we'd", "they'd", "would", "wouldn't",
	"would've", "may", "might", "must", "need", "needn't", "needs", "ought", "shall", "shalln't", "shan't", "should",
	"shouldn't", "will", "won't", "i'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll", "there's", "there're",
	"there'll", "here's", "here're", "there'll" ];
var copula = [ "appear", "appears", "appearing", "appeared", "become", "becomes", "becoming", "became", "come", "comes",
	"coming", "came", "keep", "keeps", "kept", "keeping", "remain", "remains", "remaining", "remained", "stay",
	"stays", "stayed", "staying", "turn", "turns", "turned" ];

var prepositions = [ "in", "from", "with", "under", "throughout", "atop", "for", "on", "until", "of", "to", "aboard", "about",
	"above", "abreast", "absent", "across", "adjacent", "after", "against", "along", "alongside", "amid", "midst", "mid",
	"among", "apropos", "apud", "around", "as", "astride", "at", "ontop", "before", "afore", "tofore", "behind", "ahind",
	"below", "ablow", "beneath", "neath", "beside", "besides", "between", "atween", "beyond", "ayond", "but", "by", "chez",
	"circa", "come", "despite", "spite", "down", "during", "except", "into", "less", "like", "minus", "near", "nearer",
	"nearest", "anear", "notwithstanding", "off", "onto", "opposite", "out", "outen", "over", "past", "per", "pre", "qua",
	"sans", "sauf", "since", "sithence", "than", "through", "thru", "truout", "toward", "underneath", "unlike", "until",
	"up", "upon", "upside", "versus", "via", "vis-à-vis", "without", "ago", "apart", "aside", "aslant", "away", "withal" ];

// Many prepositional adverbs are already listed as preposition.
var prepositionalAdverbs = [ "back", "within", "forward", "backward", "ahead" ];

var coordinatingConjunctions = [ "so", "and", "nor", "but", "or", "yet", "for" ];

// 'Rather' is part of 'rather...than', 'sooner' is part of 'no sooner...than', 'just' is part of 'just as...so',
// 'Only' is part of 'not only...but also'.
var correlativeConjunctions = [ "rather", "sooner", "just", "only" ];
var subordinatingConjunctions = [ "after", "although", "when", "as", "if", "though", "because", "before", "even", "since", "unless",
	"whereas", "while" ];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'stated' are not included, because these words are also nouns.
var interviewVerbs = [ "say", "says", "said", "saying", "claimed", "ask", "asks", "asked", "asking", "stated", "stating",
	"explain", "explains", "explained", "think", "thinks" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = [ "and", "or", "about", "absolutely", "again", "definitely", "eternally", "expressively",
	"expressly", "extremely", "immediately", "including", "instantly", "namely", "naturally", "next", "notably", "now", "nowadays",
	"ordinarily", "positively", "truly", "ultimately", "uniquely", "usually", "almost", "first", "second", "third", "maybe",
	"probably", "granted", "initially", "overall", "too", "actually", "already", "e.g", "i.e", "often", "regularly", "simply",
	"optionally", "perhaps", "sometimes", "likely", "never", "ever", "else", "inasmuch", "provided", "currently", "incidentally",
	"elsewhere", "following", "particular", "recently", "relatively", "f.i", "clearly", "apparently" ];

var intensifiers = [ "highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite",
	"somewhat", "seriously", "fairly", "fully", "amazingly" ];

// These verbs convey little meaning. 'Show', 'shows', 'uses', "meaning" are not included, because these words could be relevant nouns.
var delexicalisedVerbs = [ "seem", "seems", "seemed", "seeming", "let", "let's", "lets", "letting", "make", "making", "makes",
	"made", "want", "showing", "showed", "shown", "go", "goes", "going", "went", "gone", "take", "takes", "took", "taken", "set", "sets",
	"setting", "put", "puts", "putting", "use", "using", "used", "try", "tries", "tried", "trying", "mean", "means", "meant",
	"called", "based", "add", "adds", "adding", "added", "contain", "contains", "containing", "contained" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Key word combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = [ "new", "newer", "newest", "old", "older", "oldest", "previous", "good", "well", "better", "best",
	"big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest", "far", "hard", "harder", "hardest",
	"least", "own", "large", "larger", "largest", "long", "longer", "longest", "low", "lower", "lowest", "high", "higher",
	"highest", "regular", "simple", "simpler", "simplest", "small", "smaller", "smallest", "tiny", "tinier", "tiniest",
	"short", "shorter", "shortest", "main", "actual", "nice", "nicer", "nicest", "real", "same", "able", "certain", "usual",
	"so-called", "mainly", "mostly", "recent", "anymore", "complete", "lately", "possible", "commonly", "constantly",
	"continually", "directly", "easily", "nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar",
	"widely", "bad", "worse", "worst", "great" ];

var interjections = [ "oh", "wow", "tut-tut", "tsk-tsk", "ugh", "whew", "phew", "yeah", "yea", "shh", "oops", "ouch", "aha",
	"yikes" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = [ "tbs", "tbsp", "spk", "lb", "qt", "pk", "bu", "oz", "pt", "mod", "doz", "hr", "f.g", "ml", "dl", "cl",
	"l", "mg", "g", "kg", "quart" ];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
var vagueNouns = [ "thing", "things", "way", "ways", "matter", "case", "likelihood", "ones", "piece", "pieces", "stuff", "times",
	"part", "parts", "percent", "instance", "instances", "aspect", "aspects", "item", "items", "people", "idea", "theme",
	"person", "percent" ];

// 'No' is already included in the quantifier list.
var miscellaneous = [ "not", "yes", "rid", "sure", "top", "bottom", "ok", "okay", "amen", "aka", "%" ];

module.exports = function() {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat( personalPronounsAccusative, personalPronounsDative,
			possessivePronouns ),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat( subordinatingConjunctions ),
		verbs: passiveAuxiliaries.concat( otherAuxiliaries, copula, interviewVerbs, delexicalisedVerbs ),
		quantifiers: quantifiers,
		relativePronouns: interrogativeDeterminers.concat( interrogativePronouns, interrogativeProAdverbs ),
		passiveAuxiliaries: passiveAuxiliaries,
		all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronounsNominative, personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns,
			indefinitePronounsPossessive, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs,
			pronominalAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, passiveAuxiliaries,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous ),
	};
};
