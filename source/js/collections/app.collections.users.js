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
    model: app.models.user
});