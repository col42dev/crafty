'use strict';

/**
 * @ngdoc service
 * @name craftyApp.worldmap
 * @description
 * # worldmap
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('World', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function


    this.worldMapDim = {rows : 6, cols: 8};
    this.json = {};

 
  this.set = function(json) {

        console.log('World.set');

        // Rule Defines
        this.json = json; 

        for ( var row = 0; row < this.json.worldMap.length; row ++) {
             for ( var col = 0; col < this.json.worldMap[row].length; col ++) {
                this.json.worldMap[row][col].task = null;
             }
        } 

  };

  this.getText = function(col) {
    if (parseInt(col.quantity, 10) > 0) {
      return col.resource  + ':' + col.quantity;
    }

    if (col.task !== null) {
      return col.resource  + ':' + col.quantity;
    }
    
    return '';
  };

  this.getTaskPercentRemaining = function(col) {
    if (col.task !== null) {
      return col.task.percentRemaining();
    }
    return '0%';
  };



  });
