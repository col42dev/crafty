'use strict';

/**
 * @ngdoc service
 * @name craftyApp.fsreward
 * @description
 * # fsreward
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSReward', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /**
     * @desc 
     * @return 
     */
    var FSReward = function( json) { 
      this.serializable = json;
    };



    return FSReward;
  });
