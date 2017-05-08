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
        fs.writeFile("./db/ongoingData/" + row.SeasonID + "/3_SeasonRaces" + row.SeasonID + ".json", json);
      });
    });

    return resolve("success");
  });
}

module.exports.processSeasonRaces = function() {
  return new Promise(function(resolve, reject) {
    // gets the first season where the races haven;t been processed yet
    var sql = "SELECT SeasonID FROM Seasons WHERE FantasySeason = 1 AND RacesProcessed = 0 LIMIT 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return resolve("no races to process");
      }

      var path = "./db/ongoingData/" + row.SeasonID + "/";
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
        fs.writeFile("./db/ongoingData/" + row.SeasonID + "/4_SeasonTeams" + row.SeasonID + ".json", json);
      });
    });
    return resolve("success");
  });
}

module.exports.processTeams = function() {
  return new Promise(function(resolve, reject) {
    // gets the first season where the teams haven;t been processed yet
    var sql = "SELECT SeasonID FROM Seasons WHERE FantasySeason = 1 AND TeamsProcessed = 0 LIMIT 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return resolve("no teams to process");
      }

      var path = "./db/ongoingData/" +  + row.SeasonID + "/";
      fs.readdir(path, function(err, files) {
        files.forEach(function(file) {
          // finds json file for season identified
          if (file.indexOf("4_SeasonTeams" + row.SeasonID + ".json") > -1) {
            fs.readFile(path + file, "utf-8", function(err, string) {
              var json = JSON.parse(string);
              // passes each team to the functions that add team data ot the DB
              for (var x in json.Constructors) {
                addAllTeams(json.Constructors[x]).then(function(success) {
                  addSeasonTeam(row.SeasonID, success[0]).then(function(success) {
                    // updates season record to show teamsProcessed
                    var sql = "UPDATE Seasons SET TeamsProcessed = 1 WHERE SeasonID = " + row.SeasonID;
                    sqlite.db.exec(sql, function(err) {
                      if (err) {
                        return reject(err);
                      }
                      return resolve("success");
                    });
                  }).catch(function(err) {
                    console.log(err);
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

module.exports.getDrivers = function() {
  return new Promise(function(resolve, reject) {
    if (utils.online === false) {
      // bypass getting data if no internet
      return resolve("success");
    }

    sqlite.db.each("SELECT SeasonID FROM Seasons WHERE fantasySeason = 1 AND DriversProcessed = 0", function(err, row) {
      if (err || row === undefined) {
        return reject(err);
      }

      request(API_URL + row.SeasonID + "/drivers" + API_URL_END, function(error, response, body) {
        if (error) {
          console.log(error);
        }

        var json = JSON.parse(body);
        json = JSON.stringify(json.MRData.DriverTable);
        fs.writeFile("./db/ongoingData/" + row.SeasonID + "/5_SeasonDrivers" + row.SeasonID + ".json", json);
      });
    });
    return resolve("success");
  });
}

module.exports.processDrivers = function() {
  return new Promise(function(resolve, reject) {
    // gets the first season where the teams haven;t been processed yet
    var sql = "SELECT SeasonID FROM Seasons WHERE FantasySeason = 1 AND DriversProcessed = 0 LIMIT 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if(row ===undefined) {
        return resolve("no teams to process");
      }

      var path = "./db/ongoingData/" + row.SeasonID + "/";
      fs.readdir(path, function(err, files) {
        files.forEach(function(file) {
          if (file.indexOf("5_SeasonDrivers" + row.SeasonID + ".json") > -1) {
            fs.readFile(path + file, "utf-8", function(err, string) {
              var json = JSON.parse(string);
              for (var x in json.Drivers) {
                addAllDrivers(json.Drivers[x]).then(function(success) {
                  addSeasonDriver(row.SeasonID, success[0]).then(function(success) {
                    var sql = "UPDATE Seasons SET DriversProcessed = 1 WHERE SeasonID = " + row.SeasonID;
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

module.exports.processDriverTeams = function() {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT SeasonID FROM Seasons WHERE FantasySeason = 1 AND DriverTeamsProcessed = 0 LIMIT 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return resolve("no driver teams to process");
      }

      var path  = "./db/ongoingData/" + row.SeasonID + "/";
      fs.readdir(path, function(err, files) {
        files.forEach(function(file) {
          if (file.indexOf("6_SeasonDriverTeam" + row.SeasonID + ".json") > -1) {
            fs.readFile(path + file, "utf-8", function(err, string) {
              var json = JSON.parse(string);
              for (var x = 0 in json.drivers) {
                addSeasonDriverTeam(row.SeasonID, json.drivers[x].driverRef, json.drivers[x].teamRef).then().catch(function(fail) {
                  console.log(fail);
                });
              }
              sql = "UPDATE Seasons SET DriverTeamsProcessed = 1 WHERE SeasonID = '" + row.SeasonID + "'"
              sqlite.db.exec(sql, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve("success");
              });
            });
          }
        });
      });
    });
  });
}

module.exports.getQualiResults = function() {
  return new Promise(function(resolve, reject) {
    if (utils.online === false) {
      // bypass getting data if no internet
      return resolve("success");
    }

    var sql = "SELECT SeasonID, Round, RaceDate, RaceID FROM Races WHERE QualifyingGot = 0 AND RaceDate < Date('now' ,'+1 day') ORDER BY RaceDate ASC LIMIT 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return resolve("no races to process");
      }

      request(API_URL + row.SeasonID + "/" + row.round + "/qualifying" + API_URL_END, function(error, response, body) {
        if (error) {
          console.log(error);
        }

        var json = JSON.parse(body);
        json = json.MRData.RaceTable.Races[0].QualifyingResults;
        for (var x in json) {
          addQualiResult(row.SeasonID, row.round, json[x].Driver.driverId, json[x].position);
        }

        sql = "UPDATE Races SET QualifyingGot = 1 WHERE RaceID = '" + row.RaceID + "' AND SeasonID = '" + row.SeasonID + "'";
        sqlite.db.exec(sql, function(err) {
          if (err) {
            return reject(err);
          }
          return resolve("success");
        });
      });
    });
  });
}

module.exports.getRaceResults = function() {
  return new Promise(function(resolve, reject) {
    if (utils.online === false) {
      // bypass getting data if no internet
      return resolve("success");
    }

    var sql = "SELECT SeasonID, Round, RaceDate, RaceID FROM Races WHERE RaceGot = 0 AND RaceDate < Date('now' ,'+1 day') ORDER BY RaceDate ASC LIMIT 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return resolve("no races to process");
      }

      request(API_URL + row.SeasonID + "/" + row.round + "/results" + API_URL_END, function(error, response, body) {
        if (error) {
          console.log(error);
        }

        var json = JSON.parse(body);
        json = json.MRData.RaceTable.Races[0].Results;
        for (var x in json) {
          addRaceResult(row.SeasonID, row.round, json[x].Driver.driverId, json[x].position);

          if (json[x].FastestLap !== undefined) {
            if (json[x].FastestLap.rank === "1") {
              addRaceFastestLap(row.SeasonID, row.round, json[x].Driver.driverId)
            }
          }
        }

        sql = "UPDATE Races SET RaceGot = 1 WHERE RaceID = '" + row.RaceID + "' AND SeasonID = '" + row.SeasonID + "'";
        sqlite.db.exec(sql, function(err) {
          if (err) {
            return reject(err);
          }
          return resolve("success");
        });
      });
    });
  });
}

module.exports.processPoints = function() {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT RaceID, SeasonID FROM Races where QualifyingGot = 1 AND RaceGot = 1 AND QualifyingProcessed = 0 AND RaceProcessed = 0 LIMIT 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return resolve("no races to process");
      }

      processQualifyingPoints(row.RaceID, row.SeasonID);
      processRacePoints(row.RaceID, row.SeasonID);
    });
  });
}

function addAllRace(Race) {
  return new Promise(function(resolve, reject) {
    // checks to see if this race is already in the Races_All table;
      // if it isn't; creates the record and returns the race data and newly created raceID
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

function addAllTeams(Team) {
  return new Promise(function(resolve, reject) {
    // checks to see if this team is already in the Teams_All table;
      // if it isn't; creates the record and returns the team data and newly created teamID
      // if it is, returns the team data and the teamID found
      var sqlScript = "SELECT count(*) as 'count', TeamID FROM Teams_All WHERE TeamName = '" + Team.name + "'";
      sqlite.db.get(sqlScript, function(err, row) {
        if (err || row === undefined) {
          return reject(err)
        } else if (row.count === 0) {
          var path = "./db/ongoingData/ongoingDataScripts/";
          var sqlfile = "4_AllTeams.sql";

          fs.readFile(path + sqlfile, "utf-8", function(err, sqlString) {
            if (err) {
              return reject(err);
            }

            var stmt = sqlite.db.prepare(sqlString);
            var argumentArray = [Team.name,
              Team.constructorId,
              Team.nationality
            ]
            stmt.run(argumentArray, function(err) {
              if (err) {
                reject(err);
              }
              sqlite.db.get(sqlScript, function(err, row) {
                if (err || row === undefined) {
                  return reject(err);
                }

                return resolve([row.TeamID, Team]);
              });
            });
          });
        } else {
          return resolve([row.TeamID, Team]);
        }
      })
  });
}

function addSeasonTeam(SeasonID, teamID) {
  return new Promise(function(resolve, reject) {
    var path = "./db/ongoingData/ongoingDataScripts/";
    var sqlfile = "4_SeasonTeams.sql";
    fs.readFile(path + sqlfile, "utf-8", function(err,sqlString) {
      if (err) {
        return reject(err);
      }

      var stmt = sqlite.db.prepare(sqlString);
      var argumentArray = [teamID,
        SeasonID
      ];
      stmt.run(argumentArray, function(err) {
        if (err) {
          return reject(err);
        }
        return resolve(argumentArray);
      });
    });
  });
}

function addAllDrivers(Driver) {
  return new Promise(function(resolve, reject) {
    var sqlScript = "SELECT count(*) as 'count', DriverID FROM Drivers_All WHERE DriverName = '" + Driver.givenName + " " + Driver.familyName + "' AND DriverReference = '" + Driver.driverId + "'";
    sqlite.db.get(sqlScript, function(err, row) {
      if (err || row === undefined) {
        return reject(err);
      } else if (row.count === 0) {
        var path = "./db/ongoingData/ongoingDataScripts/";
        var sqlfile = "5_AllDrivers.sql";

        fs.readFile(path + sqlfile, "utf-8", function(err, sqlString) {
          if (err) {
            return reject(err);
          }

          var stmt = sqlite.db.prepare(sqlString);
          var argumentArray = [Driver.driverId,
            Driver.givenName  + " " + Driver.familyName,
            Driver.nationality,
            Driver.dateOfBirth
          ];
          stmt.run(argumentArray, function(err) {
            if (err) {
              reject(err);
            }
            sqlite.db.get(sqlScript, function(err, row) {
              if (err || row === undefined) {
                return reject(err);
              }

              return resolve([row.DriverID, Driver]);
            })
          });
        });
      } else {
        return resolve([row.DriverID, Driver]);
      }
    });
  });
}

function addSeasonDriver(SeasonID, DriverID) {
  return new Promise(function(resolve, reject) {
    var path = "./db/ongoingData/ongoingDataScripts/";
    var sqlfile = "5_SeasonDrivers.sql";

    fs.readFile(path + sqlfile, "utf-8", function(err, sqlString) {
      if (err) {
        return reject(err);
      }

      var stmt = sqlite.db.prepare(sqlString);
      var argumentArray = [DriverID,
        SeasonID
      ];
      stmt.run(argumentArray, function(err) {
        if (err) {
          return reject(err);
        }
        return resolve(argumentArray);
      });
    });
  });
}

function addSeasonDriverTeam(seasonID, driverRef, teamRef) {
  return new Promise(function(resolve, reject) {
    var DriverID = null;
    var TeamID = null;
    utils.getDriverIDFromDriverRef(driverRef).then(function(success) {
      DriverID = success;
      utils.getTeamIDFromTeamRef(teamRef).then(function(success) {
        TeamID = success;
        sqlfile = "UPDATE Drivers SET TeamID = '" + TeamID + "' WHERE DriverID = '" + DriverID + "' AND SeasonID = '" + seasonID + "'"
        sqlite.db.exec(sqlfile, function(err) {
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
  });
}

function addQualiResult(SeasonID, Round, driverRef, position) {
  return new Promise(function(resolve, reject) {
    var DriverID = null;
    var RaceID = null;
    utils.getDriverIDFromDriverRef(driverRef).then(function(success) {
      DriverID = success;
      utils.getRaceIDFromSeasonAndRound(SeasonID, Round).then(function(success) {
        RaceID = success;

        var sqlString = "INSERT INTO QualifyingResults VALUES (?, ?, ?, ?)";
        var stmt = sqlite.db.prepare(sqlString);
        var argumentArray = [SeasonID,
          RaceID,
          DriverID,
          position];
        stmt.run(argumentArray, function(err) {
          if (err) {
            return reject(err);
          }
          return resolve("success");
        });
      });
    });
  });
}

function addRaceResult(SeasonID, Round, driverRef, position) {
  return new Promise(function(resolve, reject) {
    var DriverID = null;
    var RaceID = null;
    utils.getDriverIDFromDriverRef(driverRef).then(function(success) {
      DriverID = success;
      utils.getRaceIDFromSeasonAndRound(SeasonID, Round).then(function(success) {
        RaceID = success;

        var sqlString = "INSERT INTO RaceResults VALUES (?, ?, ?, ?);"
        var stmt = sqlite.db.prepare(sqlString);
        var argumentArray = [SeasonID,
          RaceID,
          DriverID,
          position];
        stmt.run(argumentArray, function(err) {
          if (err) {
            return reject(err);
          }

          return resolve("success");
        });
      });
    });
  });
}

function addRaceFastestLap(SeasonID, Round, driverRef) {
  return new Promise(function(resolve, reject) {
    var DriverID = null;
    var RaceID = null;
    utils.getDriverIDFromDriverRef(driverRef).then(function(success) {
      DriverID = success;
      utils.getRaceIDFromSeasonAndRound(SeasonID, Round).then(function(success) {
        RaceID = success;

        var sqlString = "INSERT INTO RaceFastestLap VALUES (?, ?, ?);"
        var stmt = sqlite.db.prepare(sqlString);
        var argumentArray = [SeasonID,
          RaceID,
          DriverID];
        stmt.run(argumentArray, function(err) {
          if (err) {
            return reject(err);
          }

          return resolve("success");
        });
      });
    });
  });
}

function processQualifyingPoints(RaceID, SeasonID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT QR.RaceID, QR.DriverID, QR.Position, R.SeasonID FROM QualifyingResults QR INNER JOIN Races R ON QR.RaceID = R.RaceID WHERE QR.RaceID = " + RaceID + "AND R.SeasonID = " + SeasonID;
    sqlite.db.each(sql, function(err, row) {
      if (err) {
        return reject(err);
      }

      addQualifyingBeatTeammatePoints(SeasonID, RaceID, row.DriverID, row.Position)
        .then(function(success) {
          return resolve(success);
        })
        .catch(functin(fail) {
          return reject(fail);
        });
    });
  });
}

function processRacePoints(RaceID, SeasonID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT RR.RaceID, RR.DriverID, RR.Position, R.SeasonID FROM RaceResults RR INNER JOIN Races R ON RR.RaceID = R.RaceID WHERE RR.RaceID = " + RaceID + " AND R.SeasonID = " + SeasonID;
    sqlite.db.each(sql, function(err, row) {
      if (err) {
        return reject(err);
      }

      addRaceBeatTeammatePoints(SeasonID, RaceID, row.DriverID, row.Position)
        .then(function() {
          return addRaceFastestLap(SeasonID, RaceID);
        })
        .then(function() {
          return addRace1stPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace2ndPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace3rdPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace4thPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace5thPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace6thPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace7thPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace8thPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace9thPlacePoints(SeasonID, RaceID);
        })
        .then(function() {
          return addRace10thPlacePoints(SeasonID, RaceID);
        })
        .catch(function(fail) {
          console.log(fail);
        })
    });
  });
}

function addQualifyingBeatTeammatePoints(SeasonID, RaceID, DriverID, DriverPosition) {
  return new Promise (function(resolve, reject) {
    utils.getDriverTeammateFromDriverIDAndSeasonForRaceID(row.DriverID, row.SeasonID, RaceID)
      .then(function(TeamMateDriverID) {
        sql = "SELECT * FROM QualifyingResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + TeamMateDriverID;
        sqlite.db.get(sql, function(err, row) {
          if (err) {
            return reject(err);
          } else if (row === undefined) {
            return reject("cant find teammate qualifying result");
          }

          if (DriverPosition < row.Position) {
            sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + row.SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + DriverID;
            sqlite.db.each(sql, function(err, row) {
              if (err) {
                return reject(err);
              }

              addUserPoints(row.UserID, RaceID, 1);
          } else {
            var sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + row.SeasonID + " AND RaceID = " + row.RaceID + " AND DriverID = " + row.DriverID;
            sqlite.db.each(sql, function(err, row) {
              if (err) {
                return reject(err);
              }

              addUserPoints(row.UserID, RaceID, 1);
          }
        });
      });
  });
}

function addRaceBeatTeammatePoints(SeasonID, RaceID, DriverID, DriverPosition) {
  return new Promise (function(resolve, reject) {
    utils.getDriverTeammateFromDriverIDAndSeasonForRaceID(row.DriverID, row.SeasonID, RaceID)
      .then(function(TeamMateDriverID) {
        sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + TeamMateDriverID;
        sqlite.db.get(sql, function(err, row) {
          if (err) {
            return reject(err);
          } else if (row === undefined) {
            return reject("cant find teammate race result");
          }

          if (DriverPosition < row.Position) {
            sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + row.SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + DriverID;
            sqlite.db.each(sql, function(err, row) {
              if (err) {
                return reject(err);
              }

              addUserPoints(row.UserID, RaceID, 2);
          } else {
            var sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + row.SeasonID + " AND RaceID = " + row.RaceID + " AND DriverID = " + row.DriverID;
            sqlite.db.each(sql, function(err, row) {
              if (err) {
                return reject(err);
              }

              addUserPoints(row.UserID, RaceID, 2);
          }
        });
      });
  });
}

function addRaceFastestLapPoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceFastestLap WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID;
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find fastest lap");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 3);
      });
    });
  });
}

function addRace1stPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 1";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 1st place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 4);
      });
    });
  });
}

function addRace2ndPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 2";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 2nd place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 5);
      });
    });
  });
}

function addRace3rdPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 3";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 3rd place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 6);
      });
    });
  });
}

function addRace4thPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 4";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 4th place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 7);
      });
    });
  });
}

function addRace5thPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 5";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 5th place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 8);
      });
    });
  });
}

function addRace6thPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 6";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 6th place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 9);
      });
    });
  });
}

function addRace7thPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 7";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 7th place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 10);
      });
    });
  });
}

function addRace8thPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 8";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 8th place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 11);
      });
    });
  });
}

function addRace9thPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 9";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 9th place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 12);
      });
    });
  });
}

function addRace10thPlacePoints(SeasonID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sql = "SELECT * FROM RaceResults WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND Position = 10";
    sqlite.db.get(sql, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find 10th place race finish");
      }

      sql = "SELECT * FROM UserSeasonDriverUse WHERE SeasonID = " + SeasonID + " AND RaceID = " + RaceID + " AND DriverID = " + row.DriverID;
      sqlite.db.each(sql, function(err, row) {
        if (err) {
          return reject(err);
        }

        addUserPoints(row.UserID, RaceID, SeasonID, 13);
      });
    });
  });
}

function addUserPoints(UserID, RaceID, SeasonID , ScoreID) {
  return new Promise(function(resolve, reject) {
    var sqlString = "INSERT INTO UserPoints VALUES (?, ?, ?, ?)";
    var stmt = sqlite.db.prepare(sqlString);
    var argumentArray = [SeasonID,
      UserID,
      RaceID,
      ScoreID];
    stmt.run(argumentArray, function(err) {
      if (err) {
        return reject(err);
      }

      return resolve("success");
    });
  });
}
