'use strict';


/**
 * @ngdoc service
 * @name craftyApp.FSSimWorkers
 * @description
 * # FSSimWorkers
 * Data only - do not add implementations.
 */
angular.module('craftyApp')
  .service('FSSimWorkers', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
 
    this.stateJSON = {};

    this.stateURL = 'null';
    this.stateJSONtxt = {};
   


    this.spreadsheet = '1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4';


// https://spreadsheets.google.com/feeds/list/1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4/oxtnpr4/public/values?alt=json

/*

  this.spreadsheet = '1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4';

https://spreadsheets.google.com/feeds/worksheets/1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4/private/full


oxtnpr4 - simulation
   

   'https://spreadsheets.google.com/feeds/list/1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4/oxtnpr4/public/values?alt=json';
*/

   this.set = function(json, url) {

    console.log('FSSimWorkers:set' + url);
    console.log('FSSimWorkers:set' + json);

    this.stateURL = url;
    this.stateJSON = json;

    this.stateJSONtxt =  JSON.stringify(this.stateJSON, null, 2);


   };

 
    this.update = function() {

        console.log('GDocs: update');

        var spreadsheet = this.spreadsheet;

        var url = 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/oxtnpr4/public/values?alt=json';

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
  
            var races = {};
            var professions = {};


            for (var rowIndex = 0; rowIndex < this.response.feed.entry.length; rowIndex++) { 

              var row = {};
 
              var raceprofession = this.response.feed.entry[rowIndex].gsx$workerattribute.$t;

              var rowdata = null;
              if (raceprofession === 'Race') {
                var race = this.response.feed.entry[rowIndex].gsx$workerraceprofession.$t;
                if ( races.hasOwnProperty(race)  === false) {
                  races[race] = {};
                  races[race].levels = [];
                }
                rowdata = races[race];

              } else if (raceprofession === 'Profession') {
                var profession = this.response.feed.entry[rowIndex].gsx$workerraceprofession.$t;
                if ( professions.hasOwnProperty(profession)  === false) {
                  professions[profession] = {};
                  professions[profession].levels = [];
                }
                rowdata = professions[profession];

              }

              var obj = {};
              obj.cost = parseInt(this.response.feed.entry[rowIndex].gsx$workerlevelcost.$t, 10);
              obj.level = parseInt(this.response.feed.entry[rowIndex].gsx$workerlevel.$t, 10);
              obj.motives = {};
              for (var motiveIndex = 0; motiveIndex < 6; motiveIndex++) { 
                var keyNameId = 'gsx$workermotive' + (motiveIndex + 1)+ 'id';
                var keyNameAmount = 'gsx$workermotive' + (motiveIndex + 1)+ 'amount';

                var motiveTypeName = this.response.feed.entry[rowIndex][keyNameId].$t;
                var motiveTypeAmount = parseInt(this.response.feed.entry[rowIndex][keyNameAmount].$t, 10);
                obj.motives[motiveTypeName] = motiveTypeAmount;
              }

              rowdata.levels.push(obj);


            }


            this.stateJSON.races = angular.copy(races);
            this.stateJSON.professions = angular.copy(professions);

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



    
        this.stateJSON.title = 'simworkers';


         $http.put( 
            this.stateURL, 
            this.stateJSON
        )
        .success(function(response) {
            window.alert('server updated');
            this.stateJSONtxt =  JSON.stringify(this.stateJSON, null, 2);

        }.bind(this))
        .error( function(response) { 
            console.log('FAILED' + angular.toJson(response, true)); 
            window.alert('FAILED:' + angular.toJson(response, true));  
        });
    };


  });
