'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSJSONLoader
 * @description
 * # FSJSONLoader
 * Load JSON in to sim
 */
angular.module('craftyApp')
  .service('FSJSONLoader', 
    [   
      'FSSimRules', 
      'FSSimState', 
      'FSMapState', 
      'FSSimValues', 
      'FSSimWorkers',
      'FSSimMessagingChannel', 
      '$http', 
      '$location', 
      'stopwatch', 
      'WorldMap', 
      'WorldMapEdit', 
    function ( 
      FSSimRules, 
      FSSimState, 
      FSMapState, 
      FSSimValues, 
      FSSimWorkers, 
      FSSimMessagingChannel, 
      $http, 
      $location, 
      stopwatch, 
      WorldMap, 
      WorldMapEdit) 
    {

    // AngularJS will instantiate a singleton by calling "new" on this function

    var thisService = this;

  
    this.myStopwatch = stopwatch;
    this.taskTimeScalarDivVis = 'hidden';
    this.defaultDocumentName = {input: 'My Account Name'};
    this.documentName = angular.copy(this.defaultDocumentName);


    /**
     * @desc 
     * @return 
     */
    this.createSimRules = function( data, url) {
      console.log('createSimRules');
      this.taskTimeScalarDivVis ='';
      FSSimRules.set(data, url);
    };

    /**
     * @desc 
     * @return 
     */
    this.createSimState = function(data, url) {
      console.log('createSimState');
     
      FSSimState.set(data, url);
      FSSimMessagingChannel.updateGoals();
      stopwatch.reset();
      stopwatch.start();
    };

    /**
     * @desc 
     * @return 
     */
    this.createSimWorldMap = function(data, url) {
      console.log('createSimWorldMap');

      WorldMap.set(data);
      WorldMapEdit.set(data, url); // also init editor with this data.
    };


    /**
     * @desc 
     * @return 
     */
    this.createMapState = function(data, url) {
      console.log('createSimMapState');

      FSMapState.set(data, url); 
    };

        /**
     * @desc 
     * @return 
     */
    this.createSimValues = function(data, url) {
      console.log('createSimValues');

      FSSimValues.set(data, url); 
    };

            /**
     * @desc 
     * @return 
     */
    this.createSimWorkers = function(data, url) {
      console.log('createSimWorkers');

      FSSimWorkers.set(data, url); 
    };

    this.master = {
      'craftyrules' : {url: 'https://api.myjson.com/bins/3ji5e', onLoad: this.createSimRules, data:null},
     'craftystate' : {url: 'https://api.myjson.com/bins/1a9rm', onLoad: this.createSimState, data:null},
      'craftymap' : {url: 'https://api.myjson.com/bins/1yomi', onLoad: this.createSimWorldMap, data:null},
      'mapstate' : {url: 'https://api.myjson.com/bins/42y9a', onLoad: this.createMapState, data:null},
      'simvalues' : {url: 'https://api.myjson.com/bins/4rrxs', onLoad: this.createSimValues, data:null},
      'simworkers' : {url: 'https://api.myjson.com/bins/4xb60', onLoad: this.createSimWorkers, data:null},


     // 'craftyrules' : {url: 'http://localhost:9000/json/rules.json', onLoad: this.createSimRules, data:null},
     // 'craftystate' : {url: 'http://localhost:9000/json/state.json', onLoad: this.createSimState, data:null},
     // 'craftymap' : {url: 'http://localhost:9000/json/worldmap.json', onLoad: this.createSimWorldMap, data:null}
    };

    this.user = angular.copy(this.master);

   /**
     * @desc 
     * @return 
     */
    this.loadAndCreateSim = function() {

      var successRefCount = 0;

      for ( var thisJSONindex in this.user) {

        var thisJSON = this.user[thisJSONindex];

              $http.get(thisJSON.url,{
                  params: {
                      dataType: 'json',
                      headers: {
                          'Access-Control-Allow-Origin': '*',
                          'Access-Control-Request-Headers' : 'access-control-allow-origin'
                      }
                  }
              }).success(function(json) {

                thisService.user[json.title].data = json;
    
                successRefCount ++;
                console.log('refcount:' + successRefCount);

                if ( successRefCount === Object.keys(thisService.user).length) {
                      for ( var loadJSONkey in thisService.user) {   
                          if ( thisService.user[loadJSONkey].onLoad !== null) {
                            thisService.user[loadJSONkey].onLoad( thisService.user[loadJSONkey].data, thisService.user[loadJSONkey].url);
                          } else {
                            window.alert('Validation failed for ' + thisService.user[loadJSONkey].url);
                          }
                      }
                      $location.path('/'); 
                }

              }).error(function(json) {
                  json = json;
                  window.alert('JSON load failed for' + thisJSON.url);
              });
         }
    };


    this.loadAndCreateSim();


 




   


    
  }]);
