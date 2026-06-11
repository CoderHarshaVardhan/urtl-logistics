require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    await User.create({
      name: 'uzaif',
      branch: 'Headquarters',
      password: 'uzaif@urtl',
      role: 'admin',
    });

    console.log('Admin user created: name: admin, password: adminpassword');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
