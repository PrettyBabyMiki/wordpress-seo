/**
 * Text Analyzer, accepts args for config and
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

    //init preprocessor if not exists
    if (typeof yst_pp != 'object' || yst_pp.inputText != this.config.textString) {
        yst_pp = new PreProcessor(this.config.textString);
    }
    //if no available function queues, make new queue
    if (typeof this.queue != 'Array') {
        this.queue = [];
    }
    //if custom queue available load queue, otherwise load default queue.
    if(typeof this.config.queue != 'undefined' && this.config.queue.length != 0){
        this.queue = this.config.queue;
    }else{
        this.queue = ['keywordDensity', 'subheaderChecker', 'stopwordChecker'];
    }
    //if no available keywords, load default array
    if(typeof this.config.wordsToRemove == 'undefined'){
        this.config.wordsToRemove =  analyzerConfig.wordsToRemove;
    }
    if(typeof this.config.stopWords == 'undefined'){
        this.config.stopWords = analyzerConfig.stopWords;
    }
    //set default variables
    this.keywordRegex = new RegExp(this.config.keyword);
    this._output = [];
}

/**
 * starts queue of functions executing the analyzer functions untill queue is empty.
 */
Analyzer.prototype.runQueue = function(){
    //remove first function from queue and execute it.
    if(this.queue.length > 0){
        this._output.push(this[this.queue.shift()]());
        this.runQueue();
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
 * checks the keyword density of given keyword against the cleantext stored in _store.
 * @returns resultObject
 */
Analyzer.prototype.keywordDensity = function(){
    if(yst_pp._store.wordcount >= 100) {
        var keywordMatches = yst_pp._store.cleanText.match(new RegExp(this.config.keyword, 'g'));
        if ( keywordMatches != null ) {
            var keywordCount = keywordMatches.length;
            var keywordDensity = (keywordCount / yst_pp._store.wordcount - (keywordCount - 1 * keywordCount)) * 100;
        } else {
            var keywordDensity = 0;
        }
        switch (true) {
            case (keywordDensity < 1):
                var rating =  4;
                break;
            case (keywordDensity > 4.5):
                var rating = -50;
                break;
            default:
                var rating = 9;
                break;
        }
        result = {name: 'keywordDensity', result: {keywordDensity: keywordDensity.toFixed(1) }, rating: rating};
    }else{
        result = {name: 'keywordDensity', result: null, rating: null};
    }
    return result;
};

/**
 * checks if keywords appear in subheaders of stored cleanTextSomeTags text.
 * @returns resultObject
 */
Analyzer.prototype.subheaderChecker = function() {

    //regex for headers
    var headers = yst_pp._store.cleanTextSomeTags.match(/<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/g);
    if(headers == null){
        result = {name: 'subHeadings', result: null, rating: 7};
    }else {
        var foundInHeader = 0;
        for (var i = 0; i < headers.length; i++) {
            var formattedHeaders = this.stringReplacer(headers[i], this.config.wordsToRemove);
            if (formattedHeaders.match(new RegExp(this.config.keyword, 'g')) || headers[i].match(new RegExp(this.config.keyword, 'g'))) {
                foundInHeader++;
            }
        }
        if (foundInHeader > 0) {
            var result = {keywordFound: foundInHeader, numberofHeaders: headers.length};
            var rating = 9;
        }else{
            var result = {keywordFound: 0, numberofHeaders: headers.length}
            var rating = 7;
        }
        result = {name: 'subHeadings', result: result, rating: rating};
    }
    return result;
};

/**
 * check if the keyword contains stopwords
 */
Analyzer.prototype.stopwordChecker = function(){
    matches = this.stringCounter(this.config.keyword, this.config.stopWords);
    result = {name: 'stopWords', result: {count: matches.length, matches: matches}, rating:5 };
    return result;
}

/**helper functions*/

/**
 * removes strings from array and replaces them with keyword.
 * @param textString
 * @param stringsToRemove []
 * @param replacement (default == space)
 * @returns {textString}
 */
Analyzer.prototype.stringReplacer = function(textString, stringsToRemove, replacement){
    if(typeof replacement == 'undefined'){replacement = ' '};
    textString = textString.replace(this.regexStringBuilder(stringsToRemove), replacement);
    return yst_pp.stripSpaces(textString);
}

/**
 * matches string with given array of strings to match.
 * @param textString
 * @param stringsToMatch
 * @returns {matches}
 */
Analyzer.prototype.stringCounter = function(textString, stringsToMatch){
    return textString.match(this.regexStringBuilder(stringsToMatch));
}

/**
 * builds regex from array with strings
 * @param stringArray
 * @returns {RegExp}
 */
Analyzer.prototype.regexStringBuilder = function(stringArray){
    var regexString = '';
    for(var i = 0; i < stringArray.length; i++){
        if(regexString.length > 0){ regexString += '|'; }
        regexString += '('+stringArray[i]+')\\b';
    }
    return new RegExp(regexString, 'g');
}


/**
 * PreProcessor object definition. Creates _store object and calls init.
 */
PreProcessor = function (text){
    //create _store object to store data
    this._store = {};
    this._store.origText = text;
    this.init();
};

/**
 * init function calling all necessary PreProcessorfunctions
 */
PreProcessor.prototype.init = function(){
    //call function to clean text
    this.textFormatter();
    //call function to count words
    this.wordcount();
};

/**
 * formats the original text form _store and save as cleantext, cleantextSomeTags en cleanTextNoTags
 */
PreProcessor.prototype.textFormatter = function(){
    this._store.cleanText = this.cleanText(this._store.origText);
    this._store.cleanTextSomeTags = this.stripSomeTags(this._store.cleanText);
    this._store.cleanTextNoTags = this.stripAllTags(this._store.cleanTextSomeTags);
};

/**
 * saves wordcount (all words) and wordcountNoTags (all words except those in tags) in the _store object
 */
PreProcessor.prototype.wordcount = function(){
    this._store.wordcount = this._store.cleanText.split(' ').length;
    this._store.wordcountNoTags = this._store.cleanTextNoTags.split(' ').length;
};

/**
 * cleans text by removing special characters, numberonly words and replacing all terminators by periods
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.cleanText = function(textString){
    textString = textString.toLocaleLowerCase();
    //replace comma', hyphens etc with spaces
    textString = textString.replace(/[-;:,()"'|“”]/g, ' ');
    //unify all terminators
    textString = textString.replace(/[.?!]/g, '.');
    //add period in case it is missing
    textString += '.';
    //replace newlines with spaces
    textString = textString.replace(/[ ]*(\n|\r\n|\r)[ ]*/g, ' ');
    //remove duplicate terminators
    textString = textString.replace(/([\.])[\. ]+/g, '$1');
    //pad sentence terminators
    textString = textString.replace(/[ ]*([\.])+/g, '$1 ');
    //Remove "words" comprised only of numbers
    textString = textString.replace(/[0-9]+[ ]/g, '');
    return this.stripSpaces(textString);
};

/**
 * removes all HTMLtags from input string, except h1-6, li, p and dd
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.stripSomeTags = function(textString){
    //remove tags, except li, p, h1-6, dd
    textString = textString.replace(/\<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, " ");
    textString = this.stripSpaces(textString);
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
    textString = this.stripSpaces(textString);
    return textString;
};
/**
 * Strip extra spaces, replace duplicates with single space. Remove space at front / end of string
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.stripSpaces = function(textString){
    //replace multiple spaces with single space
    textString = textString.replace(/ {2,}/g, ' ');
    //remove first/last character if space
    textString = textString.replace(/^\s+|\s+$/g, '');
    return textString;
};