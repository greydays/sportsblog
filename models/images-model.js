'use strict';

var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
  location: String,
  position: String
});

module.exports = mongoose.model('images', imageSchema);
