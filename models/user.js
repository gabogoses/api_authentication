const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook', 'github'],
    required: true
  },
  local: {
    username: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String, min: 6, max: 1024 }
  },
  google: {
    id: { type: String },
    username: String,
    email: { type: String, lowercase: true },
    picture: String
  },
  facebook: {
    id: { type: String },
    username: String,
    email: { type: String, lowercase: true },
    picture: String
  },
  github: {
    id: String,
    username: String,
    picture: String
  }
});

userSchema.pre('save', async function(next) {
  try {
    if (this.method !== 'local') {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('user', userSchema);

module.exports = User;
