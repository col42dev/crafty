'use strict';


/**
 * @ngdoc service
 * @name craftyApp.FSSimValues
 * @description
 * # FSSimValues
 * Data only - do not add implementations.
 */
angular.module('craftyApp')
  .service('FSSimValues', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
 
    this.stateJSON = {};

    this.stateURL = 'null';
    this.stateJSONtxt = {};
   


    this.spreadsheet = '1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4';


// https://spreadsheets.google.com/feeds/list/1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4/otw4nb/public/values?alt=json

/*

  this.spreadsheet = '1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4';

https://spreadsheets.google.com/feeds/worksheets/1a5nPRqrNvu6gAVVtrnAJ5bvGqXCiDVOLivtZrKTIzOo/private/full


otw4nb - simvalues
   

   'https://spreadsheets.google.com/feeds/list/1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4/otw4nb/public/values?alt=json';
*/

   this.set = function(json, url) {

    console.log('FSSimValues:set' + url);
    console.log('FSSimValues:set' + json);

    this.stateURL = url;
    this.stateJSON = json;

    this.stateJSONtxt =  JSON.stringify(this.stateJSON, null, 2);


   };

 
    this.update = function() {

        console.log('GDocs: update');

        var spreadsheet = this.spreadsheet;

        var url = 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/otw4nb/public/values?alt=json';

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
  
            var simvalues = {};

            for (var rowIndex = 0; rowIndex < this.response.feed.entry.length; rowIndex++) { 

              var row = {};
 
              var key = this.response.feed.entry[rowIndex]['gsx$key'].$t;

              var value = this.response.feed.entry[rowIndex]['gsx$value'].$t;
              if (!isNaN(value)){
                  value = parseInt( value, 10);
              }
    
              simvalues[key] = value;
            }

            this.stateJSON.globals = angular.copy(simvalues);

            this.stateJSONtxt =  JSON.stringify(this.stateJSON, null, 2);

            window.alert('Updated. Now update server to persist this change.');

        }.bind(this)).error(function() {

            console.log('spreadsheet not found.');

        });

    };


    this.updateServerVersionFromState = function() { 


        var d = new Date();
        this.stateJSON.lastEditDate = d.toString();

        var newVersionIdArray = this.stateJSON.version.split('.');
        newVersionIdArray[2] = parseInt(newVersionIdArray[2], 10) + 1;
        this.stateJSON.version = newVersionIdArray.join('.');



    
        this.stateJSON.title = 'simvalues';


         $http.put( 
            this.stateURL, 
            this.stateJSON
        )
        .success(function(response) {
            //console.log('SUCCESS' + angular.toJson(response));
            //simRules.rulesJSON.version = newJSONrules.version;
            window.alert('server updated');
            this.stateJSONtxt =  JSON.stringify(this.stateJSON, null, 2);

        }.bind(this))
        .error( function(response) { 
            console.log('FAILED' + angular.toJson(response, true)); 
            window.alert('FAILED:' + angular.toJson(response, true));  
        });
    };


  });
