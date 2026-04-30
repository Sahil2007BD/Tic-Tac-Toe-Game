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

    currPlayer = playerO;
    gameOver = false;

    document.getElementById("status").innerText = "Current Turn: " + currPlayer;

    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            tile.classList.add("tile");

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
    this.innerHTML = `<span>${currPlayer}</span>`;

    if (checkWinner()) {
        document.getElementById("status").innerText = "Winner: " + currPlayer;
        gameOver = true;
        launchConfetti();
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
        if (board[r][0] !== ' ' &&
            board[r][0] === board[r][1] &&
            board[r][1] === board[r][2]) {
            highlight(r, 0, r, 1, r, 2);
            drawLine("row", r);
            return true;
        }
    }

    for (let c = 0; c < 3; c++) {
        if (board[0][c] !== ' ' &&
            board[0][c] === board[1][c] &&
            board[1][c] === board[2][c]) {
            highlight(0, c, 1, c, 2, c);
            drawLine("col", c);
            return true;
        }
    }

    if (board[0][0] !== ' ' &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]) {
        highlight(0, 0, 1, 1, 2, 2);
        drawLine("diag");
        return true;
    }

    if (board[0][2] !== ' ' &&
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0]) {
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
   WINNING LINE
   ========================= */

function drawLine(type, index) {
    const boardEl = document.getElementById("board");

    let startTile, endTile;

    if (type === "row") {
        startTile = document.getElementById(`${index}-0`);
        endTile = document.getElementById(`${index}-2`);
    }

    if (type === "col") {
        startTile = document.getElementById(`0-${index}`);
        endTile = document.getElementById(`2-${index}`);
    }

    if (type === "diag") {
        startTile = document.getElementById(`0-0`);
        endTile = document.getElementById(`2-2`);
    }

    if (type === "anti") {
        startTile = document.getElementById(`0-2`);
        endTile = document.getElementById(`2-0`);
    }

    const boardRect = boardEl.getBoundingClientRect();
    const startRect = startTile.getBoundingClientRect();
    const endRect = endTile.getBoundingClientRect();

    const x1 = startRect.left + startRect.width / 2 - boardRect.left;
    const y1 = startRect.top + startRect.height / 2 - boardRect.top;

    const x2 = endRect.left + endRect.width / 2 - boardRect.left;
    const y2 = endRect.top + endRect.height / 2 - boardRect.top;

    const line = document.createElement("div");
    line.classList.add("line");

    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = length + "px";
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";
    line.style.transform = `rotate(${angle}deg)`;

    boardEl.appendChild(line);
}

/* =========================
   RESET
   ========================= */

function resetGame() {
    document.getElementById("board").innerHTML = "";
    currPlayer = playerO;
    gameOver = false;
    setGame();
}

/* =========================
   CONFETTI
   ========================= */

function launchConfetti() {
    const colors = ["#ff4d4d", "#4f46e5", "#22c55e", "#f59e0b", "#06b6d4"];

    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 1 + 1.5) + "s";

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}