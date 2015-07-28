'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimGathering
 * @description
 * # FSSimGathering
 * Operate on fsgatherables's.
 */
angular.module('craftyApp')
  .service('FSSimGathering', ['$rootScope', 'FSSimMessagingChannel', 'FSSimState', 'FSGatherable', function ($rootScope, FSSimMessagingChannel, FSSimState, FSGatherable) {
    // AngularJS will instantiate a singleton by calling "new" on this function


        /**
        * @desc 
        * Handles transaction requests made to gatherables.
        */
        var onTransactionHandler = function( arg) {

          if ( arg.category === 'gatherable') {
            if (arg.quantity > 0) { // ensure there is an instance in gatherables before it can be incremented.
   
              
              if (arg.cell !== null) {

                  if (arg.cell.gatherables === null) {
                    arg.cell.gatherables = new FSGatherable({'name': arg.type, 'quantity': '0'});
                  }
  
                  arg.cell.gatherables.modifyQuantity( parseInt(arg.quantity, 10));

              } else {
                if (!(arg.type in FSSimState.gatherables)) { 
                    FSSimMessagingChannel.createSimObject( { category: 'gatherable', desc : {'name': arg.type, 'quantity': '0'}});
                    FSSimState.updateGatherables();
                }
                FSSimState.gatherables[arg.type].modifyQuantity(arg.quantity);
              }

            } else if (arg.quantity < 0) {

              if (arg.cell !== null) {
                arg.cell.gatherables.modifyQuantity( parseInt(arg.quantity, 10));
                if (parseInt(arg.cell.gatherables.json.quantity, 10) === 0) {
                  delete arg.cell.gatherables;
                  arg.cell.gatherables = null;
                }
              } else {
                FSSimState.gatherables[arg.type].modifyQuantity( parseInt(arg.quantity, 10));
                if ( FSSimState.gatherables[arg.type].json.quantity === 0) {
                    delete FSSimState.gatherables[arg.type];
                    FSSimState.updateGatherables();
                }
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
        this.isGatherable = function (thisTask) {

            for ( var characterKey in FSSimState.characters ) {
               if ( FSSimState.characters[characterKey].canPerformTask(thisTask)) {
                    return true;
                }
            }
            return false;
        };
        
  }]);
