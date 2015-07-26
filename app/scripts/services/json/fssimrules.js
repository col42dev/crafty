'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimRules
 * @description
 * # FSSimRules
 * Immutable rule data mapped from JSON defines.
 * Data only - do not add implementations.
 */
angular.module('craftyApp')
  .service('FSSimRules', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var simRules = this;

    this.set = function(json) {

        // Rule Defines
        this.harvestableDefines = json.harvestableDefines;  
        this.gatherableDefines = json.gatherableDefines; 
        this.craftableDefines = json.craftableDefines; 
        this.toolDefines = json.toolDefines;  
        this.consumableDefines = json.consumableDefines;  
        this.constructorDefines = json.constructorDefines;  
        this.taskRules = json.taskRules;  
        this.rewardRules = json.rewardRules;  



        // remap harvestableDefines as keys array - for use by html templates visuals only.
        this.harvestableDefinesKeys = Object.keys(simRules.harvestableDefines).map(function (key) {
                return key;
              });

    };


  });
