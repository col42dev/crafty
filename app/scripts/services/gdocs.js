'use strict';

/**
 * @ngdoc service
 * @name craftyApp.gdocs
 * @description
 * # gdocs
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('GDocs', ['$http', 'FSSimRules',  function ($http, FSSimRules) {
    // AngularJS will instantiate a singleton by calling "new" on this function






   this.recipes = {};

  //  this.spreadsheet = '1GMFHfYlPbazTaV0u_MA6YY9gdMXJ04fmzOYQJxTtHXs';
/*

  this.spreadsheet = '1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4';

https://spreadsheets.google.com/feeds/worksheets/1a5nPRqrNvu6gAVVtrnAJ5bvGqXCiDVOLivtZrKTIzOo/private/full

od3otrm
omu0e9t
orndd4q
14iw6g
oef8ni3
   

   'https://spreadsheets.google.com/feeds/list/1a5nPRqrNvu6gAVVtrnAJ5bvGqXCiDVOLivtZrKTIzOo/od3otrm/public/values?alt=json';
*/

  this.spreadsheet = '1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4';

 
   this.update = function() {

   	console.log('GDocs: update');

   	  var spreadsheet = this.spreadsheet;


   	  var url = 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/od3otrm/public/values?alt=json';

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

          	var entry0 = this.response.feed.entry[0];

            for (var i = 0; i < this.response.feed.entry.length; i++) { 

              var content = this.response.feed.entry[i].content;
              console.log( angular.toJson(content));

              var workstation = this.response.feed.entry[i].gsx$recipeworkstationid.$t;

              if (workstation.length > 0 && workstation !== 'Null') {

                var recipe = {};

                var workstationLevel = this.response.feed.entry[i].gsx$recipeworkstationlevel.$t;


                recipe.construction = [];
                recipe.construction.push(workstation+workstationLevel);

                recipe.workers = parseInt( this.response.feed.entry[i].gsx$inputworkersamount.$t, 10);

                recipe.input = {};
                for ( var resourceInputIndex = 1; resourceInputIndex <= 3; resourceInputIndex ++) {
                	var propnameInputID = 'gsx$inputresource' + resourceInputIndex + 'id';
                	var propnameInputAmount = 'gsx$inputresource' + resourceInputIndex + 'amount';
                	var resourceInputId = this.response.feed.entry[i][propnameInputID].$t;
                	if ( resourceInputId.length > 0) {
                		var resourceAmount = parseInt( this.response.feed.entry[i][propnameInputAmount].$t, 10);
                		recipe.input[resourceInputId] = resourceAmount;
                	}
                }

                recipe.output = {};
                for ( var resourceOutputIndex = 1; resourceOutputIndex <= 1; resourceOutputIndex ++) {
                	var propnameOutputID = 'gsx$outputresource' + resourceOutputIndex + 'id';
                	var propnameOutputAmount = 'gsx$outputresource' + resourceOutputIndex + 'amount';
                	var propnameOutputLevel = 'gsx$outputresource' + resourceOutputIndex + 'level';
                	var resourceOutputId = this.response.feed.entry[i][propnameOutputID].$t;
                	if ( resourceOutputId.length > 0) {
                		var resourceOutputAmount = parseInt( this.response.feed.entry[i][propnameOutputAmount].$t, 10);
                		var resourceOutputLevel = this.response.feed.entry[i][propnameOutputLevel].$t;
                		if (resourceOutputLevel.length > 0) {
                			resourceOutputLevel = parseInt( resourceOutputLevel, 10);
                		} else {
                			resourceOutputLevel = '';
                		}
                		recipe.output[resourceOutputId+resourceOutputLevel] = resourceOutputAmount;
                	}
                }

                recipe.duration = parseInt( this.response.feed.entry[i].gsx$inputtimeamount.$t, 10);
                if ( recipe.duration === 0) {
                	recipe.duration = 1;
                }

                recipe.recipename = this.response.feed.entry[i].gsx$recipename.$t;

                recipe.category = this.response.feed.entry[i].gsx$recipecategory.$t;


                //console.log( JSON.stringify( recipe, null, 2));


                var recipeid = this.response.feed.entry[i].gsx$recipeid.$t;


                if ( this.response.feed.entry[i].gsx$outputprefabname.$t.length > 0) {
                  recipe.outputprefabname = this.response.feed.entry[i].gsx$outputprefabname.$t;
                }


                this.recipes[recipeid] = recipe;

                recipe.playerlevelneeded = parseInt( this.response.feed.entry[i].gsx$playerlevelneeded.$t, 10);

                if (this.response.feed.entry[i].gsx$recipesimulationmotive1id.$t.length > 0) {
                  recipe.motives= {}
                  for ( var motivesIndex = 0; motivesIndex < 1; motivesIndex ++) {
                        var id = this.response.feed.entry[i].gsx$recipesimulationmotive1id.$t;
                        var capacity = this.response.feed.entry[i].gsx$recipesimulationmotive1capacity.$t;
                        recipe.motives[id] = capacity;
                  }
                }
     
     
              }


			       }
          	
          	 console.log('spreadsheet found.');

          	 FSSimRules.craftableDefines = angular.copy(this.recipes);

             FSSimRules.rebuildMirrors();

             window.alert('Updated. Now update server to persist this change.');

          }.bind(this)).error(function() {

          	console.log('spreadsheet not found.');

          });
	};


	//this.getSummary();



  }]);
