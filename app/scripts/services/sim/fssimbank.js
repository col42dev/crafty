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
        var onBankDepositHandler = function( arg) {
            if (!(arg.type in FSSimState.bank)) {
                FSSimMessagingChannel.createSimObject( { category: 'bankable', desc : {'category':arg.category, 'name':arg.type, quantity : 0} });  
            }
            FSSimState.bank[arg.type].increment(1);
            FSSimState.updateBank();
        };

        // Register 'onBankDepositHandler' after function declaration
        FSSimMessagingChannel.onBankDeposit($rootScope, onBankDepositHandler);
   

        /**
        * @desc 
        * @return 
        */
        var onBankWithdrawalHandler = function( arg) {
            FSSimState.bank[arg.type].decrement( arg.quantity);
            if ( FSSimState.bank[arg.type].json.quantity.length === 0) {
              delete  FSSimState.bank[arg.type];
              FSSimState.updateBank();
            }
        };

        // Register 'onBankWithdrawalHandler' after function declaration
        FSSimMessagingChannel.onBankWithdrawal($rootScope, onBankWithdrawalHandler);
  
  }]);
