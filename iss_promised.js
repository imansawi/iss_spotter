const request = require("request-promise-native");

const fetchMyIP = function () {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = function (body) {
  const IP = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${IP}`);
};

const fetchISSFlyOverTimes = function (body) {
  const coordinates = JSON.parse(body);
  const lat = coordinates.latitude;
  const lon = coordinates.longitude;
  return request(
    `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`
  );
};

const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };
