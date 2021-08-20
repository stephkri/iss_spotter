const request = require("request-promise-native");

/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */

const fetchMyIP = function() {
  return request("https://api.ipify.org?format=json");
  // request is now a new variable, doesn't do the same as when it was just require("request").
  // it now contains a promise
};

const fetchCoordsByIP = function(body) {
  const ipString = JSON.parse(body).ip;
  return request("https://freegeoip.app/json/" + ipString);
};

const fetchISSFlyOverTimes = function(body) {
  const lat = JSON.parse(body).latitude;
  const lon = JSON.parse(body).longitude;
  return request("http://api.open-notify.org/iss-pass.json?lat=" + lat + "&lon=" + lon);
};

/*
const nextISSTimesForMyLocation = function(body) {
  const response = JSON.parse(body).response;
  for (const time of response) {
    const date = new Date(0);
    date.setUTCSeconds(time.risetime);
    console.log(`Next pass at ${date} for ${time.duration} seconds`)
  }
}
*/

const nextISSTimesForMyLocation = function(body) {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(body => {
    const response = JSON.parse(body).response;
    for (const time of response) {
      const date = new Date(0);
      date.setUTCSeconds(time.risetime);
      console.log(`Next pass at ${date} for ${time.duration} seconds`)
    }
  });
}

module.exports = { nextISSTimesForMyLocation };