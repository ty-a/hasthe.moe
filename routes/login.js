module.exports = function(passport, dbFunctions) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login - hasthe.moe', isLoggedIn: req.isAuthenticated() });
  });

  router.post('/', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  return router;
}
