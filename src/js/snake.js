import {setupCoreHandlers, generateBoardArray, showBoard , getCoordinates, isSameCoord, getRandomArrayItem,
        getElementFromRCDataAttribute, getAdjustedCoords, isValidCoords} from "./gridgames.js";
const boards = [[10, 10],[15, 15], [20, 20]];
const cellValueArray = [0,0,0,0];

let grid_size = boards[0]; //default to small board; 
let gameCellArray = [];
let snake = [];
let snakeSpeed = 1;
let snakeMovementTimer;
let fruitSpawnTimer;
let fruitExists = false;
let direction = 0; // right = 0 and down - 1 left = 2, up = 3 >> will be used for adjustment array.

export function init(){
    setupCoreHandlers(setupGameBoard);
    setupSnakeDirectionKeyHandlers();
    setupGameBoard(0);
    createSnake();
    startmovement();
    startFruitSpawns();
}

// #region setup
function setupSnakeDirectionKeyHandlers(){
    document.addEventListener('keydown', (event) =>{
        switch(event.key){
            case 'a':
                direction = 2;
                break;
            case 's':
                direction = 1;
                break;
            case 'd':
                direction = 0;
                break;
            case 'w':
                direction = 3;
                break;
            default:
                break;
        }
    });
}

function setupGameBoard(boardSize){
    grid_size = boards[boardSize];
    gameCellArray = generateBoardArray(grid_size[0],grid_size[1]);
    showBoard(gameCellArray, "snake_cell");    
};

function startmovement(){
    snakeMovementTimer = setInterval(() => {
        movesSnake();
    }, 1000 / snakeSpeed);
}

function startFruitSpawns(){
    fruitSpawnTimer = setInterval(() => {
        attemptFruitSpawn();
    }, 1000 / snakeSpeed);
}

function createSnake(){
    //snake will start facing right with 3 segments...might look to randomise this in the future including it's direction
    let randSnakeCoords = getRandomArrayItem(gameCellArray)
    while(!isValidStart(randSnakeCoords)){
        randSnakeCoords = getRandomArrayItem(gameCellArray);
    }

    snake = [randSnakeCoords, //head
                [randSnakeCoords[0], randSnakeCoords[1]-1], //body
                [randSnakeCoords[0], randSnakeCoords[1]-2] //tail
    ];

    updateDisplay(snake[0],"snake","head");
    updateDisplay(snake[1],"snake","body");
    updateDisplay(snake[2],"snake", "tail");
}

function isValidStart(coords){
    //dont let the snake spawn within 3 cells of an edge of board.
    //coords are zero based, therefore 3 cells becomes 4 when looking at the value for how many rows/columns on the board.
    
    return coords[0] > 2 && coords[0] <= grid_size[0] - 4 && coords[1] > 2 && coords[1] < grid_size[1] - 4;
}

// #endregion

//#region snake logic
function movesSnake(){
    //need to check for vali array - otherwise game Over
    //check it hasnt hit itself
    //apply new data attirbutes and remove previous
    //also need to apply to the setting value within the cameCellArray
    const adjustmentArrary = [[0,1],[1,0],[0,-1],[-1,0]];
    let requiredAdjustment = adjustmentArrary[direction];
    let newCoords = getAdjustedCoords(snake[0],requiredAdjustment);
    if(!isValidCoords(gameCellArray,newCoords) || hasHitItself(newCoords)) {
        gameOver();
        return;
    }else{
        updateSnake(newCoords);
    }


}

function updateSnake(newCoords){
    updateDisplay(snake[0],"snake","body");

    snake.unshift(newCoords)
    updateDisplay(newCoords,"snake","head");

    //if fruit was eaten then we don't want to remove an item from the snake array...the snake has grown.
    if(!hasEatenFruit(newCoords)){
        //.at(-1) is get the item with the position, -1 is negative indexing/reverse search.
        const currTail = getElementFromRCDataAttribute(snake.at(-1))
        delete currTail.dataset.snake;
        snake.pop();
        updateDisplay(snake.at(-1), "snake", "tail");
    }
}

function updateDisplay(coords, dataType, dataTypeValue){
    const element = getElementFromRCDataAttribute(coords);
    element.dataset[dataType] = dataTypeValue
}

function attemptFruitSpawn(){
    if(fruitExists) return;
    const fruit = setFruitLocation();
    updateDisplay(fruit, "fruit", "apple")

    fruitExists === true
}

function setFruitLocation(){
    let coords = [];
    while (coords.length === 0) {
        const coordsToCheck = getRandomArrayItem(gameCellArray);
        const snakeCoordsString = new Set(snake.map(([x,y]) => `${x},${y}`));
        if (!snakeCoordsString.has(`${coordsToCheck[0]},${coordsToCheck[1]}`)){
            coords = coordsToCheck
        }
    };
    return coords;
}

function hasEatenFruit(newCoords){
    const element = getElementFromRCDataAttribute(newCoords);
    if (element.dataset.fruit) return true;

    return false;
}

function hasHitItself(newCoords){
    const element = getElementFromRCDataAttribute(newCoords);
    if (element.dataset.snake) return true;

    return false;
}

function gameOver(){
    clearInterval(snakeMovementTimer);
    clearInterval(fruitSpawnTimer);
    alert("Game Over");
}


//#endregion