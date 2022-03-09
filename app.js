var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var request = require('request')

var indexRouter = require('./routes/index');
var recargarRouter = require('./routes/recargar');
var nextRouter = require('./routes/next');
var checkRouter = require('./routes/check-info');
var getProductsRouter = require('./routes/getProducts'); 
var paymentControl = require('./routes/payment.routes')
//var paymentSuccess = require('./routes/payment-successful')

var app = express();
app.use( cors() )


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/recargar/n', nextRouter);
app.use('/recargar', recargarRouter);
app.use('/check-info', checkRouter);
app.use('/getProducts', getProductsRouter);
app.use('/p', paymentControl );
app.use('p/payment-successful', paymentControl );

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
