var board;
var playerO = "O";
var playerX = "X";
var currPlayer = playerO;
var gameOver = false;

window.onload = function () {
    setGame();

    document.getElementById("darkModeToggle").addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });

    document.getElementById("reset").addEventListener("click", resetGame);
};

function setGame() {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];

    document.getElementById("status").innerText = "Current Turn: " + currPlayer;

    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = ""; // IMPORTANT FIX (prevents stacking tiles)

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            tile.classList.add("tile");

            if (r < 2) tile.classList.add("horizontal-line");
            if (c < 2) tile.classList.add("vertical-line");

            tile.innerText = "";
            tile.addEventListener("click", setTile);

            boardDiv.appendChild(tile);
        }
    }
}

function setTile() {
    if (gameOver) return;

    let [r, c] = this.id.split("-").map(Number);

    if (board[r][c] !== ' ') return;

    board[r][c] = currPlayer;
    this.innerText = currPlayer;

    if (checkWinner()) {
        document.getElementById("status").innerText = "Winner: " + currPlayer;
        gameOver = true;
        return;
    }

    if (checkDraw()) {
        document.getElementById("status").innerText = "It's a Draw!";
        gameOver = true;
        return;
    }

    currPlayer = (currPlayer === playerO) ? playerX : playerO;
    document.getElementById("status").innerText = "Current Turn: " + currPlayer;
}

function checkWinner() {
    for (let r = 0; r < 3; r++) {
        if (board[r][0] === board[r][1] &&
            board[r][1] === board[r][2] &&
            board[r][0] !== ' ') {
            highlight(r, 0, r, 1, r, 2);
            drawLine("row", r);
            return true;
        }
    }

    for (let c = 0; c < 3; c++) {
        if (board[0][c] === board[1][c] &&
            board[1][c] === board[2][c] &&
            board[0][c] !== ' ') {
            highlight(0, c, 1, c, 2, c);
            drawLine("col", c);
            return true;
        }
    }

    if (board[0][0] === board[1][1] &&
        board[1][1] === board[2][2] &&
        board[0][0] !== ' ') {
        highlight(0, 0, 1, 1, 2, 2);
        drawLine("diag");
        return true;
    }

    if (board[0][2] === board[1][1] &&
        board[1][1] === board[2][0] &&
        board[0][2] !== ' ') {
        highlight(0, 2, 1, 1, 2, 0);
        drawLine("anti");
        return true;
    }

    return false;
}

function highlight(r1, c1, r2, c2, r3, c3) {
    document.getElementById(`${r1}-${c1}`).classList.add("winner");
    document.getElementById(`${r2}-${c2}`).classList.add("winner");
    document.getElementById(`${r3}-${c3}`).classList.add("winner");
}

function checkDraw() {
    return board.flat().every(cell => cell !== ' ');
}

/* =========================
   FIXED DRAW LINE (IMPORTANT)
   ========================= */

function drawLine(type, index) {
    const line = document.createElement("div");
    line.classList.add("line");

    const boardEl = document.getElementById("board");
    const rect = boardEl.getBoundingClientRect();

    const size = rect.width;
    const cell = size / 3;

    let x1, y1, x2, y2;

    // ROWS
    if (type === "row") {
        x1 = 0;
        x2 = size;
        y1 = y2 = cell * index + cell / 2;
    }

    // COLUMNS
    if (type === "col") {
        y1 = 0;
        y2 = size;
        x1 = x2 = cell * index + cell / 2;
    }

    // DIAGONAL \
    if (type === "diag") {
        x1 = 0;
        y1 = 0;
        x2 = size;
        y2 = size;
    }

    // DIAGONAL /
    if (type === "anti") {
        x1 = size;
        y1 = 0;
        x2 = 0;
        y2 = size;
    }

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.position = "absolute";
    line.style.height = "5px";
    line.style.width = length + "px";
    line.style.background = "red";

    line.style.left = x1 + "px";
    line.style.top = y1 + "px";

    line.style.transformOrigin = "0 50%";
    line.style.transform = `rotate(${angle}deg)`;

    boardEl.appendChild(line);
}

function resetGame() {
    document.getElementById("board").innerHTML = "";
    currPlayer = playerO;
    gameOver = false;
    setGame();
}