'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSHarvestable
 * @description
 * # FSHarvestable
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSHarvestable', function () {
    // Service logic
    // ...

    var FSHarvestable = function( obj, simulation) { 

      this.simulation = simulation;
      this.name = obj.name;
      this.quantity = obj.quantity;
    };

    FSHarvestable.prototype.bgcolor =  function( ) {         
      return null;   
    };

    return FSHarvestable;

  });
