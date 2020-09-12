const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const volleyball = require('volleyball');
const passport = require('passport');

const config = require('../config');
const errorHandler = require('../middlewares/errorHandler');
const passportJwt = require('../services/passport');
const apiRoute = require('../router/api');
const webRoute = require('../router/web');
const decryptJWT = require('../middlewares/decryption');

app.use(volleyball);

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(passport.initialize());
passport.use('jwt', passportJwt.jwt);

app.use(decryptJWT);
app.use('/api', apiRoute);
app.use(webRoute);
app.use(errorHandler.handleNotFound);
app.use(errorHandler.handleError);

module.exports = {
  app,
  start: () => {
    app.listen(config.PORT, err => {
      if (err) {
        console.error(err);
        process.exit(-1);
      }

      console.log(`Server is running on port: ${config.PORT}`);
    });
  },
};
