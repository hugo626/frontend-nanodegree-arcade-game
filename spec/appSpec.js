var NUMBER_COLS = 5;
var NUMBER_ROWS = 6;
var MAP_BLOCK_WIDTH = 101;
var MAP_BLOCK_HEIGHT = 83;
describe('In App.js', function() {
  it('should be able to create an Enemy object', function() {
    var enemy = new Enemy();
    expect(enemy).not.toBe(null);
    expect(enemy).not.toBe(undefined);
  });
});

describe('In App.js', function() {
  it('should be able to get the enemy\'s image', function() {
    var enemy = new Enemy();
    expect(enemy.sprite).toBe('images/enemy-bug.png');
  });
});

describe('In App.js', function() {
  it('should be able to get x and y of an enemy instance', function() {
    var enemy = new Enemy(6);
    expect(enemy.xLoc).not.toBe(null);
    expect(enemy.xLoc).not.toBe(undefined);
    expect(enemy.row).not.toBe(null);
    expect(enemy.row).not.toBe(undefined);
  });
});

describe('In App.js, an enemy instance', function() {
  it('should be able to update its x value ', function() {
    var enemy = new Enemy(0);
    enemy.update(10);
    expect(enemy.xLoc).not.toBe(0);
    expect(enemy.row).toBe(0);
  });
});

describe('In App.js', function() {
  it('should be able to create an Player object', function() {
    var player = new Player();
    expect(player).not.toBe(null);
    expect(player).not.toBe(undefined);
  });
});

describe('In App.js', function() {
  it('should be able to get the player\'s image', function() {
    var player = new Player();
    expect(player.sprite).not.toBe(null);
    expect(player.sprite).not.toBe(undefined);
  });
});

describe('In App.js', function() {
  it('should be able to get x and y of an player instance', function() {
    var player = new Player();
    expect(player.targetCol).not.toBe(null);
    expect(player.targetCol).not.toBe(undefined);
    expect(player.targetRow).not.toBe(null);
    expect(player.targetRow).not.toBe(undefined);
  });
});

describe('In App.js, an player instance', function() {
  it('should be able to have update method', function() {
    var player = new Player();
    expect(player.update).not.toBe(undefined);
  });
});

describe('In App.js, an player instance', function() {
  it('should be able to have render method', function() {
    var player = new Player();
    expect(player.render).not.toBe(undefined);
  });
});

describe('In App.js, an player instance', function() {
  it('should be able to move to up, down, left and right, if there is space', function() {
    var player = new Player();
    player.targetCol = 3;
    player.targetRow = 3;
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(3);
    player.handleInput(LEFT_KEY);
    expect(player.targetCol).toBe(2);
    expect(player.targetRow).toBe(3);
    player.handleInput(DOWN_KEY);
    expect(player.targetCol).toBe(2);
    expect(player.targetRow).toBe(4);
    player.handleInput(RIGHT_KEY);
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(4);
    player.handleInput(UP_KEY);
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(3);
  });
});

describe('In App.js, an player instance', function() {
  it('should not be able to move out of space', function() {
    var player = new Player();
    player.targetCol = 0;
    player.targetRow = 0;
    expect(player.targetCol).toBe(0);
    expect(player.targetRow).toBe(0);
    var numOfMove = 0;
    // test if the character would move out of up and left side of board.
    for (numOfMove = 0; numOfMove < 20; numOfMove++) {
      player.handleInput(LEFT_KEY);
      player.handleInput(UP_KEY);
    }
    expect(player.targetCol).toBe(0);
    expect(player.targetRow).toBe(0);

    // make sure the character could move.
    player.handleInput(RIGHT_KEY);
    player.handleInput(DOWN_KEY);
    expect(player.targetCol).toBe(1);
    expect(player.targetRow).toBe(1);

    // now move 10 times to the down and right side of board
    for (numOfMove = 0; numOfMove < 20; numOfMove++) {
      player.handleInput(DOWN_KEY);
      player.handleInput(RIGHT_KEY);
    }
    expect(player.targetCol).toBe(NUMBER_COLS - 1);
    expect(player.targetRow).toBe(NUMBER_ROWS - 1);
  });
});