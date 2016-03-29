'use strict';

var Blog = require('../models/blog');
var Keyword = require('../models/keywords');
var User = require('../models/user');
var auth = require('../lib/authenticate');

module.exports = (router) => {

  router.post('/blogs', auth, (req, res) => { //replace auth! !!!
    console.log('blogs POST route hit');
    console.log(req.body.keywords);
    var keys = req.body.keywords.split(' ');


    var blog = new Blog(req.body);
    // finding author name from header token
    User.findOne({_id: req.decodedToken._id})
      .then(user => {
        req.user = user;
        blog.author = user.name;
        blog.save(function(err, data) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }
          //adds article to 'authored' list
          User.findByIdAndUpdate(req.decodedToken._id, {$push: {'authored': data._id}}, (err) => {
            if(err) console.log(err);
          });
          //adds article to every follower's newContent list
          user.followedBy.forEach((follower) => {
            User.findByIdAndUpdate(follower, {$push: {'newContent': data._id}}, (err) => {
              if(err) console.log(err);
              console.log('articles added to followers content list');
            });
          });
          //creates new keyword or adds article to existing
          keys.forEach((key) => {
            Keyword.findOne({keyword: key}, (err, keyword) => {
              if (err) console.log(err);
              if(!keyword && key.length > 0) {
                var newKeyword =  new Keyword(
                  {
                    keyword: key,
                    articles: [data._id]
                  });
                newKeyword.save((err, data) => {
                  if(err) console.log(err);
                  console.log('Saved!');
                  console.log(data);
                  res.end();
                });
              } else if (keyword) {
                Keyword.findOneAndUpdate({keyword: key}, {$push: {'articles': data._id}}, (err) => {
                  if(err) console.log(err);
                });
              }
            });
          });
          res.json(data);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(418).json({msg: err});
      });
  })

  .put('/blogs/:blog', auth, (req, res) => {
    var blogId = req.params.blog;
    var newBlogInfo = req.body;
    Blog.update({_id: blogId}, newBlogInfo, function(err, blog) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: err});
      }
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + blogId });
      }
    });
  })


  .delete('/blogs/:blog', auth, (req, res) => {
    var keys = req.body.keywords.split(' ');
    var blogId = req.params.blog;

    Blog.findOne({_id: blogId}, function(err, blog) {
      if (err){
        console.log(err);
        res.status(500).json(err);
      }
      User.findOne(blog.author, (err, user) => {
        user.followedBy.forEach((follower) => {
          User.findByIdAndUpdate(follower, {$pull: {'newContent': blogId}}, (err) => {
            if(err) console.log(err);
            console.log('article removed from followers content arrays');
          });
        });
      });
      keys.forEach((key) => {
        Keyword.findOne({keyword: key}, (err, keyword) => {
          if (err) console.log(err);
          if(keyword) {
            Keyword.findOneAndUpdate({keyword: key}, {$pull: {'articles': blogId}}, (err) => {
              if(err) console.log(err);
              if(keyword.articles.length === 1) {
                keyword.remove();
              }
            });
          }
        });
      });
      blog.remove();
      res.json({msg: 'Blog was removed'});
    });
  })
  //get all
  .get('/blogs', (req, res) => {
    Blog.find({}, function(err, data) {
      console.log('blog get route hit');
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal Server Error'});
      }
      res.json(data);
    });
  })

  .get('/blogs/:blog', (req, res) => {
    var blogId = req.params.blog;
    Blog.findOne({_id: blogId}, function(err, blog) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal server error'});
      }
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + blogId});
      }
    });
  })

  .get('/keywords/:keyword', (req, res) => {
    var key = req.params.keyword;
    Keyword.find({keyword: key})
    .populate('articles')
    .exec((err, data) => {
      if(err || data.length === 0){
        res.json('No results found');
        return res.end();
      }
      if(data) {
        res.json(data);
        res.end();
      }
    });
  })

  .get('/search/:search', (req, res) => {
    var key = req.params.search;
    Blog.find({}, (err, blogs) => {
      var results = [];
      var count = 0;
      blogs.forEach((blog) => {
        count += 1;
        if (blog.title === key || blog.author === key || blog.date === key) {
          results.push(blog);
        }
      });
      if (count === blogs.length) {
        res.json(results);
        res.end();
      }
    });
  });
};
