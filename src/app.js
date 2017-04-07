var sqlite = require('./sqlite');
var dbInit = require('./dbInit.js');
var ongoing = require('./ongoing.js');
var utils = require('./utils.js');

// tests to see if DB has any data; runs dbInit functions if yes; runs executeOngoing if no
sqlite.db.each("SELECT count(*) FROM Seasons", function(err, row) {
  if (err || row === undefined) {
    dbInit.initDB().then(function(success) {
      utils.getDateTime("initDB");
      dbInit.getSeasons().then(function(success) {
        utils.getDateTime("getSeasons");
        dbInit.initData().then(function(success) {
          utils.getDateTime("initData");
          dbInit.setSeasons().then(function(success) {
            utils.getDateTime("setSeasons");
            executeOngoing();
            // runOngoing();
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
    // runOngoing();
  }
});

function executeOngoing(num) {
  ongoing.getRaces().then(function(success) {
    utils.getDateTime("getRaces");
    ongoing.processSeasonRaces().then(function(success) {
      utils.getDateTime("processRaces");
    }).catch(function(err) {
      console.log(err);
    });
  }).catch(function(fail) {
    console.log(fail);
  });
}

function runOngoing() {
  // 5 minute loop
  setInterval(function() {
    executeOngoing();
  }, 300000);
}
