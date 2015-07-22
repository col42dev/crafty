'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimBank
 * @description
 * # FSSimBank
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSSimBank', ['$rootScope', 'FSSimObjectChannel', 'FSSimState', 'FSSimRules', 'FSBackpack', function ($rootScope, FSSimObjectChannel, FSSimState, FSSimRules, FSBackpack) {
    // AngularJS will instantiate a singleton by calling "new" on this function

        console.log('FSSimBank');

    
        var onBankDepositHandler = function( arg) {

            console.log('onBankDepositHandler');

            if (!(arg.type in FSSimState.bank)) {
                FSSimObjectChannel.createSimObject( { category: 'bankable', desc : {'category':arg.category, 'name':arg.type, quantity : 0} });  
            }
            FSSimState.bank[arg.type].increment(1);
            FSSimState.updateBank();
        };

        var onBankWithdrawalHandler = function( arg) {

            console.log('onBankWithdrawalHandler');

            FSSimState.bank[arg.type].decrement( arg.quantity);
            if ( FSSimState.bank[arg.type].json.quantity.length === 0) {
              delete  FSSimState.bank[arg.type];
              FSSimState.updateBank();
            }
        };

        FSSimObjectChannel.onBankDeposit($rootScope, onBankDepositHandler);
        FSSimObjectChannel.onBankWithdrawal($rootScope, onBankWithdrawalHandler);
  }]);
