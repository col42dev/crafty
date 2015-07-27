'use strict';

/**
 * @ngdoc service
 * @name craftyApp.worldmap
 * @description
 * # worldmap
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('WorldMap', function (FSHarvestable, FSSimRules) {
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
                if (this.json.worldMap[row][col].hasOwnProperty('harvestables') === false) {
                  this.json.worldMap[row][col].harvestables = null;
                }
                if (this.json.worldMap[row][col].harvestables  !== null){
                  var obj = angular.copy(this.json.worldMap[row][col].harvestables);
                  this.json.worldMap[row][col].harvestables = null;
                  this.json.worldMap[row][col].harvestables = new FSHarvestable(obj.json);
                }

                this.json.worldMap[row][col].gatherables = null;
             }
        } 

  };

  /**
   * @desc 
   * @return 
   */
  this.getText = function(catgeory, col) {
    if ( catgeory === 'harvesting') {
      if ( col.harvestables !== null) {
        if (parseInt(col.harvestables.json.quantity, 10) > 0) {
          return col.harvestables.json.name + ':' + col.harvestables.json.quantity;
        }
      }
      if (col.task !== null && col.task.category === 'harvesting') {
        return col.task.name +':0';
      }

      return '';
    } else if ( catgeory === 'gathering') {
      if ( col.gatherables !== null) {
        if (parseInt(col.gatherables.json.quantity, 10) > 0) {
          return col.gatherables.json.name + ':' + col.gatherables.json.quantity;
        }
      }
      if (col.task !== null && col.task.category === 'gathering') {
        return col.task.name +':0';
      }

      return '';
    }
  };

  /**
   * @desc 
   * @return 
   */
  this.getTaskPercentRemaining = function(catgeory, col) {
    if ( catgeory === 'harvesting') {
      if (col.task !== null && col.task.category === 'harvesting') {
        return col.task.percentRemaining();
      }
      return '0%';
    } else if ( catgeory === 'gathering') {
      if (col.task !== null && col.task.category === 'gathering') {
        return col.task.percentRemaining();
      }
      return '0%';
    }
  };

  /**
   * @desc 
   * @return 
   */
  this.bgcolor= function( col) {

    var color  = 'rgba(0, 0, 0, .0)';
    if ( col.harvestables !== null) {
      if (parseInt(col.harvestables.json.quantity, 10) > 0) {
        color = 'rgba(54, 25, 25, .1)';
      }
    }
    if (col.task !== null  && col.task.category === 'harvesting') {
      color = 'rgba(54, 25, 25, .1)';
    }

    return  color;
  };

 /**
   * @desc 
   * @return 
   */
  this.getbgimage = function( col) {
     if ( col.harvestables !== null) {
        var url = '';
        if (FSSimRules.harvestableDefines[col.harvestables.json.name ].hasOwnProperty('visual') === true) {
          url = FSSimRules.harvestableDefines[ col.harvestables.json.name ].visual.url;
        }
        return 'url(' + url + ')';        
    }
  };


  });
