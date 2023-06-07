const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("경민이고추개큼");
});

module.exports = router;
