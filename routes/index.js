module.exports = function(passport, dbFunctions, config) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home', isLoggedIn: req.isAuthenticated() });
  });

  return router;
}
