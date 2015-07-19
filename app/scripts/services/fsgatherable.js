'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSGatherable
 * @description
 * # FSGatherable
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSGatherable', function () {
    // Service logic
    // ...

    // Gatherables
    var FSGatherable = function( json, simulation) { 
      this.simulation = simulation;
      this.json = json;
      this.quantitybgcolor = 'rgba(200, 200, 200, 0.0)';
    };

   /**
     * @desc 
     * @return 
     */
    FSGatherable.prototype.increment = function( ) {
      this.json.quantity++;
      this.quantitybgcolor = 'rgba(20, 200, 20, 0.25)';
      this.setFlashQuantityTimeout();
    };
    
    /**
     * @desc 
     * @return 
     */
    FSGatherable.prototype.decrement = function( ) {
      this.json.quantity--;
      if ( this.json.quantity !== 0) {
        this.quantitybgcolor = 'rgba(200, 20, 20, 0.25)';
        this.setFlashQuantityTimeout();
      }      
    };

     /**
     * @desc 
     * @return 
     */
    FSGatherable.prototype.setFlashQuantityTimeout = function( ) {
      setTimeout( (function() {
        if(typeof this !== "undefined") {
          this.quantitybgcolor = 'rgba(0, 0, 0, .0)';
        }
      }).bind(this), 500);
    };


    /**
    * @desc 
    * @return 
    */
    FSGatherable.prototype.bgcolor =  function( ) {         
      var color = 'rgba(20, 200, 20, 0.25)';     

      if( this.simulation.selectedCharacter.hasGatheringDependencies(this.json.name) === false) {
        color = 'rgba(200, 20, 20, 0.25)'; 
      }

      if ( this.simulation.selectedCharacter.hasStatsFor('gathering') === false) {
        color = 'rgba(200, 20, 20, 0.25)'; 
      }

      if ( this.simulation.selectedCharacter.hasSpareActivitySlot() === false) {
        color = 'rgba(200, 20, 20, 0.25)';
      }

      return color;   
    };

    /**
    * @desc 
    * @return 
    */
    FSGatherable.prototype.duration =  function(  character) {
      character = character;
      var duration = this.simulation.gatherableDefines[this.json.name].duration;
      return duration;
    };

   /**
     * @desc 
     * @return 
     */
    FSGatherable.prototype.hasUnlocks =  function(  ) {
      if ( this.simulation.hasUnlocks( {'action':'gather', 'target':this.json.name})) {
        return 'images/unlock.69ea04fd.png';
      }
      return 'images/clear.d9e2c8a6.png';
    };
  

    return FSGatherable;

  });
