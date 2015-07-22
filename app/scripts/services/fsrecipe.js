'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSRecipe
 * @description
 * # FSRecipe
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSRecipe', function (FSSimRules) {
    // Service logic
    // ...

    // FSRecipe
    var FSRecipe = function( name) { 

      this.json = { 'name' : name, 'category' : 'placeholder'};
      this.json = { 'name' : name, 'category' : this.getCategory()};

      this.construction = angular.copy(FSSimRules.craftableDefines[this.json.name].construction); // needed for table filtering only
      if (this.construction.length === 0) {
        this.construction.push( 'none'); 
      }
    };




    /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.getCategory = function( ) {
      if (FSSimRules.craftableDefines.hasOwnProperty(this.json.name) === true) {
          return FSSimRules.craftableDefines[this.json.name].category;
      }
      return 'unknown category';
    };


     /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.duration =  function(  character) {

      character = character;
      var craftingDuration = FSSimRules.craftableDefines[this.json.name].duration ;
          
      return craftingDuration;
    };


    return FSRecipe;
  });



