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

      this.thisFactory = thisFactory;

      this.json = { 'name' : name, 'category' : 'placeholder'};
      this.json = { 'name' : name, 'category' : this.getCategory()};
    };

    /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.bgcolor = function( ) {

      var enabled = true;

      // has ingredients
      if ( this.thisFactory.hasCraftingIngredients(this.json.name) !== true){
        enabled = false;
      }

      // has constructor if one is needed
      if ( this.thisFactory.hasCraftingConstructor(this.json.name) !== true) {
        enabled = false;
      }


      // has stat level
      if ( this.thisFactory.selectedCharacter.hasStatsFor('crafting') === false) {
        enabled = false;
      }

      // crafting proficiency
      if ( this.thisFactory.selectedCharacter.hasCraftingProficiencyFor(this.json.name) === false) {
        enabled = false;
      }
      
      return  (enabled === true) ? '#00FF00' : '#FF0000';
    };


    /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.getCategory = function( ) {
      if (this.thisFactory.craftableDefines.hasOwnProperty(this.json.name) === true) {
          return this.thisFactory.craftableDefines[this.json.name].category;
      }
      return 'bug';
    };


     /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.duration =  function(  character) {

      character = character;
      var craftingDuration = this.thisFactory.craftableDefines[this.json.name].duration ;
          
      return craftingDuration;
    };

    return FSRecipe;
  });



