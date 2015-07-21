'use strict';



/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',['$scope', 'FSService', 'FSSimRules', 'FSSimState', function ($scope, FSService, FSSimRules, FSSimState) {

    $scope.getFSService = function() {
      return FSService;
    };

    $scope.getFSSimRules = function() {
      return FSSimRules;
    };

    $scope.getFSSimState = function() {
      return FSSimState;
    };

    FSService.init( $scope);



  }]);
