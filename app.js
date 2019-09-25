var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site
var wiki        = require('./routes/wiki.js');//possibly delete this as was example in tutorial, not in code.

var app = express();

//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/my_database';
//mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
//from https://github.com/strongloop/loopback-connector-mongodb/issues/540
//mongoose.connect(mongoDB, { useNewUrlParser: true });//from original tutorial git repo
//this throws error telling user to use { useUnifiedTopology: true }
//mongoose.connect(mongoDB, {useUnifiedTopology: true});
//this throws error telling user to use { useNewUrlParser: true }

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
//https://expressjs.com/en/guide/using-template-engines.html
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.
app.use('/wiki', wiki);//possibly delete this as was in tutorial not in repo

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("app.js : app.use");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("app.use(function...)")
  // set locals, only providing error in development
  console.log("err.message="+err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
