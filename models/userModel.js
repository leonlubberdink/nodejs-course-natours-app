const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'An email address is required'],
    validate: [validator.isEmail, 'Invalid email address'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A password is required'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
