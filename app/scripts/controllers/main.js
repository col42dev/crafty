'use strict';



/**
 * @ngdoc function
 * @name craftyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the craftyApp
 */
angular.module('craftyApp')
  .controller('MainCtrl',['$scope', '$http', 'FSService', function ($scope, $http, FSService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //reset
    $scope.master = {input: 'https://api.myjson.com/bins/3e4jo?pretty=1'};
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

    $scope.numberOfCharacters = 4;
    

 
    $scope.createSim = function() {
      console.log('Load JSON success'  + JSON.stringify($scope.data));
      FSService.createSimulation($scope.numberOfCharacters, $scope, $scope.data);
      $scope.simulation = FSService.simulation;
      $scope.$apply();
    };


    $scope.onClickGatherables = function(gatherableKey) {
  		console.log(gatherableKey);
  		$scope.simulation.startGathering( gatherableKey);
    };

    $scope.onClickRecipes = function(recipeKey) {
  		console.log(recipeKey);
  		$scope.simulation.startRecipe( recipeKey);
    };





  }]);
