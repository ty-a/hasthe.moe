var fs = require('fs');

module.exports = function(passport, dbFunctions, config) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()) {
      req.flash('error', 'Please login to view the gallery');
      res.redirect("/login");
      return;
    }

    fs.readdir('./public/i/', function(err, files) {
      if(err) {
        req.flash('error', 'Unable to load gallery :(');
        res.render('gallery', { title: 'Gallery', isLoggedIn: req.isAuthenticated(), errorflash:req.flash('error') });
        return;
      }

      res.render('gallery', {title:'Gallery', isLoggedIn:req.isAuthenticated(), files:files});
      return;
    });


  });

  return router;
}
