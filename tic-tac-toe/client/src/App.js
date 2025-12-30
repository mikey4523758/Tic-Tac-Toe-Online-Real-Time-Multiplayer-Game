// Author: Michael Lopez
// Last Updated Date: 2025-12-27
// Purpose: This is the main application component for the Tic-Tac-Toe game. 
// It manages user authentication, connects to the Stream Chat API, and renders 
// the appropriate components based on the user's authentication state. 
// Authenticated users can join or create game channels, while unauthenticated 
// users are presented with login and sign-up forms.

import './App.css';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { useState } from 'react';
import JoinGame from "./components/JoinGame";

function App() {
  const cookies = new Cookies(); // Initialize cookies for session management
  const token = cookies.get("token"); // Retrieve the authentication token from cookies
  const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY); // Initialize Stream Chat client with API key
  const [isAuth, setIsAuth] = useState(false); // State to track user authentication status

  // Function to handle user logout
  const logOut = () => {
    // Remove all session-related cookies
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("username");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    client.disconnectUser(); // Disconnect the user from Stream Chat
    setIsAuth(false); // Update authentication state
  };

  // If a token exists, connect the user to Stream Chat
  if (token) {
    client.connectUser(
      {
        id: cookies.get("userId"), // User ID
        name: cookies.get("username"), // Username
        firstName: cookies.get("firstName"), // First name
        lastName: cookies.get("lastName"), // Last name
        hashedPassword: cookies.get("hashedPassword"), // Hashed password
      },
      token // Authentication token
    ).then((user) => {
      setIsAuth(true); // Update authentication state to true
    });
  }

  return (
    <div className="App">
      {isAuth ? (
        // Render the game interface for authenticated users
        <Chat client={client}>
          <JoinGame /> {/* Component to join or create a game */}
          <button onClick={logOut}>Log Out</button> {/* Logout button */}
        </Chat>
      ) : (
        // Render the login and sign-up forms for unauthenticated users
        <>
          <SignUp setIsAuth={setIsAuth} /> {/* Sign-up form */}
          <Login setIsAuth={setIsAuth} /> {/* Login form */}
        </>
      )}
    </div>
  );
}

export default App;
