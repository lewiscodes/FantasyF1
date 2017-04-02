var express = require('express');
var dbInit = require('./src/dbInit.js');
var ongoing = require('./src/ongoing.js');
var app = express();
var port = 5000;
var API_URL = "http://ergast.com/api/f1/";

app.listen(port, function(err) {
  console.log('running server on port: ' + port);
});

app.get('/', function(req, res) {
  res.send('Fantasy F1');
});
