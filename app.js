var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// /sys/login 
var itsysRouter = require('./routes/api/sys');
//      外部路径      内部路径
app.use('/api/sys', itsysRouter);

// /company/department 
// 以api开头
var itdepRouter = require('./routes/api/dep');

app.use('/api/company', itdepRouter);


var itsocRouter = require('./routes/api/social');

app.use('/api/social', itsocRouter);


var itattRouter = require('./routes/api/att');

app.use('/api/attendences', itattRouter);


var itappRouter = require('./routes/api/approvals');

app.use('/api/approvals', itappRouter);

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
