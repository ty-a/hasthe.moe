var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var sqlite3 = require('sqlite3').verbose();
var session = require('express-session');
var config = require('./config/config.json');

var app = express();
let db = new sqlite3.Database('./db/db.sqlite3', function(err) {
  if(err) {
    console.log("Unable to open database. Please check file permissions.");
    console.error(err);
    process.exit(1);
  }
});



var dbFunctions = require('./includes/db.js')(db);
dbFunctions.createUser("Ty", "awef");

require('./config/passport.js')(passport, dbFunctions);

var indexRouter = require('./routes/index')(passport, dbFunctions);
var usersRouter = require('./routes/users')(passport, dbFunctions);
var uploadRouter = require('./routes/upload')(passport, dbFunctions);
var loginRouter = require('./routes/login')(passport, dbFunctions);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: config.cookiesecret,
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
