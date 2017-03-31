var request = require('request');

var fs = require("fs");
var dbFile = "./db/FantasyF1.db";
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFile);
var API_URL = "http://ergast.com/api/f1/";

if (fs.existsSync(dbFile) === false) {
  // only runs if there is no DB file
  initDB();
  initData();
  // db.close();
}

getSeasons();
initData();

function initDB() {
  // gets each sql file and executes it to create DB tables
  var scriptPath = "./db/initScripts/";
  fs.readdir(scriptPath, function(err, files) {
    files.forEach(function(file) {
      fs.readFile(scriptPath + file, "utf-8", function(err, script) {
        db.run(script);
      });
    });
  });
}

function initData() {
  var path = "./db/initData/";
  fs.readdir(path, function(err, files) {
    files.forEach(function(file) {
      if (file.indexOf(".json") > -1) {
        fs.readFile(path + file, "utf-8", function(err, string) {
          var json = JSON.parse(string);
          var sqlFile = file.replace(".json",".sql");
          fs.readFile(path + sqlFile, "utf-8", function(err, sqlString) {
            var numOfParams = sqlString.match(new RegExp("\\?", "g") || []).length;
            // var stmt = db.prepare(sqlString);
            json = json[Object.keys(json)[0]];

            for (var x=1; x<=Object.keys(json).length; x++) {
              console.log(json[x]);
              // var id = json.score[x]["id"];
              // var description = json.score[x]["description"];
              // var score = json.score[x]["score"];
              //
              // stmt.run(id, description, score);
            }
          });
        });
      }
    });
  });
}

function getSeasons() {
  request(API_URL + "seasons.json?limit=1000", function(error, response, body) {
    var json = JSON.parse(body);
    json = JSON.stringify(json.MRData.SeasonTable);
    fs.writeFile("./db/initData/1_Seasons.json", json);
  })
}
