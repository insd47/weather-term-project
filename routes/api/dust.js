const { forwardRequest } = require("../../tools");

module.exports = {
  getDustShortForecast: async (req, res) =>
    forwardRequest(req, res, {
      url: "https://api.odcloud.kr/api/MinuDustFrcstDspthSvrc/v1/getMinuDustFrcstDspth",
      serviceKey: process.env.MINU_DUST_FRCST_DSPTH_SVRC_API_KEY,
      params: {
        returnType: "json",
        numOfRows: "28",
      },
    }),
  getDustMidForecast: async (req, res) =>
    forwardRequest(req, res, {
      url: "https://api.odcloud.kr/api/MinuDustFrcstDspthSvrc/v1/getMinuDustWeekFrcstDspth",
      serviceKey: process.env.MINU_DUST_FRCST_DSPTH_SVRC_API_KEY,
      params: {
        returnType: "json",
        numOfRows: "1",
      },
    }),
  getDustWarn: (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo",
      serviceKey: process.env.ULFPTCA_ALAM_INQUIRE_SVC_API_KEY,
      params: {
        returnType: "json",
        numOfRows: "100",
      },
    }),
};
