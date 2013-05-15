
var request = require('request');
request('http://media.daum.net/export/json/16b7fa5961634ab8ba71211c87796f3a', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
  }
})
