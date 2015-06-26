'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSFactory
 * @description
 * # FSFactory
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSFactory', function (FSCharacter) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /**
   	* Constructor, with class name
    */
  	var FSFactory = function(characterCount, ctrllerScope, json) {
    // Public properties, assigned to the instance ('this')

	    this.initialize = function() {

	     	this.numberOfCharacters = characterCount;

	     	console.log('FSFactory:initilize ' + this.numberOfCharacters);

	     	// Characters
		    this.characterArray = [];  
 			json['characters'].forEach( ( function(thisCharacter) {
	          	this.characterArray.push( new FSCharacter(thisCharacter, ctrllerScope));
	        }).bind(this)); 

	        // Gatherables
	        var Gatherable = function( obj) { 
	        	this.bgcolor =  function( ) {				
					return  (this.gatherers > 0) ? '#FF0000' : '#FFFFFF';				
				};
				this.quantity = obj.quantity;
				this.gatherers = obj.gatherers;
			};

	        this.gatherables = {};  
	        json['gatherables'].forEach( ( function(thisGatherables) {
	        	var obj = thisGatherables;
	        	obj.gatherers = 0;
	          	this.gatherables[thisGatherables.name] = new Gatherable(obj);
	        }).bind(this)); 

			// bank
	        this.bank = {};  

			// recipes
			var thisFactory = this;
			var Recipe = function( obj) { 
				this.bgcolor =  function( ) {
					var hasResources = true;
					for (var key in obj.input) {
					    if (obj.input.hasOwnProperty(key)) {

					        if (key in thisFactory.bank) {
						        if ( thisFactory.bank[key] < obj.input[key]) {
						        	hasResources = false;
						        }
					    	} else {
					    		hasResources = false;
					    	}
					    }
					}
					return  (hasResources === true) ? '#00FF00' : '#FF0000';
				};

				this.input = obj.input;
				this.output = obj.output;
				this.basetime = obj.basetime;
			};

			// Recipes
	        this.recipes = {};  
	       	json['recipes'].forEach( ( function(thisRecipe) {
	        	var obj = thisRecipe;
	          	this.recipes[thisRecipe.name] = new Recipe(obj);
	        }).bind(this)); 
	    };

		/**
		 * @desc 
		 * @return 
		 */
		this.startGathering = function (gatherableType) {

			var assignedCharacter = null;
			var leastActivitiesCount = 1000;
			angular.forEach(this.characterArray, ( function(thisCharacter) {
				if ( thisCharacter.activity.length < leastActivitiesCount) {
					leastActivitiesCount = thisCharacter.activity.length;
					assignedCharacter = thisCharacter;
				}
			}.bind(this)));
	
			if ( assignedCharacter !== null) {
			    assignedCharacter.startGathering( gatherableType, { callback: this.stopGathering, context: this} );
			    this.gatherables[gatherableType].gatherers ++;
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.stopGathering = function (gatherableType) {
			this.gatherables[gatherableType].quantity -= 1;
			this.gatherables[gatherableType].gatherers --;

			if (gatherableType in this.bank) {
				this.bank[gatherableType] += 1;
			} else {
				this.bank[gatherableType] = 1;
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.startRecipe = function (recipeKey) {
		   	// determine if has reqiored ingredients in bank
		   	var hasIngredients = true;
		    var recipeInputObj = this.recipes[recipeKey].input;
			var recipeInputKeys = Object.keys( recipeInputObj );

			recipeInputKeys.forEach( function ( recipeKey ) {
				var recipeInput = recipeKey;
				var recipeInputQuantity = recipeInputObj[ recipeKey];

				if (recipeInput in this.bank) {
					if ( this.bank[ recipeInput ] < recipeInputQuantity) {
						hasIngredients = false;
						console.log('does not have ingredient quantity:' + recipeInput + ', ' + recipeInputQuantity);
					}
				} else {
					console.log('does not have ingredient:' + recipeInput);
					hasIngredients = false;
				}
			}.bind(this));

			console.log('has ingredients:' + hasIngredients);

			if ( hasIngredients === true) {

				var assignedCharacter = null;
				var leastActivitiesCount = 1000;
				angular.forEach(this.characterArray, ( function(thisCharacter) {
					if ( thisCharacter.activity.length < leastActivitiesCount) {
						leastActivitiesCount = thisCharacter.activity.length;
						assignedCharacter = thisCharacter;
					}
				}.bind(this)));
	

			    if ( assignedCharacter !== null) {

		          	assignedCharacter.startRecipe( recipeKey, { callback: this.stopRecipe, context: this} );

		          	// subtract resources from bank.
		          	recipeInputKeys.forEach( function ( recipeKey ){

						var recipeInput = recipeKey;
						var recipeInputQuantity = recipeInputObj[ recipeKey];

						this.bank[ recipeInput ] -= recipeInputQuantity;
	
					}.bind(this));
			    }

			}
			
		};

		this.stopRecipe = function (recipeKey) {
			// generate output in bank
			var recipeOutputObj = this.recipes[recipeKey].output;
			var recipeOutputKey = Object.keys( recipeOutputObj );

			// assumes only one type is recipeOutput
			var recipeOutput = recipeOutputKey[0];
			var recipeOutputQuantity = recipeOutputObj[ recipeOutput ];
			
			// add output
			if (recipeOutput in this.bank) {
				this.bank[recipeOutput] += recipeOutputQuantity;
			} else {
				this.bank[recipeOutput] = recipeOutputQuantity;
			}
		};


	   
	    // Call the initialize function for every new instance
	    this.initialize();
  	};

	/**
	* Return the constructor function.
	*/
	return FSFactory;
});
