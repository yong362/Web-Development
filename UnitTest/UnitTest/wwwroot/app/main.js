requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.1.0',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'jquery': '../lib/jquery/jquery-1.9.1.min',
        'xml2json': '../lib/xml2json/jquery.xml2json',
        'moment': '../lib/moment/moment',
        'googleapis': 'https://apis.google.com/js/client.js?onload=checkAuth',
        'dropzone': '../lib/dropzone/dropzone-amd-module',
        'jqueryui': '../lib/jquery-ui/jquery-ui-custom-1.11.4'
    },
    map: {
        '*': {
            ' jquery.ui.widget': 'jqueryui'
        }
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'xml2json': {
            deps: ['jquery']
        },
        'jqueryui': {
            deps: ['jquery'],
            exports: 'jqueryui'
        },
        'jquery.ui.widget': {
            deps: ['jqueryui'],
            exports: 'jquery.ui.widget'
        }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'bootstrap', 'jquery', 'jqueryui', 'knockout', 'plugins/widget'], function(system, app, viewLocator, bootstrap, $, jqueryui, ko, widget) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Cakifty';

    app.configurePlugins({
        router: true,
        dialog: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        ko.bindingHandlers.jqueryui = {
            update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                var widgetBindings = _getWidgetBindings(element, valueAccessor, allBindingsAccessor, viewModel);

                // Attach the jQuery UI Widget and/or update its options.
                // (The syntax is the same for both.)
                $(element)[widgetBindings.widgetName](widgetBindings.widgetOptions);
            }
        };

        function _getWidgetBindings(element, valueAccessor, allBindingsAccessor, viewModel) {
            // Extract widgetName and widgetOptions from the data binding,
            // with some sanity checking and error reporting.
            // Returns dict: widgetName, widgetOptions.

            var value = valueAccessor(),
                myBinding = ko.utils.unwrapObservable(value),
                allBindings = allBindingsAccessor();

            if (typeof(myBinding) === 'string') {
                // Short-form data-bind='jqueryui: "widget_name"'
                // with no additional options
                myBinding = {
                    'widget': myBinding
                };
            }

            var widgetName = myBinding.widget,
                widgetOptions = myBinding.options; // ok if undefined

            // Sanity check: can't directly check that it's truly a _widget_, but
            // can at least verify that it's a defined function on jQuery:
            if (typeof $.fn[widgetName] !== 'function') {
                throw new Error("jqueryui binding doesn't recognize '" + widgetName + "' as jQuery UI widget");
            }

            // Sanity check: don't confuse KO's 'options' binding with jqueryui binding's 'options' property
            if (allBindings.options && !widgetOptions && element.tagName !== 'SELECT') {
                throw new Error("jqueryui binding options should be specified like this:\n" + "  data-bind='jqueryui: {widget:\"" + widgetName + "\", options:{...} }'");
            }

            return {
                widgetName: widgetName,
                widgetOptions: widgetOptions
            };
        }

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});
