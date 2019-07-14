const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   method: {
//     type: String,
//     enum: ['local', 'google', 'facebook', 'github'],
//     required: true
//   },
//   local: {
//     username: { type: String },
//     email: { type: String, lowercase: true },
//     password: { type: String, min: 6, max: 1024 }
//   },
//   google: {
//     id: { type: String },
//     username: String,
//     email: { type: String, lowercase: true },
//     picture: String
//   },
//   facebook: {
//     id: { type: String },
//     username: String,
//     picture: String
//   },
//   github: {
//     id: String,
//     username: String,
//     picture: String
//   }
// });

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, min: 6, max: 1024, required: true }
});

userSchema.pre('save', async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.password, salt);
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('user', userSchema);

module.exports = User;
