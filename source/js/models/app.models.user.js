/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.models.user = Backbone.Model.extend({
    initialize: function(){
        console.log("initializing user model");
    },

    sync: function(method, model, options) {
        options = options || {};

        options.crossDomain = true;

        if (options.private) {
            var headers = {
                "X-Requested-With": "XMLHttpRequest",
                "authkey" : app.global.tokensCollection.first().get("auth").authkey,
                "username" : app.global.tokensCollection.first().get("username"),
                "lang" : app.global.languagesCollection.at(0).get("lang")
            };
            options.headers = headers;
        }
        else {
            var headers = {
                "X-Requested-With": "XMLHttpRequest",
                "lang" : app.global.languagesCollection.at(0).get("lang")
            };
            options.headers = headers;
        }

        Backbone.sync(method, model, options);
    }
});