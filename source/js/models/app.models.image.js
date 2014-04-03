/**
 * Created by a.demarchi on 14/01/14.
 */
app.models.image = Backbone.Model.extend({
    initialize: function(){
        console.log("initializing image model");
    },

    sync: function(method, model, options) {
        options = options || {};

        options.crossDomain = true;

        if (options.private) {
            var headers = {
                "X-Requested-With": "XMLHttpRequest",
                "authkey" : app.global.tokensCollection.first().get("auth").authkey,
                "username" : app.global.tokensCollection.first().get("username")
            };
            options.headers = headers;
        }
        else {
            var headers = {
                "X-Requested-With": "XMLHttpRequest"
            };
            options.headers = headers;
        }

        Backbone.sync(method, model, options);
    }
});
