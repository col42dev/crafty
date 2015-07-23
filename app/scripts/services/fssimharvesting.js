'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimHarvesting
 * @description
 * # FSSimHarvesting
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSSimHarvesting', function (FSSimState) {
    // AngularJS will instantiate a singleton by calling "new" on this function


            /**
         * @desc 
         * @return 
         */
        this.isHarvestable = function (harvestableType) {
            for ( var characterKey in FSSimState.characterObjs ) {
                if ( FSSimState.characterObjs[characterKey].canPerformTask(harvestableType, 'harvesting', false)) {
                    return true;
                }
            }
            return false;
        };
        
  });
