'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSJSONLoader
 * @description
 * # FSJSONLoader
 * Load JSON in to sim
 */
angular.module('craftyApp')
  .service('FSJSONLoader', [   'FSSimRules', 'FSSimState', 'FSSimMessagingChannel', '$http', '$location', 'stopwatch', function ( FSSimRules, FSSimState, FSSimMessagingChannel, $http, $location, stopwatch) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var thisService = this;

    var dbdomain = 'localhost';

    dbdomain = 'ec2-54-201-237-107.us-west-2.compute.amazonaws.com';




        this.myStopwatch = stopwatch;
        this.taskTimeScalarDivVis = 'hidden';

        this.master = {
          //rules: 'https://api.myjson.com/bins/nucy' + '?pretty=1',
          //rules: 'http://localhost:9000/json/rules.json',
          rules: 'http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com/crafty/rules.json',
  
          //state: 'https://api.myjson.com/bins/1vby2' + '?pretty=1'
          state: 'http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com/crafty/state.json'
        };
        this.user = angular.copy(this.master);

        this.defaultDocumentName = {input: 'My Account Name'};
        this.documentName = angular.copy(this.defaultDocumentName);


    /**
     * @desc 
     * @return 
     */
    this.loadAndCreateSim = function() {

        //load JSON rules
        this.loadSimRules();
  
    };

   /**
     * @desc 
     * @return 
     */
     this.loadSimRules = function() {

  
         $http.get(this.user.rules,{
            params: {
                dataType: 'jsonp',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                }
            }
        }).success(function(data) {

            if ( data.title === 'craftyrules') {
              thisService.rulesData = data;

              setTimeout(thisService.createSimRules, 200);
            } else {
              window.alert('Validation failed for ' + thisService.user.rules);
            }

        }).error(function(data) {
            data = data;
            window.alert('JSON load failed for' + thisService.user.rules);
        });
      };


    /**
     * @desc 
     * @return 
     */
    this.createSimRules = function() {

      console.log('Load JSON Rules success');
      this.taskTimeScalarDivVis ='';
     

      FSSimRules.set(thisService.rulesData);

    
      thisService.loadSimState();
    };


     /**
     * @desc 
     * @return 
     */
     this.loadSimState = function() {

      //load JSON state
      $http.get(this.user.state,{
          params: {
              dataType: 'jsonp',
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Request-Headers' : 'access-control-allow-origin'
              }
          }
      }).success(function(data) {

          if ( data.title === 'craftystate') {
            thisService.stateData = data;
            setTimeout(thisService.createSimState, 200);
          } else {
            window.alert('Validation failed for ' + thisService.user.stateData);
          }

      }).error(function(data) {
          data = data;
          window.alert('JSON load failed for' + thisService.user.stateData);
      });
    };


    /**
     * @desc 
     * @return 
     */
    this.createSimState = function() {

      $location.path('/'); 

      console.log('Load JSON State success');
     
      FSSimState.set(thisService.stateData);

      FSSimMessagingChannel.updateGoals();
   
      stopwatch.reset();
      stopwatch.start();
    };


    /**
     * @desc 
     * @return 
     */
    this.saveJson = function() {
      console.log('input:' + this.user.input); 

      var json = thisService.simulation.deserialize();
      json['documentName'] =  thisService.documentName.input;
      json = JSON.stringify(json, undefined, 2);
      this.postjson(json);
    };

    /**
     * @desc 
     * @return 
     */
    this.loadAccounts = function() {

        var url = 'http://' + dbdomain + ':8080/';
        $http.get(url,{
            params: {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                }
            }
        }).success(function(data) {

          console.log('Load accounts success');
          thisService.accountsData = data;

        }).error(function(data) {
            data = data;
            window.alert('loadAccounts failed for ' + url);
        });

    };

     /**
     * @desc 
     * @return 
     */
    this.selectAccount = function(index) {
      console.log('selectAccount' + index);

      thisService.data = thisService.accountsData[Object.keys(thisService.accountsData)[index]];


     //todo: split in to state and rules: setTimeout(thisService.createSim, 200);

   
    };

     /**
     * @desc 
     * @return 
     */
    this.removeAllAccounts = function() {

        var url = 'http://' + dbdomain + ':8080/removealldocuments';
        $http.get(url,{
            params: {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                }
            }
        }).success(function(data) {

          console.log('removeAllAccounts success');
          thisService.accountsData = data;
          //$scope.$apply();

        }).error(function(data) {
            data = data;
            window.alert('removeAllAccounts failed for ' + url);
        });

    };


    /**
     * @desc 
     * @return 
     */
    // curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"tag":"noob","score":43,"date":"now"}' http://ec2-54-213-75-45.us-west-2.compute.amazonaws.com:8080/score
    this.postjson = function(jsondata) {   
        $http.defaults.useXDomain = true;  
        delete $http.defaults.headers.common['X-Requested-With'];          
        $http({
           // url: 'http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com:8080/score',
            url: 'http://' + dbdomain + ':8080/accounts',
            method: 'POST',
            data: jsondata,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            //$scope.users = data.users; 
            //$location.path('/scores'); 
            window.alert('post success:' + status);
        }).error(function (data, status, headers, config) {
            //$scope.status = status + ' ' + headers;
            window.alert('post error:' + status);
            window.alert('post error:' + headers);
        });
    };





   


    
  }]);
