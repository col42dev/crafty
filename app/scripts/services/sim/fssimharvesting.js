'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimHarvesting
 * @description
 * # FSSimHarvesting
 * Operate on fsharvestables's.
 */
angular.module('craftyApp')
  .service('FSSimHarvesting', function (FSSimState) {
    // AngularJS will instantiate a singleton by calling "new" on this function


        /**
         * @desc 
         * @return 
         */
        this.isHarvestable = function (harvestableType) {
            for ( var characterKey in FSSimState.characters ) {
                if ( FSSimState.characters[characterKey].canPerformTask(harvestableType, 'harvesting')) {
                    return true;
                }
            }
            return false;
        };
        
  });
