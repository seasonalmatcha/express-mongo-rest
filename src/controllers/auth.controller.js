const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const uuidv4 = require('uuid').v4;
const cryptr = require('../utils/ecnryption');

const config = require('../config');
const User = require('../models/user.model');

async function login(req, res, next) {
  try {
    const user = await User.findAndGenerateToken(req.body);
    const payload = { sub: user.id };
    const sign = jwt.sign(payload, config.SECRET);
    const token = cryptr.encrypt(sign);
    return res.json({ message: 'OK', token });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const activationKey = uuidv4();
    const body = req.body;
    body.activationKey = activationKey;
    const user = new User(body);
    const savedUser = await user.save();
    res.status = httpStatus.CREATED;
    res.send(savedUser.transform());
  } catch (err) {
    return next(User.checkDuplicateEmail(err));
  }
}

async function confirm(req, res, next) {
  try {
    await User.findOneAndUpdate(
      { 'activationKey': req.query.key },
      { 'active': true },
    );

    return res.json({ message: 'OK' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  confirm,
  login,
  register,
};
