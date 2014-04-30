/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 10/07/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.collections.sites = Backbone.Collection.extend({
    initialize: function(){
        console.log("initializing sites collection");
    },
    model: app.models.site
});