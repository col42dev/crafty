'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSCraftable
 * @description
 * # FSCraftable
 * runtime mapping of JSON state 'craftable' element.
 */ 
angular.module('craftyApp')
  .factory('FSCraftable', function (FSSimRules) {
    // Service logic
    // ...

    // FSCraftable
    var FSCraftable = function( name) { 

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
    FSCraftable.prototype.getCategory = function( ) {
      if (FSSimRules.craftableDefines.hasOwnProperty(this.json.name) === true) {
          return FSSimRules.craftableDefines[this.json.name].category;
      }
      return 'unknown category';
    };


     /**
     * @desc 
     * @return 
     */
    FSCraftable.prototype.duration =  function(  character) {

      character = character;
      var craftingDuration = FSSimRules.craftableDefines[this.json.name].duration ;
          
      return craftingDuration;
    };


    return FSCraftable;
  });



