/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var MAP_COLS = 7;
var MAP_ROWS = 6;
var MAP_BLOCK_WIDTH = 101;
var MAP_BLOCK_HEIGHT = 83;
var GAME_INFOR_AREA_X = MAP_BLOCK_WIDTH * MAP_COLS;
var GAME_INFOR_AREA_Y = 50;
var GAME_INFOR_AREA_WIDTH = 300;
var GAME_INFOR_AREA_HEIGHT = 535;
var GAME_INFOR_LINE_HEIGHT = 25;
var GAME_INFOR_LABEL_OFFSET_X = 190;
var BLUE_COLOR = '#0078A7';
var TEXT_ALIGN_RIGHT = 'right';
var TEXT_ALIGN_LEFT = 'left';
var TEXT_ALIGN_CENTER = 'center';
var COLLECTABLE_ITEM_MAP = {
    key: 'Key',
    greenGem: 'Green Gem',
    blueGem: 'Blue Gem',
    orangeGem: 'Orange Gem'
};

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        bestScore = 0,
        timer, lastTime;
    global.isGameOver = false;
    canvas.width = MAP_BLOCK_WIDTH * MAP_COLS + GAME_INFOR_AREA_WIDTH;
    canvas.height = MAP_BLOCK_WIDTH * MAP_ROWS;
    doc.body.appendChild(canvas);
    ctx.imageSmoothingEnabled = true;

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;
        if (global.isGameOver) {
            reset();
            drawGameOverOverlay();
            // isGameOver = false;
        }
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        setInterval(function() {
            if(!isGameOver) timer++;
        }, 1000);
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        items.forEach(function(item) {
            item.update(dt);
        });
        player.update(dt);
    }

    function checkCollisions() {
        var isCollidedWithEnemy = false;
        allEnemies.forEach(function(enemy) {

            if (enemy.isCollided(player.getHitBox())) {
                player.killed();
                global.isGameOver = true;
            }
        });

        items.forEach(function(item) {
            if (item.isCollided(player.getHitBox())) {
                item.refresh();
                player.collectItem(item);
                if (item.name === 'Key') {
                    player.resetLocation();
                }
            }
        });
    }


    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        // clear the rectanle from the canvas first for next around painting.
        ctx.clearRect(GAME_INFOR_AREA_X, GAME_INFOR_AREA_Y, GAME_INFOR_AREA_WIDTH, GAME_INFOR_AREA_HEIGHT);
        ctx.save();
        // draw the game information board's border.
        ctx.rect(GAME_INFOR_AREA_X, GAME_INFOR_AREA_Y, GAME_INFOR_AREA_WIDTH, GAME_INFOR_AREA_HEIGHT);
        ctx.stroke();
        // draw the Welcome message on top of information board.
        drawText('Welcome !', TEXT_ALIGN_CENTER, '30px Calibri,Arial', BLUE_COLOR,
            GAME_INFOR_AREA_WIDTH / 2 + GAME_INFOR_AREA_X,
            GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * 2);

        // draw the line seperater
        drawSeperater(GAME_INFOR_AREA_X,
            GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * 3,
            GAME_INFOR_AREA_X + GAME_INFOR_AREA_WIDTH,
            GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * 3);

        // draw the collected items information text to show the current status.
        var scoreTextFont = '24px Calibri,Arial',
            lineHeightCount = 6;
        for (var key in player.collectedItemCount) {
            if (player.collectedItemCount.hasOwnProperty(key)) {
                drawScore(COLLECTABLE_ITEM_MAP[key] + ' :  ', player.collectedItemCount[key],
                    scoreTextFont, BLUE_COLOR,
                    GAME_INFOR_AREA_X + GAME_INFOR_LABEL_OFFSET_X,
                    GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * lineHeightCount);
                lineHeightCount += 2;
            }
        }

        // draw the total score of this player.
        scoreTextFont = 'bold 24px Calibri,Arial';
        var currentScore = player.getTotalScore();
        drawScore('Total Score :  ', currentScore,
            scoreTextFont, BLUE_COLOR,
            GAME_INFOR_AREA_X + GAME_INFOR_LABEL_OFFSET_X,
            GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * lineHeightCount);

        if (bestScore < currentScore) {
            bestScore = currentScore;
        }
        // draw the best score of this game session.
        lineHeightCount += 2;
        drawScore('Best Score :  ', bestScore,
            scoreTextFont, 'gold',
            GAME_INFOR_AREA_X + GAME_INFOR_LABEL_OFFSET_X,
            GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * lineHeightCount);

        //draw the line seperater
        lineHeightCount += 2;
        drawSeperater(GAME_INFOR_AREA_X,
            GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * lineHeightCount,
            GAME_INFOR_AREA_X + GAME_INFOR_AREA_WIDTH,
            GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * lineHeightCount);

        // finally draw the timer at the bottom of the game information board.
        lineHeightCount += 2;
        drawText('Timer : ' + timer, TEXT_ALIGN_CENTER, '30px Calibri,Arial', BLUE_COLOR,
            GAME_INFOR_AREA_WIDTH / 2 + GAME_INFOR_AREA_X,
            GAME_INFOR_AREA_Y + GAME_INFOR_LINE_HEIGHT * lineHeightCount);


        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png', // Top row is water
                'images/grass-block.png', // Row 1 of 1 of grass, where should have key.
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
            ],
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < MAP_ROWS; row++) {
            for (col = 0; col < MAP_COLS; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * MAP_BLOCK_WIDTH, row * MAP_BLOCK_HEIGHT);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        items.forEach(function(item) {
            item.render();
        });
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        timer = 0;
        drawGameOverOverlay();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Key.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.canvas = canvas;

    /**
     * @description draw a line of on the specific location.
     * @param {number} startX start of X coordinate
     * @param {number} startY start of Y coordinate
     * @param {number} endX   end of X coordinate
     * @param {number} endY   end of Y coordinate
     * @param {string} color  define the line's color.
     */
    function drawSeperater(startX, startY, endX, endY, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * @description draw string on the specific location.
     *
     * @param {string} textToDraw a string that is going to be drawn on canvas.
     * @param {string} textAlign a string that is defined the test align style.
     * @param {string} fontFamily a string that is defined the font family.
     * @param {string} color a string that defined the cole of text.
     * @param {number} startX start of X coordinate to draw test
     * @param {number} startY start of Y coordinate to draw test
     */
    function drawText(textToDraw, textAlign, fontFamily, color, startX, startY) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.textAlign = textAlign;
        ctx.font = fontFamily;
        ctx.fillText(textToDraw, startX, startY);
        ctx.restore();
    }

    /**
     * @description a wrapper function to call {@link drawText} twice to draw the score
     *              with label.
     *
     * @param {string} textToDraw a string that is going to be drawn on canvas.
     * @param {number} score a score that is going to be drawn on canvas after the label painted.
     * @param {string} fontFamily a string that is defined the font family.
     * @param {string} color a string that defined the cole of text.
     * @param {number} startX start of X coordinate to draw test
     * @param {number} startY start of Y coordinate to draw test
     */
    function drawScore(textToDraw, score, fontFamily, color, startX, startY) {
        drawText(textToDraw, TEXT_ALIGN_RIGHT, fontFamily, color,
            startX, startY);
        drawText(score, TEXT_ALIGN_LEFT, fontFamily, color,
            startX, startY);
    }

    /**
     * @description draw the gray out overlay over the gameboard, it also paint the 'Game Over'
     *              and other notification on the overlay.
     */
    function drawGameOverOverlay() {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0,0.5)";
        ctx.rect(0, GAME_INFOR_AREA_Y, MAP_BLOCK_WIDTH * MAP_COLS, GAME_INFOR_AREA_HEIGHT);
        ctx.fill();
        drawText("Game Over", TEXT_ALIGN_CENTER, 'bold 40px Calibri,Arial', 'red',
            GAME_INFOR_AREA_X / 2, GAME_INFOR_AREA_HEIGHT / 2);
        drawText("Press SPACE key to continue...", TEXT_ALIGN_CENTER, '36px Calibri,Arial', 'red',
            GAME_INFOR_AREA_X / 2, GAME_INFOR_AREA_HEIGHT / 2 + GAME_INFOR_LINE_HEIGHT*2);
        ctx.restore();
    }

})(this);