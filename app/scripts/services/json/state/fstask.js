'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSTask
 * @description
 * # FSTask
 *runtime mapping of JSON state 'task' element.
 */

angular.module('craftyApp')
  .factory('FSTask', function () {
    // Service logic
    // ...


    // FStask
    var FSTask = function(taskObj) {
      this.name = taskObj.name;
      this.category = taskObj.category;

      this.updateActiveTaskRemainingSeconds = 1;
      this.updateActiveTaskTotalSeconds = 1;
    };

    FSTask.prototype.desc = function() {
      return this.name  + ' ' + this.category;
    };


        /**
     * @desc 
     * @return 
     */
    FSTask.prototype.createTimer = function ( duration, onInterval ) {
      
      this.updateActiveTaskTotalSeconds = duration;    
      this.updateActiveTaskRemainingSeconds = duration;

      this.updateActiveTaskInterval =  setInterval( onInterval, 1000);
    };

       /**
     * @desc 
     * @return : true until timed out.
     */
    FSTask.prototype.decrementTimer = function ( ) {
 
      this.updateActiveTaskRemainingSeconds --;
      if ( this.updateActiveTaskRemainingSeconds <= 0) {
        clearInterval(this.updateActiveTaskInterval);
        return false;
      }

      return true;
    };

    /**
     * @desc 
     * @return 
     */
    FSTask.prototype.percentRemaining = function ( ) {
      var percent  = Math.floor( this.updateActiveTaskRemainingSeconds / this.updateActiveTaskTotalSeconds  * 100);

      return percent+'%';
    };

    //Return the constructor function.
    return FSTask;

  });

