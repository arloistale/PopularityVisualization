/**
 * Created by jonathanlu on 1/13/16.
 *
 * Defines the main single view for the application.
 *
 */

var ENTER_KEY = 13;

var app = app || {};

app.AppView = Backbone.View.extend({
    el: '#app',

    // options bar template
    // we could just simply put this into the html but
    // for scalability we keep a template (in case we want, for example, to add stats to the bar)
    optionsTemplate: _.template($('#options-template').html()),

    // event callbacks
    events: {
        'keypress #search': 'onKeyPressed'
    },

    initialize: function() {
        this.$input = this.$('#search');
        this.$options = this.$('#options');

        // redraw the word cloud on window resize
        var that = this;

        $(window).resize(function() {
            that.visualizeFrequencies();
        });

        this.listenTo(app.EventCollection, 'all', this.render);
        this.listenTo(app.EventCollection, 'filter', this.onFilter);

        this.fetchEvents();
    },

    render: function() {
        this.$options.html(this.optionsTemplate());

        this.$('#filters li a')
            .removeClass('selected')
            .filter('[href="#/' + (app.EventFilter || '') + '"]')
            .addClass('selected');
    },

    /**
     * Fetches events from API into event collection, then prepares
     * frequency data for visualization in word cloud.
     * @param query Specific query for the events to pull from API.
     */
    fetchEvents: function(query) {
        var that = this;

        // fetch events then calculate word frequencies, then word cloud the frequencies
        app.EventCollection.fetch({ data: $.param({
            q: query,
            popular: true,
            sort_by: 'best'
        }) }).done(function() {
            app.EventCollection.calculateNameFrequencies();
            app.EventCollection.calculateDescriptionFrequencies();

            that.visualizeFrequencies();
        });
    },

    /**
     * Attempt to prepare the word cloud by grabbing the appropriate frequencies
     * based on whether filtering for Names or Descriptions.
     * Calls onDrawCloud when word cloud has been prepared for rendering.
     */
    visualizeFrequencies: function() {
        // d3 visualizations
        var frequencyMap;

        // determine whether we want to draw names word cloud or descriptions word cloud
        switch(app.EventFilter) {
            case 'descriptions':
                frequencyMap = app.EventCollection.descriptionsFrequencyMap;
                break;
            default:
                frequencyMap = app.EventCollection.namesFrequencyMap;
        }

        if(!frequencyMap || !frequencyMap.length)
            return;

        // we use the first value in the sorted frequency map as the max value
        var maxValue = frequencyMap[0].value;

        // translate frequency map to d3 data format, size is based on word counts
        var cloudWords = frequencyMap.map(function(pair) {
            // for each element in the frequency map we normalize the current value based on max value for the size
            return { text: pair.key, size: 10 + pair.value / maxValue * 90 }
        });

        // build the word cloud data from d3 data format
        d3.layout.cloud().size([$(window).width(), $(window).height()])
            .words(cloudWords)
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", this.onDrawCloud)
            .start();
    },

    /**
     * Called when word cloud is ready to render.
     */
    onDrawCloud: function(words) {
        var width = $(window).width();
        var height = $(window).height();

        // remove the old word cloud
        d3.select("svg").remove();

        // draw the new cloud from given data
        var fill = d3.scale.category20();

        d3.select("#cloud").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    },

    // event callbacks

    /**
     * Whenever we choose new word cloud option filter we render the word cloud again
     */
    onFilter: function() {
        this.visualizeFrequencies();
    },

    /**
     * When we enter is pressed in the search text field we rebuild
     * word cloud from the query that was typed. We also unfocus the text field.
     */
    onKeyPressed: function(event) {
        if(event.which != ENTER_KEY || !this.$input.val().trim())
            return;

        // get query from text field
        var query = this.$input.val().trim();
        // initialize a new query for eventbrite events so we can rebuild the cloud
        this.fetchEvents(query);

        this.$input.blur();
    }
});