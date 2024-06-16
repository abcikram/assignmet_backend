const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs')
const colors = require('colors'); // Consider checking if this is used somewhere
require('dotenv').config();

const indexRouter = require('./routes/index');
const connectDB = require('./config/db');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // Ensure pug is installed and views are set accordingly

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// connect to the database
connectDB();

app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // If the request expects JSON, send a JSON response
  if (req.accepts('json')) {
    res.status(err.status || 500).json({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  } else {
    // Render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});






module.exports = app;
