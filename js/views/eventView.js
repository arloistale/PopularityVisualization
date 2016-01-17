/**
 * Created by jonathanlu on 1/13/16.
 */

var app = app || {};

app.TodoView = Backbone.View.extend({
    // selector targeting li tag
    // NOTE: we use tagname now to specify that an li is the element that the view will be using
    tagName: 'li',

    // statistics template, constructor from Underscore
    template: _.template($('#item-template').html()),

    // event delegates
    events: {
        'dblclick label': 'onEdit',
        'keypress .edit': 'onEnterPressed',
        'blur .edit': 'onClose',
        'click .toggle': 'onToggleCompleted',
        'click .destroy': 'onDestroy'
    },

    initialize: function() {
        // listen for changes to associated todo model and rerendering changes
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    render: function() {
        // we can use $el now to refer to the li that was made
        this.$el.html(this.template(this.model.attributes));
        //this.$el.toggleClass('completed', this.model.get('completed'));
        this.$input = this.$('.edit');
        return this;
    },

    toggleVisible: function() {
        this.$el.toggleClass('hidden', this.isHidden());
    },

    // event callbacks

    // when user double clicks on title allow editing
    onEdit: function() {
        this.$el.addClass('editing');
        this.$input.focus();
    },

    // submit for edit when closed
    onClose: function() {
        var value = this.$input.val().trim();

        if(value) {
            this.model.save({ title: value });
        }

        this.$el.removeClass('editing');
    },

    // submit for edit when enter pressed
    onEnterPressed: function(event) {
        if(event.which != ENTER_KEY)
            return;

        this.onClose();
    },

    // toggle whether the todo has been completed
    onToggleCompleted: function(event) {
        this.model.toggle();
    },

    // remove the todo
    onDestroy: function() {
        this.model.destroy();
    },

    // helpers
    isHidden: function() {
        var isCompleted = this.model.get('completed');
        return (!isCompleted && app.TodoFilter == 'completed') ||
            (isCompleted && app.TodoFilter == 'active');
    }
});