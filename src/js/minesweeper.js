const small_board = [9, 10]; //default grid size with 9 rows/cols and 10 mines.
const medium_board = [15, 40];
const large_board = [20, 60];

let grid_size = small_board; 
let gameBoard;
let gameCells;
let minesPlaced = false; //On first user click, we want to place the mines. This allows the user to have a safe first click.

document.addEventListener("DOMContentLoaded", () => {    
    gameBoard = document.getElementById("minesweeper_grid");
    gameCells = document.getElementsByClassName("ms_cell");

    gameBoard.addEventListener("contextmenu", (event) => {
        //Flag placement (right click) restricted to just the cells of the game board to prevent context menu showing.
        let cell = event.target;
        event.preventDefault();
        if(cell.classList.contains("ms_cell")){
            placeFlag(cell);  
        } 
    });

    gameBoard.addEventListener("click", (event) => {        
        evaluateCell(event.target);
            //May need to refactor this if the click event covers more than just the left mouse button.
            if (!minesPlaced){
            placeMines();
        }

    });
    
    const sm_button = document.getElementById("ms_small");
    const md_button = document.getElementById("ms_medium");
    const lg_button = document.getElementById("ms_large");

    sm_button.addEventListener("click", () => {
        grid_size = small_board;
        createBoard();
    });

    md_button.addEventListener("click", () => {
        grid_size = medium_board;
        createBoard();
    });             

    lg_button.addEventListener("click", () => {
        grid_size = large_board;
        createBoard();
    });

    
    const restartButton = document.getElementById("restart_game");
    restartButton.addEventListener("click", () => {
        //Need to enhance this for user confirmation - need to avoid accidental clicks.
        //reset basic board size to default.
        grid_size = small_board;
        createBoard();
        minesPlaced = false;
    });

    createBoard();
});

function createBoard(){
    let size = grid_size[0] 
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
    if ('flag' in cell.dataset){
        delete cell.dataset.flag;
        return;
    }
    cell.dataset.flag = "true";
};

function placeMines(){
    let number_of_mines = grid_size[1];
    let cells = Array.from(gameCells);
    for (let m = 0; m < number_of_mines; m++){
        let randomCellIndex = Math.floor(Math.random() * cells.length)
        if(!cells[randomCellIndex].dataset.mine){
            cells[randomCellIndex].dataset.mine = "true";
        }else{
            m--; //Reduce the mine counter, without this we may not get the required number of mines if a previously random cell has been selected again.
        }
    }
    minesPlaced = true;
};

function evaluateCell(cell){
    if(cell.dataset.mine){
        //This will be game over...need to code for this properly.
        cell.dataset.mineclicked = "true";
        alert("Game Over! You hit a mine.");
        return;
    }
    checkAdjacentCells(cell);
};

function checkAdjacentCells(selectedCell){
//Need to consider if the cell is on the edge of the board - do not want out of bounds errors.

    clearCell(selectedCell)
};

function clearCell(cell){
    cell.dataset.cleared = "true";
};

function applyMineCount(cell, count){

};