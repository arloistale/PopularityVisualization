/**
 * Created by jonathanlu on 1/13/16.
 *
 * Entry point for the application.
 *
 */

var app = app || {};

// entry function when DOM is loaded
$(function() {
    // start off create app view
    new app.AppView();

    // options for the loading spinner
    var opts = {
        lines: 13,
        length: 28,
        width: 2,
        radius: 42,
        scale: 1,
        corners: 1,
        color: '#fff',
        opacity: 0.25,
        rotate: 0,
        direction: 1,
        speed: 1,
        trail: 60,
        fps: 20,
        zIndex: 2e9,
        className: 'spinner',
        top: '50%',
        left: '50%',
        shadow: false,
        hwaccel: false,
        position: 'relative'
    };

    // initialize loading spinner and prepare listeners for Backbone ajax calls to show loading spinner
    $("#loading").spin(opts);

    var main = $(document);
    main.ajaxStart(function() {
        $('#loading').fadeIn();
    });
    main.ajaxComplete(function() {
        $('#loading').fadeOut();
    });
});