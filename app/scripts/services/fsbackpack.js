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
    var FSBackpack = function(obj, simulation) { 
        this.simulation = simulation;
        obj.quantity = [];
        this.category = obj.category;

        this.json = obj;
    };

    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.increment = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.json.quantity.push({});
      }
    };
    
    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.decrement = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.json.quantity.pop();
      }
    };

    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.bgcolor = function( type) {
      var color = null;
      if (type ==='#') {   
        switch (this.category) {
          case 'constructor':
            if ( this.simulation.selectedConstructor === this.json.name) {
              color= '#00FF00';
            } else {
              color = null;
            }
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
      } else {
        color = 'rgba(200, 20, 20, 0.25)';
        switch (this.category) {
          case 'constructor':
            if ( this.simulation.selectedConstructor === this.json.name) {
              color= 'rgba(20, 200, 20, 0.55)';
            } else {
              color= 'rgba(0, 0, 0, 0.0)';
            }
            break;
          case 'tool':
            color= 'rgba(20, 200, 20, 0.25)';
            break;
          case 'food':
            color= 'rgba(20, 200, 20, 0.25)';
            break;
          case 'weapon':
            color= 'rgba(20, 200, 20, 0.25)';
            break;
        }
      }
      return  color;
    };


  

    return FSBackpack;
  });
