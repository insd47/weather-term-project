const { forwardRequest } = require("../../tools");

module.exports = {
  getShortForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",
      serviceKey: process.env.VILLAGE_FCST_INFO_SERVICE_API_KEY,
      params: {
        dataType: "JSON",
        numOfRows: "100",
      },
    }),
  getMidWeatherForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst",
      serviceKey: process.env.MID_FCST_INFO_SERVICE_API_KEY,
      params: {
        dataType: "JSON",
        numOfRows: "1",
        pageNo: "1",
      },
    }),
  getMidTemperatureForecast: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa",
      serviceKey: process.env.MID_FCST_INFO_SERVICE_API_KEY,
      params: {
        dataType: "JSON",
        numOfRows: "1",
        pageNo: "1",
      },
    }),
  getWeatherWarnCode: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnMsg",
      serviceKey: process.env.WTHR_WRN_INFO_SERVICE_API_KEY,
      params: {
        dataType: "JSON",
        numOfRows: "100",
        pageNo: "1",
      },
    }),
  getWeatherWarn: (req, res) =>
    forwardRequest(req, res, {
      url: "https://apis.data.go.kr/1360000/WthrWrnInfoService/getPwnCd",
      serviceKey: process.env.WTHR_WRN_INFO_SERVICE_API_KEY,
      params: {
        dataType: "JSON",
        numOfRows: "100",
        pageNo: "1",
      },
    }),
};
