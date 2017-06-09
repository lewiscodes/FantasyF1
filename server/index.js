var path = require('path');
var bodyParser = require('body-parser');
var config = require('../webpack.config.js');
var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');

var appJS = require('./app.js');
var api = require('./api.js');
var API_URL = "http://ergast.com/api/f1/";

var app = express();
var router = express.Router();
var port = 8080;
var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {colors: true}
}));
app.use(express.static(path.join(__dirname, '/dist')));
// regex used below includes everything except '/api/'
app.use(/^\/(?!api).*/, express.static(path.join(__dirname, '/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/createuser', function(req, res) {
  api.createUser(req.body.email, req.body.pin)
  .then(function(success) {res.send(success)})
  .catch(function(fail) {res.send(fail)});
});

app.post('/api/login',function(req,res){
  api.login(req.body.email, req.body.pin)
  .then(function(success) {res.send(success)})
  .catch(function(fail) {res.send(fail)});
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
