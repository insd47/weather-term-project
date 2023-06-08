const { forwardRequest } = require("../../tools");

module.exports = {
  getDustShortForecast: async (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth",
      params: {
        returnType: "json",
        numOfRows: "28",
      },
    }),
  getDustMidForecast: async (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustWeekFrcstDspth",
      params: {
        returnType: "json",
        numOfRows: "1",
      },
    }),
  getDustWarn: (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo",
      params: {
        returnType: "json",
        numOfRows: "100",
      },
    }),
};
