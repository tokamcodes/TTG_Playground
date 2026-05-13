let game_timer;
let gameBoard;


//function from partial is required as a param. Module js file has no access to call function directly.
export function setupCoreHandlers(callback){
    const sm_button = document.getElementById("sm_grid");
    const md_button = document.getElementById("md_grid");
    const lg_button = document.getElementById("lg_grid");
    gameBoard = document.querySelector(`[data-gamegrid]`)
    
    gameBoard.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    //grid games have small (0) medium (1) or large (2) available. these are array indexes for the relevant js file.
    sm_button.onclick = () => {
        callback(0);
    };

    md_button.onclick = () => {
        callback(1);
    };             

    lg_button.onclick = () => {
        callback(2);
    };
            
    const restartButton = document.getElementById("restart_game");
    restartButton.onclick = () => {
        //Need to enhance this for user confirmation - need to avoid accidental clicks.
        //reset basic board size to default and reset mines placed flag.
        callback(0);
    };
}

// #region Setup board section
export function generateBoardArray(rows,cols){
    
    let gameGrid = document.getElementById("game_grid") 
    return Array.from({length: rows}, (_, r) => 
        Array.from({length: cols}, (_, c) => {}
    ));
};

export function showBoard(boardArray, styleName){
    gameBoard.innerHTML= "";

    boardArray.forEach((row, r) =>{
        // _ used here as i do not need to do anything other than grab the index.
        // if i need to do anything with that item, i could give it a name like row above.
        row.forEach((_, c) => {
            let cellToDisplay = document.createElement("div");
            // data attributes added to enable array identification further down the line.
            cellToDisplay.dataset.row = r;
            cellToDisplay.dataset.col = c;
            cellToDisplay.classList.add(styleName);
            gameBoard.appendChild(cellToDisplay);
        })
    })

    //     //Set the css grid template properties based on the size of the board that the user has selected.
    //     //Dynamically setting it removes the need for duplicated code and/or hardcoding size in multiple places.

    gameBoard.style.setProperty("grid-template-columns", `repeat(${boardArray[0].length}, 1fr)`);
    gameBoard.style.setProperty("grid-template-rows", `repeat(${boardArray.length}, 1fr)`);
    
}
// #endregion

// #region Grid Array Section
    export function getRandomArrayItem(gameCellArray){
        const row = Math.floor(Math.random() * gameCellArray.length);
        const col =  Math.floor(Math.random() * gameCellArray[row].length);
        return [row, col]
    }

    export function getElementFromRCDataAttribute([row,col]){
    //Using a row col array, obtain the html element base on the data attributes associated with the row and col.
    return document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
}

    export function getCoordinates(cell){
        //should add in error handling in case this fails...need EH in more places too
        return [Number(cell.dataset.row),Number(cell.dataset.col)];
    }

    export function getAdjustedCoords(currentCoords, adjustment){
        return [currentCoords[0] + adjustment[0], currentCoords[1] + adjustment[1]];
    }

    export function isValidCoords(boardArray, coords){
        return boardArray[coords[0]] !== undefined && boardArray[coords[0],coords[1]] !== undefined;
    }

// #endregion

// #region Timer Section
export function startTimer(){
    let seconds = 0;
    let timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = seconds; 
    game_timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;
    }, 1000);
}

export function clearTimer(){
    clearInterval(game_timer);
}

export function resetTime(){
    clearTimer();
    document.getElementById("timer").textContent = "";
}

export function isSameCoord([r1, c1], [r2, c2]){
    return r1 === r2 && c1 === c2;
}
// #endregion
