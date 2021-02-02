const express = require('express');
const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');
const { User } = require('../models');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
async function login(req, res, next) {
  const { email, password } = req.body;

  if (email && password) {
    // Try to find a user with the provided email
    const user = await User.findOne({ where: { email } });
    if (user) {
      // Compare the given password to the stored hash
      if (await argon2.verify(user.password, password)) {
        req.session.userId = user.id;
        return res.status(201).json({ message: 'OK' });
      }
      return res.status(400).json({ message: 'Incorrect password' });
    }
    return res.status(400).json({ message: 'User not found' });
  }

  return res.status(400).json({ message: 'Missing fields' });
}

router.post('/login', asyncHandler(login));

module.exports = router;
