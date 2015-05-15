/**
 * Text Analyzer, accepts args for config and calls init for initialisation
 * @param args
 * @constructor
 */

Analyzer = function (args){
    this.config = args;
    this.init();
};

/**
 * Analyzer initialisation. Loads defaults and overloads custom settings.
 */
Analyzer.prototype.init = function() {
    this.initDependencies();
    this.initQueue();
    this.loadWordlists();
    this.setDefaults();
    this.__output = [];
    this.__store = {};
};

/**
 * initializes required objects.
 * For the analyzeScorer a new object is always defined, to make sure there are no duplicate scores
 */
Analyzer.prototype.initDependencies = function(){
    //init preprocessor
    this.preProcessor = preProcessor(this.config.textString);
    //init helper
    this.stringHelper = stringHelper();
    //init scorer
    this.analyzeScorer = new AnalyzeScorer(this);
};

/**
 * initializes the function queue.
 */
Analyzer.prototype.initQueue = function(){
    //if no available function queues, make new queue
    if (typeof this.queue !== "object") {
        this.queue = [];
    }
    //if custom queue available load queue, otherwise load default queue.
    if(typeof this.config.queue !== "undefined" && this.config.queue.length !== 0){
        this.queue = this.config.queue;
    }else{
        this.queue = ["wordCount", "keywordDensity", "subHeadings", "stopwords", "fleschReading", "linkCount", "imageCount", "urlKeyword", "urlLength", "urlKeywords", "metaDescription", "pageTitleKeyword", "pageTitleLength", "firstParagraph"];
    }
};

/**
 * load wordlists.
 */
Analyzer.prototype.loadWordlists = function(){
    //if no available keywords, load default array
    if(typeof this.config.wordsToRemove === "undefined"){
        this.config.wordsToRemove =  analyzerConfig.wordsToRemove;
    }
    if(typeof this.config.stopWords === "undefined"){
        this.config.stopWords = analyzerConfig.stopWords;
    }
};

/**
 * set default variables.
 */
Analyzer.prototype.setDefaults = function(){
    //set default variables
    this.keywordRegex = new RegExp(this.config.keyword);
};

/**
 * starts queue of functions executing the analyzer functions untill queue is empty.
 */
Analyzer.prototype.runQueue = function(){
    //remove first function from queue and execute it.
    if(this.queue.length > 0){
        this.__output = this.__output.concat(this[this.queue.shift()]());
        this.runQueue();
    } else {
        this.score();
    }
};

/**
 * clears current queue of functions, effectively stopping execution of the analyzer.
 */
Analyzer.prototype.abortQueue = function(){
    //empty current Queue
    this.queue = [];
};

/**
 * returns wordcount from the preprocessor storage to include them in the results.
 * @returns {{test: string, result: (Function|PreProcessor.wordcount|Number)}[]}
 */
Analyzer.prototype.wordCount = function(){
    return [{test: "wordCount", result:this.preProcessor.__store.wordcount}];
};


/**
 * checks the keyword density of given keyword against the cleantext stored in __store.
 * @returns resultObject
 */
Analyzer.prototype.keywordDensity = function() {
    var result = [{ test: "keywordDensity", result: 0  }];
    if (this.preProcessor.__store.wordcount > 100) {
        var keywordDensity = this.keywordDensityCheck();
        result[0].result = keywordDensity.toFixed(1);
    }
    return result;
};

/**
 * checks and returns the keyword density
 * @returns {number}
 */
Analyzer.prototype.keywordDensityCheck = function(){
    var keywordCount = this.keywordCount();
    var keywordDensity = 0;
    if ( keywordCount !== 0 ) {
        keywordDensity = (keywordCount / this.preProcessor.__store.wordcount - (keywordCount - 1 * keywordCount)) * 100;
    }
    return keywordDensity;
};

/**
 * counts the number of keyword occurrences of the keyword. Saves this in the __store and returns it.
 * @returns {*}
 */
Analyzer.prototype.keywordCount = function(){
    var keywordMatches = this.stringHelper.matchString(this.preProcessor.__store.cleanText,[this.config.keyword]);
    var keywordCount = 0;
    if ( keywordMatches !== null ) {
        keywordCount = keywordMatches.length;
    }
    this.__store.keywordCount = keywordCount;
    return keywordCount;
};

/**
 * checks if keywords appear in subheaders of stored cleanTextSomeTags text.
 * @returns resultObject
 */
Analyzer.prototype.subHeadings = function() {
    var result = [{test: "subHeadings", result: {count: 0, matches: 0 } }];
    var matches = this.preProcessor.__store.cleanTextSomeTags.match(/<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/g);
    if(matches !== null){
        result[0].result.count = matches.length;
        result[0].result.matches = this.subHeadingsCheck(matches);
    }
    return result;
};

/**
 * subHeadings checker to check if keyword is present in given headings.
 * @param matches
 * @returns {number}
 */
Analyzer.prototype.subHeadingsCheck = function(matches){
    var foundInHeader;
    if (matches === null){
        foundInHeader = -1;
    }else{
        foundInHeader = 0;
        for (var i = 0; i < matches.length; i++) {
            var formattedHeaders = this.stringHelper.replaceString(matches[i], this.config.wordsToRemove);
            if (formattedHeaders.match(new RegExp(this.config.keyword, "g")) || matches[i].match(new RegExp(this.config.keyword, "g"))) {
                foundInHeader++;
            }
        }
    }
    return foundInHeader;
};

/**
 * check if the keyword contains stopwords.
 * @returns {result object}
 */
Analyzer.prototype.stopwords = function(){
    //prefix space to the keyword to make sure it matches if the keyword starts with a stopword.
    var keyword = " "+this.config.keyword;
    var matches = this.stringHelper.matchString(keyword, this.config.stopWords);
    var stopwordCount = matches !== null ? matches.length : 0;
    return [ { test: "stopwordKeywordCount", result: {count: stopwordCount, matches: matches } } ];
};

/**
 * calculate Flesch Reading score
 * @returns {result object}
 */
Analyzer.prototype.fleschReading = function(){
    var score =  (206.835 - (1.015 * (this.preProcessor.__store.wordcountNoTags / this.preProcessor.__store.sentenceCountNoTags)) - (84.6 * (this.preProcessor.__store.syllablecount / this.preProcessor.__store.wordcountNoTags))).toFixed(1);
    if(score < 0){score = 0;}else if (score > 100){score = 100;}
    return [ { test: "fleschReading", result: score} ];
};

/**
 * counts the links in a given text. Also checks if a link is internal of external.
 * @returns {{total: number, internal: {total: number, dofollow: number, nofollow: number}, external: {total: number, dofollow: number, nofollow: number}, other: {total: number, dofollow: number, nofollow: number}}}
 */
Analyzer.prototype.linkCount = function(){
    var linkMatches = this.preProcessor.__store.originalText.match(/<a(?:[^>]+)?>(.*?)<\/a>/g);
    var linkCount = {
        total: 0,
        totalKeyword: 0,
        internal: {total: 0, dofollow: 0,nofollow: 0},
        external: {total: 0,dofollow: 0,nofollow: 0},
        other: {total: 0,dofollow: 0,nofollow: 0}
    };
    if(linkMatches !== null){
        linkCount.total = linkMatches.length;
        for(var i = 0; i < linkMatches.length; i++){
            var linkKeyword = this.linkKeyword(linkMatches[i]);
            if(linkKeyword){
                linkCount.totalKeyword++;
            }
            var linkType = this.linkType(linkMatches[i]);
            linkCount[linkType].total++;
            var linkFollow = this.linkFollow(linkMatches[i]);
            linkCount[linkType][linkFollow]++;
        }
    }
    return [ { test: "linkCount", result: linkCount } ];
};

/**
 * Checks the linktype of the given url against the URL stored in the config.
 * @param url
 * @returns {string}
 */
Analyzer.prototype.linkType = function(url){
    var linkType = "other";
    if(url.match(/https?:\/\//g) !== null){
        linkType = "external";
        var urlMatch = url.match(this.config.url);
        if(urlMatch !== null && urlMatch[0].length !== 0){
            linkType = "internal";
        }
    }
    return linkType;
};

/**
 * checks if the URL has a nofollow attribute
 * @param url
 * @returns {string}
 */
Analyzer.prototype.linkFollow = function(url){
    var linkFollow = "dofollow";
    if(url.match(/rel=([\'\"])nofollow\1/g) !== null){
        linkFollow = "nofollow";
    }
    return linkFollow;
};

/**
 * checks if the url contains the keyword
 * @param url
 * @returns {boolean}
 */
Analyzer.prototype.linkKeyword = function(url){
    var keywordFound = false;
    var formatUrl = url.match(/<a(.*?)(?:[^>]+)?>/);
    if(formatUrl[0].match(this.config.keyword) !== null){
        keywordFound = true;
    }
    return keywordFound;
};

/**
 * counts the number of images found in a given textstring, based on the <img>-tag and returns a result object
 * @returns {{name: string, result: {total: number, alt: number, noalt: number}}}
 */
//todo update function so it will also check on picture elements.
Analyzer.prototype.imageCount = function(){
    var imageCount = {total: 0, alt: 0, noalt: 0, altKeyword: 0};
    var imageMatches = this.preProcessor.__store.originalText.match(/<img(?:[^>]+)?>/g);
    if(imageMatches !== null){
        imageCount.total = imageMatches.length;
        for (var i = 0; i < imageMatches.length; i++){
            var alttag = imageMatches[i].match(/alt=([\'\"])(.*?)\1/g);
            if(this.imageAlttag(alttag)){
                if(this.imageAlttagKeyword(alttag)){
                    imageCount.altKeyword++;
                }else{
                    imageCount.alt++;
                }

            }else{
                imageCount.noalt++;
            }
        }
    }
    return  [ {test: "imageCount", result: imageCount } ];
};

/**
 * checks if  the alttag contains any text.
 * @param image
 * @returns {boolean}
 */
Analyzer.prototype.imageAlttag = function(image){
    var hasAlttag = false;
    if(image !== null){
        if(image[0].split("=")[1].match(/[a-z0-9](.*?)[a-z0-9]/g) !== null){
            hasAlttag = true;
        }
    }
    return hasAlttag;
};

/**
 * checks if the alttag matches the keyword
 * @param image
 * @returns {boolean}
 */
Analyzer.prototype.imageAlttagKeyword = function(image){
    var hasKeyword = false;
    if(image !== null){
        if(image[0].match(this.keywordRegex) !== null){
            hasKeyword = true;
        }
    }
    return hasKeyword;
};


/**
 * counts the number of characters in the pagetitle, returns 0 if empty or not set.
 * @returns {{name: string, count: *}}
 */

Analyzer.prototype.pageTitleLength = function(){
    var count = 0;
    if(typeof this.config.pageTitle !== "undefined"){
        count = this.config.pageTitle.length;
    }
    return [ {test: "pageTitleLength", result: count } ];
};

/**
 * counts the occurrences of the keyword in the pagetitle, returns 0 if pagetitle is empty or not set.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.pageTitleKeyword = function(){
    var result = [ { test: "pageTitleKeyword", result: {matches: 0, position: 0 } } ];
    if(typeof this.config.pageTitle !== "undefined") {
        result[0].result.matches = this.stringHelper.countMatches(this.config.pageTitle, this.keywordRegex);
        result[0].result.position = this.config.pageTitle.indexOf(this.config.keyword);
    }
    return result;
};

/**
 * counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * or there is no paragraph-tag in the given string.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.firstParagraph = function() {
    var matches = this.preProcessor.__store.cleanTextSomeTags.match(/<p(?:[^>]+)?>(.*?)<\/p>/g);
    var result =[ { test: "firstParagraph", result: 0 } ];
    if(matches !== null){
        result[0].result = this.stringHelper.countMatches(matches[0], this.keywordRegex);
    }
    return result;
};

/**
 * counts the occurrences of the keyword in the metadescription, returns 0 if metadescription is empty or not set.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.metaDescription = function() {
    var result =[ { test: "metaDescriptionLength", result: 0 }, {test : "metaDescriptionKeyword", result : 0 } ];
    if(typeof this.config.meta !== "undefined") {
        result[0].result = this.config.meta.length;
        result[1].result = this.stringHelper.countMatches(this.config.meta, this.keywordRegex);
    }
    return result;
};

/**
 * counts the occurences of the keyword in the URL, returns 0 if no URL is set or is empty.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.urlKeyword = function() {
    var result = [ { test: "urlKeyword", result : 0 } ];
    if(typeof this.config.url !== "undefined") {
        result[0].result = this.stringHelper.countMatches(this.config.url, this.keywordRegex);
    }
    return result;
};

/**
 * returns the length of the URL
 * @returns {{test: string, result: number}[]}
 */
Analyzer.prototype.urlLength = function(){
    var result = [ { test: "urlLength", result : 0 } ];
    if(typeof this.config.url !== "undefined") {
        result[0].result = this.config.url.length;
    }
    return result;
};

/**
 * checks if there are stopwords used in the URL.
 * @returns {{test: string, result: number}[]}
 */
Analyzer.prototype.urlStopwords = function(){
    var result = [ { test: "urlStopwords", result : 0 } ];
    if(typeof this.config.url !== "undefined") {
        var stopwords = this.stringHelper.matchString(this.config.url, this.config.stopWords);
        if(stopwords !== null) {
            result[0].result = stopwords.length;
        }
    }
    return result;
};


Analyzer.prototype.score = function() {
    this.analyzeScorer.score(this.__output);
};

/**helper functions*/
StringHelper = function(){};
/**
 * removes strings from array and replaces them with keyword.
 * @param textString
 * @param stringsToRemove []
 * @param replacement (default == space)
 * @returns {textString}
 */
StringHelper.prototype.replaceString = function(textString, stringsToRemove, replacement){
    if(typeof replacement === "undefined"){replacement = " ";}
    textString = textString.replace(this.stringToRegex(stringsToRemove), replacement);
    return this.stripSpaces(textString);
};

/**
 * matches string with given array of strings to match.
 * @param textString
 * @param stringsToMatch
 * @returns {matches}
 */
StringHelper.prototype.matchString = function(textString, stringsToMatch){
    return textString.match(this.stringToRegex(stringsToMatch));
};

/**
 * matches string with regex, returns the number of matches
 * @param textString
 * @param regex
 * @returns {number}
 */
StringHelper.prototype.countMatches = function(textString, regex){
    var count = 0;
    var matches = textString.match(regex);
    if(matches !== null){
        count = matches.length;
    }
    return count;
};

/**
 * builds regex from array with strings
 * @param stringArray
 * @returns {RegExp}
 */
StringHelper.prototype.stringToRegex = function(stringArray, disableWordBoundary){
    var regexString = "";
    var wordBoundary = "\\b";
    if(disableWordBoundary){
        wordBoundary = "";
    }
    for(var i = 0; i < stringArray.length; i++){
        if(regexString.length > 0){ regexString += "|"; }
        regexString += stringArray[i]+wordBoundary;
    }
    return new RegExp(regexString, "g");
};

/**
 * Strip extra spaces, replace duplicates with single space. Remove space at front / end of string
 * @param textString
 * @returns textString
 */
StringHelper.prototype.stripSpaces = function(textString){
    //replace multiple spaces with single space
    textString = textString.replace(/ {2,}/g, " ");
    //remove first/last character if space
    textString = textString.replace(/^\s+|\s+$/g, "");
    return textString;
};

/**
 * PreProcessor object definition. Creates __store object and calls init.
 * @params textString
 */
PreProcessor = function (text){
    //create __store object to store data
    this.__store = {};
    this.__store.originalText = text;
    this.stringHelper = stringHelper();
    this.init();
};

/**
 * init function calling all necessary PreProcessorfunctions
 */
PreProcessor.prototype.init = function(){
    //call function to clean text
    this.textFormat();
    //call function to count words
    this.countStore();
};

/**
 * formats the original text from __store and save as cleantext, cleantextSomeTags en cleanTextNoTags
 */
PreProcessor.prototype.textFormat = function(){
    this.__store.cleanText = this.cleanText(this.__store.originalText);
    this.__store.cleanTextSomeTags = this.stripSomeTags(this.__store.cleanText);
    this.__store.cleanTextNoTags = this.stripAllTags(this.__store.cleanTextSomeTags);
};

/**
 * saves wordcount (all words) and wordcountNoTags (all words except those in tags) in the __store object
 */
PreProcessor.prototype.countStore = function(){
    /*wordcounters*/
    this.__store.wordcount = this.__store.cleanText.split(" ").length;
    this.__store.wordcountNoTags = this.__store.cleanTextNoTags.split(" ").length;
    /*sentencecounters*/
    this.__store.sentenceCount = this.sentenceCount(this.__store.cleanText);
    this.__store.sentenceCountNoTags = this.sentenceCount(this.__store.cleanTextNoTags);
    /*syllablecounters*/
    this.__store.syllablecount = this.syllableCount(this.__store.cleanTextNoTags);
};

/**
 * counts the number of sentences in a textstring by splitting on a period. Removes sentences that are empty or have only a space.
 * @param textString
 */
PreProcessor.prototype.sentenceCount = function(textString){
    var sentences = textString.split(".");
    sentenceCount = 0;
    for (var i = 0; i < sentences.length; i++){
        if(sentences[i] !== "" && sentences[i] !== " "){
            sentenceCount++;
        }
    }
    return sentenceCount;
};

/**
 * counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable counter and advanced syllable counter.
 * @param textString
 * @returns syllable count
 */
PreProcessor.prototype.syllableCount = function(textString) {
    this.syllableCount = 0;
    textString = textString.replace(/[.]/g, " ");
    textString = this.removeWords(textString);
    var words = textString.split(" ");
    var subtractSyllablesRegexp = this.stringHelper.stringToRegex(preprocessorConfig.syllables.subtractSyllables, true);
    var addSyllablesRegexp = this.stringHelper.stringToRegex(preprocessorConfig.syllables.addSyllables, true);
    for (var i = 0; i < words.length; i++){
        this.basicSyllableCount(words[i].split(/[^aeiouy]/g));
        this.advancedSyllableCount(words[i], subtractSyllablesRegexp, "subtract");
        this.advancedSyllableCount(words[i], addSyllablesRegexp, "add");
    }
    return this.syllableCount;
};

/**
 * counts the syllables by splitting on consonants
 * @param splitWordArray
 */

PreProcessor.prototype.basicSyllableCount = function(splitWordArray){
    for (var j = 0; j < splitWordArray.length; j++){
        if(splitWordArray[j].length > 0){
            this.syllableCount++;
        }
    }
};

/**
 * counts the syllables by validating against regexxes, and adding and subtracting the number of matches.
 * @param inputString
 * @param regex
 * @param operator
 */
PreProcessor.prototype.advancedSyllableCount = function(inputString, regex, operator){
    var match = inputString.match(regex);
    if(match !== null){
        if(operator === "subtract"){
            this.syllableCount -= match.length;
        }else if(operator === "add"){
            this.syllableCount += match.length;
        }
    }
};

/**
 * removes words from textstring and count syllables. Used for words that fail against regexes.
 * @param textString
 * @returns textString with exclusionwords removed
 */
PreProcessor.prototype.removeWords = function(textString){
    for (var i = 0; i < preprocessorConfig.syllables.exclusionWords.length; i++){
        var exclusionRegex = new RegExp(preprocessorConfig.syllables.exclusionWords[i].word, "g");
        var matches = textString.match(exclusionRegex);
        if(matches !== null){
            this.syllableCount += preprocessorConfig.syllables.exclusionWords[i].syllables;
            textString = textString.replace(exclusionRegex, "");
        }
    }
    return textString;
};

/**
 * cleans text by removing special characters, numberonly words and replacing all terminators by periods
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.cleanText = function(textString){
    textString = textString.toLocaleLowerCase();
    //replace comma', hyphens etc with spaces
    textString = textString.replace(/[\-\;\:\,\(\)\"\'\|\“\”]/g, " ");
    //remove apostrophe
    textString = textString.replace(/[\’]/g, "");
    //unify all terminators
    textString = textString.replace(/[.?!]/g, ".");
    //add period in case it is missing
    textString += ".";
    //replace newlines with spaces
    textString = textString.replace(/[ ]*(\n|\r\n|\r)[ ]*/g, " ");
    //remove duplicate terminators
    textString = textString.replace(/([\.])[\. ]+/g, "$1");
    //pad sentence terminators
    textString = textString.replace(/[ ]*([\.])+/g, "$1 ");
    //Remove "words" comprised only of numbers
    textString = textString.replace(/[0-9]+[ ]/g, "");
    return this.stringHelper.stripSpaces(textString);
};

/**
 * removes all HTMLtags from input string, except h1-6, li, p and dd
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.stripSomeTags = function(textString){
    //remove tags, except li, p, h1-6, dd
    textString = textString.replace(/<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, " ");
    textString = this.stringHelper.stripSpaces(textString);
    return textString;
};

/**
 * remove all HTMLtags from input string.
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.stripAllTags = function(textString){
    //remove all tags
    textString = textString.replace(/(<([^>]+)>)/ig," ");
    textString = this.stringHelper.stripSpaces(textString);
    return textString;
};
/**
 * inits the analyzerscorer used for scoring of the output from the textanalyzer
 * @constructor
 */
AnalyzeScorer = function(refObj){
    this.__score = [];
    this.refObj = refObj;
    this.init();
};

/**
 * loads the analyzerScoring from the config file.
 */
AnalyzeScorer.prototype.init = function(){
    this.scoring = analyzerScoring;
};

/**
 * Starts the scoring by taking the resultObject from the analyzer and creates a queue based on
 * what results are in the resultobject. Then runs the queue.
 * @param resultObj
 */
AnalyzeScorer.prototype.score = function(resultObj){
    this.resultObj = resultObj;
    this.createResultObject();
    this.scoreQueue = this.createQueue();
    this.runQueue();
};

/**
 * merges the current results with scoring result object
 */
AnalyzeScorer.prototype.createResultObject = function(){
    for (var i = 0; i < this.resultObj.length; i++){
        var currentResult = this.resultObj[i];
        for (var ii = 0; ii < this.scoring.length; ii++){
            if (currentResult.test === this.scoring[ii].scoreName){
                this.scoring[ii].testResult = currentResult.result;
            }
        }
    }
};

/**
 * creates queue based on the loaded scoring config.
 * @returns {Array}
 */
AnalyzeScorer.prototype.createQueue = function(){
    var queueArray = [];

    for( var i = 0; i < this.resultObj.length; i++){
        queueArray.push(this.scoring[i]);
    }
    return queueArray;
};

/**
 * runs the queue and saves the result in the __score-object.
 */
AnalyzeScorer.prototype.runQueue = function(){
    //remove first function from queue and execute it.
    if(this.scoreQueue.length > 0){
        this.currentResult = this.scoreQueue.shift();
        this.__score = this.__score.concat(this[this.currentResult.scoreFunction]());
        this.runQueue();
    }
};

/**
 * returns score of the wordcount, based on the scoreArray in the scoringconfig
 * @returns {{score: number, text: string}}
 */
AnalyzeScorer.prototype.wordCountScore = function(){
    var score = { name: "wordCount", score: 0, text: "" };
    for (var i = 0; i < this.currentResult.scoreArray.length; i++){
        if(this.currentResult.testResult > this.currentResult.scoreArray[i].result){
            score.score = this.currentResult.scoreArray[i].score;
            score.text = this.currentResult.scoreArray[i].text.replace(/<%wordcount%>/,this.currentResult.testResult).replace(/<%recWordcount%>/,this.currentResult.recommendedWordcount);
            return score;
        }
    }
};

/**
 * returns score of the keywordDensity based on the scoreArray in the scoringconfig
 * @returns {{score: number, text: string}}
 */
AnalyzeScorer.prototype.keywordDensityScore = function(){
    var score = { name: "keywordDensity", score: 0, text: "" };
    switch (true) {
        case (this.currentResult.testResult < this.currentResult.scoreObj.min.result):
            score.score = this.currentResult.scoreObj.min.score;
            score.text = this.currentResult.scoreObj.min.text;
            break;
        case (this.currentResult.testResult > this.currentResult.scoreObj.max.result):
            score.score = this.currentResult.scoreObj.max.score;
            score.text = this.currentResult.scoreObj.max.text;
            break;
        default:
            score.score = this.currentResult.scoreObj.default.score;
            score.text = this.currentResult.scoreObj.default.text;
            break;
    }
    score.text = score.text.replace(/<%keywordDensity%>/,this.currentResult.testResult).
                            replace(/<%keywordCount%>/,this.refObj.__store.keywordCount);
    return score;
};

/**
 * returns score of the fleschReading, based on the scoreArray in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.fleschReadingScore = function(){
    var score = { name: "fleschReading", score: 0, text: ""};
    for (var i = 0; i < this.currentResult.scoreArray.length; i++){
        if(this.currentResult.testResult >= this.currentResult.scoreArray[i].result){
            score.text = this.currentResult.scoreText.replace(/<%testResult%>/,this.currentResult.testResult).
                                    replace(/<%scoreUrl%>/,this.currentResult.scoreUrl).
                                    replace(/<%scoreText%>/, this.currentResult.scoreArray[i].text).
                                    replace(/<%note%>/, this.currentResult.scoreArray[i].note);
            score.score = this.currentResult.scoreArray[i].score;
            break;
        }
    }
    return score;
};


/**
 * returns score of the firstParagraph, based on the scoreArray in the scoringconfig
 */
AnalyzeScorer.prototype.firstParagraphScore = function(){
    var score = { name: "firstParagraph", score: 0, text: ""};
    switch (true) {
        case (this.currentResult.testResult === this.currentResult.scoreObj.none.result):
            score.score = this.currentResult.scoreObj.none.score;
            score.text = this.currentResult.scoreObj.none.text;
            break;
        case (this.currentResult.testResult >= this.currentResult.scoreObj.some.result):
            score.score = this.currentResult.scoreObj.some.score;
            score.text = this.currentResult.scoreObj.some.text;
            break;
        default:
        break;
    }
    return score;
};

/**
 * returns score of the metaDescriptionLength, based on the scoreObject in the scoringconfig.
 */
AnalyzeScorer.prototype.metaDescriptionLengthScore = function(){
    var score = { name: "metaDescriptionLength", score: 0, text: "" };
    switch (true) {
        case (this.currentResult.testResult === this.currentResult.scoreObj.none.result):
            score.score = this.currentResult.scoreObj.none.score;
            score.text = this.currentResult.scoreObj.none.text;
            break;
        case (this.currentResult.testResult <= this.currentResult.scoreObj.min.result):
            score.score = this.currentResult.scoreObj.min.score;
            score.text = this.currentResult.scoreObj.min.text.replace(/<%maxCharacters%>/, this.currentResult.metaMaxLength).
                                                              replace(/<%minCharacters%>/, this.currentResult.metaMinLength);
            break;
        case (this.currentResult.testResult >= this.currentResult.scoreObj.max.result):
            score.score = this.currentResult.scoreObj.max.score;
            score.text = this.currentResult.scoreObj.max.text.replace(/<%maxCharacters%>/, this.currentResult.metaMaxLength);
            break;
        default:
            score.score = this.currentResult.scoreObj.default.score;
            score.text = this.currentResult.scoreObj.default.text;
            break;
    }
    return score;
};

/**
 * returns score of the metaDescriptionKeyword, based on the scoreArray in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.metaDescriptionKeywordScore = function(){
    var score = { name: "metaDescriptionKeyword", score: 0, text: "" };
    for (var i = 0; i < this.currentResult.scoreArray.length; i++){
        if(this.currentResult.testResult >= this.currentResult.scoreArray[i].result){
            score.score = this.currentResult.scoreArray[i].score;
            score.text = this.currentResult.scoreArray[i].text;
        }
    }
    return score;
};

/**
 * returns score of the stopwordKeywordCount, based on the scoreArray in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.stopwordKeywordCountScore = function(){
    var score = { name: "stopwordKeywordCount", score: 0, text: "" };
    var stopwordMatches = "";
    if(this.currentResult.testResult.matches !== null) {
        for (var i = 0; i < this.currentResult.testResult.matches.length; i++) {
            if (stopwordMatches.length !== 0) {
                stopwordMatches += ", ";
            }
            stopwordMatches += this.refObj.stringHelper.stripSpaces(this.currentResult.testResult.matches[i]);
        }
    }
    for (var j = 0; j < this.currentResult.scoreArray.length; j++){
        if(this.currentResult.testResult.count >= this.currentResult.scoreArray[j].result) {
            score.score = this.currentResult.scoreArray[j].score;
            score.text = this.currentResult.scoreArray[j].text.replace(/<%url%>/, this.currentResult.scoreUrl).
                                                               replace(/<%stopwords%>/, stopwordMatches);
            break;
        }
    }
    return score;
};

/**
 * returns score of the subheadings, based on the scoreObj in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.subHeadingsScore = function(){
    var score = { name: "subHeadings", score: 0, text: "" };
    switch(true){
        case (this.currentResult.testResult.count === this.currentResult.scoreObj.noHeadings.count):
            score.score = this.currentResult.scoreObj.noHeadings.score;
            score.text = this.currentResult.scoreObj.noHeadings.text;
        break;
        case (this.currentResult.testResult.count >= this.currentResult.scoreObj.headingsKeyword.count && this.currentResult.testResult.matches >= this.currentResult.resultObj.headingsKeyword.matches):
            score.score = this.currentResult.scoreObj.headingsKeyword.score;
            score.text = this.currentResult.scoreObj.headingsKeyword.text.replace(/<%matches%>/,this.currentResult.testResult.matches).
                                                                          replace(/<%count%>/,this.currentResult.testResult.count);
        break;
        case (this.currentResult.testResult.count >= this.currentResult.scoreObj.headingsNoKeyword.count && this.currentResult.testResult.matches === this.currentResult.scoreObj.headingsNoKeyword.matches):
            score.score = this.currentResult.scoreObj.headingsNoKeyword.score;
            score.text = this.currentResult.scoreObj.headingsKeyword.text;
        break;
    }
    return score;
};

/**
 * returns score of the pagetitlelength, based on the scoreobj in the scoreConfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.pageTitleLengthScore = function(){
    var score = { name: "pageTitleLength", score: 0, text: ""};
    switch(true){
        case(this.currentResult.testResult === 0):
            score.score = this.currentResult.scoreObj.noTitle.score;
            score.text = this.currentResult.scoreObj.noTitle.text;
        break;
        case(this.currentResult.testResult < this.currentResult.scoreObj.scoreTitleMinLength):
            score.score = this.currentResult.scoreObj.titleTooShort.score;
            score.text = this.currentResult.scoreObj.titleTooShort.text.replace(/<%length%>/,this.currentResult.testResult).
                                                                        replace(/<%minLength%>/,this.currentResult.scoreObj.scoreTitleMinLength);
        break;
        case(this.currentResult.testResult > this.currentResult.scoreObj.scoreTitleMaxLength):
            score.score = this.currentResult.scoreObj.titleTooLong.score;
            score.text = this.currentResult.scoreObj.titleTooShort.text.replace(/<%length%>/,this.currentResult.testResult).
                                                                        replace(/<%maxLength%>/,this.currentResult.scoreObj.scoreTitleMaxLength);
        break;
        case(this.currentResult.testResult >= this.currentResult.scoreObj.scoreTitleMinLength && this.currentResult.testResult <= this.currentResult.scoreObj.scoreTitleMaxLength):
            score.score = this.currentResult.scoreObj.titleCorrectLength.score;
            score.text = this.currentResult.scoreObj.titlteCorrectLength.text.replace(/<%minLength%>/,this.currentResult.scoreObj.scoreTitleMinLength).
                                                                              replace(/<%maxLength%>/,this.currentResult.scoreObj.scoreTitleMaxLength);
        break;
        default:
        break;
    }
    return score;
};

/**
 * returns score of the pagetitlekeyword, based on the scoreObj in the scoringConfig
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.pageTitleKeywordScore = function(){
    var score = { name: "pageTitleKeyword", score: 0, text: ""};
    switch (true){
        case(this.currentResult.testResult.matches === this.currentResult.scoreObj.keywordMissing.result):
            score.score = this.currentResult.scoreObj.keywordMissing.score;
            score.text = this.currentResult.scoreObj.keywordMissing.text.replace(/<%keyword%>/,this.refObj.config.keyword);
        break;
        case(this.currentResult.testResult.matches >= this.currentResult.scoreObj.keywordBegin.result && this.currentResult.testResult.position <= this.currentResult.scoreTitleKeywordLimit):
            score.score = this.currentResult.scoreObj.keywordBegin.score;
            score.text = this.currentResult.scoreObj.keywordBegin.text;
        break;
        case(this.currentResult.testResult.matches >= this.currentResult.scoreObj.keywordEnd.result && this.currentResult.testResult.position >= this.currentResult.scoreTitleKeywordLimit):
            score.score = this.currentResult.scoreObj.keywordEnd.score;
            score.text = this.currentResult.scoreObj.keywordEnd.text;
        break;
    }
    return score;
};

/**
 * returns the score of the urlkeyword, based on the scoreObj in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.urlKeywordScore = function(){
    var score = { name: "urlKeyword", score: 0, text: ""};
    switch(true){
        case(this.currentResult.testResult >= this.currentResult.scoreObj.urlGood.result):
            score.score = this.currentResult.scoreObj.urlGood.score;
            score.text = this.currentResult.scoreObj.urlGood.text;
        break;
        case(this.currentResult.testResult === this.currentResult.scoreObj.urlMedium.result):
            score.score = this.currentResult.scoreObj.urlMedium.score;
            score.text = this.currentResult.scoreObj.urlMedium.text;
        break;
    }
    return score;
};

/**
 * returns the score of the urlLength, based on the scoreObj in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.urlLengthScore = function(){
    var score = { name: "urlLength", score: 0, text: ""};
    if(this.currentResult.testResult > this.currentResult.maxLength || this.currentResult.testResult > this.currentResult.slugLength + this.refObj.config.keyword.length){
        score.score = this.currentResult.scoreObj.longSlug.score;
        score.text = this.currentResult.scoreObj.longSlug.text;
    }
    return score;
};

/**
 * returns the score of the urlStopwords, based on the scoreObj in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.urlStopwordsScore = function(){
    var score = { name: "urlStopwords", score: 0, text: ""};
    if(this.currentResult.testResult >= this.currentResult.scoreObj.stopwords.result){
        score.score = this.currentResult.scoreObj.stopwords.score;
        score.text = this.currentResult.scoreObj.stopwords.text;
    }
    return score;
};

/**
 * returns the score of the imagecount, based on the scoreObj in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.imageCountScore = function(){
    var score = { name: "imageCount", score: 0, text: ""};
    switch(true){
        case(this.currentResult.testResult.total === this.currentResult.scoreObj.noImages.result):
            score.score = this.currentResult.scoreObj.noImages.score;
            score.text = this.currentResult.scoreObj.noImages.text;
        break;
        case(this.currentResult.testResult.total > this.currentResult.testResult.alt):
            score.score = this.currentResult.scoreObj.noAlt.score;
            score.text = this.currentResult.scoreObj.noAlt.text;
        break;
        case(this.currentResult.testResult.total > this.currentResult.testResult.altKeyword):
            score.score = this.currentResult.scoreObj.altNoKeyword.score;
            score.text = this.currentResult.scoreObj.altNoKeyword.text;
        break;
        case(this.currentResult.testResult.total === this.currentResult.testResult.altKeyword):
            score.score = this.currentResult.scoreObj.altKeyword.score;
            score.text = this.currentResult.scoreObj.altKeyword.text;
        break;
    }
    return score;
};

/**
 * returns the score of the linkCount, based on the scoreobj in the scoringconfig.
 * @returns {{name: string, score: number, text: string}}
 */
AnalyzeScorer.prototype.linkCountScore = function(){
    var score = { name: "linkCount", score: 0, text: ""};
    switch(true){
        case(this.currentResult.testResult.total === this.currentResult.scoreObj.noLinks.result):
            score.score = this.currentResult.scoreObj.noLinks.score;
            score.text = this.currentResult.scoreObj.noLinks.text;
        break;
        case(this.currentResult.testResult.totalKeyword >= this.currentResult.scoreObj.keywordOutboundLink.result):
            score.score = this.currentResult.scoreObj.keywordOutboundLink.score;
            score.text = this.currentResult.scoreObj.keywordOutboundLink.text;
        break;
        case(this.currentResult.testResult.external.dofollow === this.currentResult.testResult.external.total && this.currentResult.testResult.totalKeyword < this.currentResult.scoreObj.linksFollow.result):
            score.score = this.currentResult.scoreObj.linksFollow.score;
            score.text = this.currentResult.scoreObj.linksFollow.text.replace(/<%links%>/, this.currentResult.testResult.external.dofollow);
        break;
        case(this.currentResult.testResult.external.nofollow === this.currentResult.testResult.external.total && this.currentResult.testResult.totalKeyword < this.currentResult.scoreObj.linksNoFollow.result):
            score.score = this.currentResult.scoreObj.linksNoFollow.score;
            score.text = this.currentResult.scoreObj.linksNoFollow.text.replace(/<%links%>/, this.currentResult.testResult.external.nofollow);
        break;
        case(this.currentResult.testResult.external.nofollow < this.currentResult.testResult.external.total && this.currentResult.testResult.external.dofollow < this.currentResult.testResult.external.total && this.currentResult.testResult.totalKeyword < this.currentResult.scoreObj.links.result):
            score.score = this.currentResult.scoreObj.links.score;
            score.text = this.currentResult.scoreObj.links.text.replace(/<%nofollow%>/, this.currentResult.testResult.external.nofollow).
                                                                replace(/<%dofollow%>/, this.currentResult.testResult.external.dofollow);
        break;
        default:
        break;
    }
    return score;
};

/**
 * Checks if the preprocessor is already initialized and if so if the textstring differs from the input.
 * @param inputString
 * @returns {PreProcessor|*|yst_preProcessor}
 */
preProcessor = function(inputString){
    if (typeof yst_preProcessor !== "object" || yst_preProcessor.inputText !== inputString) {
        yst_preProcessor = new PreProcessor(inputString);
    }
    return yst_preProcessor;
};

/**
 * Checks if the stringhelper is already initialized. Returns stringHelper.
 * @returns {StringHelper}
 */
stringHelper = function(){
    if (typeof yst_stringHelper !== "object"){
        yst_stringHelper = new StringHelper();
    }
    return yst_stringHelper;
};