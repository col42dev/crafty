'use strict';

/**
 * @ngdoc service
 * @name craftyApp.recipemodal
 * @description
 * # recipemodal
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('RecipeModal', function ($modal, $log, FSContextConsole, FSSimTasks) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	  this.items = ['item1', 'item2', 'item3'];

	  this.animationsEnabled = true;

	  this.open = function (size, category, cell) {
	  	this.category = category;
	  	this.cell = cell;

	  	console.log('RecipeModal');

	    var modalInstance = $modal.open({
	      animation: this.animationsEnabled,
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      size: size,
	      resolve: {
	        items: function () {
	          return this.items;
	        }.bind(this)
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {

	      this.selected = selectedItem;
	      $log.info('Modal result at: ' + new Date());

	        FSContextConsole.clear();
            FSSimTasks.createCellTask(this.category, this.cell);

	    }.bind(this), function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  this.toggleAnimation = function () {
	    this.animationsEnabled = !this.animationsEnabled;
	  };

  });






// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('craftyApp').controller('ModalInstanceCtrl', [ '$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {

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
}]);