/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.login = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing login view');
    },

    /** submit event for login **/
    events: {
        'submit':                   'login'
    },

    login_home: function() {
        app.routers.router.prototype.index();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());

        /** validate form **/
        this.$("#loginForm").validate({
            rules: {
                username: {
                    required: true,
                    maxlength: 20
                },
                password: {
                    required: true,
                    maxlength: 12
                }
            },
            messages: this.language.form_messages
        });
        return this;
    },

    /** login **/
    login: function (event) {

        event.preventDefault();

        var that = this;
        var jsonObj = this.login_formToJson();

        var _userModel = new app.models.user();

        /** POST LOGIN **/
        _userModel.save(jsonObj, {
            success: function (model) {
                if (model.changed.success){
                    /** save auth token **/
                    app.global.tokensCollection.each(function(model) { model.destroy(); } );
                    var _model = new app.models.token(model.get('user'));
                    app.global.tokensCollection.add(_model);
                    _model.save();

                    app.routers.router.prototype.dashboard();
                }
                else      {
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
            url: app.const.apiurl() + 'login',
            private: false
        });

    },

    /** render login form data to user model **/
    login_formToJson: function() {
        var jsonObj = {};
        jsonObj.username = this.$('#username').val();
        jsonObj.password = this.$('#password').val();
        return jsonObj;
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.loginView = null;
    }

});
