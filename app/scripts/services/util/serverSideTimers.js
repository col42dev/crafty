'use strict';

/**
 * @ngdoc service
 * @name craftyApp.accounts
 * @description
 * # accounts
 * Create timers on the server using a REST API.
 * Maintains a synced client side timer for each server side timer which is being represented. 
 */
angular.module('craftyApp')
  .service('ServerSideTimers', [ '$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function.


    $http.defaults.useXDomain = true;  
    delete $http.defaults.headers.common['X-Requested-With'];    

    this.newTimerForm    = { name : 'mytimer', duration: 10, clientIntervalId : 0, remaining: 0};

  	var dbdomain = 'localhost';
    //dbdomain = 'ec2-54-201-237-107.us-west-2.compute.amazonaws.com';

    this.timers = []; //contains timer object retrived from teh server.


    /**
     * @desc Retrieve all timers from the the server and use them to propulate local container.
     * @return 
     */
    this.reSyncWithServer = function() {

        var url = 'http://' + dbdomain + ':8080/';
        $http.get(url,{
            params: {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Headers' : 'access-control-allow-origin'
                }
            }
        }).success( function(data) {
            this.updateClientSideTimers(data);
        }.bind(this)).error( function(data) {
            window.alert('reSyncWithServer failed');
            window.alert('data: ' + data);
            window.alert('url: ' + url);
        });

    };

    this.reSyncWithServer();


    /**
     * @desc Used by html template to display formatted date
     * @return 
     */
    this.getFormattedTime = function( seconds) {
        var date = new Date(seconds*1000);
        var tdays = Math.floor( seconds /( 60 * 60 * 24));
        var thours = date.getHours();
        var tminutes = '0' + date.getMinutes();
        var tseconds = '0' + date.getSeconds();
        var formattedTime = tdays + ' days, ' + thours + ':' + tminutes.substr(-2) + ':' + tseconds.substr(-2);

        return formattedTime;
    };

    /**
     * @desc Used by html template to display formatted date time
     * @return 
     */
    this.getFormattedDateTime = function( seconds) {
        return Date(seconds*1000).toLocaleString('en');
    };


    /**
     * @desc Used by html template to render progress bar.
     * @return 
     */
    this.getPercentageRemaining = function( timer) {
        return ((timer.remaining / timer.duration) * 100) + '%';
    };


     /**
     * @desc    Populate local container with server supplied list fo timers.
     *          Create a client side timer for each server side timer.
     * @return 
     */
    this.updateClientSideTimers = function( serverTimers) {

        // clear any existing client side timers.
        this.timers.forEach( function( thisTimer) {
            clearInterval(thisTimer.clientIntervalId);
        });

        this.timers = serverTimers;
   
        // create a client-side interval timer for each server supplied timer.
        // Note: setInterval is low precision but should be sufficient for the duration of a singel session.
        var thisService = this;
        this.timers.forEach( function( thisTimer) {
            thisService.createClientIntervalTimer( thisTimer);
        });
    };


     /**
     * @desc    Send a request to the server to delete a specific timer by id.
     *          If the request succeeds remove the corresponding client side timer. 
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
            clearInterval(timer.clientIntervalId);
            var index = this.timers.indexOf(timer);
            if (index !== -1) {
                this.timers.splice(index, 1);
            }
        }.bind(this)).error(function(data, status, headers, config) {
            window.alert('deletetimer failed for ' + url);
            window.alert('get error: data:' + data);
            window.alert('get error: status: ' + status);
            window.alert('get error: headers:' + headers);
            window.alert('get error: config:' + config);
        });

    };


 

  /**
     * @desc    
     *         
     */
    this.createClientIntervalTimer  = function(newTimer) {

        var thisService = this;

        ( function (thisTimer) { 
            thisTimer.clientIntervalId = setInterval( function( ) {
                thisTimer.remaining --;
                if ( thisTimer.remaining <= 0) {
                    clearInterval(thisTimer.clientIntervalId);
                    var index = thisService.timers.indexOf(thisTimer);
                    if (index !== -1) {
                        thisService.timers.splice(index, 1);
                    }
                }
            }, 1000);
        }(newTimer));
  
    };


    /**
     * @desc    Send a request to the server to craete a timer instance.
     *          If the request succeeds create the corresponding client side timer using the timer object returned from the server. 
     * @return 
     */
    // example: curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"tag":"noob","score":43,"date":"now"}' http://ec2-54-213-75-45.us-west-2.compute.amazonaws.com:8080/createtimer
    this.createTimer = function() {   
        $http({
           // url: 'http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com:8080/score',
            url: 'http://' + dbdomain + ':8080/createtimer',
            method: 'POST',
            data: this.newTimerForm,
            headers: {'Content-Type': 'application/json'}
        }).success(function ( newTimer) {  // status, headers, config
            this.createClientIntervalTimer( newTimer);
            this.timers.push( newTimer);
        }.bind(this)).error(function (data, status, headers, config) {
            window.alert('post error: data:' + data);
            window.alert('post error: status: ' + status);
            window.alert('post error: headers:' + headers);
            window.alert('post error: config:' + config);
        });
    };


  }]);
