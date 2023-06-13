const { forwardRequest } = require("../../tools");

const getWeatherExpire = () => {
  const now = new Date();
  const hour24 = parseInt(now.getHours().toString());

  const expiresAt = new Date();
  expiresAt.setDate(hour24 < 12 ? now.getDate() : now.getDate() + 1);
  expiresAt.setHours(hour24 < 12 ? "12" : "00");

  return expiresAt - now;
};

module.exports = {
  getShortForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",
      params: {
        dataType: "JSON",
        numOfRows: "1000",
      },
      expire: getWeatherExpire,
    }),
  getMidWeatherForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst",
      params: {
        dataType: "JSON",
        numOfRows: "1",
        pageNo: "1",
      },
      expire: getWeatherExpire,
    }),
  getMidTemperatureForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa",
      params: {
        dataType: "JSON",
        numOfRows: "1",
        pageNo: "1",
      },
      expire: getWeatherExpire,
    }),
  getWeatherWarnList: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/WthrWrnInfoService/getPwnCd",
      params: {
        dataType: "JSON",
        numOfRows: "100",
        pageNo: "1",
      },
    }),
  getWeatherWarnCode: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnMsg",
      params: {
        dataType: "JSON",
        numOfRows: "100",
        pageNo: "1",
      },
    }),
};
