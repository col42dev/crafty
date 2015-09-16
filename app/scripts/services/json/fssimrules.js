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
        this.craftableDefines = json.craftableDefines; 
        this.toolDefines = json.toolDefines;  
        this.consumableDefines = json.consumableDefines;  
        this.constructorDefines = json.constructorDefines;  
        this.taskRules = json.taskRules;  
        this.rewardRules = json.rewardRules;  
        this.progressionDefines = json.progressionDefines; 

        // dynamically generate object list of construtors

        this.constructorDefines = {};
        for ( var cdi = 0; cdi < Object.keys(this.craftableDefines).length; cdi ++) {

            var keyname = Object.keys(this.craftableDefines)[cdi];
            var construction = this.craftableDefines[keyname].construction[0];

            console.log(construction);

            if ( this.constructorDefines.hasOwnProperty(construction) === false) {
                console.log('+');
                this.constructorDefines[construction] = {};
            }
        }



        this.rebuildMirrors();

    };

     /**
     * @desc mirrorred representations used by visualizations
     * @return 
     */
    this.rebuildMirrors = function() {

        // remap harvestableDefines as keys array - for use by html templates visuals only.
        var hKeys = Object.keys(this.harvestableDefines);
        hKeys.push('');
        //console.log( JSON.stringify(hKeys));
        this.harvestableDefinesKeys = hKeys.map(function (key) {
                return key;
              });



        // 
        this.craftableDefinesMirror = {};
        for ( var cdi = 0; cdi < Object.keys(this.craftableDefines).length; cdi ++) {

            var keyname = Object.keys(this.craftableDefines)[cdi];
            var recipename = this.craftableDefines[keyname].recipename;

            if ( this.craftableDefinesMirror.hasOwnProperty( recipename) === false) {
                this.craftableDefinesMirror[recipename] = {};
            }

            this.craftableDefinesMirror[recipename][keyname] =  this.craftableDefines[keyname];
        }





        // remap progressionDefines as keys array - for use by html templates visuals only.
        var pKeys = Object.keys(this.progressionDefines);
        pKeys.push('');
        //console.log( JSON.stringify(pKeys));
        this.progressionDefinesKeys = pKeys.map(function (key) {
                return key;
              });


    
        // 
        this.progressionDefinesMirror = {};
        for ( var cdi = 0; cdi < Object.keys(this.progressionDefines).length; cdi ++) {

            var keyname = Object.keys(this.progressionDefines)[cdi];
            var playerLevel = this.progressionDefines[keyname].playerLevel;

            if ( this.progressionDefinesMirror.hasOwnProperty( playerLevel) === false) {
                this.progressionDefinesMirror[playerLevel] = {};
            }

            this.progressionDefinesMirror[playerLevel][keyname] =  this.progressionDefines[keyname];
        }
   
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

        var d = new Date();
        newJSONrules.lastEditDate = d.toString();

        // Rule Defines
        newJSONrules.harvestableDefines = this.harvestableDefines;  
        newJSONrules.craftableDefines = this.craftableDefines; 
        newJSONrules.toolDefines = this.toolDefines;  
        newJSONrules.consumableDefines = this.consumableDefines;  
        newJSONrules.constructorDefines = this.constructorDefines;  
        newJSONrules.taskRules = this.taskRules;  
        newJSONrules.rewardRules = this.rewardRules;  
        newJSONrules.progressionDefines = this.progressionDefines; 


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
