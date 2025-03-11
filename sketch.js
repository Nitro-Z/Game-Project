
var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isPlummeting;
var isFalling;

var collectables;

var trees_x;
var treePos_y;

var mountain;
var cloud;

var cameraPosX;

var game_score;

var flagpole;

var lives;

var enemies;

var platforms;

var jumpSound;

var jumpHeight;
var gravity;
var isJumping;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


//////Set up code//////
function setup()
{
    createCanvas(4096, 576);
    floorPos_y = height * 3/4;
    game_score = 0;
    lives = 3;
    startGame();
}
///Start Game///
function startGame()
{
    gameChar_x = -300;
    gameChar_y = floorPos_y;

    cameraPosX = 0;
    isLeft = false;
    isRight = false;
    isPlummeting = false;
    isFalling = false;

    jumpHeight = 0;
    gravity = 0.6;
    isJumping = false;


    big_mountains = 
    [
        {x_pos: -200, y_pos: 432},
        {x_pos: 600, y_pos: 432},	
        {x_pos: 1400, y_pos: 432},
    ]
    small_mountains=
    [
        {x_pos: -50, y_pos: 432},
        {x_pos: 750, y_pos: 432},	
        {x_pos: 1550, y_pos: 432},
    ]

    trees_x = [270, 550, 900, 1200];
    treePos_y = floorPos_y - 150;

    collectables =
    [
        {x_pos: 150, y_pos: 200, isFound: false},
        {x_pos: 430, y_pos: 200, isFound: false},
        {x_pos: 770, y_pos: 200, isFound: false},
        {x_pos: 1070, y_pos: 200, isFound: false},
        {x_pos: 1370, y_pos: 200, isFound: false},
    ]

    canyons = 
    [
        {x_pos: 80, y_pos: height * 3/4, width: 150},
        {x_pos: 350, y_pos: height * 3/4, width: 150},
        {x_pos: 700, y_pos: height * 3/4, width: 150},
        {x_pos: 1000, y_pos: height * 3/4, width: 150},
        {x_pos: 1300, y_pos: height * 3/4, width: 150}
    ];

    //platforms
    platforms = [];

    platforms.push(createPlatforms(100, floorPos_y - 100, 100));
    platforms.push(createPlatforms(380, floorPos_y -100, 100));
    platforms.push(createPlatforms(700, floorPos_y -100, 150));
    platforms.push(createPlatforms(1020, floorPos_y -100, 100));
    platforms.push(createPlatforms(1330, floorPos_y -100, 100));


    cloud = 
    [
        {x_pos: 200, y_pos: 100},
        {x_pos: 500, y_pos: 80},
        {x_pos: 800, y_pos: 130}
    ];

    flagpole = {isReached: false, x_pos: 1800};

    enemies = [];
    enemies.push(new Enemy(-40, floorPos_y - 10, 100));
    enemies.push(new Enemy(560, floorPos_y - 10, 100));
    enemies.push(new Enemy(1470, floorPos_y - 10, 100));
    
}

function drawLives() {
    for (var i = 0; i < lives; i++) 
    {
        // Draw heart
        fill(255, 0, 0);
        noStroke();
        // Heart shape
        beginShape();
        vertex(140 + i * 50, 25); // Starting point
        bezierVertex(140 + i * 50, 15, 120 + i * 50, 15, 120 + i * 50, 25); // Left top curve
        bezierVertex(120 + i * 50, 35, 140 + i * 50, 45, 140 + i * 50, 50); // Left bottom curve
        bezierVertex(140 + i * 50, 45, 160 + i * 50, 35, 160 + i * 50, 25); // Right top curve
        bezierVertex(160 + i * 50, 15, 140 + i * 50, 15, 140 + i * 50, 25); // Right bottom curve
        endShape(CLOSE);
    }
}

///////////DRAWING CODE//////////
function draw()
{
    //fill the sky blue
    background(100,155,255); 
    //draw some green ground
    noStroke();
    fill(0,155,0);
    rect(0, floorPos_y, width, height - floorPos_y); 

    //start scroll effect - push and translate
    push();
    translate(-cameraPosX, 0);

    //a mountain 
    drawBig_Mountains();
    drawSmall_Mountains();

    //draw trees
    drawTree();

    //drawing platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }

    //Replace single canyon calls with a loop
    for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
        
    //Replace the single collectable calls with a loop
    for (var i = 0; i < collectables.length; i++)
    {
        drawCollectable(collectables[i]);
        checkCollectable(collectables[i]);
    }

    //a cloud in the sky
    drawClouds();

    // Handle movement
    if(!isPlummeting)
    {
        // Normal movement controls
        if(isLeft == true)
        {
            gameChar_x -= 5;
        }

        if(isRight == true)
        {
            gameChar_x += 5;
        }

        // Handle jumping and falling
        if (isJumping) 
        {
            gameChar_y += jumpHeight; // Apply jump force
            jumpHeight += gravity; // Apply gravity
            
            // Check if we've landed on ground or platform
            if (gameChar_y >= floorPos_y) 
            {
                gameChar_y = floorPos_y;
                isJumping = false;
                isFalling = false;
            }
            else 
            {
                // Check for platform landing
                let onPlatform = false;
                for(var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_x, gameChar_y))
                    {
                        gameChar_y = platforms[i].y;
                        isJumping = false;
                        isFalling = false;
                        onPlatform = true;
                        break;
                    }
                }
                
                if (!onPlatform) {
                    isFalling = true;
                }
            }
        }
        else if (gameChar_y < floorPos_y) 
        {
            // We're in the air but not jumping
            let onPlatform = false;
            
            // Check if we're on a platform
            for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkContact(gameChar_x, gameChar_y))
                {
                    gameChar_y = platforms[i].y;
                    isFalling = false;
                    onPlatform = true;
                    break;
                }
            }
            
            // If not on a platform, fall down
            if (!onPlatform) {
                gameChar_y += 5; // Apply gravity
                isFalling = true;
            }
        }
        else {
            // We're on the ground
            isFalling = false;
        }
    }
    else
    {
        // When plummeting into canyon
        gameChar_y += 5;
        // Disable left/right movement while falling
        isLeft = false;
        isRight = false;
    }

    //CheckFlagpole
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }

    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();

        var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);

        if(isContact)
        {
            lives -= 1;
            if(lives > 0)
            {
                startGame();
                break;
            }
        }
        if(lives < 1)
        {
            lives = 0;
            push();
            textSize(100);
            fill(255,69,0);
            text("Game Over!", 400, 300);
            pop();
        }
    }

    //draw the game character//
    //the game character
    stroke(100);
    if(isLeft && isFalling)
    {
        // add your jumping-left code
        fill(200,150,150);
        ellipse(gameChar_x, gameChar_y - 58, 35); //head
        fill(200, 150 ,150);
        rect(gameChar_x - 3, gameChar_y - 19, -22, 9); //legs
        rect(gameChar_x + 3, gameChar_y - 15, 9.5, 17);
        fill(255,0,0);
        rect(gameChar_x - 12.5, gameChar_y - 45, 25, 30); //body
        fill(200, 150, 150);
        rect(gameChar_x + 3, gameChar_y - 30, 9.5, 10); //hands
        rect(gameChar_x - 12.5, gameChar_y - 40, -12, 10);
    }
    else if(isRight && isFalling)
    {
        // add your jumping-right code
        fill(200,150,150);
        ellipse(gameChar_x, gameChar_y - 58, 35); //head
        fill(200, 150 ,150);
        rect(gameChar_x - 13, gameChar_y - 18, 18, 9); //left leg
        rect(gameChar_x + 3, gameChar_y - 20.5, 22.5, 9.5); //right leg
        fill(255,0,0);
        rect(gameChar_x - 12.5, gameChar_y - 45, 25, 30); //body
        fill(200, 150, 150);
        rect(gameChar_x + 12.5, gameChar_y - 40, 13.5, 9.5); // right hand
        rect(gameChar_x - 3, gameChar_y - 30, -9.5, 10); // left hand
    }
    else if(isLeft)
    {
        // add your walking left code
        fill(200,150,150);
        ellipse(gameChar_x, gameChar_y - 58, 35); //head
        fill(200, 150 ,150);
        rect(gameChar_x - 3, gameChar_y - 19, -22, 9); //legs
        rect(gameChar_x + 3, gameChar_y - 15, 9.5, 17);
        fill(255,0,0);
        rect(gameChar_x - 12.5, gameChar_y - 45, 25, 30); //body
        fill(200, 150, 150);
        rect(gameChar_x + 3, gameChar_y - 30, 9.5, 10); //hands
        rect(gameChar_x - 12.5, gameChar_y - 40, -12, 10);
    }
    else if(isRight)
    {
        // add your walking right code
        fill(200,150,150);
        ellipse(gameChar_x, gameChar_y - 58, 35); //head
        fill(200, 150 ,150);
        rect(gameChar_x - 2, gameChar_y - 15, -10.5, 17); //left leg
        rect(gameChar_x + 3, gameChar_y - 20.5, 22.5, 9.5); //right leg
        fill(255,0,0);
        rect(gameChar_x - 12.5, gameChar_y - 45, 25, 30); //body
        fill(200, 150, 150);
        rect(gameChar_x + 12.5, gameChar_y - 40, 13.5, 9.5); // right hand
        rect(gameChar_x - 3, gameChar_y - 30, -9.5, 10); // left hand
    }
    else if(isFalling || isPlummeting)
    {
        // add your jumping facing forwards code
        fill(200,150,150);
        ellipse(gameChar_x, gameChar_y - 58, 35); //head
        fill(255,0,0);
        rect(gameChar_x - 12.5, gameChar_y - 45, 25, 30); //body
        fill(200, 150, 150);
        rect(gameChar_x - 5, gameChar_y - 15, -15, 10); //legs
        rect(gameChar_x + 5, gameChar_y - 15, 15, 10);
        fill(200,150,150);
        rect(gameChar_x - 24, gameChar_y - 40, 12, 10); //hands
        rect(gameChar_x + 12, gameChar_y - 40, 12, 10);
    }
    else
    {
        // add your standing front facing code
        fill(200,150,150);
        ellipse(gameChar_x, gameChar_y-50, 35); //head
        fill(255,0,0);
        rect(gameChar_x - 13, gameChar_y-35, 26, 30); //body
        fill(200, 150, 150);
        rect(gameChar_x - 15, gameChar_y-5, 10, 10); //legs
        rect(gameChar_x + 5, gameChar_y-5, 10, 10);
    }

    //Display the scoreboard
    //game score
    fill(255);
    noStroke();
    textSize(20);
    text("Score: " + game_score, 20, 20, 200, 200);

    //lives count
    fill(255);
    noStroke();
    textSize(20);
    text("Lives: " + lives, 20, 50, 200, 200);

    //checkPlayerDie
    checkPlayerDie();

    //Lives count
    drawLives();

    //flagpole draw
    renderFlagpole();

    //End scroll effect
    pop();

    //Update camera position to follow character
    cameraPosX = gameChar_x - width/2;
}

////////////////////INTERACTION CODE/////////////////////
    
    //Put conditional statements to move the game character below here

function keyPressed()
{
    // if statements to control the animation of the character when
    // keys are pressed.

    if(lives < 1 || flagpole.isReached)
    {
        return;
    }

    //open up the console to see how these work
    console.log("keyPressed: " + key);
    console.log("keyPressed: " + keyCode);
    if(keyCode == 37)
    {
        isLeft = true;
    }
    else if(keyCode == 39)
    {
        isRight = true;
    }
    else if(keyCode == 40)
    {
        isPlummeting = true;
    }
    else if (keyCode == 87 || keyCode == 38) // 'W' or Up Arrow for Jump
    {
        // Check if on ground or platform
        if (!isJumping && !isFalling && 
            (gameChar_y == floorPos_y || checkPlatformContact()))
        {
            isJumping = true;
            jumpHeight = -12; // Negative value for upward movement
            jumpSound.play();
        }
    }
}

function keyReleased()
{
    // if statements to control the animation of the character when
    // keys are released.

    console.log("keyReleased: " + key);
    console.log("keyReleased: " + keyCode);
    if(keyCode == 37)
    {
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        isRight = false;
    }
    else if(keyCode == 40)
    {
        isPlummeting = false;
    }
}

// Helper function to check if character is on any platform
function checkPlatformContact() {
    for(var i = 0; i < platforms.length; i++) {
        if(platforms[i].checkContact(gameChar_x, gameChar_y)) {
            return true;
        }
    }
    return false;
}

/////////////////REFACTOR CODE/////////////////////

function drawBig_Mountains()
{
    noStroke();
    fill(160, 82, 45);
    for (var i = 0; i < big_mountains.length; i++)
    {
        triangle(big_mountains[i].x_pos + 50, big_mountains[i].y_pos - 300, 
            big_mountains[i].x_pos - 150, big_mountains[i].y_pos, 
            big_mountains[i].x_pos + 250, big_mountains[i].y_pos);
    }

}

function drawSmall_Mountains()
{
    noStroke();
    fill(160, 82, 45);
    for (var i = 0; i < small_mountains.length; i++)
    {
        triangle(small_mountains[i].x_pos + 50, small_mountains[i].y_pos - 200, 
            small_mountains[i].x_pos - 100, small_mountains[i].y_pos, 
            small_mountains[i].x_pos + 200, small_mountains[i].y_pos);
    }

}

function drawClouds()
{
    fill(255);
    noStroke();
    for (var i = 0; i < cloud.length; i++) 
    {
        ellipse(cloud[i].x_pos + 85, cloud[i].y_pos, 65, 55);
        ellipse(cloud[i].x_pos + 15, cloud[i].y_pos, 65, 55);
        ellipse(cloud[i].x_pos + 50, cloud[i].y_pos, 75, 75);		
    }
}

function drawTree()
{
    for (var i = 0; i < trees_x.length; i++)
    {
        //console.log("trees loop " + i);
        //a tree
        fill(120, 100, 40);
        rect(trees_x[i], treePos_y, 60, 150);
            
        //branches
        fill(0, 155, 0);
        triangle(trees_x[i] - 50, treePos_y + 50, trees_x[i] + 30, treePos_y - 50, trees_x[i] + 110, treePos_y + 50);
        triangle(trees_x[i] - 50, treePos_y, trees_x[i] + 30, treePos_y - 100, trees_x[i] + 110, treePos_y);
    }
}

function drawCollectable(t_collectable)
{
    if(t_collectable.isFound == false)
    {
        stroke(255,255,0);
        strokeWeight(1);
        fill(255, 215, 0);
        quad(
            t_collectable.x_pos, t_collectable.y_pos - 35, // Top point
            t_collectable.x_pos - 25, t_collectable.y_pos, // Left point
            t_collectable.x_pos, t_collectable.y_pos + 35, // Bottom point
            t_collectable.x_pos + 25, t_collectable.y_pos  // Right point
        );
    }
}

function checkCollectable(t_collectable)
{
    if(t_collectable.isFound == false && dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 90)
        {
            t_collectable.isFound = true;
            game_score += 1;
        }

}

function drawCanyon(t_canyon)
{
    noStroke();
    fill(80);
    rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, t_canyon.width);
}

function checkCanyon(t_canyon)
{
    //Check if character is over the canyon
    if (gameChar_x > t_canyon.x_pos && 
        gameChar_x < t_canyon.x_pos + t_canyon.width && 
        gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
}

function renderFlagpole()
{
    push();

    //pole
    stroke(180);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    noStroke();

    //flag
    fill(255, 0, 255);
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }

    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_x - flagpole.x_pos);
    if(d < 15)
    {
        flagpole.isReached = true;
    }
    if(flagpole.isReached)
    {
        textSize(100);
        textAlign(CENTER);
        fill(255);
        text("Level Complete!", flagpole.x_pos, 120);
        noLoop();
        return;
    }

}

function checkPlayerDie()
{
    if(gameChar_y > height)
        {
            lives -= 1;
            if (lives > 0)
            {
                startGame(); //restart the game but keep the score
            }
            else if (lives < 1)
            {
                lives = 0;
                push();
                textSize(100);
                fill(255,69,0);
                text("Game Over!", 400, 300);
                pop();
            }
        }
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(255, 0, 255);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y)
        {
            // Check if character is within platform's x-range
            if (gc_x > this.x && gc_x < this.x + this.length)
            {
                // Check if character is at or slightly above platform
                var d = this.y - gc_y;
                // Character is slightly above platform or on it (feet touching)
                if (d >= -2 && d <= 5)
                {
                    return true;
                }
            }
            return false;
        }
    };

    return p;
}
function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;

    this.currentX = x;
    this.inc = 0.7;

    this.update = function()
    {
        this.currentX += this.inc;

        if(this.currentX >= this.x + this.range)
        {
            this.inc = -0.7;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 0.7;
        }
    }

    this.draw = function()
    {
        this.update();
        fill(220, 50, 50);
        ellipse(this.currentX, this.y - 17, 50, 50); //body

        //eyes
        fill(255);
        ellipse(this.currentX - 10, this.y - 22, 12, 12);
        ellipse(this.currentX + 10, this.y - 22, 12, 12);
        
        //pupils
        fill(0);
        ellipse(this.currentX - 10, this.y - 22, 5, 5);
        ellipse(this.currentX + 10, this.y - 22, 5, 5);
        
        //mouth
        stroke(0);
        strokeWeight(2);
        line(this.currentX, this.y - 12, this.currentX + 10, this.y - 5);
        line(this.currentX, this.y - 12, this.currentX - 10, this.y - 5);
        
        noStroke();

    }

    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)

        if(d < 50)
        {
            return true;
        }
        return false;
    }

}