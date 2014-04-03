/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 08/07/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.footer = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing footer view');
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());

        this.$('#version').text('V ' + app.const.version);
        return this;
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.footerView = null;
    }

});
