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

     // FSRecipe
    var FSReward = function( json, thisFactory) { 
      this.serializable = json;
      this.thisFactory = thisFactory;
    };


	FSReward.prototype.bgcolor = function( ) {
      var color = '#FF0000';
      if (this.serializable.completed===1) {
          color= '#00FF00';
      }
      return  color;
    };

    return FSReward;
  });
