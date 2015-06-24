'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSFactory
 * @description
 * # FSFactory
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSFactory', function (FSCharacter) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /**
   	* Constructor, with class name
    */
  	var FSFactory = function(characterCount) {
    // Public properties, assigned to the instance ('this')

	    this.initialize = function() {

	     	this.numberOfCharacters = characterCount;

	     	console.log('FSFactory:initilize ' + this.numberOfCharacters);

	      	/**
		      * @desc Generate random characters
		      * @return 
		      */
		    function generatedCharacters( characterCount) {
		        var characters = []; 
		   
		        function generateFirstName() {
		        	var names = ['Noah', 'Sophia', 'Liam', 'Emma', 'Jacob', 'Olivia'];
		          	return names[Math.floor(Math.random() * names.length)];
		        }

		        function generateLastName() {
		          	var names = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis'];
		          	return names[Math.floor(Math.random() * names.length)];
		        }

		        for ( var characterIndex=0; characterIndex < characterCount; characterIndex++) {
		          	var character = { key: characterIndex, firstName: generateFirstName(), lastName: generateLastName()};
		          	characters.push( character );
		        }

		        return characters;
	      	}

		  
		    this.characterArray = [];       

	        angular.forEach( generatedCharacters( this.numberOfCharacters), ( function(thisCharacter) {
	          	this.characterArray.push(new FSCharacter(thisCharacter));
	        }).bind(this)); 

	        this.runSimulation();
	    };

		/**
		 * @desc 
		 * @return 
		 */
		this.getCharacter = function( characterKey) {

		    var characterWithKey = 0;
		    angular.forEach(this.characterArray, ( function(thisCharacter) {
		        if (thisCharacter.key === characterKey) {
		          characterWithKey = thisCharacter;
		        }
		    }).bind(this)); 
		    return characterWithKey;
		};

	    /**
	    * @desc 
	    * @return 
	    */
	    this.runSimulation  = function() {
		  
		};

	   
	    // Call the initialize function for every new instance
	    this.initialize();
  	};

	/**
	* Return the constructor function.
	*/
	return FSFactory;
});
