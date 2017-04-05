var sqlite = require('./sqlite');
var dbInit = require('./dbInit.js');
var ongoing = require('./ongoing.js');
var utils = require('./utils.js');

sqlite.db.each("SELECT count(*) FROM Seasons", function(err, row) {
  if (err) {
    dbInit.initDB().then(function(success) {
      utils.getDateTime("initDB");
      dbInit.getSeasons().then(function(success) {
        utils.getDateTime("getSeasons");
        dbInit.initData().then(function(success) {
          utils.getDateTime("initData");
          dbInit.setSeasons().then(function(success) {
            utils.getDateTime("setSeasons");
            executeOngoing();
          }).catch(function(fail) {
            console.log(fail);
          });
        }).catch(function(fail) {
          console.log(fail);
        });
      }).catch(function(fail) {
        console.log(fail);
      });
    }).catch(function(fail) {
      console.log(fail);
    });
  } else {
    executeOngoing();
  }
});

function executeOngoing(num) {
  ongoing.getRaces().then(function(success) {
    utils.getDateTime("getRaces");
    ongoing.processRaces().then(function(success) {
      console.log("success");
    }).catch(function(fail) {
      console.log(fail);
    });
  }).catch(function(fail) {
    console.log(fail);
  });
  // ongoing.processRaces();
}
