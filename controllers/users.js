const JWT = require('jsonwebtoken');

const keys = require('../config/keys');
const User = require('../models/user');

signToken = user => {
  return JWT.sign(
    {
      iss: 'API_Authentication',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    keys.JWT.SecretOrKey
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { username, email, password } = req.value.body;

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(403).json({ error: 'Email already registered' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = signToken(newUser);

    res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {},

  secret: async (req, res, next) => {}
};
