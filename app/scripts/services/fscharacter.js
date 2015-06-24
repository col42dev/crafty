'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSCharacter
 * @description
 * # FSCharacter
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
.factory('FSCharacter', function () {
	/**
	* Constructor, with class name
	*/
	function FSCharacter(characaterObj) {
		// Public properties, assigned to the instance ('this')
		this.key = characaterObj.key;
		this.firstName = characaterObj.firstName;
		this.lastName = characaterObj.lastName;
	}
 
	  /**
	   * Public method, assigned to prototype
	   */
	  FSCharacter.prototype.getFullName = function () {
	    return this.firstName + ' ' + this.lastName;
	  };


	 
	  /**
	   * Return the constructor function
	   */
	  return FSCharacter;
  });
