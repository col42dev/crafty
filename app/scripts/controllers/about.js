'use strict';

/**
 * @ngdoc function
 * @name craftyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
