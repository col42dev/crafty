'use strict';

/**
 * @ngdoc service
 * @name craftyApp.FSFactory
 * @description
 * # FSFactory
 * Service in the craftyApp.
 */
angular.module('craftyApp')
  .factory('FSFactory', function (FSCharacter, FSGatherables) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /**
   	* Constructor, with class name
    */
  	var FSFactory = function(characterCount, ctrllerScope) {
    // Public properties, assigned to the instance ('this')

	    this.initialize = function() {

	     	this.numberOfCharacters = characterCount;

	     	console.log('FSFactory:initilize ' + this.numberOfCharacters);

	     	// Characters
	      	/**
		      * @desc Generate random characters
		      * @return 
		      */
		    function generatedCharacters( characterCount) {
		        var characters = []; 
		   
		        function generateFirstName() {
		        	var names = ['Stroldrin', 'Dorasgrour', 'Hedmurim', 'Gronderlug', 'Thadrin', 'Hedmurim'];
		          	return names[Math.floor(Math.random() * names.length)];
		        }

		        function generateLastName() {
		          	var names = ['Barbedblade', 'Anvilarmour', 'Granitechest', 'Barbedblade', 'Magmashoulder', 'Drakemaster'];
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
	          	this.characterArray.push(new FSCharacter(thisCharacter, ctrllerScope));
	        }).bind(this)); 


	        // Gatherables
	        this.gatherables = {};  
	        this.gatherables.Earth = { quantity: 100};
	        this.gatherables.Sand= { quantity: 100};
	        this.gatherables.Shale= { quantity: 100};
	        this.gatherables.Clay= { quantity: 100};
	        this.gatherables.Limestone= { quantity: 100};
	        this.gatherables.Granite= { quantity: 100};
	        this.gatherables.Slates= { quantity: 100};
	        this.gatherables.Marble= { quantity: 100};
	        this.gatherables.Obsidian= { quantity: 100};
	        this.gatherables.Salt= { quantity: 100};
	        this.gatherables.Coal= { quantity: 100};
			this.gatherables.Iron= { quantity: 100};
			this.gatherables.Copper= { quantity: 100};
			this.gatherables.Tin= { quantity: 100};
			this.gatherables.Silver= { quantity: 100};
			this.gatherables.Gold= { quantity: 100};
			this.gatherables.Platinum= { quantity: 100};


			// bank
	        this.bank = {};  
	        this.bank.Earth = 42;
	        this.bank.Granite = 11;

	

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
		this.startGathering = function (gatherableType) {

			console.log('FSFactory.startGathering');
			var assigned = false;

		    angular.forEach(this.characterArray, ( function(thisCharacter) {
		        if (assigned === false && thisCharacter.activity === null) {
		        	assigned = true;
		          	thisCharacter.startGathering( gatherableType, { callback: this.stopGathering, context: this} );
		          	console.log('assigned FSFactory.startGathering');
		        }
		    }).bind(this)); 
		};

		this.stopGathering = function (gatherableType) {
			console.log('FSFactory.stopGathering');
			this.gatherables[gatherableType].quantity -= 1;

			if (gatherableType in this.bank) {
				this.bank[gatherableType] += 1;
			} else {
				this.bank[gatherableType] = 1;
			}
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
