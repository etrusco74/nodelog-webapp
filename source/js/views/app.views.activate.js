/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 21/07/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.activate = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing activate view');
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        return this;
    },

    /** render template **/
    init_activate: function(id, apiKey) {
        //alert("activate _id " + id+ " apikey " + apiKey);

        var that = this;

        var jsonObj = {};
        jsonObj.id = id;

        var _userModel = new app.models.user();

        /** PUT USER **/
        _userModel.save(jsonObj, {
            success: function (model) {
                if (model.changed.success){
                    bootbox.dialog({
                        title: that.language.header_activate_message,
                        message: that.language.body_activate_message,
                        buttons: {
                            main: {
                                label: that.language.label_button,
                                className: "btn btn-info",
                                callback: function() {
                                    $("body").removeClass("modal-open");
                                    app.routers.router.prototype.login();
                                }
                            }
                        }
                    });
                }
                else  {
                    bootbox.dialog({
                        title: that.language.error_message,
                        message: that.language.error_message + ' : ' + model.changed.error,
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
                }
                console.log(model);
                console.log(model.changed);
            },
            error: function(response){
                bootbox.dialog({
                    title: that.language.error_message,
                    message: that.language.error_message,
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
                console.log(response);
            },
            url: app.const.apiurl() + 'user/activate/id/' + id + '/key/' + apiKey,
            private: false
        });

    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['activate'];
    }

});
