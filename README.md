# [crafty](http://ec2-54-201-237-107.us-west-2.compute.amazonaws.com/crafty/#/)

crafty is prototype web app which models an interactive crafting chain technology tree. Simulation components include worker agents and resource gathering from a world map. All tasks are timed determined by the crafting chain rules. A crafting task can only be initiated if all its dependencies are met, these include available workers and a list of required resources and quantities, recipes also require a specific constructor (workstation).

The state and rules definitions used loaded from [myjson.com](http://myjson.com) server on startup. crafty also acts as an editor for the state and rules data via forms input, the edited data can be uploaded back to the myjson server to replace the defaults which are loaded on startup. The local rules definitions can also be updated via importing from a [google spreadsheet](https://docs.google.com/spreadsheets/d/1xP0aCx9S4wG_3XN9au5VezJ6xVTnZWNlOLX8l6B69n4).

crafty includes a grid world map representation with resource types located in the cells. These resources can be harvested by workers and will be added to a bank inventory list. The world map is downloaded from the myjson server on startup. There is also a map editor view, edited maps can be uploaded to myjson to replace the default version which is loaded on startup.

crafty communicates with server implemented timers. These are implemented in the corresponding server app [craftydb](https://github.com/col42dev/craftydb). These timers are not used by the simulation.

## user instructions

**world view** - click on the map cell resource name text to initiate a resource gathering task.

**bank list** - this shows the list of raw resource and intermediate crafted items which can be used as ingredients for crafting. Resource gathering from the world will add resource to this list. Newly crafted item will also be added to this list.

**craftable list** (under craft tab) -  click an item in the craftables list to initiate a crafting task. If an item is shown in red then its dependencies are not all met. It can still be clicked on to show its list of dependencies. 

**constructor list**(under craft tab) - click an item in the constructor list to chose an active constructor with which to craft. This will change the list of recipes which can be selected in the craftables list.

## build & development

>Install [nodejs](https://nodejs.org/)

>Install [grunt](http://gruntjs.com/getting-started)

From the local repo root run `grunt serve` to launch crafty in your webbrowser using a local server. Run `grunt` to build a minified version for deployment.

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## testing
Running `grunt test` will run the unit tests with karma.


