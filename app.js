// Copyright 2015-2016, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START app]
'use strict';

var express = require('express');
var request = require('request');

var app = express();

app.get('/', function (req, res) {
  res.status(200).send('Hello, world!');
});

// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});

function toString(lat, lon) {
  return lat + ',' + lon;
}

app.get('/getDirections', function (req, res) {
  var apiKey = 'AIzaSyDB479MobVWZdWDrPVFPw3LgCNQ5XntIKQ';
  var baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
  var startLat = 28.4683353
  var startLon = 77.0728566
  var endLat = 28.492585
  var endLon = 77.078574

  request({
    url: baseUrl, //URL to hit
    qs: {'key' : apiKey,
        'origin' : toString(startLat, startLon),
         'destination' : toString(endLat, endLon)},//Query string data
    method: 'GET', //Specify the method
    headers: { //We can define headers too
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
      res.status(200).send('Error');
      return
    } else {
      console.log(response.statusCode, body);
    }
    var toRtn = {};
    var googleResponse = JSON.parse(body);
    if (googleResponse.status == 'OK') {
      var routes = googleResponse.routes;
      if (routes && routes.length > 0) {
        var route = routes[0];
        var routeLegs = route.legs;
        if (routeLegs && routeLegs.length > 0) {
          var routeLeg = routeLegs[0];
          toRtn.durationSecs = routeLeg.duration.value;
          toRtn.durationMeters = routeLeg.distance.value;
          }
        }
    }
    console.log(toRtn);
    res.status(200).send(toRtn);
});

});
// [END app]
