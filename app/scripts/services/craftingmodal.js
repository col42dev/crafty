'use strict';

/**
 * @ngdoc service
 * @name craftyApp.recipemodal
 * @description
 * # recipemodal
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('CraftingModal', function ($modal, $log, FSContextConsole, FSSimTasks, FSSimRules, FSSimState) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var thisService = this;

	  this.items = ['item1', 'item2', 'item3'];
	  this.ingredients = null;
	  this.buttonState = {};

	  this.animationsEnabled = true;

      /**
     * @desc 
     * @return 
     */
	  this.open = function (size, craftableName) {

	  	this.craftableName = craftableName;
	  	this.ingredients =  FSSimRules.craftableDefines[this.craftableName.name];

	  	if ( Object.keys(FSSimState.characters).length >= 2) {
	  		this.buttonState['ok'] = false;
	  	} else {
	  		this.buttonState['ok'] = true;
	  	}
	  	this.buttonState['cancel'] = false;

	    this.workerbgcolor = ( Object.keys(FSSimState.characters).length >= 2) ? 'rgba(20, 200, 20, 0.25)' : 'rgba(200, 20, 20, 0.25)';


	    var modalInstance = $modal.open({
	      animation: this.animationsEnabled,
	      templateUrl: '/views/share/craftingmodal.html',
	      controller: 'ModalInstanceCraftingCtrl',
	      size: size,
	      resolve: {
	        items: function () {
	          return thisService.items;
	        }.bind(this)
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {

			this.selected = selectedItem;
			$log.info('Modal result at: ' + new Date());

			FSSimTasks.createTask('craftable', this.craftableName.name);

	    }.bind(this), function () {
	      $log.info('Modal dismissed at: ' + new Date());
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

angular.module('craftyApp').controller('ModalInstanceCraftingCtrl', [ '$scope', '$modalInstance', 'items', 'CraftingModal', function ($scope, $modalInstance, items, CraftingModal) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.getCraftingModal = function() {
  		return CraftingModal;
  };

}]);