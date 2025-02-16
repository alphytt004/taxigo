import mongoose from 'mongoose';

const RideHistorySchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  status: { type: String, enum: ['completed'], default: 'completed' },
  date: { type: Date, default: Date.now }
});

const RideHistory = mongoose.model('RideHistory', RideHistorySchema);

export default RideHistory;