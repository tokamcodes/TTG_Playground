const small_board = [9, 10]; //default grid size with 9 rows/cols and 10 mines.
const medium_board = [15, 40];
const large_board = [20, 60];

let grid_size = small_board; 
let gameBoard;
let gameCells;
let gameCellArray = []
let minesPlaced = false; //On first user click, we want to place the mines. This allows the user to have a safe first click.

document.addEventListener("DOMContentLoaded", () => {    
    gameBoard = document.getElementById("minesweeper_grid");
    createBoard();

    gameBoard.addEventListener("contextmenu", (event) => {
        event.preventDefault();
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
        //reset basic board size to default and reset mines placed flag.
        grid_size = small_board;
        createBoard();
    });

});

function createBoard(){
    let size = grid_size[0] 
    minesPlaced = false;
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
    setCellClickHandlers()
}

function setCellClickHandlers(){
    gameCells = document.getElementsByClassName("ms_cell");
    gameCellArray = Array.from(gameCells);
    
    gameCellArray.forEach(cell => {
        cell.addEventListener("contextmenu", rightClickHandler); 
        cell.addEventListener("click",leftClickHandler); 

    });
};

function rightClickHandler(event){
    let cellIndex = gameCellArray.indexOf(event.target);
    if(cellAlreadyWorked(cellIndex)) return;
    placeFlag(cellIndex);  
}

function leftClickHandler(event){
    let cellIndex = gameCellArray.indexOf(event.target);
    if (!minesPlaced){
        placeMines(cellIndex);
    }
    if(cellHasFlag(cellIndex)) return;
    evaluateCell(cellIndex)
}

//If the cell has a flag, then do not allow evaluation of the cell.
function cellHasFlag(cellIndex){
    let cell = gameCellArray[cellIndex];
    if(cell.dataset.flag){
        return true;
    }
    return false;
}

//If the cell has already been checked, then do not allow further checks. specifically adding a flag.
function cellAlreadyWorked(cellIndex){
    let cell = gameCellArray[cellIndex];
    if(cell.dataset.mineclicked || cell.dataset.mines || cell.dataset.cleared){
        return true;
    }
    return false;
}

function placeFlag(cellIndex){
    let cell = gameCellArray[cellIndex];
    if ('flag' in cell.dataset){
        delete cell.dataset.flag;
        return;
    }
    cell.dataset.flag = "true";
};

function placeMines(firstClickIndex){
    let number_of_mines = grid_size[1];
    for (let m = 0; m < number_of_mines; m++){
        let randomCellIndex = Math.floor(Math.random() * gameCellArray.length)
        if(!gameCellArray[randomCellIndex].dataset.mine && randomCellIndex !== firstClickIndex){
            gameCellArray[randomCellIndex].dataset.mine = "true";
        }else{
            m--; //Reduce the mine counter, without this we may not get the required number of mines if a previously random cell has been selected again.
        }
    }
    minesPlaced = true;
};

function evaluateCell(cellIndex){
    let cell = gameCellArray[cellIndex];
    if(cell.dataset.mine){
        gameOverLoss(cellIndex);
        return;
    }
    checkAdjacentCells(cellIndex);
};

function checkAdjacentCells(cellIndex){
    let minesFound = 0;
    let cellsToCheck = obtainAdjacentCells(cellIndex);
    cellsToCheck.forEach(cell =>{
        if(gameCellArray[cell].dataset.mine === "true"){
            minesFound++;
        }
    })
    
    if(minesFound > 0){
        applyMineCount(cellIndex, minesFound);
        return;
    }

    clearCell(cellIndex);

    cellsToCheck.forEach(cell => {
        checkAdjacentCells(cell);
    });

};

function obtainAdjacentCells(cellIndex){
    //Need to consider if the cell is on the edge of the board - do not want out of bounds errors.
    let size = grid_size[0];
    let cellReference = getCellReference(cellIndex);
    let adjacentCells = [];
    let adjustmentArray = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    adjustmentArray.forEach(adjustment => {
        let adjCell = [cellReference[0] + adjustment[0], cellReference[1] + adjustment[1]];
        
        if(0 > adjCell[0] || adjCell[0] >= size || 0 > adjCell[1] || adjCell[1] >= size){
            return;
        }

        let newCellIndex = cellIndex + (adjustment[0] * size + adjustment[1])
        if(gameCellArray[newCellIndex].dataset.minefound === "true" || gameCellArray[newCellIndex].dataset.cleared === "true" || gameCellArray[newCellIndex].dataset.flag === "true"){
            return;
        }

        adjacentCells.push(newCellIndex);
    });

    return adjacentCells;
};

function getCellReference(cellIndexToCheck){
    //Take the array index and convert it to a row and column based on the size of the grid. I can then check if the cell would surround the clicked cell..
    let size = grid_size[0];
    let adjustedCell = [Math.floor(cellIndexToCheck / size), cellIndexToCheck % size];
    return adjustedCell
}

function clearCell(cellIndex){
    let cell = gameCellArray[cellIndex];
    cell.dataset.cleared = "true";
};

function applyMineCount(cellIndex, count){
    gameCellArray[cellIndex].textContent = count;
    gameCellArray[cellIndex].dataset.mines = `${count}`;
    clearCell(cellIndex);
};

function gameOverLoss(cellIndex){
    let currentCell = gameCellArray[cellIndex];
    currentCell.dataset.mineclicked = "true";
    revealMines();
    removeClickHandlers();
    alert("Game Over! You hit a mine.");
}

function revealMines(){
        gameCellArray.filter(cell => cell.dataset.mine === "true").forEach(mineCell => {
        mineCell.dataset.cleared = "true";
        if (mineCell.dataset.flag){
            delete mineCell.dataset.flag;
        }
    });
}

function removeClickHandlers(){
    gameCellArray.forEach(cell => {
        cell.removeEventListener("contextmenu", rightClickHandler)
        cell.removeEventListener("click", leftClickHandler);
    });
}