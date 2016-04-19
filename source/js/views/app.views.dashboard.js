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

    /** render template **/
    render: function() {
        $(this.el).html(this.template(this.language));
        $(document).attr('title', 'nodelog - realtime web analytics | ' + this.language.type + ' | ' + this.language.lang);

        return this;
    },


    /** init socket.io - important: after template rendering **/
    init_socket: function (client_id) {

        var that = this;

        var i = 1;
        var name = client_id;;

        if (app.global.socket === null) {
            /** start connection **/
            //app.global.socket = io.connect('http://nodelognew-etrusco.c9users.io/');
            //app.global.socket = io.connect(window.location.hostname);
            app.global.socket = io.connect(app.const.weburl());
        }
        else {
            location.reload(true);
        }

        app.global.socket.on('connect', function () {
            app.global.socket.emit('identify', name);
            $("#log").prepend('<li><br>Connected to <b>' + name + '</b></li>');
            $("#con").text(name);
            that.stat_renderStatCollection(name);
        });

        app.global.socket.on('message', function (msg) {

            $("#log").prepend('<div id="json-'+i+'"><div id="json-obj"></div>');
            $("#log").prepend('<li><span class="glyphicon glyphicon-hand-right"></span><a href="' + msg.location.href + '" target="_blank"> ' + (msg.location.page == '' ? "home" : msg.location.page) + '</a></li>');
            $('#log li:first').hide().fadeIn(2000);

            $('#json-'+i).append($('#json-obj').jsonViewer(msg));

            that.stat_renderStatCollection(name);

            i++;
        });

        app.global.socket.on('num', function (msg) {
            $("#day").text(msg.day);
            $("#pageView").hide().text(msg.pageView).fadeIn(1000);

            $('#bestPages li').remove();
            msg.bestPages.forEach(function(json) {
                var url = "<a href='"+json._id.href+"' target='_blank'>"+(json._id.page == '' ? "home" : json._id.page)+"</a> ("+json.total_view+")"
                $("#bestPages").append('<li>' + url + '</li>');
            });

            var ua = $("#uniqueAccess").text();
            if (ua != msg.uniqueAccess) $("#uniqueAccess").hide().text(msg.uniqueAccess).fadeIn(1000);
        });

        /** end socket.io **/
    },

    /** render stat collection ua and pw to label **/
    stat_renderStatCollection: function (client_id) {

        var that = this;
        var _statsCollectionUa = new app.collections.stats();
        var _statsCollectionPw = new app.collections.stats();

        /** create jsonObj for hicharts **/
        var jsonObj = {};
        var categories = [];
        var series = [];
        jsonObj.xAxis = {};

        jsonObj.series = series;

        jsonObj.chart = {type: "column"};
        jsonObj.title = {text: 'Web site access'};
        jsonObj.subtitle = {text: 'Unique Access and Page View'};
        jsonObj.xAxis = {crosshair: true};
        jsonObj.xAxis.categories = categories;

        var uaObj = {};
        var pwObj = {};
        var dataUa = [];
        var dataPw = [];
        uaObj.data = dataUa;
        pwObj.data = dataPw;

        /** get stats ua **/
        _statsCollectionUa.fetch({
            success : function(){
                if (typeof _statsCollectionUa.models[0].get("_id") !== 'undefined') {
                    console.log(_statsCollectionUa.models); // => collection have been populated
                    $('#ua li').remove();
                    for( var i=0 in _statsCollectionUa.models ) {
                        var day = _statsCollectionUa.models[i].get("day");
                        var ua = _statsCollectionUa.models[i].get("uniqueAccess");
                        //var label = 'day: ' +day+ ' -> ' + ua;
                        //$("#ua").prepend('<li>' + label + '</li>');
                        //$('#ua li:first').hide().fadeIn(2000);

                        /** compose jsonObj **/
                        jsonObj.xAxis.categories.push(day);
                        uaObj.data.push(ua);
                    }
                    /** compose jsonObj **/
                    uaObj.name = "ua";
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
                                    //var label = 'day: ' +day+ ' -> ' + pw;
                                    //$("#pw").prepend('<li>' + label + '</li>');
                                    //$('#pw li:first').hide().fadeIn(2000);

                                    /** compose jsonObj **/
                                    pwObj.data.push(pw);
                                }
                                /** compose jsonObj **/
                                pwObj.name = "pw";
                                jsonObj.series.push(pwObj);

                                that.makeGraph(jsonObj);
                            }
                        },
                        error: function(model, response){
                            console.log('error'); // => collection not populated
                        },
                        url: app.const.apiurl() + "stats/daily/pw/7/" + client_id,
                        private: true
                    });

                }
            },
            error: function(model, response){
                console.log('error'); // => collection not populated
            },
            url: app.const.apiurl() + "stats/daily/ua/7/" + client_id,
            private: true
        });

    },

    /** destroy view and unbind all event **/
    makeGraph: function(jsonObj) {
        var chart = $('#graph').highcharts(jsonObj);
        chart.reflow();
        console.log(jsonObj);
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
