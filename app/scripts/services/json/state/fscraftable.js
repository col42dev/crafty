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

      if (FSSimRules.toolDefines.hasOwnProperty(this.json.name) === true) {
        this.category = 'tool';
      }
      else if (FSSimRules.constructorDefines.hasOwnProperty(this.json.name) === true) {
        this.category = 'constructor';
      }
      else if (FSSimRules.consumableDefines.hasOwnProperty(this.json.name) === true) {
        this.category = 'food';
      }
      else if (FSSimRules.gatherableDefines.hasOwnProperty(this.json.name) === true) {
        this.category = 'gatherable';
      } else {
        this.category = 'unclassified';
      }
    };


    /**
     * @desc 
     * @return 
     */
    FSCraftable.prototype.getCategory = function( ) {
      return this.category;
    };




    return FSCraftable;
  });



