'use strict';

/**
 * @ngdoc service
 * @name craftyApp.mapedit
 * @description
 * # mapedit
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('WorldMapEdit', function (FSSimMessagingChannel, FSHarvestable, FSSimRules, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.worldMapDim = {rows : 6, cols: 8};
    this.json = {}; // data bound to <pre></pre> display tag
    this.worldMapURL = null;
    this.worldMap = [];

 
  /**
   * @desc generate JSON decription of map,
   * @return 
   */
    this.resize = function() {

        console.log(this.worldMapDim.rows + ', ' + this.worldMapDim.cols);
        this.worldMap = [];
        for ( var row = 0; row < this.worldMapDim.rows; row ++) {
            this.worldMap.push([]);
             for ( var col = 0; col < this.worldMapDim.cols; col ++) {

                var obj = {harvestables:null};
                if (row >= 2) {
                    obj.harvestables = new FSHarvestable({name: 'Earth'});
                } 
                this.worldMap[row].push(obj);
             }
        } 
    };

  /**
   * @desc 
   * @return 
   */
    this.set = function(json, worldMapURL) {

        this.worldMapURL = worldMapURL;
        // Rule Defines
        this.json = json; 

        this.worldMapDim.rows = this.json.worldMap.length;
        this.worldMapDim.cols = this.json.worldMap[0].length;
         this.worldMap = [];

        for ( var row = 0; row < this.json.worldMap.length; row ++) {
            this.worldMap.push([]);
             for ( var col = 0; col < this.json.worldMap[row].length; col ++) {

                var obj = {};
                if (this.json.worldMap[row][col].harvestables !== null) {
                    obj.harvestables = this.json.worldMap[row][col].harvestables;
                } 
                this.worldMap[row].push(obj);
             }
        } 

        this.JSONify();
    };


    /**
    * @desc 
    * @return 
    */
    this.editCell = function( col) {

        if ( col.harvestables.json.name.length === 0) {
            col.harvestables = null;
        }

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
 
        return  color;
    };

    /**
    * @desc 
    * @return 
    */
    this.getbgimage = function( col) {
        if ( col.harvestables !== null && typeof col.harvestables !== 'undefined') {
            var url = '';
            if (FSSimRules.harvestableDefines[col.harvestables.json.name ].hasOwnProperty('visual') === true) {
              url = FSSimRules.harvestableDefines[ col.harvestables.json.name ].visual.url;
            }
            return 'url(' + url + ')';        
        }
    };

    /**
    * @desc 
    * @return 
    */
    this.JSONify = function() {

        this.json = {};

        this.json.title = 'craftymap';
        this.json.version = '0.0.0';
        this.json.worldMap = this.worldMap;

        this.json = angular.toJson(this.json, true);

    };

  

    /**
    * @desc 
    * @return 
    */
    this.updateServer = function() {


        this.JSONify();

        // upload to server
        $http.put( 
            this.worldMapURL, 
            this.json 
        )
        .success(function() {
            console.log('SUCCESS');
            window.alert('server updated');
        })
        .error( function(response) { 
            console.log('Failed to Update server:');
            window.alert('Failed to Update server: ' + JSON.stringify(response));  
        });
    };




  });
