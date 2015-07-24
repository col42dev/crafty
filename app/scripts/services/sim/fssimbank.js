'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimBank
 * @description
 * # FSSimBank
 * Operate on fsbankable's.
 */
angular.module('craftyApp')
  .service('FSSimBank', ['$rootScope', 'FSSimMessagingChannel', 'FSSimState', function ($rootScope, FSSimMessagingChannel, FSSimState) {
    // AngularJS will instantiate a singleton by calling "new" on this function



        /**
        * @desc 
        * @return 
        */
        var onTransactionHandler = function( arg) {

          if ( arg.category === 'bankable') {
            if (arg.quantity > 0) { // ensure there is an instance in bank before it can be incremented.
              if (!(arg.type in FSSimState.bank)) { 
                  FSSimMessagingChannel.createSimObject(  { category: 'bankable', desc : {'category':arg.typeCategory, 'name':arg.type, quantity : 0} });
              }
              FSSimState.bank[arg.type].increment(arg.quantity);
            } else if (arg.quantity < 0) {
 
                FSSimState.bank[arg.type].decrement( arg.quantity * -1);
                if ( FSSimState.bank[arg.type].json.quantity.length === 0) {
                  delete  FSSimState.bank[arg.type];
                }
            }
            
            FSSimState.updateBank();
          }
        };

        // Register 'onTransactionHandler' after function declaration
        FSSimMessagingChannel.onTransaction($rootScope, onTransactionHandler);


  
  }]);
