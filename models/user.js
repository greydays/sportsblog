'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  authored: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  bookmarked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Blog'
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'keywords'
    }
  ],
  followedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  newContent: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
});
// the pre save function doesn't work for put routes.
userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  next();
});

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ _id: this._id}, process.env.SECRET ||'change me');
};

module.exports = mongoose.model('User', userSchema);
