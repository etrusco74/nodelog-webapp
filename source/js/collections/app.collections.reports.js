/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 10/07/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.collections.reports = Backbone.Collection.extend({
    initialize: function(){
        console.log("initializing report collection");
    },
    model: app.models.report
});