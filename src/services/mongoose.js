const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const config = require('../config');
const User = require('../models/user.model');

mongoose.connection.on('connected', async () => {
  console.log('MongoDB is connected');
  try {
    const admin = await User.findOne({ email: 'admin@mail' });

    if (!admin) {
      console.log('Admin account is not found. Creating one ...');
      const newAdmin = new User({ name: 'Admin', email: 'admin@mail', password: 'Password123', role: 'admin', active: true });
      await newAdmin.save();
    }
  } catch (err) {
    console.error(err);
  }
});

mongoose.connection.on('error', e => {
  console.error(e);
  process.exit(1);
});

if (config.ENV === 'dev') {
  mongoose.set('debug', true);
}

module.exports = {
  connect() {
    const mongoURI = config.MONGO.URI;

    mongoose.connect(mongoURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: 1,
    });

    return mongoose.connection;
  },
};
