// Author: Michael Lopez
// Last Updated Date: 2025-12-27
// Purpose: This component provides a user interface for logging into the application. 
// It allows users to input their credentials (username and password) and sends a request 
// to the server for authentication. Upon successful login, the user's session data is 
// stored in cookies, and the authentication state is updated.

import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function Login({ setIsAuth }) {
    // State to store the username and password entered by the user
    const [username, setUsername] = useState(""); // Store username input
    const [password, setPassword] = useState(""); // Store password input
    const cookies = new Cookies(); // Initialize cookies for storing session data

    // Function to handle the login process
    const login = () => {
        Axios.post('http://localhost:3001/login', {
            username,
            password,
        }).then((res) => {
            // Extract response data and store in cookies
            const { token, userId, firstName, lastName, username } = res.data;
            cookies.set('token', token); // Store authentication token
            cookies.set('userId', userId); // Store user ID
            cookies.set('firstName', firstName); // Store user's first name
            cookies.set('lastName', lastName); // Store user's last name
            cookies.set('username', username); // Store username
            setIsAuth(true); // Update authentication state to indicate the user is logged in
        });
    };

    return (
        <div className='Login'>
            <label>Login</label>
            {/* Input field for entering the username */}
            <input 
                placeholder="Username" 
                onChange={(event) => {
                    setUsername(event.target.value); // Update username state on input change
                }} 
            />
            {/* Input field for entering the password */}
            <input  
                placeholder="Password" 
                type="password" // Mask password input for security
                onChange={(event) => {
                    setPassword(event.target.value); // Update password state on input change
                }} 
            />
            {/* Button to trigger the login process */}
            <button onClick={login}>Login</button>
        </div> 
    );
}

export default Login;