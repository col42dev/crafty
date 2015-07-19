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
        this.quantitybgcolor = 'rgba(200, 200, 200, 0.25)';
    };

    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.increment = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.json.quantity.push({});
      }
      this.quantitybgcolor = 'rgba(20, 200, 20, 0.25)';
      this.setFlashQuantityTimeout();
    };
    
    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.decrement = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.json.quantity.pop();
      }
      if ( this.json.quantity.length !== 0) {
        this.quantitybgcolor = 'rgba(200, 20, 20, 0.25)';
        this.setFlashQuantityTimeout();
      }  
    };

    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.setFlashQuantityTimeout = function( ) {
      setTimeout( (function() {
        if(typeof this !== "undefined") {
          this.quantitybgcolor = 'rgba(0, 0, 0, .0)';
        }
      }).bind(this), 500);
    };

    /**
     * @desc 
     * @return 
     */
    FSBackpack.prototype.bgcolor = function( type) {
      var color = 'rgba(200, 20, 20, 0.25)';

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

      return  color;
    };


  

    return FSBackpack;
  });
