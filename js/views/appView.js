/**
 * Created by jonathanlu on 1/13/16.
 */

var app = app || {};

app.AppView = Backbone.View.extend({
    // selector targeting todoapp section
    // NOTE: here we use el since the element already exists in HTML
    el: '#todoapp',

    // statistics template, constructor from Underscore
    statsTemplate: _.template($('#stats-template').html()),

    // event delegates
    events: {
        'keypress #new-todo': 'onEnterPressed',
        'click #clear-completed': 'onClearCompleted',
        'click #toggle-all': 'onToggleAllCompleted'
    },

    initialize: function() {
        // this.$ finds elements relative to $el
        this.toggleAll = this.$('#toggle-all')[0];
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('main');

        this.listenTo(app.EventCollection, 'add', this.addTodo);
        this.listenTo(app.EventCollection, 'all', this.render);
        this.listenTo(app.EventCollection, 'change:completed', this.filterEvent);
        this.listenTo(app.EventCollection, 'filter', this.filterAll);

        app.EventCollection.fetch({ data: $.param({
            q: 'Europe',
            popular: true,
            sort_by: 'best'
        }) });
    },

    render: function() {
        var completed = app.EventCollection.getCompleted().length;
        var remaining = app.EventCollection.getRemaining().length;

        this.toggleAll.checked = !remaining;

        if(app.EventCollection.length) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));

            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="#/' + (app.TodoFilter || '') + '"]')
                .addClass('selected');

        } else {
            this.$main.hide();
            this.$footer.hide();
        }
    },

    // add todo to the list render
    addTodo: function(todo) {
        var view = new app.TodoView({ model: todo });
        $('#todo-list').append(view.render().el);
    },

    filterEvent: function(todo) {
        todo.trigger('visible');
    },

    filterAll: function() {
        app.EventCollection.each(this.filterEvent, this);
    },

    // event callbacks
    onEnterPressed: function(event) {
        if(event.which != ENTER_KEY || !this.$input.val().trim())
            return;

        app.EventCollection.create({
            title: this.$input.val().trim(),
            completed: false
        });
        this.$input.val('');
    },

    onToggleAllCompleted: function() {
        var completed = this.toggleAll.checked;

        app.EventCollection.each(function(todo) {
            todo.save({ completed: completed })
        });
    },

    onClearCompleted: function() {
        _.invoke(app.EventCollection.getCompleted(), 'destroy');
        return false;
    }
});