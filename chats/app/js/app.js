//var ChatApp = angular.module('ChatApp', ['ui.router', 'oc.lazyLoad', 'ngMaterial', 'webcam']);
var ChatApp = angular.module('ChatApp', ['ui.router', 'oc.lazyLoad', 'ngMaterial']);

var OneSignal = window.OneSignal || [];
OneSignal.push(function () {
    OneSignal.init({
        //appId: "fe9010f6-0bb3-464a-9e55-6aab21b2f944",// For Live
        appId: "6e32d074-a7dd-431e-8d71-95e95f0dcd95", // For Development
        autoRegister: true,
        notifyButton: {
            enable: false,
        },
        welcomeNotification: {
            "title": "Welcome to Chat App",
            "message": "Thank you so much!",
        },
        promptOptions: {
            /* actionMessage limited to 90 characters */
            actionMessage: "We'd like to show you notifications for your friends messages.",
            /* acceptButtonText limited to 15 characters */
            acceptButtonText: "ALLOW",
            /* cancelButtonText limited to 15 characters */
            cancelButtonText: "NO THANKS"
        },
        subdomainName: "mydevapp.OS.TC" // For Development
        //subdomainName: "mychatapp.OS.TC" // For Live
    });
});
