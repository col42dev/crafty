'use strict';


/**
 * @ngdoc service
 * @name craftyApp.FSMapState
 * @description
 * # FSMapState
 * Data only - do not add implementations.
 */
angular.module('craftyApp')
  .service('FSMapState', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
 
    this.mapStateJSON = {};

    this.mapStateURL = 'https://api.myjson.com/bins/3oiyu';
   


    this.spreadsheet = '1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4';

 
    this.update = function() {

        console.log('GDocs: update');

        var spreadsheet = this.spreadsheet;

        var url = 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/oypka71/public/values?alt=json';

        $http.get(url,{
          params: {
              dataType: 'json',
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Request-Headers' : 'access-control-allow-origin'
              }
          }
        }).success(function(json) {

            this.response = json;

            console.log( 'length:' + this.response.feed.entry.length);

  
            var map = {};



            map.rows = [];

            for (var rowIndex = 0; rowIndex < this.response.feed.entry.length; rowIndex++) { 

              var row = [];
              //var content = this.response.feed.entry[rowIndex].content;
              //console.log( angular.toJson(content));

              for (var colIndex = 0; colIndex < 64; colIndex++) { 

                var cell = this.response.feed.entry[rowIndex]['gsx$h'+(colIndex+1)];
                console.log( 'row:'+rowIndex +', col:'+colIndex + ' : ' + angular.toJson(cell));

                row.push( cell);
              }

              map.rows.push(row);


            }

            this.mapStateJSON.map = angular.copy(map);

         


            window.alert('Updated. Now update server to persist this change.');

        }.bind(this)).error(function() {

            console.log('spreadsheet not found.');

        });

    };


    this.updateServerVersionFromState = function() { 

         $http.put( 
            this.mapStateURL, 
            this.mapStateJSON
        )
        .success(function(response) {
            console.log('SUCCESS' + angular.toJson(response));
            //simRules.rulesJSON.version = newJSONrules.version;
            window.alert('server updated');
        })
        .error( function(response) { 
            console.log('FAILED' + angular.toJson(response, true)); 
            window.alert('FAILED:' + angular.toJson(response, true));  
        });
    };


  });
