import bcrypt from 'bcryptjs';
import Driver from '../Models/Driver.js';

export const registerDriver = async (req, res) => {
  const { name, email, password, licenseNumber, vehicleNumber, vehicleModel } = req.body;
  
  const existingDriver = await Driver.findOne({ email });
  if (existingDriver) return res.status(400).send('Driver already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newDriver = new Driver({
    name,
    email,
    password: hashedPassword,
    licenseNumber,
    vehicleNumber,
    vehicleModel,
  });

  await newDriver.save();
  res.status(201).send('Driver registered successfully');
};
export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDriver = await Driver.findByIdAndDelete(id);
    
    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    
    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteDriver };
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Driver.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({ token, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
