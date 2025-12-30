// Author: Michael Lopez
// Last Updated Date: 2025-12-27
// Purpose: This component manages the overall game state and integrates the game board with chat functionality. 
// It ensures real-time communication between players using the Stream Chat API and handles game events such as 
// player joining, leaving, and determining the game result (win or tie). The component also provides a chat window 
// for players to communicate during the game.

import React, { useState } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./Chat.css";

function Game({ channel, setChannel }) {
    // State to track if both players have joined the game
    const [playersJoined, setPlayersJoined] = useState(
        channel.state.watcher_count == 2 // Check if there are two watchers (players)
    );

    // State to track the game result (winner or tie)
    const [result, setResult] = useState({ winner: "none", state: "none" });

    // Listen for the "user.watching.start" event to detect when a player joins
    channel.on("user.watching.start", (event) => {
        setPlayersJoined(event.watcher_count == 2); // Update state when two players are present
    });

    // If not all players have joined, display a waiting message
    if (!playersJoined) {
        <div>Waiting for other player to join....</div>;
    }

    return (
        <div className="gameContainer">
            {/* Render the game board and pass the result state */}
            <Board result={result} setResult={setResult} />
            {/* Render the chat window */}
            <Window>
                <MessageList
                    disableDateSeparator
                    closeReactionSelectorOnClick
                    hideDeletedMessages
                    messageActions={["react"]} // Allow reactions to messages
                />
                <MessageInput noFiles /> {/* Input field for sending messages */}
            </Window>
            {/* Button to leave the game */}
            <button
                onClick={async () => {
                    await channel.stopWatching(); // Stop watching the channel
                    setChannel(null); // Reset the channel state
                }}
            >
                Leave Game
            </button>
            {/* Display the game result */}
            {result.state == "won" && <div>{result.winner} Won the game!</div>}
            {result.state == "tie" && <div>{result.winner} Game tied!</div>}
        </div>
    );
}

export default Game;