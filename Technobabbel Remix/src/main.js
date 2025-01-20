"use strict"; 

/*Arrays to pick random words from*/
const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];
const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];
const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];
const fonts = ['Courier New', 'Times New Roman', 'Lucida Sans', 'Permanent Marker', 'Matemasie', 'Annie Use Your Telescope','Barlow Condensed', 'Chango','Playwrite AR','Rubik Microbe','Londrina Sketch','Griffy','Rampart One','Lacquer','Vast Shadow','Playwrite CL','Orbitron','Nixie One','Cabin Sketch','Kalnia Glaze','Sacramento','Shadows Into Light', 'Barlow Condensed']


/*List of Favorite Babbel*/
const favorites = [];
//Returns random number 
function getNum(){
    return Math.floor(Math.random() * words1.length); 
}
//Returns random font 
/*function getRandFont(){
    return Math.floor(Math.random() * fonts.length)
}*/
//Returns random color 
/*function getRandColor(){
    return Math.floor(Math.random() * fontColors.length)
}*/


//Value Range Controls 
const value = document.querySelector("#value");
const input = document.querySelector("#number_range");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});


//Value Range Controls 
const fontSizeValue = document.querySelector("#fontSize_value");
const fontSizeInput = document.querySelector("#fontSize_range");


//Font Color Controls 
function getColor(){
    let selectedColor = document.querySelector('input[name="font_color"]:checked'); 

    //Returns color as long as at least 1 button is selected
    if(selectedColor != null){ 
        return selectedColor.value;  
    } 
}

//Font-Family Controls 
function getFont(){
    let selectedFont = document.querySelector('input[name="font_family"]:checked'); 
    if(selectedFont != null){
        return selectedFont.value; 
    }
}

function exitSettings(){
    document.getElementById("settings-card").style.display = "none"; 
}
function displaySettings(){
    document.getElementById("settings-card").style.display = "block"; 
}

//Extracts random words from the 3 arrays and arranges them into a sentence
function getBabble(){
    document.getElementById("output").innerHTML = "";// Clears output  

    //Gets number from slider value 
    let num = document.querySelector("#value").innerHTML;

    for(let i = 0; i < num; i++){
        document.getElementById("output").innerHTML += ` *${words1[getNum()]} ${words2[getNum()]} ${words3[getNum()]} \n`;
        document.getElementById("output").innerHTML += "<br>";

    }
    //document.getElementById("output").innerHTML += `${words1[getNum()]} ${words2[getNum()]} ${words3[getNum()]}`;
    //document.getElementById("output").style.fontFamily = `${fonts[getRandFont()]}`//Random Font;
    document.getElementById("output").style.color = `${getColor()}`; //Random Color 
    document.getElementById("output").style.fontFamily = `${getFont()}`; 
}