/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 21/07/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.password = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing password view');
    },

    /** submit event for update **/
    events: {
        'submit':                           'password_update'
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template(this.language));
        $(document).attr('title', 'nodelog - realtime web analytics | ' + this.language.type + ' | ' + this.language.lang);

        /** validate form **/
        this.$("#passwordForm").validate({
            rules: {
                password: {
                    required: true,
                    maxlength: 12
                },
                repassword: {
                    required: true,
                    maxlength: 12,
                    equalTo: "#password"
                }
            },
            messages: this.language.form_messages
        });
        this.password_modelToForm();
        return this;
    },

    /** update password **/
    password_update: function (event) {
        event.preventDefault();

        var that = this;

        bootbox.dialog({
            title: that.language.header_confirm_upd_message,
            message: that.language.body_confirm_upd_message,
            buttons: {
                confirm: {
                    label: that.language.confirm_button,
                    className: "btn btn-success",
                    callback: function() {
                        $("body").removeClass("modal-open");
                        that.password_confirm_update();
                    }
                },
                cancel: {
                    label: that.language.cancel_button,
                    className: "btn btn-info"
                }
            }
        });
    },

    /** update password on confirm **/
    password_confirm_update: function () {

        var that = this;
        var jsonObj = this.password_formToJson();

        //that.$('#myModalConfirm').modal('hide');

        var _userModel = new app.models.user();

        /** PUT USER **/
        _userModel.save(jsonObj, {
            success: function (model) {
                if (model.changed.success){
                    /** save auth token **/
                    app.global.tokensCollection.each(function(model) { model.destroy(); } );
                    var _model = new app.models.token(model.get('user'));
                    app.global.tokensCollection.add(_model);
                    _model.save();

                    bootbox.dialog({
                        title: that.language.header_success_upd_message,
                        message: that.language.body_success_upd_message,
                        buttons: {
                            main: {
                                label: that.language.label_button,
                                className: "btn btn-info",
                                callback: function() {
                                    $("body").removeClass("modal-open");
                                }
                            }
                        }
                    });
                }
                else {
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
            url: app.const.apiurl() + 'user/id/' + jsonObj.id,
            private: true
        });
    },

    /** render user form data to JSON obj **/
    password_formToJson: function() {
        var jsonObj = {};
        jsonObj.id = this.$('#_id').val();
        jsonObj.username = this.$('#username').val();
        jsonObj.password = this.$('#password').val();
        return jsonObj;
    },

    /** render user model data to profile form **/
    password_modelToForm: function() {

        var that = this;

        /** GET USER **/
        var _userModel = new app.models.user();
        _userModel.fetch({
            success: function (model) {
                if (typeof model.get("_id") !== 'undefined') {
                    that.$('#_id').val(model.get("_id"));
                    that.$('#username').val(model.get("username"));
                    console.log(model);
                }
                else    {
                    console.log(model);
                    app.routers.router.prototype.logout();
                }
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
            url: app.const.apiurl() + "user/id/" + app.global.tokensCollection.first().get("_id"),
            private: true
        });
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['password'];
    }

});
