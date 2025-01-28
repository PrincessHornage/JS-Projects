import {game} from "./main.js"; 

//Screens
const instructionsScreen = document.querySelector("#instructionsScreen");
const optionsScreen = document.querySelector("#optionsScreen");
const startScreen = document.querySelector("#startScreen");
const gameScreen = document.querySelector("#gameCanvas");
const gameStartDiv = document.querySelector("#startScreen");
const gameEndDiv = document.querySelector("#gameOverScreen");

//Text
const gameTitle = document.querySelector("#gameTitle");
const gameResults = document.querySelector("#gameWinLoseSpan");
const finalScore = document.querySelector("#gameEndScoreSpan");

//Buttons 
const restartBtn = document.querySelector("#restartBtn"); 
const quitBtn = document.querySelector("#quitBtn"); 
const creditsBtn = document.querySelector("#creditsBtn");
const optionsBtn = document.querySelector("#optionsBtn");
const instructionsBtn = document.querySelector("#instructionsBtn");
const gameStartBtn = document.querySelector("#startGameBtn");
const closeInstBtn = document.querySelector("#closeBtn");
const saveSettingsBtn = document.querySelector("#saveSettingsBtn");
const efxBtn = document.querySelector("#efxBtn");
const efxBtnImg = document.querySelector("#efxBtnImg");
const volumeBtnImg = document.querySelector("#volumeBtnImg");
const volumeBtn = document.querySelector("#volumeBtn");
const fullScreenBtn = document.querySelector("#fullscreenBtn");

//Click Counters 
let volClicks = 0; //Button click count
let efxVolClicks = 0; //Button click count
let fsClicks = 0;


//********** UI Button Events ***************


//Displays credits screen
creditsBtn.addEventListener("click", ()=> {


    //Hide all other screens
    startScreen.style.display = "none";
    gameEndDiv.style.display = "none";
    gameResults.style.display = "none";
    //Display credits screen


    //Display Main Menu Button
});
//Displays game controls and instructions
instructionsBtn.addEventListener("click", ()=> {


    //Hide all other screens
    startScreen.style.display = "none";
    gameTitle.style.display = "none";


    //Displays instructions screen
    instructionsScreen.style.display = "flex";


   
    //Display Main Menu Button
   
});
//Displays options screen
optionsBtn.addEventListener("click", ()=> {


    startScreen.style.display = "none";
    optionsScreen.style.display = "block";
    gameTitle.style.display = "none";
   
});
//Returns to main menu
closeInstBtn.addEventListener("click", ()=> {
    //Hide all other screens
    startScreen.style.display = "flex";
    gameTitle.style.display = "flex";
    instructionsScreen.style.display = "none";
});

//Applies all settings to game and returns to main title
saveSettingsBtn.addEventListener("click", () => {
    optionsScreen.style.display = "none";
    startScreen.style.display = "flex";
    gameTitle.style.display = "flex";
});

//Volume On/Off Buttons
//Switches image to match audio state
volumeBtn.addEventListener("click", ()=> {
    volClicks++;
    if(volClicks === 1){
        volumeBtnImg.src = "/assets/mute.png";
    } else if( volClicks === 2) {
        volumeBtnImg.src = "/assets/speaker.png";
        volClicks = 0;
    }
});
efxBtn.addEventListener("click", ()=> {
    efxVolClicks++;
    if(efxVolClicks === 1){
        efxBtnImg.src = "/assets/mute.png";
    } else if( efxVolClicks === 2) {
        efxBtnImg.src = "/assets/speaker.png";
        efxVolClicks = 0;
    }
});

fullScreenBtn.addEventListener("click", ()=> {
    fsClicks++;
    if(fsClicks === 1){
        fullScreenBtn.innerHTML = "Disabled"
    } else if( fsClicks === 2) {
        fullScreenBtn.innerHTML = "Enabled"
        fsClicks = 0;
    }
});

gameStartBtn.addEventListener("click", () => {
    gameStartDiv.style.display = "none";
    gameScreen.style.display = "flex";
    pauseBtn.style.display = "flex";
    game.scene.start("scene-game");
});

restartBtn.addEventListener("mouseenter", () => {
    restartBtn.classList.add("is-focused");
}); 

restartBtn.addEventListener("mouseleave", () => {
    restartBtn.classList.remove("is-focused");

}); 

quitBtn.addEventListener("mouseenter", () => {
    quitBtn.classList.add("is-inverted");

});

quitBtn.addEventListener("mouseleave", () => {
    quitBtn.classList.remove("is-inverted");
});
