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
  	var FSFactory = function(characterCount, ctrllerScope, json) {
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
		          	var character = { firstName: generateFirstName(), lastName: generateLastName()};
		          	characters.push( character );
		        }

		        return characters;
	      	}
		  
		    this.characterArray = [];  
		    /*     
	        angular.forEach( generatedCharacters( this.numberOfCharacters), ( function(thisCharacter) {
	          	this.characterArray.push(new FSCharacter(thisCharacter, ctrllerScope));
	        }).bind(this)); 
**/

 			
 			//console.log( json['characters']);

 			json['characters'].forEach( ( function(thisCharacter) {
	          	this.characterArray.push(new FSCharacter(thisCharacter, ctrllerScope));
	        }).bind(this)); 


	        // Gatherables
	        var Gatherable = function( obj) { 

	        	this.bgcolor =  function( ) {				
					return  (this.gatherers > 0) ? '#FF0000' : '#FFFFFF';				
				};

				this.quantity = obj.quantity;
				this.gatherers = obj.gatherers;
			};

			//
	        this.gatherables = {};  
	        json['gatherables'].forEach( ( function(thisGatherables) {
	        	var obj = thisGatherables;
	        	obj.gatherers = 0;
	          	//this.gatherables.push(new Gatherable(thisGatherables, ctrllerScope));

	          	this.gatherables[thisGatherables.name] = new  Gatherable(obj);
	        }).bind(this)); 

/*
	        this.gatherables.Earth = new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Sand= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Shale= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Clay= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Limestone= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Granite= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Slates= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Marble= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Obsidian= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Salt= new Gatherable({ quantity: 100, gatherers: 0});
	        this.gatherables.Coal= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Iron= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Copper= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Tin= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Silver= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Gold= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Platinum= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Water= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Wood= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Leaves= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Roots= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Apples= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Berries= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Wheat= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Grain= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Leather= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Fur= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Meat= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Bones= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Topaz= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Ruby= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Diamonds= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Amethyst= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Saphire= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Emerald= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Tourmaline= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Aquamarine= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Opal= new Gatherable({ quantity: 100, gatherers: 0});
			this.gatherables.Turquoise= new Gatherable({ quantity: 100, gatherers: 0});
*/

			// bank
	        this.bank = {};  
	        //this.bank.Earth = 42;
	        //this.bank.Granite = 11;

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
				this.basetime = obj.basetime;
			};

	        this.recipes = {};  
	       	json['recipes'].forEach( ( function(thisRecipe) {
	        	var obj = thisRecipe;
	          	this.recipes[thisRecipe.name] = new Recipe(obj);
	        }).bind(this)); 
			

			/*
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
			*/

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

		          	this.gatherables[gatherableType].gatherers ++;
		        }
		    }).bind(this)); 
		};

		this.stopGathering = function (gatherableType) {
			this.gatherables[gatherableType].quantity -= 1;
			this.gatherables[gatherableType].gatherers --;

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


	   
	    // Call the initialize function for every new instance
	    this.initialize();
  	};

	/**
	* Return the constructor function.
	*/
	return FSFactory;
});
