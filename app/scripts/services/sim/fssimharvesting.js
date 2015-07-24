'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimHarvesting
 * @description
 * # FSSimHarvesting
 * Operate on fsharvestables's.
 */
angular.module('craftyApp')
  .service('FSSimHarvesting', ['$rootScope', 'FSSimMessagingChannel', 'FSSimState', function ($rootScope, FSSimMessagingChannel, FSSimState) {
 
    // AngularJS will instantiate a singleton by calling "new" on this function


        /**
        * @desc 
        * @return 
        */
        var onTransactionHandler = function( arg) {

          if ( arg.category === 'harvestable') {
            if (arg.quantity > 0) {    
              if (!(arg.type in FSSimState.harvestables)) {  // ensure there is an instance in harvestables before it can be incremented.
                  var obj = {'name': arg.type, 'quantity': '0'};
                  FSSimMessagingChannel.createSimObject( { category: 'harvestable', desc : obj});
              }
              FSSimState.harvestables[arg.type].increment(arg.quantity);
            } else if (arg.quantity < 0) {
              FSSimState.harvestables[arg.type].decrement( arg.quantity);
              if ( FSSimState.harvestables[arg.type].json.quantity === 0) {
                delete FSSimState.harvestables[arg.type];
              }
            }
            FSSimState.updateHarvestables();
          }
        };

        // Register 'onTransactionHandler' after function declaration
        FSSimMessagingChannel.onTransaction($rootScope, onTransactionHandler);


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
        
  }]);
