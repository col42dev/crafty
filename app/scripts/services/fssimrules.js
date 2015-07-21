'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimRules
 * @description
 * # FSSimRules
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSSimRules', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function


    this.set = function(json) {

        // Defines
        this.harvestableDefines = json.harvestableDefines;  
        this.gatherableDefines = json.gatherableDefines; 
        this.craftableDefines = json.craftableDefines; 
        this.toolDefines = json.toolDefines;  
        this.foodDefines = json.foodDefines;  
        this.taskRules = json.taskRules;  
        this.rewardRules = json.rewardRules;  
    };


  });
