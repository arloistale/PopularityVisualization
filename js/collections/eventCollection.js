/**
 * Created by jonathanlu on 1/13/16.
 */

var app = app || {};

var EventCollection = Backbone.Collection.extend({
    model: app.Event,

    url: 'https://www.eventbriteapi.com/v3/events/search/?token=45BOO2PKCJTOCAEC6ZCJ',

    parse: function(response) {
        response = response.events;
        return response;
    },

    // filter for completed todos
    getCompleted: function() {
        return this.filter(function(todo) {
            return todo.get('completed');
        });
    },

    // filter for remaining todos
    getRemaining: function() {
        return this.without.apply(this, this.getCompleted());
    },

    nextOrder: function() {
        if(!this.length)
            return 1;

        return this.last().get('order') + 1;
    },

    comparator: function(todo) {
        return todo.get('order');
    }
});

app.EventCollection = new EventCollection();