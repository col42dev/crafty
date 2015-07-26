'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimTasks
 * @description
 * # FSSimTasks
 * Operate on fstask's.
 */
angular.module('craftyApp')
  .service('FSSimTasks', [ '$rootScope',  'FSSimState', 'FSSimRules', 'FSTask', 'FSSimCrafting', 'FSContextConsole', 'FSSimMessagingChannel', function ($rootScope , FSSimState, FSSimRules, FSTask, FSSimCrafting, FSContextConsole, FSSimMessagingChannel) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var thisService = this;
    this.activeTasks = [];
    this.pendingTasks = [];
    var MAX_QUEUED_TASK_COUNT = 6;

    /**
     * @desc 
     * Create Task and process it for execution by a character.
     */
    this.createTask = function ( tableName, keyName) {
        var task = null;

        switch (tableName) {
            case 'gatherable':
                task = new FSTask( {'name':keyName, 'category':'gathering'});
                break;
            case 'harvestable':
                task = new FSTask( {'name':keyName, 'category':'harvesting'});
                break;
            case 'craftable':
                task = new FSTask( {'name':keyName, 'category':'crafting'});
                break;
        }

        this.executeTask(task);
    };

    /**
     * @desc 
     * Create Task and process it for execution by a character.
     */
    this.createCellTask = function ( cell) {
        if (cell.task === null) {
            var task = new FSTask( {'name':cell.resource, 'category':'harvesting', 'cell' : cell});
            cell.task = task;
     
            if ( this.executeTask(task) === false) {
                cell.task = null;
            }
        }
    };

   /**
     * @desc 
     * Assign task to character or to pending task queue, discard it if it is inoperable.
     */
    this.executeTask = function ( task ) {
        var validCharacters = this.getValidCharacters(task);
        var validCharactersInactive = this.getInactiveCharacters(validCharacters);

        if ( validCharactersInactive.length > 0) {
            this.activeTasks.push( task);
            validCharactersInactive[0].addTask( task );  

        } else if (validCharacters.length > 0) {
            // queue task
            if (this.pendingTasks.length < MAX_QUEUED_TASK_COUNT) {
                this.pendingTasks.push( task);
            } else {
                 FSContextConsole.log('Task queue is full', true);
                 return false;
            }
        }
        else {
            if ( task.cell === null) {
                this.logDependencies(task);
            }
            return false;
        }
        return true;
    };

    /**
     * @desc 
     * callback from state when a character completes a task.
     */
    var onCompletedTaskHandler = function( task) {
        if (task.cell !== null) {
            task.cell.task = null;
        }

        var completedTaskIndex = thisService.activeTasks.indexOf(task);
        if (completedTaskIndex !== -1) {
            thisService.activeTasks.splice( completedTaskIndex, 1);
        }

        // look for next task to start.
        var pendingTasksToRemove = [];

        for (var pendingTaskKey in thisService.pendingTasks ) {

            var pendingTask = thisService.pendingTasks[pendingTaskKey];

            var validCharacters = thisService.getValidCharacters(pendingTask);
            var validCharactersInactive = thisService.getInactiveCharacters(validCharacters);

            if ( validCharactersInactive.length > 0) {
                // start this pending task
                thisService.activeTasks.push( pendingTask);
                validCharactersInactive[0].addTask( pendingTask ); 
                pendingTasksToRemove.push(pendingTask);
                break;
            }  else if (validCharacters.length === 0){
                // pending task cannot be started by any characters (idle or active) so remove it from pending queue. 
                pendingTasksToRemove.push(pendingTask);

            } else {
                // task can be started but by a currebtly active character.
                // look through remainder of list for a valid task to start.
            }
        }

        // remove flagged tasks from pendingTasks.
        pendingTasksToRemove.forEach( function( task) {

                var removeTaskIndex = thisService.pendingTasks.indexOf(task);
                if (removeTaskIndex !== -1) {
                    thisService.pendingTasks.splice( removeTaskIndex, 1);
                }
        });
    };

    // Register 'onCompletedTaskHandler' callback after handler declaration
    FSSimMessagingChannel.onCompletedTask($rootScope, onCompletedTaskHandler);


    /**
     * @desc 
     * @return: array of characters which can perform the task. (ignoring current activities)
     */
    this.getValidCharacters = function (task) {

        var validCharacters = [];

        // generate list of characters which can do this task.
        for ( var character in FSSimState.characters ) {
            if ( FSSimState.characters[character].canPerformTask(task.name, task.category)) {
                validCharacters.push( FSSimState.characters[character]);
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
     * log reasons and/or missing dependencies to console for task.
     */
    this.logDependencies = function ( task ) {

        var category = task.category;
        var keyName = task.name;
        var characterKey = null;
        var hasEquippedTools = false;
        var haveStats = false;
        var toolDefine;

        switch (category) {
            case 'gathering':
                // stats
                for ( characterKey in FSSimState.characters ) {
                     if ( FSSimState.characters[characterKey].hasStatsFor('gathering') === true) {
                      haveStats = true;
                    }
                }
                if ( haveStats === false) {
                    FSContextConsole.log('No one has the required stats to start gathering ' + keyName, true);
                }

                // equipped
               for ( characterKey in FSSimState.characters ) {
                     if ( FSSimState.characters[characterKey].hasGatheringDependencies(keyName) === true) {
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
                for ( characterKey in FSSimState.characters ) {
                     if ( FSSimState.characters[characterKey].hasStatsFor('harvesting') === true) {
                      haveStats = true;
                    }
                }
                if ( haveStats === false) {
                    FSContextConsole.log('No one has the required stats to start harvesting ' + keyName, true);
                }

                // equipped
                for ( characterKey in FSSimState.characters ) {
                     if ( FSSimState.harvestables[keyName].isHarvestableBy(FSSimState.characters[characterKey]) === true) {
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
                if ( FSSimCrafting.hasCraftingIngredients(keyName, true) === true) {
                    if ( FSSimCrafting.hasCraftingConstructor(keyName, true)) {

                            //stats
                            for ( characterKey in FSSimState.characters ) {
                                 if ( FSSimState.characters[characterKey].hasStatsFor('crafting') === true) {
                                  haveStats = true;
                                }
                            }
                            if ( haveStats === false) {
                                FSContextConsole.log('No one has the required stats to start crafting ' + keyName, true);
                            }

                            //proficiency
                            var hasProficiency = false;
                            for ( characterKey in FSSimState.characters ) {
                                 if ( FSSimState.characters[characterKey].hasCraftingProficiencyFor(keyName) === true) {
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
