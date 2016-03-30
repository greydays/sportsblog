'use strict';

let mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
  username: {type: String, required: true},
  comment: String
});

module.exports = mongoose.model('comments', commentSchema);
