'use strict';

/**
 * @ngdoc service
 * @name craftyApp.fsCharacter
 * @description
 * # fsCharacter
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSCharacter', function (FSTask, FSObject, FSGatherable) {
    // Service logic
    // ...
    var thisFactory = null;


    /**
     * @desc 
     * @return 
     */
    var FSCharacter = function(json, simFactory, ctrllerScope) {
        thisFactory = simFactory;
        this.json = json;
        this.activity = [];
        this.tools = [];
        this.weapons = [];
        this.activityCompletedCallback = [];
        this.ctrllerScope = ctrllerScope;
        this.updateActiveTaskRemainingPercent = 100;

        setInterval( (function () {
            this.modifyStat( 'health', 'current', 1);
        }).bind(this), this.json.stats.health.regeneratePeriod * 1000);


        setInterval( (function () {
            this.modifyStat( 'energy', 'current', 1);
        }).bind(this), this.json.stats.energy.regeneratePeriod * 1000);


        setInterval( (function () {
            this.modifyStat( 'mind', 'current', 1);
        }).bind(this), this.json.stats.mind.regeneratePeriod * 1000);

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
    FSCharacter.prototype.startHarvesting = function ( harvestablesName) {
      if ( this.activity.length < 4 ) {
        if (thisFactory.harvestables[harvestablesName].quantity > 0) {
          if ( this.hasStatsFor('harvesting') === true) {
            if ( thisFactory.harvestables[harvestablesName].isHarvestableBy( thisFactory.selectedCharacter) === true) {
              this.activity.push( new FSTask( {'name':harvestablesName, 'category':'harvesting'}));
              if (this.activity.length === 1) {
                this.startNextTask();
              }
            }
          }
        }
      }
    };

     /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.stopHarvesting = function () {

      clearInterval(this.updateActiveTaskInterval);

      var harvestableType = this.activity[0].name;

      thisFactory.harvestables[harvestableType].quantity -= 1;


      if ( thisFactory.harvestables[harvestableType].quantity === 0) {
        delete thisFactory.harvestables[harvestableType];
        thisFactory.updateHarvestables();
      }

      if (!(harvestableType in thisFactory.gatherables)) { //todo: debug this condition!
          var obj = {'name': harvestableType, 'quantity': '0'};
          obj.gatherers = 0;

        thisFactory.gatherables[harvestableType] = new FSGatherable(obj, thisFactory);
      }
      
      thisFactory.gatherables[harvestableType].quantity ++;
      thisFactory.updateGatherables();

      this.activity.splice(0, 1);

      // start next activity
      if (this.activity.length > 0) {
        this.startNextTask();
      }

      this.ctrllerScope.$apply();
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.startGathering = function ( gatherablesName) {

      if ( this.activity.length < 4 ) {
        if (thisFactory.gatherables.hasOwnProperty(gatherablesName) && thisFactory.gatherables[gatherablesName].quantity > 0) {
          if ( this.hasStatsFor('gathering') === true) {
            this.activity.push( new FSTask( {'name':gatherablesName, 'category':'gathering'}));
            if (this.activity.length === 1) {
              this.startNextTask();
            }
          }
        }
      }
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.stopGathering = function () {

      clearInterval(this.updateActiveTaskInterval);

      var gatherableType = this.activity[0].name;

      thisFactory.gatherables[gatherableType].quantity -= 1;
      thisFactory.gatherables[gatherableType].gatherers --;

      if ( thisFactory.gatherables[gatherableType].quantity === 0) {
        delete thisFactory.gatherables[gatherableType];
        thisFactory.updateGatherables();
      }

      if (!(gatherableType in thisFactory.bank)) {
        thisFactory.bank[gatherableType] = new FSObject({'category':'gatherable', 'name':gatherableType});
      }
      thisFactory.bank[gatherableType].increment(1);
      thisFactory.updateBank();

      this.activity.splice(0, 1);

      // start next activity
      if (this.activity.length > 0) {
        this.startNextTask();
      }

      this.ctrllerScope.$apply();
    };


    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.startCrafting = function ( craftableKey) {
      if ( this.hasStatsFor('crafting') === true) {
        this.activity.push( new FSTask({'name':craftableKey, 'category':'crafting'}));
        if (this.activity.length === 1) {
          this.startNextTask();
        }
      }
    };


    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.stopCrafting = function () {

      clearInterval(this.updateActiveTaskInterval);

      var craftableKey = this.activity[0].name;

      // generate output in bank.
      var craftableOutputObj = thisFactory.recipeDef[craftableKey].output;
      var craftableOutputKey = Object.keys( craftableOutputObj );

      // assumes only one type is craftableOutput.
      var craftableOutput = craftableOutputKey[0];
      var craftableOutputQuantity = craftableOutputObj[ craftableOutput ];
      
      // add output to bank.
      if (!(craftableOutput in thisFactory.bank)) {
        thisFactory.bank[craftableOutput] = new FSObject( {'category':thisFactory.recipeDef[craftableKey].category, 'name':craftableOutput});
      }
      thisFactory.bank[craftableOutput].increment( craftableOutputQuantity);
      thisFactory.updateBank();

      //Rewards
      thisFactory.checkRewards( {'action':'craft', 'target':craftableOutput});

      this.activity.splice(0, 1);

      // start next activity
      if (this.activity.length > 0) {
        this.startNextTask();
      }

      this.ctrllerScope.$apply();
    };


    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.startNextTask = function () {     
      var taskName = this.activity[0].name;

      var thisCharacter = this;
 

      switch ( this.activity[0].category) {
        case 'gathering':
          {
            var hasGatherables = false;
            if (taskName in thisFactory.gatherables) {
              if (thisFactory.gatherables[taskName].quantity > 0) {
                if ( thisFactory.gatherables[taskName].quantity > thisFactory.gatherables[taskName].gatherers) { // too many cooks?
                  hasGatherables = true;
                }
              }
            }

            var hasDependencies = this.hasGatheringDependencies(taskName);
            if (hasGatherables === true && hasDependencies === true) {

              this.modifyStat( 'energy', 'current', -10);

              var gatheringDuration = (thisFactory.gatherableDefines[taskName].gatherBaseTimeS * 1000) / thisFactory.taskTimeScalar;
              setTimeout(this.stopGathering.bind(this), gatheringDuration);

              this.updateActiveTaskRemainingPercent = 100;
              this.updateActiveTaskInterval =  setInterval( function() {
                    thisCharacter.updateActiveTaskRemainingPercent --;
                    if ( thisCharacter.updateActiveTaskRemainingPercent <= 0) {
                       clearInterval(thisCharacter.updateActiveTaskInterval);
                       console.log('clearInterval' );
                    }
                }, gatheringDuration / 100);            
              thisFactory.gatherables[taskName].gatherers ++;
            } else {
              this.activity.splice(0, 1);
              if (this.activity.length > 0) {
                this.startNextTask();
              }
            }
          }
          break;
        case 'harvesting':
          {
            var hasHarvestables = (taskName in thisFactory.harvestables && thisFactory.harvestables[taskName].quantity > 0) ? true : false;

            if (hasHarvestables === true) {

              this.modifyStat( 'energy', 'current', -10);

              var harvestingDuration = (thisFactory.harvestables[taskName].harvestableDuration( thisCharacter) * 1000) / thisFactory.taskTimeScalar;
              console.log('harvestingDuration' + harvestingDuration);
              setTimeout(this.stopHarvesting.bind(this), harvestingDuration);

              this.updateActiveTaskRemainingPercent = 100;
              this.updateActiveTaskInterval =  setInterval( function() {
                    thisCharacter.updateActiveTaskRemainingPercent --;
                    if ( thisCharacter.updateActiveTaskRemainingPercent <= 0) {
                       clearInterval(thisCharacter.updateActiveTaskInterval);
                       console.log('clearInterval' );
                    }
                }, harvestingDuration / 100);
              
            } else {
              this.activity.splice(0, 1);
              if (this.activity.length > 0) {
                this.startNextTask();
              }
            }
          }
          break;
        case 'crafting':
          {
            var craftingDuration = (thisFactory.recipeDef[taskName].craftBaseTimeS * 1000) / thisFactory.taskTimeScalar;
            setTimeout(this.stopCrafting.bind(this),  craftingDuration);

            this.updateActiveTaskRemainingPercent = 100;
            this.updateActiveTaskInterval =  setInterval( function() {
                  thisCharacter.updateActiveTaskRemainingPercent --;
                  if ( thisCharacter.updateActiveTaskRemainingPercent <= 0) {
                     clearInterval(thisCharacter.updateActiveTaskInterval);
                     console.log('clearInterval' );
                  }
              }, craftingDuration / 100);   
          }
          break;
      }
    };


    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasGatheringDependencies = function ( gatheringName) {
      var hasDependencies = false;

      thisFactory.gatherableDefines[gatheringName].actionable.forEach( ( function(thisActionable) {
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

      switch (taskCategory) {
        case 'gathering':
          if ( parseInt( this.json.stats.energy.current, 10) >= 20) {
            return true;
          }
          break;
        case 'harvesting':
          if ( parseInt( this.json.stats.energy.current, 10) >= 20) {
            return true;
          }
          break;
        case 'crafting':
          if ( parseInt( this.json.stats.energy.current, 10) >= 20) {
            return true;
          }
          break;
      }
      return false;
    };
  

    /**
     * @desc : is this character equipped with a tool which has the specified action.
     * @return 
     */
    FSCharacter.prototype.hasToolAction = function ( toolAction) {
      var bHasToolAction = false;

      var equippedToolName = (this.tools.length > 0) ? this.tools[0].name : 'Hands';

      thisFactory.toolDefines[equippedToolName].actions.forEach( ( function ( action) {
        if ( toolAction === action) {
          bHasToolAction = true;
        }
      }).bind(this)); 

      return bHasToolAction;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.queuedTaskCount = function ( ) {
      return Math.max(this.activity.length - 1, 0);
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.updateActiveTask = function () {
      this.updateActiveTaskRemainingPercent --;
      if ( this.updateActiveTaskRemainingPercent <= 0) {
         clearInterval(this.updateActiveTask);
      }
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.activityPercentRemaining = function ( ) {
      return this.updateActiveTaskRemainingPercent +'%';
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.getStatPercentage = function ( type) {
      var stats = this.json['stats'][type];
      return Math.floor(100 * parseInt(stats['current'], 10) /  parseInt(stats['max'], 10)) +'%';
    };


    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.modifyStat = function ( type, subtype, amount) {

      var newValue = parseInt(this.json['stats'][type][subtype], 10) + amount;
      if (subtype === 'current') {
        if ( parseInt(this.json['stats'][type]['current'], 10) + amount > parseInt(this.json['stats'][type]['max'], 10)) {
            newValue = parseInt( this.json['stats'][type]['max'], 10);
        }
        if ( parseInt(this.json['stats'][type]['current'], 10) + amount < 0) {
            newValue = 0;
        }
      }

      this.json['stats'][type][subtype] = newValue;
      return this.json['stats'][type][subtype];
    };

    /**
    * Return the constructor function.
    */
    return FSCharacter;
  
  });
