import express from 'express';
import authRoutes from './routes/authRoute.js'; // Import auth routes
import adminRoutes from './routes/adminRoute.js'; // Import admin routes (ensure file is correctly named)

const app = express();

app.use(express.json());

// Define your API routes
app.use('/api/auth', authRoutes); // For authentication
app.use('/api/admin', adminRoutes); // For admin actions

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
