'use strict';

/**
 * @ngdoc service
 * @name craftyApp.accounts
 * @description
 * # accounts
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('ServerSideTimers', [ '$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function.


    this.newTimerForm    = { name : 'mytimer', duration: 10, clientIntervalId : 0, remaining: 0};

  	var dbdomain = 'localhost';
    dbdomain = 'ec2-54-201-237-107.us-west-2.compute.amazonaws.com';

    this.timers = null;

    /**
     * @desc 
     * @return 
     */
    this.getFormattedTime = function( seconds) {
        var date = new Date(seconds*1000);
        // hours part from the timestamp
        var hours = date.getHours();
        // minutes part from the timestamp
        var minutes = '0' + date.getMinutes();
        // seconds part from the timestamp
        var seconds = '0' + date.getSeconds();

        // will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        return formattedTime;
    };

    /**
     * @desc 
     * @return 
     */
    this.getPercentageRemaining = function( timer) {
        return ((timer.remaining / timer.duration) * 100) + '%';
    };



    /**
     * @desc 
     * @return 
     */
    this.RefreshTimers = function() {

        var url = 'http://' + dbdomain + ':8080/';
        $http.get(url,{
            params: {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                }
            }
        }).success(function(data) {
          this.timers = data;

          this.updateClientSideTimers();

        }.bind(this)).error(function(data) {
            data = data;
            window.alert('loadTimers failed for ' + url);
        });

    };

    this.RefreshTimers();

     /**
     * @desc 
     * @return 
     */
    this.updateClientSideTimers = function() {

        var thisService = this;

        this.timers.forEach( function( thisTimer) {

            clearInterval(thisTimer.clientIntervalId);

            ( function (intervalTimer) { 
                thisTimer.clientIntervalId = setInterval( function( ) {
                    intervalTimer.remaining --;
                    if ( intervalTimer.remaining <= 0) {
                        clearInterval(intervalTimer.clientIntervalId);
                        var index = thisService.timers.indexOf(intervalTimer);
                        if (index !== -1) {
                            thisService.timers.splice(index, 1);
                        }

                    }

                }, 1000);
            }(thisTimer));
        });

    };



     /**
     * @desc 
     * @return 
     */
    this.selectAccount = function(index) {

      this.data = this.accountsData[Object.keys(this.accountsData)[index]];


     //todo: split in to state and rules: setTimeout(thisService.createSim, 200);

   
    };

     /**
     * @desc 
     * @return 
     */
    this.deleteTimer = function( timer) {

        var url = 'http://' + dbdomain + ':8080/deletetimer';
        $http.get(url,{
            params: {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                },
                timerId: timer._id
            }
        }).success(function() {
           this.RefreshTimers();
        }.bind(this)).error(function(data) {
            data = data;
            window.alert('deletetimer failed for ' + url);
        });

    };

     /**
     * @desc 
     * @return 
     */
    this.deleteAllTimers = function() {

        var url = 'http://' + dbdomain + ':8080/deletealltimers';
        $http.get(url,{
            params: {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                }
            }
        }).success(function() {
           this.RefreshTimers();
        }.bind(this)).error(function() {
            window.alert('deletealltimers failed for ' + url);
        });

    };


    /**
     * @desc 
     * @return 
     */
    // curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"tag":"noob","score":43,"date":"now"}' http://ec2-54-213-75-45.us-west-2.compute.amazonaws.com:8080/score
    this.createTimer = function() {   
    
        $http.defaults.useXDomain = true;  
        delete $http.defaults.headers.common['X-Requested-With'];    

        $http({
           // url: 'http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com:8080/score',
            url: 'http://' + dbdomain + ':8080/createtimer',
            method: 'POST',
            data: this.newTimerForm,
            headers: {'Content-Type': 'application/json'}
        }).success(function () { /*data, status, headers, config*/
            this.RefreshTimers();
        }.bind(this)).error(function (data, status, headers, config) {

            data=data;
            status=status;
            window.alert('post error:' + status);
            window.alert('post error:' + headers);
        });
        


    };

  }]);
