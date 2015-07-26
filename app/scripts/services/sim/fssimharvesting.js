'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimHarvesting
 * @description
 * # FSSimHarvesting
 * Operate on fsharvestables's.
 */
angular.module('craftyApp')
  .service('FSSimHarvesting', ['$rootScope', 'FSSimMessagingChannel', 'FSSimState', 'FSTask', function ($rootScope, FSSimMessagingChannel, FSSimState, FSTask) {
 
    // AngularJS will instantiate a singleton by calling "new" on this function


        /**
        * @desc 
        * Handles transaction requests made to harvestables.
        */
        var onTransactionHandler = function( arg) {

          if ( arg.category === 'harvestable') {
            if (arg.quantity > 0) {    
              if (!(arg.type in FSSimState.harvestables)) {  // ensure there is an instance in harvestables before it can be incremented.
                  var obj = {'name': arg.type, 'quantity': '0'};
                  FSSimMessagingChannel.createSimObject( { category: 'harvestable', desc : obj});
              }
              FSSimState.harvestables[arg.type].modifyQuantity(arg.quantity);
            } else if (arg.quantity < 0) {
              FSSimState.harvestables[arg.type].modifyQuantity( arg.quantity);
              if ( FSSimState.harvestables[arg.type].json.quantity === 0) {
                delete FSSimState.harvestables[arg.type];
              }

              //cell
              if (arg.cell !== null) {
                if (parseInt(arg.cell.harvestable.json.quantity, 10) > 0) {
                  arg.cell.harvestable.json.quantity = parseInt(arg.cell.harvestable.json.quantity, 10) - 1;
                  if (parseInt(arg.cell.harvestable.json.quantity, 10) === 0) {
                    delete arg.cell.harvestable;
                    arg.cell.harvestable = null;
                  }
                }
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
                var thisTask = new FSTask({'name':harvestableType, 'category':'harvesting', 'cell' : null});
                if ( FSSimState.characters[characterKey].canPerformTask(thisTask)) {
                    return true;
                }
            }
            return false;
        };
        
  }]);
