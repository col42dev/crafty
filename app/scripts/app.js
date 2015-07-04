'use strict';

/**
 * @ngdoc overview
 * @name craftyApp
 * @description
 * # craftyApp
 *
 * Main module of the application.
 */
angular
  .module('craftyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/character', {
        templateUrl: 'views/character.html',
        controller: 'MainCtrl'
      })
      .when('/reference', {
        templateUrl: 'views/reference.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  }]);
