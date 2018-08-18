'use strict';
/**
 * Config constant
 */
ChatApp.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});
ChatApp.constant('JS_REQUIRES', {
    scripts: {
        'AppCtrl': 'app/js/controllers/appCtrl.js?version=1.2-Mar-05',
        'RegisterCtrl': 'app/js/controllers/registerCtrl.js?version=1.2-Mar-05',
        'DashboardCtrl': 'app/js/controllers/dashboardCtrl.js?version=1.2-Mar-05',
        'ChatCtrl': 'app/js/controllers/chatCtrl.js?version=1.2-Mar-05'
    },
    modules: [{
            name: 'RegisterCss',
            files: ['app/css/register.css?version=1.2-Mar-05']
        }, {
            name: 'DashboardCss',
            files: ['app/css/dashboard.css?version=1.2-Mar-05']
        }, {
            name: 'ChatCss',
            files: ['app/css/chat.css?version=1.2-Mar-05']
        }, {
            name: 'HelperCss',
            files: ['app/css/helper.css?version=1.2-Mar-05']
        }, {
            name: 'FontAwesome',
            files: ['app/css/font-awesome.min.css?version=1.2-Mar-05']
        }, {
            name: 'MaterialCss',
            files: ['app/css/angular-material.min.css?version=1.2-Mar-05']
        }, {
            name: 'NgSanitizeJs',
            files: ['app/plugins/angular-1.6.6/angular-sanitize.min.js?version=1.2-Mar-05']
        }, {
            name: 'NgStorageJs',
            files: ['app/plugins/angular-1.6.6/ngStorage.js?version=1.2-Mar-05']
        }
    ]
});
