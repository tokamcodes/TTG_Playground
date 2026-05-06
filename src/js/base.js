document.addEventListener("DOMContentLoaded", () => {
    const gameLinks = document.querySelectorAll(`[data-gameboard]`);

    for(const gl of gameLinks){
        gl.addEventListener("click", loadGame);
    };
})

async function loadGame(event){
    event.preventDefault();

    const gameFile = event.target.dataset.gameboard;
    const [jsFiles, cssFiles] = getComponents(gameFile);
    const gameBoard = document.getElementById('gameboard');

    removeGameCSS();

    const html = await fetch(`/partials/${gameFile}.html`).then(h => h.text())
    gameBoard.innerHTML = html;

    //check if css files are already in the head, if not then load them.
    for ( const f of cssFiles){
        if(!document.getElementById(`css-${f}`)){
            const link = document.createElement('link');
            link.id = `css-${f}`;
            link.rel = 'stylesheet';
            link.href = `/src/styles/${f}.css`
            document.head.appendChild(link);
        }
    }

    const gameJS = await import(`/src/js/${jsFiles}.js`);

    if (gameJS.init) gameJS.init();

    //may need to look at initialisation calls here.


}

function removeGameCSS(){
    const loadedCSS = document.querySelectorAll(`[id^="css-"]`)
    for (const c of loadedCSS){
        c.remove();
    };
}

function getComponents(gameFile){
    const comps = {
        //As we are running js as modules, the import takes care of the common functions and those files do not need to be directly loaded.
        //game:[jsFile,[css files]]
        'Minesweeper':['minesweeper',['gridgames','minesweeper']],
        'Snake': ['snake',['gridgames','snake']]
    };
    return comps[gameFile]
}