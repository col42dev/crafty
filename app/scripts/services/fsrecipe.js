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
      if ( this.thisFactory.hasCraftingIngredients(this.name) !== true){
        enabled = false;
      }

      // has constructor if one is needed
      if ( this.thisFactory.hasCraftingConstructor(this.name) !== true) {
        enabled = false;
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
      if (this.thisFactory.recipeDefines.hasOwnProperty(this.name) === true) {
          return this.thisFactory.recipeDefines[this.name].category;
      }
      return 'bug';
    };


     /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.duration =  function(  character) {

      character = character;
      var craftingDuration = this.thisFactory.recipeDefines[this.name].basetime ;
          
      return craftingDuration;
    };

    return FSRecipe;
  });



