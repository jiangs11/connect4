export const deepCloneBoard = (board) => {
    const finalClone = [];
    for (let i = 0; i < board.length; i++) {
        finalClone.push([...board[i]]);
    }
    return finalClone;
};

export const generateNewBoard = (rows, columns) => {
    return new Array(rows).fill(null).map(() => new Array(columns).fill(null));
};

export const placePiece = async (board, columnIndex, player) => {
    let newBoard = deepCloneBoard(board);

    let i;
    for (i = newBoard.length - 1; i >= 0; i--) {
        if (newBoard[i][columnIndex] === null) {
            newBoard[i][columnIndex] = player;
            break;
        }
    }

    const allCellsInColumn = [
        ...document.querySelectorAll(".colCircle" + columnIndex),
    ];

    // Only keep the empty cells index
    const emptyCells = allCellsInColumn.slice(0, i);
    const colorClass = player === 1 ? "redCircle" : "yellowCircle";
    const waitTime = 60;

    var promiseArray = [];
    for (const cell of emptyCells) {
        cell.classList.add(colorClass);
        const promise = await wait(waitTime);
        promiseArray.push(promise);
        cell.classList.remove(colorClass);
    }
    await Promise.all(promiseArray);
    return newBoard;
};

const wait = (delay, ...args) =>
    new Promise((resolve) => setTimeout(resolve, delay, ...args));

export const checkMaxedColumn = (board, columnIndex) => {
    return board[0][columnIndex] === null ? false : true;
};

const checkVerticalWin = (board, dispatchGameState) => {
    const winningCellIds = [];

    for (let i = board.length - 1; i > 2; i--) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === null) {
                continue;
            }

            if (
                board[i][j] === board[i - 1][j] &&
                board[i][j] === board[i - 2][j] &&
                board[i][j] === board[i - 3][j]
            ) {
                winningCellIds.push("" + i + j);
                winningCellIds.push("" + (i - 1) + j);
                winningCellIds.push("" + (i - 2) + j);
                winningCellIds.push("" + (i - 3) + j);
                dispatchGameState({
                    type: "setWinningCellIDs",
                    winningCellIds,
                });
                console.log(board[i][j], "won using vertical");
                return true;
            }
        }
    }
    return false;
};

const checkHorizontalWin = (board, dispatchGameState) => {
    const winningCellIds = [];

    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length - 3; j++) {
            if (board[i][j] === null) {
                continue;
            }

            if (
                board[i][j] === board[i][j + 1] &&
                board[i][j] === board[i][j + 2] &&
                board[i][j] === board[i][j + 3]
            ) {
                winningCellIds.push("" + i + j);
                winningCellIds.push("" + i + (j + 1));
                winningCellIds.push("" + i + (j + 2));
                winningCellIds.push("" + i + (j + 3));
                dispatchGameState({
                    type: "setWinningCellIDs",
                    winningCellIds,
                });
                console.log(board[i][j], "won using horizontal");
                return true;
            }
        }
    }
    return false;
};

const checkForwardSlashDiagonalWin = (board, dispatchGameState) => {
    const winningCellIds = [];

    for (let i = board.length - 1; i > 2; i--) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === null) {
                continue;
            }

            if (
                board[i][j] === board[i - 1][j + 1] &&
                board[i][j] === board[i - 2][j + 2] &&
                board[i][j] === board[i - 3][j + 3]
            ) {
                winningCellIds.push("" + i + j);
                winningCellIds.push("" + (i - 1) + (j + 1));
                winningCellIds.push("" + (i - 2) + (j + 2));
                winningCellIds.push("" + (i - 3) + (j + 3));
                dispatchGameState({
                    type: "setWinningCellIDs",
                    winningCellIds,
                });
                console.log(board[i][j], "won using forward slash diagonal");
                return true;
            }
        }
    }
    return false;
};

const checkBackwardSlashDiagonalWin = (board, dispatchGameState) => {
    const winningCellIds = [];

    for (let i = board.length - 4; i >= 0; i--) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === null) {
                continue;
            }

            if (
                board[i][j] === board[i + 1][j + 1] &&
                board[i][j] === board[i + 2][j + 2] &&
                board[i][j] === board[i + 3][j + 3]
            ) {
                winningCellIds.push("" + i + j);
                winningCellIds.push("" + (i + 1) + (j + 1));
                winningCellIds.push("" + (i + 2) + (j + 2));
                winningCellIds.push("" + (i + 3) + (j + 3));
                dispatchGameState({
                    type: "setWinningCellIDs",
                    winningCellIds,
                });
                console.log(board[i][j], "won using backslash diagonal");
                return true;
            }
        }
    }
    return false;
};

const checkDraw = (board) => {
    if (!board.some((row) => row.includes(null))) {
        return "DRAW";
    } else {
        return false;
    }
};

export const checkWinner = (board, dispatchGameState) => {
    return (
        checkForwardSlashDiagonalWin(board, dispatchGameState) ||
        checkBackwardSlashDiagonalWin(board, dispatchGameState) ||
        checkHorizontalWin(board, dispatchGameState) ||
        checkVerticalWin(board, dispatchGameState) ||
        checkDraw(board)
    );
};

export const toggleWinningCellBlink = (winningCellIds) => {
    for (const rowColNum of winningCellIds) {
        const element = document.getElementById("cellNumber" + rowColNum);
        element.classList.toggle("blinkCell");
    }
};

export const toggleCursorPointer = (columnIndex, removeCursorPointer) => {
    const columnsToDisable = document.getElementsByClassName(
        "col" + columnIndex
    );

    for (let i = 0; i < columnsToDisable.length; i++) {
        if (removeCursorPointer) {
            columnsToDisable[i].style.pointerEvents = "none";
            columnsToDisable[i].classList.remove("cursorPointer");
        } else {
            columnsToDisable[i].classList.add("cursorPointer");
        }
    }
};

// export const test = (columnIndex, removeCursorPointer) => {
//     const columnsToDisable = document.getElementsByClassName(
//         "col" + columnIndex
//     );

//     for (let i = 0; i < columnsToDisable.length; i++) {
//         if (disablePointEvent) {
//             columnsToDisable[i].style.pointerEvents = "none";
//         }
//         columnsToDisable[i].classList.toggle("cursorPointer");
//     }
// };
