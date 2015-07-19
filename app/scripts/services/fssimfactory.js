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
			this.selectedConstructor = '';
			this.selectedConstructorFilter = 'none';

	         // Defines
	        this.harvestableDefines = json.harvestableDefines;  
	        this.gatherableDefines = json.gatherableDefines; 
	        this.craftableDefines = json.craftableDefines; 
 
	        this.toolDefines = json.toolDefines;  
	        this.foodDefines = json.foodDefines;  
	        this.taskRules = json.taskRules;  
	       	this.rewardRules = json.rewardRules;  
		
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
	          	this.bank[item.name] = new FSBackpack({'category':category, 'name':item.name}, thisFactory);
	       		this.bank[item.name].increment( item.quantity );
	        }).bind(this)); 

	        this.bank[''] = new FSBackpack({'category':'constructor', 'name':''}, thisFactory);
	       	this.bank[''].increment( 1 );

	        this.updateBank = function() {
		        thisFactory.bankArray = Object.keys(thisFactory.bank).map(function (key) {
		        		return thisFactory.bank[key];
		        	});
	    	};
	    	this.updateBank();

	        // Craftables
	        this.craftables = {}; 
	        json.craftables.forEach( ( function( recipeName ) {
	          		this.craftables[recipeName] =  new FSRecipe( recipeName, this);
	        	}).bind(this)); 
	        this.updateRecipes = function() {
		        thisFactory.craftablesArray = Object.keys(thisFactory.craftables).map(function (key) {
		        		return thisFactory.craftables[key];
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
	        buildjson.craftableDefines = this.craftableDefines; 
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
	        buildjson.craftables = []; 
	        for ( var recipeName in this.craftables) {
	        	buildjson.craftables.push(this.craftables[recipeName].name);
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
		this.rewardbgcolor = function ( rewardName ) {
		     return  (this.rewards.indexOf(rewardName) === -1) ? '#FF0000' : '#00FF00';
		};


		/**
		 * @desc 
		 * @return 
		 */
		 this.onClickCharacterTool = function ( character, index) {
		 	 if ( character.json.tools.length > index) {
			   
				var toolName = character.json.tools[index].json.name;

			    if ( thisFactory.bank.hasOwnProperty(toolName) === false) {
					thisFactory.bank[toolName] = new FSBackpack({'category':'tool', 'name':toolName}, thisFactory);
			    }
			    thisFactory.bank[toolName].increment(1);
			    thisFactory.updateBank();

			    character.json.tools.splice(index, 1);
		  	}
		 };

		 /**
		 * @desc 
		 * @return 
		 */
		 this.onClickCharacterWeapon = function ( weaponObj) {
		 		weaponObj = weaponObj;

		 };

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickBank = function (bankItemKey) {

        	switch ( this.bank[bankItemKey].category ) {
				case 'constructor': { 
					this.selectedConstructor = bankItemKey;
					this.selectedConstructorFilter = bankItemKey;	
					if (this.selectedConstructor === '') {
						this.selectedConstructorFilter = 'none';
					}
				}
				break;

				case 'tool': { // add to character inventory 
					if (this.bank[bankItemKey].json.quantity.length > 0) {
						this.bank[bankItemKey].decrement(1) ;
						this.selectedCharacter.json.tools.push( new FSBackpack( {'category':this.bank[bankItemKey].category, 'name':this.bank[bankItemKey].json.name}, thisFactory ));

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
						this.selectedCharacter.json.weapons.push( new FSBackpack( {'category':this.bank[bankItemKey].category, 'name':this.bank[bankItemKey].json.name}, thisFactory ));

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
				this.selectedCharacter.addTask( gatherableType, 'gathering');	
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickHarvestables = function (harvestableType) {
			if ( this.selectedCharacter !== null) {
			    this.selectedCharacter.addTask( harvestableType, 'harvesting');	
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickRecipes = function (recipeKey) {
			if ( this.selectedCharacter !== null) {
		        this.selectedCharacter.addTask( recipeKey, 'crafting');		
		    }          	
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.bankTransaction  = function ( type,  value) {
	      	if ( type === 'startCrafting') {
				// subtract resources from bank. (todo: refactor this in to sim factory class)
				var recipeInputObj = this.craftableDefines[value].input;
				var recipeInputKeys = Object.keys( recipeInputObj );

				recipeInputKeys.forEach( ( function ( recipeKey ){
					var recipeInput = recipeKey;
					var recipeInputQuantity = recipeInputObj[ recipeKey];
					this.bank[ recipeInput ].decrement( recipeInputQuantity);
					if ( this.bank[recipeInput].json.quantity.length === 0) {
					  delete  this.bank[recipeInput];
					  this.updateBank();
					}
				}).bind(this));
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

								if ( this.craftables.hasOwnProperty(recipe) === false) {
									if (this.hasOwnProperty(recipe) === false) {
										this.craftables[recipe] =  new FSRecipe( recipe, this);
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
		this.hasUnlocks  = function ( checkDesc ) {

			for (var thisRewardRule in this.rewardRules) {
  				if (this.rewardRules.hasOwnProperty(thisRewardRule)) {
  					if (this.rewardRules[thisRewardRule].action === checkDesc.action) {
						if (this.rewardRules[thisRewardRule].target === checkDesc.target) {
							if ( this.rewards.indexOf(thisRewardRule) === -1) {
								return true;	
							}
						}
					}
  				}
			}

			return false;
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.hasCraftingIngredients = function (recipeKey, log) {
	
			// determine if has reqiored ingredients in bank
			var hasIngredients = true;
			var recipeInputObj = this.craftableDefines[recipeKey].input;
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

			if ( this.craftableDefines[recipeKey].construction.length > 0) {

        		var constructor = this.craftableDefines[recipeKey].construction[0];
        		if ( this.bank.hasOwnProperty(constructor) === false) {
          			hasIngredients = false;
          			if (log === true) {
          				this.contextConsole.log('Require a ' + constructor + ' in the bank for crafting ' + recipeKey);
          			}
        		} 
      		}

      		return hasIngredients;
      	};


      	/**
		 * @desc 
		 * @return 
		 */
		this.getTaskDuration = function (activityCategory, taskName, thisCharacter) {
	
	  		var duration = 0;

	        switch ( activityCategory) {
	          case 'gathering':
	            duration = this.gatherables[taskName].duration(thisCharacter) / this.taskTimeScalar;
	            break;
	          case 'harvesting':
	            duration= this.harvestables[taskName].duration(thisCharacter) / this.taskTimeScalar;
	            break;
	          case 'crafting':
	            duration = this.craftables[taskName].duration(thisCharacter) / this.taskTimeScalar;
	            break;
	        }

	        return duration;
      	};






	   
  	};

	/**
	* Return the constructor function.
	*/
	return FSSimFactory;
});
