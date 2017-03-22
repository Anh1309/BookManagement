const express = require('express');
const bodyParser = require('body-parser');
const httpStatus = require('http-status');
const routes = require('../server/routes/IndexRoute');
const APIError = require('../server/helpers/APIError');
const path = require('path');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();


// set the view engine to ejs
app.set('views', __dirname + '/../server/views');
app.set('view engine', 'ejs');

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
app.use(flash());
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.use(express.static(path.join(__dirname, '/../public')));
app.use('/', routes);


module.exports = app;
