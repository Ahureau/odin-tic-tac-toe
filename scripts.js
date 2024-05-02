// This has all the functions to run the game

const gameEngine = (function(){
    
    // Creating tiles

    const gameTileProto = {
        reset: function() {
            this.occup = "empty";
        },

        isEmpty: function(){
            return this.occup === "empty" ? true : false;
        },
        
        setOccup: function (newOccup) {
            if (["X", "O"].includes(newOccup)) {
                this.occup = newOccup;

                printBoard();

            } else {
                return false;
            }
        },
    };

    const gameTileFactory = function(row, col){
        const tile = Object.create(gameTileProto);

        tile.occup = "empty";
        tile.row = row;
        tile.col = col;

        return tile;
    };


    // Creating board

    const boardCreate = function(){
        const rowSetter = [
            "a", "a", "a",
            "b", "b", "b",
            "c", "c", "c"
        ];

        const colSetter = [
            1, 2, 3,
            1, 2, 3,
            1, 2, 3
        ];

        let board = {};

        for (let i = 0; i < 9; i++){
            let tile = gameTileFactory(rowSetter[i], colSetter[i]);
            board[`${tile.row}${tile.col}`] = tile;
        }

        return board;
    };

    const board = boardCreate();



    // Check winning conditions

    function checkRows() {
        let tiles = Object.values(board);
        let rows = {
            a: [],
            b: [],
            c: [],
        };

        tiles.forEach(tile => {
            rows[tile.row].push(tile);
        });

        let result = Object.entries(rows).find(([rowName, rowTiles]) => {
            let firstTileOccup = rowTiles[0].occup;

            let allSame = rowTiles.every(tile => tile.occup === firstTileOccup);

            return allSame && firstTileOccup !== "empty";
        });

        return result ? result[1][0].occup : null;
    };

    function checkCols() {
        let tiles = Object.values(board);
        let cols = {
            "1": [],
            "2": [],
            "3": [],
        };

        tiles.forEach(tile => {
            cols[tile.col].push(tile);
        });

        let result = Object.entries(cols).find(([colName, colTiles]) => {
            let firstTileOccup = colTiles[0].occup;

            let allSame = colTiles.every(tile => tile.occup === firstTileOccup);

            return allSame && firstTileOccup !== "empty";
        });

        return result ? result[1][0].occup : null;
    };

    function checkDiag() {
        if (((board.a1.occup === board.b2.occup && board.a1.occup === board.c3.occup) ||
            (board.c1.occup === board.b2.occup && board.c1.occup === board.a3.occup)) &&
            board.b2.occup !== "empty"){
                return board.b2.occup;
            }
    }

    function checkWin() {
        let result = checkRows();
        if (result) {
            return result;
        }

        result = checkCols();
        if (result) {
            return result;
        }

        result = checkDiag();
        if (result) {
            return result;
        }

        return result;
    };

    function checkDraw(){    
        let draw = true;
        
        for (const tile in board){
            if (board[tile].occup === "empty"){
                draw = false;
                break;
            }
        }

        return draw;
    }




    // Game run

    function printBoard() {
        let boardString = '';
        for (let row of ['a', 'b', 'c']) {
            for (let col of [1, 2, 3]) {
                const tile = board[`${row}${col}`];
                boardString += tile.occup === 'empty' ? ' ' : tile.occup;
                if (col < 3) {
                    boardString += ' || ';
                }
            }
            if (row < 'c') {
                boardString += '\n';
            }
        }
        console.log(boardString);
    }

    function restart(){
        for (const tile in board) {
            board[tile].reset();
        }
        printBoard();
    };

    function playerToggle(player){
        return player === "X" ? "O" : "X";
    }

    function round(player){
        let tile = prompt(`${player} plays next`);

        if (Object.keys(board).includes(tile)){
            if (board[tile].isEmpty()) {
                board[tile].setOccup(player);
            } else {
                alert("Pick an empty tile");
                round(player);
            };
        } else {
            alert("pick a valid value")
            round(player);
        }
    }

    function roundLoop(){
        let player = "X"

        do {
            round(player);
            player = playerToggle(player);
        } while (!checkWin() && !checkDraw())

        if (checkWin()){
            console.log(`${checkWin()} is the winner!`)
        } 

        if (checkDraw()) {
            console.log(`It's a draw!`)
        }
    }


    function run() {
        restart();

        roundLoop();
    }

    return {
        board,
        restart,
    }
})();



// DOM interactions with game engine

const selector = (function(){
    const buttons = document.querySelectorAll("#gameContainer > .tile > input");
    const gameBoard = document.querySelector("#gameContainer");
    const resetBtn = document.querySelector("#resetBtn");
    const playerX = "./images/X.svg";
    const playerO = "./images/O.svg";
    const currentPlayer = document.querySelector("#playerIcon");
    let hiddenPlayer = "X";
    const togglePlayer = function(){
        hiddenPlayer= hiddenPlayer === "X" ? "O" : "X";
    };
    const showHidden = function(){
        return hiddenPlayer;
    };
    const boardKeys = Object.keys(gameEngine.board);
    const boardTiles = gameEngine.board;

    return {
        buttons,
        gameBoard,
        boardKeys,
        boardTiles,
        resetBtn,
        playerX,
        playerO,
        currentPlayer,
        togglePlayer,
        showHidden,
    }
})();

(function assignButtonId(){
    for (let i = 0; i < selector.boardKeys.length; i++){
        selector.buttons[i].setAttribute("id", selector.boardKeys[i])
    }
})();

function setChoice(tile, choice){
    if (selector.boardTiles[tile].isEmpty()){
        selector.boardTiles[tile].setOccup(choice);
    } else {
        console.log(`${tile} is not empty. Pick an empty tile!`)
    }
}

function showChoice(tile, player){
    if (tile.getAttribute("class") === "") {
        switch (player){
            case "X":
                tile.setAttribute("class", "playerX");
                rotatePlayer();
                break;
            case "O":
                tile.setAttribute("class", "playerO");
                rotatePlayer();
                break;
    }}
}

function rotatePlayer() {
    selector.currentPlayer.setAttribute("src",
        (selector.currentPlayer.getAttribute("src") === selector.playerX
            ? selector.playerO
            : selector.playerX));

    selector.togglePlayer();
}

function resetBoard(){
    for (let button of selector.buttons) {
        button.setAttribute("class", "");
    }
}

selector.gameBoard.addEventListener("click", (event) => {
    const target = event.target;
    
    setChoice(target.id, selector.showHidden());

    showChoice(target, selector.showHidden());
})

selector.resetBtn.addEventListener("click", () => {
    gameEngine.restart();

    resetBoard();
})