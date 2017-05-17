var NUMBER_COLS = 5;
var NUMBER_ROWS = 6;
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
    var enemy = new Enemy();
    expect(enemy.x).not.toBe(null);
    expect(enemy.x).not.toBe(undefined);
    expect(enemy.y).not.toBe(null);
    expect(enemy.y).not.toBe(undefined);
  });
});

describe('In App.js, an enemy instance', function() {
  it('should be able to update its x value ', function() {
    var enemy = new Enemy();
    enemy.update(10);
    expect(enemy.x).toBe(10);
    expect(enemy.y).toBe(0);
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
    expect(player.col).not.toBe(null);
    expect(player.col).not.toBe(undefined);
    expect(player.row).not.toBe(null);
    expect(player.row).not.toBe(undefined);
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
    player.col = 3;
    player.row = 3;
    expect(player.col).toBe(3);
    expect(player.row).toBe(3);
    player.handleInput(LEFT_KEY);
    expect(player.col).toBe(2);
    expect(player.row).toBe(3);
    player.handleInput(DOWN_KEY);
    expect(player.col).toBe(2);
    expect(player.row).toBe(4);
    player.handleInput(RIGHT_KEY);
    expect(player.col).toBe(3);
    expect(player.row).toBe(4);
    player.handleInput(UP_KEY);
    expect(player.col).toBe(3);
    expect(player.row).toBe(3);
  });
});

describe('In App.js, an player instance', function() {
  it('should not be able to move out of space', function() {
    var player = new Player();
    player.col = 0;
    player.row = 0;
    expect(player.col).toBe(0);
    expect(player.row).toBe(0);

    // test if the character would move out of up and left side of board.
    for (var numOfMove = 0; numOfMove < 20; numOfMove++) {
      player.handleInput(LEFT_KEY);
      player.handleInput(UP_KEY);
    }
    expect(player.col).toBe(0);
    expect(player.row).toBe(0);

    // make sure the character could move.
    player.handleInput(RIGHT_KEY);
    player.handleInput(DOWN_KEY);
    expect(player.col).toBe(1);
    expect(player.row).toBe(1);

    // now move 10 times to the down and right side of board
    for (var numOfMove = 0; numOfMove < 20; numOfMove++) {
      player.handleInput(DOWN_KEY);
      player.handleInput(RIGHT_KEY);
    }
    expect(player.col).toBe(NUMBER_COLS - 1);
    expect(player.row).toBe(NUMBER_ROWS - 1);
  });
});