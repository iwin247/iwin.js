var express = require('express');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var path = require('path');
var bodyParser = require('body-parser');
var vhost = require('vhost');
var randomstring = require('randomstring');
var app = express();
var debug = require('debug')('dicon:server');
var rnd_string = require("randomstring");
var fs = require('fs');
var router = express.Router();
var async = require('async');

//module setting
var db = require('./mongo');
var passport = require('./passport')(db.Users);
var func = require('./func');

var port = process.env.PORT || 8081;

//set engin
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


//router setting
var index = require('./routes/index')(router);
var auth = require('./routes/auth')(router, rnd_string, db.Users, passport, func);
var version = require('./routes/version')(router);
var user = require('./routes/user')(router, db.Users, passport);
var setting = require('./routes/setting')(router, fs, db.Users, async);

//router setting
app.use('/', index);
app.use('/auth', auth);
app.use('/version', version);
app.use('/user', user);
app.use('/setting', setting);


//create server
app.on('error', onError);
app.on('listening', onListening);
//error handle
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    console.log(addr);
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;
