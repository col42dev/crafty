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
  .service('FSSimState', function (FSSimMessagingChannel, FSSimRules, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function.

    var simState = this;

    this.state = null;
    this.stateURL = null;


    this.set = function(json, stateURL) {

        this.stateURL = stateURL;
        this.state = angular.copy(json);

        // validate
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
        for ( var keyName in this.bank) {
            if (this.bank[keyName].category === 'constructor') {
                this.selectedConstructor = keyName;
                this.selectedConstructorFilter = keyName;
            }
        }


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

        // Rewards
        this.rewards = [];
        json.rewards.forEach( ( function(thisReward) {
            this.rewards.push(thisReward);
        }).bind(this)); 

        // Tasks
        this.activeTasks = [];
        if (json.hasOwnProperty('activeTasks') === true) {
            json.activeTasks.forEach( function( taskObj ) {
                var obj = { category: 'task', desc : taskObj };
                FSSimMessagingChannel.createSimObject( obj );
                this.activeTasks.push(obj.returnValue);
            }.bind(this)); 
        }

        this.pendingTasks = [];
    };

    /**
     * @desc 
     * @return 
     */
    this.serialize = function () {

        var out = angular.copy(this.state);

        // Characters
        out.characters = [];
        for ( var character in this.characters) {
            out.characters.push(this.characters[character].json);
        }

        // Harvestables
        out.harvestables = [];
        for ( var harvestable in this.harvestables) {
            out.harvestables.push(this.harvestables[harvestable].json);
        }

        // Bank
        out.bank = [];
        for ( var bankitem in this.bank) {
            out.bank.push(this.bank[bankitem].json);
        }

        // Craftables
        out.craftables = [];
        for ( var craftable in this.craftables) {
            out.craftables.push(this.craftables[craftable].json.name);
        }

        // Rewards
        out.rewards = [];
        for ( var reward in this.rewards) {
            out.rewards.push(this.rewards[reward]);
        }

        // Tasks
        out.activeTasks = [];
        for ( var activeTask in this.activeTasks) {
            out.activeTasks.push( this.activeTasks[activeTask].json);
        }

        out.pendingTasks = [];


        this.state =  angular.copy(out);

        console.log('>' + this.stateURL);

        // upload to server
        $http.put( 
            this.stateURL, 
            this.state
        ).success(function() {
            console.log('SUCCESS');
        })
        .error( function(response) { 
            window.alert('FAILED:');  
        });

    };

    /**
     * @desc 
     * @return 
     */
    this.getState = function() {

        return JSON.stringify(this.state, null, 2);
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
            else if (FSSimRules.harvestableDefines.hasOwnProperty(bankableName) === true) {
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
        }

        // toolDefines



       // craftableDefines
        for (  keyName in FSSimRules.craftableDefines) {

            FSSimRules.craftableDefines[keyName].construction.forEach( function( constructorName ) {
                if ( FSSimRules.constructorDefines.hasOwnProperty(constructorName) === false) {
                    errorLog.push('rules.json: craftableDefines['+ keyName +'].construction contains ' + constructorName + ' which was not found in FSSimRules.constructorDefines');
                }
            });


        }



        return errorLog;

  
    };



    /**
     * @desc 
     * @return 
     */
    this.getTaskDuration = function ( task) {

        var duration = 0;

        switch ( task.json.category) {
          case 'harvesting':
            duration= FSSimRules.harvestableDefines[task.json.name].duration / this.taskTimeScalar;
            break;
          case 'crafting':
            duration = FSSimRules.craftableDefines[task.json.name].duration  / this.taskTimeScalar;
            break;
        }

        return duration;
    };

 

  });
