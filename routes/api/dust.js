const { forwardRequest } = require("../../tools");

const getDustExpire = () => {
  const now = new Date();
  const hour24 = parseInt(now.getHours().toString());

  const expiresAt = new Date();
  expiresAt.setDate(hour24 < 18 ? now.getDate() : now.getDate() + 1);
  expiresAt.setHours("18");

  return expiresAt - now;
};

module.exports = {
  getDustShortForecast: async (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth",
      params: {
        returnType: "json",
        numOfRows: "28",
      },
      expire: getDustExpire,
    }),
  getDustMidForecast: async (req, res) =>
    forwardRequest(req, res, {
      url: "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustWeekFrcstDspth",
      params: {
        returnType: "json",
        numOfRows: "1",
      },
      expire: getDustExpire,
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
