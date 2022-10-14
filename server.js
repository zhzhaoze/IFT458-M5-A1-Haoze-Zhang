'use strict';
/**
 * ift458 Haoze Zhang
 * server.js
 * mongoose
 */

//config.env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
//listen port 3000
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/todoListModel'),
  User = require('./api/models/userModel'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken");

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/Tododb');

const MONGO_DATA_BASE = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

// //Connext to database
//Connext to database
mongoose.connect(MONGO_DATA_BASE,
  //connection recipie
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //useCreateIndex: true
  }).then(con=>{
    console.log(con.connection);// log connection properties
    console.log(`The Database connection was successful with ${process.env.DATABASE}`);// log connection properties
  });

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
//routes
var routes = require('./api/routes/todoListRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

module.exports = app;