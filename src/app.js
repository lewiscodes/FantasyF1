var sqlite = require('./sqlite');
var dbInit = require('./dbInit.js');
var ongoing = require('./ongoing.js');
var utils = require('./utils.js');

// tests to see if DB has any data; runs dbInit functions if yes; runs executeOngoing if no
sqlite.db.each("SELECT count(*) FROM Seasons", function(err, row) {
  if (err || row === undefined) {
    utils.getDateTime("Started DBInit")
    .then(function() {
      utils.getDateTime("Started initDB")
      return dbInit.initDB();
    })
    .then(function() {
      utils.getDateTime("Started getSeasons")
      return dbInit.getSeasons();
    })
    .then(function() {
      utils.getDateTime("Started initData")
      return dbInit.initData();
    })
    .then(function() {
      utils.getDateTime("Started setSeasons")
      return dbInit.setSeasons();
    })
    .then(function() {
      executeOngoing();
      // runOngoing();
    })
    .catch(function(fail) {
      console.log(fail);
    });
  } else {
    executeOngoing();
    // runOngoing();
  }
});

function executeOngoing() {
  utils.getDateTime("Started executeOngoing")
  .then(function() {
    utils.getDateTime("Started getRaces");
    return ongoing.getRaces();
  })
  .then(function() {
    utils.getDateTime("Started processSeasonRaces");
    return ongoing.processSeasonRaces();
  })
  .then(function() {
    utils.getDateTime("Started getTeams");
    return ongoing.getTeams();
  })
  .then(function() {
    utils.getDateTime("Started processTeams");
    return ongoing.processTeams();
  })
  .then(function() {
    utils.getDateTime("Started getDrivers");
    return ongoing.getDrivers();
  })
  .then(function() {
    utils.getDateTime("Started processDrivers");
    return ongoing.processDrivers();
  })
  .then(function() {
    utils.getDateTime("Started processDriverTeams");
    return ongoing.processDriverTeams();
  })
  .then(function() {
    utils.getDateTime("Started getRaceResults");
    return ongoing.getRaceResults();
  })
  .then(function() {
    utils.getDateTime("Started getQualiResults");
    return ongoing.getQualiResults();
  })
  .catch(function(fail) {
    console.log(fail);
  });
}

function runOngoing() {
  // 5 minute loop
  setInterval(function() {
    executeOngoing();
  }, 300000);
}
