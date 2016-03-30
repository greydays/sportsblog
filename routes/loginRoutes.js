'use strict';

var User = require('../models/user');

module.exports = (router) => {

  router.post('/login', (req, res) => {
    let authorizationArray = req.headers.authorization.split(' ');
    let base64ed = authorizationArray[1];
    let authArray = new Buffer(base64ed, 'base64').toString().split(':');
    let name = authArray[0];
    let password = authArray[1];
    User.findOne({email: name}, function(err, user) {
      let valid = user.compareHash(password);
      console.log('valid token: ' + valid);
      if (!valid) {
        return res.json({status: 'failure'});
      }
      var genToken = user.generateToken();
      res.set('token', genToken);
      res.json({token: genToken});
    });
  });

};
