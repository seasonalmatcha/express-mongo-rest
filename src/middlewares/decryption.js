const cryptr = require('../utils/ecnryption');

function decryptJWT(req, res, next) {
  const auth = req.headers.authorization;

  if (auth) {
    const encrypted = auth.split(' ')[1];
    const decrypted = cryptr.decrypt(encrypted);

    req.headers.authorization = `Bearer ${decrypted}`;
  }
  next();
}

module.exports = decryptJWT;
