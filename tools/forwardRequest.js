const axios = require("axios");

const forwardRequest = (req, res, options) => {
  const { url, serviceKey, params } = options;
  console.log("[forwardRequest] sending request to", url);

  axios
    .get(url, {
      params: {
        ...req.query,
        ...params,
        serviceKey,
      },
    })
    .then((response) => {
      console.log("[forwardRequest] request successful");
      res.json(response.data);
    })
    .catch((err) => {
      console.error("[forwardRequest] an error occured:\n", err);
      res.status(500).send("[forwardRequest] unexpected error occured");
    });
};

module.exports = forwardRequest;
