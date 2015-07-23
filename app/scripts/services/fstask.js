'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSTask
 * @description
 * # FSTask
 * Factory in the craftyApp.
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
    FSTask.prototype.percentRemaining = function ( ) {
      var percent  = Math.floor( this.updateActiveTaskRemainingSeconds / this.updateActiveTaskTotalSeconds  * 100);

      return percent+'%';
    };

    //Return the constructor function.
    return FSTask;

  });

