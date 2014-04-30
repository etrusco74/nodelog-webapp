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
        $(this.el).html(this.template());

        //this.site_renderSitesCollectionToUl(); FIXME

        /** validate form **/
        this.$("#siteForm").validate({
            rules: {
                geocomplete_site: "required",
                siteTypes: "required",
                description: "required",
                contact_email:{
                    email: true
                },
                website: {
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
        var lng = $("#lng").text() * 1;         // => int val
        var lat = $("#lat").text() * 1;

        if ($('#_id').val() != '')
            jsonObj.id = $('#_id').val();

        jsonObj.username_id = app.global.tokensCollection.at(0).get("_id");
        jsonObj.username = app.global.tokensCollection.at(0).get("username");

        jsonObj.type_id = $('#siteTypes').val();
        //app.global.type_value = jsonObj.type_id;
        jsonObj.formatted_address = $("#formatted_address").text();
        jsonObj.country = $("#country").text();
        jsonObj.country_short = $("#country_short").text();
        jsonObj.region = $("#administrative_area_level_1").text();
        jsonObj.province = $("#administrative_area_level_2").text();
        jsonObj.postal_code = $("#postal_code").text();
        jsonObj.lng = lng;
        jsonObj.lat = lat;

        /** Point define **/
        jsonObj.loc = {};
        jsonObj.loc.type = "Point";
        jsonObj.loc.coordinates = [];
        jsonObj.loc.coordinates.push(lng, lat);

        jsonObj.description = $('#description').val();
        jsonObj.note = $('#note').val();
        jsonObj.contact_email = $('#contact_email').val();
        jsonObj.website = $('#website').val();

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
                    $('#geocomplete_site').val(model.get("formatted_address"));
                    $('#siteTypes').val( model.get("type_id")._id ).attr('selected',true);
                    app.global.type_value = model.get("type_id").value;
                    $('#description').val(model.get("description"));
                    $('#note').val(model.get("note"));
                    /** manage keywords **/
                    var tag = [];
                    tag = model.get("keywords");
                    var str = '', i;
                    for( i = 0; i < tag.length; i++) {
                        str += '<span class=\"label label-info\">' + tag[i] + '</span> ';
                    }
                    $('#tag').html(str);
                    $('#contact_email').val(model.get("contact_email"));
                    $('#website').val(model.get("website"));

                    $('#formatted_address').text(model.get("formatted_address"));
                    $('#country').text(model.get("country"));
                    $('#country_short').text(model.get("country_short"));
                    $('#administrative_area_level_1').text(model.get("region"));
                    $('#administrative_area_level_2').text(model.get("province"));
                    $('#postal_code').text(model.get("postal_code"));
                    $('#lat').text(model.get("lat"));
                    $('#lng').text(model.get("lng"));

                    $("#geocomplete_site").geocomplete("find", model.get("formatted_address"));

                    $("#accordion2").show();

                    app.views.site.prototype.site_renderImagesCollectionToDiv(id);

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
                private: false
            });
        }
        else {
            $('#_id').val('');
            $('#geocomplete_site').val('');
            $('#siteTypes').val(0).attr('selected',true);
            app.global.type_value='1';
            $('#description').val('');
            $('#note').val('');
            $('#tag').html(that.language.tag_desc);
            $('#contact_email').val('');
            $('#website').val('');

            $('#formatted_address').text('');
            $('#country').text('');
            $('#country_short').text('');
            $('#administrative_area_level_1').text('');
            $('#administrative_area_level_2').text('');
            $('#postal_code').text('');
            $('#lat').text('');
            $('#lng').text('');

            $("#accordion2").hide();
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
                        $('#siteList').append('<li><i class="icon-chevron-right"></i><a href="#' + that.language.lang	 + '/site/type_id/' + _sitesCollection.models[i].get("type_id")._id + '" id="' + _sitesCollection.models[i].get("_id") + '">' + _sitesCollection.models[i].get("formatted_address") + '</a></li>');
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
            url: app.const.apiurl() + "sites/username/" + app.global.tokensCollection.at(0).get("username")
        });

    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        $(window).off("resize");
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.siteView = null;
    }

});
