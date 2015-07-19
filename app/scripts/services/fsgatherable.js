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
    };

    /**
    * @desc 
    * @return 
    */
    FSGatherable.prototype.bgcolor =  function( ) {         
      var color =  'rgba(20, 200, 20, 0.25)';     

      if( this.simulation.selectedCharacter.hasGatheringDependencies(this.json.name) === false) {
        color  = 'rgba(200, 20, 20, 0.25)'; 
      }

      if ( this.simulation.selectedCharacter.hasStatsFor('gathering') === false) {
          color  = 'rgba(200, 20, 20, 0.25)'; 
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
