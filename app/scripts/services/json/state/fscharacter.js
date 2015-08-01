'use strict';


/**
 * @ngdoc service
 * @name craftyApp.fsCharacter
 * @description
 * # fsCharacter
 * runtime mapping of JSON state 'character'.
 */
angular.module('craftyApp')
  .factory('FSCharacter', function (FSTask, FSContextConsole, FSSimRules, FSSimState, FSSimMessagingChannel, FSSimCrafting) {
    // Service logic
    // ...

    var OPTIONAL_PROPERTY_PROFICIENECY = 'proficiency';

    /**
     * @desc 
     * @return 
     */
    var FSCharacter = function(json) {
        this.json = json;

        // start regenerate stats timers
        ['health', 'energy', 'mind'].forEach( (function( statName) {

          setInterval( (function () {
            if ( this.json.activity.length === 0) {
              this.modifyStat( statName, 'current', 1);
            } else {
                  //regen stats if character is paused on current task.
                  if ( this.hasStatsFor( this.json.activity[0].category ) === false) {
                        this.modifyStat( statName, 'current', 1);
                  }
            }
           }).bind(this), this.json.stats[statName].regeneratePeriod * 1000);

        }).bind(this));
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.getbgcolor =  function( ) {     
      return  ((FSSimState.selectedCharacter  !== null) && (this.getFullName() === FSSimState.selectedCharacter.getFullName())) ? '#00FF00' : null;       
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.getFullName = function () {
      return this.json.name;
    };




    /**
     * @desc - can character start the next task in queue.
     * @return 
     */
    FSCharacter.prototype.canPerformTask = function (task) {     

      var taskName = task.name;
      var activityCategory = task.category;

      var canStartTask = true;

      switch ( activityCategory) {

        case 'crafting': {  
            if ( FSSimCrafting.hasCraftingIngredients(taskName, false) !== true) {
              canStartTask = false;
            }
            if ( FSSimCrafting.hasCraftingConstructor(taskName, false) !== true) {
              canStartTask = false;
            }
            if ( this.hasStatsFor('crafting') !== true) {
              canStartTask = false;
            }
            if ( this.hasCraftingProficiencyFor(taskName) !== true) {
              canStartTask = false;
            }
          }
          break;
      }

      return canStartTask;
    };

   


    /**
     * @desc Does character have the required proficiency for crafting specified item.
     * @return 
     */
    FSCharacter.prototype.hasCraftingProficiencyFor = function ( craftableKeyName ) {
      var hasRequiredProficiency = true;

      if ( FSSimRules.craftableDefines[craftableKeyName].hasOwnProperty( OPTIONAL_PROPERTY_PROFICIENECY ) === true) {
            hasRequiredProficiency = false;
            if ( this.json.proficiency.profession === FSSimRules.craftableDefines[craftableKeyName].proficiency.profession) {
                if ( parseInt(this.json.proficiency.tier, 10) >= parseInt(FSSimRules.craftableDefines[craftableKeyName].proficiency.tier, 10)){
                  hasRequiredProficiency = true;
                }
            }
      }

      return hasRequiredProficiency;
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasSpareActivitySlot = function (log) {

      if ( this.json.activity.length < 4 ) {
        return true;
      }

      if ( log === true) {
        FSContextConsole.log('Activty queue is full');
      }

      return false;
    };

  

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.hasStatsFor = function ( taskCategory) {

      var hasStats = true;

      for (var statKeyname in FSSimRules.taskRules[taskCategory].stat) {
        var required = parseInt( FSSimRules.taskRules[taskCategory].stat[statKeyname].minRequired, 10);
        var current = parseInt( this.json.stats[statKeyname].current, 10) ;
        if ( current< required) {
          hasStats = false;
        }
      }

      return hasStats;
    };




    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.activityPercentRemaining = function ( ) {
      var percent = 0;
      if ( this.json.activity.length > 0) {
        percent = this.json.activity[0].percentRemaining();
        return percent;
      }
      return percent+'%';
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.getStatPercentage = function ( type) {
      var stats = this.json.stats[type];
      return Math.floor(100 * parseInt(stats.current, 10) /  parseInt(stats.max, 10)) +'%';
    };

    /**
     * @desc 
     * @return 
     */
    FSCharacter.prototype.modifyStat = function ( type, subtype, amount) {

      var newValue = parseInt(this.json.stats[type][subtype], 10) + amount;
      if (subtype === 'current') {
        if ( parseInt(this.json.stats[type].current, 10) + amount > parseInt(this.json.stats[type].max, 10)) {
            newValue = parseInt( this.json.stats[type].max, 10);
        }
        if ( parseInt(this.json.stats[type].current, 10) + amount < 0) {
            newValue = 0;
        }
      }

      this.json.stats[type][subtype] = newValue;
      return this.json.stats[type][subtype];
    };

    /**
    * Return the constructor function.
    */
    return FSCharacter;
  
  });
