/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 08/07/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.navbar = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing navbar view');
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());

        this.$('#link_cerca').tooltip();
        this.$('#link_project').tooltip();
        this.$('#link_credits').tooltip();
        this.$('#link_help').tooltip();
        this.$('#link_login').tooltip();
        this.$('#link_registrazione').tooltip();
        this.$('#link_profile').tooltip();
        this.$('#link_report').tooltip();
        this.$('#link_esci').tooltip();

        this.$('#lang_a_' + this.language.lang).html('<span class="label label-danger">' + this.language.lang + '</span>');

        if (app.global.tokensCollection.length == 0) {
            this.$('#ul_login').show();
            this.$('#ul_logout').hide();
        }
        else {
            this.$('#ul_login').hide();
            this.$('#ul_logout').show();
        }
        return this;
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['navbar'];
    }

});
