'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimObjectFactory
 * @description
 * # FSSimObjectFactory
 * Sim implementation module for object instaniation.
 */
angular.module('craftyApp')
  .service('FSSimObjectFactory', [
    '$rootScope', 
    'FSSimMessagingChannel', 
    'FSSimState', 
    'FSSimRules', 
    'FSHarvestable', 
    'FSCharacter', 
    'FSCraftable', 
    'FSBankable', 
    'FSTask',
  function ( 
    $rootScope, 
    FSSimMessagingChannel, 
    FSSimState, 
    FSSimRules, 
    FSHarvestable, 
    FSCharacter, 
    FSCraftable, 
    FSBankable,
    FSTask) 
  {
    // AngularJS will instantiate a singleton by calling "new" on this function


        /**
        * @desc 
        * Wraps instaniation of FS objects, enables loose coupling between FSObject and Sim implmentation.
        */
        var onCreateSimObjectHandler = function( arg) {
            switch (arg.category) {
              case 'harvestable' :
                  FSSimState.harvestables[arg.desc.name] = new FSHarvestable(arg.desc);
                  break;
              case 'craftables' :
                  FSSimState.craftables[arg.desc] =  new FSCraftable( arg.desc);      
                  break;
              case 'bankable':
                  FSSimState.bank[arg.desc.name] = new FSBankable(arg.desc);
                  break;
              case 'task':
                  arg.returnValue = new FSTask(arg.desc);
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
