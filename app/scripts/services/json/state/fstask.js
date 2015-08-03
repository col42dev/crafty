'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSTask
 * @description
 * # FSTask
 *runtime mapping of JSON state 'task' element.
 */

angular.module('craftyApp')
  .factory('FSTask', function (FSSimMessagingChannel, FSSimRules) {
    // Service logic
    // ...


    // FStask
    var FSTask = function(taskObj) {
      this.name = taskObj.name;
      this.category = taskObj.category;


      this.cellIndex = null;
      if ( taskObj.hasOwnProperty('cellIndex')) {
        this.cellIndex = taskObj.cellIndex;
      }

      this.updateActiveTaskRemainingSeconds = 1;
      this.updateActiveTaskTotalSeconds = 1;
      this.characters = [];

      switch (this.category) {
        case 'crafting' :
          this.workers = FSSimRules.craftableDefines[this.name].workers;
          break;
        case 'harvesting' :
          this.workers = FSSimRules.harvestableDefines[this.name].recipe.workers;
          break;
      }
    };

    FSTask.prototype.desc = function() {
      return this.name  + ' ' + this.category;
    };


        /**
     * @desc 
     * @return 
     */
    FSTask.prototype.createTimer = function ( duration, onInterval ) {
      
      this.updateActiveTaskTotalSeconds = duration;    
      this.updateActiveTaskRemainingSeconds = duration;

      this.updateActiveTaskInterval =  setInterval( onInterval, 1000);
    };

       /**
     * @desc 
     * @return : true until timed out.
     */
    FSTask.prototype.decrementTimer = function ( ) {
 
      this.updateActiveTaskRemainingSeconds --;
      if ( this.updateActiveTaskRemainingSeconds <= 0) {
        clearInterval(this.updateActiveTaskInterval);
        return false;
      }

      return true;
    };

    /**
     * @desc 
     * @return 
     */
    FSTask.prototype.percentRemaining = function ( ) {
      var percent  = Math.floor( this.updateActiveTaskRemainingSeconds / this.updateActiveTaskTotalSeconds  * 100);

      return percent+'%';
    };



   /**
     * @desc 
     * @return 
     */
    FSTask.prototype.harvestingOnStart = function () {

  
    };

     /**
     * @desc 
     * @return 
     */
    FSTask.prototype.harvestingOnStop = function () {
   
      var thisType = this.name;

      FSSimMessagingChannel.transaction( { category: 'harvestable', type: thisType,  action : 'remove',  cellIndex : this.cellIndex});


   
      FSSimMessagingChannel.transaction( { category: 'bankable', type: thisType, typeCategory: 'gatherable', quantity : 1});

      // Rewards
      FSSimMessagingChannel.makeRewards( {'action':'gather', 'target':thisType});

    };



    /**
     * @desc 
     * @return 
     */
    FSTask.prototype.craftingOnStart = function () {

      var craftableType = this.name;
      var recipeInputObj = FSSimRules.craftableDefines[ craftableType ].input;
      var recipeInputKeys = Object.keys( recipeInputObj );

      recipeInputKeys.forEach( ( function ( recipeKey ){
        var recipeInput = recipeKey;
        var recipeInputQuantity = recipeInputObj[ recipeKey];
        FSSimMessagingChannel.transaction( { category: 'bankable', type: recipeInput, quantity : -recipeInputQuantity});
      }).bind(this));

    };

    /**
     * @desc 
     * @return 
     */
    FSTask.prototype.craftingOnStop = function () {

      var craftableKey = this.name;

      // generate output in bank.
      var craftableOutputObj = FSSimRules.craftableDefines[craftableKey].output;

      // assumes only one type is craftableOutput.
      for (var craftableOutput in craftableOutputObj) {

        var craftableOutputQuantity = craftableOutputObj[ craftableOutput ];
        
        // add output to bank.
        FSSimMessagingChannel.transaction( { category: 'bankable', type: craftableOutput, typeCategory:FSSimRules.craftableDefines[craftableKey].category, quantity : craftableOutputQuantity});
  
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


    //Return the constructor function.
    return FSTask;

  });

