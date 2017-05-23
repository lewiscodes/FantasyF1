var sqlite = require('./sqlite');
var utils = require('./utils.js');
var API_URL = "http://ergast.com/api/f1/";
var API_URL_END = ".json?limit=1000";

module.exports.createUser = function(email, pin) {
  return new Promise(function(resolve, reject) {
    var sqlScript = "SELECT count(*) as 'count' FROM Users WHERE emailAddress = '" + email + "'";
    sqlite.db.get(sqlScript, function(err, row) {
      if (row === undefined) {
        var sqlString = "INSERT INTO Users (emailAddress, pin) VALUES (?, ?)";
        var stmt = sqlite.db.prepare(sqlString);
        var argumentArray = [email,
          pin];
        stmt.run(argumentArray, function(err) {
          if (err) {
            return reject("2");
          }
          return resolve("100");
        });
      } else {
        return reject("1");
      }
    });
  });
}

module.exports.login = function(email, pin) {
  return new Promise(function(resolve, reject) {
    var sqlScript = "SELECT * FROM Users WHERE emailAddress = '" + email + "' AND pin = '" + pin + "'";
    sqlite.db.get(sqlScript, function(err, row) {
      if (err || row === undefined) {
        return reject("3");
      }
      return resolve(row.UserID);
    });
  });
}

module.exports.getNextRace = function() {
  return new Promise(function(resolve, reject) {
    var sqlScript = "SELECT * FROM Races R INNER JOIN Races_All RA ON R.RaceID = RA.RaceID WHERE R.RaceDate > Date('now') ORDER BY R.RaceDate ASC LIMIT 1";
    sqlite.db.get(sqlScript, function(err, row) {
      if (err || row === undefined) {
        return reject("4");
      }
      return resolve(row);
    });
  });
}

module.exports.addFantasyPick = function(SeasonID, UserID, DriverID, RaceID) {
  return new Promise(function(resolve, reject) {
    checkUserDriverAllowance(SeasonID, UserID, DriverID)
      .then(function(success) {
        if (parseInt(success.count) < 3) {
          addUserSeasonDriverUse(SeasonID, UserID, DriverID, RaceID)
            .then(function(success) {
              return resolve("6");
            })
            .catch(function(fail) {return reject(fail)});
        } else {
          return reject("5");
        }
      })
      .catch(function(fail) {return reject(fail)});
  });
}

function checkUserDriverAllowance(SeasonID, UserID, DriverID) {
  return new Promise(function(resolve, reject) {
    var sqlScript = "SELECT COUNT(*) as 'count' FROM UserSeasonDriverUse WHERE SeasonID = '" + SeasonID +"' AND UserID = '" + UserID + "' AND DriverID = '" + DriverID +"'";
    sqlite.db.get(sqlScript, function(err, row) {
      if (err || row === undefined) {
        return reject("2");
      }
      return resolve(row);
    });
  });
}

function addUserSeasonDriverUse(SeasonID, UserID, DriverID, RaceID) {
  return new Promise(function(resolve, reject) {
    var sqlScript = "INSERT INTO UserSeasonDriverUse VALUES(?, ?, ?, ?)";
    var stmt = sqlite.db.prepare(sqlScript);
    var argumentArray = [SeasonID,
      UserID,
      DriverID,
      RaceID
    ];
    stmt.run(argumentArray, function(err) {
      if (err) {
        return reject("2");
      }
      return resolve("100");
    });
  });
}
