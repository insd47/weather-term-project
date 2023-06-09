const {
  getDustShortForecast,
  getDustMidForecast,
  getDustWarn,
} = require("./dust");

const {
  getShortForecast,
  getMidWeatherForecast,
  getMidTemperatureForecast,
  getWeatherWarnCode,
  getWeatherWarn,
} = require("./weather");

const { getAddress } = require("./kakao");

const router = require("express").Router();

router.get("/example", (req, res) => {
  res.send("hello world");
});

// dust
router.get("/dust/forecast/short", getDustShortForecast);
router.get("/dust/forecast/mid", getDustMidForecast);
router.get("/dust/warn", getDustWarn);

// weather
router.get("/weather/forecast/short", getShortForecast);
router.get("/weather/forecast/mid/weather", getMidWeatherForecast);
router.get("/weather/forecast/mid/temperature", getMidTemperatureForecast);
router.get("/weather/warn", getWeatherWarn);
router.get("/weather/warn/code", getWeatherWarnCode);

// kakao
router.get("/kakao/address", getAddress);

module.exports = router;
