import './style.css';
import Phaser from 'phaser';
/********************************/
//Game UI 
const gameStartDiv = document.querySelector("#startScreen");
const gameStartBtn = document.querySelector("#startGameBtn");
const gameEndDiv = document.querySelector("#gameOverScreen");
const gameResults = document.querySelector("#gameWinLoseSpan");
const finalScore = document.querySelector("#gameEndScoreSpan ");
const gameScreen = document.querySelector("#gameCanvas"); 
const pauseBtn = document.querySelector("#pauseBtn");

/**/

const sizes = {//Canvas Dimensions
  width: 500,
  height: 500
}
const speedDown = 200 //Gravity speed 
const foodSizes = {//Food Sprites 
  width: 70, 
  height: 70, 
}
const badFoodList = [
  "avocado",
  "dark-chocolate", 
  "chewing-gum",
  "garlic",
  "grape",
  "ice-cream",
  "nuts",
  "onion",
  "pizza",
  "soft-drink",
  "sweets",
]
const goodFoodList = [
  "apple",
  "bananas",
  "chicken-leg"
]

const badFoodsAdded = []; 
const goodFoodsAdded = []; 

class GameScene extends Phaser.Scene{
  constructor(){//Game Variables 
    super("scene-game");
    this.player;
    this.cursor; 
    this.playerSpeed = speedDown + 50; 
    this.target;
    this.badTarget; 
    this.points = 0; 
    this.textScore; 
    this.textTime; 
    this.timedEvent; 
    this.remainingTime; 
    this.goodEmitter; 
    this.badEmitter; 
  }
  //Loads assets 
  preload() {
    console.log("Loading images...");
  
    // Load the images
    console.log("Loading background image...");
    this.load.image("bg", "/assets/levelOne.png");
    console.log("Background image load attempted");
    this.load.image("player", "/assets/playerSprite.png");
    this.load.image("apple", "/assets/apple.png"); 
    this.load.image("avocado", "/assets/avocado.png"); 
    this.load.image("bananas", "/assets/bananas.png"); 
    this.load.image("chewing-gum", "/assets/chewing-gum.png"); 
    this.load.image("chicken-leg", "/assets/chicken-leg.png");
    this.load.image("dark-chocolate", "/assets/dark-chocolate.png"); 
    this.load.image("garlic", "/assets/garlic.png"); 
    this.load.image("grape", "/assets/grape.png"); 
    this.load.image("ice-cream", "/assets/ice-cream.png"); 
    this.load.image("nuts", "/assets/nuts.png"); 
    this.load.image("onion", "/assets/onion.png"); 
    this.load.image("pizza", "/assets/pizza.png"); 
    this.load.image("soft-drink", "/assets/soft-drink.png"); 
    this.load.image("sweets", "/assets/sweets.png"); 
    this.load.image("good", "/assets/goodParticleEffect.png"); 
    this.load.image("bad", "/assets/badParticleEffect.png");


    // Adding a listener for load error
    this.load.on("loaderror", (file) => {
      console.error(`Failed to load ${file.key}`);
    });
    
  
    this.load.on("complete", () => {
      console.log("Image loading complete.");
  
      // Log the texture names manually
      const textureNames = Object.keys(this.textures.list);
  
      // Log loaded textures only (excluding internal ones like __MISSING)
      textureNames.forEach(textureName => {
        console.log("Loaded texture:", textureName);
      });

      //Sorts the images into good/bad lists by name 
      //For each texture...
      textureNames.forEach(texture => {
        //Loop through badFoods list 
        badFoodList.forEach(badFood => {
          //if its on it, add it to the appropriate list
          if(texture === badFood){
            badFoodsAdded.push(texture); 
          }

        }); 

        //Loops through goodFood list 
        goodFoodList.forEach(goodFood => {
          //if its on it, add it to the appropriate list
          if(texture === goodFood){
            goodFoodsAdded.push(texture); 
          }
        }); 

      }); 
    });
  }
  create(){
   /******* Game Logic *******/
   this.scene.pause("scene-game");//pauses game (add to pause btn later)

  /*********************Images*******************/
    //Backgound 
    const bg = this.add.image(0,0,"bg").setOrigin(0,0);
    bg.setDisplaySize(sizes.width, sizes.height);

    /**********************Sprites Logic****************************/
    //Player 
    this.player = this.physics.add.image(175, sizes.height,"player").setOrigin(0,0);
    this.player.setDisplaySize(200,100); //scales image 
    this.player.setImmovable(true); //prevents other sprites from interacting 
    this.player.body.allowGravity = false;  //stops player from falling off screen 
    this.player.setCollideWorldBounds(true);//Prevents player from leaving
    this.player.setY(sizes.height - (this.player.displayHeight - 5));
    this.player.setSize(this.player.displayWidth + 40, this.player.displayHeight) 
    .setOffset(200, 250); //Sets hitbox to bottom of player 
    //resizes hitbox 
    this.cursor = this.input.keyboard.createCursorKeys(); //Keyboard controls 

    this.target = this.physics.add
    .image(sizes.width / 2,0, goodFoodsAdded[this.getRandomGoodTxture()].toString()).setDisplaySize(foodSizes.width,foodSizes.height)
    .setOrigin(this.getRandomX(),0); 
    this.target.setMaxVelocity(0,speedDown); 

    this.badTarget = this.physics.add
    .image(sizes.width / 2, 0, badFoodsAdded[this.getRandomBadTxture()].toString()).setDisplaySize(foodSizes.width, foodSizes.height);
    this.badTarget.setMaxVelocity(0,speedDown); 


    //Collisons 
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);
    this.physics.add.overlap(this.badTarget, this.player, this.badTargetHit, null, this);

    /************Game UI ***********/
    //Score 
    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#FFFFFF",
    });

  //Timer 
    this.textTime = this.add.text(0, 10, "Time: 00", {
      font: "25px Arial",
      fill: "#FFFFFF",
    });
    //Change # to +/- game length 
    this.timedEvent = this.time.delayedCall(40000, this.gameOver, [], this); 

    //Particle Effects
    this.goodEmitter = this.add.particles(0,0,"good", {
      speed: 100,
      gravityY: speedDown - 200, 
      scale: 0.1,
      duration: 100,
      emitting: false
    });

    this.badEmitter = this.add.particles(0,0,"bad", {
      speed: 100,
      gravityY: speedDown - 200, 
      scale: 0.1,
      duration: 200,
      emitting: false
    });

    //Lets particles follow player 
    this.goodEmitter.startFollow(this.player, this.player.width / 8, this.player.height / 6, true); 
    this.badEmitter.startFollow(this.player, this.player.width / 8, this.player.height / 6, true); 

  }
  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Time: ${Math.round(this.remainingTime).toString()}`);
    
    // Check for overlap between good and bad food
    this.preventOverlap();
    
    // Food Movement for good target
    if (this.target.y >= sizes.height) {
      this.repositionFood(this.target, goodFoodsAdded, this.getRandomGoodTxture());
    }
    
    // Food Movement for bad target
    if (this.badTarget.y >= sizes.height) {
      // Only increment score if bad food has already passed the bottom
      this.repositionFood(this.badTarget, badFoodsAdded, this.getRandomBadTxture());
      this.textScore.setText(`Score: ${this.points}`);
    }
    
    // Player Movement
    const { right, left } = this.cursor;
    
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }
  
  badTargetHit() {
    this.badTarget.setY(0);
    this.target.setVelocityY(speedDown);
    this.badEmitter.start();
    this.badTarget.setX(this.getRandomX());
    this.points--; // Decrease points when bad food hits player
    this.textScore.setText(`Score: ${this.points}`);
  }
  
  /**
   * Reposition food smoothly and avoid the flash. - from chatgpt & Princess Hornage 
   */
  repositionFood(food, foodList, randomTextureIndex) {
    // Hide the food while repositioning
    food.setAlpha(0);
  
    // Smoothly tween food to a new position off-screen (to prevent flash)
    this.tweens.add({
      targets: food,
      y: -food.displayHeight, // Move it above the screen
      duration: 300, // Duration of the tween (adjust as needed)
      onComplete: () => {
        // Once the food is off-screen, reset its position
        food.setX(this.getRandomX());
        food.setY(0); // Set it back to the top of the screen
  
        // Set a new texture from the list
        food.setTexture(foodList[randomTextureIndex].toString()).setDisplaySize(foodSizes.width, foodSizes.height)
          .setOrigin(0, 0);
  
        // Fade the food back in
        this.tweens.add({
          targets: food,
          alpha: 1, // Fade in
          duration: 200 // Duration for fading back in
        });
      }
    });
  
    // Update the score if needed
    this.textScore.setText(`Score: ${this.points}`);
    
  }
  
  /**
   * Prevent overlap between good and bad food by checking their positions.
   */
  preventOverlap() {
    const badBounds = this.badTarget.getBounds();
    const goodBounds = this.target.getBounds();
  
    // Check if the bounds of the bad and good food intersect
    if (Phaser.Geom.Intersects.RectangleToRectangle(badBounds, goodBounds)) {
      // If they overlap, move the bad target to a new position
      this.badTarget.setX(this.getRandomX());
      this.badTarget.setY(0); // Reset to top
    }
  }
  
  
  /**
   * Prevent overlap between good and bad food by checking their positions.
   */
  preventOverlap() {
    // Check if the bounds of the bad and good food intersect
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.badTarget.getBounds(), this.target.getBounds())){
      // If they overlap, move the bad target to a new position
      this.badTarget.setX(this.getRandomX());
      this.badTarget.setY(0); // Reset to top
    }
  }
  

  /**************Helper Methods**************/
  //Returns random food pos 
  getRandomX(){
    return Math.floor(Math.random() * (sizes.width - foodSizes.width)); 
  }
  //Collision Detection 
  targetHit() {
    this.target.setY(0); 
    this.target.setVelocityY(speedDown);
    this.goodEmitter.start(); 
    this.target.setTexture(goodFoodsAdded[this.getRandomGoodTxture()].toString()).setDisplaySize(foodSizes.width,foodSizes.height)
    .setOrigin(0,0); 
    this.target.setX(this.getRandomX()); 
    this.points++; 
    this.textScore.setText(`Score: ${this.points}`)
  }
  badTargetHit() {
    this.badTarget.setY(0); 
    this.target.setVelocityY(speedDown);
    this.badEmitter.start(); 
    this.badTarget.setX(this.getRandomX()); 
    this.points--; 
    this.textScore.setText(`Score: ${this.points}`)
  }
  getRandomGoodTxture() {
   return Math.floor(Math.random() * goodFoodsAdded.length); 
  }
  getRandomBadTxture() {
    return Math.floor(Math.random() * badFoodsAdded.length); 
  }
  gameOver(){
    this.sys.game.destroy(true);//removes and destroys scene

    //Win/Lose Conditions 
    if(this.points >= 10){
      finalScore.textContent = this.points; 
      gameResults.textContent = "Win!";
    }else{ 
      finalScore.textContent = this.points; 
      gameResults.textContent = "Lose!";
    }

    //Unhides gameover screen 
    gameEndDiv.style.display = "flex"; 
    pauseBtn.style.display = "none"; 
  }
  quitGame(){
    this.sys.game.destroy(true);//removes and destroys scene
    pauseBtn.style.display = "none"; //hides pause button
    gameStartDiv.style.display = "flex";  //displays start screen and UI
    gameStartBtn.style.display = "flex"; 
  }
}

//Game Configurations 
const config = { 
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics:{
    default: "arcade",
    arcade: {
      gravity: {y: speedDown}, 
      debug: false//change to see hitboxes 
    }
  },
  scene:[GameScene]
}

const game = new Phaser.Game(config) 

//Button Events 
gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  gameScreen.style.display = "flex";
  pauseBtn.style.display = "flex"; 
  game.scene.resume("scene-game"); 
});
//Pause Button
pauseBtn.addEventListener("click", () => {
  game.scene.pause("scene-game");
  pauseBtn.style.display = "none"; 
  
});
/*Pause Menu Modal*/
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
    pauseBtn.style.display = "flex"; //redisplays pause button 
    game.scene.resume("scene-game"); 
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if(event.key === "Escape") {
      closeAllModals();
    }
  });
});





