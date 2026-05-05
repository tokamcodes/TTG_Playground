const small_board = [9, 10]; //default grid size with 9 rows/cols and 10 mines.
const medium_board = [15, 40];
const large_board = [20, 60];
const gameBoardName = "minesweeper_grid"
const cellValueArray = [0,0,0,0] // 0/1 booleans - worked//flag/has mine/ mine clicked

let grid_size = small_board; 
let gameCells;
let gameCellArray = []
let minesPlaced = false; //On first user click, we want to place the mines. This allows the user to have a safe first click.
let game_timer;

document.addEventListener("DOMContentLoaded", () => {    
    setupGameBoard();
});

function setupGameBoard(){
    minesPlaced = false;
    createBoard(grid_size[0],grid_size[0]);
    showBoard(gameBoardName, "ms_cell");
    setCellClickHandlers();
    resetTime();
    resetFlags();
}

function resetFlags(){
    document.getElementById("flagsRemaining").textContent = grid_size[1];
}

function adjustFlags(amount){
    let currentFlags = parseInt(document.getElementById("flagsRemaining").textContent);
    document.getElementById("flagsRemaining").textContent = currentFlags + amount;
}

//Look to simplyfy the next 3 handlers and move into gridgames.js
function setCellClickHandlers(){
    boardArray.forEach((row,r) => {
        row.forEach((_, c) => {
            const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`)
            cell.addEventListener("contextmenu", rightClickHandler); 
            cell.addEventListener("click", leftClickHandler); 
        });
    });
};

function rightClickHandler(event){
    let cellCoords = getCoordinates(event.target);
    if(cellAlreadyWorked(cellCoords)) return;
    placeFlag(cellCoords);  
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
        adjustFlags(1);
        return;
    }
    cell.dataset.flag = "true";
    adjustFlags(-1);
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
    startTimer();
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
        if(gameCellArray[newCellIndex].dataset.cleared === "true"){
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
    clearInterval(game_timer);
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