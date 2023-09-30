const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const TokenGenerator = require('uuid-token-generator');

const tokenGenerator = new TokenGenerator();

// Function to create a new user (sign-up)
exports.signUp = async (req, res) => {
  try {
    const { first_name, last_name, email_address, password, mobile_number } = req.body;

    // Check if a user with the same username (first_name + last_name) already exists
    const existingUser = await User.findOne({ username: `${first_name}_${last_name}` });

    if (existingUser) {
      console.log("Username is already in use");
      return res.status(400).json({ error: 'Username is already in use' });
    }

    // Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a new UUID and access token (you can use your preferred method for UUID generation)
    const userUUID = uuidv4();
    const accessToken = tokenGenerator.generate();

    // Create a new user object with the hashed password, UUID, and access token
    const newUser = new User({
      email: email_address,
      first_name: first_name,
      last_name: last_name,
      username: `${first_name}_${last_name}`,
      contact: mobile_number,
      password: hashedPassword,
      role: 'user',
      isLoggedIn: false,
      uuid: userUUID,
      accessToken: accessToken,
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
      const { username, loginPassword } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(loginPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Generate a new UUID and access token
      const userUUID = uuidv4();
      const accessToken = tokenGenerator.generate();
  
      // Store the UUID and access token in the user's document in MongoDB
      user.uuid = userUUID;
      user.accessToken = accessToken;
  
      // Save the updated user document
      await user.save();
  
      // Send the UUID and access token to the client
      res.json({ message: 'Login successful', userUUID, accessToken });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
// Function to log out a user
exports.logout = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update isLoggedIn status to false and clear the access token
    user.isLoggedIn = false;
    user.accessToken = '';

    // Clear the cookies
    res.clearCookie('uuid');
    res.clearCookie('access-token');

    await user.save();

    res.json({ message: 'Logged Out successfully.' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCouponCode = async (req, res) => {
  const { uuid } = req.body;

  try {
    const user = await User.findOne({ uuid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a coupon code (customize this logic)
    const couponCode = generateCouponCode();

    // Add the generated coupon code to the user's coupons array
    user.coupons.push({ id: couponCode.id, discountValue: couponCode.discountValue });

    await user.save();

    res.json({ couponCode });
  } catch (error) {
    console.error('Error generating coupon code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to generate a coupon code (customize as needed)
function generateCouponCode() {
  // Generate a random coupon code (you can customize this logic)
  const id = Math.floor(Math.random() * 1000);
  const discountValue = Math.floor(Math.random() * 50) + 1;

  return { id, discountValue };
}
// Book a show for the user
exports.bookShow = async (req, res) => {
  const { uuid, showId, tickets } = req.body;

  try {
    const user = await User.findOne({ uuid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Implement show booking logic here
    // For example, you can update the user's bookingRequests array with the booked show details
    const booking = { showId, tickets, bookingDate: new Date() };
    user.bookingRequests.push(booking);

    await user.save();

    res.json({ message: 'Show booked successfully', booking });
  } catch (error) {
    console.error('Error booking show:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
