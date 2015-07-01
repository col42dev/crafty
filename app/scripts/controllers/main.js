'use strict';



/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',['$scope', '$http', 'FSService', 'stopwatch', function ($scope, $http, FSService, stopwatch) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.myStopwatch = stopwatch;




    //reset
    //$scope.master = {input: 'https://api.myjson.com/bins/3bd0c?pretty=1'};
    $scope.master = {input: 'https://api.myjson.com/bins/42h6a?pretty=1'};
    $scope.user = angular.copy($scope.master);
    $scope.loadJson = function() {

        console.log('input:' + $scope.user.input); 

        $http.get($scope.user.input,{
            params: {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                }
            }
        }).success(function(data) {

            if ( data.app === 'crafty') {
              $scope.data = data;
              setTimeout($scope.createSim, 200);
            } else {
              window.alert('Validation failed for ' + $scope.user.input);
            }

        }).error(function(data) {
            data = data;
            window.alert('JSON load failed for' + $scope.user.input);
        });
    };

 
    $scope.createSim = function() {
      console.log('Load JSON success'  + JSON.stringify($scope.data));
      FSService.createSimulation($scope, $scope.data);
      $scope.simulation = FSService.simulation;
      $scope.$apply();
      $scope.myStopwatch.reset();
      $scope.myStopwatch.start();
    };


    $scope.onClickGatherables = function(gatherableKey) {
  		$scope.simulation.startGathering( gatherableKey.name);
    };

    $scope.onClickGatherablesHeader = function(fieldName) {
      $scope.simulation.onClickGatherablesHeader( fieldName);
    };

    $scope.onClickBank = function(bankItemKey) {
      $scope.simulation.onClickBank( bankItemKey.name);
    };

    $scope.onClickBankHeader = function(fieldName) {
      $scope.simulation.onClickBankHeader( fieldName);
    };

    $scope.onClickCraftable = function(recipeKey) {
      $scope.simulation.startCrafting( recipeKey.name);
    };









  }]);
