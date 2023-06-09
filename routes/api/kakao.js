const axios = require("axios");

module.exports = {
  getAddress: (req, res) => {
    const url = "https://dapi.kakao.com/v2/local/search/keyword";

    console.log("[kakao] sending request to", url);

    axios
      .get(url, {
        params: req.query,
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
        },
      })
      .then((response) => {
        console.log("[kakao] request successful");
        res.json(response.data);
      })
      .catch((err) => {
        console.error("[kakao] an error occured:\n", err);
        res.status(500).send("[kakao] unexpected error occured");
      });
  },
};
