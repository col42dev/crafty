'use strict';

/**
 * @ngdoc service
 * @name craftyApp.worldmap
 * @description
 * # worldmap
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('World', function (FSHarvestable) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    this.worldMapDim = {rows : 6, cols: 8};
    this.json = {};

 
   /**
   * @desc 
   * @return 
   */
  this.set = function(json) {

        console.log('World.set');

        // Rule Defines
        this.json = json; 

        for ( var row = 0; row < this.json.worldMap.length; row ++) {
             for ( var col = 0; col < this.json.worldMap[row].length; col ++) {
                this.json.worldMap[row][col].task = null;
                if (this.json.worldMap[row][col].harvestable  !== null){
                  var obj = angular.copy(this.json.worldMap[row][col].harvestable);
                  this.json.worldMap[row][col].harvestable = null;
                  this.json.worldMap[row][col].harvestable = new FSHarvestable(obj.json);
                }
             }
        } 

  };

  /**
   * @desc 
   * @return 
   */
  this.getText = function(col) {
    if ( col.harvestable !== null) {
      if (parseInt(col.harvestable.json.quantity, 10) > 0) {
        return col.harvestable.json.name + ':' + col.harvestable.json.quantity;
      }
    }
    if (col.task !== null) {
      return col.task.name +':0';
    }

    return '';
  };

  /**
   * @desc 
   * @return 
   */
  this.getTaskPercentRemaining = function(col) {
    if (col.task !== null) {
      return col.task.percentRemaining();
    }
    return '0%';
  };

  /**
   * @desc 
   * @return 
   */
  this.bgcolor= function( col) {

    var color  = 'rgba(0, 0, 0, .0)';
    if ( col.harvestable !== null) {
      if (parseInt(col.harvestable.json.quantity, 10) > 0) {
        color = 'rgba(54, 25, 25, .1)';
      }
    }
    if (col.task !== null) {
      color = 'rgba(54, 25, 25, .1)';
    }

    return  color;
  };



  });
