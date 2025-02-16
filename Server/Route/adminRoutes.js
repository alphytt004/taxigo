import express from 'express';
import adminController from '../Controller/adminController';

const router = express.Router();

// Fetch all users
router.get('/users', adminController.getAllUsers);

// Fetch all drivers
router.get('/drivers', adminController.getAllDrivers);

// Delete user/driver
router.delete('/user/:id', adminController.deleteUserOrDriver);

