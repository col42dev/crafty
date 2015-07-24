'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimMessagingChannel
 * @description
 * # FSSimMessagingChannel
 * Publish/Subscriber pattern channel for sim implementation to operate on JSON rules/state and visa-versa.
 * reference: http://col42dev.github.io/publish%20subscribe%20design%20pattern/
 */
angular.module('craftyApp')
  .service('FSSimMessagingChannel', ['$rootScope', function ($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

        // private notification messages
        var _CREATE_SIM_OBJECT_ = '_CREATE_SIM_OBJECT_';
        var _UPDATE_GOALS_ = '_UPDATE_GOALS_';
        var _MAKE_REWARDS_ = '_MAKE_REWARDS_';
        var _COMPLETED_TASK_ = '_COMPLETED_TASK_';
        var _TRANSACTION_ = '_TRANSACTION_';


        // publish  notifications
        this.createSimObject = function (item) {
             $rootScope.$broadcast( _CREATE_SIM_OBJECT_, {item: item});
        };
        this.updateGoals = function () {
             $rootScope.$broadcast( _UPDATE_GOALS_, {item: null});
        };
        this.makeRewards = function (item) {
             $rootScope.$broadcast( _MAKE_REWARDS_, {item: item});
        };
        this.completedTask = function (item) {
             $rootScope.$broadcast( _COMPLETED_TASK_, {item: item});
        };
        this.transaction = function (item) {
             $rootScope.$broadcast( _TRANSACTION_, {item: item});
        };


        // subscribe to  notification
        this.onCreateSimObject = function($scope, handler) {
            $scope.$on( _CREATE_SIM_OBJECT_, function(event, args) {
                handler(args.item);
            });
        };
        this.onUpdateGoals = function($scope, handler) {
            $scope.$on( _UPDATE_GOALS_, function(event, args) {
                handler(args.item);
            });
        };
        this.onMakeRewards = function($scope, handler) {
            $scope.$on( _MAKE_REWARDS_, function(event, args) {
                handler(args.item);
            });
        };
        this.onCompletedTask = function($scope, handler) {
            $scope.$on( _COMPLETED_TASK_, function(event, args) {
                handler(args.item);
            });
        };
        this.onTransaction = function($scope, handler) {
            $scope.$on( _TRANSACTION_, function(event, args) {
                handler(args.item);
            });
        };


   
        // return the publicly accessible methods
        return {
            createSimObject: this.createSimObject,
            onCreateSimObject: this.onCreateSimObject,

            bankWithdrawal: this.bankWithdrawal,
            onBankWithdrawal: this.onBankWithdrawal,

            updateGoals: this.updateGoals,
            onUpdateGoals: this.onUpdateGoals,

            makeRewards: this.makeRewards,
            onMakeRewards: this.onMakeRewards,

            completedTask: this.completedTask,
            onCompletedTask: this.onCompletedTask,

            transaction: this.transaction,
            onTransaction: this.onTransaction
        };

  }]);
