'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimFactory
 * @description
 * # FSSimFactory
 * Simulation factory
 */
angular.module('craftyApp')
  .factory('FSSimFactory', function ( FSCharacter, FSTask, FSBackpack, FSGatherable,  FSRecipe, FSHarvestable, FSContextConsole) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    /**
     * @desc 
     * @return 
     */
  	var FSSimFactory = function(scope) {

  		var thisFactory = this;
  		var ctrllerScope = scope;

	   /**
	     * @desc 
	     * @return 
	     */
	    this.createSimRules = function( json) {
	
			this.taskTimeScalar ='1';

	         // Defines
	        this.harvestableDefines = json.harvestableDefines;  
	        this.gatherableDefines = json.gatherableDefines;  
	        this.toolDefines = json.toolDefines;  
	        this.foodDefines = json.foodDefines;  
	        this.taskRules = json.taskRules;  
	       	this.rewardRules = json.rewardRules;  
			this.recipeDefines = json.recipesDefines; 

			this.contextConsole = new FSContextConsole();
	    };


	   /**
	     * @desc 
	     * @return 
	     */
	    this.createSimState = function( json) {
	
	     	// Characters
		    this.characterObjs = {};  
 			json.characters.forEach( ( function(thisCharacter) {
 				var characterName = thisCharacter.name;
	          	this.characterObjs[characterName] = new FSCharacter(thisCharacter, thisFactory);
	          	this.selectedCharacter = this.characterObjs[characterName];
	        }).bind(this)); 
	       	this.onClickCharacter = function ( character) {
	        	this.selectedCharacter = character;
	        };

	        // Gatherables
	        this.gatherables = {};  
	        json.gatherables.forEach( ( function(thisGatherables) {
	          	this.gatherables[thisGatherables.name] = new FSGatherable(thisGatherables, this);
	        }).bind(this)); 
	        this.updateGatherables = function() {
	        	thisFactory.gatherablesArray = Object.keys(thisFactory.gatherables).map(function (key) {
	        		return thisFactory.gatherables[key];
	        	});
	    	};
	    	this.updateGatherables();

	        // Harvestables
	        this.harvestables = {};  
	        json.harvestables.forEach( ( function(thisHarvestable) {
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
	        json.bank.forEach( ( function(item) {
	        	var category = 'unknown';
	        	if ( this.toolDefines.hasOwnProperty(item.name) === true) 
	        	{
	        		category = 'tool';
	        	} else if ( this.foodDefines.hasOwnProperty(item.name) === true) {
	        		category = 'food';
	        	}
	          	this.bank[item.name] = new FSBackpack({'category':category, 'name':item.name});
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
	        json.recipes.forEach( ( function( recipeName ) {
	          		this.knownRecipes[recipeName] =  new FSRecipe( recipeName, this);
	        	}).bind(this)); 
	        this.updateRecipes = function() {
		        thisFactory.knownRecipesArray = Object.keys(thisFactory.knownRecipes).map(function (key) {
		        		return thisFactory.knownRecipes[key];
		        	});
	    	};
	    	this.updateRecipes();


	    	//rewards
	    	this.rewards = [];
	    	json.rewards.forEach( ( function(thisReward) {
	          	this.rewards.push(thisReward);
	        }).bind(this)); 

	    };



	      /**
		 * @desc 
		 * @return 
		 */
    	this.deserialize = function ( ) {

    		var buildjson = {};

    		buildjson.harvestableDefines = this.harvestableDefines;  
	        buildjson.gatherableDefines = this.gatherableDefines;  
	        buildjson.toolDefines = this.toolDefines;  
	        buildjson.foodDefines = this.foodDefines;  
	        buildjson.recipesDefines = this.recipeDefines; 
	        buildjson.rewardRules = this.rewardRules;   


	     	// Characters
		    buildjson.characters = [];  
	        for ( var thisCharacter in this.characterObjs) {
	        	buildjson.characters.push( this.characterObjs[thisCharacter].json);
	        }

	        // Gatherables
	        buildjson.gatherables = [];  
	        for ( var thisGatherables in this.gatherables) {
	        	buildjson.gatherables.push( this.gatherables[thisGatherables].json);
	        } 
	
	        // Harvestables
	        buildjson.harvestables = [];  
	        for ( var thisHarvestable in this.harvestables) {
	        	var harvestObj = { 'name' : this.harvestables[thisHarvestable].name, 'quantity' : this.harvestables[thisHarvestable].quantity};
	          	buildjson.harvestables.push(harvestObj);
	        }

			// Bank
	        buildjson.bank = [];  
	        for ( var item in this.bank) {
	        	var bankobj = { 'name' : this.bank[item].json.name, 'quantity' : this.bank[item].json.quantity.length};
	        	buildjson.bank.push(bankobj);
	        }

	        // Know Recipes
	        buildjson.recipes = []; 
	        for ( var recipeName in this.knownRecipes) {
	        	buildjson.recipes.push(this.knownRecipes[recipeName].name);
	        }



	        this.jsonSerialized = JSON.stringify(buildjson, undefined, 2);

	        return buildjson;
    	};

	      /**
		 * @desc 
		 * @return 
		 */
    	this.ctrllrScopeApply = function ( ) {
    		 ctrllerScope.$apply();
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
        			    this.orderGatherablesBy = 'json.name';
	        			this.orderGatherablesByOrder = '+';
	    			}
        			this.orderGatherablesByOrder = (this.orderGatherablesByOrder==='+') ? '-' : '+';
        			this.orderGatherablesBy = this.orderGatherablesByOrder + fieldName;
        			console.log(this.orderGatherablesBy);
        			break;
        		case 'Harvestables':
        			if ( this.hasOwnProperty('orderHarvestablesBy') === false) {
	        			this.orderHarvestablesBy = 'json.name';
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
		 	this.contextConsole.clear();
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

			for (var thisRewardRule in this.rewardRules) {
  				if (this.rewardRules.hasOwnProperty(thisRewardRule)) {
  					if (this.rewardRules[thisRewardRule].action === checkDesc.action) {
						if (this.rewardRules[thisRewardRule].target === checkDesc.target) {
							
							// reward reward
							if ( this.rewards.indexOf(thisRewardRule) === -1) {
								console.log('REWARD:' + thisRewardRule);
								this.rewards.push(thisRewardRule);
							}

							// recipe unlocks
							this.rewardRules[thisRewardRule].recipeUnlocks.forEach( function( recipe) {

								if ( this.knownRecipes.hasOwnProperty(recipe) === false) {
									if (this.hasOwnProperty(recipe) === false) {
										this.knownRecipes[recipe] =  new FSRecipe( recipe, this);
										this.updateRecipes();
										console.log('RECIPE UNLOCK:' + recipe);
									}
								}

							}.bind(this));

						}
					}
  				}
			}
		};

		 /**
	     * @desc 
	     * @return 
	     */
		this.rewardbgcolor = function ( rewardName ) {
		     return  (this.rewards.indexOf(rewardName) === -1) ? '#FF0000' : '#00FF00';
		};


		/**
		 * @desc 
		 * @return 
		 */
		 this.onClickCharacterTool = function ( toolObj) {

		 	 if ( this.selectedCharacter.json.tools.length > 0) {

			     var indexOf = 0;

			     this.selectedCharacter.json.tools.splice(indexOf, 1);

		      	 if (!(toolObj.json.name in thisFactory.bank)) {
        			thisFactory.bank[toolObj.json.name] = new FSBackpack({'category':'tool', 'name':toolObj.json.name});
			     }
			     thisFactory.bank[toolObj.json.name].increment(1);
			     thisFactory.updateBank();
		  	}
		 };

		 /**
		 * @desc 
		 * @return 
		 */
		 this.onClickCharacterWeapon = function ( weaponObj) {

		      var indexOf = this.selectedCharacter.json.weapons.indexOf(weaponObj);
		      if ( indexOf !== -1) {
		      	this.selectedCharacter.json.weapons.splice(indexOf, 1);

		      	 if (!(weaponObj.name in thisFactory.bank)) {
        			thisFactory.bank[weaponObj.name] = new FSBackpack({'category':'weapon', 'name':weaponObj.name});
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
	        		if (this.bank[bankItemKey].json.quantity.length > 0) {
	        			this.bank[bankItemKey].decrement(1) ;
	        			this.selectedCharacter.json.tools.push( new FSBackpack( {'category':this.bank[bankItemKey].category, 'name':this.bank[bankItemKey].json.name} ));

	        			if ( this.bank[bankItemKey].json.quantity.length === 0) {
	        				delete  this.bank[bankItemKey];
	        				this.updateBank();
	        			}
	        		}
        		}
        		break;

        		case 'food': { // consume
	        		if (this.bank[bankItemKey].json.quantity.length > 0) {
	        			this.bank[bankItemKey].decrement(1) ;

						for (var statType in this.foodDefines[bankItemKey].onConsume.stat) {
							for (var statSubType in this.foodDefines[bankItemKey].onConsume.stat[statType]) {
								var delta = parseInt(this.foodDefines[bankItemKey].onConsume.stat[statType][statSubType], 10);
								this.selectedCharacter.modifyStat( statType, statSubType, delta);
							}
						}

	        			if ( this.bank[bankItemKey].json.quantity.length === 0) {
	        				delete this.bank[bankItemKey];
	        				this.updateBank();
	        			}
	        		}
        		}
        		break;

        		case 'weapon': { // add to character inventory 
	        		if (this.bank[bankItemKey].json.quantity.length > 0) {
	        			this.bank[bankItemKey].decrement(1) ;
	        			this.selectedCharacter.json.weapons.push( new FSBackpack( {'category':this.bank[bankItemKey].category, 'name':this.bank[bankItemKey].json.name} ));

	        			if ( this.bank[bankItemKey].json.quantity.length === 0) {
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
			if ( this.selectedCharacter !== null) {
		        this.selectedCharacter.startCrafting( recipeKey);		
		    }          	
		};


		/**
		 * @desc 
		 * @return 
		 */
		this.hasCraftingIngredients = function (recipeKey, log) {
	
			// determine if has reqiored ingredients in bank
			var hasIngredients = true;
			var recipeInputObj = this.recipeDefines[recipeKey].input;
			var recipeInputKeys = Object.keys( recipeInputObj );

			recipeInputKeys.forEach( function ( recipeInputKey ) {
			var recipeInput = recipeInputKey;
			var recipeInputQuantity = recipeInputObj[ recipeInputKey];

			if (recipeInput in this.bank) {
			  if ( this.bank[ recipeInput ].json.quantity.length < recipeInputQuantity) {
			    hasIngredients = false;
			    if (log === true) {
			    	this.contextConsole.log('Require ' + recipeInputQuantity +' '  + recipeInput + ' for ' + recipeKey + ' but only have  ' + this.bank[ recipeInput ].json.quantity.length);
				}
			  }
			} else {
			  if (log === true) {
			  	this.contextConsole.log('Require ' + recipeInputQuantity +' '  + recipeInput + ' for crafting ' +  recipeKey+ ' but have none');
			  }
			  hasIngredients = false;
			}
			}.bind(this));

			
			return hasIngredients;
		};


		/**
		 * @desc 
		 * @return 
		 */
		this.hasCraftingConstructor = function (recipeKey, log) {
	
			var hasIngredients = true;

			if ( this.recipeDefines[recipeKey].construction.length > 0) {

        		var constructor = this.recipeDefines[recipeKey].construction[0];
        		if ( this.bank.hasOwnProperty(constructor) === false) {
          			hasIngredients = false;
          			if (log === true) {
          				this.contextConsole.log('Require a ' + constructor + ' in the bank for crafting ' + recipeKey);
          			}
        		} 
      		}

      		return hasIngredients;
      	};


	   
  	};

	/**
	* Return the constructor function.
	*/
	return FSSimFactory;
});
