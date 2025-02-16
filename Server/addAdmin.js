import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '/Models/admin.js'; // Adjust the path as needed

// Connect to your MongoDB
mongoose.connect('mongodb+srv://alphytt004:theresa@taxigo.g303p.mongodb.net/taxi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'alphytt004@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Alphy@123', 10); // 10 is the salt rounds

    // Create an admin with hashed password
    const admin = new Admin({
      email: 'alphytt004@gmail.com',
      password: hashedPassword, // Store the hashed password
    });

    // Save the admin to the database
    await admin.save();
    console.log('Admin added successfully! Admin ID:', admin._id);
    mongoose.connection.close(); // Close the connection after insertion
  })
  .catch((err) => {
    console.error('Error connecting to database', err);
  });
