'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
        'ngRoute',
        'myApp.services',
        'myApp.servicesa',
        'myApp.directives',
        'myApp.controllers'
    ]).
    config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider) {
        $routeProvider.when('/', {templateUrl: 'index.html', controller: 'PageCtrl'});
        $routeProvider.otherwise({redirectTo: '/'});
//
//        $locationProvider
//            .html5Mode(false)
//            .hashPrefix('!');
    }]);