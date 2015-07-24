'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSUIEventHandler
 * @description
 * # FSUIEventHandler
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSUIEventHandler', function ( FSBankable,  FSSimMessagingChannel,  FSContextConsole, FSSimRules, FSSimState, FSSimRewards, FSSimCrafting, FSSimHarvesting, FSSimGathering, FSSimTasks) {
    // AngularJS will instantiate a singleton by calling "new" on this function



        /**
         * @desc 
         * @return 
         */
        this.bgcolor= function( action, type) {
            var enabled = false;
            switch( action) {
                 case 'reward':
                    enabled = (FSSimState.rewards.indexOf(type) === -1) ? false : true ;
                    break;
                case 'craft':
                    enabled = FSSimCrafting.isCraftable(type) ;
                    break;
                case 'gather':
                    enabled = FSSimGathering.isGatherable(type);
                    break;
                case 'harvest':
                    enabled = FSSimHarvesting.isHarvestable(type);
                    break;
                case 'bank':
                    {
                        switch (FSSimState.bank[type].category) 
                        {
                            case 'constructor':
                                if ( FSSimState.selectedConstructor === type) {
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
                case 'Gatherables':
                    if ( this.hasOwnProperty('orderGatherablesBy') === false) {
                        this.orderGatherablesBy = 'json.name';
                        this.orderGatherablesByOrder = '+';
                    }
                    this.orderGatherablesByOrder = (this.orderGatherablesByOrder==='+') ? '-' : '+';
                    this.orderGatherablesBy = this.orderGatherablesByOrder + fieldName;
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
                case 'gatherable':
                case 'harvestable':
                case 'craftable':
                    FSSimTasks.createTask(tableName, keyName);
                    break;
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

                if ( FSSimState.bank.hasOwnProperty(toolName) === false) {
                       FSSimMessagingChannel.createSimObject( { category: 'bankable', desc : {'category':'tool', 'name':toolName, quantity : 0} });     
                }
                FSSimState.bank[toolName].increment(1);
                FSSimState.updateBank();

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
                    if (FSSimState.selectedConstructor === '') {
                        FSSimState.selectedConstructorFilter = 'none';
                    }
                }
                break;

                case 'tool': { // add to character inventory 
                    if (FSSimState.bank[bankItemKey].json.quantity.length > 0) {
                        FSSimState.bank[bankItemKey].decrement(1) ;
                        FSSimState.selectedCharacter.json.tools.push( new FSBankable( {'category':FSSimState.bank[bankItemKey].category, 'name':FSSimState.bank[bankItemKey].json.name} ));



                        if ( FSSimState.bank[bankItemKey].json.quantity.length === 0) {
                            delete  FSSimState.bank[bankItemKey];
                            FSSimState.updateBank();
                        }
                    }
                }
                break;

                case 'food': { // consume
                    if (FSSimState.bank[bankItemKey].json.quantity.length > 0) {
                        FSSimState.bank[bankItemKey].decrement(1) ;

                        for (var statType in FSSimRules.foodDefines[bankItemKey].onConsume.stat) {
                            for (var statSubType in FSSimRules.foodDefines[bankItemKey].onConsume.stat[statType]) {
                                var delta = parseInt(FSSimRules.foodDefines[bankItemKey].onConsume.stat[statType][statSubType], 10);
                                FSSimState.selectedCharacter.modifyStat( statType, statSubType, delta);
                            }
                        }

                        if ( FSSimState.bank[bankItemKey].json.quantity.length === 0) {
                            delete FSSimState.bank[bankItemKey];
                            FSSimState.updateBank();
                        }
                    }
                }
                break;

                case 'weapon': { // add to character inventory 
                    if (FSSimState.bank[bankItemKey].json.quantity.length > 0) {
                        FSSimState.bank[bankItemKey].decrement(1) ;
                        FSSimState.selectedCharacter.json.weapons.push( new FSBankable( {'category':FSSimState.bank[bankItemKey].category, 'name':FSSimState.bank[bankItemKey].json.name} ));

                        if ( FSSimState.bank[bankItemKey].json.quantity.length === 0) {
                            delete  FSSimState.bank[bankItemKey];
                            FSSimState.updateBank();
                        }
                    }
                }
                break;
            }
        };



 

  });