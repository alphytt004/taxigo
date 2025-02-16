import User from '../Models/User.js';  // Assuming you have a User model
import Driver from '../Models/Driver.js'; // Assuming you have a Driver model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Driver Registration
export const registerDriver = async (req, res) => {
  try {
    const { name, email, password, vehicleDetails } = req.body;

    // Check if the driver already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new driver
    const newDriver = new Driver({ name, email, password: hashedPassword, vehicleDetails });
    await newDriver.save();

    res.status(201).json({ message: 'Driver registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User & Driver Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    let isDriver = false;

    if (!user) {
      user = await Driver.findOne({ email });
      isDriver = true;
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, isDriver }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isDriver } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
