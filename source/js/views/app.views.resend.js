/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 21/07/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.resend = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing resend view');
    },

    /** submit event for update **/
    events: {
        'submit':                           'resend_password'
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        /** validate form **/
        this.$("#resendForm").validate({
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            messages: this.language.form_messages
        });
        return this;
    },

    /** resend password **/
    resend_password: function (event) {
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
                        that.resend_confirm_password();
                    }
                },
                cancel: {
                    label: that.language.cancel_button,
                    className: "btn btn-info"
                }
            }
        });

    },

    /** resend password on confirm **/
    resend_confirm_password: function () {

        var that = this;
        var jsonObj = {};
        jsonObj.id = '1'; //force to 1 for generate PUT request
        jsonObj.email = that.$('#email').val();

        //that.$('#myModalConfirm').modal('hide');

        var _userModel = new app.models.user();

        /** PUT USER **/
        _userModel.save(jsonObj, {
            success: function (model) {
                if (model.changed.success) {
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
            url: app.const.apiurl() + 'user/resetpwd/email/' + jsonObj.email,
            private: false
        });
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['resend'];
    }

});
