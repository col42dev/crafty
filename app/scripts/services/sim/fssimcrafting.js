'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimCrafting
 * @description
 * # FSSimCrafting
 * Operate on fscraftable's.
 */
angular.module('craftyApp')
  .service('FSSimCrafting', function (FSSimState, FSSimRules, FSContextConsole) {
    // AngularJS will instantiate a singleton by calling "new" on this function

        /**
         * @desc 
         * @return 
         */
        this.isCraftable = function (thisTask) {

            var taskName = thisTask.json.name;
            var activityCategory = thisTask.json.category;

            var canStartTask = true;

            switch ( activityCategory) {

              case 'crafting': {  
                  if ( this.hasCraftingIngredients(taskName, false) !== true) {
                    canStartTask = false;
                  }
                  if ( this.hasCraftingConstructor(taskName, false) !== true) {
                    canStartTask = false;
                  }
                }
                break;
            }

            return canStartTask;

        };

        /**
         * @desc: Are ingredients for specified craftable available?
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
                  if ( FSSimState.bank[ recipeInput ].json.quantity < recipeInputQuantity) {
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
         * @desc: is constructor for specified crafable available?
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
  });
