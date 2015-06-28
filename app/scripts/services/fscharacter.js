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
		this.firstName = characaterObj.firstName;
		this.lastName = characaterObj.lastName;
		this.activity = [];
		this.activityCompletedCallback = [];
		this.ctrllerScope = ctrllerScope;
		this.bgcolor = '#FFFFFF';
	}
 
	/**
	* Public method, assigned to prototype
	*/
	FSCharacter.prototype.getFullName = function () {
		return this.firstName + ' ' + this.lastName;
	};

	FSCharacter.prototype.startGathering = function ( gatherablesName, stopGatheringCallback) {
		this.activity.push( gatherablesName);
		this.activityCompletedCallback.push( stopGatheringCallback);
		setTimeout(this.stopGathering.bind(this), 2000);
		this.bgcolor = '#FF0000';
	};

	FSCharacter.prototype.stopGathering = function () {
		this.activityCompletedCallback[0].context.stopGathering( this.activity[0] );
		this.activity.splice(0, 1);
		this.activityCompletedCallback.splice(0, 1);

		this.bgcolor = '#FFFFFF';
		this.ctrllerScope.$apply();
	};

	FSCharacter.prototype.startRecipe = function ( recipeName, stopRecipeCallback) {
		this.activity.push(recipeName);
		this.activityCompletedCallback.push( stopRecipeCallback);
		setTimeout(this.stopRecipe.bind(this), 2000);
		this.bgcolor = '#FF0000';
	};

	FSCharacter.prototype.stopRecipe = function () {
		this.activityCompletedCallback[0].context.stopRecipe( this.activity[0] );
		this.activity.splice(0, 1);
		this.activityCompletedCallback.splice(0, 1);
		this.bgcolor = '#FFFFFF';
		this.ctrllerScope.$apply();
	};



	/**
	* Return the constructor function
	*/
	return FSCharacter;
  });
