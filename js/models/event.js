/**
 * Created by jonathanlu on 1/13/16.
 *
 * Defines an event requested from Eventbrite.
 *
 */

var app = app || {};

app.Event = Backbone.Model.extend({

    // properties of the event
    defaults: {
        name: "",
        url: "#",
        description: ""
    },

    /**
     * Determines how Eventbrite event model should be translated to Backbone event model
     * @param response The event model response from API call.
     * @returns {*} The translated event model.
     */
    parse: function( response ) {
        response.name = response.name.text;
        response.description = response.description.text;
        return response;
    }
});