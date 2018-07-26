/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 30/04/14
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
app.views.site = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing site view');
    },

    /** submit event for registration **/
    events: {
        'submit':                         'site',
        'click #deleteSiteButton':        'site_delete',
        'click #siteList a':              'site_id',
        'click #newSiteButton':           'site_new'
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template(this.language));
        $(document).attr('title', 'nodelog - realtime web analytics | ' + this.language.type + ' | ' + this.language.lang);

        this.site_renderSitesCollectionToUl();

        /** validate form **/
        this.$("#siteForm").validate({
            rules: {
                tag: "required",
                website: {
                    required: true,
                    url: true
                }
            },
            messages: this.language.form_messages
        });

        return this;
    },

    /** event - insert site **/
    site: function (event) {
        event.preventDefault();

        var that = this;

        bootbox.dialog({
            title: that.language.header_confirm_ins_message,
            message: that.language.body_confirm_ins_message,
            buttons: {
                confirm: {
                    label: that.language.confirm_button,
                    className: "btn btn-success",
                    callback: function() {
                        that.site_confirm();
                        $("body").removeClass("modal-open");
                    }
                },
                cancel: {
                    label: that.language.cancel_button,
                    className: "btn btn-info",
                    callback: function() {
                        $("body").removeClass("modal-open");
                    }
                }
            }
        });
    },

    /** event - insert or update site on confirm **/
    site_confirm: function () {

        var that = this;
        var jsonObj = this.site_formToJson();

        var _siteModel = new app.models.site();

        var site_url = app.const.apiurl() + 'site';
        if (typeof jsonObj.id !== 'undefined')  {
            ((jsonObj.id) != '') ? site_url = site_url + '/id/' + jsonObj.id : site_url;
        }
        /** POST SITE **/
        _siteModel.save(jsonObj, {
            success: function (model) {
                if (model.changed.success){
                    bootbox.dialog({
                        title: that.language.header_success_ins_message,
                        message: that.language.body_success_ins_message,
                        buttons: {
                            main: {
                                label: that.language.label_button,
                                className: "btn btn-info",
                                callback: function() {
                                    $("body").removeClass("modal-open");
                                    app.views.site.prototype.site_renderModelSiteToForm(model.changed.site._id);
                                    app.views.site.prototype.site_renderSitesCollectionToUl();
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
            url: site_url,
            private: true
        });
    },

    /** event - delete site **/
    site_delete: function(event) {

        var that = this;
        var jsonObj = this.site_formToJson();

        if (typeof jsonObj.id !== 'undefined')  {
            bootbox.dialog({
                title: that.language.header_confirm_del_message,
                message: that.language.body_confirm_del_message,
                buttons: {
                    confirm: {
                        label: that.language.confirm_button,
                        className: "btn btn-danger",
                        callback: function() {
                            $("body").removeClass("modal-open");
                            that.site_delete_confirm();
                        }
                    },
                    cancel: {
                        label: that.language.cancel_button,
                        className: "btn btn-info",
                        callback: function() {
                            $("body").removeClass("modal-open");
                        }
                    }
                }
            });
        }
        else
        {
            bootbox.dialog({
                title: that.language.delete_header_error_message,
                message: that.language.delete_body_error_message,
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
    },

    /** event - delete site on confirm **/
    site_delete_confirm: function() {

        var that = this;
        var jsonObj = this.site_formToJson();

        var _siteModel = new app.models.site(jsonObj);

        /** DELETE SITE **/
        _siteModel.destroy({
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
                                app.views.site.prototype.site_renderModelSiteToForm(0);
                                app.views.site.prototype.site_renderSitesCollectionToUl();
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
            url: app.const.apiurl() + 'site/id/' + jsonObj.id,
            private: true
        });

    },

    /** event - get site by id **/
    site_id: function(event) {
        console.log(event);
        this.site_renderModelSiteToForm(event.currentTarget.id);
    },

    /** event - new site **/
    site_new: function(event) {
        console.log(event);
        this.site_renderModelSiteToForm(0);
    },

    /** get JSON obj from geo response elements and site form data  **/
    site_formToJson: function () {

        var jsonObj = {};

        if ($('#_id').val() != '')
            jsonObj.id = $('#_id').val();

        jsonObj.tag = $('#tag').val();
        jsonObj.website = $('#website').val();
        jsonObj.user = app.global.tokensCollection.at(0).get("_id");

        return jsonObj;
    },

    /** render site model data or blank data to form **/
    site_renderModelSiteToForm: function (id) {

        var that = this;
        var _siteModel = new app.models.site();

        if (id != 0) {
            /** GET SITE MODEL **/
            _siteModel.fetch({
                success: function (model) {

                    $('#_id').val(model.get("_id"));
                    $('#tag').val(model.get("tag"));
                    $('#website').val(model.get("website"));
                    var str = "<!-- node log -->\n" +
                              "<script type='text/javascript'>\n" +
                              "nodelog_clientid = '" + model.get("_id") + "';\n" +
                              "</script>\n" +
                              "<script type='text/javascript' src='" + app.const.weburl() + "js/n.js?v=001'></script>\n" +
                              "<!-- end node log -->";

                    $('#tracking').val(str);
                    
                    str = "<amp-img  src='" + app.const.weburl() + "/api/pixel/" + model.get("_id") + "'  alt='pixel' layout='responsive' width='1' height='1'></amp-img>\n";
                    $('#amp').val(str);


                    str="<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>" +
                                "<script type='text/javascript'>" +
                                "function __init() {" +
                                "    var elements = document.getElementsByTagName('a');" +
                                "    for (var i = 0, len = elements.length; i < len; i++) {" +
                                "        elements[i].addEventListener('click', __check);" +
                                "    }" +
                                "}" +
                                "function __check() {" +
                                "var jsonObj = {};" +
                                "    jsonObj.uri = event.target.attributes.href.baseURI;" +
                                "    jsonObj.href = event.target.href;" +
                                "    jsonObj.text = event.target.text;" +
                                "    jsonObj.x = event.layerX;" +
                                "    jsonObj.y = event.layerY;" +
                                "    $.ajax({method: 'POST', url: 'https:///nodelogapp.herokuapp.com/api/link/" + model.get("_id") + "', data: jsonObj});" +
                                "}" +
                                "__init();" +
                                "</script>";
                    $('#statlink').val(str);

                    console.log(model);
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
                url: app.const.apiurl() + 'site/id/' + id,
                private: true
            });
        }
        else {

            $('#_id').val('');
            $('#tag').val('');
            $('#website').val('');
            $('#tracking').val('');
            $('#amp').val('');
            $('#statlink').val('');
        }
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
                    $('#siteList li').remove();
                    for( var i=0 in _sitesCollection.models ) {
                        $('#siteList').append('<li><a href="#' + that.language.lang	 + '/site/id/' + _sitesCollection.models[i].get("_id") + '" id="' + _sitesCollection.models[i].get("_id") + '"><span class="glyphicon glyphicon-paperclip"></span> ' + _sitesCollection.models[i].get("tag") + '</a></li>');
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
            url: app.const.apiurl() + "sites/userid/" + app.global.tokensCollection.at(0).get("_id"),
            private: true
        });

    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        $(window).off("resize");
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['site'];
    }

});
