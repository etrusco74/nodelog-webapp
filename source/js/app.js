/** app namespace **/
app = {

	    /** namespaces **/
        collections: {},
        models: {},
        routers: {},
        views: {},

        /** app utils **/
        utils: {

            init: function (startup) {
                app.utils.loadTemplate( app.views_array , function() {
                    app.utils.loadLanguage( app.views_array , function() {
                        if (startup) {
                            app.router = new app.routers.router();
                            try {Backbone.history.start();} catch(ex) { ; }
                        }
                        else
                            app.routers.router.prototype.index();
                    });
                });
            },

            loadTokens: function() {
                app.global.tokensCollection = new app.collections.tokens();
                app.global.tokensCollection.fetch();
            },

            getLanguage: function() {

                /** get language - local or default **/
                app.global.languagesCollection = new app.collections.languages();
                app.global.languagesCollection.fetch();
                var lang = app.global.default_language();
                if (app.global.languagesCollection.length > 0) {
                    lang = app.global.languagesCollection.at(0).get("lang");
                    if ($.inArray(lang, app.languages) == -1)  {
                        lang = app.global.default_language();
                        this.setLanguage(lang);
                    }
                }
                else {
                    this.setLanguage(lang);
                }
                return lang;
            },

            setLanguage: function(lang){
                /** reset old language **/
                app.global.languagesCollection = new app.collections.languages();
                app.global.languagesCollection.fetch();
                if (app.global.languagesCollection.length > 0) {
                    app.global.languagesCollection.each(function(model) { model.destroy(); } );
                }
                /** set new language **/
                if (!(_.contains(app.languages, lang))){
                    lang = app.global.default_language();
                }
                var _model = new app.models.language({lang: lang});
                app.global.languagesCollection.add(_model);
                _model.save();
            },

            loadTemplate: function(views, callback) {

                var deferreds = [];
                $.each(views, function(index, view) {
                    if (app.views[view]) {

                        /** load template **/
                        deferreds.push($.get('js/templates/app.templates.' + view + '.html', function(data) {
                            app.views[view].prototype.template = _.template(data);
                        }));

                    } else {
                        alert(view + " not found");
                    }
                });
                $.when.apply(null, deferreds).done(callback);
            },

            loadLanguage: function(views, callback) {
                var lang = app.utils.getLanguage();

                var deferredLanguages = [];
                $.each(views, function(index, view) {
                    if (app.views[view]) {

                        /** load language const **/
                        deferredLanguages.push($.getJSON('js/languages/' + lang + '/app.languages.' + view + '.json', function(dataLang) {
                            app.views[view].prototype.language = dataLang;
                        }));

                    } else {
                        alert(view + " not found");
                    }
                });
                $.when.apply(null, deferredLanguages).done(callback);
            },

            destroyViews: function(){

                $.each(app.views_array, function(index, view) {
                    if (app.global.views[view])    {app.global.views[view].destroy_view()};
                });

            }
        },

        /** app config **/
        const: {
            //env : 'development',
            //env : 'local',
            env : 'test',
            //env : 'production',
            weburl : function() {
                var url;
                switch(this.env) {
                    case'development':
                        url = 'http://nodelogprd-etrusco.c9users.io/';
                        break;
                    case'local':
                        url = 'http://localhost/';
                        break;
                    case 'test':
                        url = 'http://nodelogprd.herokuapp.com/';
                        break;
                    default:
                        url = location.protocol + '//' + location.hostname + '/';
                }
                return url;
            },
            apiurl : function() {
                return this.weburl() + 'api/';
            },
            version : '0.0.4'
        },
        

        /** app global var **/
        global: {
            socket : null,
            client_id: null,
            single_page: '',
            default_language : function(){
                var lang = window.navigator.userLanguage || window.navigator.language;
                lang = lang.substring(0,2);
                if ($.inArray(lang, app.languages) == -1)  {
                    lang = "en";
                }
                return lang;
            },
            views : {}
        },

        /** languages **/
        languages: ["en", "it"],

        views_array : ['index', 'login', 'registration', 'profile', 'welcome', 'footer', 'navbar', 'site', 'credits', 'dashboard', 'dashboardlink', 'project', 'password', 'resend', 'activate', 'error', 'adlarge', 'admedium', 'adsmall']

};