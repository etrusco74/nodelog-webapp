/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.registration = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing registration view');
    },

    /** submit event for registration **/
    events: {
        'submit':                           'registration',
        'click #btnRegistrationHome':       'registration_home'
    },

    registration_home: function() {
        app.routers.router.prototype.index();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template(this.language));
        $(document).attr('title', 'nodelog - realtime web analytics | ' + this.language.type + ' | ' + this.language.lang);

        $.validator.addMethod("check_username", function(value, element) {
            return this.optional(element) || value.match(/^[a-zA-Z0-9._-]+$/);
        });

        $.validator.addMethod("check_password", function(value, element) {
            return this.optional(element) || value.match(/^[a-zA-Z0-9@!$%._-]+$/);
        });

        /** validate form **/
        this.$("#registrationForm").validate({
            rules: {
                first_name: "required",
                last_name: "required",
                username: {
                    required: true,
                    check_username: true,
                    maxlength: 20,
                    minlength: 3
                },
                password: {
                    required: true,
                    check_password: true,
                    maxlength: 12,
                    minlength: 4
                },
                repassword: {
                    required: true,
                    maxlength: 12,
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                agree: "required"
            },
            messages: this.language.form_messages
        });
        return this;
    },

    /** registration **/
    registration: function (event) {
        event.preventDefault();

        var that = this;
        var jsonObj = this.registration_formToJson();

        var _userModel = new app.models.user();

        /** POST USER **/
        _userModel.save(jsonObj, {
            success: function (model) {
                if (model.changed.success){
                    bootbox.dialog({
                        title: that.language.header_registration_message,
                        message: that.language.body_registration_message,
                        buttons: {
                            main: {
                                label: that.language.label_button,
                                className: "btn btn-info",
                                callback: function() {
                                    $("body").removeClass("modal-open");
                                    app.routers.router.prototype.index();
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
            url: app.const.apiurl() + 'user',
            private: false
        });
    },

    /** render user form data to JSON obj **/
    registration_formToJson: function() {
        var jsonObj = {};
        jsonObj.first_name = this.$('#first_name').val();
        jsonObj.last_name = this.$("#last_name").val();
        jsonObj.username = this.$('#username').val();
        jsonObj.password = this.$('#password').val();
        jsonObj.email = this.$('#email').val();
        return jsonObj;
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['registration'];
    }
});
