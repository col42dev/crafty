'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSBankable
 * @description
 * # FSBankable
 * runtime mapping of JSON state 'bank' element.
 */
angular.module('craftyApp')
  .factory('FSBankable', function () {
    // Service logic
    
    // FSBankable
    var FSBankable = function(obj) { 
        obj.quantity = [];
        this.category = obj.category; //data duplication?
        this.json = obj;
        this.quantitybgcolor = 'rgba(200, 200, 200, 0.25)';
    };


    /**
     * @desc 
     * @return 
     */
    FSBankable.prototype.bgcolor = function() {
      return 'rgba(20, 200, 20, 0.25)';
    };

    /**
     * @desc 
     * @return 
     */
    FSBankable.prototype.increment = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.json.quantity.push({});
      }
      this.quantitybgcolor = 'rgba(20, 200, 20, 0.25)';
      this.setFlashQuantityTimeout();
    };
    
    /**
     * @desc 
     * @return 
     */
    FSBankable.prototype.decrement = function( amount) {
      for (var i = 0; i < amount; i ++) {
        this.json.quantity.pop();
      }
      if ( this.json.quantity.length !== 0) {
        this.quantitybgcolor = 'rgba(200, 20, 20, 0.25)';
        this.setFlashQuantityTimeout();
      }  
    };

    /**
     * @desc 
     * @return 
     */
    FSBankable.prototype.setFlashQuantityTimeout = function( ) {
      setTimeout( (function() {
        if(typeof this !== 'undefined') {
          this.quantitybgcolor = 'rgba(0, 0, 0, .0)';
        }
      }).bind(this), 500);
    };

 


  

    return FSBankable;
  });
