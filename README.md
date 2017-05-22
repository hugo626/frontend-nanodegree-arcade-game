# Frontend Nanodegree Arcade Game

This is one of the project which comes from [Udacity](https://udacity.com/) [Front End Nanodegree](https://www.udacity.com/course/--nd001-cn-advanced)

## File Structure
In this project, we use [Jasmine 2.2](https://jasmine.github.io/2.2/introduction) to test our classes who are defined in app.js, thus the file structure looks like below:
```
Root
 +-SpecRunner.html          The entry point to run all jasmine tests.
 +-lib                      Library only for including jasmine package.
 |  +-jasmine-2.2.0
 +-spec                     The folder to contain my jasmine behaviour test case.
 |  +-appSpec.js
 +-app                      The folder to have actual Arcade Game.
    +-css
    |  +-style.css          Default css file.
    +-images                All image resources.
    +-sounds                All sound resources.
    +-js
    |  +-app.js             The file contains all class to define different objects in game.
    |  +-engine.js          The game engine to update and rander every object in game.
    |  +-resources.js       The class will manage the loaded resource for whole game system.
    +-index.js              The **entry** point to run the game.
    +-README.md
```
## How to Run Test
To run jasmine test, simple clone or download this repository to your local machine, and open the ```SpecRunner.html``` in your browser (Chrome or Firefox), then you should be able to see the passed test cases.

## Project Instruction.
Students should use this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) for self-checking their submission. Make sure the functions you write are **object-oriented** - either class functions (like Player and Enemy) or class prototype functions such as Enemy.prototype.checkCollisions, and that the keyword 'this' is used appropriately within your class and class prototype functions to refer to the object the function is called upon. Also be sure that the **readme.md** file is updated with your instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).