import { singleWords as transitionWords } from "./transitionWords";

/**
 * Returns an array of Greek function words.
 *
 * @returns {Array} The array filled with the function words.
 */
const articles = [ "μιανής", "στους", "στον", "στου", "στην", "στης", "ένας", "ενός", "έναν", "μίας", "μιάς", "την",
	"του", "τον", "των", "τις", "της", "στο", "στα", "μία", "μια", "ένα", "το", "η ", "τα", "οι", "τη", "ο" ];

const cardinalNumbers = [ "ένα", "δύο ", "τρία ", "τέσσερα", "πέντε", "έξι", "εφτά", "οχτώ", "εννιά", "οκτώ", "εννέα",
	"δέκα", "εκατό", "χίλια", "εκατομμύριο", "εκατομμύρια", "δισεκατομμύριο", "δισεκατομμύρια", "έντεκα", "ένδεκα",
	"δώδεκα", "δεκατρία", "δεκατέσσερα", "δεκαπέντε", "δεκαέξι", "δεκαεπτά", "δεκαοκτώ", "δεκαεννέα", "είκοσι" ];

const otherNumbers = [ "πρώτος", "δεύτερος", "τρίτος", "τέταρτος", "πέμπτος", "έκτος", "έβδομος", "όγδοος", "ένατος", "δέκατος",
	"πρώτη", "δεύτερη", "τρίτη", "τέταρτη", "πέμπτη", "έκτη", "έβδομη", "όγδοη", "ένατη", "δέκατη", "πρώτο ", "δεύτερο", "τρίτο",
	"τέταρτο", "πέμπτο", "έκτο", "έβδομο", "όγδοο", "ένατο", "δέκατο", "διπλάσιος", "διπλάσια", "διπλάσιο", "τριπλάσιος",
	"τριπλάσια", "τριπλάσιο", "διπλός", "διπλή", "τριπλός", "τριπλή", "χίλιοι", "χίλιες", "εκατοντάδες", "χιλιάδες" ];
const fractions = [ "μισός", "μισή", "μισό", "τέταρτο", "τρίτο", "ολόκληρο", "ολόκληρος" ];

// Including the personal pronouns with cases.
const personalPronouns = [ "εγώ", "εσύ", "αυτός", "αυτή", "αυτό", "εμείς", "εσείς", "αυτοί", "αυτές", "αυτά", "αυτούς", "εμένα",
	"εσένα", "αυτών", "μένα", "σένα", "εμάς", "εσάς", "μου", "σου", "μας", "σας", "με", "σε" ];

const demonstrativePronouns = [ "τέτοιους", "εκείνος", "εκείνου", "εκείνον", "εκείνοι", "εκείνων", "εκείνης", "εκείνες",
	"τέτοιος", "τέτοιου", "τέτοιον", "τέτοιοι", "τέτοιων", "τέτοιας", "τέτοιαν", "τέτοιες", "τούτους", "τούτην ",
	"εκείνη", "εκείνη", "εκείνο", "εκείνα", "τέτοια", "τέτοιο", "τέτοια", "τόσους", "τούτος", "τούτου", "τούτον", "τούτοι",
	"τούτων", "τούτη ", "τούτης", "τούτες", "αυτού", "αυτόν", "αυτής", "τόσος", "τόσου", "τόσον",
	"τόσοι", "τόσων", "τόσης", "τόσες", "τούτο", "τούτα", "τόση", "τόσο", "τόσα", "εκεί",
	"εδώ" ];

// Including singular and plural interrogatives.
const interrogatives = [ "ποιανού", "ποιανής", "ποιανών", "ποιους", "πόσους", "ποιος", "ποιου", "ποιον", "ποιας", "πόσος",
	"πόσου", "πόσον", "πόσης", "ποιοι", "ποιων", "ποιες", "πόσοι", "πόσων", "πόσες", "ποια", "ποιο", "πόση", "πόσα", "τί",
	"τι" ];

const interrogativeAdverbs = [ "πώς", "πού", "πόσο", "πότε" ];

// Including quantifiers for adjectives and adverbs.
const quantifiers = [ "περισσότερο", "λιγότερο", "ελάχιστα", "καθόλου", "αρκετά", "εξίσου", "κάπως", "τόσο ", "πολύ",
	"τόσο", "πιο", "όσο" ];

const reflexivePronouns = [ "εαυτός", "εαυτού", "εαυτό", "εαυτούς" ];

const possessivePronouns = [ "δικός", "δικού", "δικό", "δική", "δικής", "τους", "δικοί", "δικών", "δικούς", "δικές", "δικά" ];

const indefinitePronouns = [ "κάμποσου", "κάμποσον", "κάμποση", "κάμποσης ", "κάμποσο", "τίποτε", "καθένας", "καθενός",
	"καθένα ", "καθεμία", "καθεμιά", "καθεμίας", "καθεμιάς", "καθέναν", "δείνα", "τάδε", "μερικοί", "μερικών", "μερικούς",
	"μερικές", "μερικά", "κάποιοι", "κάποιων", "κάποιους", "κάποιες", "κάποια", "άλλοι", "άλλων", "αλλονών", "άλλους",
	"άλλες", "άλλα", "κάμποσοι", "κάμποσων", "κάμποσες", "κάμποσα" ];

const prepositions = [ "σε", "με", "από", "για", "ως", "πριν", "προς", "σαν", "αντί", "δίχως", "έως", "κατά", "μετά",
	"μέχρι", "χωρίς", "παρά", "εναντίον", "εξαιτίας", "μεταξύ", "ίσαμε", "άνευ", "αμφί", "ανά", "διά", "εκ", "εις", "εξ",
	"εκτός", "εν", "ένεκα", "εντός", "επί", "λόγω", "περί", "πρό", "συν", "υπέρ", "υπό", "χάριν", "χάρη" ];

const particles = [ "δεν", "θα", "δεν", "μη", "μην", "όχι", "ναι", "ας", "για", "μα" ];

const conjuntions = [ "να", "και", "που", "ότι", "αν", "αλλά", "ούτε", "ουδέ", "μηδέ", "μήτε", "ή", "είτε", "μα", "παρά",
	"όμως", "ωστόσο", "ενώ", "μολονότι", "μόνο", "μόνο που", "λοιπόν", "ώστε", "άρα", "επομένως", "οπότε", "δηλαδή", "πως",
	"μην", "μήπως", "άμα", "όταν", "καθώς", "αφού", "αφότου", "πριν", "μόλις", "προτού", "ώσπου", "ωσότου", "σαν", "γιατί", "επειδή" ];

const interviewVerbs = [ "συνηθισμένος", "μεγαλύτερος", "ουσιαστικός", "πραγματικός", "συνηθισμένη", "συνηθισμένο", "περίπλοκος",
	"πραγματική", "πραγματικό", "καλύτερος", "περίπλοκη", "περίπλοκο", "κανονικός", "αδιανόητο", "καλύτερη", "κανονική",
	"κανονικό", "σχετικός", "βασικός", "τρομερό", "απαίσιο", "σπάνιος", "σπάνιος", "σχετική", "σχετικό", "σοβαρά", "ωραίος",
	"μεγάλο", "βασική", "βασικό", "άσχημο", "σπάνια", "καλός", "ωραία", "ωραίο", "απλός", "μέσος", "πρώην", "καλά", "καλή",
	"απλή", "απλό" ];

const intensifiers = [ "πολύ", "παρά ", "παρα", "απίστευτα", "εκπληκτικά", "αναπάντεχα", "αφάνταστα", "πραγματικά", "εντελώς",
	"απόλυτα", "καθολικά", "τελείως" ];

const auxiliariesAndDelexicalizedVerbs = [ "συνηθίζεται", "ενδέχεται", "εξαρτάται", "εννοείται", "είθισται", "είμαστε",
	"είσαστε", "υπάρχει", "μπορεί", "παίρνω", "πρέπει", "έχουμε", "είναι", "είμαι", "είσαι", "είστε", "ρίχνω", "μπορώ",
	"κάνω", "τρώω", "βάζω", "δίνω", "πάμε", "πάω", "έχω" ];

const generalAdjectivesAdverbs = [ "καλός", "καλά", "καλή", "καλύτερος", "καλύτερη", "σοβαρά", "ωραίος", "ωραία", "ωραίο",
	"απλός", "απλή", "απλό", "περίπλοκος", "περίπλοκη", "περίπλοκο", "μεγάλο", "μεγαλύτερος", "βασική", "βασικός", "βασικό",
	"ουσιαστικός", "κανονικός", "κανονική", "κανονικό", "άσχημο", "τρομερό", "απαίσιο", "αδιανόητο", "μέσος", "πραγματικός",
	"πραγματική", "πραγματικό", "πρώην", "σπάνιος", "σπάνια", "συνηθισμένος ", "συνηθισμένη", "συνηθισμένο", "σχετικός",
	"σχετική", "σχετικό", "καλύτερα", "τέλεια", "υπέροχα", "έντονα", "παραλίγο", "απλά", "κυρίως", "συνήθως", "ευθέως",
	"συνεχώς", "αδιάκοπα", "ασταμάτητα", "ατελείωτα", "ατέρμονα", "βασικά", "ουσιαστικά", "κανονικά", "άσχημα", "εντάξει",
	"τελικά", "φυσικά", "μπροστά", "πίσω", "επάνω", "κάτω", "ευτυχώς", "δυστυχώς", "ξαφνικά", "ειλικρινά", "απροσδόκητα",
	"απότομα", "ανάμεσα", "κοντά", "σιμά", "μακριά", "δίπλα", "σχετικά" ];

const interjections = [ "α", "αα", "αχ", "αι", "αλί", "αλίμονο", "αμάν", "αμέ", "αμποτε", "άιντε", "άντε", "άου", "άχου",
	"αχού", "βαχ", "βουρ ", "βρε", "ε", "ει", "εμ", "επ", "ζήτω", "εύγε", "μμμ", "μπα", "μπαμ", "μπράβο", "μωρέ", "μωρή",
	"ω", "ου", "ούου", "ουστ", "οιμέ", "οϊμέ", "ωπ", "οπ", "πωπω", "ποπο", "απαπα", "ουφ", "ώπα", "ώπατης", "όπα",
	"όπατης", "ωχ", "οχ", "όχου", "ώχου", "όφου", "ποπό", "πωπώ", "πουφ", "πριτς", "πφ", "ρε", "σουτ", "τσου", "τσα",
	"φτου", "χα", "χαχαχα", "χμ", "ωω", "ωωω", "ωχού", "ουάου" ];

const recipeWords = [ "γραμ.", "γραμμ.", "γραμμάρια", "κ/γ", "κ.γ.", "κ.σ.", "γρ.", "ματσ.", "κιλό", "φλ.", "φλυτζάνι", "κούπα",
	"ποτ.", "ποτήρι", "σκ.", "ξύσμα", "φλούδα", "λίτρο", "λίτρα" ];

const timeWords = [ "δευτερόλεπτο", "δευτερόλεπτα", "δεύτερα", "ώρα", "ώρας", "τέταρτο", "μισάωρο", "ώρες", "μέρα", "μέρας",
	"μέρες", "ημέρα", "ημέρες", "σήμερα", "αύριο", "εχθές", "χθές", "βδομάδα", "βδομάδες", "βδομάδας", "εβδομάδα", "εβδομάδες",
	"μισαωράκι", "τεταρτάκι", "δεκάλεπτο", "πεντάλεπτο", "φέτος", "πέρσι", "χρόνος", "πέρυσι", "χρόνου", "πρόπερσι", "προχθές" ];

const vagueNouns = [ "πράγμα", "πράγματα", "υπόθεση", "περίπτωση", "πρόβλημα", "προβλήματα", "αντικείμενο", "αντικείμενα",
	"θέμα", "θέματα", "περίσταση", "συνθήκες", "περιστάσεις", "ζήτημα", "ζητήματα", "ζητημάτων", "υποθέσεις", "γεγονός",
	"γεγονότα", "κατάσταση", "καταστάσεις", "ουσία", "τρόπος", "μέθοδος", "παράγοντας", "παράγοντες", "αιτία", "επίπτωση",
	"αιτίες", "επιπτώσεις", "μέρος", "μέρη", "άποψη", "απόψεις", "γνώμη", "γνώμες", "άτομο", "άτομα", "ομάδα", "πραγματικότητα",
	"διαφορά", "διαφορές", "ομοιότητες" ];

const titles = [ "δεσποινίς", "καθηγητής", "διδάκτωρ", "κύριος", "κύριοι", "κυρίες", "καθηγ", "κυρία", "διδα", "καθ", "κος", "δρ", "κα" ];

export const all = [].concat( articles, cardinalNumbers, otherNumbers, fractions, personalPronouns, demonstrativePronouns,
	interrogatives, interrogativeAdverbs, quantifiers, reflexivePronouns, possessivePronouns, indefinitePronouns,
	prepositions, particles, conjuntions, interviewVerbs, intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs,
	interjections, recipeWords, timeWords, vagueNouns, titles, transitionWords );

export default all;
