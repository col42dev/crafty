'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimTasks
 * @description
 * # FSSimTasks
 * Operate on fstask's.
 */
angular.module('craftyApp')
  .service('FSSimTasks', 
    [ 
        '$rootScope',  
        'FSSimState', 
        'FSSimRules', 
        'FSTask', 
        'FSSimCrafting', 
        'FSContextConsole', 
        'FSSimMessagingChannel', 
    function (
        $rootScope , 
        FSSimState, 
        FSSimRules, 
        FSTask, 
        FSSimCrafting, 
        FSContextConsole, 
        FSSimMessagingChannel) 
    {
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
    this.createCellTask = function ( category, cell) {
        if (cell.task === null) {
            var name = null;
            switch (category) {
                case 'harvesting':
                    name = cell.harvestables.json.name;
                    break;
                default:
                    window.alert('unhandled catagory');
                    break;
            }
            var task = new FSTask( {'name':name, 'category':category, 'cell' : cell});
            cell.task = task;
     
            if ( this.executeTask(task) === false) {  // could not execute task...
                cell.task = null;
            }
        }
    };

   /**
     * @desc 
     * Assign task to character or to pending task queue, discard it if it is inoperable.
     */
    this.executeTask = function ( task ) {
        var validCharactersInactive = this.getWorkersArray();

        if ( validCharactersInactive.length >= task.workers) {
            this.activeTasks.push( task);

            for ( var i = 0; i < task.workers; i ++) {
                task.characters.push(validCharactersInactive[i]); 

                delete FSSimState.characters[ validCharactersInactive[i].json.name];
            }


            // create task interval 
              var duration = FSSimState.getTaskDuration(task); 

              task.createTimer( duration , 
                    function() {
                      if ( task.decrementTimer() === false) {
                        this.onCompletedTaskHandler (task);                    
                      }
                  }.bind(this)
                );
  
              //
              task[task.category + 'OnStart' ]();

        } 
        /*else if (validCharacters.length > 0) {
            // queue task
            if (this.pendingTasks.length < MAX_QUEUED_TASK_COUNT) {
                this.pendingTasks.push( task);
            } else {
                 FSContextConsole.log('Task queue is full', true);
                 return false;
            }
        }
        else {
            this.logDependencies(task);
            return false;
        }*/
        return true;
    };




    /**
     * @desc 
     * callback from state when a character completes a task.
     */
    this.onCompletedTaskHandler = function( task) {

        //clear task intervals
        /*
        for (var statKeyname in FSSimRules.taskRules[task.category].stat) {
        clearInterval( this.statUpdateInterval[statKeyname]);
        }*/

        //onStop task
        task[ task.category + 'OnStop' ]();

        //xp gain
        //this.json.xp += parseInt(FSSimRules.taskRules[this.json.activity[0].category].xp, 10);


        //var activeTask = this.json.activity[0];

        //this.json.activity.splice(0, 1);

        task.characters.forEach( function ( thisCharacter) {
            FSSimState.characters[ thisCharacter.json.name] = thisCharacter;
        });


        if (task.cell !== null) {
            task.cell.task = null;
        }

        var completedTaskIndex = thisService.activeTasks.indexOf(task);
        if (completedTaskIndex !== -1) {
            thisService.activeTasks.splice( completedTaskIndex, 1);
        }

        // look for next task to start.
        /*
        var pendingTasksToRemove = [];

        for (var pendingTaskKey in thisService.pendingTasks ) {

            var pendingTask = thisService.pendingTasks[pendingTaskKey];

            var validCharactersInactive = this.getWorkersArray();

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
        */
    };

    // Register 'onCompletedTaskHandler' callback after handler declaration
    FSSimMessagingChannel.onCompletedTask($rootScope, this.onCompletedTaskHandler);



    /**
     * @desc  legacy - refactor this function away!
     * @return 
     */
    this.getWorkersArray = function () {

        var validCharacters = [];

        for ( var character in FSSimState.characters ) {
                validCharacters.push( FSSimState.characters[character]);
        }


        return validCharacters;
    };
  

    /**
     * @desc 
     * log reasons and/or missing dependencies to console for task.
     */
    this.logDependencies = function ( task ) {

        var category = task.category;
        var keyName = task.name;
        var characterKey = null;
        var haveStats = false;

        switch (category) {

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
                break;

            case 'crafting':
                if ( FSSimCrafting.hasCraftingIngredients(keyName, true) === true) {
                    if ( FSSimCrafting.hasCraftingConstructor(keyName, true)) {

                    }
                }
                break;
        }
    };


  }]);
