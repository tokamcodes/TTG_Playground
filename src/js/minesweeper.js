import {setupCoreHandlers, generateBoardArray, showBoard , getCoordinates, startTimer, clearTimer, resetTime, isSameCoord,
        getRandomArrayItem, getElementFromRCDataAttribute, getAdjustedCoords, isValidCoords} from "./gridgames.js";
const boards = [[9, 10],[15, 40], [20, 60]]
const cellValueArray = [0,0,0,0] // 0/1 booleans - worked//flag/has mine/ mine clicked

let grid_size = boards[0] //default to small board; 
let gameCellArray = []
let minesPlaced = false; //On first user click, we want to place the mines. This allows the user to have a safe first click.

export function init(){
    setupCoreHandlers(setupGameBoard);
    setupGameBoard(0);
}

function setupGameBoard(boardSize){
    grid_size = boards[boardSize]
    minesPlaced = false;
    gameCellArray = generateBoardArray(grid_size[0],grid_size[0]);
    showBoard(gameCellArray, "ms_cell");
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

//Look to simplyfy the next handler and move into gridgames.js by passing in array of event type and function name to call.
function setCellClickHandlers(){
    for(const [r, row] of gameCellArray.entries()){
        for (const [c, col] of row.entries()){
                const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`)
                cell.addEventListener("contextmenu", rightClickHandler); 
                cell.addEventListener("click", leftClickHandler); 
        };
    };
};

function rightClickHandler(event){
    let cellCoords = getCoordinates(event.target);
    if(cellAlreadyWorked(cellCoords)) return;
    placeFlag(cellCoords);  
}

function leftClickHandler(event){
    let cellCoords = [Number(this.dataset.row), Number(this.dataset.col)];
    if (!minesPlaced){
        placeMines(cellCoords);
    }
    if(cellHasFlag(cellCoords)) return;
    evaluateCell(cellCoords)
}

//If the cell has a flag, then do not allow evaluation of the cell.
function cellHasFlag(cellCoords){
    let cell = getElementFromRCDataAttribute(cellCoords);
    if(cell.dataset.flag){
        return true;
    }
    return false;
}

//If the cell has already been checked, then do not allow further checks. specifically adding a flag.
function cellAlreadyWorked(cellCoords){
    let cell = getElementFromRCDataAttribute(cellCoords);
    if(cell.dataset.mineclicked || cell.dataset.mines || cell.dataset.cleared){
        return true;
    }
    return false;
}

function placeFlag(cellCoords){
    let cell = getElementFromRCDataAttribute(cellCoords);
    if ('flag' in cell.dataset){
        delete cell.dataset.flag;
        adjustFlags(1);
        return;
    }
    cell.dataset.flag = "true";
    adjustFlags(-1);
};

function placeMines(firstClickCoords){
    let number_of_mines = grid_size[1];
    for (let m = 0; m < number_of_mines; m++){
        let randomCellCoords = getRandomArrayItem(gameCellArray);
        let element = getElementFromRCDataAttribute(randomCellCoords);
        if(!element.dataset.mine && !isSameCoord(firstClickCoords,randomCellCoords)){
            element.dataset.mine = "true";
        }else{
            m--; //Reduce the mine counter, without this we may not get the required number of mines if a previously random cell has been selected again.
        }
    }
    minesPlaced = true;
    startTimer();
};


function evaluateCell(cellCoords){
    let cell = getElementFromRCDataAttribute(cellCoords);
    if(cell.dataset.mine){
        gameOverLoss(cellCoords);
        return;
    }
    checkAdjacentCells(cellCoords);
};

function checkAdjacentCells(cellCoords){
    let minesFound = 0;
    let cellsToCheck = obtainAdjacentCells(cellCoords);
    cellsToCheck.forEach(cell =>{
        if(cell.dataset.mine === "true"){
            minesFound++;
        }
    })
    
    if(minesFound > 0){
        applyMineCount(cellCoords, minesFound);
        return;
    }

    clearCell(cellCoords);

    cellsToCheck.forEach(cell => {
        checkAdjacentCells(getCoordinates(cell));
    });

};

function obtainAdjacentCells(cellCoords){
    //Need to consider if the adjust cell coords exist in the array - do not want out of bounds errors.
    let adjacentCells = [];
    let adjustmentArray = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    adjustmentArray.forEach(adjustment => {
        // let adjCell = [cellCoords[0] + adjustment[0], cellCoords[1] + adjustment[1]];
        let adjCell = getAdjustedCoords(cellCoords, adjustment)
        
        if(!isValidCoords(gameCellArray,adjCell)) return;

        let nextCell = getElementFromRCDataAttribute(adjCell);
        if(nextCell.dataset.cleared === "true"){
            return;
        }

        adjacentCells.push(nextCell);
    });

    return adjacentCells;
};

function clearCell(cellCoords){
    let cell = getElementFromRCDataAttribute(cellCoords);
    cell.dataset.cleared = "true";
};

function applyMineCount(cellCoords, count){
    const cell = getElementFromRCDataAttribute(cellCoords);
    cell.textContent = count;
    cell.dataset.mines = `${count}`;
    clearCell(cellCoords);
};

function gameOverLoss(cellCoords){
    let currentCell = getElementFromRCDataAttribute(cellCoords);
    currentCell.dataset.mineclicked = "true";
    revealMines();
    removeClickHandlers();
    clearTimer();
    alert("Game Over! You hit a mine.");
}

function revealMines(){
    const mines = document.querySelectorAll(`[data-mine]`).forEach( mine => {
        mine.dataset.cleared = "true";
        if (mine.dataset.flag){
            delete mine.dataset.flag;
        }
    });
}

// #region potentialforcommonjs

function removeClickHandlers(){
    const handlers = document.querySelectorAll(`[data-row][data-col]`).forEach(element => {
        element.removeEventListener("contextmenu", rightClickHandler)
        element.removeEventListener("click", leftClickHandler);
    })
}

// #endregion