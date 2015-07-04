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

    FSGatherable.prototype.bgcolor =  function( ) {         
      if (this.gatherers > 0) {
        return  '#00FF00';     
      }

      if( this.simulation.selectedCharacter.hasGatheringDependencies(this.name) === false) {
        return  '#FF0000'; 
      }
      

      return null;   
    };

    return FSGatherable;

  });
