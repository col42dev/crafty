'use strict';



//angular.module('craftyApp', ['ui.bootstrap']);
/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',[
    '$scope', 
    'FSJSONLoader', 
    'FSSimRules', 
    'FSSimState', 
    'FSContextConsole', 
    'FSSimObjectFactory', 
    'FSSimBank', 
    'FSSimRewards', 
    'FSUIEventHandler', 
    'FSSimTasks', 
    'WorldMapEdit', 
    'WorldMap',
    'ServerSideTimers', 
    'RecipeModal',
  function (
    $scope, 
    FSJSONLoader, 
    FSSimRules, 
    FSSimState, 
    FSContextConsole, 
    FSSimObjectFactory, 
    FSSimBank, 
    FSSimRewards, 
    FSUIEventHandler, 
    FSSimTasks, 
    WorldMapEdit, 
    WorldMap,
    ServerSideTimers,
    RecipeModal)
     {

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

    $scope.getWorldMapEdit = function() {
      return WorldMapEdit;
    };

    $scope.getWorldMap = function() {
      return WorldMap;
    };

    $scope.getServerSideTimers = function() {
      return ServerSideTimers;
    };

    $scope.getRecipeModal = function() {
      console.log('RecipeModal');
      return RecipeModal;
    };


  }]);
