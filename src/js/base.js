document.addEventListener("DOMContentLoaded", () => {
    const gameLinks = document.querySelectorAll(`[Data-GameBoard]`);

    for(const gl of gameLinks){
        gl.addEventListener("click", loadGame);
    };
})

function loadGame(event){
    let gameFile = event.target.dataset.GameBoard;
    
}