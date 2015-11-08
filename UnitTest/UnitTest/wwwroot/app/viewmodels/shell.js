define(['plugins/router', 'durandal/app', 'jquery'], function(router, app, $) {

    mobileMenuToggle = function() {
        $('.mobileMenuLink').slideToggle();

    };

    return {
        router: router,
        activate: function() {
            router.map([{
                route: '',
                title: 'Dashboard',
                icon: 'icon-information',
                moduleId: 'viewmodels/welcome',
                nav: true
            }, {
                route: 'Unit-Authentication',
                title: 'Unit Authentication',
                icon: 'icon-auth',
                moduleId: 'viewmodels/unit/remodelAuth',
                nav: true
            }, {
                route: 'Unit-Entity',
                title: 'Unit Entity',
                icon: 'icon-entity',
                moduleId: 'viewmodels/unit/remodelEntity',
                nav: true
            }, {
                route: 'Unit-Flex',
                title: 'Unit Flex',
                icon: 'icon-entity',
                moduleId: 'viewmodels/unit/remodelFlex',
                nav: true
            }, {
                route: 'Unit-Claim',
                title: 'Unit Claims',
                icon: 'icon-claims',
                moduleId: 'viewmodels/unit/remodelClaim',
                nav: true
            }, {
                route: 'Manage-Documents',
                title: 'Manage Documents',
                icon: 'icon-docs',
                moduleId: 'viewmodels/unit/testing',
                nav: true
            }]).buildNavigationModel();

            return router.activate();
        }
    };
});
