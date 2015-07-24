'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimGathering
 * @description
 * # FSSimGathering
 * Operate on fsgatherables's.
 */
angular.module('craftyApp')
  .service('FSSimGathering', function (FSSimState) {
    // AngularJS will instantiate a singleton by calling "new" on this function

        /**
         * @desc 
         * @return 
         */
        this.isGatherable = function (gatherableType) {
            for ( var characterKey in FSSimState.characterObjs ) {
                if ( FSSimState.characterObjs[characterKey].canPerformTask(gatherableType, 'gathering')) {
                    return true;
                }
            }
            return false;
        };
        
  });
