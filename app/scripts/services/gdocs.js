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
ov2goyk
   

   'https://spreadsheets.google.com/feeds/list/1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4/od3otrm/public/values?alt=json';
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
                recipe.actionPoints = parseInt( this.response.feed.entry[i].gsx$inputactionpointsamount.$t, 10);

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
                      if (resourceOutputLevel == 0) 
                      {
                        resourceOutputLevel = '';
                      }
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

                recipe.desc = this.response.feed.entry[i].gsx$recipedescription.$t;

                recipe.category = this.response.feed.entry[i].gsx$recipecategory.$t;


                //console.log( JSON.stringify( recipe, null, 2));


                var recipeid = this.response.feed.entry[i].gsx$recipeid.$t;


                //if ( this.response.feed.entry[i].gsx$outputprefabname.$t.length > 0) {
                 //recipe.outputprefabname = this.response.feed.entry[i].gsx$outputprefabname.$t;
                //}


                this.recipes[recipeid] = recipe;

                recipe.playerlevelneeded = parseInt( this.response.feed.entry[i].gsx$playerlevelneeded.$t, 10);

                if (this.response.feed.entry[i].gsx$recipesimulationmotive1id.$t.length > 0) {
                  recipe.motives= {};
                  for ( var motivesIndex = 1; motivesIndex <= 3; motivesIndex ++) {

                        var recipesimulationmotive = 'gsx$recipesimulationmotive' + motivesIndex + 'id';
                        var id = this.response.feed.entry[i][recipesimulationmotive].$t;

                        if (id.length > 0) {
                          var recipesimulationmotivecapacity = 'gsx$recipesimulationmotive' + motivesIndex + 'capacity';
                          var capacity = parseInt( this.response.feed.entry[i][recipesimulationmotivecapacity].$t, 10);
                          recipe.motives[id] = capacity;
                        }
                  }
                }


                recipe.playerlevelneeded = parseInt( this.response.feed.entry[i].gsx$playerlevelneeded.$t, 10);


      
                recipe.xp = parseInt( this.response.feed.entry[i].gsx$recipeplayerxpadded.$t, 10); 
     
                recipe.automate = this.response.feed.entry[i].gsx$outputautomaticrenew.$t;


                if (this.response.feed.entry[i].gsx$objectslotcategory.$t.length > 0) {
                  recipe.objectSlotCategory = this.response.feed.entry[i].gsx$objectslotcategory.$t;
                }

                if (this.response.feed.entry[i].gsx$motiveslotcapacity.$t.length > 0) {
                  recipe.motiveSlotCapacity = parseInt( this.response.feed.entry[i].gsx$motiveslotcapacity.$t, 10);
                }

                if (this.response.feed.entry[i].gsx$workstationslotcapacity.$t.length > 0) {
                  recipe.workstationSlotCapacity = parseInt(this.response.feed.entry[i].gsx$workstationslotcapacity.$t, 10);
                }

                if (this.response.feed.entry[i].gsx$defenseslotcapacity.$t.length > 0) {
                  recipe.defenseSlotCapacity = parseInt(this.response.feed.entry[i].gsx$defenseslotcapacity.$t, 10);
                }

                // local/global storage


                recipe.localStorage = parseInt(this.response.feed.entry[i].gsx$recipelocalstorage.$t, 10);


                recipe.globalStorage = parseInt(this.response.feed.entry[i].gsx$recipeglobalstorage.$t, 10);


     

              }


			       }
          	
          	 console.log('spreadsheet found.');

          	 FSSimRules.craftableDefines = angular.copy(this.recipes);

             FSSimRules.rebuildMirrors();

             window.alert('Updated. Now update server to persist this change.');

          }.bind(this)).error(function() {

          	console.log('spreadsheet not found.');

          });


          // progression
          console.log('progression');

          url = 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/ov2goyk/public/values?alt=json';

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

            var progressions = {};


            for (var i = 0; i < this.response.feed.entry.length; i++) { 

              var progression = {};

              var content = this.response.feed.entry[i].content;
              //console.log( angular.toJson(content));

              var playerlevel = this.response.feed.entry[i].gsx$playerlevel.$t;
              console.log( playerlevel);

              if (playerlevel.length > 0 ) {
                progression.playerLevel = parseInt( this.response.feed.entry[i].gsx$playerlevel.$t, 10);
                //console.log( playerxpneeded);

                progression.playerXPNeeded = parseInt( this.response.feed.entry[i].gsx$playerxpneeded.$t, 10);

                progression.recipes = {};
                for ( var recipeIndex = 1; recipeIndex <= 5; recipeIndex ++) {
        

                  var propnameRecipeID = 'gsx$recipe' + recipeIndex + 'id';
                  var propnameRecipeAmount = 'gsx$recipe' + recipeIndex + 'amount';
                  var propnameRecipeXP = 'gsx$recipe' + recipeIndex + 'xp';

                  var propvalueRecipeID = this.response.feed.entry[i][propnameRecipeID].$t;

                  if ( propvalueRecipeID.length > 0) {

                    if (this.response.feed.entry[i][propnameRecipeID].$t !== 'NULL') {
                      var recipeID = this.response.feed.entry[i][propnameRecipeID].$t;
                      var recipe = {};
                      
                      recipe.amount = parseInt( this.response.feed.entry[i][propnameRecipeAmount].$t, 10);
                      recipe.xp = parseInt( this.response.feed.entry[i][propnameRecipeXP].$t, 10);

                      progression.recipes[ recipeID] = recipe;
                    }
                  }
                }

                progression.maxWorkers = parseInt( this.response.feed.entry[i].gsx$maxworkers.$t, 10);
                progression.additionalMaxWorkersxp = parseInt( this.response.feed.entry[i].gsx$additionalmaxworkersxp.$t, 10);
                progression.maxHeroes = parseInt( this.response.feed.entry[i].gsx$maxheroes.$t, 10);
                progression.maxHeroesUnlocked = parseInt( this.response.feed.entry[i].gsx$maxheroesunlocked.$t, 10);
                progression.maxDefenseTraps = parseInt( this.response.feed.entry[i].gsx$maxdefensetraps.$t, 10);
                progression.maxDefenseTowers = parseInt( this.response.feed.entry[i].gsx$maxdefensetowers.$t, 10);
                progression.maxCombatWaves = parseInt( this.response.feed.entry[i].gsx$maxcombatwaves.$t, 10);
                progression.enforceHunger = (this.response.feed.entry[i].gsx$enforcehunger.$t === 'TRUE') ? 1 : 0;
                progression.enforceRest = (this.response.feed.entry[i].gsx$enforcerest.$t === 'TRUE') ? 1 : 0;

              }

              progressions[playerlevel] = progression;

              console.log( angular.toJson(progression));

            }

            FSSimRules.progressionDefines = angular.copy(progressions);
            FSSimRules.rebuildMirrors();



          }.bind(this)).error(function() {

            console.log('progression spreadsheet not found.');

          });

	};


	//this.getSummary();



  }]);
