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
    var FSRecipe = function( name, thisFactory) { 
      this.thisFactory = thisFactory;

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
    FSRecipe.prototype.bgcolor = function( ) {
      var enabled = this.thisFactory.isCraftable(this.json.name) ;
      return  (enabled === true) ? 'rgba(20, 200, 20, 0.25)' : 'rgba(200, 20, 20, 0.25)';
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

     /**
     * @desc 
     * @return 
     */
    FSRecipe.prototype.hasUnlocks =  function(  ) {

      if ( this.thisFactory.hasUnlocks( {'action':'craft', 'target':this.json.name})) {
        return 'images/unlock.69ea04fd.png';
      }
      return 'images/clear.d9e2c8a6.png';
    };

    return FSRecipe;
  });



