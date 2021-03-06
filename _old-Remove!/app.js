var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();
var session = require('express-session')


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/carnewal', function (err, db) {
    if (!err) {
        //console.log('Connected to /carnewal! Dropping...');
        //mongoose.connection.db.dropDatabase();
    } else {
        console.dir(err); //failed to connect
    }
});


var routes = require('./routes/index');
var users = require('./routes/users');



require('./models/Wishlist');
require('./models/Product');
require('./models/User');

require('./config/passport');



var epProduct = require('./routes/api/product');
var epUser = require('./routes/api/user');
var epWishlist = require('./routes/api/wishlist');
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.enable('trust proxy')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'SECRET'}))
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);

app.use('/api/product', epProduct);
app.use('/api/user', epUser);
app.use('/api/wishlist', epWishlist);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
