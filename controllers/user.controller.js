// controllers/user.controller.js
const User = require('../models/user.model'); // Import your user model
const TokenGenerator = require('uuid-token-generator');
const { v4: uuidv4 } = require('uuid');
const b2a = require('b2a');

// Initialize a token generator
///const tokenGenerator = new TokenGenerator(256, TokenGenerator.BASE62);
const tokenGenerator = new TokenGenerator();

// Function to create a new user (sign-up)
// Function to create a new user (sign-up)
exports.signUp = async (req, res) => {
  try {
    const { first_name, last_name, email_address, password, mobile_number } = req.body; // Extract user details from the request body
    // Check if a user with the same username (first_name + last_name) already exists
    const existingUser = await User.findOne({ username: `${first_name}_${last_name}` });

    if (existingUser) {
      // User with the same username already exists, return an error
      console.log("Username is already in use");
      return res.status(400).json({ error: 'Username is already in use' });
      
    }
    // Generate a UUID and access token
    const userId = uuidv4();
    const accessToken1 = tokenGenerator.generate();
    // Create a new user object with the access_token and additional fields included
    const newUser = new User({
      email:email_address,
      first_name: first_name,
      last_name: last_name,
      username: `${first_name}_${last_name}`,
      contact:mobile_number,
      password: password, // NOTE: You should securely hash and store passwords
      role: 'user',
      isLoggedIn: false,
      uuid: userId,
      accesstoken: accessToken1,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Function to log in a user
exports.login = async (req, res) => {
  try {
    const { username, loginPassword } = req.body; // Extract username and password from the request body

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Implement password validation logic here, e.g., by comparing hashed passwords
    if (loginPassword !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // Update isLoggedIn status and generate a new access token
    user.isLoggedIn = true;
    user.access_token = tokenGenerator.generate();

    // Save the updated user
    await user.save();

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to log out a user
exports.logout = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from the URL parameters

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update isLoggedIn status to false and clear the access token
    user.isLoggedIn = false;
    user.access_token = '';

    // Save the updated user
    await user.save();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
