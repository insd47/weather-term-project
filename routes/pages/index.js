const router = require("express").Router();

router.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
router.get("/search", (req, res) => res.sendFile(__dirname + "/search.html"));
router.get("/about", (req, res) => res.sendFile(__dirname + "/about.html"));
router.get("/error", (req, res) => res.sendFile(__dirname + "/error.html"));

module.exports = router;
