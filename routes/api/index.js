const router = require("express").Router();

router.get("/example", (req, res) => {
  res.send("hello world");
});

module.exports = router;
