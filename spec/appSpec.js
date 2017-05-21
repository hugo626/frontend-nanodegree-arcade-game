var NUMBER_COLS = 7;
var NUMBER_ROWS = 6;
var MAP_BLOCK_WIDTH = 101;
var MAP_BLOCK_HEIGHT = 83;
var isGameOver = false;

var TEST_CHARACTER_MOVEING_TIME = 1;

var itemFileName = 'test';
var soundFileName = 'soundFile';

describe('In App.js', function() {
  it('should be able to create a CollidableObject object.', function() {
    var collidableObject = new CollidableObject(1, 1, {}, itemFileName, soundFileName);
    expect(collidableObject).not.toBeNull();
    expect(collidableObject).not.toBeUndefined();
  });
});

describe('In App.js, a CollidableObject instance', function() {
  it('should be able to get its hit box.', function() {
    var collidableObject = new CollidableObject(1, 2, {
        offsetX: 3,
        offsetY: 4,
        width: 5,
        height: 6
      },
      itemFileName,
      soundFileName);
    expect(collidableObject.getHitBox()).not.toBeNull();
    expect(collidableObject.getHitBox()).not.toBeUndefined();
    expect(collidableObject.getHitBox().x).toBe(1 + 3);
    expect(collidableObject.getHitBox().y).toBe(2 + 4);
    expect(collidableObject.getHitBox().width).toBe(5);
    expect(collidableObject.getHitBox().height).toBe(6);
  });

  it('should be able to check collision with other hit box.', function() {
    var collidableObject = new CollidableObject(1, 2, {
        offsetX: 3,
        offsetY: 4,
        width: 5,
        height: 6
      },
      itemFileName,
      soundFileName);
    expect(collidableObject.isCollided({
      x: 4,
      y: 6,
      width: 5,
      height: 6
    })).toBe(true);
    expect(collidableObject.isCollided({
      x: 10,
      y: 6,
      width: 5,
      height: 6
    })).toBe(false);
  });
});

describe('In App.js', function() {
  it('should be able to create an Enemy object.', function() {
    var enemy = new Enemy(6);
    expect(enemy).not.toBeNull();
    expect(enemy).not.toBeUndefined();
  });
});

describe('In App.js, an enemy instance', function() {
  it('should be able to get its image.', function() {
    var enemy = new Enemy(6);
    expect(enemy.sprite).toBe('images/enemy-bug.png');
  });

  it('should be able to get its x and y.', function() {
    var enemy = new Enemy(6);
    expect(enemy.currentX).not.toBeNull();
    expect(enemy.currentY).not.toBeUndefined();
    expect(enemy.row).not.toBeNull();
    expect(enemy.row).not.toBeUndefined();
  });

  it('should be able to update its x value.', function() {
    var enemy = new Enemy(1);
    enemy.update(10);
    expect(enemy.currentX).not.toBe(1);
    expect(enemy.row).toBe(1);
    expect(enemy.currentY).toBe(_convertRowToY(enemy.row));
  });
});

describe('In App.js', function() {
  it('should be able to create an Player object.', function() {
    var player = new Player(1, 2);
    expect(player).not.toBeNull();
    expect(player).not.toBeUndefined();
  });
});

describe('In App.js, a player isntance', function() {
  it('should be able to get its image.', function() {
    var player = new Player(1, 2);
    expect(player.sprite).not.toBeNull();
    expect(player.sprite).not.toBeUndefined();
  });

  it('should be able to get its target Col and Row.', function() {
    var player = new Player(5, 6);
    expect(player.targetCol).not.toBeNull();
    expect(player.targetCol).not.toBeUndefined();
    expect(player.targetRow).not.toBeNull();
    expect(player.targetRow).not.toBeUndefined();
  });

  it('should be able to have update method', function() {
    var player = new Player();
    expect(player.update).not.toBeUndefined();
  });

  it('should be able to have render method', function() {
    var player = new Player();
    expect(player.render).not.toBeUndefined();
  });

  it('should be moved in animation smoothly.', function() {
    var player = new Player(3, 3);
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(3);
    player.handleInput(LEFT_KEY);
    expect(player.isMoving()).toBe(true);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    expect(player.isMoving()).toBe(false);
    player.handleInput(DOWN_KEY);
    expect(player.isMoving()).toBe(true);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    expect(player.isMoving()).toBe(false);
    player.handleInput(RIGHT_KEY);
    expect(player.isMoving()).toBe(true);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    expect(player.isMoving()).toBe(false);
    player.handleInput(UP_KEY);
    expect(player.isMoving()).toBe(true);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    expect(player.isMoving()).toBe(false);
  });

  it('should be able to move to up, down, left and right, if there is space', function() {
    var player = new Player(3, 3);
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(3);
    player.handleInput(LEFT_KEY);
    expect(player.targetCol).toBe(2);
    expect(player.targetRow).toBe(3);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    player.handleInput(DOWN_KEY);
    expect(player.targetCol).toBe(2);
    expect(player.targetRow).toBe(4);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    player.handleInput(RIGHT_KEY);
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(4);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    player.handleInput(UP_KEY);
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(3);
  });

  it('should not be able to move out of space', function() {
    var player = new Player(3, 4);
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(4);
    var numOfMove = 0;
    // test if the character would move out of up and left side of board.
    for (numOfMove = 0; numOfMove < 20; numOfMove++) {
      player.handleInput(LEFT_KEY);
      player.update(TEST_CHARACTER_MOVEING_TIME);
      player.handleInput(UP_KEY);
      player.update(TEST_CHARACTER_MOVEING_TIME);
    }
    expect(player.targetCol).toBe(0);
    expect(player.targetRow).toBe(1);

    // make sure the character could move.
    player.handleInput(RIGHT_KEY);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    player.handleInput(DOWN_KEY);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    expect(player.targetCol).toBe(1);
    expect(player.targetRow).toBe(2);

    // now move 10 times to the down and right side of board
    for (numOfMove = 0; numOfMove < 20; numOfMove++) {
      player.handleInput(DOWN_KEY);
      player.update(TEST_CHARACTER_MOVEING_TIME);
      player.handleInput(RIGHT_KEY);
      player.update(TEST_CHARACTER_MOVEING_TIME);
    }
    expect(player.targetCol).toBe(NUMBER_COLS - 1);
    expect(player.targetRow).toBe(NUMBER_ROWS - 1);
  });

  it('should be able to have killed method', function() {
    var player = new Player(3, 4);
    expect(player.killed).not.toBeNull();
    expect(player.killed).not.toBeUndefined();
  });

  it('should be able to collected items', function() {
    var player = new Player(5, 4);
    player.collectItem({
      name: 'Key'
    });
    player.collectItem({
      name: 'Gem Blue'
    });
    player.collectItem({
      name: 'Gem Green'
    });
    player.collectItem({
      name: 'Gem Orange'
    });
    expect(player.collectedItemCount.key).toBe(1);
    expect(player.collectedItemCount.blueGem).toBe(1);
    expect(player.collectedItemCount.greenGem).toBe(1);
    expect(player.collectedItemCount.orangeGem).toBe(1);
  });

  it('should be able to be killed', function() {
    var player = new Player(5, 4);
    player.handleInput(LEFT_KEY);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    player.handleInput(DOWN_KEY);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    player.handleInput(LEFT_KEY);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    player.handleInput(DOWN_KEY);
    player.update(TEST_CHARACTER_MOVEING_TIME);
    player.collectItem({
      name: 'Key'
    });
    player.collectItem({
      name: 'Gem Blue'
    });
    expect(player.collectedItemCount.key).toBe(1);
    expect(player.collectedItemCount.blueGem).toBe(1);
    expect(player.collectedItemCount.greenGem).toBe(0);
    expect(player.collectedItemCount.orangeGem).toBe(0);
    expect(player.targetCol).toBe(3);
    expect(player.targetRow).toBe(5);
    player.killed();
    expect(player.targetCol).toBe(5);
    expect(player.targetRow).toBe(4);
    expect(player.collectedItemCount.key).toBe(0);
    expect(player.collectedItemCount.blueGem).toBe(0);
    expect(player.collectedItemCount.greenGem).toBe(0);
    expect(player.collectedItemCount.orangeGem).toBe(0);
  });

  it('should be able to collected items', function() {
    var player = new Player(5, 4);
    player.collectItem({
      name: 'Key'
    });
    player.collectItem({
      name: 'Gem Blue'
    });
    player.collectItem({
      name: 'Gem Green'
    });
    player.collectItem({
      name: 'Gem Orange'
    });
    expect(player.collectedItemCount.key).toBe(1);
    expect(player.collectedItemCount.blueGem).toBe(1);
    expect(player.collectedItemCount.greenGem).toBe(1);
    expect(player.collectedItemCount.orangeGem).toBe(1);
  });
});

describe('In App.js', function() {
  it('should be able to create an Item object.', function() {
    var item = new Item(1, 2, itemFileName, soundFileName);
    expect(item).not.toBeNull();
    expect(item).not.toBeUndefined();
  });
});

describe('In App.js, an item instance', function() {
  it('should be able to refresh to another location', function() {
    var item = new Item(1, 2, itemFileName, soundFileName);
    expect(item.currentX).toBe(_convertColToX(1));
    item.refresh();
    expect(item.currentX).not.toBe(_convertColToX(1));
    expect(item.currentY).toBe(_convertRowToY(2));
  });
});

describe('In App.js', function() {
  it('should be able to create an Sound object.', function() {
    var sound = new Sound('app/sounds/smb_1-up.wav');
    expect(sound).not.toBeNull();
    expect(sound).not.toBeUndefined();
  });
});

describe('In App.js, a Sound instance', function() {
  it('should be able to have play method.', function() {
    var sound = new Sound('app/sounds/smb_1-up.wav');
    expect(sound.play).not.toBeNull();
  });
});