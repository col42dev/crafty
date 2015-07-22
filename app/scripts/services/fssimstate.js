'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimState
 * @description
 * # FSSimState
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSSimState', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function.

    this.init = function() {

                    this.selectedConstructor = '';
            this.selectedConstructorFilter = 'none';


        // Characters
            this.characterObjs = {};  
 
            // Gatherables
            this.gatherables = {};  
  
            // Harvestables
            this.harvestables = {};  
 

            // Bank
            this.bank = {};  
 

            // Craftables
            this.craftables = {}; 
 
            //rewards
            this.rewards = [];
   
    };

    this.set = function(json) {

        var thisFactory = this;


        // Characters
   
            this.onClickCharacter = function ( character) {
                this.selectedCharacter = character;
            };

            // Gatherables
     
            this.updateGatherables = function() {
                thisFactory.gatherablesArray = Object.keys(thisFactory.gatherables).map(function (key) {
                    return thisFactory.gatherables[key];
                });
            };
            this.updateGatherables();

            // Harvestables
            this.updateHarvestables = function() {
                this.harvestablesArray = Object.keys(this.harvestables).map(function (key) {
                    return thisFactory.harvestables[key];
                });
            };
            this.updateHarvestables();


            // Bank
            this.updateBank = function() {
                thisFactory.bankArray = Object.keys(thisFactory.bank).map(function (key) {
                        return thisFactory.bank[key];
                    });
            };
            this.updateBank();


            // Craftables
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

 

  });
