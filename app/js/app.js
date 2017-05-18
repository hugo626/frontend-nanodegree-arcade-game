var LEFT_KEY = 'left';
var RIGHT_KEY = 'right';
var UP_KEY = 'up';
var DOWN_KEY = 'down';
var MAP_CHARACTER_OFFSET = 30;
var MAP_BLOCK_WIDTH = 101;
var MAP_BLOCK_HEIGHT = 83;

var CollidableObject = function(initialX, initialY, initialHitBox) {
    this.currentX = initialX;
    this.currentY = initialY;
    this.hitBox = initialHitBox;
};

CollidableObject.prototype.getHitBox = function() {
    return {
        x: this.currentX + this.hitBox.offsetX,
        y: this.currentY + this.hitBox.offsetY,
        width: this.hitBox.width,
        height: this.hitBox.height
    };
};

CollidableObject.prototype.isCollided = function(targetHitbox) {
    return !(targetHitbox.x > (this.getHitBox().x + this.getHitBox().width) ||
        (targetHitbox.x + targetHitbox.width) < this.getHitBox().x ||
        targetHitbox.y > (this.getHitBox().y + this.getHitBox().height) ||
        (targetHitbox.y + targetHitbox.height) < this.getHitBox().y);
};

// Enemies our player must avoid
var Enemy = function(assignedRow) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.speed = 0;
    this.row = assignedRow;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.randomSpeed();

    var initialX = 0;
    var initialY = assignedRow * MAP_BLOCK_HEIGHT - MAP_CHARACTER_OFFSET;
    var initialHitBox = {
        offsetX: 7.5,
        offsetY: 80,
        width: 85,
        height: 63
    };
    CollidableObject.call(this, initialX, initialY, initialHitBox);
};

Enemy.prototype = Object.create(CollidableObject.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var newX = this.currentX + dt * this.speed;
    var limit = MAP_BLOCK_WIDTH * (NUMBER_COLS - 1);
    this.currentX = newX % limit;
    if (newX >= limit) {
        this.randomSpeed();
    }
};

Enemy.prototype.randomSpeed = function() {
    this.speed = (Math.random() * 50) + 50;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.currentX, this.currentY);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.speed = 200;
    this.targetCol = 0;
    this.targetRow = 6;
    this.sprite = 'images/char-boy.png';

    var initialX = this.calcTargetX();
    var initialY = this.calcTargetY();
    var initialHitBox = {
        offsetX: 22.5,
        offsetY: 90,
        width: 55,
        height: 50
    };
    CollidableObject.call(this, initialX, initialY, initialHitBox);
};

Player.prototype = Object.create(CollidableObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.calcTargetX = function() {
    return this.targetCol * MAP_BLOCK_WIDTH;
};

Player.prototype.calcTargetY = function() {
    return this.targetRow * MAP_BLOCK_HEIGHT - MAP_CHARACTER_OFFSET;
};

Player.prototype.update = function(dt) {
    var _moveToTargetLoc = function(currentLoc, targetLoc, speed) {
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

    var targetX = this.calcTargetX();
    var targetY = this.calcTargetY();
    this.currentX = _moveToTargetLoc(this.currentX, targetX, this.speed);
    this.currentY = _moveToTargetLoc(this.currentY, targetY, this.speed);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.currentX, this.currentY);
};

Player.prototype.isMoving = function() {
    return this.currentX !== this.calcTargetX() || this.currentY !== this.calcTargetY();
};

Player.prototype.handleInput = function(pressedKeyCode) {
    var _calcLowerBoundary = function(colOrRow, lowerColLimit) {
        return colOrRow > lowerColLimit ? colOrRow - 1 : colOrRow;
    };
    var _calcUpperBoundary = function(colOrRow, upperColLimit) {
        return colOrRow < upperColLimit - 1 ? colOrRow + 1 : colOrRow;
    };

    if (this.isMoving()) {
        return;
    }
    switch (pressedKeyCode) {
        case LEFT_KEY:
            this.targetCol = _calcLowerBoundary(this.targetCol, 0);
            break;
        case UP_KEY:
            this.targetRow = _calcLowerBoundary(this.targetRow, 1);
            break;
        case RIGHT_KEY:
            this.targetCol = _calcUpperBoundary(this.targetCol, NUMBER_COLS);
            break;
        case DOWN_KEY:
            this.targetRow = _calcUpperBoundary(this.targetRow, NUMBER_ROWS);
            break;
        default:
            // expect the
            break;
    }
};

Player.prototype.damaged = function() {
    this.targetCol = 0;
    this.targetRow = 6;
    this.currentX = this.calcTargetX();
    this.currentY = this.calcTargetY();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = (function() {
    return [new Enemy(2), new Enemy(3), new Enemy(4)];
})();
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: LEFT_KEY,
        38: UP_KEY,
        39: RIGHT_KEY,
        40: DOWN_KEY
    };
    player.handleInput(allowedKeys[e.keyCode]);
});