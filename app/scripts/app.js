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
      $httpProvider.defaults.withCredentials = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.defaults.headers.common['Accept'] = 'application/json';
      $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

  
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/main.html',
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
      .when('/db', {
        templateUrl: 'views/pages/db.html',
        controller: 'MainCtrl'
      })
      .when('/mapedit', {
        templateUrl: 'views/pages/mapedit.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  }]);
