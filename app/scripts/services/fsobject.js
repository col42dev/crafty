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
    FSObject.prototype.increment = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.quantity.push({});
      }
    };
    FSObject.prototype.decrement = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.quantity.pop();
      }
    };

    FSObject.prototype.bgcolor = function( ) {
      switch (this.category) {
        case 'constructor':
          return '#00FF00';
        case 'tool':
          return '#00FFFF';
      }
      return  null;
    };

    return FSObject;
  });
