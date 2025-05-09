var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {apiRoutes} = require('./routes')
const cors = require('cors')
require('dotenv').config();

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("", (req, res) => {
  res.send("hello world")
})
apiRoutes(app);

app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
