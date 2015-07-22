'use strict';


/**
 * @ngdoc service
 * @name craftyApp.fsCharacter
 * @description
 * # fsCharacter
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSCharacter', function (FSBackpack, FSGatherable, FSTask, FSContextConsole, FSSimRules, FSSimState) {
    // Service logic
    // ...
    var thisFactory = null;

    /**
     * @desc 
     * @return 
     */
    var FSCharacter = function(json, simFactory) {
        thisFactory = simFactory;
        this.json = json;

        // regenerate stats timers
        ['health', 'energy', 'mind'].forEach( (function( statName) {

          setInterval( (function () {
            if ( this.json.activity.length === 0) {
              this.modifyStat( statName, 'current', 1);
            } else {
                  //regen stats if character is paused on current task.
                  if ( this.hasStatsFor( this.json.activity[0].category ) === false) {
                        this.modifyStat( statName, 'current', 1);
                  }
            }
           }).bind(this), this.json.stats[statName].regeneratePeriod * 1000);

        }).bind(this));
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.getbgcolor =  function( ) {     
      return  ((FSSimState.selectedCharacter  !== null) && (this.getFullName() === FSSimState.selectedCharacter.getFullName())) ? '#00FF00' : null;       
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.getFullName = function () {
      return this.json.name;
    };

    /**
     * @desc - push task to activity queue and trigger it if queu is empty
     * @return 
     */
    FSCharacter.prototype.addTask = function ( taskName, taskCategory) {
      if ( this.hasSpareActivitySlot() === true) {
        this.json.activity.push( new FSTask( {'name':taskName, 'category':taskCategory}));
        if (this.json.activity.length === 1) {
          this.startNextTask();
        }
      }
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.stopActiveTask = function () {

      //clear task intervals
      for (var statKeyname in FSSimRules.taskRules[this.json.activity[0].category].stat) {
        clearInterval( this.statUpdateInterval[statKeyname]);
      }

      //onStop task
      this[ this.json.activity[0].category + 'OnStop' ]();

      //xp gain
      this.json.xp += parseInt(FSSimRules.taskRules[this.json.activity[0].category].xp, 10);
     
      this.json.activity.splice(0, 1);

      // start next queued activity
      if (this.json.activity.length > 0) {
        this.startNextTask();
      }

      thisFactory.ctrllrScopeApply();
    };

     /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.harvestingOnStart = function () {
    };

     /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.harvestingOnStop = function () {
      var harvestableType = this.json.activity[0].name;

      FSSimState.harvestables[harvestableType].decrement();

      if ( FSSimState.harvestables[harvestableType].json.quantity === 0) {
        delete FSSimState.harvestables[harvestableType];
        thisFactory.updateHarvestables();
      }

      // need to ensure there is an instance in gatherables before it can be incremented.
      if (!(harvestableType in FSSimState.gatherables)) { 
          var obj = {'name': harvestableType, 'quantity': '0'};
          FSSimState.gatherables[harvestableType] = new FSGatherable(obj);
      }
      
      FSSimState.gatherables[harvestableType].increment();
      FSSimState.updateGatherables();
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.gatheringOnStart = function () {
      var gatherableType = this.json.activity[0].name;
      FSSimState.gatherables[gatherableType].decrement(); 
      if ( FSSimState.gatherables[gatherableType].json.quantity === 0) {
        delete FSSimState.gatherables[gatherableType];
        FSSimState.updateGatherables(); 
      }
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.gatheringOnStop = function () {
      var gatherableType = this.json.activity[0].name;

      if (!(gatherableType in FSSimState.bank)) {
        FSSimState.bank[gatherableType] = new FSBackpack({'category':'gatherable', 'name':gatherableType});
      }
      FSSimState.bank[gatherableType].increment(1);
      FSSimState.updateBank();

      // Rewards
      var rewards = thisFactory.checkRewards( {'action':'gather', 'target':gatherableType});
      if (rewards.hasOwnProperty('xp')) {
          this.json.xp += rewards.xp;
      }
    };


    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.craftingOnStart = function () {
      thisFactory.bankTransaction( 'startCrafting', this.json.activity[0].name);
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.craftingOnStop = function () {

      var craftableKey = this.json.activity[0].name;

      // generate output in bank.
      var craftableOutputObj = FSSimRules.craftableDefines[craftableKey].output;

      // assumes only one type is craftableOutput.
      for (var outputKey in craftableOutputObj) {

        var craftableOutput = outputKey;
        var craftableOutputQuantity = craftableOutputObj[ craftableOutput ];
        
        // add output to bank.
        if (!(craftableOutput in FSSimState.bank)) {
          FSSimState.bank[craftableOutput] = new FSBackpack( {'category':FSSimRules.craftableDefines[craftableKey].category, 'name':craftableOutput});
        }
        FSSimState.bank[craftableOutput].increment( craftableOutputQuantity);
        FSSimState.updateBank();

        //Rewards
        var rewards = thisFactory.checkRewards( {'action':'craft', 'target':craftableOutput});
        if (rewards.hasOwnProperty('xp')) {//bug: do we want to add xp for each output object?
          this.json.xp += rewards.xp;
        }
      }
    };


    /**
     * @desc - can character start the next task in queue.
     * @return 
     */
    FSCharacter.prototype.canPerformTask = function (taskName, activityCategory, log) {     

      var canStartTask = true;

      switch ( activityCategory) {
        case 'gathering': {
            if (FSSimState.gatherables.hasOwnProperty(taskName) !== true) {
              canStartTask = false;
              FSContextConsole.log('There is no ' + taskName + ' left to gather', log);
            } else {
              if ( parseInt( FSSimState.gatherables[taskName].json.quantity, 10) === 0) {
                FSContextConsole.log('No ' + taskName + ' left to gather', log);
                canStartTask = false;
              }
              if ( this.hasStatsFor('gathering') !== true) {
                canStartTask = false;
              }
              if (this.hasGatheringDependencies(taskName) !== true) {
                canStartTask = false;
              }
            } 
          }
          break;
        case 'harvesting': {
            if (FSSimState.harvestables.hasOwnProperty(taskName) !== true) {
              FSContextConsole.log('There is no ' + taskName + ' left to harvest', log);
              canStartTask = false;
            } else {
              if ( parseInt(FSSimState.harvestables[taskName].quantity, 10) === 0) {
                FSContextConsole.log('There is no ' + taskName + ' left to harvest', log);
                canStartTask = false;
              }
              if ( this.hasStatsFor('harvesting') !== true) {
                canStartTask = false;
              }
              if ( FSSimState.harvestables[taskName].isHarvestableBy( this) !== true) {
                canStartTask = false;
              }
            }
          }
          break;

        case 'crafting': {  
            if ( thisFactory.hasCraftingIngredients(taskName, log) !== true) {
              canStartTask = false;
            }
            if ( thisFactory.hasCraftingConstructor(taskName, log) !== true) {
              canStartTask = false;
            }
            if ( this.hasStatsFor('crafting') !== true) {
              canStartTask = false;
            }
            if ( this.hasCraftingProficiencyFor(taskName, log) !== true) {
              canStartTask = false;
            }
          }
          break;
      }

      return canStartTask;
    };

    /**
     * @desc - execute next queued task.
     * @return 
     */
    FSCharacter.prototype.startNextTask = function () {  

      var taskName = this.json.activity[0].name;
      var thisCharacter = this;
      var activityCategory = this.json.activity[0].category;

      if (this.canPerformTask(taskName, activityCategory) === true) {

        // Set modify stat timer intervals
        this.statUpdateInterval = {};
        for (var statKeyname in FSSimRules.taskRules[activityCategory].stat) {
          thisCharacter.modifyStat( statKeyname, 'current', -1); // start task with immediate stats decrement.

          (function (thisStatsKeyname) { 
            thisCharacter.statUpdateInterval[thisStatsKeyname] = setInterval( (function () {
              if ( this.hasStatsFor(activityCategory) === true) {
                this.modifyStat( thisStatsKeyname, 'current', -1);
              }
            }).bind(thisCharacter), FSSimRules.taskRules[activityCategory].stat[thisStatsKeyname].secondsPerDecrement * 1000);
          }(statKeyname));
        }

        this.updateActiveTaskTotalSeconds = thisFactory.getTaskDuration(activityCategory, taskName, thisCharacter);    
     
        // set task time remaining timer.
        this.updateActiveTaskRemainingSeconds = this.updateActiveTaskTotalSeconds;
        this.updateActiveTaskInterval =  setInterval( function() {
          if ( thisCharacter.hasStatsFor( activityCategory ) === true) {
            thisCharacter.updateActiveTaskRemainingSeconds --;
            if ( thisCharacter.updateActiveTaskRemainingSeconds <= 0) {
              clearInterval(thisCharacter.updateActiveTaskInterval);
              thisCharacter.stopActiveTask();
            }
          }
        }, 1000);

        this[activityCategory + 'OnStart' ]();

      }  // can start task
      else  {

        // skip to next task in queue?
        this.json.activity.splice(0, 1);
        if (this.json.activity.length > 0) {
          this.startNextTask();
        }

      }

    };


    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasCraftingProficiencyFor = function (recipeKey, log) {
      var hasRequiredProficiency = true;

      if ( FSSimRules.craftableDefines[recipeKey].hasOwnProperty('proficiency') === true) {

            hasRequiredProficiency = false;

            if ( this.json.proficiency.profession === FSSimRules.craftableDefines[recipeKey].proficiency.profession) {
                if ( parseInt(this.json.proficiency.tier, 10) >= parseInt(FSSimRules.craftableDefines[recipeKey].proficiency.tier, 10)){
                  hasRequiredProficiency = true;
                } else if (log === true) {
                  var requiredProfession = FSSimRules.craftableDefines[recipeKey].proficiency.profession;
                  var requiredTier = parseInt(FSSimRules.craftableDefines[recipeKey].proficiency.tier, 10);
                  FSContextConsole.log(this.json.name  + ' requires tier ' + requiredTier + ' in ' + requiredProfession + ' but is only tier ' + this.json.proficiency.tier );
                }
            } else if (log === true) {
                  FSContextConsole.log('A ' + FSSimRules.craftableDefines[recipeKey].proficiency.profession + ' is needed to craft a ' + recipeKey);
            }
      }

      return hasRequiredProficiency;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasSpareActivitySlot = function (log) {

      if ( this.json.activity.length < 4 ) {
        return true;
      }

      if ( log === true) {
        FSContextConsole.log('Activty queue is full');
      }

      return false;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasGatheringDependencies = function ( gatheringName) {
      var hasDependencies = false;

      FSSimRules.gatherableDefines[gatheringName].actionable.forEach( ( function(thisActionable) {
        if ( this.hasToolAction(thisActionable) === true) {
          hasDependencies = true;
        } 
      }).bind(this)); 

      return hasDependencies;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasStatsFor = function ( taskCategory) {

      var hasStats = true;

      for (var statKeyname in FSSimRules.taskRules[taskCategory].stat) {
        var required = parseInt( FSSimRules.taskRules[taskCategory].stat[statKeyname].minRequired, 10);
        var current = parseInt( this.json.stats[statKeyname].current, 10) ;
        if ( current< required) {
          hasStats = false;
        }
      }

      return hasStats;
    };


    /**
     * @desc : is this character equipped with a tool which has the specified action.
     * @return 
     */
    FSCharacter.prototype.hasToolAction = function ( toolAction, log) {
      var bHasToolAction = false;
     
      // build combined 'tool actions' array
      var tools = ['Hands'];
      if ( this.json.tools.length > 0) {
        this.json.tools.forEach( function( thisTool ) {
          if ( tools.indexOf( thisTool.json.name ) === -1) {
            tools.push( thisTool.json.name);
          }
        });
      } 

      tools.forEach( ( function( thisTool) {
        FSSimRules.toolDefines[thisTool].actions.forEach( ( function ( action) {
          if ( toolAction === action) {
            bHasToolAction = true;
          } 
        }).bind(this)); 
      } ).bind(this));   

      if (bHasToolAction === false && log === true)  {
        FSContextConsole.log('Equipped tool(s) (' + tools + ') do not have required action (' + toolAction  + ')');
      }

      return bHasToolAction;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.queuedTaskCount = function ( ) {
      return Math.max(this.json.activity.length - 1, 0);
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.activityPercentRemaining = function ( ) {
      var percent = Math.floor( this.updateActiveTaskRemainingSeconds / this.updateActiveTaskTotalSeconds  * 100);
      return percent+'%';
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.getStatPercentage = function ( type) {
      var stats = this.json.stats[type];
      return Math.floor(100 * parseInt(stats.current, 10) /  parseInt(stats.max, 10)) +'%';
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.modifyStat = function ( type, subtype, amount) {

      var newValue = parseInt(this.json.stats[type][subtype], 10) + amount;
      if (subtype === 'current') {
        if ( parseInt(this.json.stats[type].current, 10) + amount > parseInt(this.json.stats[type].max, 10)) {
            newValue = parseInt( this.json.stats[type].max, 10);
        }
        if ( parseInt(this.json.stats[type].current, 10) + amount < 0) {
            newValue = 0;
        }
      }

      this.json.stats[type][subtype] = newValue;
      return this.json.stats[type][subtype];
    };

    /**
    * Return the constructor function.
    */
    return FSCharacter;
  
  });
