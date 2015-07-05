'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSRecipeDef
 * @description
 * # FSRecipeDef
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSRecipeDef', function () {
    // Service logic
    // ...

    // GameItem
    var FSRecipeDef = function( obj, thisFactory) { 
      this.thisFactory = thisFactory;
      this.input = obj.input;
      this.output = obj.output;
      this.craftBaseTimeS = obj.basetime;
      this.category = obj.category;
      this.construction = obj.construction;
      this.toughness = 1; //todo: datadrive 
      console.log('GameItem category:' + obj.category);

    };

    FSRecipeDef.prototype.bgcolor = function( ) {
      var hasResources = true;
      for (var key in this.input) {
          if (this.input.hasOwnProperty(key)) {

              if (key in this.thisFactory.bank) {
                if ( this.thisFactory.bank[key].quantity.length < this.input[key] ) {
                  hasResources = false;
                }
            } else {
              hasResources = false;
            }
          }
      }
      return  (hasResources === true) ? '#00FF00' : '#FF0000';
    };

    return FSRecipeDef;
    
  });
