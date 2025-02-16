import express from 'express';
import Booking from './models/Booking.js';
import RideHistory from './models/RideHistory.js';
import Driver from './models/Driver.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send({ message: 'No token provided' });

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(403).send({ message: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  });
};

// 📌 Fetch available drivers
router.get('/available-drivers', authenticateUser, async (req, res) => {
  if (req.role !== 'passenger') return res.status(403).send({ message: 'Unauthorized' });

  try {
    const drivers = await Driver.find({ status: 'available' });
    if (!drivers.length) return res.status(404).send({ message: 'No available drivers found' });

    res.status(200).send(drivers);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching drivers', error });
  }
});

// 📌 Passenger requests a ride
router.post('/booking', authenticateUser, async (req, res) => {
  if (req.role !== 'passenger') return res.status(403).send({ message: 'Unauthorized' });

  const { pickupLocation, dropoffLocation, date, time } = req.body;

  try {
    const booking = new Booking({
      userId: req.userId,
      pickupLocation,
      dropoffLocation,
      date,
      time,
      status: 'pending',
    });

    await booking.save();
    res.status(201).send({ message: 'Ride request created', booking });
  } catch (error) {
    res.status(400).send({ message: 'Error creating ride request', error });
  }
});

// 📌 Driver views pending bookings
router.get('/pending-bookings', authenticateUser, async (req, res) => {
  if (req.role !== 'driver') return res.status(403).send({ message: 'Unauthorized' });

  try {
    const bookings = await Booking.find({ status: 'pending', driverId: null }).populate('userId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching pending bookings', error });
  }
});

// 📌 Driver accepts a ride
router.put('/accept-booking/:bookingId', authenticateUser, async (req, res) => {
  if (req.role !== 'driver') return res.status(403).send({ message: 'Unauthorized' });

  const { bookingId } = req.params;

  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, status: 'pending' },
      { status: 'accepted', driverId: req.userId },
      { new: true }
    ).populate('userId driverId');

    if (!booking) return res.status(404).send({ message: 'Booking not found or already accepted' });

    res.status(200).send({ message: 'Booking accepted', booking });
  } catch (error) {
    res.status(400).send({ message: 'Error accepting booking', error });
  }
});

// 📌 Driver completes a ride (Moves to history)
router.post('/complete-ride/:bookingId', authenticateUser, async (req, res) => {
  if (req.role !== 'driver') return res.status(403).send({ message: 'Unauthorized' });

  const { bookingId } = req.params;

  try {
    const booking = await Booking.findOne({ _id: bookingId, driverId: req.userId, status: 'accepted' });

    if (!booking) return res.status(404).send({ message: 'Booking not found or not assigned to this driver' });

    // Move completed ride to history
    const rideHistory = new RideHistory({
      userId: booking.userId,
      driverId: booking.driverId,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      date: booking.date,
      time: booking.time,
    });

    await rideHistory.save();
    await Booking.deleteOne({ _id: bookingId });

    res.status(200).send({ message: 'Ride completed and moved to history', rideHistory });
  } catch (error) {
    res.status(400).send({ message: 'Error completing ride', error });
  }
});

// 📌 Get ride history for a user (passenger)
router.get('/ride-history/user', authenticateUser, async (req, res) => {
  if (req.role !== 'passenger') return res.status(403).send({ message: 'Unauthorized' });

  try {
    const rides = await RideHistory.find({ userId: req.userId }).populate('driverId');
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching ride history', error });
  }
});

// 📌 Get ride history for a driver
router.get('/ride-history/driver', authenticateUser, async (req, res) => {
  if (req.role !== 'driver') return res.status(403).send({ message: 'Unauthorized' });

  try {
    const rides = await RideHistory.find({ driverId: req.userId }).populate('userId');
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching ride history', error });
  }
});

export default router;
