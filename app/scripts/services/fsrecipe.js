'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSRecipe
 * @description
 * # FSRecipe
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSRecipe', function () {
    // Service logic
    // ...

    // FSRecipe
    var FSRecipe = function( name, thisFactory) { 
      this.name = name;
      this.thisFactory = thisFactory;
    };

    FSRecipe.prototype.bgcolor = function( ) {
      var hasResources = true;
      for (var key in this.thisFactory.recipeDef[this.name].input) {

          if (this.thisFactory.recipeDef[this.name].input.hasOwnProperty(key)) {
              if (key in this.thisFactory.bank) {
                if ( this.thisFactory.bank[key].quantity.length < this.thisFactory.recipeDef[this.name].input[key] ) {
                  hasResources = false;
                }
            } else {
              hasResources = false;
            }
          }
      }

      if ( this.thisFactory.recipeDef[this.name].construction.length > 0) {
        var constructor = this.thisFactory.recipeDef[this.name].construction[0];
        if ( this.thisFactory.bank.hasOwnProperty(constructor) === false) {
          hasResources = false;
        }
      }
      
      return  (hasResources === true) ? '#00FF00' : '#FF0000';
    };

    return FSRecipe;
  });
