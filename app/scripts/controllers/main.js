'use strict';

/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',['$scope', 'FSService', '$location', function ($scope, FSService, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.numberOfCharacters = 4;

    FSService.createSimulation($scope.numberOfCharacters);

    $scope.simulation = FSService.simulation;

    console.log( $scope.simulation.characterArray.length);

  }]);
