const passportJWT = require('passport-jwt');

const config = require('../config');
const User = require('../models/user.model');

const cryptr = require('../utils/ecnryption');

const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  secretOrKey: config.SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  console.log(jwtPayload);
  User.findById(jwtPayload.sub, (err, user) => {
    if (err) return done(err, null);

    if (user) return done(null, user);
    else return done(null, false);
  });
});

module.exports = {
  jwtOptions,
  jwt: jwtStrategy,
};
