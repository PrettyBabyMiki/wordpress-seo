import {
	potentiallyHarmful,
	potentiallyHarmfulCareful,
	potentiallyHarmfulOrBeSpecific,
	potentiallyHarmfulUnless,
	potentiallyHarmfulUnlessNonInclusive,
} from "./feedbackStrings";
import { isFollowedByException } from "../helpers/isFollowedByException";
import { isPrecededByException } from "../helpers/isPrecededByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";

const derogatory = "Avoid using <i>%1$s</i> as it is derogatory. Consider using an alternative, such as %2$s instead.";

const medicalCondition = "Be careful when using <i>%1$s</i>, unless talking about the specific medical condition. " +
	"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior such as %2$s.";
const medicalConditionTwoAlternatives = "Be careful when using <i>%1$s</i>, unless talking about the specific medical condition " +
	"(in which case, use <i>%2$s</i>). " +
	"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior such as %3$s.";

const potentiallyHarmfulTwoAlternatives = "Avoid using <i>%1$s</i> as it is potentially harmful. " +
	"Consider using an alternative, such as %2$s instead, or %3$s when using it to describe someone in terms of their disability.";

const disabilityAssessments =  [
	{
		identifier: "binge",
		nonInclusivePhrases: [ "bingeing", "binge" ],
		inclusiveAlternatives: "<i>indulging, satuating, wallowing</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "wheelchairBound",
		nonInclusivePhrases: [ "wheelchair-bound", "wheelchair bound", "confined to a wheelchair" ],
		inclusiveAlternatives: "<i>uses a wheelchair, a wheelchair user</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "mentallyRetarded",
		nonInclusivePhrases: [ "mentally retarded" ],
		inclusiveAlternatives: "<i>person with an intellectual disability</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "retarded",
		nonInclusivePhrases: [ "retarded" ],
		inclusiveAlternatives: "<i>uninformed, ignorant, foolish, irrational, insensible</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		learnMoreUrl: "https://yoa.st/",
		rule: ( words, inclusivePhrase ) => includesConsecutiveWords( words, inclusivePhrase )
			.filter( isPrecededByException( words, [ "mentally" ] ) ),
	},
	{
		identifier: "alcoholic",
		nonInclusivePhrases: [ "an alcoholic" ],
		inclusiveAlternatives: "person with alcohol use disorder",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
		rule: ( words, inclusivePhrase ) => includesConsecutiveWords( words, inclusivePhrase )
			.filter( isFollowedByException( words, inclusivePhrase, [ "drink", "beverage" ] ) ),
	},
	{
		identifier: "alcoholics",
		nonInclusivePhrases: [ "alcoholics" ],
		inclusiveAlternatives: "person with alcohol use disorder",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
		rule: ( words, inclusivePhrase ) => includesConsecutiveWords( words, inclusivePhrase )
			.filter( isFollowedByException( words, inclusivePhrase, [ "anonymous" ] ) ),
	},
	{
		identifier: "cripple",
		nonInclusivePhrases: [ "a cripple" ],
		inclusiveAlternatives: "person with a physical disability",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "crippled",
		nonInclusivePhrases: [ "crippled" ],
		inclusiveAlternatives: "has a physical disability",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "daft",
		nonInclusivePhrases: [ "daft" ],
		inclusiveAlternatives: "dense, ignorant, foolish",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulCareful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "handicapped",
		nonInclusivePhrases: [ "handicapped" ],
		inclusiveAlternatives: "disabled, disabled person, person with a disability",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "handicap",
		nonInclusivePhrases: [ "handicap" ],
		inclusiveAlternatives: "disability",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "insane",
		nonInclusivePhrases: [ "insane" ],
		inclusiveAlternatives: "wild, confusing, unpredictable, impulsive, reckless, risk-taker, out of control, " +
			"unbelievable, incomprehensible, irrational, nonsensical, outrageous, ridiculous",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "imbecile",
		nonInclusivePhrases: [ "imbecile" ],
		inclusiveAlternatives: "uninformed, ignorant, foolish",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "specialNeeds",
		nonInclusivePhrases: [ "special needs" ],
		inclusiveAlternatives: [ "functional needs, support needs", "disabled, disabled person, person with a disability" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulTwoAlternatives,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "hardOfHearing",
		nonInclusivePhrases: [ "hard-of-hearing" ],
		inclusiveAlternatives: "hard of hearing, partially deaf, has partial hearing loss",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "hearingImpaired",
		nonInclusivePhrases: [ "hearing impaired" ],
		inclusiveAlternatives: "deaf or hard of hearing, partially deaf, has partial hearing loss",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		// This phrase covers the below two phrases as well.
		identifier: "functioning",
		nonInclusivePhrases: [ "high functioning", "low functioning" ],
		inclusiveAlternatives: "",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using \"%1$s\" as it is potentially harmful, unless to refer how you characterize your condition." +
			"Consider using a specific characteristic or experience if it is known.",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "autismHigh",
		nonInclusivePhrases: [ "high functioning autism", "high-functioning autism" ],
		inclusiveAlternatives: "autism with low support needs",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessNonInclusive,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "autismLow",
		nonInclusivePhrases: [ "low functioning autism", "low-functioning autism" ],
		inclusiveAlternatives: "autism with high support needs",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessNonInclusive,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "lame",
		nonInclusivePhrases: [ "lame" ],
		inclusiveAlternatives: "boring, uninteresting, uncool",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "suicide",
		nonInclusivePhrases: [ "commit suicide", "committed suicide" ],
		inclusiveAlternatives: "took their life, died by suicide, killed themself",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "handicapParking",
		nonInclusivePhrases: [ "handicap parking", "disabled parking" ],
		inclusiveAlternatives: "accessible parking",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "fellOnDeafEars",
		nonInclusivePhrases: [ "fell on deaf ears" ],
		inclusiveAlternatives: "was not addressed",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "turnOnBlindEye",
		nonInclusivePhrases: [ "turn a blind eye" ],
		inclusiveAlternatives: "ignore",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "blindLeadingBlind",
		nonInclusivePhrases: [ "the blind leading the blind" ],
		inclusiveAlternatives: "ignorant, insensitive, misguided",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "disabledBathroom",
		nonInclusivePhrases: [ "disabled bathroom", "disabled bathrooms", "handicap bathroom", "handicap bathrooms" ],
		inclusiveAlternatives: "accessible bathroom(s)",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "disabledToilet",
		nonInclusivePhrases: [ "disabled toilet", "disabled toilets", "handicap toilet", "handicap toilets" ],
		inclusiveAlternatives: "accessible toilet(s)",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "disabledStall",
		nonInclusivePhrases: [ "disabled stall", "disabled stalls", "handicap stall", "handicap stalls" ],
		inclusiveAlternatives: "accessible stall(s)",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "dumb",
		nonInclusivePhrases: [ "dumb" ],
		inclusiveAlternatives: [ "uninformed, ignorant, foolish, inconsiderate, insensible, irrational, reckless " +
			"(if used in the same sense as 'stupid')", "deaf people who don't speak" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulTwoAlternatives,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "deaf",
		nonInclusivePhrases: [ "deaf-mute", "deaf and dumb" ],
		inclusiveAlternatives: "deaf",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "addict",
		nonInclusivePhrases: [ "addict" ],
		inclusiveAlternatives: "person with a (drug, alcohol, ...) addiction / person with substance abuse disorder",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "addicts",
		nonInclusivePhrases: [ "addicts" ],
		inclusiveAlternatives: "people with a (drug, alcohol, ...) addiction / people with substance abuse disorder",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "brainDamaged",
		nonInclusivePhrases: [ "brain-damaged" ],
		inclusiveAlternatives: "person with a (traumatic) brain injury",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "differentlyAbled",
		nonInclusivePhrases: [ "differently abled", "differently-abled" ],
		inclusiveAlternatives: "disabled, disabled person, person with a disability",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "epilepticFit",
		nonInclusivePhrases: [ "epileptic fit" ],
		inclusiveAlternatives: "seizure",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "sanityCheck",
		nonInclusivePhrases: [ "sanity check" ],
		inclusiveAlternatives: "final check, confidence check, rationality check, soundness check",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulOrBeSpecific,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "crazy",
		nonInclusivePhrases: [ "crazy" ],
		inclusiveAlternatives: "baffling, startling, surprising, shocking, wild, confusing, unpredictable",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "psychopathic",
		nonInclusivePhrases: [ "psychopath", "psychopathic" ],
		inclusiveAlternatives: "selfish, toxic, manipulative, wild, confusing, unpredictable, impulsive, reckless, out of control",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "schizophrenic",
		nonInclusivePhrases: [ "schizophrenic" ],
		inclusiveAlternatives: "of two minds, chaotic, confusing",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "bipolar",
		nonInclusivePhrases: [ "bipolar" ],
		inclusiveAlternatives: "of two minds, chaotic, confusing",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "paranoid",
		nonInclusivePhrases: [ "paranoid" ],
		inclusiveAlternatives: "overly suspicious, unreasonable, defensive",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manic",
		nonInclusivePhrases: [ "manic" ],
		inclusiveAlternatives: "excited, raving, unbalanced, wild",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "hysterical",
		nonInclusivePhrases: [ "hysterical" ],
		inclusiveAlternatives: "intense, vehement, piercing, chaotic",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "psycho",
		nonInclusivePhrases: [ "psycho" ],
		inclusiveAlternatives: "selfish, toxic, manipulative, wild, confusing, unpredictable, impulsive, reckless, out of control",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "neurotic",
		nonInclusivePhrases: [ "neurotic", "lunatic" ],
		inclusiveAlternatives: "baffling, startling, surprising, shocking, wild, confusing, unpredictable",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "sociopath",
		nonInclusivePhrases: [ "sociopath" ],
		inclusiveAlternatives: [ "Person with antisocial personality disorder",
			"selfish, toxic, manipulative, wild, confusing, unpredictable, impulsive, reckless, out of control" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalConditionTwoAlternatives,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "narcissistic",
		nonInclusivePhrases: [ "narcissistic" ],
		inclusiveAlternatives: [ "Person with narcissistic personality disorder",
			"selfish, egotistical, self-centered, self-absorbed, vain, toxic, manipulative" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalConditionTwoAlternatives,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default disabilityAssessments;

