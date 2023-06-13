const axios = require("axios");
const store = require("store");

const forwardRequest = (req, res, options) => {
  const { url, params, expire } = {
    expire: 0,
    ...options,
  };
  console.log("[forwardRequest] sending request to", url);

  const cacheId =
    url + "?" + new URLSearchParams({ ...req.query, ...params }).toString();

  if (expire && store.get(cacheId)) {
    console.log("[forwardRequest] cache hit");
    res.json(store.get(cacheId));
    return;
  }

  axios
    .get(url, {
      params: {
        ...req.query,
        ...params,
        serviceKey: process.env.SERVICE_KEY,
      },
    })
    .then((response) => {
      if (
        expire &&
        response.data.response &&
        response.data.response.header &&
        response.data.response.header.resultCode === "00"
      )
        store.set(cacheId, response.data, expire());

      console.log("[forwardRequest] response received");
      res.json(response.data);
    })
    .catch((err) => {
      console.error("[forwardRequest] an error occured:\n", err);
      res.status(500).send("[forwardRequest] unexpected error occured");
    });
};

module.exports = forwardRequest;
