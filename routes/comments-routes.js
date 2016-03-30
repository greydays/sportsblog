'use strict';

var Blog = require('../models/blog');
var User = require('../models/user');
var auth = require('../lib/authenticate');
var Comment = require('../models/comments-model');

module.exports = (router) => {

  router.post('/blogs/:blog/comments',auth, (req, res) => {
    var article = req.params.blog;
    User.findOne(req.decodedToken._id, (err, user) => {
      var newComment = new Comment({username: user.name, comment: req.body.comment});
      newComment.save((err, comment) => {
        if (err) {
          res.send(err);
          return res.end();
        }
        Blog.findByIdAndUpdate(article, {$push: {'comments': comment._id}}, (err) => {
          if (err) console.log(err);
          if(!err) console.log('comment saved!');
          res.end();
        });
      });
    });
  })

  .delete('/blogs/:blog/comments/:comment', auth, (req, res) => {
    Blog.findByIdAndUpdate(req.params.blog, {$pull: {'comments': req.params.comment}}, (err) => {
      if(err) console.log(err);
      if (!err) console.log('comment removed');
      res.end();
    });
  });
};
