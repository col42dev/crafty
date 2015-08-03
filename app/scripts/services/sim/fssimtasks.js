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
        'WorldMap', 
    function (
        $rootScope , 
        FSSimState, 
        FSSimRules, 
        FSTask, 
        FSSimCrafting, 
        FSContextConsole, 
        FSSimMessagingChannel,
        WorldMap) 
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
     * Create task and trigger it.
     */
    this.createCellTask = function ( category, cellIndex) {

        var existingTask = this.getTaskAtWorldLocation( cellIndex);

        if (existingTask === null) {

            var cell = WorldMap.json.worldMap[cellIndex.row][cellIndex.col];
   
            var name = null;
            switch (category) {
                case 'harvesting':
                    name = cell.harvestables.json.name;
                    break;
                default:
                    window.alert('unhandled catagory');
                    break;
            }
            var task = new FSTask( {'name':name, 'category':category, 'cellIndex' : cellIndex});
            this.executeTask(task);
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

            // move character from worker pool in to task
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

        return true;
    };


    /**
     * @desc 
     * callback from state when a character completes a task.
     */
    this.onCompletedTaskHandler = function( task) {

        // onStop task
        task[ task.category + 'OnStop' ]();

        // move workers back in to pool
        task.characters.forEach( function ( thisCharacter) {
            FSSimState.characters[ thisCharacter.json.name] = thisCharacter;
        });

    };

    // Register 'onCompletedTaskHandler' callback after handler declaration
    FSSimMessagingChannel.onCompletedTask($rootScope, this.onCompletedTaskHandler);


    /**
    * @desc 
    * @return 
    */
    this.getTaskPercentRemaining = function(catgeory, row, col) {

        var taskCellIndex = WorldMap.getIndexOf(row, col);

        if ( catgeory === 'harvesting') {
            var percentRemaining = '0%';
     
            this.activeTasks.forEach( function ( activeTask) {
     
                if ((activeTask.cellIndex.row === taskCellIndex.row) && 
                    (activeTask.cellIndex.col === taskCellIndex.col)) {
    
                    if (activeTask.category === 'harvesting') {
                        percentRemaining = activeTask.percentRemaining();
                    }
                }
            });

            return percentRemaining;
        } 

        return '0%';
    };


   /**
    * @desc 
    * @return 
    */
    this.getTaskAtWorldLocation = function( taskCellIndex) {

        var task = null;

        this.activeTasks.forEach( function ( activeTask) {
                if ((activeTask.cellIndex.row === taskCellIndex.row) && 
                    (activeTask.cellIndex.col === taskCellIndex.col)) {
                    task = activeTask;
                }
            });

       return task;
    };

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
