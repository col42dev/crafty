'use strict';

/**
 * @ngdoc service
 * @name craftyApp.fsCharacter
 * @description
 * # fsCharacter
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSCharacter', function (FSTask, FSObject) {
    // Service logic
    // ...
    var thisFactory = null;


    /**
     * @desc 
     * @return 
     */
    var FSCharacter = function(characaterObj, simFactory, ctrllerScope) {
        thisFactory = simFactory;
        this.firstName = characaterObj.firstName;
        this.lastName = characaterObj.lastName;
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
      return this.firstName + ' ' + this.lastName;
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
      var craftableKey = this.activity[0].name;

      // generate output in bank.
      var craftableOutputObj = thisFactory.gameItems[craftableKey].output;
      var craftableOutputKey = Object.keys( craftableOutputObj );

      // assumes only one type is craftableOutput.
      var craftableOutput = craftableOutputKey[0];
      var craftableOutputQuantity = craftableOutputObj[ craftableOutput ];
      
      // add output to bank.
      if (!(craftableOutput in thisFactory.bank)) {
        thisFactory.bank[craftableOutput] = new FSObject( {'category':thisFactory.gameItems[craftableKey].category, 'name':craftableOutput});
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

      switch ( this.activity[0].category) {
        case 'gathering':
          {
            var hasGatherables = (taskName in thisFactory.gatherables && thisFactory.gatherables[taskName].quantity > 0) ? true : false;
            var hasDependencies = this.hasGatheringDependencies(taskName);
            if (hasGatherables === true && hasDependencies === true) {
              var duration = (thisFactory.gatherableDefines[taskName].gatherBaseTimeS * 1000) / thisFactory.taskTimeScalar;
              setTimeout(this.stopGathering.bind(this), duration);

              var thisCharacter = this;
              this.updateActiveTaskRemainingPercent = 100;
              this.updateActiveTaskInterval =  setInterval( function() {
                    thisCharacter.updateActiveTaskRemainingPercent --;
                    if ( thisCharacter.updateActiveTaskRemainingPercent <= 0) {
                       clearInterval(thisCharacter.updateActiveTaskInterval);
                       console.log("clearInterval" );
                    }
                }, duration / 100);
              
              thisFactory.gatherables[taskName].gatherers ++;
              //console.log('setTimeout:' + thisFactory.gatherableDefines[taskName].gatherBaseTimeS * 1000);
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
            var duration = (thisFactory.gameItems[taskName].craftBaseTimeS * 1000) / thisFactory.taskTimeScalar;
            setTimeout(this.stopCrafting.bind(this),  duration);
            console.log('setTimeout:' + thisFactory.gameItems[taskName].craftBaseTimeS * 1000);
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

      console.log(this.updateActiveTaskRemainingPercent );
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
