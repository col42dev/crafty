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
    var FSGatherable = function( obj, simulation) { 

      this.simulation = simulation;
      this.name = obj.name;
      this.quantity = obj.quantity;
      this.gatherers = obj.gatherers;
    };

    /**
     * @desc 
     * @return 
     */
    FSGatherable.prototype.bgcolor =  function( ) {         
      var color =  '#00FF00';     

      if( this.simulation.selectedCharacter.hasGatheringDependencies(this.name) === false) {
        color  = '#FF0000'; 
      }

      if ( this.simulation.selectedCharacter.hasStatsFor('gathering') === false) {
          color  = '#FF0000'; 
      }

      return color;   
    };

    return FSGatherable;

  });
