/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.dashboard = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing dashboard view');
    },

    /** submit event for registration **/
    events: {
        'change #statDay':       'stat_renderStatCollection'
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template(this.language));
        $(document).attr('title', 'nodelog - realtime web analytics | ' + this.language.type + ' | ' + this.language.lang);

        this.init_socket();

        return this;
    },


    /** init socket.io - important: after template rendering **/
    init_socket: function () {

        var that = this;

        var i = 1;
        var tag = '';
        var client_id = '';

        /** get model site **/

        var _siteModel = new app.models.site();

        /** GET SITE MODEL **/
        _siteModel.fetch({
            success: function (model) {

                if (typeof model.get("_id") !== 'undefined') {
                    //model.get("_id");
                    client_id = model.get("client_id");
                    tag = model.get("tag");
                    //model.get("website");
                    console.log(model);

                    /** ok site **/
                    if (app.global.socket === null) {
                        /** start connection **/
                        app.global.socket = io.connect(app.const.weburl());
                    }
                    else {
                        location.reload(true);
                    }

                    app.global.socket.on('connect', function () {
                        app.global.socket.emit('identify', client_id);
                        $("#log").prepend('<li><br>Connected to <b>' + tag + '</b></li>');
                        $("#con").text(tag);
                        that.stat_renderStatCollection();
                    });

                    app.global.socket.on('message', function (msg) {

                        $("#log").prepend('<div id="json-'+i+'"><div id="json-obj"></div>');
                        $("#log").prepend('<li><span class="glyphicon glyphicon-hand-right"></span><a href="' + msg.location.href + '" target="_blank"> ' + (msg.location.page == '' ? "home" : msg.location.page) + '</a></li>');
                        $('#log li:first').hide().fadeIn(2000);

                        $('#json-'+i).append($('#json-obj').jsonViewer(msg));

                        that.stat_renderStatCollection();

                        i++;
                    });

                    app.global.socket.on('num', function (msg) {
                        var numRows= that.$('#numRows').val() == "" ? 10 : that.$('#numRows').val();
                        $("#day").text(msg.day);
                        $("#pageView").hide().text(msg.pageView).fadeIn(1000);

                        $('#bestPages li').remove();
                        for (index = 0, len = msg.bestPages.length; index < numRows; ++index) {
                            //var url = "<a href='" + json._id.href + "' target='_blank'>" + (json._id.page == '' ? "home" : json._id.page) + "</a> (" + json.total_view + ")"
                            var url = "<a href='" + msg.bestPages[index]._id.href + "' target='_blank'>" + (msg.bestPages[index]._id.page == '' ? "home" : msg.bestPages[index]._id.page) + "</a> (" + msg.bestPages[index].total_view + ")"

                            $("#bestPages").append('<li>' + url + '</li>');
                        }


                        var ua = $("#uniqueAccess").text();
                        if (ua != msg.uniqueAccess) $("#uniqueAccess").hide().text(msg.uniqueAccess).fadeIn(1000);

                        $("#totalPage").hide().text(msg.totalPage).fadeIn(1000);
                    });

                }
                else {
                    if (!model.get("success"))
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
            url: app.const.apiurl() + 'site/client_id/' + app.global.client_id,
            private: true
        });

        /** end init socket.io **/
    },

    /** render stat collection ua and pw to label **/
    stat_renderStatCollection: function () {

        var that = this;
        var statDay = that.$('#statDay').val() == "" ? 7 : that.$('#statDay').val();

        var _statsCollectionUa = new app.collections.stats();
        var _statsCollectionPw = new app.collections.stats();
        var _statsCollectionTp = new app.collections.stats();

        /** create jsonObj for hicharts **/
        var jsonObj = {};
        var categories = [];
        var series = [];
        jsonObj.xAxis = {};

        jsonObj.series = series;

        jsonObj.chart = {type: "line"};
        jsonObj.title = {text: 'Web site access'};
        jsonObj.subtitle = {text: 'Unique Access, Page View and Total Page'};
        jsonObj.xAxis = {crosshair: true};
        jsonObj.xAxis.categories = categories;

        var uaObj = {};
        var pwObj = {};
        var tpObj = {};

        var dataUa = [];
        var dataPw = [];
        var dataTp = [];

        uaObj.data = dataUa;
        pwObj.data = dataPw;
        tpObj.data = dataTp;

        /** get stats ua **/
        _statsCollectionUa.fetch({
            success : function(){
                if (typeof _statsCollectionUa.models[0].get("_id") !== 'undefined') {
                    console.log(_statsCollectionUa.models); // => collection have been populated
                    $('#ua li').remove();
                    for( var i=0 in _statsCollectionUa.models ) {
                        var day = _statsCollectionUa.models[i].get("day");
                        var ua = _statsCollectionUa.models[i].get("uniqueAccess");

                        /** compose jsonObj **/
                        jsonObj.xAxis.categories.push(day);
                        uaObj.data.push(ua);
                    }
                    /** compose jsonObj **/
                    uaObj.name = "unique access";
                    jsonObj.series.push(uaObj);

                    /** get stats pw **/
                    _statsCollectionPw.fetch({
                        success : function(){
                            if (typeof _statsCollectionPw.models[0].get("_id") !== 'undefined') {
                                console.log(_statsCollectionPw.models); // => collection have been populated
                                $('#pw li').remove();
                                for( var i=0 in _statsCollectionPw.models ) {
                                    var day = _statsCollectionPw.models[i].get("day");
                                    var pw = _statsCollectionPw.models[i].get("pageView");


                                    /** compose jsonObj **/
                                    pwObj.data.push(pw);
                                }
                                /** compose jsonObj **/
                                pwObj.name = "page view";
                                jsonObj.series.push(pwObj);

                                /** get stats tp **/
                                _statsCollectionTp.fetch({
                                    success : function(){
                                        if (typeof _statsCollectionTp.models[0].get("_id") !== 'undefined') {
                                            console.log(_statsCollectionTp.models); // => collection have been populated
                                            $('#tp li').remove();
                                            for( var i=0 in _statsCollectionTp.models ) {
                                                var day = _statsCollectionTp.models[i].get("day");
                                                var tp = 0;
                                                if (typeof _statsCollectionTp.models[i].get("totalPage") !== 'undefined')
                                                    tp = _statsCollectionTp.models[i].get("totalPage");

                                                /** compose jsonObj **/
                                                tpObj.data.push(tp);
                                            }
                                            /** compose jsonObj **/
                                            tpObj.name = "total page";
                                            jsonObj.series.push(tpObj);

                                            that.makeGraph(jsonObj);
                                        }
                                    },
                                    error: function(model, response){
                                        console.log('error'); // => collection not populated
                                    },
                                    url: app.const.apiurl() + "stats/daily/tp/" + statDay + "/" + app.global.client_id,
                                    private: true
                                });

                            }
                        },
                        error: function(model, response){
                            console.log('error'); // => collection not populated
                        },
                        url: app.const.apiurl() + "stats/daily/pw/" + statDay + "/" + app.global.client_id,
                        private: true
                    });
                }
            },
            error: function(model, response){
                console.log('error'); // => collection not populated
            },
            url: app.const.apiurl() + "stats/daily/ua/" + statDay + "/" + app.global.client_id,
            private: true
        });

    },

    /** destroy view and unbind all event **/
    makeGraph: function(jsonObj) {
        var chart = $('#graph').highcharts(jsonObj);
        //chart.reflow();
        console.log(JSON.stringify(jsonObj));
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['dashboard'];
    }

});
