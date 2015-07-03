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


    var FSCharacter = function(characaterObj, simFactory, ctrllerScope) {
        thisFactory = simFactory;
        this.firstName = characaterObj.firstName;
        this.lastName = characaterObj.lastName;
        this.profession = characaterObj.profession;
        this.activity = [];
        this.tools = [];
        this.activityCompletedCallback = [];
        this.ctrllerScope = ctrllerScope;
      };

  FSCharacter.prototype.getbgcolor =  function( ) {     
      return  ((thisFactory.selectedCharacter  !== null) && (this.getFullName() === thisFactory.selectedCharacter.getFullName())) ? '#00FF00' : null;       
    };
    FSCharacter.prototype.getFullName = function () {
      return this.firstName + ' ' + this.lastName;
    };
    FSCharacter.prototype.startGathering = function ( gatherablesName) {
      this.activity.push( new FSTask( {'name':gatherablesName, 'category':'gathering'}));
      if (this.activity.length === 1) {
        this.startNextActivity();
        //setTimeout(this.stopGathering.bind(this), thisFactory.gatherables[gatherablesName].gatherBaseTimeS * 1000);
      }
    };

    FSCharacter.prototype.stopGathering = function () {
      var gatherableType = this.activity[0].name;

      thisFactory.gatherables[gatherableType].quantity -= 1;
      thisFactory.gatherables[gatherableType].gatherers --;

      if (!(gatherableType in thisFactory.bank)) {
        thisFactory.bank[gatherableType] = new FSObject({'category':'gatherable', 'name':gatherableType});
      }
      thisFactory.bank[gatherableType].increment(1);
      thisFactory.updateBank();

      this.activity.splice(0, 1);

      // start next activity
      if (this.activity.length > 0) {
        this.startNextActivity();
      }

      this.ctrllerScope.$apply();
    };




    FSCharacter.prototype.startCrafting = function ( craftableKey) {
      this.activity.push( new FSTask({'name':craftableKey, 'category':'crafting'}));
      if (this.activity.length === 1) {
        this.startNextActivity();
        //setTimeout(this.stopCrafting.bind(this), thisFactory.gameItems[craftableKey].craftBaseTimeS * 1000);
      }
    };

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

      this.activity.splice(0, 1);

      // start next activity
      if (this.activity.length > 0) {
        this.startNextActivity();
      }

      this.ctrllerScope.$apply();
    };

    FSCharacter.prototype.startNextActivity = function () {     
      var taskName = this.activity[0].name;

      console.log('startNextActivity:' + taskName);

      switch ( this.activity[0].category){
        case 'gathering':
          setTimeout(this.stopGathering.bind(this), thisFactory.gatherables[taskName].gatherBaseTimeS * 1000);
          console.log('setTimeout:' + thisFactory.gatherables[taskName].gatherBaseTimeS * 1000);
          break;
        case 'crafting':
          setTimeout(this.stopCrafting.bind(this),  thisFactory.gameItems[taskName].craftBaseTimeS * 1000);
          console.log('setTimeout:' + thisFactory.gameItems[taskName].craftBaseTimeS * 1000);
          break;
      }

    };

    /**
    * Return the constructor function.
    */
    return FSCharacter;
  
  });
