/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require("request");

const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    return callback(false, data.ip);
    //return data.ip;
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request("https://freegeoip.app/json/" + ip, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      return callback(Error(msg), null);
    }

    let newObj = {};
    const data = JSON.parse(body);
    const lat = data.latitude;
    const long = data.longitude;
    newObj.latitude = lat;
    newObj.longitude = long;
    callback(null, newObj);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times
 * for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const lat = coords.latitude;
  const long = coords.longitude;
  const url = "http://api.open-notify.org/iss-pass.json?lat=" + lat + "&lon=" + long;
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching flyover times. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    callback(null, data.response);
  });
};

// iss.js 

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("IP fetcher didn't work!" , error);
      return;
    }
  
    //console.log('IP fetcher worked! Returned IP:' , ip, "\n");
  
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        console.log("Coordinate fetcher didn't work!", error);
        return;
      }
      // console.log("Coordinate fetcher worked! Here are the coordinates:");
      // console.log(data, "\n");
  
      fetchISSFlyOverTimes(data, (error, times) => {
        if (error) {
          console.log("Flyover time fetcher didn't work!", error);
          return;
        }
        // console.log("Flyover time fetcher worked! Here are the times:");
        // console.log(times);

        for (const time of times) {
          const duration = time.duration;
          const risetime = time.risetime;
          const date = new Date(0);
          date.setUTCSeconds(risetime);
          console.log(`Next pass at ${date} for ${duration} seconds!`);
        }
      });
    });
  });
}

module.exports = { nextISSTimesForMyLocation };