module.exports = function(passport, dbFunctions, config) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.locals.viewsettings.title = "Login";
    res.render('login', res.locals.viewsettings);
  });

  router.post('/', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  return router;
}
