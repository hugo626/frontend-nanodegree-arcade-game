# Frontend Nanodegree Arcade Game

This is one of the project which comes from [Udacity](https://udacity.com/) [Front End Nanodegree](https://www.udacity.com/course/--nd001-cn-advanced)

## 1. How to Run

To run the play this game, please find out the ```index.html``` in ```app``` folder.
Open ```index.html``` in an latest version browser, such as Firefox, Chrome. You should be able to see the gameboard to be drawn.

## 2. How to Play
* To control the character, game will accept ```A```, ```W```,```S```,```D``` or ```Right```, ```Up```,```Down```,```Right``` keys.
* To reset game, when character is collided with enemy and is killed, please press ```SPACE``` key.
* Collected as manay items as you can to reach your best score:

|Item Name|Score|Effect|
|---------|-----|------|
|Key|100|When key is collected, the character will be reseted back to bottom row, and Key-self will be refreshed in same row, but with random Colum.|
|Green Gem|10|Gem-self will be refreshed in same row, but with random Colum.|
|Blue Gem|80|Gem-self will be refreshed in same row, but with random Colum.|
|Orange Gem|1|Gem-self will be refreshed in same row, but with random Colum.|

## 3. License
This Arcade Game is Copyright (c) 2017 Yuguo LI. It is free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE) file.

## 4. Things could be better
As you can see this is the most based version, there are still a lot of features can be added in to make this game better.
1. Start menu overlay screen before the game start.
2. Allowed user to select more different characters.
3. Add more type of enemies.
4. Make the Enemy's moving more better and reasonable. Because current, the speed of enemy is simply random between [30,130).
5. Add random map generation with decoration items, such as rock, heart and etc.
6. Add effects when character win, such as boncing stars, music and etc.