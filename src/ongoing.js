function getRaces() {
  db.each("SELECT SeasonID FROM Seasons WHERE fantasySeason = 1", function(err, row) {
    request(API_URL + row.SeasonID + API_URL_END, function(error, response, body) {
      var json = JSON.parse(body);
      json = JSON.stringify(json.MRData.RaceTable);
      fs.writeFile("./db/initData/3_SeasonRaces" + row.SeasonID + ".json", json);
    });
  });
}
