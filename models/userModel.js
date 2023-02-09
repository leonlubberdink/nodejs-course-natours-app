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
    select: false,
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
  passwordChangedAt: Date,
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

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  const changedTimeStamp = +(this.passwordChangedAt.getTime() / 1000);
  if (this.passwordChangedAt) {
    return JWTTimeStamp < changedTimeStamp;
  }

  //False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
