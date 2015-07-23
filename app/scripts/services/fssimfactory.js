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
