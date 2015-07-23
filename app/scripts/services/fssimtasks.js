'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimTasks
 * @description
 * # FSSimTasks
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSSimTasks', [ '$rootScope',  'FSSimState', 'FSSimRules', 'FSTask', 'FSSimCrafting', 'FSContextConsole', 'FSSimObjectChannel', function ($rootScope , FSSimState, FSSimRules, FSTask, FSSimCrafting, FSContextConsole, FSSimObjectChannel) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var thisService = this;
    this.activeTasks = [];
    this.pendingTasks = [];

  
    /**
     * @desc 
     * @return 
     */
    this.addTask = function ( tableName, keyName) {

        var task;

        switch (tableName) {
            case 'Gatherables':
                task = new FSTask( {'name':keyName, 'category':'gathering'});
                break;
            case 'Harvestables':
                task = new FSTask( {'name':keyName, 'category':'harvesting'});
                break;
            case 'Recipes':
                task = new FSTask( {'name':keyName, 'category':'crafting'});
                break;
        }

        this.addTaskCatgeory(task);
 
    };

    /**
     * @desc 
     * @return 
     */
    this.onCompletedTaskHandler = function( task) {
        console.log('onCompletedTaskHandler' + JSON.stringify(task));

        var completedTaskIndex = thisService.activeTasks.indexOf(task);
        if (completedTaskIndex !== -1) {
            thisService.activeTasks.splice( completedTaskIndex, 1);
        }

        if (thisService.pendingTasks.length > 0) {
            var pendingTask = thisService.pendingTasks[0];

            var validCharacters = thisService.getValidCharacters(pendingTask.name, pendingTask.category);
            var validCharactersInactive = thisService.getInactiveCharacters(validCharacters);

            if ( validCharactersInactive.length > 0) {
                thisService.activeTasks.push( pendingTask);
                validCharactersInactive[0].addTask( pendingTask ); 
                thisService.pendingTasks.splice(0, 1); 
            }  
        }
    };

    FSSimObjectChannel.onCompletedTask($rootScope, this.onCompletedTaskHandler);


  
    /**
     * @desc 
     * @return 
     */
    this.getValidCharacters = function (taskName, taskCategory) {

        var validCharacters = [];

        // generate list of characters which can do this task.
        for ( var character in FSSimState.characterObjs ) {
            if ( FSSimState.characterObjs[character].canPerformTask(taskName, taskCategory)) {
                validCharacters.push( FSSimState.characterObjs[character]);
            }
        }

        return validCharacters;
    };

    /**
     * @desc
     * @return 
     */
    this.getInactiveCharacters = function (validCharacters) {

        var inactiveCharacters = [];
    
        validCharacters.forEach( function ( thisCharacter) {
            if ( thisCharacter.json.activity.length === 0) {
                inactiveCharacters.push( thisCharacter);
            }
        });

        return inactiveCharacters;
    };




    /**
     * @desc 
     * @return 
     */
    this.addTaskCatgeory = function ( task ) {
  

        var validCharacters = this.getValidCharacters(task.name, task.category);
        var validCharactersInactive = this.getInactiveCharacters(validCharacters);

        if ( validCharactersInactive.length > 0) {
            this.activeTasks.push( task);
            validCharactersInactive[0].addTask( task );  

        } else if (validCharacters.length > 0) {
            // queue task

            this.pendingTasks.push( task);

        }
        else {
            this.logDependencies(task.category, task.name);
        }
    };


    this.logDependencies = function ( category, keyName) {
        var characterKey = null;
        var hasEquippedTools = false;
        var haveStats = false;
        var toolDefine;

        switch (category) {
            case 'gathering':
                // stats
                for ( characterKey in FSSimState.characterObjs ) {
                     if ( FSSimState.characterObjs[characterKey].hasStatsFor('gathering') === true) {
                      haveStats = true;
                    }
                }
                if ( haveStats === false) {
                    FSContextConsole.log('No one has the required stats to start gathering ' + keyName, true);
                }

                // equipped
               for ( characterKey in FSSimState.characterObjs ) {
                     if ( FSSimState.characterObjs[characterKey].hasGatheringDependencies(keyName) === true) {
                      hasEquippedTools = true;
                    }
                }
                if ( hasEquippedTools === false) {
                    FSContextConsole.log('No one is equipped with the required tools for gathering ' + keyName, true);

                    for ( toolDefine in FSSimRules.toolDefines) {
                        FSSimRules.toolDefines[toolDefine].actions.forEach( ( function ( action) {
                            if ( FSSimRules.gatherableDefines[keyName].actionable.indexOf(action) !== -1) {
                                FSContextConsole.log(toolDefine, true);
                            } 
                        }).bind(this));
                    }
                }
                break;
            case 'harvesting':
                // stats
                for ( characterKey in FSSimState.characterObjs ) {
                     if ( FSSimState.characterObjs[characterKey].hasStatsFor('harvesting') === true) {
                      haveStats = true;
                    }
                }
                if ( haveStats === false) {
                    FSContextConsole.log('No one has the required stats to start harvesting ' + keyName, true);
                }

                // equipped
                for ( characterKey in FSSimState.characterObjs ) {
                     if ( FSSimState.harvestables[keyName].isHarvestableBy(FSSimState.characterObjs[characterKey]) === true) {
                      hasEquippedTools = true;
                    }
                }
                if ( hasEquippedTools === false) {
                    FSContextConsole.log('No one is equipped with the required tools for harvesting ' + keyName, true);

                    for (   toolDefine in FSSimRules.toolDefines) {
                        FSSimRules.toolDefines[toolDefine].actions.forEach( ( function ( action) {
                            if ( FSSimRules.harvestableDefines[keyName].actionable.indexOf(action) !== -1) {
                                if ( parseInt(FSSimRules.toolDefines[toolDefine].strength, 10) >= parseInt( FSSimRules.harvestableDefines[keyName].hardness, 10)) {
                                    FSContextConsole.log(toolDefine, true);
                                }
                            } 
                        }).bind(this));
                    }
                }
                break;
            case 'crafting':
                // log to console.
                if ( FSSimCrafting.hasCraftingIngredients(keyName, true) === true) {
                    if ( FSSimCrafting.hasCraftingConstructor(keyName, true)) {

                            //stats
                            for ( characterKey in FSSimState.characterObjs ) {
                                 if ( FSSimState.characterObjs[characterKey].hasStatsFor('crafting') === true) {
                                  haveStats = true;
                                }
                            }
                            if ( haveStats === false) {
                                FSContextConsole.log('No one has the required stats to start crafting ' + keyName, true);
                            }

                            //proficiency
                            var hasProficiency = false;
                            for ( characterKey in FSSimState.characterObjs ) {
                                 if ( FSSimState.characterObjs[characterKey].hasCraftingProficiencyFor(keyName, false) === true) {
                                  hasProficiency = true;
                                }
                            }
                            if ( hasProficiency === false) {
                                FSContextConsole.log('No one has the required proficiency to start crafting ' + keyName, true);
                            }
                    }
                }
                break;
        }
    };


  }]);
