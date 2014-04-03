/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 31/05/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.collections.tokens = Backbone.Collection.extend({
    initialize: function(){
        console.log("initializing tokens collection");
    },
    model: app.models.token,
    localStorage: new Backbone.LocalStorage("tokens")
});