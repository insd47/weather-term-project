const router = require("express").Router();

router.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
router.get("/search", (req, res) => res.sendFile(__dirname + "/search.html"));
router.get("/error", (req, res) => res.sendFile(__dirname + "/error.html"));
router.get("/warn", (req, res) => res.sendFile(__dirname + "/warn.html"));

module.exports = router;
