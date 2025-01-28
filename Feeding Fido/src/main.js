import './style.css';
import shibaSheet from "/assets/spritesheets/shiba-spritesheet.png"; 
import labSheet from "/assets/spritesheets/chocolate-lab-spritesheet.png"; 
import collieSheet from "/assets/spritesheets/collie-spritesheet.png"; 
import yorkieSheet from "/assets/spritesheets/yorkie-spritesheet.png"; 
import Phaser from 'phaser';
/********************************/
//Game UI
const gameStartDiv = document.querySelector("#startScreen");
const gameStartBtn = document.querySelector("#startGameBtn");
const gameEndDiv = document.querySelector("#gameOverScreen");
const gameResults = document.querySelector("#gameWinLoseSpan");
const finalScore = document.querySelector("#gameEndScoreSpan ");
const pauseBtn = document.querySelector("#pauseBtn");
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

class GameScene extends Phaser.Scene{
  constructor(){//Game Variables
    super("scene-game");
    this.player;
    this.health = 100; 
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
    this.load.image("bg", "/assets/levelOne.png");
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

    //Spritesheets 
    this.load.spritesheet("shiba", shibaSheet, {
      frameWidth: 50,
      frameHeight: 50
    });
    this.load.spritesheet("chocolate-lab", labSheet ,{
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("border-collie", collieSheet ,{
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("yorkie-terrier", yorkieSheet ,{
      frameWidth: 64,
      frameHeight: 64,
    });

    // Adding a listener for load error
    this.load.on("loaderror", (file) => {
      console.error(`Failed to load ${file.key}`);
    });

    //When all images are loaded...
    this.load.on("complete", () => {
      console.log("All images loaded");
 
      // Log the texture names manually
      const textureNames = Object.keys(this.textures.list);
 
      // Log loaded textures only (excluding internal ones like __MISSING)
      textureNames.forEach(textureName => {
        console.log("Loaded texture:", textureName);
      });
     
    });
  }
  create(){
   /******* Game Logic *******/
   game.scene.pause();//Prevents game from running in background 

    /*********************Images*******************/
    //Backgound
    const bg = this.add.image(0,0,"bg").setOrigin(0,0);
    bg.setDisplaySize(sizes.width, sizes.height);

    /******Sprite Sheets********/

    /**********************Sprites Logic****************************/
    //Player Animation (Shiba )
    //Sit 
    this.anims.create({
      key: 'sit',
      frames: this.anims.generateFrameNumbers('shiba', {frames:[0,1,2,3,11,12,13]}), // Frames 0 to 10 (first row)
      frameRate: 10,
      repeat: -1  // Animation will loop indefinitely
    })
    //Turn 
    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('shiba', {frames:[22,23,24,25,26,27,28]}), 
      frameRate: 10,
      repeat: 1,
       
    })
    //Walk 
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('shiba', {frames:[37,38,39,40]}), 
      frameRate: 10,
      repeat: 0,  
    })
    //Celebrate
    this.anims.create({
      key: 'celebrate',
      frames: this.anims.generateFrameNumbers('shiba', {frames:[44,45,46,47]}), 
      frameRate: 8,
      repeat: -1  // Animation will loop indefinitely
    })
    //Scream
    this.anims.create({
      key: 'scream',
      frames: this.anims.generateFrameNumbers('shiba', {frames:[55,56,57,58]}), 
      frameRate: 7,
      repeat: 0  // Animation will loop indefinitely
    })
    //Cry
    this.anims.create({
      key: 'cry',
      frames: this.anims.generateFrameNumbers('shiba', {frames:[77,78,79,80,81]}), 
      frameRate: 10,
      repeat: -1  // Animation will loop indefinitely
    })
    //Defeat
    this.anims.create({
      key: 'defeat',
      frames: this.anims.generateFrameNumbers('shiba', {frames:[88,89,90]}), 
      frameRate: 7,
      repeat: 1 //Prevents loop 
    })

    this.player = this.physics.add.sprite(100, sizes.height-100,"shiba");//(xPos, yPos, spritesheetName)
    this.player.setY(sizes.height - (this.player.displayHeight / 2));//sets player pos to screen bottom 
    this.player.setAlpha(1); //ensures sprite visibility
    this.player.allowGravity = false;  //stops player from falling off screen
    this.player.setCollideWorldBounds(true);//Prevents player from leaving
    this.player.setDisplaySize(70,70); //scales image
    this.player.setImmovable(true); //prevents other sprites from interacting
    this.player.anims.play("sit", true); 

    //Hitbox adjustment
    this.player.setSize(this.player.displayWidth / 2, this.player.displayHeight / 2)
    .setOffset(10, 20); //Sets hitbox to bottom of player

    this.cursor = this.input.keyboard.createCursorKeys(); //Keyboard controls

    //Foods 
    this.target = this.physics.add
    .image(sizes.width / 2,0, goodFoodList[this.getRandomGoodTxture()].toString()).setDisplaySize(foodSizes.width,foodSizes.height)
    .setOrigin(this.getRandomX(),0);
    this.target.setMaxVelocity(0,speedDown);

    this.badTarget = this.physics.add
    .image(sizes.width / 2, 0, badFoodList[this.getRandomBadTxture()].toString()).setDisplaySize(foodSizes.width, foodSizes.height);
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

    //***************Particle Effects***************
    this.goodEmitter = this.add.particles(0,0,"good", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.1,
      duration: 50,
      emitting: false
    });
    this.badEmitter = this.add.particles(0,0,"bad", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.1,
      duration: 50,
      emitting: false
    });

    //Particles follow player pos
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
      this.repositionFood(this.target, goodFoodList, this.getRandomGoodTxture());
    }
   
    // Food Movement for bad target
    if (this.badTarget.y >= sizes.height) {
      // Only increment score if bad food has already passed the bottom
      this.repositionFood(this.badTarget, badFoodList, this.getRandomBadTxture());
      this.textScore.setText(`Score: ${this.points}`);
    }
   
    // Player Movement
    const { right, left } = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.animateWalk(this.cursor); 
    } 
    else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.animateWalk(this.cursor); 

    } else {
      this.player.setVelocityX(0);
      this.animateWalk(this.cursor); 
    }
  }
  //Animates player movements 
  animateWalk(cursor){
    const { right, left } = cursor;
    if (left.isDown && this.player.body.velocity != 0 ) {
      this.player.anims.play("walk", true); 
      this.player.setFlipX(false); 

    } else if (right.isDown) {
      this.player.anims.play("walk", true); 
      this.player.setFlipX(true); //ensures sprite is facing correct way

    } else if(this.player.body.velocity === 0){
      this.player.anims.play("sit", true); 
    }
  }
  /**************Helper Methods**************/
  //When player collides with bad food...
  badTargetHit() {
    this.player.anims.play("defeat", true); 
    this.badTarget.setAlpha(0);
    this.badTarget.setY(0);
    this.target.setVelocityY(speedDown);
    this.badEmitter.start(); 
    this.badTarget.setX(this.getRandomX());
    this.badTarget.setAlpha(1);
    this.points--;
    this.textScore.setText(`Score: ${this.points}`);
    this.player.on('animationcomplete', (animation) => {
      if(animation.key === "defeat") {
        this.player.anims.play("sit", true); 
      }
    });
  }
  //Collision Detection
  targetHit() {
    this.player.anims.play("turn", true);  // Trigger the turn animation
    this.target.setAlpha(0); 
    this.target.setY(0); 
    this.goodEmitter.start(); 
    this.target.setX(this.getRandomX()); 
    this.target.setAlpha(1); 
    this.points++; 
    this.textScore.setText(`Score: ${this.points}`); 
    this.player.on('animationcomplete', (animation) => {
      if(animation.key === "turn") {
        this.player.anims.play("sit", true); 
      }
    });
  }
  //Reposition food smoothly and avoid the flash. - from chatgpt 
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
  //Prevent overlap between good and bad food by checking their positions.
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
  //Returns random food pos
  getRandomX(){
    return Math.floor(Math.random() * (sizes.width - foodSizes.width));
  }
  //Returns random foood textures 
  getRandomGoodTxture() {
   return Math.floor(Math.random() * goodFoodList.length);
  }
  getRandomBadTxture() {
    return Math.floor(Math.random() * badFoodList.length);
  }
  //Win/Lose Conditions
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
  //Leave Game 
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
const game = new Phaser.Game(config); 
export {game}; 

//Button Events

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
