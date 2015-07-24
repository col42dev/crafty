'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimObjectFactory
 * @description
 * # FSSimObjectFactory
 * Sim implementation module for object instaniation.
 */
angular.module('craftyApp')
  .service('FSSimObjectFactory', ['$rootScope', 'FSSimObjectChannel', 'FSSimState', 'FSSimRules', 'FSGatherable', 'FSHarvestable', 'FSCharacter', 'FSCraftable', 'FSBankable', function ( $rootScope, FSSimObjectChannel, FSSimState, FSSimRules, FSGatherable, FSHarvestable, FSCharacter, FSCraftable, FSBankable) {
    // AngularJS will instantiate a singleton by calling "new" on this function


        /**
        * @desc 
        * Wraps instaniation of FS objects, enables loose coupling between FSObject and Sim implmentation.
        */
        var onCreateSimObjectHandler = function( arg) {
            switch (arg.category) {
              case 'gatherable' :
                  FSSimState.gatherables[arg.desc.name] = new FSGatherable(arg.desc);
                  break;
              case 'harvestable' :
                  FSSimState.harvestables[arg.desc.name] = new FSHarvestable(arg.desc);
                  break;
              case 'craftables' :
                  FSSimState.craftables[arg.desc] =  new FSCraftable( arg.desc);      
                  break;
              case 'bankable':
                  {
                    FSSimState.bank[arg.desc.name] = new FSBankable({'category':arg.desc.category, 'name':arg.desc.name});
                    if ( parseInt( arg.desc.quantity, 10) > 0) {
                      FSSimState.bank[arg.desc.name].increment( arg.desc.quantity );
                    }
                  }
                  break;
              case 'character':
                {
                  var characterName = arg.desc.characterDesc.name;
                  FSSimState.characterObjs[characterName] = new FSCharacter(arg.desc.characterDesc);
                  FSSimState.selectedCharacter = FSSimState.characterObjs[characterName];
                }
                break;
            }
        };

        // Register 'onCreateSimObjectHandler' after function declaration
        FSSimObjectChannel.onCreateSimObject($rootScope, onCreateSimObjectHandler);

  }]);
