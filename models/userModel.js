const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    validate: {
      //This only works on User.create and User.save!!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords don't match",
    },
  },
});

userSchema.pre('save', async function (next) {
  //Only run if password was actually modified
  if (!this.isModified('password')) return next();

  //hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;