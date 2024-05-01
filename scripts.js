// Creating tiles

const gameTileProto = {
    
    getRow: function () { 
        console.log(this.row);
    },
    
    getCol: function () { 
        console.log(this.col); 
    },
    
    getOccup: function () { 
        console.log(this.occup); 
    },
    
    setOccup: function (newOccup) {
        if (["p1", "p2", "empty"].includes(newOccup)) {
            this.occup = newOccup;
        } else {
            console.log("The tile can be 'empty', 'p1', or 'p2'");
        }
    },
}

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
}

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
            console.log(`Row ${rowName} with ${firstTileOccup} wins!`);
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
            console.log(`Row ${colName} with ${firstTileOccup} wins!`);
        }
    });
};

function checkDiag() {
    if ()
}