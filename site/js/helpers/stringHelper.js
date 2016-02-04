/**
 * Created by jonathanlu on 1/18/16.
 *
 * Collection of helper functions for string manipulation.
 *
 */

var stringHelper = stringHelper || {};

stringHelper.stopWordsMap = {};

// create an associative array of stop words
(function(){
    // we start with an array for easier declaration
    var stopWords = [
        'and','the','for','with','that','this','can','has','their','your','will','what',
        'ticket','tickets','only','there','here','must','more','need','each','from','other','href','event',
        'bring','about','have','http','where','them','https','com','org','net','me','you','when','before','after',
        'they','find','into','make','come','over','enter','details','events'
    ];

    // then translate the array to the map
    for(i = 0; i < stopWords.length; ++i) {
        stringHelper.stopWordsMap[stopWords[i]] = true;
    }
})();

/**
 * Cleans a string, leaving only the important words.
 * @param str String to be cleaned.
 * @returns {*} The cleaned string.
 */
stringHelper.cleanString = function(str) {

    // helper function to remove special characters from string
    function removeSpecials() {
        var lower = str.toLowerCase();
        var upper = str.toUpperCase();

        var res = "";
        for(var i = 0; i < lower.length; ++i) {
            // if a character is equal uppercase and lowercase then it is a special character
            // exception made for spaces
            if(lower[i] != upper[i] || lower[i].trim() === '')
                res += str[i];
            else
                res += ' ';
        }

        return res;
    }

    cleanString = str;

    // remove all returns
    cleanString = cleanString.replace(/(\r\n|\n|\r)/gm, " ");
    // remove all special characters that aren't easily picked up
    cleanString = removeSpecials(cleanString);
    // remove all 3 letter or less words
    cleanString = cleanString.replace(/(\b(\w{1,3})\b(\W|$))/g, "");
    // convert to all lowercase
    cleanString = cleanString.toLowerCase();

    return cleanString.trim();
};

/**
 * Determines whether the word is a stop word
 * @param str Word to be analyzed.
 * @returns {*} Whether the word is stop word.
 */
stringHelper.isStopWord = function(str) {
    return stringHelper.stopWordsMap[str];
};