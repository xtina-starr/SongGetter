var http = require('http'),
    CronJob = require('cron').CronJob,
    request = require('request');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});

server.listen(1337, '127.0.0.1');

new CronJob('* * * * * *', function() {
  console.log("This job will run daily");
})

