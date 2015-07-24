'use strict';


/**
 * @ngdoc service
 * @name craftyApp.fsCharacter
 * @description
 * # fsCharacter
 * runtime mapping of JSON state 'character'.
 */
angular.module('craftyApp')
  .factory('FSCharacter', function (FSTask, FSContextConsole, FSSimRules, FSSimState, FSSimMessagingChannel, FSSimCrafting) {
    // Service logic
    // ...

    var OPTIONAL_PROPERTY_PROFICIENECY = 'proficiency';

    /**
     * @desc 
     * @return 
     */
    var FSCharacter = function(json) {
        this.json = json;

        // start regenerate stats timers
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
    FSCharacter.prototype.addTask = function ( task) {
      if ( this.hasSpareActivitySlot() === true) {
        if (this.json.activity.length === 0) {
            this.json.activity.push( task);
        
            var thisCharacter = this;

            if (this.canPerformTask(task.name, task.category) === true) {

              // Set modify stat timer intervals
              this.statUpdateInterval = {};
              for (var statKeyname in FSSimRules.taskRules[task.category].stat) {

                thisCharacter.modifyStat( statKeyname, 'current', -1); // start each task with an immediate stats decrement.

                (function (thisStatsKeyname) { 
                  thisCharacter.statUpdateInterval[thisStatsKeyname] = setInterval( (function () {
                    if ( this.hasStatsFor(task.category) === true) {
                      this.modifyStat( thisStatsKeyname, 'current', -1);
                    }
                  }).bind(thisCharacter), FSSimRules.taskRules[task.category].stat[thisStatsKeyname].secondsPerDecrement * 1000);
                }(statKeyname));
              }

              // create task interval 
              var duration = FSSimState.getTaskDuration(task.category, task.name, this) ;
              task.createTimer( duration , function() {
                    if ( thisCharacter.hasStatsFor( task.category ) === true) {
                      if ( task.decrementTimer() === false) {
                        thisCharacter.completedTask();
                      }
                    }
                  }
                );
  
              //
              this[task.category + 'OnStart' ]();
            }
        }
      }
    };

    /**
     * @desc 
     * Task has been completed. 
     */
    FSCharacter.prototype.completedTask = function () {

      //clear task intervals
      for (var statKeyname in FSSimRules.taskRules[this.json.activity[0].category].stat) {
        clearInterval( this.statUpdateInterval[statKeyname]);
      }

      //onStop task
      this[ this.json.activity[0].category + 'OnStop' ]();

      //xp gain
      this.json.xp += parseInt(FSSimRules.taskRules[this.json.activity[0].category].xp, 10);
     

      var activeTask = this.json.activity[0];

      this.json.activity.splice(0, 1);

      //signal task completion
      FSSimMessagingChannel.completedTask( activeTask );
    };

     /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.harvestingOnStart = function () {
      // keep stubbed - called by reflective method.
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
        FSSimState.updateHarvestables();
      }

      // need to ensure there is an instance in gatherables before it can be incremented.
      if (!(harvestableType in FSSimState.gatherables)) { 
          var obj = {'name': harvestableType, 'quantity': '0'};
          FSSimMessagingChannel.createSimObject( { category: 'gatherable', desc : obj});
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

      FSSimMessagingChannel.bankDeposit( { type: gatherableType, category: 'gatherable'});
   

      // Rewards
      FSSimMessagingChannel.makeRewards( {'action':'gather', 'target':gatherableType});

      /*
      var rewards = thisFactory.checkRewards( {'action':'gather', 'target':gatherableType});
      if (rewards.hasOwnProperty('xp')) {
          this.json.xp += rewards.xp;
      }
      */
    };


    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.craftingOnStart = function () {

      var craftableType = this.json.activity[0].name;
      var recipeInputObj = FSSimRules.craftableDefines[ craftableType ].input;
      var recipeInputKeys = Object.keys( recipeInputObj );

      recipeInputKeys.forEach( ( function ( recipeKey ){
        var recipeInput = recipeKey;
        var recipeInputQuantity = recipeInputObj[ recipeKey];
        FSSimMessagingChannel.bankWithdrawal( { type: recipeInput, quantity: recipeInputQuantity} );
      }).bind(this));

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
           FSSimMessagingChannel.createSimObject( { category: 'bankable', desc : {'category':FSSimRules.craftableDefines[craftableKey].category, 'name':craftableOutput, quantity : 0} });  
 
        }
        FSSimState.bank[craftableOutput].increment( craftableOutputQuantity);
        FSSimState.updateBank();

        //Rewards
        FSSimMessagingChannel.makeRewards( {'action':'craft', 'target':craftableOutput});
        /*
        var rewards = thisFactory.checkRewards( {'action':'craft', 'target':craftableOutput});
        if (rewards.hasOwnProperty('xp')) {//bug: do we want to add xp for each output object?
          this.json.xp += rewards.xp;
        }
        */
      }
    };


    /**
     * @desc - can character start the next task in queue.
     * @return 
     */
    FSCharacter.prototype.canPerformTask = function (taskName, activityCategory) {     

      var canStartTask = true;

      switch ( activityCategory) {

        case 'gathering': {
            if (FSSimState.gatherables.hasOwnProperty(taskName) !== true) {
              canStartTask = false;
            } else {
              if ( parseInt( FSSimState.gatherables[taskName].json.quantity, 10) === 0) {
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
              canStartTask = false;
            } else {
              if ( parseInt(FSSimState.harvestables[taskName].quantity, 10) === 0) {
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
            if ( FSSimCrafting.hasCraftingIngredients(taskName, false) !== true) {
              canStartTask = false;
            }
            if ( FSSimCrafting.hasCraftingConstructor(taskName, false) !== true) {
              canStartTask = false;
            }
            if ( this.hasStatsFor('crafting') !== true) {
              canStartTask = false;
            }
            if ( this.hasCraftingProficiencyFor(taskName) !== true) {
              canStartTask = false;
            }
          }
          break;
      }

      return canStartTask;
    };

   


    /**
     * @desc Does character have the required proficiency for crafting specified item.
     * @return 
     */
    FSCharacter.prototype.hasCraftingProficiencyFor = function ( craftableKeyName ) {
      var hasRequiredProficiency = true;

      if ( FSSimRules.craftableDefines[craftableKeyName].hasOwnProperty( OPTIONAL_PROPERTY_PROFICIENECY ) === true) {
            hasRequiredProficiency = false;
            if ( this.json.proficiency.profession === FSSimRules.craftableDefines[craftableKeyName].proficiency.profession) {
                if ( parseInt(this.json.proficiency.tier, 10) >= parseInt(FSSimRules.craftableDefines[craftableKeyName].proficiency.tier, 10)){
                  hasRequiredProficiency = true;
                }
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
    FSCharacter.prototype.activityPercentRemaining = function ( ) {
      var percent = 0;
      if ( this.json.activity.length > 0) {
        percent = this.json.activity[0].percentRemaining();
        return percent;
      }
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