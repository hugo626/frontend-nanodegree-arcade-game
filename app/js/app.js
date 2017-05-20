var LEFT_KEY = 'left';
var RIGHT_KEY = 'right';
var UP_KEY = 'up';
var DOWN_KEY = 'down';
var ENTER_KEY = 'enter';
var SPACE_KEY = 'space';
var W_KEY = 'w';
var A_KEY = 'A';
var S_KEY = 'S';
var D_KEY = 'D';
// this is the offset which will be substract from y axis , to thtat the character
// could be drawn in the center of the map block.
var MAP_CHARACTER_OFFSET = 30;
//Map block's drawing size.
var MAP_BLOCK_WIDTH = 101;
var MAP_BLOCK_HEIGHT = 83;
var MAP_COLS = 6;
var MAP_ROWS = 6;

var ANIMATION_INTERVAL = 2;
var BOUNCING_HEIGHT = 20;

var ITEM_SCORE_MAP = {
    key: 100,
    greenGem: 10,
    blueGem: 80,
    orangeGem: 1
};
/**
 * @description This is a super class to describe any object in game which could be collided with
 *              other object. Such as: enemies, player or maybe items.
 * @param {number} initialX the initial x location for this object to be drawn on canvas.
 * @param {number} initialY the initial x location for this object to be drawn on canvas.
 * @param {number} initialHitBox this defined the hit box for this object, it should have offset X and Y
 *                               location which will describe the left upper corner of the hit box,
 *                               which should be relative to the image-self. It should have width and
 *                               height defined to describe the size of the hit box.
 */
var CollidableObject = function(initialX, initialY, initialHitBox, type, soundUri) {
    this.name = type;
    // The image/sprite for our objects, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/' + this.name + '.png';
    this.currentX = initialX;
    this.currentY = initialY;
    this.hitBox = initialHitBox;
    this.soundEffect = new sound('sounds/' + soundUri + '.wav');
};

/**
 * @description this function will return a hit box definition, the major different between the retun one
 *              with the hitbox in {@link CollidableObject} is: the return hitbox describee the hitbox in
 *              absoulate location in whole canvas but not relativly in its image. In other words, the x
 *              and y location in the returned hitbox is describing the location of hit box in whole canvas.
 * @return a object which is used to describe the hitbox of this object in whole canvas.
 */
CollidableObject.prototype.getHitBox = function() {
    return {
        x: this.currentX + this.hitBox.offsetX,
        y: this.currentY + this.hitBox.offsetY,
        width: this.hitBox.width,
        height: this.hitBox.height
    };
};

/**
 * @description This function will take any absoulate hitbox of a {@link CollidableObject}, and the calculate
 *              whether it is intersected with own absoulate hitbox. If they are intersected, then return true,
 *              otherwise, return false.
 * @param {object} targetHitbox an absoulate hitbox of a {@link CollidableObject}.
 * @return {boolean} true if the given hitbox is intersected with own absoulte hitbox, otherwise false.
 */
CollidableObject.prototype.isCollided = function(targetHitbox) {
    var ownHitbox = this.getHitBox();
    var collided = !(targetHitbox.x > (ownHitbox.x + ownHitbox.width) ||
        (targetHitbox.x + targetHitbox.width) < ownHitbox.x ||
        targetHitbox.y > (ownHitbox.y + ownHitbox.height) ||
        (targetHitbox.y + targetHitbox.height) < ownHitbox.y);
    if (collided) this.soundEffect.play();
    return collided;
};

/**
 * @description Define a Enemy class, whcih will have the x and y location of this enemy, image to draw.
 *              And other methods to update its location. It will inherited from {@link CollidableObject}.
 * @param {number} assignedRow the row that allow this enemy to be occupied.
 */
var Enemy = function(assignedRow) {
    //initialise the speed variable for this enemy.
    this.speed = 0;
    // the row that this enemy occupied.
    this.row = assignedRow;
    this.minSpeed = 30;
    this.randomUpper = 80;

    this.randomSpeed();

    //Currently, all enmey should be move from left to right side, so the intial X should be 0.
    var initialX = 0;
    // depend on the assigned row number, calculat the initial y location for this enemy.
    var initialY = _convertRowToY(assignedRow);
    // the offset X and Y location which will describe the left upper corner of the hit box,
    // which should be relative to the image-self.
    var initialHitBox = {
        offsetX: 7.5,
        offsetY: 80,
        width: 85,
        height: 63
    };
    CollidableObject.call(this, initialX, initialY, initialHitBox, 'enemy-bug', 'smb_bump');
};

Enemy.prototype = Object.create(CollidableObject.prototype);
Enemy.prototype.constructor = Enemy;

//
// Parameter: dt, a time delta between ticks
/**
 * @description Update the enemy's position, required method for game, {@link Engine} will
 *              call this method to update the object's location.
 * @param {number} dt is the systemn time differece between two times of update method call.
 * @return nothing.
 */
Enemy.prototype.update = function(dt) {
    // since this is enemy, we are not gong to let them cross the row, so we only update
    // the x location to move from left side to right.
    var newX = this.currentX + dt * this.speed;
    // defiend the right side boundary for this enemy.
    var limit = MAP_BLOCK_WIDTH * (MAP_COLS - 1);
    // use right side boundary to reset the x location of enemy object. So it will return
    // back to left side, onece it reach to right side.
    this.currentX = newX % limit;
    if (newX >= limit) {
        // in order to make the game unperdicatable, we will regenerate a speed to each
        // enemy object, when they are going to move back to left side.
        this.randomSpeed();
    }
};

/**
 * @description this method will simply regenerate the speed attribe for its own enemy object.
 *              the speed range is [50,130).
 * @return nothing.
 */
Enemy.prototype.randomSpeed = function() {
    this.speed = (Math.random() * this.randomUpper) + this.minSpeed;
};

/**
 * @description a render method which {@link engine.js} will be called to draw the
 *              object in canvas based on object's currentX and currentY;
 * @return nothing.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.currentX, this.currentY);
};

/**
 * @description Define a function class for charcter, it will inherited from {@link CollidableObject}.
 * @param {number} initialCol, the initial col of this character.
 * @param {number} initialRow, the initial row of this character.
 */
var Player = function(initialCol, initialRow) {
    // the moving speed of an character.
    this.speed = 250;
    // record the intial col and row for reset the player purpose.
    this.initialCol = initialCol;
    this.initialRow = initialRow;
    // where the charcter decide to be moved to. As we designed, charcter should only move in grid, so
    // we need the target col and row to indicate where are the charcter now, and where it is going to
    // be moved.
    this.targetCol = initialCol;
    this.targetRow = initialRow;
    this.previousCol = initialCol;
    this.previousRow = initialRow;

    this.collectedItemCount = {
        key: 0,
        blueGem: 0,
        greenGem: 0,
        orangeGem: 0
    };

    // we need to calculate the accurate x and y location based one its col and row.
    // To initialise the currentX and Y.
    var initialX = _convertColToX(this.initialCol);
    var initialY = _convertRowToY(this.initialRow);
    var initialHitBox = {
        offsetX: 22.5,
        offsetY: 90,
        width: 55,
        height: 50
    };
    CollidableObject.call(this, initialX, initialY, initialHitBox, 'char-boy', 'smb_mariodie');
};

Player.prototype = Object.create(CollidableObject.prototype);
Player.prototype.constructor = Player;

/**
 * @description this method will make sure the character is moving along to the direction that
 *              user would like to move to.
 * @param {number} dt is the system time difference between two times of update method called.
 * @return nothing.
 */
Player.prototype.update = function(dt) {
    // first convert the target col and row into correspond x and y location.
    var targetX = _convertColToX(this.targetCol);
    var targetY = _convertRowToY(this.targetRow);
    // update the current x and y to target x and y location with specific speed and time difference.
    if (this.previousCol !== this.targetCol) {
        this.currentX = _moveToTargetLoc(this.currentX, targetX, this.speed, dt);

        var leftDistance = _calculateDistance(this.currentX, targetX);
        var totalDistance = _calculateDistance(_convertColToX(this.previousCol), targetX);
        this.currentY = _calculateBouncingCoord((leftDistance / totalDistance), _convertRowToY(this.previousRow));
    }
    if (this.previousRow !== this.targetRow) {
        this.currentY = _moveToTargetLoc(this.currentY, targetY, this.speed, dt);
    }
};

/**
 * @description a render method which {@link engine.js} will be called to draw the
 *              object in canvas based on object's currentX and currentY;
 * @return nothing.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.currentX, this.currentY);
};

/**
 * @description a method is used to detect whether the object is still moveing or, it just reach
 *              its destination.
 * @return {boolean} false if both current x and y are equal with target x and y, return true otherwise.
 */
Player.prototype.isMoving = function() {
    return this.currentX !== _convertColToX(this.targetCol) || this.currentY !== _convertRowToY(this.targetRow);
};

/**
 * @description this method will handle user's key pressed input, and then update character's target
 *              colum and row, so that {@link engine} will call update method to make character move
 *              to target colum and row.
 * @param {string} pressedKeyCode is the human readable string to describe which key user pressed.
 * @return nothing.
 */
Player.prototype.handleInput = function(pressedKeyCode) {
    // check if the character still in moving state. if character is still moving, then do not need
    // to respond to user's new key pressed event.
    if (this.isMoving()) {
        return;
    }
    this.previousCol = this.targetCol;
    this.previousRow = this.targetRow;
    switch (pressedKeyCode) {
        case LEFT_KEY:
        case A_KEY:
            this.targetCol = _moveToLowerBoundary(this.targetCol, 0);
            break;
        case UP_KEY:
        case W_KEY:
            // limite the up boundary to row 1, is because the row 0 is water, and we do expect
            // character can be moved to that row.
            this.targetRow = _moveToLowerBoundary(this.targetRow, 1);
            break;
        case RIGHT_KEY:
        case D_KEY:
            this.targetCol = _moveUpperBoundary(this.targetCol, MAP_COLS);
            break;
        case DOWN_KEY:
        case S_KEY:
            this.targetRow = _moveUpperBoundary(this.targetRow, MAP_ROWS);
            break;
        default:
            // expect the
            break;
    }
};

/**
 * @description this method will be called when player's character is detected to be collided
 *              with enemy. Currently, we will reset character back to initial location.
 * @return nothing
 */
Player.prototype.killed = function() {
    this.soundEffect.play();
    this.resetLocation();
    this.clearScore();
};

Player.prototype.resetLocation = function() {
    //reset the target col and row to initial col and row.
    this.targetCol = this.initialCol;
    this.targetRow = this.initialRow;
    //reset the current x and y location, so this character will be drawn back to initial location.
    this.currentX = _convertColToX(this.targetCol);
    this.currentY = _convertRowToY(this.targetRow);

    this.previousCol = this.targetCol;
    this.previousRow = this.targetRow;
};

Player.prototype.clearScore = function() {
    this.collectedItemCount = {
        key: 0,
        blueGem: 0,
        greenGem: 0,
        orangeGem: 0
    };
};

Player.prototype.collectItem = function(item) {
    if (item.hasOwnProperty('name')) {
        switch (item.name) {
            case 'Key':
                this.collectedItemCount.key += 1;
                break;
            case 'Gem Blue':
                this.collectedItemCount.blueGem += 1;
                break;
            case 'Gem Green':
                this.collectedItemCount.greenGem += 1;
                break;
            case 'Gem Orange':
                this.collectedItemCount.orangeGem += 1;
                break;
            default:
                break;
        }
    }
};

Player.prototype.getTotalScore = function() {
    var totalScore = 0;

    for (var itemCount in this.collectedItemCount) {
        if (this.collectedItemCount.hasOwnProperty(itemCount)) {
            totalScore += this.collectedItemCount[itemCount] * ITEM_SCORE_MAP[itemCount];
        };
    }

    return totalScore;
};

/**
 * @description Define a function class for items, it will inherited from {@link CollidableObject}.
 * @param {number} initialCol initial colum of this item.
 * @param {number} initialRow initial row of this item.
 * @param {string} imgURI a path to a image to be drawn for this item.
 */
var Item = function(initialCol, initialRow, type, sound) {
    this.animationCycleTime = 0;
    // we need to calculate the accurate x and y location based one its col and row.
    // To initialise the currentX and Y.
    this.initialX = _convertColToX(initialCol);
    this.initialY = _convertRowToY(initialRow);
    var initialHitBox = {
        offsetX: 25,
        offsetY: 90,
        width: 50,
        height: 50
    };
    CollidableObject.call(this, this.initialX, this.initialY, initialHitBox, type, sound);
};

Item.prototype = Object.create(CollidableObject.prototype);
Item.prototype.constructor = Item;

/**
 * @description a render method which {@link engine.js} will be called to draw the
 *              object in canvas based on object's currentX and currentY;
 * @return nothing.
 */
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.currentX, this.currentY);
};

/**
 * @description this method will make sure the character is moving along to the direction that
 *              user would like to move to.
 * @param {number} dt is the system time difference between two times of update method called.
 * @return nothing.
 */
Item.prototype.update = function(dt) {
    this.animationCycleTime = _calculateAnimationCycleTime(dt, this.animationCycleTime);
    var ratio = this.animationCycleTime / ANIMATION_INTERVAL;
    this.currentY = _calculateBouncingCoord(ratio, this.initialY);
};

Item.prototype.refresh = function() {
    var newCol = Math.floor(Math.random() * MAP_COLS);
    this.currentX = _convertColToX(newCol);
};

/**
 * @description this method simply, calculate the target x for charcter based on
 *               its target colum number.
 * @return {number} the correspond X location based on the target colum.
 */
var _convertColToX = function(col) {
    return col * MAP_BLOCK_WIDTH;
};

/**
 * @description this method simply, calculate the target y for charcter based on
 *              its target row number. Remeber, we also need to substract the
 *              {@linkcode MAP_CHARACTER_OFFSET} to make sure the character to be
 *              drawn in the center of a block.
 * @return {number} the correspond Y location based on the target row.
 */
var _convertRowToY = function(row) {
    return row * MAP_BLOCK_HEIGHT - MAP_CHARACTER_OFFSET;
};

/**
 * @description thie should be private method to be called in {@link Player} class, so it will move the
 *              current x or y of {@link Player} towards to target x or y location. Where target x and y
 *              location should be converted from target col and row.
 * @param {number} currentLoc current x or y location which is going to be move towards to target x or y.
 * @param {number} targetLoc the target x or y location which user would like this character to move to.
 *                           it should be converted from target col or row, and should be discard when updated finished.
 * @param {number} speed the moving speed of the character, which will be used to move the character in canvas.
 * @param {number} dt is the system time difference between two times of update method called.
 */
var _moveToTargetLoc = function(currentLoc, targetLoc, speed, dt) {
    var movement = (dt * speed);
    if (Math.abs(targetLoc - currentLoc) >= movement) {
        if (targetLoc > currentLoc) {
            return currentLoc + movement;
        } else {
            return currentLoc - movement;
        }
    } else {
        return targetLoc;
    }
};

var _calculateDistance = function(start, end) {
    return Math.abs(start - end);
};

/**
 * @description This method will be used to act when user want to move character to top or left side
 *              of canvas. If the passed in number of col or row is at least 1 unit greater than limit,
 *              then substract 1 unit from the colum or row. and return back. Otherwise return the same.
 * @param {number} colOrRow the current col or row of grid block that character is staied in.
 * @param {number} lowerLimit the allowed moving colum or row number for this character.
 * @return {number} new colum or row number after consider user's input.
 */
var _moveToLowerBoundary = function(colOrRow, lowerLimit) {
    return colOrRow > lowerLimit ? colOrRow - 1 : colOrRow;
};

/**
 * @description This method will be used to act when user want to move character to right or bottom side
 *              of canvas. If the passed in number of col or row is at least 1 unit smaller than limit,
 *              then add 1 unit from the colum or row. and return back. Otherwise return the same.
 * @param {number} colOrRow the current col or row of grid block that character is staied in.
 * @param {number} lowerLimit the allowed moving colum or row number for this character.
 * @return {number} new colum or row number after consider user's input.
 */
var _moveUpperBoundary = function(colOrRow, upperColLimit) {
    return colOrRow < upperColLimit - 1 ? colOrRow + 1 : colOrRow;
};

var _calculateBouncingCoord = function(ratio, xOrY) {
    return xOrY - Math.sin(ratio * Math.PI) * BOUNCING_HEIGHT;
};

var _calculateAnimationCycleTime = function(dt, animationCycleTime) {
    return (animationCycleTime = (animationCycleTime + dt) % ANIMATION_INTERVAL);
};

var _randomStartCol = function(MAP_ROWS) {
    return Math.floor(Math.random() * MAP_ROWS);
};

var sound = function (src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = playSound(this.sound);
}

var playSound = function (sound) {
    return function() {
        sound.play();
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(2), new Enemy(3), new Enemy(4), new Enemy(2), new Enemy(3), new Enemy(4)];
var player = new Player(_randomStartCol(MAP_COLS), MAP_ROWS - 1);
var key = new Item(_randomStartCol(MAP_COLS), 1, 'Key', 'smb_1-up');
var items = [key, new Item(_randomStartCol(MAP_COLS), 2, 'Gem Blue', 'smb_coin'),
    new Item(_randomStartCol(MAP_COLS), 3, 'Gem Green', 'smb_coin'),
    new Item(_randomStartCol(MAP_COLS), 4, 'Gem Orange', 'smb_coin')
];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: LEFT_KEY,
        38: UP_KEY,
        39: RIGHT_KEY,
        40: DOWN_KEY,
        12: ENTER_KEY,
        32: SPACE_KEY,
        87: W_KEY,
        65: A_KEY,
        83: S_KEY,
        68: D_KEY,
    };
    player.handleInput(allowedKeys[e.keyCode]);
});