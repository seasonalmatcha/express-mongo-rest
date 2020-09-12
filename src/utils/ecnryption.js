const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.SECRET);

function encrypt(data) {
  return cryptr.encrypt(data);
}

function decrypt(data) {
  return cryptr.decrypt(data);
}

module.exports = { encrypt, decrypt };
