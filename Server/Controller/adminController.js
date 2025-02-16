import User from './Models/User';
import Driver from './Models/Driver';
import jwt from 'jsonwebtoken';
import Booking from '../Models/Booking';

// Fetch all users
const getAllUsers = async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    // Check if the user has an admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }

    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  });
};

// Fetch all drivers
const getAllDrivers = async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    // Check if the user has an admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }

    try {
      const drivers = await Driver.find();
      res.status(200).json(drivers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching drivers' });
    }
  });
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    // Check if the user has an admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }

    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ success: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  });
};

// Delete a driver
const deleteDriver = async (req, res) => {
  const { id } = req.params;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    // Check if the user has an admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }

    try {
      await Driver.findByIdAndDelete(id);
      res.status(200).json({ success: 'Driver deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting driver' });
    }
  });
};
const getCurrentRide = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains authenticated user data
    const ride = await Booking.findOne({ userId, status: { $ne: "completed" } });

    if (!ride) {
      return res.status(404).json({ message: "No active ride found" });
    }

    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  getAllUsers,
  getAllDrivers,
  deleteUser,
  deleteDriver,
};