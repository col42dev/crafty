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
	function FSCharacter(characaterObj, ctrllerScope) {
		// Public properties, assigned to the instance ('this')
		this.key = characaterObj.key;
		this.firstName = characaterObj.firstName;
		this.lastName = characaterObj.lastName;
		this.activity = null;
		this.activityCompletedCallback = null;
		this.ctrllerScope = ctrllerScope;
		this.bgcolor = '#FFFFFF';
		console.log('scope:'+this.ctrllerScope);

	}
 
	/**
	* Public method, assigned to prototype
	*/
	FSCharacter.prototype.getFullName = function () {
		return this.firstName + ' ' + this.lastName;
	};

	FSCharacter.prototype.startGathering = function ( gatherablesName, stopGatheringCallback) {
		this.activity = gatherablesName ;
		this.activityCompletedCallback = stopGatheringCallback;
		console.log('FSCharacter.prototype.startGathering' + gatherablesName);
		setTimeout(this.stopGathering.bind(this), 500);
		this.bgcolor = '#FF0000';
	};

	FSCharacter.prototype.stopGathering = function () {
		this.activityCompletedCallback.context.stopGathering( this.activity );
		this.activity = null ;
		this.bgcolor = '#FFFFFF';
		console.log('FSCharacter.prototype.stopGathering');
		console.log('stopGathering scope:'+this.ctrllerScope);
		this.ctrllerScope.$apply();
	};


	/**
	* Return the constructor function
	*/
	return FSCharacter;
  });
