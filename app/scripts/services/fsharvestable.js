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
      this.json = obj;


      // replenish quantity
      if ( this.simulation.harvestableDefines[this.json.name].hasOwnProperty('replenish') === true ) {
           setInterval( (function () {
              this.json.quantity = parseInt( this.json.quantity, 10)  + 1;
            }).bind(this), this.simulation.harvestableDefines[this.json.name].replenish * 1000);
      }

    };

    FSHarvestable.prototype.bgcolor =  function( ) {   
      var color =  'rgba(20, 200, 20, 0.25)';  

      if ( this.isHarvestableBy( this.simulation.selectedCharacter) === false) {
        color = 'rgba(200, 20, 20, 0.25)';
      }


      if ( this.simulation.selectedCharacter.hasStatsFor('harvesting') === false) {
        color = 'rgba(200, 20, 20, 0.25)';
      }

      if ( this.simulation.selectedCharacter.hasSpareActivitySlot() === false) {
        color = 'rgba(200, 20, 20, 0.25)';
      }

      return color;   
    };

    FSHarvestable.prototype.isHarvestableBy =  function( character, log) {  

      var tools = [];
      
      // build combined 'tool actions' array
      tools.push('Hands');
      if ( character.json.tools.length > 0) {
        character.json.tools.forEach( function( thisTool ) {

          if ( tools.indexOf( thisTool.json.name ) === -1) {
            tools.push( thisTool.json.name);
          }
        });
      } 


      var isHarvestable = false;
      var toolStrengthMessage = '';
      var toolActionMessage = '';

      tools.forEach( ( function( thisTool) {

        this.simulation.toolDefines[thisTool].actions.forEach( ( function ( thisAction) {


            var toolHasRequiredAction = false;

            // match harvest actions with actionables.
            this.simulation.harvestableDefines[this.json.name].actionable.forEach( ( function ( thisActionable){

              if (thisAction === thisActionable) {

                toolHasRequiredAction = true;
                //
                if ( parseInt( this.simulation.toolDefines[ thisTool ].strength, 10) >= parseInt( this.simulation.harvestableDefines[this.json.name].hardness, 10)) {
                  isHarvestable = true;
                } else {
                    toolStrengthMessage = thisTool + ' not strong enough to harvest ' + this.json.name;
                }

              }


              if ( toolHasRequiredAction === false) {
                toolActionMessage =  character.json.name + ' is not equipped with a tool with action(s) (' + this.simulation.harvestableDefines[this.json.name].actionable +') needed for harvesting ' + this.json.name;
              }

            }).bind(this));

        }).bind(this));

      } ).bind(this));   
 
      if (isHarvestable=== false) {
        if ( log === true) {
          if ( toolStrengthMessage.length > 0) {
            this.simulation.contextConsole.log(  toolStrengthMessage);
          } else if ( toolActionMessage.length > 0) {
            this.simulation.contextConsole.log(  toolActionMessage);
          }
        }
      } 

      return isHarvestable;
    };


    FSHarvestable.prototype.duration =  function(  character) {

      var tools = [];
      
      if ( character.json.tools.length > 0) {
        tools.push(character.json.tools[0].json.name); // bug: only using tool in first slot
      } else {
        tools.push('Hands');
      }

      var duration = this.simulation.harvestableDefines[this.json.name].duration;

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
