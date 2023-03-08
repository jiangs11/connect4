import { useState, useEffect, useReducer } from "react";
import { Row } from "./Row";
import { Flex } from "@chakra-ui/layout";
import { Button, Text } from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { RiArrowDownSFill } from "react-icons/ri";
import {
    generateNewBoard,
    placePiece,
    checkWinner,
    checkMaxedColumn,
    toggleWinningCellBlink,
    toggleCursorPointer,
} from "../utility/utilityFunctions";

const numRows = 7;
const numCols = 8;

const gameReducer = (state, action) => {
    switch (action.type) {
        case "newGame":
            return {
                ...state,
                board: action.board,
                currentPlayer: 1,
                winningCellIds: [],
                gameOver: false,
            };
        case "switchPlayer":
            return {
                ...state,
                board: action.updatedBoard,
                currentPlayer: action.switchPlayer,
            };
        case "endGame":
            return {
                ...state,
                board: action.updatedBoard,
                player1WinCount: action.player1WinCount,
                player2WinCount: action.player2WinCount,
                drawGameCount: action.drawGameCount,
                message: action.message,
                gameOver: true,
            };
        case "setWinningCellIDs":
            return {
                ...state,
                winningCellIds: action.winningCellIds,
            };
        default:
            throw Error(`Action "${action.type}" is not a valid action.`);
    }
};

const initialGameState = {
    player1: 1,
    player2: 2,
    currentPlayer: 1,
    board: generateNewBoard(numRows, numCols),
    // board: [
    //     [2, 2, 2, null, 1, 2, 2],
    //     [1, 1, 1, 2, 2, 1, 1],
    //     [2, 1, 2, 1, 1, 2, 2],
    //     [2, 1, 2, 2, 1, 2, 1],
    //     [1, 2, 2, 1, 1, 2, 1],
    //     [2, 1, 1, 2, 2, 1, 1],
    // ],
    player1WinCount: 0,
    player2WinCount: 0,
    drawGameCount: 0,
    winningCellIds: [],
    gameOver: false,
};

export const Board = () => {
    const [isWebBrowser, setIsWebBrowser] = useState(false);
    const [showArrow, setShowArrow] = useState(new Array(numCols).fill(false));
    const [gameState, dispatchGameState] = useReducer(
        gameReducer,
        initialGameState
    );

    useEffect(() => {
        if (typeof window.orientation === "undefined") {
            setIsWebBrowser(true);
        }
        toggleWinningCellBlink(gameState.winningCellIds);
    }, [gameState]);

    const checkForMaxColReached = (updatedBoard) => {
        for (let i = 0; i < gameState.board.length - 1; i++) {
            if (checkMaxedColumn(updatedBoard, i)) {
                document
                    .querySelectorAll(".cell")
                    .forEach((e) => (e.style.pointerEvents = "auto"));
                for (let i = 0; i < gameState.board.length - 1; i++) {
                    toggleCursorPointer(i, false);
                }
            }
        }
    };

    const play = async (columnIndex) => {
        if (gameState.gameOver) {
            handleNewGame();
            return;
        }

        document
            .getElementById("boardTable")
            .classList.toggle("disablePointerEvents");

        let updatedBoard = await placePiece(
            gameState.board,
            columnIndex,
            gameState.currentPlayer
        );

        document
            .getElementById("boardTable")
            .classList.toggle("disablePointerEvents");

        if (checkMaxedColumn(updatedBoard, columnIndex)) {
            toggleCursorPointer(columnIndex, true);
        }

        let result = checkWinner(updatedBoard, dispatchGameState);
        if (result === true) {
            var player1WinCount = gameState.player1WinCount;
            var player2WinCount = gameState.player2WinCount;
            var playerColor = "";

            if (gameState.currentPlayer === gameState.player1) {
                playerColor = "red";
                player1WinCount += 1;
            } else {
                playerColor = "yellow";
                player2WinCount += 1;
            }
            checkForMaxColReached(updatedBoard, columnIndex);
            let drawGameCount = gameState.drawGameCount;
            let message = `Player ${gameState.currentPlayer} (${playerColor}) won!`;
            dispatchGameState({
                type: "endGame",
                updatedBoard,
                message,
                player1WinCount,
                player2WinCount,
                drawGameCount,
            });
        } else if (result === "DRAW") {
            let player1WinCount = gameState.player1WinCount;
            let player2WinCount = gameState.player2WinCount;
            let drawGameCount = gameState.drawGameCount + 1;
            checkForMaxColReached(updatedBoard, columnIndex);

            let message = `It was a DRAW!`;
            dispatchGameState({
                type: "endGame",
                updatedBoard,
                message,
                player1WinCount,
                player2WinCount,
                drawGameCount,
            });
        } else {
            var switchPlayer;
            if (gameState.currentPlayer === gameState.player1) {
                switchPlayer = gameState.player2;
            } else {
                switchPlayer = gameState.player1;
            }
            dispatchGameState({
                type: "switchPlayer",
                updatedBoard,
                switchPlayer,
            });
            document
                .getElementById(gameState.player1)
                .classList.toggle("player1Active");
            document
                .getElementById(gameState.player2)
                .classList.toggle("player2Active");
        }
    };

    const handleNewGame = () => {
        toggleWinningCellBlink(gameState.winningCellIds);
        dispatchGameState({
            type: "newGame",
            board: generateNewBoard(numRows, numCols),
        });
        for (let i = 0; i < gameState.board.length - 1; i++) {
            toggleCursorPointer(i, false);
        }
        resetPlayerActive();
    };

    const resetPlayerActive = () => {
        const player1 = document.getElementById(gameState.player1);
        player1.classList.remove("player1Active");
        player1.classList.add("player1Active");

        document
            .getElementById(gameState.player2)
            .classList.remove("player2Active");
    };

    const handleHoverEvent = (allClassNames, mouseEnter) => {
        var newShowArrow = new Array(numCols).fill(false);

        if (mouseEnter) {
            const found = allClassNames.match(/col(.*)/);
            const colWithIndex = found[0].split(" ")[0];
            const index = colWithIndex.replace("col", "");
            newShowArrow[index] = true;
        }
        setShowArrow(newShowArrow);
    };

    const styles = {
        maxWidth: 520
    }

    return (
        <>
            <Flex
                justify="center"
                align="center"
                direction="column"
                style={{
                    width: "100%",
                    maxWidth: "100%",
                }}
            >
                {isWebBrowser && (
                    <Flex
                        justify="space-evenly"
                        align="center"
                        style={{
                            width: window.innerWidth - 50,
                            maxWidth: styles.maxWidth,
                            marginTop: -20,
                        }}
                    >
                        <IconContext.Provider
                            value={{ className: "shared-class", size: 100 }}
                        >
                            {gameState.board[0].map((_, i) =>
                                showArrow[i] ? (
                                    <RiArrowDownSFill
                                        key={i}
                                        style={{
                                            color:
                                                gameState.currentPlayer === 1
                                                    ? "red"
                                                    : "black",
                                            height: 50,
                                            marginBottom: -10,
                                        }}
                                    />
                                ) : (
                                    <RiArrowDownSFill
                                        key={i}
                                        style={{
                                            height: 50,
                                            marginBottom: -10,
                                            opacity: 0,
                                        }}
                                    />
                                )
                            )}
                        </IconContext.Provider>
                    </Flex>
                )}
                <table
                    id="boardTable"
                    style={{
                        backgroundColor: "#1990ff",
                        width: window.innerWidth - 50,
                        maxWidth: styles.maxWidth,
                    }}
                >
                    <tbody>
                        {gameState.board.map((row, i) => (
                            <Row
                                key={i}
                                row={row}
                                rowIndex={i}
                                play={play}
                                handleHoverEvent={handleHoverEvent}
                            />
                        ))}
                    </tbody>
                </table>
                <Flex
                    justify="space-evenly"
                    align="center"
                    className="scoreboard"
                    style={{
                        width: styles.maxWidth,
                        maxWidth: "100%",
                        marginTop: 5,
                    }}
                >
                    <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        id="1"
                        className="player1 player1Active"
                    >
                        <Text>Player One</Text>
                        <Text>{gameState.player1WinCount}</Text>
                    </Flex>
                    <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        id="draw"
                        className="draw"
                    >
                        <Text>Draw</Text>
                        <Text>{gameState.drawGameCount}</Text>
                    </Flex>
                    <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        id="2"
                        className="player2"
                    >
                        <Text>Player Two</Text>
                        <Text>{gameState.player2WinCount}</Text>
                    </Flex>
                </Flex>
            </Flex>

            <Button
                colorScheme="purple"
                style={{ marginTop: 5 }}
                onClick={() => handleNewGame()}
            >
                New Game
            </Button>
        </>
    );
};
