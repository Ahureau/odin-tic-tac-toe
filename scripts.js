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

    Object.entries(rows).forEach(([rowName, rowTiles]) => {
        let firstTileOccup = rowTiles[0].occup;

        let allSame = rowTiles.every(tile => tile.occup === firstTileOccup);

        if (allSame && firstTileOccup !== "empty") {
            return firstTileOccup; // changed this to pass winner
        } else {
            return false
        }
    });
};

function checkCol() {
    let tiles = Object.values(board);
    let cols = {
        "1": [],
        "2": [],
        "3": [],
    };

    tiles.forEach(tile => {
        cols[tile.col].push(tile);
    });

    Object.entries(cols).forEach(([colName, colTiles]) => {
        let firstTileOccup = colTiles[0].occup;

        let allSame = colTiles.every(tile => tile.occup === firstTileOccup);

        if (allSame && firstTileOccup !== "empty") {
            return firstTileOccup; // changed this to pass winner
        } else {
            return false
        }
    });
};

function checkDiag() {
    if (((board.a1.occup === board.b2.occup && board.a1.occup === board.c3.occup) ||
        (board.c1.occup === board.b2.occup && board.c1.occup === board.a3.occup)) &&
        board.b2.occup !== "empty"){
            return board.b2.occup;  // changed this to pass winner
        } else {
            return false;
        };
}

function checkWin(){
    checkRows();
    checkCol();
    checkDiag();
};




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
    let tile = prompt("Pick an empty tile (a1 to c3)");

    if (Object.keys(board).includes(tile)){
        if (board[tile].isEmpty()) {
            board[tile].setOccup(player);
        } else {
            alert("Pick an empty tile");
            round();
        };
    } else {
        alert("pick a valid value")
        round();
    }
}

function roundLoop(){
    let player = "X"

    if (!checkWin()) {
        round(player);
        playerToggle(player);
        roundLoop();
    } else {
        return checkWin()
    }
}

function run() {
    start();

    
}