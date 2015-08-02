'use strict';

/**
 * @ngdoc service
 * @name craftyApp.recipemodal
 * @description
 * # recipemodal
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('RecipeModal', function ($modal, $log, FSContextConsole, FSSimTasks, FSSimRules, FSSimState) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	  this.ingredients = null;
	  this.buttonState = {};
	  this.animationsEnabled = true;
      this.itembgcolor = [];

      /**
     * @desc 
     * @return 
     */
	  this.open = function (size, category, cell) {
	  	this.category = category;
	  	this.cell = cell;
	  	this.ingredients =  FSSimRules.harvestableDefines[cell.harvestables.json.name].recipe;

        var hasWorkers = (Object.keys(FSSimState.characters).length >= FSSimRules.harvestableDefines[cell.harvestables.json.name].recipe.workers) ? true : false;

        // set button disabled state
	  	this.buttonState['ok'] = !hasWorkers;
	  	this.buttonState['cancel'] = false;

        // set ingredients
	    this.workerbgcolor = (hasWorkers === true) ? 'rgba(20, 200, 20, 0.25)' : 'rgba(200, 20, 20, 0.25)';

	    var modalInstance = $modal.open({
	      animation: this.animationsEnabled,
	      templateUrl: 'views/share/recipemodal.html',
	      controller: 'ModalInstanceCtrl',
	      size: size,
	      resolve: {
	      }
	    });

	    modalInstance.result.then(function () {
			FSContextConsole.clear();
			FSSimTasks.createCellTask(this.category, this.cell);
	    }.bind(this), function () {
	    });
	  };

     /**
     * @desc 
     * @return 
     */
	  this.toggleAnimation = function () {
	  	this.animationsEnabled = !this.animationsEnabled;
	  };



  });






// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('craftyApp').controller('ModalInstanceCtrl', [ '$scope', '$modalInstance', 'RecipeModal', function ($scope, $modalInstance, RecipeModal) {


  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.getRecipeModal = function() {
  		return RecipeModal;
  };

}]);