/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 02/05/13
 * Time: 16.45
 * To change this template use File | Settings | File Templates.
 */
app.views.profile = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing profile view');
    },

    /** submit event for update **/
    events: {
        'submit':                           'profile_update',
        'click #deleteProfileButton':       'profile_delete'
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());

        /** validate form **/
        this.$("#profileForm").validate({
            rules: {
                first_name: "required",
                last_name: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: this.language.form_messages
        });
        this.profile_modelToForm();
        return this;
    },

    /** update profile **/
    profile_update: function (event) {
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
                        that.profile_confirm_update();
                    }
                },
                cancel: {
                    label: that.language.cancel_button,
                    className: "btn btn-info"
                }
            }
        });
    },

    /** update profile on confirm **/
    profile_confirm_update: function () {

        var that = this;
        var jsonObj = this.profile_formToJson();

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
    profile_formToJson: function() {
        var jsonObj = {};
        jsonObj.id = this.$('#_id').val();
        jsonObj.first_name = this.$('#first_name').val();
        jsonObj.last_name = this.$("#last_name").val();
        jsonObj.username = this.$('#username').val();
        jsonObj.email = this.$('#email').val();
        return jsonObj;
    },

    /** render user model data to profile form **/
    profile_modelToForm: function() {

        var that = this;

        /** GET USER **/
        var _userModel = new app.models.user();
        _userModel.fetch({
            success: function (model) {
                if (typeof model.get("_id") !== 'undefined') {
                    that.$('#_id').val(model.get("_id"));
                    that.$('#first_name').val(model.get("first_name"));
                    that.$('#last_name').val(model.get("last_name"));
                    that.$('#username').val(model.get("username"));
                    moment.lang(that.language.lang);
                    var r_date = moment(model.get("registration_date")).fromNow();
                    var l_date = moment(model.get("auth").login_date).fromNow();
                    that.$('#registration_date').val(r_date);
                    that.$('#login_date').val(l_date);
                    //that.$('#registration_date').val(model.get("registration_date"));
                    //that.$('#login_date').val(model.get("auth").login_date);
                    that.$('#email').val(model.get("email"));
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

    /** delete profile **/
    profile_delete: function() {

        var that = this;

        bootbox.dialog({
            title: that.language.header_confirm_del_message,
            message: that.language.body_confirm_del_message,
            buttons: {
                confirm: {
                    label: that.language.confirm_button,
                    className: "btn btn-danger",
                    callback: function() {
                        $("body").removeClass("modal-open");
                        that.profile_confirm_delete();
                    }
                },
                cancel: {
                    label: that.language.cancel_button,
                    className: "btn btn-info"
                }
            }
        });
    },

    /** delete profile on confirm **/
    profile_confirm_delete: function() {

        var that = this;
        var jsonObj = this.profile_formToJson();

        var _userModel = new app.models.user(jsonObj);

        /** DELETE USER **/
        _userModel.destroy({
            success: function (model) {
                bootbox.dialog({
                    title: that.language.header_success_del_message,
                    message: that.language.body_success_del_message,
                    buttons: {
                        main: {
                            label: that.language.label_button,
                            className: "btn btn-info",
                            callback: function() {
                                $("body").removeClass("modal-open");
                                /** delete auth token **/
                                app.global.tokensCollection.each(function(model) { model.destroy(); } );
                                app.routers.router.prototype.index();
                            }
                        }
                    }
                });
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

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.profileView = null;
    }
});
