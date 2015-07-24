'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimObjectFactory
 * @description
 * # FSSimObjectFactory
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSSimObjectFactory', ['$rootScope', 'FSSimObjectChannel', 'FSSimState', 'FSSimRules', 'FSGatherable', 'FSHarvestable', 'FSCharacter', 'FSRecipe', 'FSBankable', function ( $rootScope, FSSimObjectChannel, FSSimState, FSSimRules, FSGatherable, FSHarvestable, FSCharacter, FSRecipe, FSBankable) {
    // AngularJS will instantiate a singleton by calling "new" on this function

        console.log('FSSimObjectFactory');

        var onCreateSimObjectHandler = function( arg) {
            switch (arg.category) {
              case 'gatherables' :
                  FSSimState.gatherables[arg.desc.name] = new FSGatherable(arg.desc);
                  break;
              case 'harvestables' :
                  FSSimState.harvestables[arg.desc.name] = new FSHarvestable(arg.desc);
                  break;
              case 'craftables' :
                  FSSimState.craftables[arg.desc] =  new FSRecipe( arg.desc);      
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

       
         FSSimObjectChannel.onCreateSimObject($rootScope, onCreateSimObjectHandler);

  }]);
