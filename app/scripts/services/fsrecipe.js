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
      this.category = this.getCategory();
    };

    /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.bgcolor = function( ) {

      var enabled = true;

      // has ingredients
      for (var key in this.thisFactory.recipeDefines[this.name].input) {
          if (this.thisFactory.recipeDefines[this.name].input.hasOwnProperty(key)) {
              if (key in this.thisFactory.bank) {
                if ( this.thisFactory.bank[key].quantity.length < this.thisFactory.recipeDefines[this.name].input[key] ) {
                  enabled = false;
                }
            } else {
              enabled = false;
            }
          }
      }

      // has construct if one is needed
      if ( this.thisFactory.recipeDefines[this.name].construction.length > 0) {
        var constructor = this.thisFactory.recipeDefines[this.name].construction[0];
        if ( this.thisFactory.bank.hasOwnProperty(constructor) === false) {
          enabled = false;
        }
      }

      // has stat level
      if ( this.thisFactory.selectedCharacter.hasStatsFor('crafting') === false) {
        enabled = false;
      }
      
      return  (enabled === true) ? '#00FF00' : '#FF0000';
    };


    /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.getCategory = function( ) {
      //console.log('getCategory');
      if (this.thisFactory.recipeDefines.hasOwnProperty(this.name) === true) {
          return this.thisFactory.recipeDefines[this.name].category;
      }
      return 'bug';
    };

    return FSRecipe;
  });



