const { nextISSTimesForMyLocation } = require("./iss_promised");

/*
fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(nextISSTimesForMyLocation);
  //.then(body => console.log(body));
*/

nextISSTimesForMyLocation()
.catch((error) => {
  console.log("It didn't work!", error.message);
});