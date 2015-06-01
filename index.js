var http = require('http'),
    CronJob = require('cron').CronJob,
    request = require('request'),
    _und = require('underscore'),
    Firebase = require('firebase');
    // firebaseUrl = require('./config.json').dbUrl;

    console.log("testing " + firebaseUrl);

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});
console.log("server is started");

server.listen(process.env.PORT);

function grabTopTwo(arr) {
  return _und.sortBy(arr, function(item, i) {
        return -item.likesCount;
      }).slice(0,2);
}

function saveToFireBase(jams) {
  var ref = new Firebase("https://glaring-heat-1227.firebaseio.com/tracks");
  var ts = new Date().toString();
  _und.each(jams, function(item, i) {
    ref.push({
      createdAt: ts,
      idOnJams: item.id,
      title: item.title,
      artist: item.artist,
      mediumImage: item.jamvatarMedium,
      largeImage: item.jamvatarLarge,
      url: item.viaUrl,
      via: item.via,
      likes: item.likesCount,
      commentsCount: item.commentsCount,
      rejamsCount: item.rejamsCount
    }, function(error) {
      if(error) {
        console.log("There was an error: " + error);  
      }else{
        console.log("Successfully Saved")
      }
    });

  });
}

function getJamsJob() {
  console.log("This job will run daily");

  request.get("http://api.thisismyjam.com/1/explore/popular.json", function(error, response, body) {

    if(!error && response.statusCode == 200) {
      var parsedResult = JSON.parse(body).jams;

      var topTwoJams = grabTopTwo(parsedResult);
      console.log(topTwoJams);
      saveToFireBase(topTwoJams);
    }
  });
}

new CronJob('0 51 20 * * *', getJamsJob, null, true, "America/Los_Angeles");

