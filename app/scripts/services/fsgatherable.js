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
    var FSGatherable = function( obj) { 

      //this.simulaton = simulaton;
      this.name = obj.name;
      this.quantity = obj.quantity;
      this.hardness = 1; //todo: remove  
      this.gatherers = obj.gatherers;
    };

    FSGatherable.prototype.bgcolor =  function( ) {         
      return  (this.gatherers > 0) ? '#FF0000' : null;        
    };

    /*
    FSGatherable.prototype.gatherTime =  function( ) {         
      return  this.simulaton.gatherableDefines[this.name].gatherBaseTimeS
    };
    */

    return FSGatherable;

  });
