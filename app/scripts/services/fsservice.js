'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSService
 * @description
 * # FSService
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSService', function ( FSFactory ) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.createSimulation = function( ctrllerScope, json) {
     	console.log('SimulationService - create simulation');
        this.simulation = new FSFactory( ctrllerScope, json);
    };

  });
