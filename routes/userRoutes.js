'use strict';

var User = require('../models/user');
var auth = require('../lib/authenticate');
var bcrypt = require('bcrypt');

module.exports = (router) => {

  router.post('/users', (req, res) => {
    console.log('users POST route hit');
    var user = new User(req.body);
    user.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      res.json(user);
    });
  })

  .post('/users/bookmark', auth, (req, res) =>{ //represents what would happen if a 'bookmark' or 'like' button was hit
    var userId = req.decodedToken._id;
    var articleId = req.body.articleId;
    User.findByIdAndUpdate(userId, {$push: {'bookmarked': articleId}}, (err) => {
      if (err) console.log(err);
      res.write('Saved!');
      res.end();
    });
  })

  .delete('/users/bookmark', auth, (req, res) => { //removes bookmark
    var userId = req.decodedToken._id;
    var articleId = req.body.articleId;
    User.findByIdAndUpdate(userId, {$pull: {'bookmarked': articleId}}, (err) => {
      if (err) console.log(err);
      res.write('bookmark removed');
      res.end();
    });
  })

  .post('/users/follow', auth, (req, res) => { //follows an author, adds follower to author
    var userId = req.decodedToken._id;
    var authorId = req.body.authorId;
    User.findByIdAndUpdate(userId, {$push: {'following': authorId}}, (err) => {
      if (err) console.log(err);
      console.log('following!');
    });
    User.findByIdAndUpdate(authorId, {$push: {'followedBy': userId}}, (err) => {
      if(err) console.log(err);
      console.log('followed!');
      res.end();
    });
  })

  .delete('/users/follow', auth, (req, res) => { //unfollows an author, removes follower from author
    var userId = req.decodedToken._id;
    var authorId = req.body.authorId;
    User.findByIdAndUpdate(userId, {$pull: {'following': authorId}}, (err) => {
      if (err) console.log(err);
      console.log('unfollowing!');
    });
    User.findByIdAndUpdate(authorId, {$pull: {'followedBy': userId}}, (err) => {
      if(err) console.log(err);
      console.log('unfollowed!');
      res.end();
    });
  })

  .put('/users/:user', auth, (req, res) => {
    var userId = req.params.user;
    var newUserInfo = req.body;
    if (req.body.password != null) {
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    }
    User.update({_id: userId}, newUserInfo, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: err});
      }
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + userId });
      }
    });
  })

  .delete('/users/:user', auth, (req, res) => {
    var userId = req.params.user;
    User.findOne({_id: userId}, function(err, user) {
      if (err){
        console.log(err);
        res.status(500).json(err);
      }
      user.remove();
      res.json({msg: 'User was removed'});
    });
  })

  .get('/users', auth, (req, res) => {
    User.find({})
    .populate('authored')
    .populate('bookmarked')
    .populate('newContent')
    .populate('followedBy')
    .populate('following')
    .exec(function(err, data) {
      console.log('get route hit');
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal Server Error'});
      }
      res.json(data);
    });
  })

  .get('/users/:user', auth, (req, res) => {
    var userId = req.params.user;
    User.findOne({_id: userId})
    .populate('authored')
    .populate('bookmarked')
    .populate('newContent')
    .populate('followedBy')
    .populate('following')
    .exec(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal server error'});
      }
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + userId});
      }
    });
  });
};
