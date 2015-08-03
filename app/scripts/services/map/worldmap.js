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

             }
        } 
  };

   /**
   * @desc 
   * @return 
   */
  this.getIndexOf = function(row, col) {
    var rowIndex = this.json.worldMap.indexOf(row);
    var colIndex = row.indexOf(col);
    //console.log(rowIndex + ', ' + colIndex);
    return { 'row' : rowIndex, 'col' : colIndex };
  };


  /**
   * @desc 
   * @return 
   */
  this.getCellText = function(catgeory, col) {
    var padding = '                                      '; // hacky: make text click selection work for full width of cell
    if ( catgeory === 'harvesting') {
      if ( col.harvestables !== null) {
          return col.harvestables.json.name + padding + '\n';
      }
    } 
    return '';
  };

  /**
   * @desc 
   * @return 
   */
  this.getCellTextColor = function(catgeory, col) {
    if ( catgeory === 'harvesting') {
      if ( col.harvestables !== null) {

          return '#000000';
      }

    } 

    return '#DD4444';
  };



  /**
   * @desc 
   * @return 
   */
  this.bgcolor= function( col) {

    var color  = 'rgba(0, 0, 0, .0)';
    if ( col.harvestables !== null) {
        color = 'rgba(54, 25, 25, .1)';
    }
    //if (col.task !== null  && col.task.category === 'harvesting') {
    //  color = 'rgba(54, 25, 25, .1)';
    //}

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
