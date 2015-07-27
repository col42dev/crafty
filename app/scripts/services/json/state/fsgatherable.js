'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSGatherable
 * @description
 * # FSGatherable
 * runtime mapping of JSON state 'gatherable' element.
 */
angular.module('craftyApp')
  .factory('FSGatherable', function (FSSimRules) {
    // Service logic
    // ...

    // Gatherables
    var FSGatherable = function( json) { 
      this.json = json;
      this.json.quantity = parseInt( this.json.quantity, 10);
      this.quantitybgcolor = 'rgba(200, 200, 200, 0.0)';
    };


    /**
     * @desc 
     * @return 
     */
    FSGatherable.prototype.modifyQuantity = function( amount ) {
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
    FSGatherable.prototype.setFlashQuantityTimeout = function( ) {
      setTimeout( (function() {
        if(typeof this !== 'undefined') {
          this.quantitybgcolor = 'rgba(0, 0, 0, .0)';
        }
      }).bind(this), 500);
    };




  

    return FSGatherable;

  });
