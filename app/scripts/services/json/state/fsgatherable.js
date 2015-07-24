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
      this.quantitybgcolor = 'rgba(200, 200, 200, 0.0)';
    };

   /**
     * @desc 
     * @return 
     */
    FSGatherable.prototype.increment = function( ) {
      this.json.quantity++;
      this.quantitybgcolor = 'rgba(20, 200, 20, 0.25)';
      this.setFlashQuantityTimeout();
    };
    
    /**
     * @desc 
     * @return 
     */
    FSGatherable.prototype.decrement = function( ) {
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
    FSGatherable.prototype.setFlashQuantityTimeout = function( ) {
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
    FSGatherable.prototype.duration =  function(  character) {
      character = character;
      var duration = FSSimRules.gatherableDefines[this.json.name].duration;
      return duration;
    };


  

    return FSGatherable;

  });