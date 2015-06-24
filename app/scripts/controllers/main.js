'use strict';

/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
