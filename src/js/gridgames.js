// const small_board = []; //default grid size for a game
// const medium_board = [];
// const large_board = [];
let boardArray = [];

document.addEventListener("DOMContentLoaded", () => {
    const sm_button = document.getElementById("sm_grid");
    const md_button = document.getElementById("md_grid");
    const lg_button = document.getElementById("lg_grid");
    const gameBoard =document.getElementById(gameBoardName).addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    sm_button.addEventListener("click", () => {
        grid_size = small_board;
        setupGameBoard();
    });

    md_button.addEventListener("click", () => {
        grid_size = medium_board;
        setupGameBoard();
    });             

    lg_button.addEventListener("click", () => {
        grid_size = large_board;
        setupGameBoard();
    });
            
    const restartButton = document.getElementById("restart_game");
    restartButton.addEventListener("click", () => {
        //Need to enhance this for user confirmation - need to avoid accidental clicks.
        //reset basic board size to default and reset mines placed flag.
        grid_size = small_board;
        setupGameBoard();
    });
})


// #region Setup board section

function createBoard(rows,cols){
    let gameGrid = document.getElementById("game_grid") 
    boardArray = [];
    /*Updating to array.from - in minesweeper, initially created the array with a nest for loop. */
    generateBoardArray(rows,cols);
}

function generateBoardArray(rows,cols){
    boardArray = Array.from({length: rows}, (_, r) => 
        Array.from({length: cols}, (_, c) => (cellValueArray)
    ));
console.log(boardArray);
};

function showBoard(gameBoardName, styleName){
    let board = document.getElementById(gameBoardName);
    board.innerHTML= "";

    boardArray.forEach((row, r) =>{
        // _ used here as i do not need to do anything other than grab the index.
        // if i need to do anything with that item, i could give it a name like row above.
        row.forEach((_, c) => {
            let cellToDisplay = document.createElement("div");
            // data attributes added to enable array identification further down the line.
            cellToDisplay.dataset.row = r;
            cellToDisplay.dataset.col = c;
            cellToDisplay.classList.add(styleName);
            board.appendChild(cellToDisplay);
        })
    })

    //     //Set the css grid template properties based on the size of the board that the user has selected.
    //     //Dynamically setting it removes the need for duplicated code and/or hardcoding size in multiple places.

    board.style.setProperty("grid-template-columns", `repeat(${boardArray[0].length}, 1fr)`);
    board.style.setProperty("grid-template-rows", `repeat(${boardArray.length}, 1fr)`);
    
}
// #endregion

// 'region Grid Array Section
    function getCoordinates(cell){
        //should add in error handling in case this fails...need EH in more places too
        return [cell.dataset.row,cell.dataset.col];
    }
// #endregion

// #region Timer Section
function startTimer(){
    let seconds = 0;
    let timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = seconds; 
    game_timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;
    }, 1000);
}

function resetTime(){
    clearInterval(game_timer);
    document.getElementById("timer").textContent = "";
}
// #endregion
