'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSGatherables
 * @description
 * # FSGatherables
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSGatherables', function () {
/**
	* Constructor, with class name
	*/
	function FSGatherables(gatherableObj) {
		// Public properties, assigned to the instance ('this')
		this.key = gatherableObj.key;
		this.typename = gatherableObj.typename;
		this.quantity = gatherableObj.quantity;
	}

	/**
	* Return the constructor function
	*/
	return FSGatherables;

  });
