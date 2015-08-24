# crafty

crafty is prototype web app to simulate a crafting chain technology tree. Simulation components include worker agents and resource gathering from a map. All tasks are timed determined by crafting chain rules. A crafting task can only be initiated if all dependencies are met, these inlcude free workers and a list of required resources and quantities, recipes also require a specific constructor (workstation).

The state and rules definitions used in JSON and loaded from [myjson.com](http://myjson.com) server on startup. Crafty also acts as an editor for the state and rules data via forms input, the edited data can be uploaded to the myjson server to replace the defaults which are loaded on startup. The local rules definitions can also be updated from importing from a google spreadsheet.

Crafty includes a grid map respresentation with resource located in the grid cells. These resource can be harvested by workers and will be added to a bank inventory list. The map format is in JSON and is downloaded from the myjson server. There is also a map editor view, edited maps can be uploaded to myjson to replace the default version which is loaded on startup.

Crafty prototype communicates with server-side timers. These are implemented in the corresponding server app [craftydb](https://github.com/col42dev/craftydb). These timers are not used by the simulation.

## user instructions

**world view** - click on the map cell resource name text to initiate a resource gathering task.

**bank list** - this show the list of raw resource and intermidiate crafted items which can be used as ingredients for crafting. Resource gathering from the world will add resource to this list. Newly crafted item will also be added to this list.

**craftable list** (under craft tab) -  click an item in the craftables list to initiate a crafting task. If an item is shown in red then its dependencies are not all met. It can still be clicked on to show its list of dependencies. 

**constructor list**(under craft tab) - click an item in the constructor list to chose an active constructor with which to craft. This will change the list of recipes which can be selected in the craftables list.


## project generation
This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Build & development
Run `grunt` for building and `grunt serve` for preview.

## Testing
Running `grunt test` will run the unit tests with karma.
