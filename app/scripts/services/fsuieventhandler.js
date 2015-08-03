'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSUIEventHandler
 * @description
 * # FSUIEventHandler
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSUIEventHandler', 
    function ( 
      FSBankable,  
      FSSimMessagingChannel,  
      FSContextConsole, 
      FSSimRules, 
      FSSimState, 
      FSSimRewards, 
      FSSimCrafting, 
      FSSimHarvesting, 
      FSSimTasks, 
      FSTask,
      RecipeModal,
      CraftingModal,
      WorldMap) {
    // AngularJS will instantiate a singleton by calling "new" on this function



        /**
         * @desc tables view bgcolor
         * @return 
         */
        this.bgcolor= function( action, type) {
            var enabled = false;
            switch( action) {
                 case 'reward':
                    enabled = (FSSimState.rewards.indexOf(type) === -1) ? false : true ;
                    break;
                case 'craft':
                    var craftableTask = new FSTask({'name':type, 'category':'crafting', 'cellIndex' : null});
                    enabled = FSSimCrafting.isCraftable(craftableTask) ;
                    break;
                case 'harvest':
                    enabled = true;
                    break;
                case 'bank':
                    {
                        switch (FSSimState.bank[type].category) 
                        {
                            case 'constructor':
                                if ( FSSimState.selectedConstructor !== type) {
                                    enabled = true;
                                } 
                                break;
                            case 'tool':
                            case 'food':
                            case 'weapons':
                                enabled = true;
                                break;
                        }
                    }
                    break;
      
            }
          
          return  (enabled === true) ? 'rgba(20, 200, 20, 0.25)' : 'rgba(200, 20, 20, 0.25)';
        };






        /**
         * @desc - order table by field values
         * @return 
         */
        this.onClickHeader = function ( tableName, fieldName) {
            switch ( tableName) {
                case 'Bank':
                    if ( this.hasOwnProperty('orderBankBy') === false) {
                        this.orderBankBy = 'name';
                        this.orderBankByOrder = '+';
                    }
                    this.orderBankByOrder = (this.orderBankByOrder==='+') ? '-' : '+';
                    this.orderBankBy = this.orderBankByOrder + fieldName;
                    break;
                case 'Harvestables':
                    if ( this.hasOwnProperty('orderHarvestablesBy') === false) {
                        this.orderHarvestablesBy = 'json.name';
                        this.orderHarvestablesByOrder = '+';
                    }
                    this.orderHarvestablesByOrder = (this.orderHarvestablesByOrder==='+') ? '-' : '+';
                    this.orderHarvestablesBy = this.orderHarvestablesByOrder + fieldName;
                    break;
                 case 'Recipes':
                    if ( this.hasOwnProperty('orderRecipesBy') === false) {
                        this.orderRecipesBy = 'name';
                        this.orderRecipesByOrder = '+';
                    }
                    this.orderRecipesByOrder = (this.orderRecipesByOrder==='+') ? '-' : '+';
                    this.orderRecipesBy = this.orderRecipesByOrder + fieldName;
                    break;
            }
         };


        /**
         * @desc 
         * @return 
         */
         this.onClickBody = function ( tableName, key) {

            var keyName = key.name;
            FSContextConsole.clear();

            switch (tableName) {
                case 'Bank':
                    this.onClickBank(keyName);
                    break;
                case 'craftable':
                    CraftingModal.open('lg', key);
                    break;
            }
         };

        /**
         * @desc 
         * @return 
         */
        this.onClickWorld = function ( category, row, col) {
            var cell = col;

            var cellIndex = WorldMap.getIndexOf(row, col);

            if (cell.task === null) {
              RecipeModal.open(category, cellIndex);
            }
        };
      

        /**
        * @desc - order table by field values
        * @return 
        */
        this.onClickCharacter = function ( character) {
            FSSimState.selectedCharacter = character;
        };

                /**
         * @desc 
         * @return 
         */
         this.onClickCharacterTool = function ( character, index) {
             if ( character.json.tools.length > index) {
               
                var toolName = character.json.tools[index].json.name;

                FSSimMessagingChannel.transaction( { category: 'bankable', type: toolName, typeCategory:'tool', quantity : 1});
  
                character.json.tools.splice(index, 1);
            }
         };

         /**
         * @desc 
         * @return 
         */
         this.onClickCharacterWeapon = function ( weaponObj) {
            weaponObj = weaponObj;
         };

        /**
         * @desc 
         * @return 
         */
        this.onClickBank = function (bankItemKey) {

            switch ( FSSimState.bank[bankItemKey].category ) {
                case 'constructor': { 
                    FSSimState.selectedConstructor = bankItemKey;
                    FSSimState.selectedConstructorFilter = bankItemKey; 
                    if (FSSimState.selectedConstructor === 'Constructor') {
                        FSSimState.selectedConstructorFilter = 'none';
                    }
                }
                break;

                case 'tool': { // add to character inventory 

                    FSSimState.selectedCharacter.json.tools.push( new FSBankable( {'category':FSSimState.bank[bankItemKey].category, 'name':FSSimState.bank[bankItemKey].json.name} ));
                    FSSimMessagingChannel.transaction( { category: 'bankable', type: bankItemKey, quantity : -1});
                }
                break;

                case 'food': { // consume

                    for (var statType in FSSimRules.consumableDefines[bankItemKey].onConsume.stat) {
                        for (var statSubType in FSSimRules.consumableDefines[bankItemKey].onConsume.stat[statType]) {
                            var delta = parseInt(FSSimRules.consumableDefines[bankItemKey].onConsume.stat[statType][statSubType], 10);
                            FSSimState.selectedCharacter.modifyStat( statType, statSubType, delta);
                        }
                    }
 
                    FSSimMessagingChannel.transaction( { category: 'bankable', type: bankItemKey, quantity : -1});

                }
                break;

                case 'weapon': { // add to character inventory 
                    FSSimState.selectedCharacter.json.weapons.push( new FSBankable( {'category':FSSimState.bank[bankItemKey].category, 'name':FSSimState.bank[bankItemKey].json.name} ));
                    FSSimMessagingChannel.transaction( { category: 'bankable', type: bankItemKey, quantity : -1});
                }
                break;
            }
        };



 

  });
