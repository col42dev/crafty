'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSService
 * @description
 * # FSService
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSService', function ( FSFactory, $http, stopwatch) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var $scope = null;
    var thisService = this;
    var inited = false;

    /**
     * @desc 
     * @return 
     */
    this.init = function( ctrlscope) {

      if (inited === false) {
	      $scope = ctrlscope;

	      this.myStopwatch = stopwatch;
	      this.taskTimeScalarDivVis ='hidden';

	      // reset
	      this.master = {input: 'https://api.myjson.com/bins/16mtq?pretty=1'};
	      this.user = angular.copy(this.master);
  	  }
    };

    /**
     * @desc 
     * @return 
     */
    this.loadJson = function() {
        console.log('input:' + this.user.input); 

        $http.get(this.user.input,{
            params: {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                }
            }
        }).success(function(data) {

            if ( data.app === 'crafty') {
              thisService.data = data;
              setTimeout(thisService.createSim, 200);
            } else {
              window.alert('Validation failed for ' + thisService.user.input);
            }

        }).error(function(data) {
            data = data;
            window.alert('JSON load failed for' + thisService.user.input);
        });
    };

    this.createSim = function() {
      console.log('Load JSON success'  + JSON.stringify(thisService.data));
      this.taskTimeScalarDivVis ='';
     
      thisService.simulation = new FSFactory( $scope , thisService.data);
   
      $scope.$apply();
      thisService.myStopwatch.reset();
      thisService.myStopwatch.start();
    };

    this.onClickCharacter = function( character) {
      thisService.simulation.onClickCharacter( character);
    };

   
    this.onClickHeader = function(tableName, fieldName) {
      thisService.simulation.onClickHeader( tableName, fieldName);
    };

    this.onClickBody = function(tableName, key) {
      thisService.simulation.onClickBody( tableName, key['name']);
    };

    
  });
