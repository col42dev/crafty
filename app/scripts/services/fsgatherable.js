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

      this.name = obj.name;
      this.quantity = obj.quantity;
      this.gatherBaseTimeS = obj.gatherBaseTimeS;
      this.hardness = 1; //todo: datadrive  
      this.gatherers = obj.gatherers;
    };
    FSGatherable.prototype.bgcolor =  function( ) {         
      return  (this.gatherers > 0) ? '#FF0000' : null;        
    };

    return FSGatherable;

  });
