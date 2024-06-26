const express = require("express");
const router = express.Router();

const shortid = require("shortid");
const mongoose = require("mongoose");

const {handlePosturls,handleGetshortid,handleGetanalytics} = require("../controllers/controlurl")

router.post("/shortID", handlePosturls);

router.get("/:shortID", handleGetshortid);

router.get("/analytics/:shortId", handleGetanalytics);

module.exports = router;