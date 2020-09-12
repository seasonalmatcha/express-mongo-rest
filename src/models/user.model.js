const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const transporter = require('../services/transporter');
const nodemailer = require('nodemailer');

const config = require('../config');
const Schema = mongoose.Schema;

const roles = ['admin', 'user'];

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    maxlength: 50,
  },
  activationKey: {
    type: String,
    unique: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user',
    enum: roles,
  },
}, { timestamps: true });

userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.post('save', async function save(doc, next) {
  try {
    const mailOptions = {
      from: 'noreply',
      to: this.email,
      subject: 'Activate Your Account',
      html: `
      <div>
        <h1>Hello, <strong>${this.name}</strong></h1>
        <p>
          You are one step left to complete the registration!
        </p>
        <p>
          Please click <a href="${config.HOSTNAME}/api/v1/auth/confirm?key=${this.activationKey}">here</a> to activate.
        </p>
      </div>
      `
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.error(err);
      }
    });

    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'createdAt', 'role'];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  passwordMatches(password) {
    return bcrypt.compareSync(password, this.password);
  },
});

userSchema.statics = {
  roles,
  checkDuplicateEmail(err) {
    if (err.code === 11000) {
      const error = new Error('Email already taken');
      error.errors = [{
        field: 'email',
        loaction: 'body',
        message: 'Email already taken',
      }];

      error.status = httpStatus.CONFLICT;
      return error;
    }

    return err;
  },

  async findAndGenerateToken(payload) {
    const { email, password } = payload;
    if (!email) throw new APIError('Email must be provided for login');

    const user = await this.findOne({ email }).exec();

    if (!user) throw new APIError('User not found', httpStatus.NOT_FOUND);

    const passwordOK = await user.passwordMatches(password);

    if (!passwordOK) throw new APIError('Password is incorect', httpStatus.UNAUTHORIZED);

    if (!user.active) throw new APIError('User is not activated', httpStatus.UNAUTHORIZED);

    return user;
  },
};

module.exports = mongoose.model('User', userSchema);
