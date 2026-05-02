const GRID_SIZE = 10;
let gameBoard;

document.addEventListener("DOMContentLoaded", () => {    
    gameBoard = document.getElementById("minesweeper_grid");

    gameBoard.addEventListener("contextmenu", (event) => {
        let cell = event.target;
        event.preventDefault();
        if(cell.classList.contains("ms_cell")){
            placeFlag(cell);  
        } 
    });
    
    const sm_button = document.getElementById("ms_small");
    const md_button = document.getElementById("ms_medium");
    const lg_button = document.getElementById("ms_large");

    sm_button.addEventListener("click", () => {
        createBoard(GRID_SIZE);
    });

    md_button.addEventListener("click", () => {
        createBoard(15);
    });             

    lg_button.addEventListener("click", () => {
        createBoard(20);
    });

    
    const restartButton = document.getElementById("restart_game");
    restartButton.addEventListener("click", () => {
        //Need to enhance this for user confirmation - need to avoid accidental clicks.
        createBoard(GRID_SIZE);
    });

    createBoard(GRID_SIZE);
});

function createBoard(size){
    gameBoard.innerHTML = "";
    for(let c = 0; c < size; c++){
        for(let r = 0; r < size; r++){
            let cell = document.createElement("div");
            cell.classList.add("ms_cell");
            gameBoard.appendChild(cell);
        }
    }
    //Set the css grid template properties based on the size of the board that the user has selected.
    //Dynamically setting it removes the need for duplicated code and/or hardcoding size in multiple places.
    gameBoard.style.setProperty("grid-template-columns", `repeat(${size}, 1fr)`);
    gameBoard.style.setProperty("grid-template-rows", `repeat(${size}, 1fr)`);
}

function placeFlag(cell){
    cell.style.backgroundColor = "red";
}