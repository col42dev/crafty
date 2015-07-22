'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimState
 * @description
 * # FSSimState
 * Stores the raw sim state from JSON and maps its to runtime instances.
 * Avoid adding Sim implementation.
 */
angular.module('craftyApp')
  .service('FSSimState', function (FSSimObjectChannel) {
    // AngularJS will instantiate a singleton by calling "new" on this function.

           var simState = this;


    this.set = function(json, thisFactory) {

     

            this.selectedConstructor = '';
            this.selectedConstructorFilter = 'none';

            // Characters
            this.characterObjs = {};  
            json.characters.forEach( function(thisCharacter) {
                var obj = { characterDesc : thisCharacter, simfactory : thisFactory};
                FSSimObjectChannel.createSimObject( { category: 'character', desc : obj});
            }); 
            this.onClickCharacter = function ( character) {
                simState.selectedCharacter = character;
            };

 
    
            // Gatherables
            this.gatherables = {};  
            json.gatherables.forEach( (function(thisGatherables) {
                FSSimObjectChannel.createSimObject( { category: 'gatherables', desc : thisGatherables});
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
                FSSimObjectChannel.createSimObject( { category: 'harvestables', desc : thisHarvestable});
            }); 
            this.updateHarvestables = function() {
                simState.harvestablesArray = Object.keys(simState.harvestables).map(function (key) {
                    return simState.harvestables[key];
                });
            };
            this.updateHarvestables();
 
            // Craftables
            this.craftables = {}; 
            json.craftables.forEach( function( recipeName ) {
                FSSimObjectChannel.createSimObject( { category: 'craftables', desc : recipeName});
            }); 
            this.updateRecipes = function() {
                simState.craftablesArray = Object.keys(simState.craftables).map(function (key) {
                        return simState.craftables[key];
                    });
            };
            this.updateRecipes();

            //console.log( JSON.stringify( simState.craftablesArray));

            // Bank
            this.bank = {};  
            json.bank.forEach( function(item) {
                FSSimObjectChannel.createSimObject( { category: 'bankable', desc : item});
            }); 
            FSSimObjectChannel.createSimObject( { category: 'bankable', desc : {'category':'constructor', 'name':'', quantity : 1} });
            this.updateBank = function() {
                simState.bankArray = Object.keys(simState.bank).map(function (key) {
                        return simState.bank[key];
                    });
            };
            this.updateBank();
 
           

            //rewards
            this.rewards = [];
            json.rewards.forEach( ( function(thisReward) {
                this.rewards.push(thisReward);
            }).bind(this)); 

    };

 

  });
