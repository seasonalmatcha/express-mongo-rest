const mongooseService = require('./services/mongoose');
const app = require('./services/express');
const mongoose = require('./services/mongoose');

app.start();
mongoose.connect();

module.exports = app;
