const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String
}, { timestamps: true });

userSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
