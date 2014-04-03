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
        ':lang/dashboard':          'dashboard',
        ':lang/report':             'report',
        ':lang/report/type_id/:type_id':      'report',
        ':lang/credits':            'credits',
        ':lang/project':            'project',
        ':lang/resend':                     'resend',
        ':lang/activate/:id/:apikey':       'activate',
        '*undefined':                       'error'
    },
    /** public function **/
    index: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        /** render navbar view **/
        app.global.navbarView = new app.views.navbar();
        app.global.navbarView.render();
        $('#navbar_content').html(app.global.navbarView.el);
        /** render index view **/
        app.global.indexView = new app.views.index();
        app.global.indexView.render();
        $('#content').html(app.global.indexView.el);
        /** render footer view **/
        app.global.footerView = new app.views.footer();
        app.global.footerView.render();
        $('#footer_content').html(app.global.footerView.el);

        this.navigate('#!' + lang, { trigger : false });
    },
    /** public function **/
    login: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            /** render navbar view **/
            app.global.navbarView = new app.views.navbar();
            app.global.navbarView.render();
            $('#navbar_content').html(app.global.navbarView.el);
            /** render login view **/
            app.global.loginView = new app.views.login();
            app.global.loginView.render();
            $('#content').html(app.global.loginView.el);
            /** render footer view **/
            app.global.footerView = new app.views.footer();
            app.global.footerView.render();
            $('#footer_content').html(app.global.footerView.el);

            this.navigate('#!' + lang + '/login', { trigger : false });
        }
        else {
            this.dashboard();
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
            app.global.navbarView = new app.views.navbar();
            app.global.navbarView.render();
            $('#navbar_content').html(app.global.navbarView.el);
            /** render registration view **/
            app.global.registrationView = new app.views.registration();
            app.global.registrationView.render();
            $('#content').html(app.global.registrationView.el);
            /** render footer view **/
            app.global.footerView = new app.views.footer();
            app.global.footerView.render();
            $('#footer_content').html(app.global.footerView.el);

            this.navigate('#!' + lang + '/registration', { trigger : false });
        }
        else {
            this.dashboard();
        }
    },
    /** private function **/
    dashboard: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        if (app.global.tokensCollection.length == 0) {
            this.index();
        }
        else {
            /** render navbar view **/
            app.global.navbarView = new app.views.navbar();
            app.global.navbarView.render();
            $('#navbar_content').html(app.global.navbarView.el);
            /** render dashboard view **/
            app.global.dashboardView = new app.views.dashboard();
            app.global.dashboardView.render();
            $('#content').html(app.global.dashboardView.el);
            /** render sidebar view **/
            app.global.sidebarView = new app.views.sidebar();
            app.global.sidebarView.render('dashboard');
            $('#sidebar_content').html(app.global.sidebarView.el);
            /** render footer view **/
            app.global.footerView = new app.views.footer();
            app.global.footerView.render();
            $('#footer_content').html(app.global.footerView.el);

            this.navigate('#!' + lang + '/dashboard', { trigger : false });
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
            app.global.navbarView = new app.views.navbar();
            app.global.navbarView.render();
            $('#navbar_content').html(app.global.navbarView.el);
            /** render profile view **/
            app.global.profileView = new app.views.profile();
            app.global.profileView.render();
            $('#content').html(app.global.profileView.el);
            /** render sidebar view **/
            app.global.sidebarView = new app.views.sidebar();
            app.global.sidebarView.render('profile');
            $('#sidebar_content').html(app.global.sidebarView.el);
            /** render footer view **/
            app.global.footerView = new app.views.footer();
            app.global.footerView.render();
            $('#footer_content').html(app.global.footerView.el);

            this.navigate('#!' + lang + '/profile', { trigger : false });
        }
    },
    /** private function **/
    report: function(lng, type_id) {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();
        if (typeof type_id === 'undefined') {
            type_id = 0;
        }
        if (app.global.tokensCollection.length == 0) {
            this.index();
        }
        else {
            /** render navbar view **/
            app.global.navbarView = new app.views.navbar();
            app.global.navbarView.render();
            $('#navbar_content').html(app.global.navbarView.el);
            /** render report view **/
            app.global.reportView = new app.views.report();
            app.global.reportView.render(type_id);
            $('#content').html(app.global.reportView.el);
            /** render sidebar view **/
            app.global.sidebarView = new app.views.sidebar();
            app.global.sidebarView.render('report');
            $('#sidebar_content').html(app.global.sidebarView.el);
            /** render footer view **/
            app.global.footerView = new app.views.footer();
            app.global.footerView.render();
            $('#footer_content').html(app.global.footerView.el);

            /** set css - bugfix bootstrap and google maps**/
            app.global.reportView.init_map();

            this.navigate('#!' + lang + '/report', { trigger : false });
        }
    },
    /** public function **/
    credits: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        /** render navbar view **/
        app.global.navbarView = new app.views.navbar();
        app.global.navbarView.render();
        $('#navbar_content').html(app.global.navbarView.el);
        /** render credits view **/
        app.global.creditsView = new app.views.credits();
        app.global.creditsView.render();
        $('#content').html(app.global.creditsView.el);
        /** render footer view **/
        app.global.footerView = new app.views.footer();
        app.global.footerView.render();
        $('#footer_content').html(app.global.footerView.el);

        this.navigate('#!' + lang + '/credits', { trigger : false });

    },
    /** public function **/
    project: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        /** render navbar view **/
        app.global.navbarView = new app.views.navbar();
        app.global.navbarView.render();
        $('#navbar_content').html(app.global.navbarView.el);
        /** render documentation view **/
        app.global.projectView = new app.views.project();
        app.global.projectView.render();
        $('#content').html(app.global.projectView.el);
        /** render footer view **/
        app.global.footerView = new app.views.footer();
        app.global.footerView.render();
        $('#footer_content').html(app.global.footerView.el);

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
            app.global.navbarView = new app.views.navbar();
            app.global.navbarView.render();
            $('#navbar_content').html(app.global.navbarView.el);
            /** render password view **/
            app.global.passwordView = new app.views.password();
            app.global.passwordView.render();
            $('#content').html(app.global.passwordView.el);
            /** render sidebar view **/
            app.global.sidebarView = new app.views.sidebar();
            app.global.sidebarView.render('password');
            $('#sidebar_content').html(app.global.sidebarView.el);
            /** render footer view **/
            app.global.footerView = new app.views.footer();
            app.global.footerView.render();
            $('#footer_content').html(app.global.footerView.el);

            this.navigate('#!' + lang + '/password', { trigger : false });
        }
    },
    /** public function **/
    resend: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        /** render navbar view **/
        app.global.navbarView = new app.views.navbar();
        app.global.navbarView.render();
        $('#navbar_content').html(app.global.navbarView.el);
        /** render resend view **/
        app.global.resendView = new app.views.resend();
        app.global.resendView.render();
        $('#content').html(app.global.resendView.el);
        /** render footer view **/
        app.global.footerView = new app.views.footer();
        app.global.footerView.render();
        $('#footer_content').html(app.global.footerView.el);

        this.navigate('#!' + lang + '/resend', { trigger : false });

    },
    /** public function **/
    activate: function(lang, id, apikey) {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        /** render navbar view **/
        app.global.navbarView = new app.views.navbar();
        app.global.navbarView.render();
        $('#navbar_content').html(app.global.navbarView.el);
        /** render activate view **/
        app.global.activateView = new app.views.activate();
        app.global.activateView.render();
        $('#content').html(app.global.activateView.el);
        /** render footer view **/
        app.global.footerView = new app.views.footer();
        app.global.footerView.render();
        $('#footer_content').html(app.global.footerView.el);

        /** activate apiKey **/
        app.global.activateView.init_activate(id, apikey);

        this.navigate('#!' + lang + '/activate/' + id + '/' + apikey, { trigger : false });

    },
    /** public function **/
    error: function() {
        /** load data from localstorage service **/
        app.utils.loadTokens();
        var lang = app.utils.getLanguage();

        /** render navbar view **/
        app.global.navbarView = new app.views.navbar();
        app.global.navbarView.render();
        $('#navbar_content').html(app.global.navbarView.el);
        /** render error view **/
        app.global.errorView = new app.views.error();
        app.global.errorView.render();
        $('#content').html(app.global.errorView.el);
        /** render footer view **/
        app.global.footerView = new app.views.footer();
        app.global.footerView.render();
        $('#footer_content').html(app.global.footerView.el);

        this.navigate('#!' + lang + '/error', { trigger : false });

    }
});
