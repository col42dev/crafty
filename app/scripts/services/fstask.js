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
    };

    FSTask.prototype.desc = function() {
      return this.name  + ' ' + this.category;
    };


    //Return the constructor function.

    return FSTask;

  });

