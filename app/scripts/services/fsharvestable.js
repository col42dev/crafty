'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSHarvestable
 * @description
 * # FSHarvestable
 * Factory in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSHarvestable', function (FSSimRules) {
    // Service logic
    // ...

    var FSHarvestable = function( obj) { 
      this.json = obj;
      this.quantitybgcolor = 'rgba(200, 200, 200, 0.0)';

      // replenish quantity
      if ( FSSimRules.harvestableDefines[this.json.name].hasOwnProperty('replenish') === true ) {
           setInterval( (function () {
              this.json.quantity = parseInt( this.json.quantity, 10)  + 1;
            }).bind(this), FSSimRules.harvestableDefines[this.json.name].replenish * 1000);
      }
    };

     /**
     * @desc 
     * @return 
     */
    FSHarvestable.prototype.increment = function( ) {
      this.json.quantity++;
      this.quantitybgcolor = 'rgba(20, 200, 20, 0.25)';
      this.setFlashQuantityTimeout();
    };
    
    /**
     * @desc 
     * @return 
     */
    FSHarvestable.prototype.decrement = function( ) {
      this.json.quantity--;
      if ( this.json.quantity !== 0) {
        this.quantitybgcolor = 'rgba(200, 20, 20, 0.25)';
        this.setFlashQuantityTimeout();
      }      
    };

     /**
     * @desc 
     * @return 
     */
    FSHarvestable.prototype.setFlashQuantityTimeout = function( ) {
      setTimeout( (function() {
        if(typeof this !== 'undefined') {
          this.quantitybgcolor = 'rgba(0, 0, 0, .0)';
        }
      }).bind(this), 500);
    };


     /**
     * @desc 
     * @return 
     */
    FSHarvestable.prototype.isHarvestableBy =  function( character) {  

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

      tools.forEach( ( function( thisTool) {
        FSSimRules.toolDefines[thisTool].actions.forEach( ( function ( thisAction) {
            var toolHasRequiredAction = false;
            // match harvest actions with actionables.
            FSSimRules.harvestableDefines[this.json.name].actionable.forEach( ( function ( thisActionable){

              if (thisAction === thisActionable) {

                toolHasRequiredAction = true;
                if ( parseInt( FSSimRules.toolDefines[ thisTool ].strength, 10) >= parseInt( FSSimRules.harvestableDefines[this.json.name].hardness, 10)) {
                  isHarvestable = true;
                } 
              }
            }).bind(this));
        }).bind(this));
      } ).bind(this));   

      return isHarvestable;
    };


     /**
     * @desc 
     * @return 
     */
    FSHarvestable.prototype.duration =  function(  character) {

      var tools = [];
      
      if ( character.json.tools.length > 0) {
        tools.push(character.json.tools[0].json.name); // bug: only using tool in first slot
      } else {
        tools.push('Hands');
      }

      var duration = FSSimRules.harvestableDefines[this.json.name].duration;

      // refactor
      if ( FSSimRules.toolDefines[ tools[0] ].strength > duration/2) {
        duration /= 2;
        duration = Math.ceil(duration);
      } else {
        duration -= FSSimRules.toolDefines[ tools[0] ].strength;
      }

      return duration;
    };


    return FSHarvestable;

  });
