var express = require('express');
var bodyParser = require('body-parser');
var appJS = require('./src/app.js');
var api = require('./src/api.js');
var app = express();
var port = 5000;
var API_URL = "http://ergast.com/api/f1/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Fantasy F1');
});

app.post('/api/createuser', function(req, res) {
  api.createUser(req.body.email, req.body.pin)
  .then(function(success) {res.send(success)})
  .catch(function(fail) {res.send(fail)});
});

app.post('/api/login',function(req,res){
  api.login(req.body.email, req.body.pin)
  .then(function(success) {res.send(success)})
  .catch(function(fail) {res.send(fail)})
});

app.get('/api/getNextRace', function (req, res) {
  api.getNextRace()
  .then(function(success) {res.json(success);})
  .catch(function(fail) {res.json(fail)});
});

app.post('/api/addFantasyPick', function(req, res) {
  api.addFantasyPick(req.body.SeasonID, req.body.UserID, req.body.DriverID, req.body.RaceID)
  .then(function(success) {res.send(success)})
  .catch(function(fail) {res.send(fail)})
});

app.listen(port, function(err) {
  console.log('running server on port: ' + port);
});
