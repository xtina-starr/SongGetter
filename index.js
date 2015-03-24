var http = require('http'),
    CronJob = require('cron').CronJob,
    request = require('request'),
    _und = require('underscore'),
    Firebase = require('firebase');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});

server.listen(1337, '127.0.0.1');

new CronJob('0 30 10 * * *', function() {
  console.log("This job will run daily");

  request.get("http://api.thisismyjam.com/1/explore/popular.json", function(error, response, body) {

    if(!error && response.statusCode == 200) {
      var parsedResult = JSON.parse(body).jams;

      var sorted = _und.sortBy(parsedResult, function(item, i) {
        return -item.likesCount;
      }).slice(0,2);

      console.log(sorted);

      var ref = new Firebase();
      var ts = new Date().toString();

      _und.each(sorted, function(item, i) {
        ref.push({
          idOnJams: item.id,
          title: item.title,
          artist: item.artist,
          mediumImage: item.jamvatarMedium,
          largeImage: item.jamvatarLarge,
          url: item.viaUrl,
          via: item.via,
          likes: item.likesCount,
          commentsCount: item.commentsCount,
          rejamsCount: item.rejamsCount,
          createdAt: ts
        }, function(error) {
          if(error) {
            console.log("There was an error: " + error);  
          }else{
            console.log("Successfully Saved")
          }
        });

      });
      console.log("*************************");
    }

  });

}, null, true, "America/Los_Angeles");

