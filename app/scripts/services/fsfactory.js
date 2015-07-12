'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSFactory
 * @description
 * # FSFactory
 * Simulation factory
 */
angular.module('craftyApp')
  .factory('FSFactory', function ( FSCharacter, FSTask, FSObject, FSGatherable, FSRecipeDef, FSRecipe, FSReward, FSHarvestable) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /**
     * @desc 
     * @return 
     */
  	var FSFactory = function(ctrllerScope, json) {

  		var thisFactory = this;

	    this.initialize = function() {
	
			this.taskTimeScalar ='1';

	         // Defines
	        this.harvestableDefines = json['harvestableDefines'];  
	        this.gatherableDefines = json['gatherableDefines'];  
	        this.toolDefines = json['toolDefines'];  
	        this.foodDefines = json['foodDefines'];  

			// Recipes Defines
	        this.recipeDef = {};  
	        var jsonRecipesDefines = json['recipesDefines'];
	        for (var key in jsonRecipesDefines) {
	        	if (jsonRecipesDefines.hasOwnProperty(key)) {
	          		this.recipeDef[key] = new FSRecipeDef(jsonRecipesDefines[key], this);
	         	}
	        }

	     	// Characters
		    this.characterObjs = {};  
 			json['characters'].forEach( ( function(thisCharacter) {
 				var characterName = thisCharacter.name;
	          	this.characterObjs[characterName] = new FSCharacter(thisCharacter, thisFactory, ctrllerScope);
	          	this.selectedCharacter = this.characterObjs[characterName];
	        }).bind(this)); 
	       	this.onClickCharacter = function ( character) {
	        	this.selectedCharacter = character;
	        };

	        // Gatherables
	        this.gatherables = {};  
	        json['gatherables'].forEach( ( function(thisGatherables) {
	        	var obj = thisGatherables;
	        	obj.gatherers = 0;
	          	this.gatherables[thisGatherables.name] = new FSGatherable(obj, this);
	        }).bind(this)); 
	        this.updateGatherables = function() {
	        	thisFactory.gatherablesArray = Object.keys(thisFactory.gatherables).map(function (key) {
	        		return thisFactory.gatherables[key];
	        	});
	    	};
	    	this.updateGatherables();

	        // Harvestables
	        this.harvestables = {};  
	        json['harvestables'].forEach( ( function(thisHarvestable) {
	          	this.harvestables[thisHarvestable.name] = new FSHarvestable(thisHarvestable, this);
	        }).bind(this)); 
	        this.updateHarvestables = function() {
	        	thisFactory.harvestablesArray = Object.keys(thisFactory.harvestables).map(function (key) {
	        		return thisFactory.harvestables[key];
	        	});
	    	};
	    	this.updateHarvestables();

			// Bank
	        this.bank = {};  
	        json['bank'].forEach( ( function(item) {
	        	var category = 'unknown';
	        	if ( this.toolDefines.hasOwnProperty(item.name) === true) 
	        	{
	        		category = 'tool';
	        	} else if ( this.foodDefines.hasOwnProperty(item.name) === true) {
	        		category = 'food';
	        	}
	          	this.bank[item.name] = new FSObject({'category':category, 'name':item.name});
	       		this.bank[item.name].increment( item.quantity );
	        }).bind(this)); 
	        this.updateBank = function() {
		        thisFactory.bankArray = Object.keys(thisFactory.bank).map(function (key) {
		        		return thisFactory.bank[key];
		        	});
	    	};
	    	this.updateBank();

	        // Know Recipes
	        this.knownRecipes = {}; 
	        json['recipes'].forEach( ( function( recipeName ) {
	          		this.knownRecipes[recipeName] =  new FSRecipe( recipeName, this);
	        	}).bind(this)); 
	        this.updateRecipes = function() {
		        thisFactory.knownRecipesArray = Object.keys(thisFactory.knownRecipes).map(function (key) {
		        		return thisFactory.knownRecipes[key];
		        	});
	    	};
	    	this.updateRecipes();

	        // Rewards
	        this.rewards = {};  
	        json['rewardDefines'].forEach( ( function(thisReward) {
	          	this.rewards[thisReward.name] = new FSReward(thisReward, this);
	        }).bind(this)); 

	    };

	    /**
		 * @desc - order table by field values
		 * @return 
		 */
    	this.onClickHeader = function ( tableName, fieldName) {
			switch ( tableName) {
				case 'Bank':
					if ( this.hasOwnProperty('orderBankBy') === false) {
						this.orderBankBy = 'name';
		        		this.orderBankByOrder = '+';
	        		}
        			this.orderBankByOrder = (this.orderBankByOrder==='+') ? '-' : '+';
        			this.orderBankBy = this.orderBankByOrder + fieldName;
        			break;
        		case 'Gatherables':
					if ( this.hasOwnProperty('orderGatherablesBy') === false) {
        			    this.orderGatherablesBy = 'name';
	        			this.orderGatherablesByOrder = '+';
	    			}
        			this.orderGatherablesByOrder = (this.orderGatherablesByOrder==='+') ? '-' : '+';
        			this.orderGatherablesBy = this.orderGatherablesByOrder + fieldName;
        			break;
        		case 'Harvestables':
        			if ( this.hasOwnProperty('orderHarvestablesBy') === false) {
	        			this.orderHarvestablesBy = 'name';
		        		this.orderHarvestablesByOrder = '+';
	        		}
        			this.orderHarvestablesByOrder = (this.orderHarvestablesByOrder==='+') ? '-' : '+';
        			this.orderHarvestablesBy = this.orderHarvestablesByOrder + fieldName;
        			break;
        		 case 'Recipes':
        			if ( this.hasOwnProperty('orderRecipesBy') === false) {
	        			this.orderRecipesBy = 'name';
		        		this.orderRecipesByOrder = '+';
	        		}
        			this.orderRecipesByOrder = (this.orderRecipesByOrder==='+') ? '-' : '+';
        			this.orderRecipesBy = this.orderRecipesByOrder + fieldName;
        			break;
        	}
	     };


		/**
		 * @desc 
		 * @return 
		 */
		 this.onClickBody = function ( tableName, keyName) {
	     	switch (tableName) {
	     		case 'Bank':
	     			this.onClickBank(keyName);
	     			break;
	     		case 'Gatherables':
	     			this.onClickGatherables(keyName);
	     			break;
	     		case 'Harvestables':
	     			this.onClickHarvestables(keyName);
	     			break;
	     		case 'Recipes':
	     			this.onClickRecipes(keyName);
	     			break;
	     	}
	 	 };



		/**
		 * @desc 
		 * @return 
		 */
		this.checkRewards  = function ( checkDesc ) {

			console.log('checkRewards down');

			for (var thisReward in this.rewards) {
  				if (this.rewards.hasOwnProperty(thisReward)) {
  					if (this.rewards[thisReward].serializable.action === checkDesc.action) {
						if (this.rewards[thisReward].serializable.target === checkDesc.target) {
							this.rewards[thisReward].serializable.completed = 1;
						}
					}
  				}
			}

			console.log('checkRewards down');
		};

		/**
		 * @desc 
		 * @return 
		 */
		 this.onClickCharacterTool = function ( toolObj) {

		      var indexOf = this.selectedCharacter.tools.indexOf(toolObj);
		      if ( indexOf !== -1) {
		      	this.selectedCharacter.tools.splice(indexOf, 1);

		      	 if (!(toolObj.name in thisFactory.bank)) {
        			thisFactory.bank[toolObj.name] = new FSObject({'category':'tool', 'name':toolObj.name});
			      }
			      thisFactory.bank[toolObj.name].increment(1);
			      thisFactory.updateBank();
		      }
		 };

		 /**
		 * @desc 
		 * @return 
		 */
		 this.onClickCharacterWeapon = function ( weaponObj) {

		      var indexOf = this.selectedCharacter.weapons.indexOf(weaponObj);
		      if ( indexOf !== -1) {
		      	this.selectedCharacter.weapons.splice(indexOf, 1);

		      	 if (!(weaponObj.name in thisFactory.bank)) {
        			thisFactory.bank[weaponObj.name] = new FSObject({'category':'weapon', 'name':weaponObj.name});
			      }
			      thisFactory.bank[weaponObj.name].increment(1);
			      thisFactory.updateBank();
		      }
		 };

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickBank = function (bankItemKey) {

        	switch ( this.bank[bankItemKey].category ) {
        		case 'tool': { // add to character inventory 
	        		if (this.bank[bankItemKey].quantity.length > 0) {
	        			this.bank[bankItemKey].decrement(1) ;
	        			this.selectedCharacter.tools.push( new FSObject( {'category':this.bank[bankItemKey].category, 'name':this.bank[bankItemKey].name} ));

	        			if ( this.bank[bankItemKey].quantity.length === 0) {
	        				delete  this.bank[bankItemKey];
	        				this.updateBank();
	        			}
	        		}
        		}
        		break;

        		case 'food': { // consume
	        		if (this.bank[bankItemKey].quantity.length > 0) {
	        			this.bank[bankItemKey].decrement(1) ;

						for (var statType in this.foodDefines[bankItemKey].onConsume.stat) {
							for (var statSubType in this.foodDefines[bankItemKey].onConsume.stat[statType]) {
								var delta = parseInt(this.foodDefines[bankItemKey].onConsume.stat[statType][statSubType], 10);
								//this.selectedCharacter.json.stats[statType][statSubType] = parseInt(this.selectedCharacter.json.stats[statType][statSubType]);

								this.selectedCharacter.modifyStat( statType, statSubType, delta);
								//this.selectedCharacter.json.stats[statType][statSubType] += parseInt(delta, 10);
							}
						}

	        			if ( this.bank[bankItemKey].quantity.length === 0) {
	        				delete this.bank[bankItemKey];
	        				this.updateBank();
	        			}
	        		}
        		}
        		break;

        		case 'weapon': { // add to character inventory 
	        		if (this.bank[bankItemKey].quantity.length > 0) {
	        			this.bank[bankItemKey].decrement(1) ;
	        			this.selectedCharacter.weapons.push( new FSObject( {'category':this.bank[bankItemKey].category, 'name':this.bank[bankItemKey].name} ));

	        			if ( this.bank[bankItemKey].quantity.length === 0) {
	        				delete  this.bank[bankItemKey];
	        				this.updateBank();
	        			}
	        		}
        		}
        		break;
        	}

		};

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickGatherables = function (gatherableType) {
	
			if ( this.selectedCharacter !== null) {
			    this.selectedCharacter.startGathering( gatherableType);
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickHarvestables = function (harvestableType) {
			if ( this.selectedCharacter !== null) {
			    this.selectedCharacter.startHarvesting( harvestableType);
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickRecipes = function (recipeKey) {
		   	// determine if has reqiored ingredients in bank
		   	var hasIngredients = true;
		    var recipeInputObj = this.recipeDef[recipeKey].input;
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


			if ( this.recipeDef[recipeKey].construction.length > 0) {

				var constructor = this.recipeDef[recipeKey].construction[0];
				if ( this.bank.hasOwnProperty(constructor) === false) {
					hasIngredients = false;
					console.log('does not have constructor:' + constructor);
				} else {
					console.log('has constructor :' + constructor);
				}
			}
			
			if ( hasIngredients === true) {

			    if ( this.selectedCharacter !== null && this.selectedCharacter.activity.length < 4) {

		          	this.selectedCharacter.startCrafting( recipeKey);

		          	// subtract resources from bank.
		          	recipeInputKeys.forEach( function ( recipeKey ){

						var recipeInput = recipeKey;
						var recipeInputQuantity = recipeInputObj[ recipeKey];

						this.bank[ recipeInput ].decrement( recipeInputQuantity);

						if ( this.bank[recipeInput].quantity.length === 0) {
	        				delete  this.bank[recipeInput];
	        				this.updateBank();
	        			}
	
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
