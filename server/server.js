"use strict";

var express           = require('express'),
    session           = require('express-session'),
    path              = require('path'),
    fs                = require('fs'),
    bodyParser        = require('body-parser'),
    cookieParser      = require('cookie-parser'),
    favicon           = require('serve-favicon'),

    SessionMongoStore = require('connect-mongo')(session),

    hbs               = require('hbs'),
    mongoose          = require('mongoose'),
    auth              = require('./auth'),
    routes            = require('./routes'),

    morgan            = require('morgan');


// Configure server
var port = process.env.NODE_PORT || 3000;

var app = express();

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/admin_amateur');

app.set('port', port);
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret:            'test secret',
    name:              'asid',
    saveUninitialized: true,
    resave:            true,
    store:             new SessionMongoStore({mongooseConnection: mongoose.connection})
}));

app.use(morgan('combined'));

auth.init(app);
routes.init(app);

app.set('view engine', 'hbs');


var clientDir, viewsDir;
/**
 * Development Settings
 */
if (app.get('env') === 'development') {
    clientDir = '/public';
    viewsDir = '/views';

    app.use(favicon(__dirname + '/../public/favicon.ico'));
    app.use(express.static(path.join(__dirname, '../.tmp')));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../.')));
}

/**
 * Production Settings
 */
if (app.get('env') === 'production') {
    clientDir = '/../dist';
    viewsDir = '/../dist/views';
    app.use(express.static(path.join(__dirname, '../dist')));
}

app.set('views', __dirname + viewsDir);
app.set('public', __dirname + clientDir);

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error:   {}
    });
});


var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)
});
