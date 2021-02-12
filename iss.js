const request = require('request');

 // Fetch IP Address
const fetchMyIP = (callback) => {
  // Use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // Error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error,null);
    }
    // If non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null,JSON.parse(body).ip);
  });
};

// Fetch Geo Coordinates By IP //
const fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`,  (error, response, body) => {
    if (error) {
      return callback(error,null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
  });
};

// Fetch Flyover Times for ISS
const fetchISSFlyOverTimes = function(coords, callback) {

  const lat = coords.latitude;
  const lon = coords.longitude;
  const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`;

  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
      
    const passes = (JSON.parse(body)).response;
    callback(null, passes);

  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };