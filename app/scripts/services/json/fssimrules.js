'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimRules
 * @description
 * # FSSimRules
 * Immutable rule data mapped from JSON defines.
 * For data only - do not add any implementation.
 */
angular.module('craftyApp')
  .service('FSSimRules', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.set = function(json) {

        // Rule Defines
        this.harvestableDefines = json.harvestableDefines;  
        this.gatherableDefines = json.gatherableDefines; 
        this.craftableDefines = json.craftableDefines; 
        this.toolDefines = json.toolDefines;  
        this.foodDefines = json.foodDefines;  
        this.taskRules = json.taskRules;  
        this.rewardRules = json.rewardRules;  
    };


  });
