var request = require('request');
var fs = require("fs");
var sqlite = require('./sqlite');
var utils = require('./utils.js');
var API_URL = "http://ergast.com/api/f1/";
var API_URL_END = ".json?limit=1000";

module.exports.getRaces = function() {
  return new Promise(function(resolve, reject) {
    if (utils.online === false) {
      resolve("success");
    }

    var x = 0;
    sqlite.db.each("SELECT SeasonID FROM Seasons WHERE fantasySeason = 1", function(err, row) {
      if (err) {
        reject(err);
      }
      request(API_URL + row.SeasonID + API_URL_END, function(error, response, body) {
        if (error) {
          reject(error);
        }

        var json = JSON.parse(body);
        json = JSON.stringify(json.MRData.RaceTable);
        fs.writeFile("./db/ongoingData/3_SeasonRaces" + row.SeasonID + ".json", json);

        x++;
        if (x === row.length) {
          resolve("success");
        }
      });
    });
  });
}

module.exports.processRaces = function() {
  return new Promise(function(resolve, reject) {
    var path = "./db/ongoingData/";

    fs.readdir(path, function(err, files) {
      files.forEach(function(file) {
        var sqlAllFile = "3_AllRaces.sql";
        var sqlfile = "3_SeasonRaces.sql";
        if (file.indexOf(".json") > -1) {
          fs.readFile(path + file, "utf-8", function(err, string) {
            var json = JSON.parse(string)
            for(var x in json.Races) {
              var sqlString = "SELECT count(*) as 'count' FROM Races_All WHERE RaceName = '" + json.Races[x].raceName + "' AND CircuitID = '" + json.Races[x].Circuit.circuitId + "'";
              sqlite.db.get(sqlString, function(err, row) {
                if (row.count === 0) {
                  addNewRaceAll(json.Races[x])
                }
                // console.log(row);
                // if (row.count === 0) {
                //   var argumentArray = [json.Races[x].raceName,
                //     json.Races[x].Circuit.circuitId,
                //     json.Races[x].Circuit.circuitName,
                //     json.Races[x].Circuit.Location.locality,
                //     json.Races[x].Circuit.Location.country
                //   ]
                //   console.log(argumentArray);
                // }





                fs.readFile(path + "ongoingDataScripts/" + sqlAllFile, "utf-8", function(err, string) {
                  var stmt = sqlite.db.prepare(string);
                  var argumentArray = [json.Races[x].raceName,
                                      json.Races[x].Circuit.circuitId,
                                      json.Races[x].Circuit.circuitName,
                                      json.Races[x].Circuit.Location.locality,
                                      json.Races[x].Circuit.Location.country
                                    ]
                  stmt.run(argumentArray, function() {});
                });
              });
            }
          });
        }
      });
    });
  });
}

function addNewRaceAll(json) {
  return new Promise(function(resolve, reject) {
    console.log(json);
  });
}
