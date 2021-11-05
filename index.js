const { nextISSTimesForMyLocation } = require("./iss");

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  for (let pass of passTimes) {
    const time = new Date(0);
    time.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${time} for ${pass.duration} seconds`);
  }
});

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   console.log("It worked! Returned IP: ", ip);
//   fetchCoordsByIP(ip, (error, data) => {
//     if (error) {
//       console.log("It didn't work!", error);
//       return;
//     }
//     console.log("It worked! Returned coordinates: ", data);

//     fetchISSFlyOverTimes(data, (error, data) => {
//       if (error) {
//         console.log("It didn't work!", error);
//         return;
//       }
//       console.log("It worked! Returned flyover times: ", data);
//     });
//   });
// });
