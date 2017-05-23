var request = require('request');
var fs = require("fs");
var utils = require('./utils.js');
var sqlite = require('./sqlite');
var API_URL = "http://ergast.com/api/f1/";
var API_URL_END = ".json?limit=1000";

module.exports.initDB = function() {
  return new Promise(function(resolve, reject) {
    // gets each sql file and executes it to create DB tables
    var scriptPath = "./db/initScripts/";
    fs.readdir(scriptPath, function(err, files) {
      var x = 0;
      files.forEach(function(file) {
        fs.readFile(scriptPath + file, "utf-8", function(err, script) {
          sqlite.db.run(script, function(err, row) {
            if(err) {
              return reject(err);
            } else {
              x++;
              if (x === files.length) {
                return resolve("success");
              }
            }
          });
        });
      });
    });
  });
}

module.exports.getSeasons = function() {
  return new Promise(function(resolve, reject) {
    if (utils.online === false) {
      // bypass getting data if no internet
      return resolve("success");
    }

    // gets seasons data form API and saves it to file.
    request(API_URL + "seasons" + API_URL_END, function(error, response, body) {
      if (error) {
        return reject(error);
      } else {
        var json = JSON.parse(body);
        json = JSON.stringify(json.MRData.SeasonTable);
        fs.writeFile("./db/initData/1_Seasons.json", json);
        utils.getDateTime("getSeasons");
        return resolve("success");
      }
    });
  });
}

module.exports.initData = function() {
  return new Promise(function(resolve, reject) {
    var path = "./db/initData/";
    // gets json files and finds associated sql file
    fs.readdir(path, function(err, files) {
      var numOfFiles = 0;
      files.forEach(function(file) {
        if (file.indexOf(".json") > -1) {
          fs.readFile(path + file, "utf-8", function(err, string) {
            var json = JSON.parse(string);
            var sqlFile = file.replace(".json",".sql");
            // gets the number of params required by the sql file
            fs.readFile(path + "initDataScripts/" + sqlFile, "utf-8", function(err, sqlString) {
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
                // execute the sql query
                stmt.run(argumentArray, function(err, row) {
                  if (err) {
                    return reject(err);
                  } else {
                    numOfFiles++;
                    if(numOfFiles === files.length) {
                      return resolve("success");
                    }
                  }
                });
              }
            });
          });
        }
      });
    });
  });
}

module.exports.setSeasons = function() {
  // sets all seasons after 2015 to fatasy seasons
  return new Promise(function(resolve, reject) {
    sqlite.db.exec("UPDATE Seasons SET FantasySeason = 1 WHERE SeasonID >= 2016", function(err) {
      if (err) {
        return reject(err);
      } else {
        return resolve("success");
      }
    });
  });
}
