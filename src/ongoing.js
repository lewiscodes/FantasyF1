var request = require('request');
var fs = require("fs");
var dbFile = "./db/FantasyF1.db";
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFile);
var API_URL = "http://ergast.com/api/f1/";
var API_URL_END = ".json?limit=1000";
var debug = true;

if (debug === true) {
  init();
}

function init() {
  getRaces();
  processRaces();
}

function getRaces() {
  db.each("SELECT SeasonID FROM Seasons WHERE fantasySeason = 1", function(err, row) {
    request(API_URL + row.SeasonID + API_URL_END, function(error, response, body) {
      var json = JSON.parse(body);
      json = JSON.stringify(json.MRData.RaceTable);
      fs.writeFile("./db/ongoingData/3_SeasonRaces" + row.SeasonID + ".json", json);
    });
  });
}

function processRaces() {
  var path = "./db/ongoingData/";

  fs.readdir(path, function(err, files) {
    files.forEach(function(file) {
      if (file.indexOf(".json") > -1) {
        var sqlFile = file.replace('.json','') + ".sql";
      }
    });
  });
}
