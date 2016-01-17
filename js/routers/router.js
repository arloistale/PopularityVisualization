/**
 * Created by jonathanlu on 1/13/16.
 */

var app = app || {};

var Workspace = Backbone.Router.extend({
    routes: {
        '*filter': 'setFilter'
    },

    setFilter: function(param) {
        if(param)
            param = param.trim();

        app.TodoFilter = param || '';

        app.EventCollection.trigger('filter');
    }
});

app.TodoRouter = new Workspace();
Backbone.history.start();