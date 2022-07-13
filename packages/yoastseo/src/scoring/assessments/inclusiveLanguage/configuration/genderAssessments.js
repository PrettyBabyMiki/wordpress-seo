import { potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";

const exclusionary = "Avoid using \"%1$s\" as it is exclusionary. Consider using \"%2$s\" instead.";
const potentiallyExclusionary = "Avoid using \"%1$s\" as it is potentially exclusionary.";
const exclusionaryUnless = "Avoid using \"%1$s\" as it is exclusionary unless you are sure the group you refer to only consists of \"%1$s\". " +
	"If not, use \"%2$s\" instead.";
const derogatory = "Avoid using \"%1$s\" as it is derogatory.";

const genderAssessments = [
	{
		identifier: "firemen",
		nonInclusivePhrases: [ "firemen" ],
		inclusiveAlternatives: "firefighters",
		score: 6,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "policemen",
		nonInclusivePhrases: [ "policemen" ],
		inclusiveAlternatives: "police officers",
		score: 6,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "menAndWomen",
		nonInclusivePhrases: [ "men and women", "women and men" ],
		inclusiveAlternatives: "people, people of all genders, individuals, folks, human beings",
		score: 6,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "boysAndGirls",
		nonInclusivePhrases: [ "boys and girls", "girls and boys" ],
		inclusiveAlternatives: "kids, children",
		score: 6,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "heOrShe",
		nonInclusivePhrases: [ "he/she", "he or she", "she or he", "(s)he" ],
		inclusiveAlternatives: "singular \"they\"",
		score: 6,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "birthSex",
		nonInclusivePhrases: [ "birth sex", "natal sex" ],
		inclusiveAlternatives: "assigned sex/assigned sex at birth",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "mankind",
		nonInclusivePhrases: [ "mankind" ],
		inclusiveAlternatives: "individuals, people, persons, human beings, humanity",
		score: 3,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "preferredPronouns",
		nonInclusivePhrases: [ "preferred pronouns" ],
		inclusiveAlternatives: "pronouns",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "oppositeGender",
		nonInclusivePhrases: [ "opposite gender" ],
		inclusiveAlternatives: "another gender",
		score: 3,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "oppositeSex",
		nonInclusivePhrases: [ "opposite sex" ],
		inclusiveAlternatives: "another sex",
		score: 3,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "femaleBodied",
		nonInclusivePhrases: [ "female-bodied", "male-bodied" ],
		inclusiveAlternatives: "assigned female/male at birth",
		score: 3,
		feedbackFormat: [ potentiallyExclusionary,
			"Consider using \"%2$s\" if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to \"%1$s\"." ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "hermaphrodite",
		nonInclusivePhrases: [ "hermaphrodite" ],
		inclusiveAlternatives: "intersex",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		// Long alternative!
		identifier: "bothGenders",
		nonInclusivePhrases: [ "both genders" ],
		inclusiveAlternatives: "people, folks, human beings, all genders, both men and women " +
			"(if talking specifically about just those who are men and women and not a substitute for people in general)",
		score: 6,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "ladiesAndGentleman",
		nonInclusivePhrases: [ "ladies and gentlemen" ],
		inclusiveAlternatives: "everyone, folks, honored guests",
		score: 3,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "husbandAndWife",
		nonInclusivePhrases: [ "husband and wife" ],
		// "Married" is not a drop-in replacement. Consider removing it, or replacing it?
		inclusiveAlternatives: "spouses, partners; married",
		score: 6,
		feedbackFormat: [ potentiallyExclusionary,
			"Consider using \"%2$s\" instead unless referring to yourself or " +
			"to someone who explicitly wants to be referred to with this term." ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "mothersAndFathers",
		nonInclusivePhrases: [ "mothers and fathers", "fathers and mothers" ],
		inclusiveAlternatives: "parents",
		score: 6,
		feedbackFormat: "Avoid using \"%1$s\" as it is exclusionary unless you are sure the group only consists of people who use that term. " +
			"If not, use \"%2$s\" instead.",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manHours",
		nonInclusivePhrases: [ "man-hours" ],
		inclusiveAlternatives: "person-hours",
		score: 3,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "preferredName",
		nonInclusivePhrases: [ "preferred name" ],
		inclusiveAlternatives: "name or affirming name",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		// Feedback missing!
		identifier: "transgenders",
		nonInclusivePhrases: [ "transgenders" ],
		inclusiveAlternatives: "transgender people",
		score: 3,
		feedbackFormat: "",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "transsexual",
		nonInclusivePhrases: [ "transsexual" ],
		inclusiveAlternatives: "transgender",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "trans",
		nonInclusivePhrases: [ "transman", "transwoman" ],
		inclusiveAlternatives: "trans(gender) man/woman",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "transgendered",
		nonInclusivePhrases: [ "transgendered" ],
		inclusiveAlternatives: "transgender, trans",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "maleToFemale",
		nonInclusivePhrases: [ "male-to-female", "MTF" ],
		inclusiveAlternatives: "trans woman, transgender woman",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "femaleToMale",
		nonInclusivePhrases: [ "female-to-male", "FTM" ],
		inclusiveAlternatives: "trans man, transgender man",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "heShe",
		nonInclusivePhrases: [ "he-she" ],
		inclusiveAlternatives: "",
		score: 3,
		feedbackFormat: derogatory,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "shemale",
		nonInclusivePhrases: [ "shemale", "she-male" ],
		inclusiveAlternatives: "",
		score: 3,
		feedbackFormat: derogatory,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manMade",
		nonInclusivePhrases: [ "man-made", "manmade" ],
		inclusiveAlternatives: "artificial, synthetic, machine-made",
		score: 3,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "toEachTheirOwn",
		nonInclusivePhrases: [ "to each his own" ],
		inclusiveAlternatives: "to each their own",
		score: 3,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manned",
		nonInclusivePhrases: [ "manned" ],
		inclusiveAlternatives: "crewed",
		score: 3,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default genderAssessments;
