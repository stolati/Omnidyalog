/// <reference path="./../typings/tsd.d.ts" />
"use strict";
var express = require('express');
var path = require('path');
var db = require('./db');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
// var users = require('./routes/users');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
// app.use('/users', users);
// app.get('/', (req, res) => res.send('Hello World 4!'));
app.get('/toto', function (req, res) { return res.send('toto ?'); });
app.get('/titi', function (req, res) { return new Error('Not Found'); });
app.get('/getUsers', function (req, res) {
    return db.getUsers(function (users) {
        res.send(users);
    });
});
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err: any = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
// error handlers
app.listen(3000, function () { return console.log('Example app listening on port 3000!'); });
module.exports = app;
// Working with async/await and bluebird
// https://github.com/Microsoft/TypeScript/issues/6148
//https://stackoverflow.com/questions/32792163/using-native-es6-promises-with-mongodb
//Example mongodb typescript
// https://github.com/Microsoft/TypeScriptSamples/tree/master/imageboard
// 
// https://www.mongodb.com/presentations/ecmascript-6-and-the-node-driver 
