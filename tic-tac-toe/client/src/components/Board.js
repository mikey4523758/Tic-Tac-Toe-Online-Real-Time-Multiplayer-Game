// Author: Michael Lopez
// Last Updated Date: 2025-12-27
// Purpose: This component renders the Tic-Tac-Toe game board and manages the game state, 
// including player turns, board updates, and determining the game result (win or tie). 
// It uses the Stream Chat API to synchronize game moves between players in real-time.

import React, { useEffect, useState, useCallback } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";

function Board({ result, setResult }) {
    // State to manage the board, current player, and turn
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("X"); // Player is either "X" or "O"
    const [turn, setTurn] = useState("X"); // Tracks whose turn it is

    const { channel } = useChannelStateContext(); // Access the current chat channel
    const { client } = useChatContext(); // Access the Stream Chat client

    // Function to check if there is a winner based on predefined patterns
    const checkWinner = useCallback(() => {
        Patterns.forEach((currPattern) => {
            const firstPlayer = board[currPattern[0]];
            if (firstPlayer === "") return; // Skip if the first square in the pattern is empty
            let foundWinner = true;
            currPattern.forEach((idx) => {
                if (board[idx] !== firstPlayer) {
                    foundWinner = false; // If any square in the pattern doesn't match, no winner
                }
            });
            if (foundWinner) {
                setResult({ winner: board[currPattern[0]], state: "Won" }); // Update result if a winner is found
            }
        });
    }, [board, setResult]);

    // Function to check if the game is a tie (all squares filled with no winner)
    const checkIfTie = useCallback(() => {
        let filled = true;
        board.forEach((square) => {
            if (square === "") {
                filled = false; // If any square is empty, it's not a tie
            }
        });
        if (filled) {
            setResult({ winner: "No one", state: "Tie" }); // Update result if it's a tie
        }
    }, [board, setResult]);

    // useEffect to monitor board changes and check for a winner or tie
    useEffect(() => {
        checkIfTie();
        checkWinner();
    }, [board, checkIfTie, checkWinner]);

    // Function to handle a player's move
    const chooseSquare = async (square) => {
        if (turn === player || board[square] === "") {
            setTurn(player === "X" ? "O" : "X"); // Switch turn to the other player

            await channel.sendEvent({
                type: "game-move",
                data: { square: square, player: player }, // Send game move event to the channel
            });
            setBoard(
                board.map((val, idx) => {
                    if (idx === square && val === "") {
                        return player; // Update the board with the player's move
                    }
                    return val;
                })
            );
        }
    };

    // Listen for game-move events from the channel
    channel.on((event) => {
        if (event.type === "game-move" && event.user.id !== client.userID) {
            const currentPlayer = event.data.player === "X" ? "O" : "X";
            setPlayer(currentPlayer); // Update the current player
            setTurn(currentPlayer); // Update the turn

            setBoard(
                board.map((val, idx) => {
                    if (idx === event.data.square && val === "") {
                        return event.data.player; // Update the board with the opponent's move
                    }
                    return val;
                })
            );
        }
    });

    // Render the Tic-Tac-Toe board
    return (
        <div className="board">
            <div className="row">
                <Square chooseSquare={() => chooseSquare(0)} val={board[0]} />
                <Square chooseSquare={() => chooseSquare(1)} val={board[1]} />
                <Square chooseSquare={() => chooseSquare(2)} val={board[2]} />
            </div>
            <div className="row">
                <Square chooseSquare={() => chooseSquare(3)} val={board[3]} />
                <Square chooseSquare={() => chooseSquare(4)} val={board[4]} />
                <Square chooseSquare={() => chooseSquare(5)} val={board[5]} />
            </div>
            <div className="row">
                <Square chooseSquare={() => chooseSquare(6)} val={board[6]} />
                <Square chooseSquare={() => chooseSquare(7)} val={board[7]} />
                <Square chooseSquare={() => chooseSquare(8)} val={board[8]} />
            </div>
        </div>
    );
}

export default Board;