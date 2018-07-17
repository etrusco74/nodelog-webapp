/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/07/18
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.dashboardlink = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing dashboardlink view');
    },

    /** submit event for registration **/
    events: {
        'change #statDay':              'stat_renderStatCollection',
        'change input[type=radio]':     'stat_renderStatPageCollection'
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

        /** ok site **/
        if (app.global.socket === null) {
            /** start connection **/
            app.global.socket = io.connect(app.const.weburl());
        }
        else {
            location.reload(true);
        }

        app.global.socket.on('connect', function () {
            app.global.socket.emit('identifylink', that.options.client_id, that.options.page);
        });

        app.global.socket.on('link', function (msg) {
            console.log(msg);

            $("#con").text(msg.client_id);
            $("#day").text(msg.day);
            $("#page").text(msg.page);
            $("#totalClick").text(msg.totalClick);
            $("#totalLink").text(msg.totalLinks);

            var numRows= that.$('#numRows').val() == "" ? 10 : that.$('#numRows').val();
            $('#bestLinks li').remove();
            for (index = 0, len = msg.totalLinks; index < numRows; ++index) {
                var perc = Math.floor((msg.bestLinks[index].total_click / msg.totalClick) * 100);
                var url = "<a href='" + msg.bestLinks[index]._id.href + "' target='_blank'>" + msg.bestLinks[index]._id.text + "</a> - " + msg.bestLinks[index].total_click + " ("+perc+"%)"

                if (app.global.single_page == msg.bestLinks[index]._id.page)
                    $("#bestLinks").append('<li><input type="radio" name="pageradio" checked value="'+msg.bestLinks[index]._id.page+'"></radio> ' + url + '</li>');
                else
                    $("#bestLinks").append('<li><input type="radio" name="pageradio" value="'+msg.bestLinks[index]._id.page+'"></radio> ' + url + '</li>');
            }

        });

        /** get model site **/
        /*
        var _statLinkModel = new app.models.statlink();
        _statLinkModel.fetch({
            success: function (model) {
                console.log(model);

                $("#con").text(model.get("client_id"));
                $("#day").text(model.get("day"));
                $("#page").text(model.get("page"));
                $("#totalClick").text(model.get("totalClick"));
                $("#totalLink").text(model.get("totalLinks"));

                var numRows= that.$('#numRows').val() == "" ? 10 : that.$('#numRows').val();
                $('#bestLinks li').remove();
                for (index = 0, len = model.get("totalLinks"); index < numRows; ++index) {
                    var perc = Math.floor((model.get("bestLinks")[index].total_click / model.get("totalClick")) * 100);
                    var url = "<a href='" + model.get("bestLinks")[index]._id.href + "' target='_blank'>" + model.get("bestLinks")[index]._id.text + "</a> - " + model.get("bestLinks")[index].total_click + " ("+perc+"%)"

                    if (app.global.single_page == model.get("bestLinks")[index]._id.page)
                        $("#bestLinks").append('<li><input type="radio" name="pageradio" checked value="'+model.get("bestLinks")[index]._id.page+'"></radio> ' + url + '</li>');
                    else
                        $("#bestLinks").append('<li><input type="radio" name="pageradio" value="'+model.get("bestLinks")[index]._id.page+'"></radio> ' + url + '</li>');
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
            url: app.const.apiurl() + 'statlinks/' + this.options.client_id + '/page/' + this.options.page + '/day/' + this.options.day,
            private: true
        });
        */

        /** end init socket.io **/
    },

    /** render stat collection ua and pw to label **/
    stat_renderStatCollection: function () {

        var that = this;
        var statDay = that.$('#statDay').val() == "" ? 7 : that.$('#statDay').val();

        var _statsCollectionUa = new app.collections.stats();
        var _statsCollectionPw = new app.collections.stats();
        var _statsCollectionTp = new app.collections.stats();

        var _statsCollection = new app.collections.stats();

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


        /** get stats tp **/
        _statsCollection.fetch({
            success : function(){
                if (typeof _statsCollection.models[0].get("_id") !== 'undefined') {
                    console.log(_statsCollection.models); // => collection have been populated

                    $('#ua li').remove();
                    $('#pw li').remove();
                    $('#tp li').remove();

                    for( var i=0 in _statsCollection.models ) {

                        var day = _statsCollection.models[i].get("day");
                        var ua, pw, tp = 0;

                        if (typeof _statsCollection.models[i].get("uniqueAccess") !== 'undefined')
                            ua = _statsCollection.models[i].get("uniqueAccess");

                        if (typeof _statsCollection.models[i].get("pageView") !== 'undefined')
                            pw = _statsCollection.models[i].get("pageView");

                        if (typeof _statsCollection.models[i].get("totalPage") !== 'undefined')
                            tp = _statsCollection.models[i].get("totalPage");

                        /** compose jsonObj **/
                        jsonObj.xAxis.categories.push(day);
                        uaObj.data.push(ua);
                        pwObj.data.push(pw);
                        tpObj.data.push(tp);
                    }

                    /** compose jsonObj **/
                    uaObj.name = "unique access";
                    pwObj.name = "page view";
                    tpObj.name = "total page";

                    jsonObj.series.push(uaObj);
                    jsonObj.series.push(pwObj);
                    jsonObj.series.push(tpObj);

                    that.makeGraph(jsonObj);
                }
            },
            error: function(model, response){
                console.log('error'); // => collection not populated
            },
            url: app.const.apiurl() + "stats/daily/" + statDay + "/" + app.global.client_id,
            private: true
        });

    },

    /** render stat collection for single page **/
    stat_renderStatPageCollection: function () {

        var that = this;
        var statDay = that.$('#statDay').val() == "" ? 7 : that.$('#statDay').val();
        var statPage = that.$('input[name=pageradio]:checked').val();
        app.global.single_page = statPage;

        var _statsCollection = new app.collections.stats();

        /** create jsonObj for hicharts **/
        var jsonObj = {};
        var categories = [];
        var series = [];
        jsonObj.xAxis = {};

        jsonObj.series = series;

        jsonObj.chart = {type: "line"};
        jsonObj.title = {text: 'Single page view'};
        jsonObj.subtitle = {text: statPage};
        jsonObj.xAxis = {crosshair: true};
        jsonObj.xAxis.categories = categories;

        var pwObj = {};
        var dataPw = [];
        pwObj.data = dataPw;

        /** get stats tp **/
        _statsCollection.fetch({
            success : function(){
                if (typeof _statsCollection.models[0].get("_id") !== 'undefined') {
                    console.log(_statsCollection.models); // => collection have been populated

                    $('#pw li').remove();

                    for( var i=0 in _statsCollection.models ) {

                        var day = _statsCollection.models[i].get("day");
                        var pw = 0;

                        if (typeof _statsCollection.models[i].get("bestPages") !== 'undefined')
                            pw = _statsCollection.models[i].get("bestPages")[0].total_view;

                        /** compose jsonObj **/
                        jsonObj.xAxis.categories.push(day);
                        pwObj.data.push(pw);
                    }

                    /** compose jsonObj **/
                    pwObj.name = "page view";

                    jsonObj.series.push(pwObj);

                    that.makeGraphPage(jsonObj);
                }
            },
            error: function(model, response){
                console.log('error'); // => collection not populated
            },
            url: app.const.apiurl() + "stats/daily/bp/" + statDay + "/" + app.global.client_id + "/" + statPage,
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
    makeGraphPage: function(jsonObj) {
        var chartPage = $('#graph-page').highcharts(jsonObj);
        //chart.reflow();
        console.log(JSON.stringify(jsonObj));
    },

    /** destroy view and unbind all event **/
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        delete app.global.views['dashboardlink'];
    }

});