import { useReducer } from "react";
import { Row } from "./Row";
import { Flex } from "@chakra-ui/layout";
import { Button, Text } from "@chakra-ui/react";
import {
    generateNewBoard,
    placePiece,
    checkWinner,
    checkMaxedColumn,
    disableCellClick,
} from "../utility/utilityFunctions";

const gameReducer = (state, action) => {
    switch (action.type) {
        case "newGame":
            return {
                ...state,
                board: action.board,
                currentPlayer: 1,
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
        default:
            throw Error(`Action "${action.type}" is not a valid action.`);
    }
};

const initialGameState = {
    player1: 1,
    player2: 2,
    currentPlayer: 1,
    board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ],
    player1WinCount: 0,
    player2WinCount: 0,
    drawGameCount: 0,
    gameOver: false,
};

export const Board = () => {
    const [gameState, dispatchGameState] = useReducer(
        gameReducer,
        initialGameState
    );

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

        console.log("UPDATED BOARD: ", updatedBoard);

        if (checkMaxedColumn(updatedBoard, columnIndex)) {
            disableCellClick(columnIndex);
        }

        let result = checkWinner(updatedBoard);
        if (result === true) {
            var player1WinCount = gameState.player1WinCount;
            var player2WinCount = gameState.player2WinCount;

            if (gameState.currentPlayer === gameState.player1) {
                var playerColor = "red";
                player1WinCount += 1;
            } else {
                var playerColor = "yellow";
                player2WinCount += 1;
            }
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
            document
                .getElementById(gameState.currentPlayer)
                .classList.toggle("winnerBlinker");
        } else if (result === "DRAW") {
            var player1WinCount = gameState.player1WinCount;
            var player2WinCount = gameState.player2WinCount;
            var drawGameCount = gameState.drawGameCount + 1;

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
        dispatchGameState({ type: "newGame", board: generateNewBoard() });
        document
            .querySelectorAll(".cell")
            .forEach((e) => (e.style.pointerEvents = "auto"));
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

    return (
        <>
            <Flex
                justify="center"
                align="center"
                direction="column"
                style={{ width: "100%", maxWidth: '100%' }}
            >
                <table
                    id="boardTable"
                    style={{
                        backgroundColor: "#1990ff",
                        width: window.innerWidth - 50,
                        maxWidth: "500px",
                        // backgroundColor: "green",

                        // transform: "perspective(75em) rotateX(-1deg)",
                        // boxShadow:
                        //     "rgba(22, 31, 39, 0.42) 0px 60px 123px -25px, rgba(19, 26, 32, 0.08) 0px 35px 75px -35px",
                        // borderColor:
                        //     "rgb(213, 220, 226), rgb(213, 220, 226), rgb(184, 194, 204)",
                    }}
                >
                    <tbody>
                        {gameState.board.map((row, i) => (
                            <Row key={i} row={row} play={play} />
                        ))}
                    </tbody>
                </table>
                <Flex
                    justify="space-evenly"
                    align="center"
                    className="scoreboard"
                    style={{
                        width: "500px",
                        maxWidth: "100%",
                        marginTop: 10,
                    }}
                >
                    <Flex
                        justify="center"
                        align="center"
                        direction="column"
                        id="1"
                        className="player1 player1Active"
                        // style={{ backgroundColor: 'orange' }}
                    >
                        <Text>Player 1</Text>
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
                        <Text>Player 2</Text>
                        <Text>{gameState.player2WinCount}</Text>
                    </Flex>
                </Flex>
            </Flex>

            <Button colorScheme="purple" onClick={() => handleNewGame()}>
                New Game
            </Button>
        </>
    );
};
