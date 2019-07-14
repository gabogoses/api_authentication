const User = require('../models/user');

module.exports = {
  signUp: async (req, res, next) => {
    const { username, email, password } = req.value.body;

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(403).json({ error: 'Email already registered' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.json({ user: 'created' });
  },

  signIn: async (req, res, next) => {},

  secret: async (req, res, next) => {}
};
