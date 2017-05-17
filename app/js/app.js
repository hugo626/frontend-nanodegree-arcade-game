var LEFT_KEY = 'left';
var RIGHT_KEY = 'right';
var UP_KEY = 'up';
var DOWN_KEY = 'down';
// Enemies our player must avoid
var Enemy = function(assignedRow) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.speed = Math.random() * 100;
    this.xLoc = 0;
    this.row = assignedRow;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var newX = this.xLoc + dt * this.speed;
    var limit = MAP_BLOCK_WIDTH * (NUMBER_COLS - 1);
    this.xLoc = newX % limit;
    if (newX >= limit) {
        this.randomSpeed();
    }
};

Enemy.prototype.randomSpeed = function() {
    this.speed = Math.random() * 100;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xLoc, this.row * MAP_BLOCK_HEIGHT - MAP_CHARACTER_OFFSET);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.col = 0;
    this.row = 6;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
    // so far do nothing;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.col * MAP_BLOCK_WIDTH, this.row * MAP_BLOCK_HEIGHT - MAP_CHARACTER_OFFSET);
}

Player.prototype.handleInput = function(pressedKeyCode) {
    var _calcLowerBoundary = function(colOrRow, lowerLimit) {
        return colOrRow > lowerLimit ? colOrRow - 1 : colOrRow;
    };
    var _calcUpperBoundary = function(colOrRow, upperLimit) {
        return colOrRow < upperLimit - 1 ? colOrRow + 1 : colOrRow;
    }
    switch (pressedKeyCode) {
        case LEFT_KEY:
            this.col = _calcLowerBoundary(this.col, 0);
            break;
        case UP_KEY:
            this.row = _calcLowerBoundary(this.row, 1);
            break;
        case RIGHT_KEY:
            this.col = _calcUpperBoundary(this.col, NUMBER_COLS);
            break;
        case DOWN_KEY:
            this.row = _calcUpperBoundary(this.row, NUMBER_ROWS);
            break;
        default:
            // expect the
            break;
    }
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