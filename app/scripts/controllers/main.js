'use strict';



/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',['$scope', 'FSService', 'FSSimRules', 'FSSimState', 'FSContextConsole', 'FSSimObjectFactory', 'FSSimBank', 'FSSimRewards', function ($scope, FSService, FSSimRules, FSSimState, FSContextConsole, FSSimObjectFactory, FSSimBank, FSSimRewards) {


    $scope.getFSService = function() {
      return FSService;
    };

    $scope.getFSSimRules = function() {
      return FSSimRules;
    };

    $scope.getFSSimState = function() {
      return FSSimState;
    };

    $scope.getFSContextConsole = function() {
      return FSContextConsole;
    };

    $scope.getFSSimRewards = function() {
      return FSSimRewards;
    };

    FSService.init( $scope);



  }]);
