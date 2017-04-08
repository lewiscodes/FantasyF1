var request = require('request');
var fs = require("fs");
var sqlite = require('./sqlite');
var utils = require('./utils.js');
var API_URL = "http://ergast.com/api/f1/";
var API_URL_END = ".json?limit=1000";

module.exports.getRaces = function() {
  return new Promise(function(resolve, reject) {
    if (utils.online === false) {
      // bypass getting data if no internet
      return resolve("success");
    }

    // finds each season that has not had races processed yet
    sqlite.db.each("SELECT SeasonID FROM Seasons WHERE fantasySeason = 1 AND RacesProcessed = 0", function(err, row) {
      if (err || row === undefined) {
        return reject(err);
      }

      // gets race data for season identified
      request(API_URL + row.SeasonID + API_URL_END, function(error, response, body) {
        if (error) {
          return reject(error);
        }

        // saves race data to specific season file
        var json = JSON.parse(body);
        json = JSON.stringify(json.MRData.RaceTable);
        fs.writeFile("./db/ongoingData/3_SeasonRaces" + row.SeasonID + ".json", json);
      });
    });

    return resolve("success");
  });
}

module.exports.processSeasonRaces = function() {
  return new Promise(function(resolve, reject) {
    var path = "./db/ongoingData/";
    // gets the first season where the races haven;t been processed yet
    var sql = "SELECT SeasonID FROM Seasons WHERE FantasySeason = 1 AND RacesProcessed = 0 LIMIT 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return resolve("no races to process");
      }

      fs.readdir(path, function(err, files) {
        files.forEach(function(file) {
          // finds json file for season identified
          if (file.indexOf("3_SeasonRaces" + row.SeasonID + ".json") > -1) {
            fs.readFile(path + file, "utf-8", function(err, string) {
              var json = JSON.parse(string);
              // passes each race to the functions that add race data to the DB
              for (var x in json.Races) {
                addAllRace(json.Races[x]).then(function(success) {
                  addSeasonRace(success[1], success[0]).then(function(success) {
                    // updates season record to show racesProcessed
                    var sql = "UPDATE Seasons SET RacesProcessed = 1 WHERE SeasonID = " + row.SeasonID;
                    sqlite.db.exec(sql, function(err) {
                      if (err) {
                        return reject(err);
                      }
                      return resolve("success");
                    });
                  }).catch(function(fail) {
                    console.log(fail);
                  });
                }).catch(function(fail) {
                  console.log(fail);
                });
              }
            });
          }
        });
      });
    });
  });
}

module.exports.getTeams = function() {
  return new Promise(function(resolve, reject) {
    if (utils.online === false) {
      // bypass getting data if no internet
      return resolve("success");
    }


    // finds each season that has not had teams processed
    sqlite.db.each("SELECT SeasonID FROM Seasons WHERE fantasySeason = 1 AND teamsProcessed = 0", function(err, row) {
      console.log(row);
      if (err || row === undefined) {
        return reject(err);
      }
      // gets team data for season identified
      request(API_URL + row.SeasonID + "/constructors" + API_URL_END, function(error, response, body) {
        if (error) {
          return reject(error);
        }

        // saves team data to specific season file
        var json = JSON.parse(body);
        json = JSON.stringify(json.MRData.ConstructorTable);
        fs.writeFile("./db/ongoingData/4_SeasonTeams" + row.SeasonID + ".json", json);
      });
    });
    return resolve("success");
  });
}

function addAllRace(Race) {
  return new Promise(function(resolve, reject) {
    // checks to see if this race is already in the Races_All table;
      // if it isn't; creates the season record and returns the race data and newly created raceID
      // if it is, returns the race data and the raceID found
    var sqlScript = "SELECT count(*) as 'count', RaceID FROM Races_All WHERE RaceName = '" + Race.raceName + "' AND CircuitID = '" + Race.Circuit.circuitId + "'";
    sqlite.db.get(sqlScript, function(err, row) {
      if (err || row === undefined) {
        return reject(err);
      } else if (row.count === 0) {
        var path = "./db/ongoingData/ongoingDataScripts/";
        var sqlfile = "3_AllRaces.sql";

        fs.readFile(path + sqlfile, "utf-8", function(err, sqlString) {
          if (err) {
            return reject(err);
          }

          var stmt = sqlite.db.prepare(sqlString);
          var argumentArray = [Race.raceName,
            Race.Circuit.circuitId,
            Race.Circuit.circuitName,
            Race.Circuit.Location.locality,
            Race.Circuit.Location.country];
          stmt.run(argumentArray, function(err) {
            if (err) {
              return reject(err);
            }
            sqlite.db.get(sqlScript, function(err, row) {
              if (err || row === undefined) {
                return reject(err);
              }

              return resolve([row.RaceID, Race]);
            });
          });
        });
      } else {
        return resolve([row.RaceID, Race]);
      }
    });
  });
}

function addSeasonRace(Race, raceID){
  return new Promise(function(resolve, reject) {
    var path = "./db/ongoingData/ongoingDataScripts/";
    var sqlfile = "3_SeasonRaces.sql";
    fs.readFile(path + sqlfile, "utf-8", function(err, sqlString) {
      if (err) {
        return reject(err);
      }

      var stmt = sqlite.db.prepare(sqlString);
      var argumentArray = [raceID,
        Race.season,
        Race.round,
        Race.date,
        Race.time];
      stmt.run(argumentArray, function(err) {
        if (err) {
          return reject(err);
        }
        return resolve(argumentArray);
      });
    });
  });
}
