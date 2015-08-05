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
        * Handles transaction requests made to the bank.
        */
        var onTransactionHandler = function( arg) {

          if ( arg.category === 'bankable') {
            if (arg.quantity > 0) { // ensure there is an instance in bank before it can be incremented.
              if (!(arg.type in FSSimState.bank)) { 
                  FSSimMessagingChannel.createSimObject(  { category: 'bankable', desc : {name:arg.type, quantity : 0} });
                  FSSimState.updateBank();
              }
              FSSimState.bank[arg.type].modifyQuantity(arg.quantity);
              
            } else if (arg.quantity < 0) {
 
                FSSimState.bank[arg.type].modifyQuantity( arg.quantity );
                if ( FSSimState.bank[arg.type].json.quantity === 0) {
                  delete  FSSimState.bank[arg.type];
                  FSSimState.updateBank();
                }
            }
          }
        };

        // Register 'onTransactionHandler' after function declaration
        FSSimMessagingChannel.onTransaction($rootScope, onTransactionHandler);

        /**
        * @desc 
        * 
        */
        this.deleteItem = function( bankItem) {

          console.log('deleteItem:' + bankItem.json.name);

          bankItem.modifyQuantity( - bankItem.json.quantity );
          if ( FSSimState.bank[bankItem.json.name].json.quantity === 0) {
            delete  FSSimState.bank[bankItem.json.name];
            FSSimState.updateBank();
          }

        };
  
  }]);
