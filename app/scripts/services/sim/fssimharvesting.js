'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimHarvesting
 * @description
 * # FSSimHarvesting
 * Operate on fsharvestables's.
 */
angular.module('craftyApp')
  .service('FSSimHarvesting', ['$rootScope', 'FSSimMessagingChannel', 'FSSimState', 'FSSimRules', function ($rootScope, FSSimMessagingChannel, FSSimState, FSSimRules) {
 
    // AngularJS will instantiate a singleton by calling "new" on this function


        /**
        * @desc 
        * Handles transaction requests made to harvestables.
        */
        var onTransactionHandler = function( arg) {

          if ( arg.category === 'harvestable') {
            if (arg.action === 'add') {    
              if (!(arg.type in FSSimState.harvestables)) {   
                  var obj = {'name': arg.type};
                  FSSimMessagingChannel.createSimObject( { category: 'harvestable', desc : obj});
              }
            } else if (arg.action === 'remove') {

              if ( FSSimRules.harvestableDefines[arg.type].onHarvested === 'remove') {
                if (arg.cell !== null) {
                    delete arg.cell.harvestables;
                    arg.cell.harvestables = null;
                } 
              }
            }
            FSSimState.updateHarvestables();
          }
        };

        // Register 'onTransactionHandler' after function declaration
        FSSimMessagingChannel.onTransaction($rootScope, onTransactionHandler);


        
  }]);
