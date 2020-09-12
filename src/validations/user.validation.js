const Joi = require('joi');

module.exports = {
  create: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().max(50).required(),
    }),
  },
};
