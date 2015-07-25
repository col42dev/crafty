'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimState
 * @description
 * # FSSimState
 * Stores the raw sim state data from JSON and maps its to runtime instances.
 * Data only - co not add implementation.
 */
angular.module('craftyApp')
  .service('FSSimState', function (FSSimMessagingChannel) {
    // AngularJS will instantiate a singleton by calling "new" on this function.

    var simState = this;


    this.set = function(json) {

            this.taskTimeScalar ='1';
            this.selectedConstructor = '';
            this.selectedConstructorFilter = 'none';

            // Characters
            this.characters = {};  
            json.characters.forEach( function(thisCharacter) {
                var obj = { characterDesc : thisCharacter};
                FSSimMessagingChannel.createSimObject( { category: 'character', desc : obj});
            }); 

            // Gatherables
            this.gatherables = {};  
            json.gatherables.forEach( (function(thisGatherables) {
                FSSimMessagingChannel.createSimObject( { category: 'gatherable', desc : thisGatherables});
            }).bind(this)); 
            this.updateGatherables = function() {
                simState.gatherablesArray = Object.keys(simState.gatherables).map(function (key) {
                    return simState.gatherables[key];
                });
            };
            this.updateGatherables();
  
            // Harvestables
            this.harvestables = {};  
            json.harvestables.forEach( function(thisHarvestable) {
                FSSimMessagingChannel.createSimObject( { category: 'harvestable', desc : thisHarvestable});
            }); 
            this.updateHarvestables = function() {
                simState.harvestablesArray = Object.keys(simState.harvestables).map(function (key) {
                    return simState.harvestables[key];
                });
            };
            this.updateHarvestables();
 
            // Bank
            this.bank = {};  
            json.bank.forEach( function(item) {
                FSSimMessagingChannel.createSimObject( { category: 'bankable', desc : item});
            }); 
            this.updateBank = function() {
                simState.bankArray = Object.keys(simState.bank).map(function (key) {
                        return simState.bank[key];
                    });
            };
            this.updateBank();
 
            // Craftables
            this.craftables = {}; 
            json.craftables.forEach( function( recipeName ) {
                FSSimMessagingChannel.createSimObject( { category: 'craftables', desc : recipeName});
            }); 
            this.updateRecipes = function() {
                simState.craftablesArray = Object.keys(simState.craftables).map(function (key) {
                        return simState.craftables[key];
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

 

  });
