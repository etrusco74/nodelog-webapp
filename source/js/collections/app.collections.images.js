/**
 * Created by a.demarchi on 14/01/14.
 */
app.collections.images = Backbone.Collection.extend({
    initialize: function(){
        console.log("initializing image collection");
    },
    model: app.models.image
});