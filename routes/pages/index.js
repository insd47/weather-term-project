const router = require("express").Router();

router.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
router.get("/search", (req, res) => res.sendFile(__dirname + "/search.html"));

module.exports = router;
