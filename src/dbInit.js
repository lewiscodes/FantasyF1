var request = require('request');
var fs = require("fs");
var utils = require('./utils.js');
var sqlite = require('./sqlite');
var API_URL = "http://ergast.com/api/f1/";
var API_URL_END = ".json?limit=1000";

module.exports.initDB = function() {
  // gets each sql file and executes it to create DB tables
  var scriptPath = "./db/initScripts/";
  fs.readdir(scriptPath, function(err, files) {
    files.forEach(function(file) {
      fs.readFile(scriptPath + file, "utf-8", function(err, script) {
        sqlite.db.run(script, function() {});
      });
    });
  });
  utils.getDateTime("initDB");
}

module.exports.initData = function() {
  var path = "./db/initData/";
  // gets json files and finds associated sql file
  fs.readdir(path, function(err, files) {
    files.forEach(function(file) {
      if (file.indexOf(".json") > -1) {
        fs.readFile(path + file, "utf-8", function(err, string) {
          var json = JSON.parse(string);
          var sqlFile = file.replace(".json",".sql");
          // gets the number of params required by the sql file
          fs.readFile(path + sqlFile, "utf-8", function(err, sqlString) {
            var numOfParams = sqlString.match(new RegExp("\\?", "g") || []).length;
            var stmt = sqlite.db.prepare(sqlString);
            json = json[Object.keys(json)[0]];
            // gets the first x keys from json; where x is the number of params required
            for(var x in json) {
              var argumentArray = [];
              // create a data array for each data object in json and pass it to sql query
              for (var y=0; y < numOfParams; y++) {
                var keyName = Object.keys(json[x])[y]
                argumentArray.push(json[x][keyName]);
              }
              stmt.run(argumentArray, function() {});
            }
          });
        });
      }
    });
  });
  utils.getDateTime("initData");
}

module.exports.getSeasons = function() {
  request(API_URL + "seasons" + API_URL_END, function(error, response, body) {
    var json = JSON.parse(body);
    json = JSON.stringify(json.MRData.SeasonTable);
    fs.writeFile("./db/initData/1_Seasons.json", json);
    utils.getDateTime("getSeasons");
  });
}

module.exports.setSeasons = function() {
  sqlite.db.run("UPDATE Seasons SET FantasySeason = 1 WHERE SeasonID >= '2016'", function() {});
  utils.getDateTime("setSeasons");
}

module.exports.dbInitPromise = function dbInitPromise() {
  return new Promise(function (resolve, reject) {
    var sql = "SELECT * FROM Score WHERE ScoreID = 1";
    sqlite.db.get(sql, function(err, row) {
      if (!err) {
        console.log(row);
        resolve("success");
      } else {
        console.log(err);
        reject("failiure");
      }
    });
  });
}
