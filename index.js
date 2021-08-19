const { nextISSTimesForMyLocation } = require("./iss");

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log(passTimes);
});

/*
//VERIFYING nested functions
fetchMyIP((error, ip) => {
  if (error) {
    console.log("IP fetcher didn't work!" , error);
    return;
  }

  console.log('IP fetcher worked! Returned IP:' , ip, "\n");

  fetchCoordsByIP(ip, (error, data) => {
    if (error) {
      console.log("Coordinate fetcher didn't work!", error);
      return;
    }
    console.log("Coordinate fetcher worked! Here are the coordinates:");
    console.log(data, "\n");

    fetchISSFlyOverTimes(data, (error, times) => {
      if (error) {
        console.log("Flyover time fetcher didn't work!", error);
        return;
      }
      console.log("Flyover time fetcher worked! Here are the times:");
      console.log(times);
    });
  });
});
*/

/*
VERIFYING fetchMyIP
fetchMyIP((error, ip) => {

  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned IP: ", ip);

});
*/