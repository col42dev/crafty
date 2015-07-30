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

    /*
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.defaults.headers.common['Accept'] = 'application/json';
      $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
      */

  
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/worldmap.html',
        controller: 'MainCtrl'
      })
      .when('/character', {
        templateUrl: 'views/pages/character.html',
        controller: 'MainCtrl'
      })
      .when('/rules', {
        templateUrl: 'views/pages/rules.html',
        controller: 'MainCtrl'
      })
      .when('/rewards', {
        templateUrl: 'views/pages/rewards.html',
        controller: 'MainCtrl'
      })
      .when('/timers', {
        templateUrl: 'views/pages/timers.html',
        controller: 'MainCtrl'
      })
      .when('/mapedit', {
        templateUrl: 'views/pages/worldmapedit.html',
        controller: 'MainCtrl'
      })
      .when('/craft', {
        templateUrl: 'views/pages/craft.html',
        controller: 'MainCtrl'
      })
      .when('/load', {
        templateUrl: 'views/pages/load.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  }]);
