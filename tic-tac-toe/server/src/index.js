/*
 * Author: Michael Lopez
 * Date: 12-27-25
 * Description: This is the main server file for the Tic-Tac-Toe application. 
 * It sets up an Express server with endpoints for user signup and login, 
 * utilizing StreamChat for token generation and bcrypt for password hashing.
 */

import express from 'express';
import cors from 'cors';
import {StreamChat} from 'stream-chat';
import {v4 as uuid4} from 'uuid';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);

// Endpoint for user signup
app.post("/signup", async(req,res) => {
    try {
        const {firstName, lastName, username, password} = req.body;
        const userId = uuid4(); // Generate a unique user ID
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const token = serverClient.createToken(userId); // Create a token for the user
        res.json({token, userId, firstName, lastName, username, hashedPassword});
    } catch (error) {
        res.json(error); // Return error response
    }
});

// Endpoint for user login
app.post("/login", async (req,res) => {
    try {
        const {username, password} = req.body;
        const {users} = await serverClient.queryUsers({name: username}); // Query users by username
        if(users.length === 0){
            return res.status(400).json({message: "User not found"}); // Handle user not found
        }
        const token = serverClient.createToken(users[0].id); // Generate token for the user
        const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword); // Compare passwords
    
        if(!passwordMatch){
            res.json({
                token, 
                firstName: users[0].firstName, 
                lastName: users[0].lastName,
                username,
                userId: users[0].id,
            });
        }
    } catch (error) {
        res.json({message: "Invalid credentials"}); // Handle invalid credentials
    }
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});


