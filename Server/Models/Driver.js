import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  role: { type: String, default: 'driver' },
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
