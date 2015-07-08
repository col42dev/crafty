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
      this.name = obj.name;
      this.quantity = obj.quantity;
    };

    FSHarvestable.prototype.bgcolor =  function( ) {   

      if ( this.isHarvestableBy( this.simulation.selectedCharacter)) {
        return '#00FF00';
      }

      return '#FF0000';   
    };

    FSHarvestable.prototype.isHarvestableBy =  function( character) {  

      var tools = [];
      
      if ( this.simulation.selectedCharacter.tools.length > 0) {
        tools.push(this.simulation.selectedCharacter.tools[0].name);
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
      this.simulation.harvestableDefines[this.name].actionable.forEach( ( function ( thisActionable){
        if (harvestActions.indexOf( thisActionable) !== -1) {
          if (isHarvestable === false) {
           isHarvestable = true; 
          }
        }
      }).bind(this));

      //console.log('isHarvestable(1):' + isHarvestable);  

      // tool strength vs harvestable hardness
      if (isHarvestable === true) {

        if ( this.simulation.toolDefines[ tools[0] ].strength < this.simulation.harvestableDefines[this.name].hardness) {
          isHarvestable = false;
        }
      }

    //console.log('isHarvestable(2):' + isHarvestable);  

      return isHarvestable;
    };


    FSHarvestable.prototype.harvestableDuration =  function(  character) {

      if ( this.isHarvestableBy(character) === false) {
        return '-';
      }
      var tools = [];
      
      if ( character.tools.length > 0) {
        tools.push(this.simulation.selectedCharacter.tools[0].name);
      } else {
        tools.push('Hands');
      }

      var duration = this.simulation.harvestableDefines[this.name].harvestBaseTimeS;

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
