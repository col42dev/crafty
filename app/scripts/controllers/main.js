'use strict';



/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',['$scope', 'FSJSONLoader', 'FSSimRules', 'FSSimState', 'FSContextConsole', 'FSSimObjectFactory', 'FSSimBank', 'FSSimRewards', 'FSUIEventHandler', 'FSSimTasks', 'MapEdit', 'World', function ($scope, FSJSONLoader, FSSimRules, FSSimState, FSContextConsole, FSSimObjectFactory, FSSimBank, FSSimRewards, FSUIEventHandler, FSSimTasks, MapEdit, World) {

    $scope.getFSJSONLoader = function() {
      return FSJSONLoader;
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

    $scope.getFSUIEventHandler = function() {
      return FSUIEventHandler;
    };

    $scope.getFSSimTasks = function() {
      return FSSimTasks;
    };

    $scope.getMapEdit = function() {
      return MapEdit;
    };

    $scope.getWorld = function() {
      return World;
    };

  }]);
