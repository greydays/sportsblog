// 'use strict';
//
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
//
// var blogSchema = new Schema({
//
//   title: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: String,
//     required: true
//   },
//   author: {
//     type: String,
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   }
//   /*image: {
//     type: String,
//     required: true
//   }*/
// });
//
// module.exports = mongoose.model('Blog', blogSchema);


'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  keywords: [String]
  /*comments: [{
    type: String
  }],*/
  /*image: {
    type: String,
    required: true
  }*/
});

module.exports = mongoose.model('Blog', blogSchema);
