/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require("request");

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  // https://api.ipify.org?format=json
  //

  request("https://api.ipify.org?format=json", (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (res.statusCode !== 200) {
      const msg = `Status Code ${res.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);

    callback(null, data.ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  request(
    `https://api.freegeoip.app/json/${ip}?apikey=03e55630-3dc1-11ec-951e-abdadbf63c9f`,
    (err, res, body) => {
      if (err) {
        callback(err, null);
        return;
      }

      if (res.statusCode !== 200) {
        const msg = `Status Code ${res.statusCode} when fetching coordinates for IP. Response: ${body}`;
        callback(msg, null);
        return;
      }
      const { latitude, longitude } = JSON.parse(body);
      callback(null, { latitude, longitude });
    }
  );
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (res.statusCode !== 200) {
      const msg = `Status Code ${res.statusCode} when fetching fly over times. Response: ${body}`;
      callback(msg, null);
      return;
    }
    const response = JSON.parse(body).response;
    callback(null, response);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((err, ip) => {
    if (err) {
      callback(err, null);
      return;
    }
    fetchCoordsByIP(ip, (err, location) => {
      if (err) {
        callback(err, null);
        return;
      }
      fetchISSFlyOverTimes(location, (err, nextPasses) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
