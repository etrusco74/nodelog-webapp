/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 21/07/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.admedium = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing admedium view');
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        return this;
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['admedium'];
    }

});
