'use strict';

/**
 * @ngdoc service
 * @name craftyApp.fscontextconsole
 * @description
 * # fscontextconsole
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .service('FSContextConsole', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // Gatherables
    this.message = 'click red cell for context info';

     /**
     * @desc 
     * @return 
     */
    this.log =  function( message, log) {         

        if ( log === true) {
		  this.message += message;
		  this.message   += '\n';
        }
	};

	this.clear =  function() {         
		this.message  = '';
	};



  });
