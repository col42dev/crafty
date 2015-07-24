'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimObjectFactory
 * @description
 * # FSSimObjectFactory
 * Sim implementation module for object instaniation.
 */
angular.module('craftyApp')
  .service('FSSimObjectFactory', ['$rootScope', 'FSSimMessagingChannel', 'FSSimState', 'FSSimRules', 'FSGatherable', 'FSHarvestable', 'FSCharacter', 'FSCraftable', 'FSBankable', function ( $rootScope, FSSimMessagingChannel, FSSimState, FSSimRules, FSGatherable, FSHarvestable, FSCharacter, FSCraftable, FSBankable) {
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
                  FSSimState.bank[arg.desc.name] = new FSBankable(arg.desc);
                  break;
              case 'character':
                {
                  var characterName = arg.desc.characterDesc.name;
                  FSSimState.characters[characterName] = new FSCharacter(arg.desc.characterDesc);
                  FSSimState.selectedCharacter = FSSimState.characters[characterName];
                }
                break;
            }
        };

        // Register 'onCreateSimObjectHandler' after function declaration
        FSSimMessagingChannel.onCreateSimObject($rootScope, onCreateSimObjectHandler);

  }]);
