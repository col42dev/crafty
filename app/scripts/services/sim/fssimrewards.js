'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimRewards
 * @description
 * # FSSimRewards
 * Operate on fsrewards's.
 */
angular.module('craftyApp')
  .service('FSSimRewards', [ '$rootScope', 'FSSimObjectChannel', 'FSSimRules', 'FSSimState', function ($rootScope, FSSimObjectChannel, FSSimRules, FSSimState ) {
    // AngularJS will instantiate a singleton by calling "new" on this function


        var thisService = this;


        /**
         * @desc 
         * @return 
         */
        var onUpdateGoalsHandler = function( ) {
            thisService.nextGoal = {};
            for (var thisRewardRule in FSSimRules.rewardRules) {
                if (FSSimRules.rewardRules.hasOwnProperty(thisRewardRule)) {        
                    if ( FSSimState.rewards.indexOf(thisRewardRule) === -1) {
                        console.log('GOAL:' + thisRewardRule);

                        thisService.nextGoal = angular.copy(FSSimRules.rewardRules[thisRewardRule]);
                        thisService.nextGoal.name = thisRewardRule;
                        break;
                    }
                }
            }
        };

        // Register 'onUpdateGoalsHandler' callback after handler declaration
        FSSimObjectChannel.onUpdateGoals($rootScope, onUpdateGoalsHandler);


        /**
         * @desc 
         * @return 
         */
        var onMakeRewardsHandler  = function ( arg) {

            var returnObj = {};

            for (var thisRewardRule in FSSimRules.rewardRules) {
                if (FSSimRules.rewardRules.hasOwnProperty(thisRewardRule)) {
                    if (FSSimRules.rewardRules[thisRewardRule].action === arg.action) {
                        if (FSSimRules.rewardRules[thisRewardRule].target === arg.target) {
                            
                            // reward reward
                            if ( FSSimState.rewards.indexOf(thisRewardRule) === -1) {
                                console.log('REWARD:' + thisRewardRule);
                                FSSimState.rewards.push(thisRewardRule);
                                returnObj.xp = parseInt(FSSimRules.rewardRules[thisRewardRule].xp);

                                FSSimObjectChannel.updateGoals();


                                // recipe unlocks
                                FSSimRules.rewardRules[thisRewardRule].recipeUnlocks.forEach( function( recipe) {

                                    if ( FSSimState.craftables.hasOwnProperty(recipe) === false) {
                                        //if (FSSimState.rewards.hasOwnProperty(recipe) === false) {
                                            FSSimObjectChannel.createSimObject( { category: 'craftables', desc : recipe});
                                            FSSimState.updateRecipes();
                                            console.log('RECIPE UNLOCK:' + recipe);
                                        //}
                                    }
                                });
                            }
                        }
                    }
                }
            }

            //return returnObj;
        };

        // Register 'onMakeRewardsHandler' callback after handler declaration
        FSSimObjectChannel.onMakeRewards($rootScope, onMakeRewardsHandler);


        /**
         * @desc 
         * @return 
         */
        this.hasUnlocks  = function ( checkDesc ) {

            for (var thisRewardRule in FSSimRules.rewardRules) {
                if (FSSimRules.rewardRules.hasOwnProperty(thisRewardRule)) {
                    if (FSSimRules.rewardRules[thisRewardRule].action === checkDesc.action) {
                        if (FSSimRules.rewardRules[thisRewardRule].target === checkDesc.target) {
                            if ( FSSimState.rewards.indexOf(thisRewardRule) === -1) {
                                return true;    
                            }
                        }
                    }
                }
            }

            return false;
        };


        /**
         * @desc 
         * @return 
         */
        this.getUnlockImage =  function(  action, name) {
          if ( this.hasUnlocks( {'action':action, 'target':name})) {
            return 'images/unlock.69ea04fd.png';
          }
          return 'images/clear.d9e2c8a6.png';
        };
    

  }]);
