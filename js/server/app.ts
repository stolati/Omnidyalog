/// <reference path="./../typings/tsd.d.ts" />

import * as express from 'express';
import * as path from 'path';

import * as db from './db';

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const routes = require('./routes/index');
// var users = require('./routes/users');

const app = express();

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
app.get('/toto', (req, res) => res.send('toto ?'));

app.get('/titi', (req, res) => new Error('Not Found'));
app.get('/getUsers', (req, res) => 
    db.getUsers((users) => {
        res.send(users)
    })
);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err: any = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });


// error handlers

app.listen(3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;


// Working with async/await and bluebird
// https://github.com/Microsoft/TypeScript/issues/6148

//https://stackoverflow.com/questions/32792163/using-native-es6-promises-with-mongodb

//Example mongodb typescript
// https://github.com/Microsoft/TypeScriptSamples/tree/master/imageboard

// 
// https://www.mongodb.com/presentations/ecmascript-6-and-the-node-driver