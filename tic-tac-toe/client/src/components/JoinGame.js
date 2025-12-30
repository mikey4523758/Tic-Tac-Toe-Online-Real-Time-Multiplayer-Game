// Author: Michael Lopez
// Last Updated Date: 2025-12-27
// Purpose: This component allows users to join or create a game channel with a rival user. 
// It uses the Stream Chat API to establish a messaging channel between two players, enabling 
// real-time communication and gameplay. The component also renders the game interface once 
// the channel is successfully created.

import { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame() {
    // State to store the rival's username
    const [rivalUsername, setRivalUsername] = useState("");
    const { client } = useChatContext(); // Access the Stream Chat client
    const [channel, setChannel] = useState(null); // State to store the current channel

    // Function to create or join a channel with the rival user
    const createChannel = async () => {
        const response = await client.queryUsers({ name: { $eq: rivalUsername } }); // Query for the rival user

        if (response.users.length === 0) {
            alert("User not found!"); // Alert if the rival user does not exist
            return;
        }

        // Create a new messaging channel with the current user and the rival user
        const newchannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id],
        });

        await newchannel.watch(); // Start watching the channel for real-time updates
        setChannel(newchannel); // Set the channel state
    };

    return (
        <>
            {channel ? (
                // If a channel exists, render the game interface
                <Channel channel={channel} Input={CustomInput}>
                    <Game channel={channel} setChannel={setChannel} />
                </Channel>
            ) : (
                // If no channel exists, render the join/create game form
                <div className="JoinGame">
                    <h4>Create Game</h4>
                    <input
                        placeholder="Username of rival..."
                        onChange={(event) => {
                            setRivalUsername(event.target.value); // Update the rival username state
                        }}
                    />
                    <button onClick={createChannel}>Join/Start Game</button>
                </div>
            )}
        </>
    );
}

export default JoinGame;