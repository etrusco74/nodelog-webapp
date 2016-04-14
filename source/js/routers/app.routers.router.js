/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.09
 * To change this template use File | Settings | File Templates.
 */
app.routers.router = Backbone.Router.extend({
    routes: {
        '':                         'index',
        ':lang':                    'index',
        ':lang/login':              'login',
        ':lang/logout':             'logout',
        'lang/:lang':               'lang',
        ':lang/registration':       'registration',
        ':lang/profile':            'profile',
        ':lang/password':           'password',
        ':lang/dashboard/:client_id':          'dashboard',
        ':lang/welcome':            'welcome',
        ':lang/site':               'site',
        ':lang/site/id/:id':        'site',
        ':lang/credits':            'credits',
        ':lang/project':            'project',
        ':lang/resend':                     'resend',
        ':lang/activate/:id/:apikey':       'activate',
        '*undefined':                       'error'
    },

    /** global function **/
    navBarContent: function(){
        app.global.views['navbar'] = new app.views.navbar();
        app.global.views['navbar'].render();
        $('#navbar_content').html(app.global.views['navbar'].el);
    },
    footerContent: function(){
        app.global.views['footer'] = new app.views.footer();
        app.global.views['footer'].render();
        $('#footer_content').html(app.global.views['footer'].el);
    },

    /** public function **/
    index: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        /** render navbar view **/
        this.navBarContent();
        /** render index view **/
        app.global.views['index'] = new app.views.index();
        app.global.views['index'].render();
        $('#content').html(app.global.views['index'].el);
        /** render footer view **/
        this.footerContent();

        this.navigate('#!' + lang, { trigger : false });
    },
    /** public function **/
    login: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            /** render navbar view **/
            this.navBarContent();
            /** render login view **/
            app.global.views['login'] = new app.views.login();
            app.global.views['login'].render();
            $('#content').html(app.global.views['login'].el);
            /** render footer view **/
            this.footerContent();

            this.navigate('#!' + lang + '/login', { trigger : false });
        }
        else {
            this.welcome();
        }
    },
    /** private function **/
    logout: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        if (app.global.tokensCollection.length > 0) {
            app.global.tokensCollection.each(function(model) { model.destroy(); } );
        }
        app.utils.destroyViews();
        this.index();
    },
    /** public function **/
    lang: function(lang) {
        /** set default language **/
        app.utils.setLanguage(lang);
        /** reload template and language **/
        app.utils.init(false);
    },
    /** public function **/
    registration: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            /** render navbar view **/
            this.navBarContent();
            /** render registration view **/
            app.global.views['registration'] = new app.views.registration();
            app.global.views['registration'].render();
            $('#content').html(app.global.views['registration'].el);
            /** render footer view **/
            this.footerContent();

            this.navigate('#!' + lang + '/registration', { trigger : false });
        }
        else {
            this.welcome();
        }
    },
    /** private function **/
    welcome: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            this.index();
        }
        else {
            /** render navbar view **/
            this.navBarContent();
            /** render welcome view **/
            app.global.views['welcome'] = new app.views.welcome();
            app.global.views['welcome'].render();
            $('#content').html(app.global.views['welcome'].el);
            /** render footer view **/
            this.footerContent();

            this.navigate('#!' + lang + '/welcome', { trigger : false });
        }
    },
    /** private function **/
    profile: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            this.index();
        }
        else {
            /** render navbar view **/
            this.navBarContent();
            /** render profile view **/
            app.global.views['profile'] = new app.views.profile();
            app.global.views['profile'].render();
            $('#content').html(app.global.views['profile'].el);
            /** render footer view **/
            this.footerContent();

            this.navigate('#!' + lang + '/profile', { trigger : false });
        }
    },
    /** private function **/
    site: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            this.index();
        }
        else {
            /** render navbar view **/
            this.navBarContent();
            /** render site view **/
            app.global.views['site'] = new app.views.site();
            app.global.views['site'].render();
            $('#content').html(app.global.views['site'].el);
            /** render footer view **/
            this.footerContent();

            this.navigate('#!' + lang + '/site', { trigger : false });
        }
    },
    /** public function **/
    credits: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();
        /** render navbar view **/
        this.navBarContent();
        /** render credits view **/
        app.global.views['credits'] = new app.views.credits();
        app.global.views['credits'].render();
        $('#content').html(app.global.views['credits'].el);
        /** render footer view **/
        this.footerContent();

        this.navigate('#!' + lang + '/credits', { trigger : false });

    },
    /** public function **/
    project: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();
        /** render navbar view **/
        this.navBarContent();
        /** render documentation view **/
        app.global.views['project'] = new app.views.project();
        app.global.views['project'].render();
        $('#content').html(app.global.views['project'].el);
        /** render footer view **/
        this.footerContent();

        this.navigate('#!' + lang + '/project', { trigger : false });

    },
    /** private function **/
    password: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            this.index();
        }
        else {
            /** render navbar view **/
            this.navBarContent();
            /** render password view **/
            app.global.views['password'] = new app.views.password();
            app.global.views['password'].render();
            $('#content').html(app.global.views['password'].el);
            /** render footer view **/
            this.footerContent();

            this.navigate('#!' + lang + '/password', { trigger : false });
        }
    },
    /** private function **/
    dashboard: function(lang, client_id) {

        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            this.index();
        }
        else {
            /** render navbar view **/
            this.navBarContent();
            /** render dashboard view **/
            app.global.views['dashboard'] = new app.views.dashboard();
            app.global.views['dashboard'].render();
            $('#content').html(app.global.views['dashboard'].el);
            /** render footer view **/
            this.footerContent();

            app.global.views['dashboard'].init_socket(client_id);

            this.navigate('#!' + lang + '/dashboard/' + client_id, { trigger : false });
        }
    },
    /** public function **/
    resend: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();
        /** render navbar view **/
        this.navBarContent();
        /** render resend view **/
        app.global.views['resend'] = new app.views.resend();
        app.global.views['resend'].render();
        $('#content').html(app.global.views['resend'].el);
        /** render footer view **/
        this.footerContent();

        this.navigate('#!' + lang + '/resend', { trigger : false });

    },
    /** public function **/
    activate: function(lang, id, apikey) {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();
        /** render navbar view **/
        this.navBarContent();
        /** render activate view **/
        app.global.views['activate'] = new app.views.activate();
        app.global.views['activate'].render();
        $('#content').html(app.global.views['activate'].el);
        /** render footer view **/
        this.footerContent();
        /** activate apiKey **/
        app.global.views['activate'].init_activate(id, apikey);

        this.navigate('#!' + lang + '/activate/' + id + '/' + apikey, { trigger : false });

    },
    /** public function **/
    error: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();
        /** render navbar view **/
        this.navBarContent();
        /** render error view **/
        app.global.views['error'] = new app.views.error();
        app.global.views['error'].render();
        $('#content').html(app.global.views['error'].el);
        /** render footer view **/
        this.footerContent();

        this.navigate('#!' + lang + '/error', { trigger : false });

    }
});
