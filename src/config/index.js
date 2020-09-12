require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  APP: process.env.APP,
  ENV: process.env.NODE_ENV,
  SECRET: process.env.SECRET,
  HOSTNAME: process.env.HOSTNAME,
  MONGO: {
    URI: process.env.MONGO_URI,
  },
  TRANSPORTER: {
    SERVICE: process.env.TRANSPORTER_SERVICE,
    EMAIL: process.env.TRANSPORTER_EMAIL,
    PASSWORD: process.env.TRANSPORTER_PASSWORD,
    HOST: process.env.TRANSPORTER_HOST,
    PORT: process.env.TRANSPORTER_PORT,
  },
};
