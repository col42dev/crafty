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
			this.gatherables.Water= { quantity: 100};
			this.gatherables.Wood= { quantity: 100};
			this.gatherables.Leaves= { quantity: 100};
			this.gatherables.Roots= { quantity: 100};
			this.gatherables.Apples= { quantity: 100};
			this.gatherables.Berries= { quantity: 100};
			this.gatherables.Wheat= { quantity: 100};
			this.gatherables.Grain= { quantity: 100};
			this.gatherables.Leather= { quantity: 100};
			this.gatherables.Fur= { quantity: 100};
			this.gatherables.Meat= { quantity: 100};
			this.gatherables.Bones= { quantity: 100};
			this.gatherables.Topaz= { quantity: 100};
			this.gatherables.Ruby= { quantity: 100};
			this.gatherables.Diamonds= { quantity: 100};
			this.gatherables.Amethyst= { quantity: 100};
			this.gatherables.Saphire= { quantity: 100};
			this.gatherables.Emerald= { quantity: 100};
			this.gatherables.Tourmaline= { quantity: 100};
			this.gatherables.Aquamarine= { quantity: 100};
			this.gatherables.Opal= { quantity: 100};
			this.gatherables.Turquoise= { quantity: 100};


			// bank
	        this.bank = {};  
	        this.bank.Earth = 42;
	        this.bank.Granite = 11;

	        var thisFactory = this;

			// recipes
			var Recipe = function( obj) { 

				this.bgcolor =  function( ) {

					var hasResources = true;

					for (var key in obj.input) {
					    if (obj.input.hasOwnProperty(key)) {
					        //console.log (key + ':' + obj.input[key] );

					        if (key in thisFactory.bank) {
						        if ( thisFactory.bank[key] < obj.input[key]) {
						        	hasResources = false;
						        }
					    	} else {
					    		hasResources = false;
					    	}
					    }
					}
					
					return  (hasResources === true) ? '#00FF00' : '#FF0000';
				};

				this.input = obj.input;
				this.output = obj.output;
				this.duration = obj.duration;
			};

	        this.recipes = {};  
	        this.recipes.Rope 			= new Recipe({input:{ Wool: 1}, output:{Rope: 3}, duration:1000});
 			this.recipes.WoodenTable 	= new Recipe({input:{ Wood: 5}, output:{WoodenTable: 1}, duration:2000});
			this.recipes.Workbench 		= new Recipe({input:{ Wood: 3, WoodenTable:1}, output:{Workbench: 1}, duration:1000});
			this.recipes.Bow 			= new Recipe({input:{ Wood: 3, Rope:1}, output:{Bow: 1}, duration:2000});
			this.recipes.Forge 			= new Recipe({input:{ Water: 3, Coal:1, Iron:3, Granite:2}, output:{Forge: 1}, duration:2000});
			this.recipes.SteelClub 		= new Recipe({input:{ Wood: 2, Iron:1, Granite:2}, output:{SteelClub: 1}, duration:4000});
			this.recipes.SteelBar 		= new Recipe({input:{ Coal: 2, Iron:2}, output:{SteelBar: 1}, duration:3000});
			this.recipes.SteelSword 	= new Recipe({input:{ Wood: 1, SteelBar:2}, output:{SteelSword: 1}, duration:3000});
			this.recipes.StonePickaxe 	= new Recipe({input:{ Wood: 2, Granite:3}, output:{StonePickaxe: 1}, duration:3000});
			this.recipes.SteelPickaxe 	= new Recipe({input:{ Wood: 2, SteelBar:3}, output:{SteelPickaxe: 1}, duration:3000});
			this.recipes.SteelAxe    	= new Recipe({input:{ Wood: 2, SteelBar:2}, output:{SteelAxe: 1}, duration:3000});



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

			var assigned = false;

		    angular.forEach(this.characterArray, ( function(thisCharacter) {
		        if (assigned === false && thisCharacter.activity === null) {
		        	assigned = true;
		          	thisCharacter.startGathering( gatherableType, { callback: this.stopGathering, context: this} );
		        }
		    }).bind(this)); 
		};

		this.stopGathering = function (gatherableType) {
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
		this.startRecipe = function (recipeKey) {

			console.log('FSFactory.startRecipe');

		   	// determine if has reqiored ingredients in bank
		   	var hasIngredients = true;
		    var recipeInputObj = this.recipes[recipeKey].input;
			var recipeInputKeys = Object.keys( recipeInputObj );

			recipeInputKeys.forEach( function ( recipeKey ){

				var recipeInput = recipeKey;
				var recipeInputQuantity = recipeInputObj[ recipeKey];

				if (recipeInput in this.bank) {
					if ( this.bank[ recipeInput ] < recipeInputQuantity) {
						hasIngredients = false;
						console.log('does not have ingredient quantity:' + recipeInput + ', ' + recipeInputQuantity);
					}
				} else {
					console.log('does not have ingredient:' + recipeInput);
				
					hasIngredients = false;
				}
			
			}.bind(this));

			console.log('has ingredients:' + hasIngredients);

			if ( hasIngredients === true) {
				var characterAssigned = false;

			    angular.forEach(this.characterArray, ( function(thisCharacter) {
			        if (characterAssigned === false && thisCharacter.activity === null) {
			        	characterAssigned = true;
			          	thisCharacter.startRecipe( recipeKey, { callback: this.stopRecipe, context: this} );

			          	// subtract resources from bank.
			          	recipeInputKeys.forEach( function ( recipeKey ){

							var recipeInput = recipeKey;
							var recipeInputQuantity = recipeInputObj[ recipeKey];

							this.bank[ recipeInput ] -= recipeInputQuantity;
							
						
						}.bind(this));


			        }
			    }).bind(this)); 
			}
			
		};

		this.stopRecipe = function (recipeKey) {
			
			// generate output in bank
			var recipeOutputObj = this.recipes[recipeKey].output;
			var recipeOutputKey = Object.keys( recipeOutputObj );

			// assumes only one type is recipeOutput
			var recipeOutput = recipeOutputKey[0];
			var recipeOutputQuantity = recipeOutputObj[ recipeOutput ];
			
			// add output
			if (recipeOutput in this.bank) {
				this.bank[recipeOutput] += recipeOutputQuantity;
			} else {
				this.bank[recipeOutput] = recipeOutputQuantity;
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
