module.exports = function(passport, dbFunctions, config) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.locals.viewsettings.title="Home"
    res.render('index', res.locals.viewsettings);
  });

  return router;
}
