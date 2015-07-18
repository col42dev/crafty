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

  
        // regen stats timers
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
     * @desc 
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
    FSCharacter.prototype.stopHarvesting = function () {

      clearInterval(this.updateActiveTaskInterval);
      for (var statKeyname in thisFactory.taskRules.harvesting.stat) {
        clearInterval( this.statUpdateInterval[statKeyname]);
      }

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
    FSCharacter.prototype.stopGathering = function () {

      clearInterval(this.updateActiveTaskInterval);
      for (var statKeyname in thisFactory.taskRules.gathering.stat) {
        clearInterval( this.statUpdateInterval[statKeyname]);
      }

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

      //Rewards
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
    FSCharacter.prototype.stopCrafting = function () {

      clearInterval(this.updateActiveTaskInterval);
      for (var statKeyname in thisFactory.taskRules.crafting.stat) {
        clearInterval( this.statUpdateInterval[statKeyname]);
      }

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
     * @desc 
     * @return 
     */
    FSCharacter.prototype.startNextTask = function () {     
      var taskName = this.json.activity[0].name;

      var thisCharacter = this;
 

      var canStartTask = true;

      switch ( this.json.activity[0].category) {
        case 'gathering':
          {

            if (thisFactory.gatherables.hasOwnProperty(taskName) !== true) {
              canStartTask = false;
              thisFactory.contextConsole.log('There is no ' + taskName + ' left to gather');
            } else {

              if ( thisFactory.gatherables[taskName].json.quantity <= thisFactory.gatherables[taskName].json.gatherers) { // too many cooks?
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

        case 'harvesting':
          {

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

        case 'crafting':
          {
            if ( thisFactory.hasCraftingIngredients(taskName, true) !== true) {
              canStartTask = false;
            }


            if ( thisFactory.hasCraftingConstructor(taskName, true) !== true) {
              canStartTask = false;
            }


            if ( this.hasStatsFor('crafting', true) !== true) {
              canStartTask = false;
            }

            if ( this.hasRequiredCraftingProficiency(taskName, true) !== true) {
              canStartTask = false;
            }
          }
          break;
      }


      //
      if (canStartTask === true) {

        switch ( this.json.activity[0].category) {
          case 'gathering':
          {

              // Set modify stat timer intervals
              this.statUpdateInterval = {};
              for (var gatheringStatKeyname in thisFactory.taskRules.gathering.stat) {
              //console.log('start statUpdateInterval:' + gatheringStatKeyname + '' + thisFactory.taskRules.gathering.stat[gatheringStatKeyname].secondsPerDecrement);

                (function (thisStatsKeyname) {
                  thisCharacter.modifyStat( thisStatsKeyname, 'current', -1);

                  thisCharacter.statUpdateInterval[thisStatsKeyname] = setInterval( (function () {

                  if ( this.hasStatsFor('gathering') === true) {
                   this.modifyStat( thisStatsKeyname, 'current', -1);
                  }

                  }).bind(thisCharacter), thisFactory.taskRules.gathering.stat[thisStatsKeyname].secondsPerDecrement * 1000);

                }(gatheringStatKeyname));
              }

              // task time remaining timer
              this.updateActiveTaskTotalSeconds = thisFactory.gatherables[taskName].duration(thisCharacter) / thisFactory.taskTimeScalar;
              this.updateActiveTaskRemainingSeconds = this.updateActiveTaskTotalSeconds;
              this.updateActiveTaskInterval =  setInterval( function() {
              if ( thisCharacter.hasStatsFor('gathering') === true) {

                thisCharacter.updateActiveTaskRemainingSeconds --;
                  if ( thisCharacter.updateActiveTaskRemainingSeconds <= 0) {
                    clearInterval(thisCharacter.updateActiveTaskInterval);
                    thisCharacter.stopGathering();
                  }
                }
              }, 1000);

              thisFactory.gatherables[taskName].json.gatherers ++;

      
          }
          break;



          case 'harvesting':
          {
             //Set modify stat timer intervals
                this.statUpdateInterval = {};
                for (var harvestingStatKeyname in thisFactory.taskRules.harvesting.stat) {
                  //console.log('start statUpdateInterval:' + harvestingStatKeyname + '' + thisFactory.taskRules.harvesting.stat[harvestingStatKeyname].secondsPerDecrement);

                  (function (thisStatsKeyname) {
                      thisCharacter.modifyStat( thisStatsKeyname, 'current', -1);

                      thisCharacter.statUpdateInterval[thisStatsKeyname] = setInterval( (function () {

                          if ( this.hasStatsFor('harvesting') === true) {
                            this.modifyStat( thisStatsKeyname, 'current', -1);
                          }
                            
                      }).bind(thisCharacter), thisFactory.taskRules.harvesting.stat[thisStatsKeyname].secondsPerDecrement * 1000);

                  }(harvestingStatKeyname));
                }

                this.updateActiveTaskTotalSeconds = thisFactory.harvestables[taskName].duration( thisCharacter) / thisFactory.taskTimeScalar;
                this.updateActiveTaskRemainingSeconds = this.updateActiveTaskTotalSeconds;
                this.updateActiveTaskInterval =  setInterval( function() {
                      if ( thisCharacter.hasStatsFor('harvesting') === true) {

                          thisCharacter.updateActiveTaskRemainingSeconds --;
                          if ( thisCharacter.updateActiveTaskRemainingSeconds <= 0) {
                            clearInterval(thisCharacter.updateActiveTaskInterval);
                            thisCharacter.stopHarvesting();
                          }
                      }
                  }, 1000);
          }
          break;

          case 'crafting':
          {
                      //Set modify stat timer intervals
                      this.statUpdateInterval = {};
                      for (var craftingStatKeyname in thisFactory.taskRules.crafting.stat) {
   
                        (function (thisStatsKeyname) {
                            thisCharacter.modifyStat( thisStatsKeyname, 'current', -1);

                            thisCharacter.statUpdateInterval[thisStatsKeyname] = setInterval( (function () {

                                if ( this.hasStatsFor('crafting') === true) {
                                  this.modifyStat( thisStatsKeyname, 'current', -1);
                                }

                            }).bind(thisCharacter), thisFactory.taskRules.crafting.stat[thisStatsKeyname].secondsPerDecrement * 1000);

                        }(craftingStatKeyname));
                      }

                      // task time remaining timer
                      this.updateActiveTaskTotalSeconds = thisFactory.knownRecipes[taskName].duration(thisCharacter) / thisFactory.taskTimeScalar;
                      this.updateActiveTaskRemainingSeconds = this.updateActiveTaskTotalSeconds;
                      this.updateActiveTaskInterval =  setInterval( function() {
                        if ( thisCharacter.hasStatsFor('crafting') === true) {

                          thisCharacter.updateActiveTaskRemainingSeconds --;
                          if ( thisCharacter.updateActiveTaskRemainingSeconds <= 0) {
                            clearInterval(thisCharacter.updateActiveTaskInterval);
                            thisCharacter.stopCrafting();
                          }
                        }
                      }, 1000); 

                      // subtract resources from bank. (refactor in to sim factory class)
                      var recipeInputObj = thisFactory.craftableDefines[taskName].input;
                      var recipeInputKeys = Object.keys( recipeInputObj );

                      recipeInputKeys.forEach( function ( recipeKey ){

                        var recipeInput = recipeKey;
                        var recipeInputQuantity = recipeInputObj[ recipeKey];

                        thisFactory.bank[ recipeInput ].decrement( recipeInputQuantity);

                        if ( thisFactory.bank[recipeInput].json.quantity.length === 0) {
                              delete  thisFactory.bank[recipeInput];
                              thisFactory.updateBank();
                            }
              
                      });
          }
          break;
        } // switch

      }  // can start task
      else 
      {
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
    FSCharacter.prototype.hasRequiredCraftingProficiency = function (recipeKey, log) {
  
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

         // console.log( parseInt(this.json.stats[statKeyname].current, 10) + '<' + parseInt( thisFactory.taskRules[taskCategory].stat[statKeyname].minRequired, 10));

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


      var tools = [];
      
      // build combined 'tool actions' array
      tools.push('Hands');
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
