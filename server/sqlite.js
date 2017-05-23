var dbFile = "./db/FantasyF1.db";
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFile);
module.exports.db = db;
