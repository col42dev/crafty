'use strict';

/**
 * @ngdoc service
 * @name craftyApp.stopwatch
 * @description
 * # FSSimFactory
 * Service in the craftyApp.
 */
angular.module('craftyApp')
.constant('SW_DELAI', 1000)
.factory('stopwatch', function (SW_DELAI,$timeout) {
   var data = { 
            hours: 0,
            pad : function(value) { return ('0000'+value).slice(-2); },
            minutes: 0,
            seconds: 0,
            laps: []
        },
        stopwatch = null;
        
    var start = function () {
        stopwatch = $timeout(function() {
            data.seconds++;
            if (data.seconds % 60 === 0) {
            	data.seconds = 0;
            	data.minutes++;
            	if (data.minutes % 60 === 0) {
            		data.minutes = 0;
            		data.hours++;
            	}
            }

            start();
        }, SW_DELAI);
    };

    var stop = function () {
        $timeout.cancel(stopwatch);
        stopwatch = null;
    };

    var reset = function () {
        stop();
        data.seconds = 0;
        data.hours = 0;
        data.minutes = 0;
        data.laps = [];
    };

    var lap = function () {
        data.laps.push(data.value);
    };

    return {
        data: data,
        start: start,
        stop: stop,
        reset: reset,
        lap: lap
    };
});
