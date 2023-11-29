const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');
require('./config/passport');

const db = require('./config/db');
const app = express();
const route = require('./routes');

// connect to db
db.connect();
// static file
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// set up session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
    }),
);

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set up passport
app.use(passport.initialize());
app.use(passport.session());

// global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

route(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    // next(createError(404));
    res.redirect('/');
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.json({
        status: err.status || 500,
        message: err.message,
    });
});

module.exports = app;