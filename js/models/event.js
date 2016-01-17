/**
 * Created by jonathanlu on 1/13/16.
 */

var app = app || {};

app.Event = Backbone.Model.extend({

    // ensure default key value pairs
    defaults: {
        name: "",
        url: "#",
    },

    parse: function( response ) {
        response.name = response.name.text;
        return response;
    }
});