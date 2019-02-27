var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var sqlite3 = require('sqlite3').verbose();
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var flash = require('connect-flash');

var config = require('./config/config.json');


var app = express();

var sessionOptions = {
  store: new SQLiteStore({dir:'./db/', db:'sessions.db'}),
  secret: config.cookiesecret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, // dev env is http
    maxAge: 1000 * 60 * 60 * 24 * 7 // one week
  }

};

if (app.get('env') === 'production') {
  // we proxy through nginx
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

let db = new sqlite3.Database('./db/db.sqlite3', function(err) {
  if(err) {
    console.log("Unable to open database. Please check file permissions.");
    console.error(err);
    process.exit(1);
  }
});

var dbFunctions = require('./includes/db.js')(db);

require('./config/passport.js')(passport, dbFunctions);

var indexRouter = require('./routes/index')(passport, dbFunctions, config);
var usersRouter = require('./routes/users')(passport, dbFunctions, config);
var uploadRouter = require('./routes/upload')(passport, dbFunctions, config);
var loginRouter = require('./routes/login')(passport, dbFunctions, config);
var signupRouter = require('./routes/signup')(passport, dbFunctions, config);
var galleryRouter = require('./routes/gallery')(passport, dbFunctions, config);
var deleteRouter = require('./routes/delete')(passport, dbFunctions, config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sessionOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var viewdefault = require('./includes/viewdefaults.js');
app.use(viewdefault({gacode: config.gacode}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/gallery', galleryRouter);
app.use('/delete', deleteRouter);

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
