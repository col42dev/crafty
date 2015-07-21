'use strict';



/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',['$scope', 'FSService', 'FSSimRules', function ($scope, FSService, FSSimRules) {

    $scope.getFSService = function() {
      return FSService;
    };

    $scope.getFSSimRules = function() {
      return FSSimRules;
    };


    FSService.init( $scope);



  }]);
