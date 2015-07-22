'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimFactory
 * @description
 * # FSSimFactory
 * Simulation factory
 */
angular.module('craftyApp')
  .factory('FSSimFactory', function (  FSBackpack,  FSSimObjectChannel,  FSContextConsole, FSSimRules, FSSimState, FSSimRewards) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    /**
     * @desc 
     * @return 
     */
  	var FSSimFactory = function(scope) {

  		var ctrllerScope = scope;


	   /**
	     * @desc 
	     * @return	     */
	    this.createSimRules = function( json) {
			this.taskTimeScalar ='1';
			FSSimRules.set(json);
	    };


	   /**
	     * @desc 
	     * @return 
	     */
	    this.createSimState = function( json) {
		
			FSSimState.set(json, this);

            FSSimObjectChannel.updateGoals();
   
	    };

	      /**
		 * @desc 
		 * @return 
		 */
    	this.deserialize = function ( ) {


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
		 	FSContextConsole.clear();
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
		     return  (FSSimState.rewards.indexOf(rewardName) === -1) ? 'rgba(200, 20, 20, 0.25)' : 'rgba(20, 200, 20, 0.25)';
		};


	    /**
	     * @desc 
	     * @return 
	     */
	    this.bgcolor= function( action, type) {
	    	var enabled = false;
	    	switch( action) {
	    		case 'craft':
	    			enabled = this.isCraftable(type) ;
	    			break;
	    		case 'gather':
	    			enabled = this.isGatherable(type);
	    			break;
	    		case 'harvest':
	    			enabled = this.isHarvestable(type);
	    			break;
	    		case 'bank':
		    		{
				        switch (FSSimState.bank[type].category) 
				        {
							case 'constructor':
								if ( FSSimState.selectedConstructor === type) {
									enabled = true;
								} 
								break;
							case 'tool':
							case 'food':
							case 'weapons':
								enabled = true;
								break;
				        }
		    		}
		    		break;
	    	}
	      
	      return  (enabled === true) ? 'rgba(20, 200, 20, 0.25)' : 'rgba(200, 20, 20, 0.25)';
	    };


		/**
		 * @desc 
		 * @return 
		 */
		this.getUnlockImage =  function(  action, name) {
		  if ( FSSimRewards.hasUnlocks( {'action':action, 'target':name})) {
		    return 'images/unlock.69ea04fd.png';
		  }
		  return 'images/clear.d9e2c8a6.png';
		};

		/**
		 * @desc 
		 * @return 
		 */
		 this.onClickCharacterTool = function ( character, index) {
		 	 if ( character.json.tools.length > index) {
			   
				var toolName = character.json.tools[index].json.name;

			    if ( FSSimState.bank.hasOwnProperty(toolName) === false) {
					   FSSimObjectChannel.createSimObject( { category: 'bankable', desc : {'category':'tool', 'name':toolName, quantity : 0} });     
			    }
			    FSSimState.bank[toolName].increment(1);
			    FSSimState.updateBank();

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

        	switch ( FSSimState.bank[bankItemKey].category ) {
				case 'constructor': { 
					FSSimState.selectedConstructor = bankItemKey;
					FSSimState.selectedConstructorFilter = bankItemKey;	
					if (FSSimState.selectedConstructor === '') {
						FSSimState.selectedConstructorFilter = 'none';
					}
				}
				break;

				case 'tool': { // add to character inventory 
					if (FSSimState.bank[bankItemKey].json.quantity.length > 0) {
						FSSimState.bank[bankItemKey].decrement(1) ;
						FSSimState.selectedCharacter.json.tools.push( new FSBackpack( {'category':FSSimState.bank[bankItemKey].category, 'name':FSSimState.bank[bankItemKey].json.name} ));



						if ( FSSimState.bank[bankItemKey].json.quantity.length === 0) {
							delete  FSSimState.bank[bankItemKey];
							FSSimState.updateBank();
						}
					}
				}
				break;

				case 'food': { // consume
					if (FSSimState.bank[bankItemKey].json.quantity.length > 0) {
						FSSimState.bank[bankItemKey].decrement(1) ;

						for (var statType in FSSimRules.foodDefines[bankItemKey].onConsume.stat) {
							for (var statSubType in FSSimRules.foodDefines[bankItemKey].onConsume.stat[statType]) {
								var delta = parseInt(FSSimRules.foodDefines[bankItemKey].onConsume.stat[statType][statSubType], 10);
								FSSimState.selectedCharacter.modifyStat( statType, statSubType, delta);
							}
						}

						if ( FSSimState.bank[bankItemKey].json.quantity.length === 0) {
							delete FSSimState.bank[bankItemKey];
							FSSimState.updateBank();
						}
					}
				}
				break;

				case 'weapon': { // add to character inventory 
					if (FSSimState.bank[bankItemKey].json.quantity.length > 0) {
						FSSimState.bank[bankItemKey].decrement(1) ;
						FSSimState.selectedCharacter.json.weapons.push( new FSBackpack( {'category':FSSimState.bank[bankItemKey].category, 'name':FSSimState.bank[bankItemKey].json.name} ));

						if ( FSSimState.bank[bankItemKey].json.quantity.length === 0) {
							delete  FSSimState.bank[bankItemKey];
							FSSimState.updateBank();
						}
					}
				}
				break;
			}
		};

		/**
		 * @desc Select a characater best suited for task.
		 * @return 
		 */
		this.selectCharacter = function (taskName, taskCategory) {

			var validCharacters = [];

			// generate list of characters which can do this task.
			for ( var character in FSSimState.characterObjs ) {
				if ( FSSimState.characterObjs[character].canPerformTask(taskName, taskCategory)) {
					validCharacters.push( FSSimState.characterObjs[character]);
				}
			}

			// select character with least queued actions.
			var leastActionCount = 5;
			var selectedCharacter = null;
			validCharacters.forEach( function ( thisCharacter) {
				if ( thisCharacter.json.activity.length < leastActionCount) {
					leastActionCount = thisCharacter.json.activity.length;
					selectedCharacter = thisCharacter;
				}
			});

			return selectedCharacter;
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickGatherables = function (gatherableType) {
			var selectedCharacter = this.selectCharacter(gatherableType, 'gathering');
			if ( selectedCharacter !== null) {
				selectedCharacter.addTask( gatherableType, 'gathering');	
			} else {
				var characterKey = null;

				// stats
				var haveStats = false;
				for ( characterKey in FSSimState.characterObjs ) {
			         if ( FSSimState.characterObjs[characterKey].hasStatsFor('harvesting') === true) {
		              haveStats = true;
		            }
		        }
		        if ( haveStats === false) {
		         	FSContextConsole.log('No one has the required stats to start gathering ' + gatherableType, true);
		     	}

		     	// equipped
				var hasEquippedTools = false;
				for ( characterKey in FSSimState.characterObjs ) {
			         if ( FSSimState.characterObjs[characterKey].hasGatheringDependencies(gatherableType) === true) {
		              hasEquippedTools = true;
		            }
		        }
		        if ( hasEquippedTools === false) {
		         	FSContextConsole.log('No one is equipped with the required tools for gathering ' + gatherableType, true);

					for ( var toolDefine in FSSimRules.toolDefines) {
						FSSimRules.toolDefines[toolDefine].actions.forEach( ( function ( action) {
							if ( FSSimRules.gatherableDefines[gatherableType].actionable.indexOf(action) !== -1) {
								FSContextConsole.log(toolDefine, true);
							} 
						}).bind(this));
					}
		     	}
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickHarvestables = function (harvestableType) {
			var selectedCharacter = this.selectCharacter(harvestableType, 'harvesting');
			if ( selectedCharacter !== null) {
			    selectedCharacter.addTask( harvestableType, 'harvesting');	
			} else {
				var characterKey = null;

				// stats
				var haveStats = false;
				for ( characterKey in FSSimState.characterObjs ) {
			         if ( FSSimState.characterObjs[characterKey].hasStatsFor('harvesting') === true) {
		              haveStats = true;
		            }
		        }
		        if ( haveStats === false) {
		         	FSContextConsole.log('No one has the required stats to start harvesting ' + harvestableType, true);
		     	}

		     	// equipped
				var hasEquippedTools = false;
				for ( characterKey in FSSimState.characterObjs ) {
			         if ( FSSimState.harvestables[harvestableType].isHarvestableBy(FSSimState.characterObjs[characterKey]) === true) {
		              hasEquippedTools = true;
		            }
		        }
		        if ( hasEquippedTools === false) {
		         	FSContextConsole.log('No one is equipped with the required tools for harvesting ' + harvestableType, true);

					for ( var toolDefine in FSSimRules.toolDefines) {
						FSSimRules.toolDefines[toolDefine].actions.forEach( ( function ( action) {
							if ( FSSimRules.harvestableDefines[harvestableType].actionable.indexOf(action) !== -1) {
								if ( parseInt(FSSimRules.toolDefines[toolDefine].strength, 10) >= parseInt( FSSimRules.harvestableDefines[harvestableType].hardness, 10)) {
									FSContextConsole.log(toolDefine, true);
								}
							} 
						}).bind(this));
					}
		     	}
			}
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.onClickRecipes = function (recipeKey) {
			var selectedCharacter = this.selectCharacter(recipeKey, 'crafting');
			if ( selectedCharacter !== null) {
		        selectedCharacter.addTask( recipeKey, 'crafting');		
		    } else {
		    	// log to console.
		    	if ( this.hasCraftingIngredients(recipeKey, true) === true) {
		    		if ( this.hasCraftingConstructor(recipeKey, true)) {
		    				var characterKey = null;

		    				//stats
		    				var haveStats = false;
		    				for ( characterKey in FSSimState.characterObjs ) {
		    			         if ( FSSimState.characterObjs[characterKey].hasStatsFor('crafting') === true) {
					              haveStats = true;
					            }
					        }
					        if ( haveStats === false) {
					         	FSContextConsole.log('No one has the required stats to start crafting ' + recipeKey, true);
					     	}

					     	//proficiency
							var hasProficiency = false;
		    				for ( characterKey in FSSimState.characterObjs ) {
		    			         if ( FSSimState.characterObjs[characterKey].hasCraftingProficiencyFor(recipeKey, false) === true) {
					              hasProficiency = true;
					            }
					        }
					        if ( hasProficiency === false) {
					         	FSContextConsole.log('No one has the required proficiency to start crafting ' + recipeKey, true);
					     	}
		    		}
		    	}

		    }         	
		};




	




		/**
		 * @desc 
		 * @return 
		 */
		this.isHarvestable = function (harvestableType) {
			for ( var characterKey in FSSimState.characterObjs ) {
				if ( FSSimState.characterObjs[characterKey].canPerformTask(harvestableType, 'harvesting', false)) {
					return true;
				}
			}
			return false;
		};
	
		/**
		 * @desc 
		 * @return 
		 */
		this.isGatherable = function (gatherableType) {
			for ( var characterKey in FSSimState.characterObjs ) {
				if ( FSSimState.characterObjs[characterKey].canPerformTask(gatherableType, 'gathering', false)) {
					return true;
				}
			}
			return false;
		};

		/**
		 * @desc 
		 * @return 
		 */
		this.isCraftable = function (craftableType) {
			for ( var characterKey in FSSimState.characterObjs ) {
				if ( FSSimState.characterObjs[characterKey].canPerformTask(craftableType, 'crafting', false)) {
					return true;
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
			var recipeInputObj = FSSimRules.craftableDefines[recipeKey].input;
			var recipeInputKeys = Object.keys( recipeInputObj );

			recipeInputKeys.forEach( function ( recipeInputKey ) {
				var recipeInput = recipeInputKey;
				var recipeInputQuantity = recipeInputObj[ recipeInputKey];

				if (recipeInput in FSSimState.bank) {
				  if ( FSSimState.bank[ recipeInput ].json.quantity.length < recipeInputQuantity) {
				    hasIngredients = false;
				    FSContextConsole.log('Require ' + recipeInputQuantity +' '  + recipeInput + ' for ' + recipeKey + ' but only have  ' + FSSimState.bank[ recipeInput ].json.quantity.length, log);
				  }
				} else {
				  FSContextConsole.log('Require ' + recipeInputQuantity +' '  + recipeInput + ' for crafting ' +  recipeKey+ ' but have none', log);
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
			if ( FSSimRules.craftableDefines[recipeKey].construction.length > 0) {
        		var constructor = FSSimRules.craftableDefines[recipeKey].construction[0];
        		if ( FSSimState.bank.hasOwnProperty(constructor) === false) {
          			hasIngredients = false;
          			FSContextConsole.log('Require a ' + constructor + ' in the bank for crafting ' + recipeKey, log);
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
	            duration = FSSimState.gatherables[taskName].duration(thisCharacter) / this.taskTimeScalar;
	            break;
	          case 'harvesting':
	            duration= FSSimState.harvestables[taskName].duration(thisCharacter) / this.taskTimeScalar;
	            break;
	          case 'crafting':
	            duration = FSSimState.craftables[taskName].duration(thisCharacter) / this.taskTimeScalar;
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
