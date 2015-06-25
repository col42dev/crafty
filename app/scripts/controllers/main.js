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
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.numberOfCharacters = 4;

    FSService.createSimulation($scope.numberOfCharacters, $scope);

    $scope.simulation = FSService.simulation;

    console.log( $scope.simulation.characterArray.length);

    $scope.onClickGatherables = function(gatherableKey) {
  		console.log(gatherableKey);
  		$scope.simulation.startGathering( gatherableKey);
	};

    $scope.onClickRecipes = function(recipeKey) {
  		console.log(recipeKey);
  		$scope.simulation.startRecipe( recipeKey);
	};


  }]);
