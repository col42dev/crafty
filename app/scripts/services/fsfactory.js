'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSFactory
 * @description
 * # FSFactory
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSFactory', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /**
   	* Constructor, with class name
    */
  	var FSFactory = function(ctrllerScope, json) {

  		// FSCharacter
		var FSCharacter = function(characaterObj, ctrllerScope) {
			this.firstName = characaterObj.firstName;
			this.lastName = characaterObj.lastName;
			this.activity = [];
			this.activityCompletedCallback = [];
			this.ctrllerScope = ctrllerScope;
			this.bgcolor = '#FFFFFF';
		};
	 
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
			var fsFactory = this.activityCompletedCallback[0].context;
			var gatherableType = this.activity[0];

			fsFactory.gatherables[gatherableType].quantity -= 1;
			fsFactory.gatherables[gatherableType].gatherers --;

			if (!(gatherableType in fsFactory.bank)) {
				fsFactory.bank[gatherableType] = new FSObject({'category':'gatherable'});
			}
			fsFactory.bank[gatherableType].increment(1);

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
			var fsFactory = this.activityCompletedCallback[0].context;
			var recipeKey = this.activity[0];

			// generate output in bank
			var recipeOutputObj = fsFactory.gameItems[recipeKey].output;
			var recipeOutputKey = Object.keys( recipeOutputObj );

			// assumes only one type is recipeOutput
			var recipeOutput = recipeOutputKey[0];
			var recipeOutputQuantity = recipeOutputObj[ recipeOutput ];
			
			// add output to bank
			if (!(recipeOutput in fsFactory.bank)) {
				fsFactory.bank[recipeOutput] = new FSObject( {'category':fsFactory.gameItems[recipeKey].category});
			}
			fsFactory.bank[recipeOutput].increment( recipeOutputQuantity);

			this.activity.splice(0, 1);
			this.activityCompletedCallback.splice(0, 1);
			this.bgcolor = '#FFFFFF';
			this.ctrllerScope.$apply();
		};

  		//GameItem
		var GameItem = function( obj, thisFactory) { 
			this.thisFactory = thisFactory;
			this.input = obj.input;
			this.output = obj.output;
			this.basetime = obj.basetime;
			this.category = obj.category;
			this.construction = obj.construction;
			console.log('GameItem category:' + obj.category);

		};
		GameItem.prototype.bgcolor = function( ) {
			var hasResources = true;
			for (var key in this.input) {
			    if (this.input.hasOwnProperty(key)) {

			        if (key in this.thisFactory.bank) {
				        if ( this.thisFactory.bank[key].quantity.length < this.input[key] ) {
				        	hasResources = false;
				        }
			    	} else {
			    		hasResources = false;
			    	}
			    }
			}
			return  (hasResources === true) ? '#00FF00' : '#FF0000';
		};

		// FSObject
    	var FSObject = function(obj) { 
    		this.quantity = [];
    		this.category = obj.category;
    		console.log('FSObject category:' + obj.category);
		};
		FSObject.prototype.increment = function( amount) {
			for (var i = 0; i < amount; i ++) {
				this.quantity.push({});
			}
		};
		FSObject.prototype.decrement = function( amount) {
			for (var i = 0; i < amount; i ++) {
				this.quantity.pop();
			}
		};

		FSObject.prototype.bgcolor = function( ) {
			return  (this.category  === 'constructor') ? '#00FF00' : '#FFFFFF';
		};

		// FSRecipe
		var FSRecipe = function( name, thisFactory) { 
			this.name = name;
			this.thisFactory = thisFactory;
		};
		FSRecipe.prototype.bgcolor = function( ) {
			var hasResources = true;
			for (var key in this.thisFactory.gameItems[this.name].input) {

			    if (this.thisFactory.gameItems[this.name].input.hasOwnProperty(key)) {
			        if (key in this.thisFactory.bank) {
				        if ( this.thisFactory.bank[key].quantity.length < this.thisFactory.gameItems[this.name].input[key] ) {
				        	hasResources = false;
				        }
			    	} else {
			    		hasResources = false;
			    	}
			    }
			}
			return  (hasResources === true) ? '#00FF00' : '#FF0000';
		};

		// FSFactory
	    this.initialize = function() {
	
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

			// Bank
	        this.bank = {};  
	        this.bank['Workstation'] = new FSObject({'category':'constructor'});
	        this.bank['Workstation'].increment(1);

	        // Know Recipes
	        this.knownRecipes = json['knownRecipes'];  

			// Game Items
	        this.gameItems = {};  
	       	json['items'].forEach( ( function(thisGameItem) {
	        	var obj = thisGameItem;
	          	this.gameItems[thisGameItem.name] = new GameItem(obj, this);
	        }).bind(this)); 

	        // CraftStationa
	        this.viewedConstructor = {};
	        this.viewedConstructorName = null;
	    };

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickBank = function (bankItemKey) {

			this.viewedConstructor = {};
			if ( this.bank[bankItemKey].category === 'constructor') {
				this.viewedConstructorName = bankItemKey;
				Object.keys( this.gameItems ).forEach( ( function(thisGameItemKey) {
					var thisGameItem = this.gameItems[thisGameItemKey];
	        		if (thisGameItem.construction === bankItemKey) {
	          			this.viewedConstructor[thisGameItemKey] = new FSRecipe( thisGameItemKey, this);
	          		}
	        	}).bind(this)); 
			} else {
	        	this.viewedConstructorName = null;
			}
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
			    assignedCharacter.startGathering( gatherableType, { context: this} );
			    this.gatherables[gatherableType].gatherers ++;
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.startRecipe = function (recipeKey) {
		   	// determine if has reqiored ingredients in bank
		   	var hasIngredients = true;
		    var recipeInputObj = this.gameItems[recipeKey].input;
			var recipeInputKeys = Object.keys( recipeInputObj );

			recipeInputKeys.forEach( function ( recipeKey ) {
				var recipeInput = recipeKey;
				var recipeInputQuantity = recipeInputObj[ recipeKey];

				if (recipeInput in this.bank) {
					if ( this.bank[ recipeInput ].quantity.length < recipeInputQuantity) {
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

		          	assignedCharacter.startRecipe( recipeKey, { context: this} );

		          	// subtract resources from bank.
		          	recipeInputKeys.forEach( function ( recipeKey ){

						var recipeInput = recipeKey;
						var recipeInputQuantity = recipeInputObj[ recipeKey];

						this.bank[ recipeInput ].decrement( recipeInputQuantity);
	
					}.bind(this));
			    }
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
