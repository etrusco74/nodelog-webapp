/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
app.views.report = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing report view');
        $(window).on("resize", _.bind(this.resize_map, this));
    },

    /** submit event for registration **/
    events: {
        'submit':                           'report',
        'click #deleteReportButton':        'report_delete',
        'click #reportList a':              'report_id',
        'click #newReportButton':           'report_new',
        'click #shareFbButton':             'report_share_fb',
        'click #shareTwitterButton':        'report_share_twitter',
        'click #sharePermaButton':          'report_share_perma',
        'click #imgButton':                 'report_post_image',
        'click #imgButtonClose':            'report_close_image',
        'click #imgButtonDel':              'report_delete_images',
        'change #reportTypes':              'report_type_change'
    },

    /** render template **/
    render: function(type_id) {
        $(this.el).html(this.template());

        this.report_renderReportsCollectionToUl();
        this.report_renderTypesCollectionToSelect(type_id);

        /** validate form **/
        this.$("#reportForm").validate({
            rules: {
                geocomplete_report: "required",
                reportTypes: "required",
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

        /** manage upload images **/
        this.$("#my-dropzone").dropzone({
            url: app.const.apiurl() + 'image',
            headers: {
                "X-Requested-With": 'XMLHttpRequest',
                "dir": ''
            },
            maxFiles: 5,
            maxFilesize: 1,
            acceptedFiles: '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF',
            clickable: true,
            addRemoveLinks: true,
            accept: function(file, done) {
                console.log("uploaded");
                done();
            },
            init: function() {
                this.on("maxfilesexceeded", function(file){ alert("No more files please!"); });
                this.on("complete", function(file) {
                    //app.views.report.prototype.report_renderImagesCollectionToDiv();
                    console.log(file);
                });
                this.on("removedfile", function(file) {
                    app.views.report.prototype.report_delete_image(file);
                    console.log(file);
                });
            }
        });

        return this;
    },

    /** event - insert report **/
    report: function (event) {
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
                        that.report_confirm();
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

    /** event - insert or update report on confirm **/
    report_confirm: function () {

        var that = this;
        var jsonObj = this.report_formToJson();

        var _reportModel = new app.models.report();

        var report_url = app.const.apiurl() + 'report';
        if (typeof jsonObj.id !== 'undefined')  {
            ((jsonObj.id) != '') ? report_url = report_url + '/id/' + jsonObj.id : report_url;
        }
        /** POST REPORT **/
        _reportModel.save(jsonObj, {
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
                                    app.views.report.prototype.report_renderModelReportToForm(model.changed.report._id);
                                    app.views.report.prototype.report_renderReportsCollectionToUl();
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
            url: report_url,
            private: true
        });
    },

    /** event - delete report **/
    report_delete: function(event) {

        var that = this;
        var jsonObj = this.report_formToJson();

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
                            that.report_delete_confirm();
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

    /** event - delete report on confirm **/
    report_delete_confirm: function() {

        var that = this;
        var jsonObj = this.report_formToJson();

        var _reportModel = new app.models.report(jsonObj);

        /** DELETE REPORT **/
        _reportModel.destroy({
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
                                app.views.report.prototype.report_renderModelReportToForm(0);
                                app.views.report.prototype.report_renderReportsCollectionToUl();
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
            url: app.const.apiurl() + 'report/id/' + jsonObj.id,
            private: true
        });

    },

    /** event - get report by id **/
    report_id: function(event) {
        console.log(event);
        this.report_renderModelReportToForm(event.currentTarget.id);
    },

    /** event - new report **/
    report_new: function(event) {
        console.log(event);
        this.report_renderModelReportToForm(0);
    },

    /** event - share facebook **/
    report_share_fb: function(event) {
        console.log(event);

        var that = this;
        var jsonObj = this.report_formToJson();

        if (typeof jsonObj.id !== 'undefined')  {

            $.getScript(that.language.fb_connect_url, function(){
                FB.init({
                    appId: that.language.fb_app_id,
                    channelUrl: that.language.fb_channel_url
                });

                var publish = {
                    method: 'stream.publish',
                    attachment: {
                        name: that.language.fb_name,
                        caption: that.language.fb_caption,
                        description: that.language.fb_description + $('#reportTypes option:selected').text(),
                        href: that.language.fb_href + jsonObj.id,
                        media: [
                            {
                                type: 'image',
                                href: that.language.fb_href + jsonObj.id,
                                src: that.language.fb_src
                            }
                        ]
                    },
                    action_links: [
                        { text: that.language.fb_action_links_text, href: that.language.fb_action_links_href }
                    ],
                    user_prompt_message: that.language.user_prompt_message
                };

                FB.ui(publish);
            });
        }
        else {
            bootbox.dialog({
                title: that.language.fb_header_error_message,
                message: that.language.fb_body_error_message,
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

    /** event - share twitter **/
    report_share_twitter: function(event) {
        console.log(event);

        var that = this;
        var jsonObj = this.report_formToJson();

        if (typeof jsonObj.id !== 'undefined')  {

            var width       = 575,
                height      = 400,
                left        = ($(window).width()  - width)  / 2,
                top         = ($(window).height() - height) / 2,
                login       = that.language.bitly_login,
                api_key     = that.language.bitly_apikey,
                url         = that.language.twitter_url,
                long_url    = that.language.twitter_long_url + jsonObj.id,
                text        = '?text=' + that.language.twitter_text + $('#reportTypes option:selected').text(),
                hash        = '&hashtags=' + that.language.twitter_hash,
                opts        = 'status=1,width=' + width  + ',height=' + height + ',top=' + top + ',left=' + left;

            that.get_short_url(long_url, login, api_key, function(short_url) {
                console.log(short_url);
                window.open(url+text+hash+"&url="+short_url, 'twitter', opts);
            });
        }
        else {
            bootbox.dialog({
                title: that.language.twitter_header_error_message,
                message: that.language.twitter_body_error_message,
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

    /** event - get permalink **/
    report_share_perma: function(event) {
        console.log(event);

        var that = this;
        var jsonObj = this.report_formToJson();

        if (typeof jsonObj.id !== 'undefined')  {

            var login       = that.language.bitly_login,
                api_key     = that.language.bitly_apikey,
                long_url    = that.language.twitter_long_url + jsonObj.id;

            that.get_short_url(long_url, login, api_key, function(short_url) {
                console.log(short_url);
                that.$("#titlePerma").text(that.language.perma_header_message);
                that.$("#bodyPerma").text(that.language.perma_body_message);
                that.$("#linkPerma").text(short_url);
                that.$('#myModalPerma').modal('show');
            });
        }
        else {
            bootbox.dialog({
                title: that.language.perma_header_error_message,
                message: that.language.perma_body_error_message,
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

    /** *************************************************** start images managment **/

    /** event - post images **/
    report_post_image: function(event) {
        console.log(event);

        var that = this;
        var jsonObj = this.report_formToJson();

        if (typeof jsonObj.id !== 'undefined')  {

            var myDropzone = Dropzone.forElement("div#my-dropzone");
            myDropzone.options.headers.dir = jsonObj.id;

            that.$("#titleImages").text(that.language.image_header_message);
            that.$("#bodyImages").text(that.language.image_body_message);
            that.$('#myModalImages').modal('show');

        }
        else {
            bootbox.dialog({
                title: that.language.image_header_error_message,
                message: that.language.image_body_error_message,
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

    /** event - delete single image **/
    report_delete_image: function(file) {
        console.log(file);

        var that = this;
        var jsonObj = this.report_formToJson();
        var _url = app.const.apiurl() + 'image/dir/' + jsonObj.id + '/file/' + file.name;

        var _imageModel = new app.models.image(jsonObj);

        /** DELETE IMAGE **/
        _imageModel.destroy({
            success: function (model) {
                bootbox.dialog({
                    title: that.language.image_header_success_del_message,
                    message: that.language.image_body_success_del_message,
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
            url: _url,
            private: true
        });

    },

    /** event - delete all images **/
    report_delete_images: function(event) {

        var that = this;
        var jsonObj = this.report_formToJson();

        if (typeof jsonObj.id !== 'undefined')  {
            bootbox.dialog({
                title: that.language.image_header_confirm_del_all_message,
                message: that.language.image_body_confirm_del_all_message,
                buttons: {
                    confirm: {
                        label: that.language.confirm_button,
                        className: "btn btn-danger",
                        callback: function() {
                            $("body").removeClass("modal-open");
                            that.report_delete_images_confirm();
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

    /** event - delete all images - confirm **/
    report_delete_images_confirm: function(event) {
        console.log(event);

        var that = this;
        var jsonObj = this.report_formToJson();
        var _url = app.const.apiurl() + 'images/dir/' + jsonObj.id;
        var _imageModel = new app.models.image(jsonObj);

        /** DELETE ALL IMAGES **/
        _imageModel.destroy({
            success: function (model) {
                bootbox.dialog({
                    title: that.language.image_header_success_del_all_message,
                    message: that.language.image_body_success_del_all_message,
                    buttons: {
                        main: {
                            label: that.language.label_button,
                            className: "btn btn-info",
                            callback: function() {
                                $("body").removeClass("modal-open");
                                app.views.report.prototype.report_renderImagesCollectionToDiv(jsonObj.id);
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
            url: _url,
            private: true
        });

    },

    /** event - close upload images form **/
    report_close_image: function(event) {
        console.log(event);

        var that = this;
        var jsonObj = this.report_formToJson();
        that.report_renderImagesCollectionToDiv(jsonObj.id);
    },

    /** render images model data to div **/
    report_renderImagesCollectionToDiv: function (id) {

        var that = this;
        var _imagesCollection = new app.collections.images();

        /** GET IMAGES **/
        _imagesCollection.fetch({
            success : function(){
                console.log(_imagesCollection.models); // => collection have been populated

                var myImages = new Array();

                /** manage images **/
                $("#imagesUploaded").empty();
                var imgArr = _imagesCollection.models[0].get("data").resources;
                imgArr.forEach(function(image) {
                    console.log(image);
                    $("#imagesUploaded").append( '<div class="imageUploaded"><img src="'+image.url+'"></div>' );
                });
            },
            error: function(model, response){
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
            },
            url: app.const.apiurl() + "images/dir/" + id
        });

    },

    /** *************************************************** end images managment **/

    /** event - report type change **/
    report_type_change: function(event) {
        console.log(event);
        this.report_renderModelReportType($('#reportTypes').val());
    },

    /** render report model data or blank data to form **/
    report_renderModelReportType: function (id) {

        var that = this;
        app.global.type_value = '1';

        var _reportModelType = new app.models.type();

        /** GET REPORT TYPE MODEL **/
        _reportModelType.fetch({
            success: function (model) {
                app.global.type_value = model.get("value");
                var text = $("#geocomplete_report").val()
                $("#geocomplete_report").geocomplete("find", text);
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
            url: app.const.apiurl() + 'type/id/' + id,
            private: false
        });
    },

    /** get JSON obj from geo response elements and report form data  **/
    report_formToJson: function () {

        var jsonObj = {};
        var lng = $("#lng").text() * 1;         // => int val
        var lat = $("#lat").text() * 1;

        if ($('#_id').val() != '')
            jsonObj.id = $('#_id').val();

        jsonObj.username_id = app.global.tokensCollection.at(0).get("_id");
        jsonObj.username = app.global.tokensCollection.at(0).get("username");

        jsonObj.type_id = $('#reportTypes').val();
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

    /** render report model data or blank data to form **/
    report_renderModelReportToForm: function (id) {

        var that = this;
        var _reportModel = new app.models.report();

        if (id != 0) {
            /** GET REPORT MODEL **/
            _reportModel.fetch({
                success: function (model) {

                    $('#_id').val(model.get("_id"));
                    $('#geocomplete_report').val(model.get("formatted_address"));
                    $('#reportTypes').val( model.get("type_id")._id ).attr('selected',true);
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

                    $("#geocomplete_report").geocomplete("find", model.get("formatted_address"));

                    $("#accordion2").show();

                    app.views.report.prototype.report_renderImagesCollectionToDiv(id);

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
                url: app.const.apiurl() + 'report/id/' + id,
                private: false
            });
        }
        else {
            $('#_id').val('');
            $('#geocomplete_report').val('');
            $('#reportTypes').val(0).attr('selected',true);
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

    /** render previous report model data to ul **/
    report_renderReportsCollectionToUl: function () {

        var that = this;
        var _reportsCollection = new app.collections.reports();
        /** GET REPORTS **/
        _reportsCollection.fetch({
            success : function(){
                if (typeof _reportsCollection.models[0].get("_id") !== 'undefined') {
                    console.log(_reportsCollection.models); // => collection have been populated
                    $('#reportList li').remove();
                    for( var i=0 in _reportsCollection.models ) {
                        $('#reportList').append('<li><i class="icon-chevron-right"></i><a href="#' + that.language.lang	 + '/report/type_id/' + _reportsCollection.models[i].get("type_id")._id + '" id="' + _reportsCollection.models[i].get("_id") + '">' + _reportsCollection.models[i].get("formatted_address") + '</a></li>');
                    }
                }
                else {
                    $('#reportList li').remove();
                    $('#reportList').append('<li>' + that.language.no_report_desc + '</li>');
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
            url: app.const.apiurl() + "reports/username/" + app.global.tokensCollection.at(0).get("username")
        });

    },

    /** render types report model data to select **/
    report_renderTypesCollectionToSelect: function (type_id) {

        var that = this;
        var _typesCollection = new app.collections.types();
        /** GET REPORT TYPE **/
        _typesCollection.fetch({
            success : function(){
                console.log(_typesCollection.models); // => collection have been populated
                for( var i=0 in _typesCollection.models ) {
                    if (type_id == _typesCollection.models[i].get("_id")) {
                        $('#reportTypes')
                            .append($("<option></option>")
                                .attr("value",_typesCollection.models[i].get("_id"))
                                .text(_typesCollection.models[i].get("description_" + that.language.lang))
                                .attr('selected',true)
                            );
                    }
                    else {
                        $('#reportTypes')
                            .append($("<option></option>")
                                .attr("value",_typesCollection.models[i].get("_id"))
                                .text(_typesCollection.models[i].get("description_" + that.language.lang))
                            );
                    }
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
            url: app.const.apiurl() + "types"
        });

    },

    /** resize google maps div - important: after template rendering **/
    resize_map: function () {

        /** set css heigth **/
        var windowHeight = $(window).height();
        var headerHeight = $('#navbar_content').height();
        var footerHeight = $('#footer_content').height();
        this.$el.find('#map_canvas_report').height( windowHeight - headerHeight - footerHeight - 100 );

    },

    /** init google maps - important: after template rendering **/
    init_map: function () {

        var that = this;
        that.resize_map();

        /** set map opt **/
        var mapOptions = {
            map: that.$el.find('#map_canvas_report'),
            details: that.$el.find('#container'),
            detailsAttribute: 'data-geo',
            markerOptions: {
                draggable: true,
                icon : 'css/img/1.png'
            }
        };

        that.$("#accordion2").hide();

        that.$("#geocomplete_report").geocomplete(mapOptions);

        that.$("#geocomplete_report").bind("geocode:dragged", function(event, latLng){
            $("#geocomplete_report").geocomplete("find", latLng.lat()+','+latLng.lng());
        });

        this.$("#geocomplete_report").bind("geocode:result", function(event, result){
            console.log(result);

            $("#accordion2").show();

            var map = $("#geocomplete_report").geocomplete("map");
            //map.setZoom(3);
            var marker = $("#geocomplete_report").geocomplete("marker");
            marker.setIcon('css/img/' + app.global.type_value + '.png');

        });

    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        $(window).off("resize");
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.reportView = null;
    },

    /** create a bit.ly url **/
    get_short_url: function(long_url, login, api_key, func) {
        $.getJSON(
            "http://api.bitly.com/v3/shorten?callback=?",
            {
                "format": "json",
                "apiKey": api_key,
                "login": login,
                "longUrl": long_url
            },
            function(response)
            {
                func(response.data.url);
            }
        );
    }

});
