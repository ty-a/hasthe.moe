var LocalStrategy = require('passport-local').Strategy;
module.exports = function(passport, dbFunctions) {
  passport.use('local-login', new LocalStrategy({
      session: true
    },
    function(username, password, done) {
      dbFunctions.loginUser(username, password, done);
    }
  ));

  passport.serializeUser(function(user, done) {
    console.log(user);
    return done(null, user.userId);
  });

  passport.deserializeUser(function(userId, done) {
    dbFunctions.getUserFromId(userId, done);
  });

  passport.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }

    res.redirect('/login');
  };
}
