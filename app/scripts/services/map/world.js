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

 

    this.resize = function() {

        console.log(this.worldMapDim.rows + ', ' + this.worldMapDim.cols);
        this.worldMap = [];
        for ( var row = 0; row < this.worldMapDim.rows; row ++) {
            this.worldMap.push([]);
             for ( var col = 0; col < this.worldMapDim.cols; col ++) {
                var obj = (row >= 2) ? { resource :'Earth' } : { resource : ''};
                this.worldMap[row].push(obj);
             }
        } 
    };

    this.resize();

    this.save = function() {

        console.log('save');

        this.json = {};

        this.json.title = 'craftymap';
        this.json.version = '0.0.0';
        this.json.worldMap = this.worldMap;

        this.json = angular.toJson(this.json, true);
    };


  });
