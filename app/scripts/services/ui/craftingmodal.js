'use strict';

/**
 * @ngdoc service
 * @name craftyApp.recipemodal
 * @description
 * # recipemodal
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('CraftingModal', function ($modal, $log, FSContextConsole, FSSimTasks, FSSimRules, FSSimState, FSSimCrafting) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	  this.ingredients = null;
	  this.buttonState = {}; // disiable button control
      this.itembgcolor = {}; // ingredients red/green coloring
	  this.animationsEnabled = true;

      /**
     * @desc 
     * @return 
     */
	  this.open = function (size, craftableName) {

	  	this.craftableName = craftableName;
	  	this.ingredients =  FSSimRules.craftableDefines[this.craftableName.name];

      var hasWorkers = ( Object.keys(FSSimState.characters).length >= FSSimRules.craftableDefines[this.craftableName.name].workers) ? true : false;
      // button states
      this.buttonState['ok'] = !hasWorkers;
      if ( FSSimCrafting.hasCraftingIngredients(this.craftableName.name, false) !== true) {
        this.buttonState['ok'] = true;
      }
      if ( FSSimCrafting.hasCraftingConstructor(this.craftableName.name, false) !== true) {
        this.buttonState['ok'] = true;
      }
      this.buttonState['cancel'] = false;

        // bg colors
	    this.workerbgcolor = (hasWorkers === true) ? 'rgba(20, 200, 20, 0.25)' : 'rgba(200, 20, 20, 0.25)';
      for ( var thisItem in FSSimRules.craftableDefines[this.craftableName.name].input) {
          var quantityRequired = FSSimRules.craftableDefines[this.craftableName.name].input[thisItem];
          var quantityInBank = 0;
          if ( FSSimState.bank.hasOwnProperty(thisItem) === true) {
              quantityInBank = FSSimState.bank[thisItem].json.quantity;
          }
          if ( quantityInBank  >= quantityRequired) {
              this.itembgcolor[thisItem] = 'rgba(20, 200, 20, 0.25)';
          } else {
              this.itembgcolor[thisItem] = 'rgba(200, 20, 20, 0.25)';
          }
      }

	    var modalInstance = $modal.open({
	      animation: this.animationsEnabled,
	      templateUrl: 'views/share/craftingmodal.html',
	      controller: 'ModalInstanceCraftingCtrl',
	      size: size,
	      resolve: {
	      }
	    });

	    modalInstance.result.then(function () {
            FSSimTasks.createTask('craftable', this.craftableName.name);
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

angular.module('craftyApp').controller('ModalInstanceCraftingCtrl', [ '$scope', '$modalInstance', 'CraftingModal', function ($scope, $modalInstance, CraftingModal) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.getCraftingModal = function() {
  		return CraftingModal;
  };

}]);