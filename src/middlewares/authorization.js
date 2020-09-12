const passport = require('passport');
const httpStatus = require('http-status');
const bluebird = require('bluebird');

const User = require('../models/user.model');
const APIError = require('../utils/APIError');

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = bluebird.promisify(req.logIn);
  const apiError = new APIError(
    error ? error.message : 'Unauthorized',
    httpStatus.UNAUTHORIZED,
  );

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    return next(apiError);
  }

  if (!roles.includes(user.role)) {
    return next(new APIError('Forbidden', httpStatus.FORBIDDEN));
  }

  res.user = user;
  return next();
};

const authorize = (roles = User.roles) => (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false },
    handleJWT(req, res, next, roles),
  )(req, res, next);
};

module.exports = authorize;
