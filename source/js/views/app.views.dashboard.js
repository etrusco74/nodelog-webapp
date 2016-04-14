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
            that.stat_renderUaStatCollectionToLabel(name);
            that.stat_renderPwStatCollectionToLabel(name);
        });

        app.global.socket.on('message', function (msg) {

            $("#log").prepend('<div id="json-'+i+'"><div id="json-obj"></div>');
            $("#log").prepend('<li><span class="glyphicon glyphicon-hand-right"></span><a href="' + msg.location.href + '" target="_blank"> ' + (msg.location.page == '' ? "home" : msg.location.page) + '</a></li>');
            $('#log li:first').hide().fadeIn(2000);

            $('#json-'+i).append($('#json-obj').jsonViewer(msg));

            that.stat_renderUaStatCollectionToLabel(name);
            that.stat_renderPwStatCollectionToLabel(name);

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

    /** render stat collection ua to label **/
    stat_renderUaStatCollectionToLabel: function (client_id) {

        var that = this;
        var _statsCollection = new app.collections.stats();

        /** get stats **/
        _statsCollection.fetch({
            success : function(){
                if (typeof _statsCollection.models[0].get("_id") !== 'undefined') {
                    console.log(_statsCollection.models); // => collection have been populated
                    $('#ua li').remove();
                    for( var i=0 in _statsCollection.models ) {
                        var day = _statsCollection.models[i].get("day");
                        var ua = _statsCollection.models[i].get("uniqueAccess");
                        var label = 'day: ' +day+ ' -> ' + ua;
                        $("#ua").prepend('<li>' + label + '</li>');
                        $('#ua li:first').hide().fadeIn(2000);
                    }
                }
            },
            error: function(model, response){
                console.log('error'); // => collection not populated
            },
            url: app.const.apiurl() + "stats/daily/ua/7/" + client_id,
            private: true
        });

    },

    /** render stat collection pw to label **/
    stat_renderPwStatCollectionToLabel: function (client_id) {

        var that = this;
        var _statsCollection = new app.collections.stats();

        /** get stats **/
        _statsCollection.fetch({
            success : function(){
                if (typeof _statsCollection.models[0].get("_id") !== 'undefined') {
                    console.log(_statsCollection.models); // => collection have been populated
                    $('#pw li').remove();
                    for( var i=0 in _statsCollection.models ) {
                        var day = _statsCollection.models[i].get("day");
                        var pw = _statsCollection.models[i].get("pageView");
                        var label = 'day: ' +day+ ' -> ' + pw;
                        $("#pw").prepend('<li>' + label + '</li>');
                        $('#pw li:first').hide().fadeIn(2000);
                    }
                }
            },
            error: function(model, response){
                console.log('error'); // => collection not populated
            },
            url: app.const.apiurl() + "stats/daily/pw/7/" + client_id,
            private: true
        });

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
