'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimObjectFactory
 * @description
 * # FSSimObjectFactory
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSSimObjectFactory', ['$rootScope', 'FSSimObjectChannel', 'FSSimState', 'FSSimRules', 'FSGatherable', 'FSHarvestable', 'FSCharacter', 'FSRecipe', 'FSBackpack', function ( $rootScope, FSSimObjectChannel, FSSimState, FSSimRules, FSGatherable, FSHarvestable, FSCharacter, FSRecipe, FSBackpack) {
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
                  console.log('onCreateSimObjectHandler' + arg.category + ', ' + JSON.stringify(arg.desc));
        
                  break;
              case 'bankable':
                  {
                    var category = 'unknown';
                    if ( FSSimRules.toolDefines.hasOwnProperty(arg.desc.name) === true) {
                      category = 'tool';
                    } else if ( FSSimRules.foodDefines.hasOwnProperty(arg.desc.name) === true) {
                      category = 'food';
                    } else if ( arg.desc.category === 'constructor') {
                      category = 'constructor';
                    }
                    FSSimState.bank[arg.desc.name] = new FSBackpack({'category':category, 'name':arg.desc.name});
                    FSSimState.bank[arg.desc.name].increment( arg.desc.quantity );
                  }
                  break;
              case 'character':
                {
                  var characterName = arg.desc.characterDesc.name;
                  FSSimState.characterObjs[characterName] = new FSCharacter(arg.desc.characterDesc, arg.desc.simfactory);
                  FSSimState.selectedCharacter = FSSimState.characterObjs[characterName];
                }
                break;
            }
        };

       
         FSSimObjectChannel.onCreateSimObject($rootScope, onCreateSimObjectHandler);

  }]);
