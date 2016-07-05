/**
 * Created by jonathanlu on 1/13/16.
 *
 * Defines a collection of events requested from Eventbrite.
 * Maintains d3 friendly score maps from the names and descriptions of each event
 *
 */

var app = app || {};

(function() {

    // private variables and functions are defined before the collection

    // url for API endpoint, possibly could be placed in a more private location
    var mUrl = 'https://www.eventbriteapi.com/v3/events/search/?token=L6FSQTJPYTTIAVYDRDB6';

    /**
     * Helper function to build d3 friendly tf-idf score map with pairs of words and scores
     * @returns {Array.<T>|*} d3 friendly map of word / tf-idf score pairs
     */
    var getScoreMap = function(strings) {
        // we loop through all strings accumulating a cumulative tf-idf scoring for each word in strings
        // for each string we calculate the score of each word in the string,
        // we toss these into a map of word / score pairs

        // tf idf scores for all
        var scores = {};

        // occurrences of each word over all strings
        var occurrences = {};

        var numStrings = strings.length;

        // first sort the given strings based on length
        // the thinking here is that shorter strings perform worse for tf-idf
        // so we use the shorter strings to "train" tf-idf and later on use the rest as the meat
        strings.sort(function(t, e) {
            return (t ? t.length : 0) - (e ? e.length : 0);
        });

        var maxStringLength = strings[strings.length - 1].length;

        var cleanString, words;
        var word, i, j;
        for(i = 0; i < strings.length; i++) {
            if(!strings[i])
                continue;

            // obtain a scoring modifier for tf-idf score from the ratio between this string length and max string length
            // we should care less about tf-idf scores from shorter strings because they do not tell us as much
            var scoringModifier = strings[i].length / maxStringLength;

            // tf scores for each word
            var tfScores = {};

            // clean the string, then split it into words
            cleanString = stringHelper.cleanString(strings[i]);
            words = cleanString.split(/\s+/);

            var numWords = words.length;

            // for each word we ensure the words are not trivial
            // then we add the tf for this word
            for (j = 0; j < numWords; j++) {
                word = words[j];

                // make sure the word isn't a stop word
                if(stringHelper.isStopWord(word))
                    continue;

                tfScores[word] = tfScores[word] || 0;
                tfScores[word] += 1 / numWords;
            }

            // first update occurrences for each word
            // then compute tf-idf scores for each word so far and add it to the scores object
            // this means that we have a training dynamic going on,
            // where the precision of our tf-idf will be terrible but should pick up as more
            // documents are analyzed
            // the current thinking process is to compensate for this by placing less scoring emphasis
            // for strings of shorter length

            for(var term in tfScores) {
                occurrences[term] = occurrences[term] || 0;
                occurrences[term]++;

                var idf = Math.log(numStrings / (1 + occurrences[term]));

                var scoreToAdd = tfScores[term] * idf * scoringModifier;

                scores[term] = (scores[term] + scoreToAdd) || 0;
            }
        }

        // translate the word / count associative array that we have made
        // to d3 friendly map containing descending sorted word / count pairs
        var numScores = _.size(scores);
        var scoreMap = d3.entries(scores).sort(function(t, e) {
            return e.value - t.value;
        }).slice(0, Math.min(50, numScores));

        return scoreMap;
    };

    /**
     * EventCollection defines collection of events requested from Eventbrite.
     */
    var EventCollection = Backbone.Collection.extend({

        model: app.Event,
        url: mUrl,

        // sorted d3 friendly tf-idf score maps of words for names and descriptions from each event
        namesScoreMap: {},
        descriptionsScoreMap: {},

        /**
         * Defines how to translate from Eventbrite API data to collection of events
         * @param response The list of events from Eventbrite.
         * @returns The translated list of events.
         */
        parse: function(response) {
            response = response.events;
            return response;
        },

        /**
         * Build d3 friendly score map of words from each events' name.
         */
        calculateNameKeywordScores: function() {
            this.namesScoreMap = getScoreMap(this.pluck('name'));
        },

        /**
         * Build d3 friendly score map of words from each events' descriptions.
         */
        calculateDescriptionKeywordScores: function() {
            this.descriptionsScoreMap = getScoreMap(this.pluck('description'));
        }
    });

    app.EventCollection = new EventCollection();
})();
