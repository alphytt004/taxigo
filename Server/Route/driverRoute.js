import express from 'express';
import Driver from './models/driver.js'; // Import driver model
import jwt from 'jsonwebtoken';
import { deleteDriver } from './Controllers/drivercontroller.js';


const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// Get driver details by driver ID
router.get('/:driverId', authenticateToken, async (req, res) => {
  const { driverId } = req.params;

  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete("/:id", async (req, res) => {
  console.log("Received DELETE request for ID:", req.params.id); // Debugging
  await deleteDriver(req, res);
});


export default router;
