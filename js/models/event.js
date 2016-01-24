/**
 * Created by jonathanlu on 1/13/16.
 *
 * Defines an event requested from Eventbrite.
 *
 */

var app = app || {};

app.Event = Backbone.Model.extend({

    defaults: {
        name: "",
        url: "#",
        description: ""
    },

    parse: function( response ) {
        response.name = response.name.text;
        response.description = response.description.text;
        return response;
    }
});