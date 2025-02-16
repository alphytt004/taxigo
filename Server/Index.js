import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import nodemailer from 'nodemailer';
import crypto from 'crypto';

import authRoutes from './Route/authRoutes.js'

import User from './Models/User.js';
import Driver from './Models/Driver.js';
import Booking from './Models/Booking.js';
import Admin from './Models/Admin.js';
import RideHistory from './Models/RideHistory.js';



// Database connection
const connection = async () => {
  try {
    await mongoose.connect('mongodb+srv://alphytt004:theresa@taxigo.g303p.mongodb.net/taxi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connection();

app.use('/api/auth', authRoutes); 
// Passenger Registration
app.post('/passenger', async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { name, email, password, gender, dob, contactNumber } = req.body;

    if (!name || !email || !password || !dob || !contactNumber || !gender) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      dob: new Date(dob),
      phone: contactNumber,
      role: 'user',
    });

    const result = await user.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Error creating user', error: err });
  }
});

// Admin Registration
app.post('/admin', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).send({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword, role });

    const result = await admin.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Error creating admin', error: err });
  }
});
app.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, 'your_secret_key');
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});


// Driver Registration
app.post('/driver', async (req, res) => {
  try {
    const { name, email, password, gender, phone, licenseNumber, vehicleNumber, vehicleModel } = req.body;

    if (!name || !email || !password || !gender || !phone || !licenseNumber || !vehicleNumber || !vehicleModel) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) return res.status(400).send({ message: 'Driver already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = new Driver({
      name,
      email,
      password: hashedPassword,
      gender,
      phone,
      licenseNumber,
      vehicleNumber,
      vehicleModel,
      role: 'driver',
    });

    const result = await driver.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Error creating driver', error: err });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let user;

    if (await Admin.findOne({ email })) {
      user = await Admin.findOne({ email });
    } else {
      user = await User.findOne({ email }) || await Driver.findOne({ email });
    }

    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
    res.status(200).send({ token, user });
  } catch (err) {
    res.status(500).send({ message: 'Error during login', error: err });
  }
});

// Fetch Available Drivers
app.get('/drivers/available', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching drivers', error: err });
  }
});

// Fetch Ride History
app.get('/ride-history', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).populate('driverId');
    res.json(bookings);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching ride history', error: err });
  }
});

// Book a Ride
app.post('/booking', async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, date, time, driverId, userId } = req.body;

    if (!userId || !pickupLocation || !dropoffLocation || !date || !time || !driverId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    const booking = new Booking({ userId, pickupLocation, dropoffLocation, date, time, driverId });
    const result = await booking.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error booking ride', error: err.message });
  }
});
// Fetch Driver Details by ID
app.get('/driver/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Error fetching driver", error: err.message });
  }
});

// Fetch All Bookings for a Driver
app.get('/booking/driver/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ 
      driverId: id, 
      status: { $ne: 'rejected' }  // Exclude rejected bookings
    }).populate('userId');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
});


// Fetch Ride History for a Driver
app.get('/ride-history/driver/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rides = await Booking.find({ driverId: id }).populate('userId');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ride history", error: err.message });
  }
});
app.get('/ride-history/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rides = await Booking.find({ userId: id }).populate('userId');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ride history", error: err.message });
  }
});

// ✅ PATCH: Update booking status & move completed rides to history
app.patch('/booking/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).send({ message: 'Booking not found' });

    if (status === 'completed') {
      const newRideHistory = new RideHistory({
        passengerId: booking.passengerId,
        driverId: booking.driverId,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        status: 'completed',
      });

      await newRideHistory.save();
      await Booking.findByIdAndDelete(req.params.id);

      return res.status(200).send({ message: 'Ride moved to history', newRideHistory });
    }

    booking.status = status;
    await booking.save();
    res.status(200).send({ message: `Booking updated to ${status}`, booking });
  } catch (err) {
    res.status(500).send({ message: 'Error updating booking', error: err });
  }
});

// ✅ GET: Fetch ride history for passengers or drivers
app.get('/ride-history/:role/:id', async (req, res) => {
  try {
    const { role, id } = req.params;
    let rides;

    if (role === 'driver') {
      rides = await RideHistory.find({ driverId: id,status: { $in: ['pending'] }  });
    } else if (role === 'passenger') {
      rides = await RideHistory.find({ passengerId: id });
    } else {
      return res.status(400).send({ message: 'Invalid role' });
    }

    res.status(200).json(rides);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching ride history', error: err });
  }
});

app.delete('/drivers/:id', async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete driver' });
  }
});
// Fetch Pending Bookings for a Driver
app.get('/booking-pending/driver/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const bookings = await Booking.find({ 
      driverId: id, 
      status: 'pending'  // Exclude rejected bookings
    }).populate('userId');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
});
app.get('/current-ride', async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Decode JWT token to get user ID
    const decoded = jwt.verify(token, 'your_secret_key');
    const userId = decoded.userId;

    // Fetch current ride (assuming a user has only one active ride at a time)
    const currentRide = await Booking.findOne({
      userId: userId,
      status: { $in: ['pending', 'accepted'] }  
    }).populate('driverId', 'name phoneNumber vehicleType'); 

    if (!currentRide) return res.status(404).json({ message: 'No current ride found' });

    res.json(currentRide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching current ride', error: err.message });
  }
});

app.get("/current-ride/driver/:driverId", async (req, res) => {
  const driverId = req.params.driverId;
  const ride = await Booking.findOne({ driverId, status: "accepted" });
  res.json(ride || null);
});


app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
