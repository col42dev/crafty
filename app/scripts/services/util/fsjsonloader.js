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
      'FSSimMessagingChannel', 
      '$http', 
      '$location', 
      'stopwatch', 
      'WorldMap', 
      'WorldMapEdit', 
    function ( 
      FSSimRules, 
      FSSimState, 
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
      url = url;
      console.log('createSimState');
     
      FSSimState.set(data);
      FSSimMessagingChannel.updateGoals();
      stopwatch.reset();
      stopwatch.start();
    };

    /**
     * @desc 
     * @return 
     */
    this.createSimWorldMap = function(data, url) {
      url = url;
      console.log('createSimWorldMap');

      WorldMap.set(data);
      WorldMapEdit.set(data); // also init editor with this data.
    };


    this.master = {
      'craftyrules' : {url: 'http://localhost:9000/json/rules.json', onLoad: this.createSimRules, data:null},
      'craftystate' : {url: 'http://localhost:9000/json/state.json', onLoad: this.createSimState, data:null},
      'craftymap' : {url: 'https://api.myjson.com/bins/275by', onLoad: this.createSimWorldMap, data:null}

      //'craftyrules' : {url: 'http://localhost:9000/json/rules.json', onLoad: this.createSimRules, data:null},
      //'craftystate' : {url: 'http://localhost:9000/json/state.json', onLoad: this.createSimState, data:null},
      //'craftymap' : {url: 'http://localhost:9000/json/worldmap.json', onLoad: this.createSimWorldMap, data:null}
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
