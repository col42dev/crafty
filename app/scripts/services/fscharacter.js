'use strict';

/**
 * @ngdoc service
 * @name craftyApp.fsCharacter
 * @description
 * # fsCharacter
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSCharacter', function (FSTask, FSBackpack, FSGatherable) {
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
      return  ((thisFactory.selectedCharacter  !== null) && (this.getFullName() === thisFactory.selectedCharacter.getFullName())) ? '#00FF00' : null;       
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

      if ( this.hasSpareActivitySlot(true) === true) {
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
      for (var statKeyname in thisFactory.taskRules[this.json.activity[0].category].stat) {
        clearInterval( this.statUpdateInterval[statKeyname]);
      }

      //onStop task
      this[ this.json.activity[0].category + 'OnStop' ]();
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

      thisFactory.harvestables[harvestableType].json.quantity -= 1;

      if ( thisFactory.harvestables[harvestableType].json.quantity === 0) {
        delete thisFactory.harvestables[harvestableType];
        thisFactory.updateHarvestables();
      }

      // need to ensure there is an instance in gatherables before it can be incremented.
      if (!(harvestableType in thisFactory.gatherables)) { 
          var obj = {'name': harvestableType, 'quantity': '0', 'gatherers' : 0};
          thisFactory.gatherables[harvestableType] = new FSGatherable(obj, thisFactory);
      }
      
      thisFactory.gatherables[harvestableType].json.quantity ++;
      thisFactory.updateGatherables();

      this.json.activity.splice(0, 1);

      // start next activity
      if (this.json.activity.length > 0) {
        this.startNextTask();
      }

      thisFactory.ctrllrScopeApply();
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.gatheringOnStart = function () {
      thisFactory.gatherables[ this.json.activity[0].name ].json.gatherers ++;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.gatheringOnStop = function () {

      var gatherableType = this.json.activity[0].name;

      thisFactory.gatherables[gatherableType].json.quantity -= 1;
      thisFactory.gatherables[gatherableType].json.gatherers --;

      if ( thisFactory.gatherables[gatherableType].json.quantity === 0) {
        delete thisFactory.gatherables[gatherableType];
        thisFactory.updateGatherables();
      }

      if (!(gatherableType in thisFactory.bank)) {
        thisFactory.bank[gatherableType] = new FSBackpack({'category':'gatherable', 'name':gatherableType});
      }
      thisFactory.bank[gatherableType].increment(1);
      thisFactory.updateBank();

      // Rewards
      thisFactory.checkRewards( {'action':'gather', 'target':gatherableType});

      this.json.activity.splice(0, 1);

      // start next activity
      if (this.json.activity.length > 0) {
        this.startNextTask();
      }

       thisFactory.ctrllrScopeApply();
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
      var craftableOutputObj = thisFactory.craftableDefines[craftableKey].output;

      // assumes only one type is craftableOutput.
      for (var outputKey in craftableOutputObj) {

        var craftableOutput = outputKey;
        var craftableOutputQuantity = craftableOutputObj[ craftableOutput ];
        
        // add output to bank.
        if (!(craftableOutput in thisFactory.bank)) {
          thisFactory.bank[craftableOutput] = new FSBackpack( {'category':thisFactory.craftableDefines[craftableKey].category, 'name':craftableOutput});
        }
        thisFactory.bank[craftableOutput].increment( craftableOutputQuantity);
        thisFactory.updateBank();

        //Rewards
        thisFactory.checkRewards( {'action':'craft', 'target':craftableOutput});
      }

      this.json.activity.splice(0, 1);

      // start next activity
      if (this.json.activity.length > 0) {
        this.startNextTask();
      }

       thisFactory.ctrllrScopeApply();
    };


    /**
     * @desc - can character start the next task in queue.
     * @return 
     */
    FSCharacter.prototype.canStartNextTask = function () {     
      var taskName = this.json.activity[0].name;
      var canStartTask = true;
      var activityCategory = this.json.activity[0].category;

      switch ( activityCategory) {
        case 'gathering': {
            if (thisFactory.gatherables.hasOwnProperty(taskName) !== true) {
              canStartTask = false;
              thisFactory.contextConsole.log('There is no ' + taskName + ' left to gather');
            } else {
              if ( thisFactory.gatherables[taskName].json.quantity <= thisFactory.gatherables[taskName].json.gatherers) { 
                thisFactory.contextConsole.log('No ' + taskName + ' left to gather');
                canStartTask = false;
              }
              if ( thisFactory.gatherables[taskName].json.quantity === 0) {
                thisFactory.contextConsole.log('No ' + taskName + ' left to gather');
                canStartTask = false;
              }
              if ( this.hasStatsFor('gathering', true) !== true) {
                canStartTask = false;
              }
              if (this.hasGatheringDependencies(taskName, true) !== true) {
                canStartTask = false;
              }
            } 
          }
          break;
        case 'harvesting': {
            if (thisFactory.harvestables.hasOwnProperty(taskName) !== true) {
              thisFactory.contextConsole.log('There is no ' + taskName + ' left to harvest');
              canStartTask = false;
            } else {
              if (thisFactory.harvestables[taskName].quantity === 0) {
                thisFactory.contextConsole.log('There is no ' + taskName + ' left to harvest');
                canStartTask = false;
              }
              if ( this.hasStatsFor('harvesting', true) !== true) {
                canStartTask = false;
              }
              if ( thisFactory.harvestables[taskName].isHarvestableBy( this, true) !== true) {
                canStartTask = false;
              }
            }
          }
          break;

        case 'crafting': {  
            if ( thisFactory.hasCraftingIngredients(taskName, true) !== true) {
              canStartTask = false;
            }
            if ( thisFactory.hasCraftingConstructor(taskName, true) !== true) {
              canStartTask = false;
            }
            if ( this.hasStatsFor('crafting', true) !== true) {
              canStartTask = false;
            }
            if ( this.hasCraftingProficiencyFor(taskName, true) !== true) {
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

      if (this.canStartNextTask() === true) {

        // Set modify stat timer intervals
        this.statUpdateInterval = {};
        for (var statKeyname in thisFactory.taskRules[activityCategory].stat) {
          thisCharacter.modifyStat( statKeyname, 'current', -1); // start task with immediate stats decrement.

          (function (thisStatsKeyname) { 
            thisCharacter.statUpdateInterval[thisStatsKeyname] = setInterval( (function () {
              if ( this.hasStatsFor(activityCategory) === true) {
                this.modifyStat( thisStatsKeyname, 'current', -1);
              }
            }).bind(thisCharacter), thisFactory.taskRules[activityCategory].stat[thisStatsKeyname].secondsPerDecrement * 1000);
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

      if ( thisFactory.craftableDefines[recipeKey].hasOwnProperty('proficiency') === true) {

            hasRequiredProficiency = false;

            if ( this.json.proficiency.profession === thisFactory.craftableDefines[recipeKey].proficiency.profession) {
                if ( parseInt(this.json.proficiency.tier, 10) >= parseInt(thisFactory.craftableDefines[recipeKey].proficiency.tier, 10)){
                  hasRequiredProficiency = true;
                } else if (log === true) {
                  var requiredProfession = thisFactory.craftableDefines[recipeKey].proficiency.profession;
                  var requiredTier = parseInt(thisFactory.craftableDefines[recipeKey].proficiency.tier, 10);
                  thisFactory.contextConsole.log(this.json.name  + ' requires tier ' + requiredTier + ' in ' + requiredProfession + ' but is only tier ' + this.json.proficiency.tier );
                }
            } else if (log === true) {
                  thisFactory.contextConsole.log('A ' + thisFactory.craftableDefines[recipeKey].proficiency.profession + ' is needed to craft a ' + recipeKey);
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
        thisFactory.contextConsole.log('Activty queue is full');
      }

      return false;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasGatheringDependencies = function ( gatheringName, log) {
      var hasDependencies = false;

      thisFactory.gatherableDefines[gatheringName].actionable.forEach( ( function(thisActionable) {
        if ( this.hasToolAction(thisActionable, log) === true) {
          hasDependencies = true;
        } 
      }).bind(this)); 

      return hasDependencies;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasStatsFor = function ( taskCategory, log) {

      var hasStats = true;

      for (var statKeyname in thisFactory.taskRules[taskCategory].stat) {
        var required = parseInt( thisFactory.taskRules[taskCategory].stat[statKeyname].minRequired, 10);
        var current = parseInt( this.json.stats[statKeyname].current, 10) ;
        if ( current< required) {
          hasStats = false;

          if (log === true) {
            thisFactory.contextConsole.log( 'Require ' + required + ' ' + statKeyname + ' for ' + taskCategory + ' but ' + this.json.name + ' only has ' + current);
          }
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
        thisFactory.toolDefines[thisTool].actions.forEach( ( function ( action) {
          if ( toolAction === action) {
            bHasToolAction = true;
          } 
        }).bind(this)); 
      } ).bind(this));   

      if (bHasToolAction === false && log === true)  {
        thisFactory.contextConsole.log('Equipped tool(s) (' + tools + ') do not have required action (' + toolAction  + ')');
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
