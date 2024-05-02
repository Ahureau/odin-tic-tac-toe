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
            return board.b2.occup;  // changed this to pass winner
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

function start(){
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
    start();

    roundLoop();
}