const { forwardRequest } = require("../../tools");

module.exports = {
  getShortForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",
      params: {
        dataType: "JSON",
        numOfRows: "1000",
      },
    }),
  getMidWeatherForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst",
      params: {
        dataType: "JSON",
        numOfRows: "1",
        pageNo: "1",
      },
    }),
  getMidTemperatureForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa",
      params: {
        dataType: "JSON",
        numOfRows: "1",
        pageNo: "1",
      },
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
