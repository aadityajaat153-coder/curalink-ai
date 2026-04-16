const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Summary route working");
});

module.exports = router;