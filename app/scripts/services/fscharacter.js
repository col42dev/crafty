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
    var FSCharacter = function(characaterObj, simFactory, ctrllerScope) {
        thisFactory = simFactory;
        this.name = characaterObj.name;
        this.profession = characaterObj.profession;
        this.activity = [];
        this.tools = [];
        this.weapons = [];
        this.activityCompletedCallback = [];
        this.ctrllerScope = ctrllerScope;
        this.updateActiveTaskRemainingPercent = 100;
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
      return this.name;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.startHarvesting = function ( harvestablesName) {

      if ( this.activity.length < 4 ) {
        if (thisFactory.harvestables[harvestablesName].quantity > 0) {
          this.activity.push( new FSTask( {'name':harvestablesName, 'category':'harvesting'}));
          if (this.activity.length === 1) {
            this.startNextTask();
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
        if (thisFactory.gatherables[gatherablesName].quantity > 0) {
          this.activity.push( new FSTask( {'name':gatherablesName, 'category':'gathering'}));
          if (this.activity.length === 1) {
            this.startNextTask();
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
      this.activity.push( new FSTask({'name':craftableKey, 'category':'crafting'}));
      if (this.activity.length === 1) {
        this.startNextTask();
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
            var hasGatherables = (taskName in thisFactory.gatherables && thisFactory.gatherables[taskName].quantity > 0) ? true : false;
            var hasDependencies = this.hasGatheringDependencies(taskName);
            if (hasGatherables === true && hasDependencies === true) {
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
              var harvestingDuration = 10000 / thisFactory.taskTimeScalar;
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
      var hasDependencies = true;

      thisFactory.gatherableDefines[gatheringName].dependencies.forEach( ( function(thisDependency) {
        if ( this.hasTool(thisDependency) === false) {
          hasDependencies = false;
        }
      }).bind(this)); 

      return hasDependencies;
    };


    /**
     * @desc : is character equipped with this tool.
     * @return 
     */
    FSCharacter.prototype.hasTool = function ( toolName) {
      var bHasTool = false;

      this.tools.forEach( ( function(thisTool) {
        if ( thisTool.name === toolName) {
          bHasTool = true;
        }
      }).bind(this)); 

      return bHasTool;
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
    * Return the constructor function.
    */
    return FSCharacter;
  
  });
