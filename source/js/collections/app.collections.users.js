/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 31/05/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.collections.users = Backbone.Collection.extend({
    initialize: function(){
        console.log("initializing users collection");
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
    },
    model: app.models.user
});