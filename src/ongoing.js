var request = require('request');
var fs = require("fs");
var sqlite = require('./sqlite');
var API_URL = "http://ergast.com/api/f1/";
var API_URL_END = ".json?limit=1000";

module.exports.getRaces = function() {
  sqlite.db.each("SELECT SeasonID FROM Seasons WHERE fantasySeason = 1", function(err, row) {
    request(API_URL + row.SeasonID + API_URL_END, function(error, response, body) {
      var json = JSON.parse(body);
      json = JSON.stringify(json.MRData.RaceTable);
      fs.writeFile("./db/ongoingData/3_SeasonRaces" + row.SeasonID + ".json", json);
    });
  });
}

module.exports.processRaces = function() {
  var path = "./db/ongoingData/";

  fs.readdir(path, function(err, files) {
    files.forEach(function(file) {
      var sqlAllFile = "3_AllRaces.sql";
      var sqlfile = "3_SeasonRaces.sql";
      if (file.indexOf(".json") > -1) {
        fs.readFile(path + file, "utf-8", function(err, string) {
          var json = JSON.parse(string)
          for(var x in json.Races) {
            var sqlString = "SELECT count(*) as 'count', " + x + " as 'rowNumber' FROM Races_All WHERE RaceName = '" + json.Races[x].raceName + "' AND CircuitID = '" + json.Races[x].Circuit.circuitId + "'";
            sqlite.db.get(sqlString, function(err, row) {
              console.log(row);
              if (row.count === 0) {
                fs.readFile(path + sqlAllFile, "utf-8", function(err, string) {
                  var stmt = sqlite.db.prepare(string);
                  var argumentArray = [json.Races[row.rowNumber].raceName,
                                      json.Races[row.rowNumber].Circuit.circuitId,
                                      json.Races[row.rowNumber].Circuit.circuitName,
                                      json.Races[row.rowNumber].Circuit.Location.locality,
                                      json.Races[row.rowNumber].Circuit.Location.country
                                    ]
                  stmt.run(argumentArray, function() {});
                });
              }
            })
          }
        });
      }
    });
  });
}
