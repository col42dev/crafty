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

  this.spreadsheet = '1GMFHfYlPbazTaV0u_MA6YY9gdMXJ04fmzOYQJxTtHXs';

   
 
   this.update = function() {

   	console.log('GDocs: update');

   	  var spreadsheet = this.spreadsheet;


   	  var url = 'https://spreadsheets.google.com/feeds/list/'+spreadsheet+'/od6/public/values?alt=json';

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
      			//console.log( angular.toJson(content));

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

      				//console.log( JSON.stringify( recipe, null, 2));


					var recipeid = this.response.feed.entry[i].gsx$recipeid.$t;

      				this.recipes[recipeid] = recipe;
      			}

				//  $scope.levels[0].push($scope.summary.data.feed.entry[i]);
			}
          	
          	console.log('spreadsheet found.');

          	FSSimRules.craftableDefines = angular.copy(this.recipes);

          }.bind(this)).error(function() {

          	console.log('spreadsheet not found.');

          });
	};


	//this.getSummary();



  }]);
