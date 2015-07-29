'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSSimRules
 * @description
 * # FSSimRules
 * Immutable rule data mapped from JSON defines.
 * Data only - do not add implementations.
 */
angular.module('craftyApp')
  .service('FSSimRules', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var simRules = this;
    this.rulesJSON = null;
    this.updateServerVersionWithData = null;
    this.rulesURL = null;
    this.serializedData = null;

    this.set = function(json, rulesURL) {

        console.log(rulesURL);
        this.rulesJSON = json; 
        this.rulesURL = rulesURL;

        // Rule Defines
        this.harvestableDefines = json.harvestableDefines;  
        this.gatherableDefines = json.gatherableDefines; 
        this.craftableDefines = json.craftableDefines; 
        this.toolDefines = json.toolDefines;  
        this.consumableDefines = json.consumableDefines;  
        this.constructorDefines = json.constructorDefines;  
        this.taskRules = json.taskRules;  
        this.rewardRules = json.rewardRules;  



        // remap harvestableDefines as keys array - for use by html templates visuals only.
        var hKeys = Object.keys(this.harvestableDefines);
        console.log( JSON.stringify(hKeys));
        this.harvestableDefinesKeys = hKeys.map(function (key) {
                return key;
              });

    };


     /**
     * @desc update myJSON.com server with current JSON rules state. Increment version.
     * @return 
     */
    this.updateServerVersionFromState = function() {
        console.log('updateServerVersion');

        var newJSONrules = angular.copy(this.rulesJSON);

        var newVersionIdArray = newJSONrules.version.split('.');
        newVersionIdArray[2] = parseInt(newVersionIdArray[2], 10) + 1;
        newJSONrules.version = newVersionIdArray.join('.');


        $http.put( 
            this.rulesURL, 
            newJSONrules
        )
        .success(function(response) {
            console.log('SUCCESS' + angular.toJson(response));
            simRules.rulesJSON.version = newJSONrules.version;
            window.alert('server updated');
        })
        .error( function(response) { 
            console.log('FAILED' + angular.toJson(response, true)); 
            window.alert('FAILED:' + angular.toJson(response, true));  
        });
    };


    /**
     * @desc update myJSON.com server with current JSON rules state. Increment version.
     * @return 
     */
    this.onUpdateServerVersionWith = function() {
        //console.log( this.updateServerVersionWithData);

        var newJSONrules = {};
        newJSONrules = this.updateServerVersionWithData;

        $http.put( 
            this.rulesURL, 
            newJSONrules
        )
        .success(function(response) {
            console.log('SUCCESS' + angular.toJson(response));
            //simRules.updateServerVersionWithData = '';
            simRules.set(response, simRules.rulesURL);
            window.alert('server updated');
        })
        .error( function(response) { 
            simRules.updateServerVersionWithData = null;
            console.log('FAILED' + angular.toJson(response, true)); 
            window.alert('FAILED:' + angular.toJson(response, true));  
        });

    };


    /**
     * @desc 
     * @return 
     */
    this.onSerialize = function() {
        //console.log( this.updateServerVersionWithData);
        this.serializedData = angular.toJson(angular.copy(this.rulesJSON), true);
    };





  });
