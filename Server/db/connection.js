import mongoose from 'mongoose';

const connection = async () => {
  try {
    await mongoose.connect('mongodb+srv://alphytt004:theresa@taxigo.g303p.mongodb.net/taxi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connection;
