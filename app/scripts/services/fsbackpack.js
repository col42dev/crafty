'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSBackpack
 * @description
 * # FSBackpack
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSBackpack', function () {
    // Service logic
    
    // FSBackpack
    var FSBackpack = function(obj) { 
        this.quantity = [];
        this.category = obj.category;
        this.name = obj.name;
    };

    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.increment = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.quantity.push({});
      }
    };
    
    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.decrement = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.quantity.pop();
      }
    };

    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.bgcolor = function( ) {
      var color = null;
      switch (this.category) {
       // case 'constructor':
       //   color= '#FFFFFF';
       //   break;
        case 'tool':
          color= '#00FF00';
          break;
        case 'food':
          color= '#00FF00';
          break;
        case 'weapon':
          color= '#00FF00';
          break;
      }
      return  color;
    };


  

    return FSBackpack;
  });
