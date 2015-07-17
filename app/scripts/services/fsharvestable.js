'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSHarvestable
 * @description
 * # FSHarvestable
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSHarvestable', function () {
    // Service logic
    // ...

    var FSHarvestable = function( obj, simulation) { 
      this.simulation = simulation;
      //this.name = obj.name;
      //this.quantity = obj.quantity;
      this.json = obj;
    };

    FSHarvestable.prototype.bgcolor =  function( ) {   
      var color =  '#00FF00';  

      if ( this.isHarvestableBy( this.simulation.selectedCharacter) === false) {
        color = '#FF0000';
      }


      if ( this.simulation.selectedCharacter.hasStatsFor('harvesting') === false) {
        color = '#FF0000';
      }

      return color;   
    };

    FSHarvestable.prototype.isHarvestableBy =  function( character, log) {  

      var tools = [];
      
      if ( character.json.tools.length > 0) {
        tools.push(character.json.tools[0].json.name);
      } else {
        tools.push('Hands');
      }
      //console.log('Tools' + JSON.stringify(tools));

      var harvestActions = [];
      tools.forEach( ( function( thisTool) {

        this.simulation.toolDefines[thisTool].actions.forEach( function ( thisAction) {

          if (harvestActions.indexOf(thisAction) === -1) {
             harvestActions.push(thisAction);
          }

        });

      } ).bind(this));   

      //console.log('Actions' + JSON.stringify(harvestActions));  

      var isHarvestable = false;

      // action / actionable match
      this.simulation.harvestableDefines[this.json.name].actionable.forEach( ( function ( thisActionable){
        if (harvestActions.indexOf( thisActionable) !== -1) {
          if (isHarvestable === false) {
           isHarvestable = true; 
          }
        }
      }).bind(this));

      if ( log === true && isHarvestable === false) {
        this.simulation.contextConsole.log( character.json.name + ' is not equipped with a tool with action(s) (' + this.simulation.harvestableDefines[this.json.name].actionable +') for harvesting ' + this.json.name);
      }
      //console.log('isHarvestable(1):' + isHarvestable);  

      // tool strength vs harvestable hardness
      if (isHarvestable === true) {

        if ( parseInt( this.simulation.toolDefines[ tools[0] ].strength, 10) < parseInt( this.simulation.harvestableDefines[this.json.name].hardness, 10)) {
          isHarvestable = false;
          if ( log === true) {
            this.simulation.contextConsole.log(  tools[0] + ' not strong enough to harvest ' + this.json.name);
          }
        }
      }

    //console.log('isHarvestable(2):' + isHarvestable);  

      return isHarvestable;
    };


    FSHarvestable.prototype.duration =  function(  character) {


      if ( this.isHarvestableBy(character) === false) {
        return '-';
      }
      var tools = [];
      
      if ( character.json.tools.length > 0) {
        tools.push(character.json.tools[0].json.name);
      } else {
        tools.push('Hands');
      }

      var duration = this.simulation.harvestableDefines[this.json.name].harvestBaseTimeS;

      // refactor
      if ( this.simulation.toolDefines[ tools[0] ].strength > duration/2) {
        duration /= 2;
        duration = Math.ceil(duration);
      } else {
        duration -= this.simulation.toolDefines[ tools[0] ].strength;
      }

      return duration;
    };


    return FSHarvestable;

  });
