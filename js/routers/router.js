/**
 * Created by jonathanlu on 1/13/16.
 *
 * We use routes to define filters for which type of visualization to display.
 *
 */

var app = app || {};

var Workspace = Backbone.Router.extend({

    routes: {
        '*filter': 'setFilter'
    },

    /**
     * Sets filter on which type of visualization to display for events based on parameters.
     * @param param
     */
    setFilter: function(param) {
        if(param)
            param = param.trim();

        app.EventFilter = param || '';

        app.EventCollection.trigger('filter');
    }
});

app.EventRouter = new Workspace();
Backbone.history.start();