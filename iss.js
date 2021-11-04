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
    `https://api.freegeoip.app/json/invalidip?apikey=03e55630-3dc1-11ec-951e-abdadbf63c9f`,
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

module.exports = { fetchMyIP, fetchCoordsByIP };
