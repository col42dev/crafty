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
  .service('FSSimState', function (FSSimMessagingChannel, FSSimRules) {
    // AngularJS will instantiate a singleton by calling "new" on this function.

    var simState = this;


    this.set = function(json) {

            //validate
            var errorLog = this.validateJSON(json);
            if ( errorLog.length > 0) {

                console.log(errorLog);

                errorLog.forEach( function( thisErrorMessage ) {
                    window.alert(thisErrorMessage);
                });
            
                return;
            }


            this.taskTimeScalar ='1';
            this.selectedConstructor = '';
            this.selectedConstructorFilter = 'none';

            // Characters
            this.characters = {};  
            json.characters.forEach( function(thisCharacter) {
                var obj = { characterDesc : thisCharacter};
                FSSimMessagingChannel.createSimObject( { category: 'character', desc : obj});
            }); 

            /*
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
            */
  
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
    this.validateJSON = function(json) {

        var errorLog = [];
        var keyName ;

        // harvestables in harvestableDefines
        for (  keyName in json.harvestables) {
            if (FSSimRules.harvestableDefines.hasOwnProperty( json.harvestables[keyName].name ) !== true) {
                errorLog.push('state.json: harvestable ' + json.harvestables[keyName].name + ' does not exist in rules.json:harvestableDefines');
            }
            if ( typeof json.harvestables[keyName].quantity !== 'number') {
                errorLog.push('state.json: harvestable ' + json.harvestables[keyName].name + ' requires a number value for it (.quantity) property');
            }
        }

        // craftables in craftableDefines
        for (  keyName in json.craftables) {
            if (FSSimRules.craftableDefines.hasOwnProperty( json.craftables[keyName] ) !== true) {
                errorLog.push('state.json: craftable ' + json.craftables[keyName] + ' does not exist in rules.json:craftableDefines');
            }
        }

        // bank in *
        for (  keyName in json.bank) {

            var bankableName = json.bank[keyName].name;

            if (FSSimRules.toolDefines.hasOwnProperty( bankableName ) === true) {
            }
            else if (FSSimRules.consumableDefines.hasOwnProperty(bankableName) === true) {
            }
            else if (FSSimRules.constructorDefines.hasOwnProperty(bankableName) === true) {
            }
            else {
                errorLog.push('state.json: bank itme  ' + bankableName + ' does not exist in rules.json:*');  
            }

            if ( typeof json.bank[keyName].quantity !== 'number') {
                errorLog.push('state.json: bank item ' + json.bank[keyName].name + ' requires a number value for it (.quantity) property');
            }
        }


        // rewardRules 
        for (  keyName in FSSimRules.rewardRules) {
            FSSimRules.rewardRules[keyName].recipeUnlocks.forEach( function( craftableName ) {
                
                if ( FSSimRules.craftableDefines.hasOwnProperty(craftableName) !== true) {
                    errorLog.push('rules.json: rewardRules->recipeUnlock[' + keyName +'].' + craftableName + ' not found in rules.json:craftableDefines');
                }
            });


            if ( typeof FSSimRules.rewardRules[keyName].xp !== 'number') {
                errorLog.push('rules.json: rewardRules->recipeUnlocks['+ keyName +'].xp must be assigned a numerical value');
            }

            var targetName = FSSimRules.rewardRules[keyName].target;
            if (FSSimRules.toolDefines.hasOwnProperty( targetName ) === true) {
            }
            else if (FSSimRules.consumableDefines.hasOwnProperty(targetName) === true) {
            }
            else if (FSSimRules.constructorDefines.hasOwnProperty(targetName) === true) {
            }
            else if (FSSimRules.craftableDefines.hasOwnProperty(targetName) === true) {
            } 
            else {
                errorLog.push('rules.json: rewardRules->recipeUnlocks['+ keyName +'].target  = ' + targetName + ' does not exist in any rules.json defines tables');  
            }
        }


        // harvestableDefines
        for (  keyName in FSSimRules.harvestableDefines) {
            if ( typeof FSSimRules.harvestableDefines[keyName].duration !== 'number') {
                errorLog.push('rules.json: harvestableDefines['+ keyName +'].duration must be assigned a numerical value');
            }
            if ( typeof FSSimRules.harvestableDefines[keyName].hardness !== 'number') {
                errorLog.push('rules.json: harvestableDefines['+ keyName +'].hardness must be assigned a numerical value');
            }
        }

        // toolDefines
        for (  keyName in FSSimRules.toolDefines) {
            if ( typeof FSSimRules.toolDefines[keyName].strength !== 'number') {
                errorLog.push('rules.json: toolDefines['+ keyName +'].strength must be assigned a numerical value');
            }
        }


       // craftableDefines
        for (  keyName in FSSimRules.craftableDefines) {

            FSSimRules.craftableDefines[keyName].construction.forEach( function( constructorName ) {
                if ( FSSimRules.constructorDefines.hasOwnProperty(constructorName) === false) {
                    errorLog.push('rules.json: craftableDefines['+ keyName +'].construction contains ' + constructorName + ' which was not found in FSSimRules.constructorDefines');
                }
            });

            /*
            for ( var craftableInput in FSSimRules.craftableDefines[keyName].input) {
            
            }

            for ( var craftableOutput in FSSimRules.craftableDefines[keyName].output) {
            
            }
            */


            if ( typeof FSSimRules.craftableDefines[keyName].duration !== 'number') {
                errorLog.push('rules.json: craftableDefines['+ keyName +'].duration must be assigned a numerical value');
            }

        }



        return errorLog;

  
    };



    /**
     * @desc 
     * @return 
     */
    this.getTaskDuration = function ( task) {

        var duration = 0;

        switch ( task.category) {
          case 'harvesting':
            duration= FSSimRules.harvestableDefines[task.name].duration / this.taskTimeScalar;
            break;
          case 'crafting':
            duration = FSSimRules.craftableDefines[task.name].duration / this.taskTimeScalar;
            break;
        }

        return duration;
    };

 

  });
