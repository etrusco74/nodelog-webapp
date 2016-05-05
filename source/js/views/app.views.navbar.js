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
        $(this.el).html(this.template(this.language));
        $(document).attr('title', 'nodelog - realtime web analytics | ' + this.language.type + ' | ' + this.language.lang);

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

            this.site_renderSitesCollectionToUl();
        }
        return this;
    },

    /** render previous site model data to ul **/
    site_renderSitesCollectionToUl: function () {

        var that = this;
        var _sitesCollection = new app.collections.sites();

        /** GET SITES **/
        _sitesCollection.fetch({
            success : function(){
                if (typeof _sitesCollection.models[0].get("_id") !== 'undefined') {
                    console.log(_sitesCollection.models); // => collection have been populated
                    $('#siteListNav li').remove();
                    for( var i=0 in _sitesCollection.models ) {
                        $('#siteListNav').append('<li><a href="#' + that.language.lang	 + '/dashboard/' + _sitesCollection.models[i].get("client_id") + '" id="' + _sitesCollection.models[i].get("_id") + '"> ' + _sitesCollection.models[i].get("tag") + '</a></li>');
                    }
                }
                else {
                    $('#siteList li').remove();
                    $('#siteList').append('<li>' + that.language.no_site_desc + '</li>');
                }
            },
            error: function(model, response){
                bootbox.dialog({
                    title: that.language.error_message_type,
                    message: that.language.error_message_type,
                    buttons: {
                        main: {
                            label: that.language.label_button,
                            className: "btn btn-danger",
                            callback: function() {
                                $("body").removeClass("modal-open");
                            }
                        }
                    }
                });
            },
            url: app.const.apiurl() + "sites/username/" + app.global.tokensCollection.at(0).get("username"),
            private: true
        });

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
