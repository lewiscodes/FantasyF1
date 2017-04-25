var express = require('express');
var bodyParser = require('body-parser');
var appJS = require('./src/app.js');
var app = express();
var port = 5000;
var API_URL = "http://ergast.com/api/f1/";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Fantasy F1');
});

app.post('/api/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  res.send(req);
});

app.get('/api/RaceResult', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

app.listen(port, function(err) {
  console.log('running server on port: ' + port);
});