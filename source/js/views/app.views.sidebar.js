/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 08/07/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.sidebar = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing sidebar view');
    },

    /** render template **/
    render: function(str) {
        $(this.el).html(this.template());

        this.$('#link_dashboard').tooltip();
        this.$('#link_profile').tooltip();
        this.$('#link_password').tooltip();
        this.$('#link_report').tooltip();
        this.$('#link_logout').tooltip();

        this.$("#li_" + str).addClass("active");

        return this;
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.sidebarView = null;
    }

});
