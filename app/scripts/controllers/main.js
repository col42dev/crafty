'use strict';



/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',['$scope', 'FSService', function ($scope, FSService) {

    $scope.getFSService = function() {
      return FSService;
    };

    FSService.init( $scope);

  









  }]);
