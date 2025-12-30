// Author: Michael Lopez
// Last Updated Date: 2025-12-27
// Purpose: This component provides a user interface for signing up for the application. 
// It collects user details (first name, last name, username, and password) and sends them 
// to the server for account creation. Upon successful sign-up, the user's session data is 
// stored in cookies, and the authentication state is updated.

import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';

function SignUp({ setIsAuth }) {
    const cookies = new Cookies(); // Initialize cookies for storing session data
    const [user, setUser] = useState({}); // State to store user input data

    // Function to handle the sign-up process
    const signUp = () => {
        Axios.post('http://localhost:3001/signup', user).then((res) => {
            // Extract response data and store in cookies
            const { token, userId, firstName, lastName, username, hashedPassword } = res.data;
            cookies.set('token', token); // Store authentication token
            cookies.set('userId', userId); // Store user ID
            cookies.set('firstName', firstName); // Store user's first name
            cookies.set('lastName', lastName); // Store user's last name
            cookies.set('username', username); // Store username
            cookies.set('hashedPassword', hashedPassword); // Store hashed password
            setIsAuth(true); // Update authentication state to indicate the user is signed up
        });
    };

    return (
        <div className='signUp'>
            <label>Sign Up</label>
            {/* Input field for entering the first name */}
            <input 
                placeholder="First name" 
                onChange={(event) => {
                    setUser({ ...user, firstName: event.target.value }); // Update first name in user state
                }} 
            />
            {/* Input field for entering the last name */}
            <input 
                placeholder="Last name" 
                onChange={(event) => {
                    setUser({ ...user, lastName: event.target.value }); // Update last name in user state
                }} 
            />
            {/* Input field for entering the username */}
            <input 
                placeholder="Username" 
                onChange={(event) => {
                    setUser({ ...user, username: event.target.value }); // Update username in user state
                }} 
            />
            {/* Input field for entering the password */}
            <input 
                placeholder="Password" 
                onChange={(event) => {
                    setUser({ ...user, password: event.target.value }); // Update password in user state
                }} 
            />
            {/* Button to trigger the sign-up process */}
            <button onClick={signUp}>Sign Up</button>
        </div>
    );
}

export default SignUp;