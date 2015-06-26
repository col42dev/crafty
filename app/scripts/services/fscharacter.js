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
		setTimeout(this.stopGathering.bind(this), 2000);
		this.bgcolor = '#FF0000';
	};

	FSCharacter.prototype.stopGathering = function () {
		this.activityCompletedCallback.context.stopGathering( this.activity );
		this.activity = null ;
		this.bgcolor = '#FFFFFF';
		this.ctrllerScope.$apply();
	};

	FSCharacter.prototype.startRecipe = function ( recipeName, stopRecipeCallback) {
		this.activity = recipeName ;
		this.activityCompletedCallback = stopRecipeCallback;
		console.log('FSCharacter.prototype.startRecipe' + recipeName);
		setTimeout(this.stopRecipe.bind(this), 2000);
		this.bgcolor = '#FF0000';
	};

	FSCharacter.prototype.stopRecipe = function () {
		this.activityCompletedCallback.context.stopRecipe( this.activity );
		this.activity = null ;
		this.bgcolor = '#FFFFFF';
		console.log('FSCharacter.prototype.stopRecipe');
		console.log('stopRecipe scope:'+this.ctrllerScope);
		this.ctrllerScope.$apply();
	};


	/**
	* Return the constructor function
	*/
	return FSCharacter;
  });
