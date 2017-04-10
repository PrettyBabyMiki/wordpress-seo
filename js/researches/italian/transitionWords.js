/** @module config/transitionWords */

var singleWords = [
	"abbastanza", "acciocché", "adesso", "affinché", "allora", "almeno", "alquanto", "altrettanto", "altrimenti", "analogamente", "anche", "ancora",
	"analogamente", "antecedentemente", "anzi", "anzitutto", "apertamente", "appena", "assai", "attualmente", "benché", "beninteso", "bensì", "brevemente",
	"bruscamente", "casomai", "celermente", "certamente", "certo", "chiaramente", "ciononostante", "cioé", "comparabilmente", "come", "complessivamente",
	"completamente", "comunque", "concisamente", "concludendo", "conformemente", "congiuntamente", "conseguentemente", "considerando", "considerato",
	"considerevolmente", "contemporaneamente", "continuamente", "contrariamente", "controbilanciato", "così", "cosicché", "da", "dapprima", "dato", "davvero",
	"definitivamente", "degli", "del", "della", "delle", "dettagliatamente", "di", "differente", "differentemente", "diversamente", "diverso", "dopo", "dopodiché",
	"durante", "dunque", "eccetto", "eccome", "effettivamente", "egualmente", "elencando", "enfaticamente", "eppure", "esaurientemente", "esplicitamente",
	"espressamente", "estesamente", "evidentemente", "finalmente", "finché", "fino", "finora", "fintanto", "fintanto che", "fintantoché", "fondamentalmente",
	"frattanto", "frequentemente", "generalmente", "già", "gradualmente", "illustrando", "immantinente", "immediatamente", "importantissimo", "incontestabilmente",
	"incredibilmente", "indipendentemente","indiscutibilmente", "indubbiamente", "infatti", "infine", "innanzitutto", "innegabilmente", "inoltre", "insomma",
	"intanto", "interamente", "istantaneamente", "invece", "logicamente", "lentamente", "ma", "malgrado", "marcatamente", "memorabile", "mentre", "molto",
	"motivatamente", "naturalmente", "né", "neanche", "neppure", "nonché", "nondimeno", "nonostante", "notevolmente", "occasionalmente", "oltretutto", "onde",
	"onestamente", "ora", "ossia", "ostinatamente", "ovvero", "ovviamente", "parimenti", "particolarmente", "per", "peraltro", "perché", "perciò", "perlomeno",
	"però", "pertanto", "pesantemente", "piuttosto", "poi", "praticamente", "precedentemente", "preferibilmente", "precisamente", "prematuramente", "presto",
	"prima", "primariamente", "primo", "principalmente", "prontamente", "proporzionalmente", "prossimo", "pure", "quando", "quanto", "quantomeno", "quarto",
	"quindi", "raramente", "realmente", "relativamente", "riassumendo", "riformulando", "ripetutamente", "saltuariamente", "schiettamente", "sebbene",
	"secondariamente", "secondo", "sempre", "sennò", "senza", "seguente", "sensibilmente", "seppure", "seriamente", "siccome", "sicuramente", "significativamente",
	"similmente", "simultaneamente", "singolarmente", "sinteticamente", "solitamente", "solo", "soltanto", "soprattutto", "sopravvalutato", "sorprendentemente",
	"sostanzialmente", "sottolineando", "sottovalutato", "specialmente", "specificamente", "specificatamente", "subitamente", "subito", "successivamente",
	"successivo", "talmente", "terzo", "totalmente", "tranne", "tuttavia", "ugualmente", "ulteriormente", "ultimamente", "veramente", "verosimilmente", "visto"
	];

var multipleWords = [			 
	"a breve", "a causa", "a causa di", "a condizione che", "a conseguenza", "a conti fatti", "a differenza di", "a differenza del", "a differenza della", "a differenza dei",
	"a differenza degli", "a differenza delle", "a dire il vero", "a dire la verità", "a dirla tutta", "a dispetto di", "a lungo", "a lungo termine", "a maggior ragione",
	"a meno che non", "a parte", "a patto che", "a prescindere", "a prima vista", "a proposito", "a qualunque costo", "a quanto", "a quel proposito", "a quel tempo",
	"a quell'epoca", "a questo fine", "a questo proposito", "a questo punto", "a questo riguardo", "a questo scopo", "a riguardo", "a seguire", "a seguito", "a sottolineare",
	"a tal fine", "a tal proposito", "a tempo debito", "a tutti gli effetti", "a tutti i costi", "a una prima occhiata", "ad eccezione di", "ad esempio", "ad essere maliziosi",
	"ad essere sinceri", "ad ogni buon conto", "ad ogni costo", "ad ogni modo", "ad una prima occhiata", "adesso che", "al che", "al contrario", "al contrario di", "al fine di",
	"al fine di fare", "al giorno d'oggi", "al momento", "al momento giusto", "al momento opportuno", "al più presto", "al posto di", "al suo posto", "al termine", "all'epoca",
	"all'infuori di", "all'inizio", "all'opposto", "all'ultimo", "alla fine", "alla fine della fiera", "alla luce", "alla luce di", "alla lunga", "alla moda",
	"alla stessa maniera", "allo scopo di", "allo stesso modo", "allo stesso tempo", "anch'esso", "anch'io", "anche se", "ancora più", "ancora di più", "assumendo che",
	"bisogna chiarire che", "bisogna considerare che", "causato da", "ciò nondimeno", "ciò nonostante", "col tempo", "con il tempo", "come a dire", "come abbiamo dimostrato",
	"come è stato notato", "come è stato detto", "come è stato dimostrato", "come hanno detto", "come ho detto", "come ho dimostrato", "come ho notato", "come potete notare",
	"come potete vedere", "come puoi notare", "come puoi vedere", "come si è dimostrato", "come si può vedere", "come si può notare", "come sopra indicato", "comunque sia",
	"con attenzione", "con enfasi", "con il risultato che", "con l'obiettivo di", "con ostinazione", "con questa intenzione", "con questa idea", "con queste idee",
	"con questo in testa", "con questo scopo", "così che", "così da", "d'altra parte", "d'altro canto", "d'altro lato", "d'altronde", "d'ora in avanti", "d'ora in poi",
	"da allora", "da quando", "da quanto", "da quel momento", "da quella volta", "da questo momento in poi", "da questo momento", "da qui", "da ultimo", "da un certo punto di vista",
	"da un lato", "da una parte", "dall'altro lato", "dall'epoca","dal che", "dato che", "dato per assunto che", "davanti a", "del tutto", "dell'epoca", "detto questo", "di certo",
	"di colpo", "di conseguenza", "di fatto", "di fronte", "di fronte a", "di lì a poco", "di punto in bianco", "di quando in quando", "di quanto non sia", "di quel tempo",
	"di qui a", "di rado", "di seguito", "di si", "di sicuro", "di solito", "di tanto in tanto", "di tutt'altra pasta", "di quando in quando", "differente da", "diversamente da",
	"diverso da", "dopotutto", "dovuto a", "e anche", "e inoltre", "entro breve", "fermo restando che", "faccia a faccia", "fin da", "fin dall'inizio", "fin quando", "finché non",
	"fin dal primo momento", "fin dall'inizio", "fino a", "fino a questo momento", "fino ad oggi", "fino ai giorni nostri", "fino adesso", "fino a un certo punto", "fino adesso",
	"fra quanto", "il prima possibile", "in aggiunta", "in altre parole", "in altri termini", "in ambo i casi", "in breve", "in caso di", "in conclusione", "in conformità",
	"in confronto", "in confronto a", "in conseguenza", "in considerazione", "in considerazione di", "in definitiva", "in dettaglio", "importante rendersi conto", "in effetti",
	"in entrambi i casi", "in fin dei conti", "in generale", "in genere", "in linea di massima", "in poche parole", "il più possibile", "in maggior parte", "in maniera analoga",
	"in maniera convincente", "in maniera esauriente", "in maniera esaustiva", "in maniera esplicita", "in maniera evidente", "in maniera incontestabile", "in maniera indiscutibile",
	"in maniera innegabile", "in maniera significativa", "in maniera simile", "in modo allusivo", "in modo analogo", "in modo che", "in modo convincente", "in modo da",
	"in modo identico", "in modo notevole", "in modo significativo", "in modo significativo", "in modo simile", "in ogni caso", "in ogni modo", "in ogni momento",
	"in parte considerevole", "in parti uguali", "in particolare", "in particolare per", "in particolare","in più", "in pratica","in precedenza","in prima battuta","in prima istanza",
	"in primo luogo", "in rapporto", "in qualche modo","in qualsiasi modo","in qualsiasi momento","in qualunque modo","in qualunque momento","in quarta battuta", "in quarta istanza",
	"in quarto luogo", "in quel caso", "in quelle circostanze", "in questa occasione", "in questa situazione", "in questo caso", "in questo caso particolare", "in questo istante",
	"in questo momento", "in rare occasioni", "in realtà", "in seconda battuta", "in seconda istanza","in secondo luogo", "in seguito", "in sintesi", "in sostanza", "in tempo",
	"in terza battuta","in terza istanza","in terzo luogo","in totale","in tutto", "in ugual maniera", "in ugual misura", "in ugual modo", "in ultima analisi", "in ultima istanza",
	"in un altro caso", "in una parola", "in verità", "insieme a", "insieme con", "invece che","invece di", "la prima cosa da considerare", "la prima cosa da tenere a mente",
	"lo stesso", "mentre potrebbe essere vero",  "motivo per cui", "motivo per il quale", "ne consegue che", "ne deriva che", "nei dettagli", "nel caso", "nel caso che",
	"nel caso in cui", "nel complesso", "nel corso del", "nel corso di", "nel frattempo", "nel lungo periodo", "nel mentre", "nell'eventualità che", "nella misura in cui",
	"nella speranza che", "nella stessa maniera", "nella stessa misura", "nello specifico", "nello stesso modo", "nello stesso momento", "nello stesso stile", "non appena",
	"non per essere maliziosi", "non più da", "nonostante ciò", "nonostante tutto", "ogni qualvolta", "ogni tanto", "ogni volta", "oltre a", "oltre a ciò", "ora che",
	"passo dopo passo", "per causa di", "per certo", "per chiarezza", "per chiarire", "per come", "per concludere", "per conto di", "per contro", "per cui", "per davvero",
	"per di più", "per dirla in altro modo", "per dirla meglio", "per dirla tutta", "per es.", "per esempio", "per essere sinceri", "per far vedere", "per farla breve",
	"per finire", "per l'avvenire", "per l'ultima volta", "per la maggior parte", "per la stessa ragione", "per la verità", "per lo più", "per mettere in luce",
	"per metterla in altro modo", "per non dire di", "per non parlare di", "per ora", "per ovvi motivi", "per paura di", "per paura dei", "per paura delle", "per paura degli",
	"per prima cosa","per quanto", "per questa ragione", "per questo motivo", "per riassumere", "per sottolineare", "per timore", "per trarre le conclusioni", "per ultima",
	"per ultime", "per ultimi", "per ultimo", "per via di", "perché si", "perfino se", "piano piano", "più di ogni altra cosa", "più di tutto", "più facilmente", "più importante",
	"più tardi", "poco a poco", "poco dopo", "poiché", "prendiamo il caso di", "presto o tardi", "prima che", "prima di", "prima di ogni cosa", "prima di tutto", "prima o dopo",
	"prima o poi", "purché", "questo è probabilmente vero", "questo potrebbe essere vero", "restando inteso che", "riassumendo", "quanto prima", "questa volta", "se confrontato con",
	"se e solo se", "se no", "seduta stante", "sempreché", "sempre che", "senz'altro", "senza alcun riguardo", "senza dubbio", "senz'ombra di dubbio", "senza ombra di dubbio",
	"senza riguardo per", "senza tregua", "senza ulteriore ritardo", "sia quel che sia", "solo se", "sotto questa luce", "sperando che", "sta volta", "su tutto", "subito dopo",
	"sul serio", "tanto per cominciare", "tanto quanto", "tra breve", "tra l'altro", "tra poco", "tra quanto", "tutte le volte", "tutti insieme", "tutto a un tratto",
	"tutto ad un tratto", "tutto d'un tratto", "tutto considerato", "tutto sommato", "un passo alla volta", "un tempo", "una volta", "una volta ogni tanto", "unito a", "va chiarito che",
	"va considerato che", "vada come vada", "vale a dire", "visto che"
	];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
module.exports = function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
};