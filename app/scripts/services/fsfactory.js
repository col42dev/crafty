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

  		var thisFactory = this;

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

		FSCharacter.prototype.startGathering = function ( gatherablesName) {
			this.activity.push( gatherablesName);
			setTimeout(this.stopGathering.bind(this), thisFactory.gatherables[gatherablesName].gatherBaseTimeS * 1000);
			this.bgcolor = '#FF0000';
		};

		FSCharacter.prototype.stopGathering = function () {
			//var fsFactory = this.activityCompletedCallback[0].context;
			var gatherableType = this.activity[0];

			thisFactory.gatherables[gatherableType].quantity -= 1;
			thisFactory.gatherables[gatherableType].gatherers --;

			if (!(gatherableType in thisFactory.bank)) {
				thisFactory.bank[gatherableType] = new FSObject({'category':'gatherable', 'name':gatherableType});
			}
			thisFactory.bank[gatherableType].increment(1);
			thisFactory.updateBank();

			this.activity.splice(0, 1);
			this.bgcolor = '#FFFFFF';
			this.ctrllerScope.$apply();
		};

		FSCharacter.prototype.startCrafting = function ( craftableKey) {
			this.activity.push(craftableKey);
			setTimeout(this.stopCrafting.bind(this), thisFactory.gameItems[craftableKey].craftBaseTimeS * 1000);
			this.bgcolor = '#FF0000';
		};

		FSCharacter.prototype.stopCrafting = function () {
			var craftableKey = this.activity[0];

			// generate output in bank.
			var craftableOutputObj = thisFactory.gameItems[craftableKey].output;
			var craftableOutputKey = Object.keys( craftableOutputObj );

			// assumes only one type is craftableOutput.
			var craftableOutput = craftableOutputKey[0];
			var craftableOutputQuantity = craftableOutputObj[ craftableOutput ];
			
			// add output to bank.
			if (!(craftableOutput in thisFactory.bank)) {
				thisFactory.bank[craftableOutput] = new FSObject( {'category':thisFactory.gameItems[craftableKey].category, 'name':craftableOutput});
			}
			thisFactory.bank[craftableOutput].increment( craftableOutputQuantity);
			thisFactory.updateBank();

			this.activity.splice(0, 1);
			this.bgcolor = '#FFFFFF';
			this.ctrllerScope.$apply();
		};

		// Gatherables
        var Gatherable = function( obj) { 

        	this.name = obj.name;
			this.quantity = obj.quantity;
			this.gatherBaseTimeS = obj.gatherBaseTimeS;
			this.hardness = 1; //todo: datadrive	
			this.gatherers = obj.gatherers;
		};
		Gatherable.prototype.bgcolor =  function( ) {				
			return  (this.gatherers > 0) ? '#FF0000' : '#FFFFFF';				
		};


  		//GameItem
		var GameItem = function( obj, thisFactory) { 
			this.thisFactory = thisFactory;
			this.input = obj.input;
			this.output = obj.output;
			this.craftBaseTimeS = obj.basetime;
			this.category = obj.category;
			this.construction = obj.construction;
			this.toughness = 1; //todo: datadrive	
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
    		this.name = obj.name;
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
	        this.gatherables = {};  
	        json['gatherables'].forEach( ( function(thisGatherables) {
	        	var obj = thisGatherables;
	        	obj.gatherers = 0;
	          	this.gatherables[thisGatherables.name] = new Gatherable(obj);
	        }).bind(this)); 
	        this.gatherablesArray = Object.keys(thisFactory.gatherables).map(function (key) {
	        		return thisFactory.gatherables[key];
	        	});
	        this.orderGatherablesBy = 'name';
	        this.orderGatherablesByOrder = '+';
	        this.onClickGatherablesHeader = function ( fieldName) {
	        	this.orderGatherablesByOrder = (this.orderGatherablesByOrder==='+') ? '-' : '+';
	        	this.orderGatherablesBy = this.orderGatherablesByOrder + fieldName;
	        };	


			// Bank
	        this.bank = {};  
	        this.bank['Workstation'] = new FSObject({'category':'constructor', 'name':'Workstation'});
	        this.bank['Workstation'].increment(1);
	        this.updateBank = function() {
		        thisFactory.bankArray = Object.keys(thisFactory.bank).map(function (key) {
		        		return thisFactory.bank[key];
		        	});
	    	};
	    	this.updateBank();
	        this.orderBankBy = 'name';
	        this.orderBankByOrder = '+';
	        this.onClickBankHeader = function ( fieldName) {
	        	this.orderBankByOrder = (this.orderBankByOrder==='+') ? '-' : '+';
	        	this.orderBankBy = this.orderBankByOrder + fieldName;
	        };	

	        // Know Recipes
	        this.knownRecipes = json['knownRecipes'];  

			// Game Items
	        this.gameItems = {};  
	       	json['items'].forEach( ( function(thisGameItem) {
	        	var obj = thisGameItem;
	          	this.gameItems[thisGameItem.name] = new GameItem(obj, this);
	        }).bind(this)); 

	        // CraftStationa
	        this.viewedConstructor = [];
	        this.viewedConstructorName = null;
	    };

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickBank = function (bankItemKey) {

			this.viewedConstructor = [];
			if ( this.bank[bankItemKey].category === 'constructor') {
				this.viewedConstructorName = bankItemKey;
				Object.keys( this.gameItems ).forEach( ( function(thisGameItemKey) {
					var thisGameItem = this.gameItems[thisGameItemKey];
	        		if (thisGameItem.construction === bankItemKey) {
	          			this.viewedConstructor.push( new FSRecipe( thisGameItemKey, this));
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
			    assignedCharacter.startGathering( gatherableType);
			    this.gatherables[gatherableType].gatherers ++;
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.startCrafting = function (recipeKey) {
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

		          	assignedCharacter.startCrafting( recipeKey);

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
