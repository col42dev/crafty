'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSObject
 * @description
 * # FSObject
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSObject', function () {
    // Service logic
    
    // FSObject
    var FSObject = function(obj) { 
        this.quantity = [];
        this.category = obj.category;
        this.name = obj.name;
    };

    /**
     * @desc 
     * @return 
     */
    FSObject.prototype.increment = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.quantity.push({});
      }
    };
    
    /**
     * @desc 
     * @return 
     */
    FSObject.prototype.decrement = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.quantity.pop();
      }
    };

    /**
     * @desc 
     * @return 
     */
    FSObject.prototype.bgcolor = function( ) {
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


  

    return FSObject;
  });
