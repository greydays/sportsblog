'use strict';

var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.TWITTER_CONS_KEY,
  consumer_secret: process.env.TWITTER_CONS_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var stream = T.stream('user');
stream.on('follow', function(ev) {
  console.log(ev.source.screen_name);
  T.post('statuses/update', { status: 'Thanks @' + ev.source.screen_name +'! HOPE YOU LOVE SPORTS'}, function(err, data){
    if (err) console.log(err);
    console.log(data);
  });
});

module.exports = T;
