analyzerScoring = [
    {
        scoreName: "wordCount",
        scoreFunction: "wordCountScore",
        scoreArray: [
            {result: 300, score: 9, text: ""},
            {result: 250, score: 7, text: ""},
            {result: 200, score: 5, text: ""},
            {result: 100, score: -10, text: ""},
            {result: 0, score: -20, text: ""}
        ]
    },
    {
        scoreName: "keywordDensity",
        scoreFunction: "keywordDensityScore",
        scoreObj: {
            min: {
                result: 1,
                score: 4,
                text: "The keyword density is <%keywordDensity%>%, which is a bit low, the keyword was found <%keywordCount%> times."
            },
            max: {
                result: 4.5,
                score: -50,
                text: "The keyword density is <%keywordDensity%>%, which is over the advised 4.5% maximum, the keyword was found <%keywordCount%> times."
            },
            default: {
                result: 0,
                score: 9,
                text: "The keyword density is <%keywordDensity%>%, which is great, the keyword was found <%keywordCount%> times."
            }
        }
    },
    {
        scoreName: "fleschReading",
        scoreFunction: "fleschReadingScore",
        scoreText: "The copy scores <%testResult%> in the <%scoreUrl%> test, which is considered <%scoreText%> to read.<%note%>",
        scoreUrl: "<a href='http://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease'>Flesch Reading Ease</a>",
        scoreArray: [
            {result: 90, score: 9, text: "very easy", note: ""},
            {result: 80, score: 9, text: "easy", note: ""},
            {result: 70, score: 8, text: "fairly easy", note: ""},
            {result: 60, score: 7, text: "ok", note: ""},
            {result: 50, score: 6, text: "fairly difficult", note: " Try to make shorter sentences to improve readability."},
            {result: 30, score: 5, text: "difficult", note: " Try to make shorter sentences, using less difficult words to improve readability."},
            {result: 0, score: 4, text: "very difficult", note: " Try to make shorter sentences, using less difficult words to improve readability."}
        ]
    },
    {
        scoreName: "firstParagraph",
        scoreFunction:  "firstParagraphScore",
        scoreObj: {
            none: {result: 0, score: 3, text: "The keyword doesn\'t appear in the first paragraph of the copy, make sure the topic is clear immediately."},
            some: {result: 1, score: 9, text: "The keyword appears in the first paragraph of the copy."}
        }
    },
    {
        scoreName: "metaDescriptionLength",
        scoreFunction: "metaDescriptionLengthScore",
        metaMinLength: 120,
        metaMaxLength: 156,
        scoreObj: {
            none: {result: 0, score: 1, text: "No meta description has been specified, search engines will display copy from the page instead."},
            min: { result: 120, score: 6, text: "The meta description is under <%minCharacters%> characters, however up to <%maxCharacters%> characters are available."},
            max: { result: 156, score: 6, text: "The specified meta description is over <%maxCharacters%> characters, reducing it will ensure the entire description is visible"},
            default: { score: 9, text: "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?"}
        }
    },
    {
        scoreName: "metaDescriptionKeyword",
        scoreFunction: "metaDescriptionKeywordScore",
        scoreArray: [
            {result: 1, score: 9, text: "The meta description contains the primary keyword / phrase."},
            {result: 0, score: 3, text: "A meta description has been specified, but it does not contain the target keyword / phrase."}
        ]
    },
    {
        scoreName: "stopwordKeywordCount",
        scoreFunction: "stopwordKeywordCountScore",
        scoreArray: [
            {result: 1, score: 5, text: "The keyword for this page contains one or more <%url%>, consider removing them. Found \'<%stopwords%>\'."},
            {result: 0, score: 0, text: ""}
        ],
        scoreUrl: "<a href='http://en.wikipedia.org/wiki/Stop_words'>stop words</a>"
    },
    {
        scoreName: "subHeadings",
        scoreFunction: "subHeadingsScore",
        scoreObj: {
            noHeadings: {matches: 0, count: 0, score: 7, text: "No subheading tags (like an H2) appear in the copy."},
            headingsNoKeyword: {matches: 0, count: 1, score: 3, text: "You have not used your keyword / keyphrase in any subheading (such as an H2) in your copy."},
            headingsKeyword: {matches: 1, count: 1, score: 9, text: "Keyword / keyphrase appears in <%matches%> (out of <%count%>) subheadings in the copy. While not a major ranking factor, this is beneficial."}
        }
    }
];
