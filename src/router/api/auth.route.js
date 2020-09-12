const express = require('express');
const router = express.Router();
const validator = require('express-validation');

const auth = require('../../middlewares/authorization');
const authController = require('../../controllers/auth.controller');
const { create } = require('../../validations/user.validation');

router.post('/register', validator.validate(create), authController.register);
router.post('/login', authController.login);
router.get('/confirm', authController.confirm);

router.get('/secret1', auth(), (req, res) => {
  res.json({ message: 'Anyone can access (only authorize)' });
});

router.get('/secret2', auth(['admin']), (req, res) => {
  res.json({ message: 'Only admin can access' });
});

router.get('/secret3', auth(['user']), (req, res) => {
  res.json({ message: 'Only user can access' });
});

module.exports = router;
