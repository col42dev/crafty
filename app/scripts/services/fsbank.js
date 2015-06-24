'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSBank
 * @description
 * # FSBank
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSBank', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    	/**
	* Constructor, with class name
	*/
	function FSBank(gatherableObj) {
		// Public properties, assigned to the instance ('this')
		this.typename = gatherableObj.typename;
		this.quantity = gatherableObj.quantity;
	}

	/**
	* Return the constructor function
	*/
	return FSBank;
  });
