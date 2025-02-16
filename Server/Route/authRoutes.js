import express from 'express';
import { registerUser, registerDriver, loginUser } from '../Controller/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import Driver from '../Models/Driver.js';
import Booking from '../Models/Booking.js';


const router = express.Router();

// User Registration Route
router.post('/register', registerUser);

// Driver Registration Route
router.post('/register-driver', registerDriver);

// Login Route for Users and Drivers
router.post('/login', loginUser); // Changed to loginUser

// Fetch Driver Details (Protected Route)
router.get('/driver/:id', authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).select('-password'); // Exclude password
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/current-ride', authMiddleware, async (req, res) => {
  try {
    const ride = await Booking.findOne({ userId: req.user.id, status: 'pending' });
    if (!ride) {
      return res.status(404).json({ message: 'No current ride found' });
    }
    res.json(ride);
  } catch (error) {
    console.error('Error fetching current ride:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/assign-driver', authMiddleware, async (req, res) => {
  try {
    const { rideId, driverId } = req.body;

    // Find the ride
    const ride = await Booking.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Update the ride with the assigned driver
    ride.driverId = driverId;
    ride.status = 'accepted'; // Mark ride as accepted
    await ride.save();

    res.json({ message: 'Driver assigned successfully', ride });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
