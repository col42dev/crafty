'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSHarvestable
 * @description
 * # FSHarvestable
 * runtime mapping of JSON state 'harvestable' element.
 */
angular.module('craftyApp')
  .factory('FSHarvestable', function (FSSimRules) {
    // Service logic
    // ...

    var FSHarvestable = function( obj) { 
      this.json = obj;
      this.json.quantity = parseInt( this.json.quantity, 10);
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
    FSHarvestable.prototype.modifyQuantity = function( amount ) {
      this.json.quantity += parseInt( amount, 10);
      if ( this.json.quantity !== 0) {
        this.quantitybgcolor = (amount > 0) ? 'rgba(20, 200, 20, 0.25)' : 'rgba(200, 20, 20, 0.25)';
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



    return FSHarvestable;

  });
