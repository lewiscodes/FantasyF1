var sqlite = require('./sqlite');

module.exports.getDateTime = function(calledFrom) {
  return new Promise(function (resolve, reject) {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    console.log(calledFrom + " executed: " + year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec);
    return resolve("success");
  });
}

module.exports.getDriverIDFromDriverRef = function(driverRef) {
  return new Promise(function(resolve, reject) {
    var sqlfile = "SELECT DriverID FROM Drivers_All WHERE DriverReference = '" + driverRef + "'";
    sqlite.db.get(sqlfile, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find driverID");
      }
      return resolve(row.DriverID);
    });
  });
}

module.exports.getTeamIDFromTeamRef = function(teamRef) {
  return new Promise(function(resolve, reject) {
    var sqlfile = "SELECT TeamID FROM Teams_All WHERE TeamRef = '" + teamRef + "'";
    sqlite.db.get(sqlfile, function(err, row) {
      if (err) {
        return reject(err);
      } else if (row === undefined) {
        return reject("cant find teamID");
      }
      return resolve(row.TeamID);
    });
  });
}

module.exports.online = false;
