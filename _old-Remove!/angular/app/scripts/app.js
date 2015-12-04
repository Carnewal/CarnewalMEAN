'use strict';

angular.module('Carnewal', [
    'ngAnimate',
    'ui.router',
    'home'
            /* 'ngCookies',
             'ngResource',
             'ngRoute',
             'ngSanitize',
             'ngTouch'*/
]).config(function ($stateProvider, urlRouterProvider) {

    $stateProvider.state('home', {
        url: '/home'
    });
    
    $urlRouterProvider.otherwise('home');
});
