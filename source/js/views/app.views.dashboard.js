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
        $(this.el).html(this.template());
        $(document).attr('title', 'nodelog - realtime web analytics | ' + this.language.type + ' | ' + this.language.lang);
        return this;
    },


    /** init socket.io - important: after template rendering **/
    init_socket: function (client_id) {

        var that = this;

        /** start socket.io **/
        var _client_id = client_id;

        /** manage connection **/
        if (app.global.socket === null) {
            /** start connection **/
            app.global.socket = io.connect('http://nodelog-c9-etrusco.c9.io');
            //app.global.socket = io.connect('http://localhost:8080');
        }
        else {
            location.reload(true);
            //app.global.socket.emit('change', _client_id);
        }

        app.global.socket.on('connect', function () {
            app.global.socket.emit('create', _client_id);
            $("#log").prepend('<li><br>Connected to <b>' + _client_id + '</b></li>');
            $("#con").text(_client_id);
        });

        app.global.socket.on('disconnected', function() {
            app.global.socket.emit('disconnect');
        });

        app.global.socket.on('message', function (msg) {
            $("#log").prepend('<li><small><span class="glyphicon glyphicon-hand-right"></span> ' + JSON.stringify(msg) + '</small></li>');
            $('#log li:first').hide().fadeIn(2000);
        });

        app.global.socket.on('update', function (msg) {
            $("#log").prepend('<li><br>Connected to <b>' + msg + '</b></li>');
            $("#con").text(msg);
        });

        app.global.socket.on('num', function (msg) {
            $("#day").text(msg.day);
            $("#pageView").hide().text(msg.pageView).fadeIn(1000);
            var best = '';
            msg.bestPages.forEach(function(json) {
                best += JSON.stringify(json);
            });
            $('#bestPages li:last').remove();
            $("#bestPages").append('<li><small><span class="glyphicon glyphicon-hand-right"></span> ' + best + '</small></li>');

            var ua = $("#uniqueAccess").text();
            if (ua != msg.uniqueAccess) $("#uniqueAccess").hide().text(msg.uniqueAccess).fadeIn(1000);
        });

        /** end socket.io **/
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
