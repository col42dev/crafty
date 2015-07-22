'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimObjectChannel
 * @description
 * # FSSimObjectChannel
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSSimObjectChannel', ['$rootScope', function ($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

        this.setScope = function( $scope) {
            this.$scope = $scope;
        };

        // private notification messages
        var _CREATE_SIM_OBJECT_ = '_CREATE_SIM_OBJECT_';


        // publish 'craete sim object' notification
        this.createSimObject = function (item) {
             $rootScope.$broadcast( _CREATE_SIM_OBJECT_, {item: item});
        };
        //subscribe to 'create sim object' notification
        this.onCreateSimObject = function($scope, handler) {
            $scope.$on( _CREATE_SIM_OBJECT_, function(event, args) {
                handler(args.item);
            });
        };
   
        // return the publicly accessible methods
        return {
            createSimObject: this.createSimObject,
            onCreateSimObject: this.onCreateSimObject
        };

  }]);
