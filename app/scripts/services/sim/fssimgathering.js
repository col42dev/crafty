'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimGathering
 * @description
 * # FSSimGathering
 * Operate on fsgatherables's.
 */
angular.module('craftyApp')
  .service('FSSimGathering', ['$rootScope', 'FSSimMessagingChannel', 'FSSimState', function ($rootScope, FSSimMessagingChannel, FSSimState) {
    // AngularJS will instantiate a singleton by calling "new" on this function


        /**
        * @desc 
        * Handles transaction requests made to gatherables.
        */
        var onTransactionHandler = function( arg) {

          if ( arg.category === 'gatherable') {
            if (arg.quantity > 0) { // ensure there is an instance in gatherables before it can be incremented.
              if (!(arg.type in FSSimState.gatherables)) { 
                  var obj = {'name': arg.type, 'quantity': '0'};
                  FSSimMessagingChannel.createSimObject( { category: 'gatherable', desc : obj});
                  FSSimState.updateGatherables();
              }
              FSSimState.gatherables[arg.type].modifyQuantity(arg.quantity);
            } else if (arg.quantity < 0) {
              FSSimState.gatherables[arg.type].modifyQuantity( arg.quantity);
              if ( FSSimState.gatherables[arg.type].json.quantity === 0) {
                  delete FSSimState.gatherables[arg.type];
                  FSSimState.updateGatherables();
              }
            }
          }
        };

        // Register 'onTransactionHandler' after function declaration
        FSSimMessagingChannel.onTransaction($rootScope, onTransactionHandler);
   


        /**
         * @desc 
         * @return 
         */
        this.isGatherable = function (gatherableType) {
            for ( var characterKey in FSSimState.characters ) {
                if ( FSSimState.characters[characterKey].canPerformTask(gatherableType, 'gathering')) {
                    return true;
                }
            }
            return false;
        };
        
  }]);
