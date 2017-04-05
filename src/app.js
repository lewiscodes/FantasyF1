var sqlite = require('./sqlite');
var dbInit = require('./dbInit.js');
var ongoing = require('./ongoing.js');

sqlite.db.each("SELECT * FROM Seasons", function(err, row) {
  if (err) {
    dbInit.initDB();
    // dbInit.getSeasons();
    dbInit.initData();
    dbInit.setSeasons();
  }
});

// ongoing.getRaces();
// ongoing.processRaces();

dbInit.dbInitPromise().then(function(successMessage) {
  console.log(successMessage);
}).catch(function(failMessage) {
  console.log(failMessage);
});
