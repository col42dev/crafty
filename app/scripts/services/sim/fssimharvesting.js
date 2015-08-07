'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimHarvesting
 * @description
 * # FSSimHarvesting
 * Operate on fsharvestables's.
 */
angular.module('craftyApp')
  .service('FSSimHarvesting', ['$rootScope', 'FSSimMessagingChannel', 'FSSimState', 'FSSimRules', 'WorldMap', function ($rootScope, FSSimMessagingChannel, FSSimState, FSSimRules, WorldMap) {
 
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
                  var cell = WorldMap.json.worldMap[arg.cellIndex.row][arg.cellIndex.col];
                  if (cell.harvestables !== null) {
                    delete cell.harvestables;
                    cell.harvestables = null;
                  }
              }
            }
            FSSimState.updateHarvestables();
          }
        };

        // Register 'onTransactionHandler' after function declaration
        FSSimMessagingChannel.onTransaction($rootScope, onTransactionHandler);


        
  }]);
