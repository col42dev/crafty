'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSFactory
 * @description
 * # FSFactory
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSFactory', function ( FSCharacter, FSTask, FSObject, FSGatherable, FSRecipeDef, FSRecipe, FSReward, FSHarvestable) {
    // AngularJS will instantiate a singleton by calling "new" on this function

  	var FSFactory = function(ctrllerScope, json) {

  		var thisFactory = this;

	    this.initialize = function() {
	
			this.taskTimeScalar ='1';

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

	         // HarvestableDefines
	        this.harvestableDefines = json['harvestableDefines'];  

    		// GatherableDefines
	        this.gatherableDefines = json['gatherableDefines'];  
	  
	 		// GatherableDefines
	        this.toolDefines = json['toolDefines'];  
	        
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
	        this.orderGatherablesBy = 'name';
	        this.orderGatherablesByOrder = '+';
	        this.onClickGatherablesHeader = function ( fieldName) {
	        	this.orderGatherablesByOrder = (this.orderGatherablesByOrder==='+') ? '-' : '+';
	        	this.orderGatherablesBy = this.orderGatherablesByOrder + fieldName;
	        };	

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
	        this.orderHarvestablesBy = 'name';
	        this.orderHarvestablesByOrder = '+';
	        this.onClickHarvestablesHeader = function ( fieldName) {
	        	this.orderHarvestablesByOrder = (this.orderHarvestablesByOrder==='+') ? '-' : '+';
	        	this.orderHarvestablesBy = this.orderHarvestablesByOrder + fieldName;
	        };	


			// Bank
	        this.bank = {};  

	        json['bank'].forEach( ( function(item) {
	          	this.bank[item.name] = new FSObject({'category':item.category, 'name':item.name});
	       		this.bank[item.name].increment( item.quantity );
	        }).bind(this)); 

	        
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
	        this.knownRecipes = json['recipes'];  

			// Recipes Defines
	        this.recipeDef = {};  
	        var jsonRecipesDefines = json['recipesDefines'];
	        for (var key in jsonRecipesDefines) {
	        	if (jsonRecipesDefines.hasOwnProperty(key)) {
	          		this.recipeDef[key] = new FSRecipeDef(jsonRecipesDefines[key], this);
	         	}
	        }

	        // CraftStation
	        this.viewedConstructor = [];
	        this.viewedConstructorName = null;

	        // Rewards
	        this.rewards = {};  
	        
	        json['rewardDefines'].forEach( ( function(thisReward) {
	          	this.rewards[thisReward.name] = new FSReward(thisReward, this);
	        }).bind(this)); 

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

			this.viewedConstructor = [];
			if ( this.bank[bankItemKey].category === 'constructor') {
				this.viewedConstructorName = bankItemKey;
				Object.keys( this.recipeDef ).forEach( ( function(thisGameItemKey) {
					var thisGameItem = this.recipeDef[thisGameItemKey];
	        		if (thisGameItem.construction === bankItemKey) {
	          			this.viewedConstructor.push( new FSRecipe( thisGameItemKey, this));
	          		}
	        	}).bind(this)); 
			} else {
	        	this.viewedConstructorName = null;

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
		this.startCrafting = function (recipeKey) {
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
