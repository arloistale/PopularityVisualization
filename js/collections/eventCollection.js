/**
 * Created by jonathanlu on 1/13/16.
 *
 * Defines a collection of events requested from Eventbrite.
 * Maintains d3 friendly frequency maps from the names and descriptions of each event
 *
 */

var app = app || {};

var EventCollection = Backbone.Collection.extend({
    model: app.Event,
    url: 'https://www.eventbriteapi.com/v3/events/search/?token=45BOO2PKCJTOCAEC6ZCJ',

    // sorted frequency maps of words for names and descriptions from each event
    namesFrequencyMap: {},
    descriptionsFrequencyMap: {},

    parse: function(response) {
        response = response.events;
        return response;
    },

    /**
     * Build d3 friendly frequency map of words from each events' name.
     */
    calculateNameFrequencies: function() {
        this.namesFrequencyMap = this.getFrequencyMap(this.pluck('name'));
    },

    /**
     * Build d3 friendly frequency map of words from each events' descriptions.
     */
    calculateDescriptionFrequencies: function() {
        this.descriptionsFrequencyMap = this.getFrequencyMap(this.pluck('description'));
    },

    /**
     * Build d3 friendly frequency map of words from list of strings.
     * @returns {Array.<T>|*} d3 friendly map of word / count pairs
     */
    getFrequencyMap: function(strings) {
        // for each event we calculate the frequency of each word in the string,
        // we toss these frequencies into a map of key / count pairs

        var frequencies = {};

        var cleanString, words;
        var word, i, j;
        for(i = 0; i < strings.length; i++) {
            if(!strings[i])
                continue;

            // clean the string, then split it into words
            cleanString = stringHelper.cleanString(strings[i]);
            words = cleanString.trim().split(/\s+/);

            // for each word we ensure the words are not trivial
            // then we increment the count for that word in the frequency associative array
            for (j = 0; j < words.length; j++) {
                word = words[j];

                // make sure the word isn't a trivial word
                if(stringHelper.isTrivialWord(word))
                    continue;

                frequencies[word] = frequencies[word] || 0;
                frequencies[word]++;
            }
        }

        // translate the word / count associative array that we have made
        // to d3 friendly map containing word / count pairs
        var numFrequencies = _.size(frequencies);
        return d3.entries(frequencies).sort(function(t, e) {
            return e.value - t.value;
        }).slice(0, Math.min(100, numFrequencies));
    }
});

app.EventCollection = new EventCollection();