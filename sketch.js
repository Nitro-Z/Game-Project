/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

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

var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


///Set up code//////
function setup()
{
createCanvas(4096, 576);
floorPos_y = height * 3/4;
game_score = 0;
lives = 3;
startGame();
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

    //Replace single canyon calls with a loop
    for(var i = 0; i < canyons.length; i++)
    {
        checkCanyon(canyons[i]);
        drawCanyon(canyons[i]);
    }
        
    //Replace the single collectable calls with a loop
    for (var i = 0; i < collectables.length; i++)
    {
        drawCollectable(collectables[i]);
        checkCollectable(collectables[i]);
    }

    //a cloud in the sky
    drawClouds();

    //Apply gravity when plummeting
    if(isPlummeting)
        {
            gameChar_y += 5;
            // Disable left/right movement while falling
            isLeft = false;
            isRight = false;
        }
        else
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
        }
        
    if(isJumping)
        {
            // Apply jumping velocity
            gameChar_y += jumpHeight;
            // Add gravity to slow the jump and eventually fall
            jumpHeight += gravity;
            
            // Check if character has landed
            if(gameChar_y >= floorPos_y)
            {
                gameChar_y = floorPos_y;
                isJumping = false;
                isFalling = false;
            }
            else
            {
                // Character is in the air
                isFalling = (jumpHeight > 0);
            }
        }

    //CheckFlagpole
    if(flagpole.isReached == false)
    {
        checkFlagpole();
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
    else if(keyCode == 87 || keyCode == 38)
    {
        if(!isJumping && gameChar_y == floorPos_y)
        {
            // Start a jump
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
    console.log(d);
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

function startGame()
{
    gameChar_x = 1;
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
        {x_pos: 100, y_pos: 300, isFound: false},
        {x_pos: 450, y_pos: 300, isFound: false},
        {x_pos: 750, y_pos: 300, isFound: false},
        {x_pos: 1100, y_pos: 300, isFound: false},
        {x_pos: 1400, y_pos: 300, isFound: false},
    ]

    canyons = 
    [
        {x_pos: 80, y_pos: height * 3/4, width: 150},
        {x_pos: 350, y_pos: height * 3/4, width: 150},
        {x_pos: 700, y_pos: height * 3/4, width: 150},
        {x_pos: 1000, y_pos: height * 3/4, width: 150},
        {x_pos: 1300, y_pos: height * 3/4, width: 150}
    ];

    cloud = 
    [
        {x_pos: 200, y_pos: 100},
        {x_pos: 500, y_pos: 80},
        {x_pos: 800, y_pos: 130}
    ];

    flagpole = {isReached: false, x_pos: 1800};
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

