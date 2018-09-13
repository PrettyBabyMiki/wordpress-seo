/**
 *  Returns an array with exceptions for the sentence beginning researcher.
 *  @returns {Array} The array filled with exceptions.
 *  */
export default function() {
	return [
		// Numbers 1-10:
		"один", "одна", "одно", "два", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять",
		// Demonstrative pronouns: тот, этот, такой, таков, столько
		"этот", "этого", "этому", "этим", "этом", "эта", "этой", "эту", "это", "этого", "этому", "эти", "этих", "этим",
		"этими", "тот", "того", "тому", "тем", "том", "та", "той", "ту", "те", "тех", "тем", "теми", "тех", "такой",
		"такого", "такому", "таким", "такая", "такую", "такое", "такие", "таких", "таким", "такими", "стольких",
		"стольким", "столько", "столькими", "вот",
	];
}
