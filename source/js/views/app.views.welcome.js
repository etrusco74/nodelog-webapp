/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
app.views.welcome = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing welcome view');
    },

    /** welcome event **/
    events: {

    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template({name :  app.global.tokensCollection.at(0).get("first_name")}));
        return this;
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['welcome'];
    }

});
