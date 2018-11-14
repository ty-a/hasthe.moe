module.exports = function(passport, dbFunctions, config) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    if(config.requireLoginToCreateAccounts) {
      if(!req.isAuthenticated()) {
        req.flash('error', "You must be signed in to create user accounts");
        res.redirect("/login");
        return;
      }
    }
    res.render('signup', { title: 'Sign up', isLoggedIn: req.isAuthenticated(), errorflash:req.flash('error'), successflash:req.flash('success') });
  });

  router.post('/', function(req, res, next) {
    if(config.requireLoginToCreateAccounts) {
      if(!req.isAuthenticated()) {
        req.flash('error', "You must be signed in to create user accounts");
        res.redirect("/login");
        return;
      }
    }

    if(typeof req.body.username == "undefined") {
      req.flash('error', "No username provided");
      res.redirect('/signup');
      return;
    }

    if(req.body.password != req.body.password2) {
      req.flash('error', "Passwords do not match");
      res.redirect("/signup");
      return;
    }

    var resp = dbFunctions.createUser(req, req.body.username, req.body.password, function(success, message) {
      if(success) {
        req.flash('success', "Account created successfully! Please login.");
      } else {
        req.flash('error', message);
      }

      res.redirect('/signup');
    });


  });

  return router;
}
