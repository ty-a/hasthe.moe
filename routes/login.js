module.exports = function(passport, dbFunctions, config) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login', isLoggedIn: req.isAuthenticated(), errorflash:req.flash('error') });
  });

  router.post('/', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  return router;
}
