'use strict';

/**
 * @ngdoc service
 * @name craftyApp.mapedit
 * @description
 * # mapedit
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('MapEdit', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.worldMapDim = {rows : 6, cols: 8};

 

    this.resize = function() {

        console.log(this.worldMapDim.rows + ', ' + this.worldMapDim.cols);
        this.worldMap = [];
        for ( var row = 0; row < this.worldMapDim.rows; row ++) {
            this.worldMap.push([]);
             for ( var col = 0; col < this.worldMapDim.cols; col ++) {
                var obj = { resource : (row >= 2) ? 'Earth' : ''};
                this.worldMap[row].push(obj);
             }
        } 
    };

    this.resize();


  });
