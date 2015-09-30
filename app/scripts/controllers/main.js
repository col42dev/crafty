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
    'FSMapState',  
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
    'CraftingModal',
    'GDocs',
  function (
    $scope, 
    FSJSONLoader, 
    FSSimRules, 
    FSSimState, 
    FSMapState,
    FSContextConsole, 
    FSSimObjectFactory, 
    FSSimBank, 
    FSSimRewards, 
    FSUIEventHandler, 
    FSSimTasks, 
    WorldMapEdit, 
    WorldMap,
    ServerSideTimers,
    RecipeModal,
    CraftingModal,
    GDocs)
     {

    $scope.getFSJSONLoader = function() {
      return FSJSONLoader;
    };

    $scope.getFSSimRules = function() {
      return FSSimRules;
    };

    $scope.getFSMapState = function() {
      return FSMapState;
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

    $scope.getFSSimBank = function() {
      return FSSimBank;
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
      return RecipeModal;
    };

    $scope.getCraftingModal = function() {
      return CraftingModal;
    };

    $scope.getGDocs = function() {
      return GDocs;
    };




  }]);
