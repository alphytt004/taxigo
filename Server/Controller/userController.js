import bcrypt from 'bcryptjs';
import User from '../Models/User.js';

export const registerPassenger = async (req, res) => {
  const { name, email, password, dob, contactNumber } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).send('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    dob,
    phone: contactNumber,
  });

  await newUser.save();
  res.status(201).send('User registered successfully');
};
