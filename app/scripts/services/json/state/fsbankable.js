'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSBankable
 * @description
 * # FSBankable
 * runtime mapping of JSON state 'bank' element.
 */
angular.module('craftyApp')
  .factory('FSBankable', function (FSSimRules) {
    // Service logic
    
    // FSBankable
    var FSBankable = function(obj) { 
        this.json = obj;
        this.json.quantity = parseInt( this.json.quantity, 10);
        console.log(this.json.quantity);
        this.quantitybgcolor = 'rgba(200, 200, 200, 0.25)';

        if (FSSimRules.craftableDefines.hasOwnProperty(this.json.name) === true) {
          this.category = FSSimRules.craftableDefines[this.json.name].category;
        }
        else if (FSSimRules.toolDefines.hasOwnProperty(this.json.name) === true) {
          this.category = 'tool';
        }
        else if (FSSimRules.foodDefines.hasOwnProperty(this.json.name) === true) {
          this.category = 'food';
        }
        else if (FSSimRules.gatherableDefines.hasOwnProperty(this.json.name) === true) {
          this.category = 'gatherable';
        } else if (this.json.name === '') {
          this.category = 'constructor';
        }
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
    FSBankable.prototype.modifyQuantity = function( amount ) {
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
    FSBankable.prototype.setFlashQuantityTimeout = function( ) {
      setTimeout( (function() {
        if(typeof this !== 'undefined') {
          this.quantitybgcolor = 'rgba(0, 0, 0, .0)';
        }
      }).bind(this), 500);
    };

 
    return FSBankable;
  });
