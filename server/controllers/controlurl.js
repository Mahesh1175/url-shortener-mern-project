const URL = require("../models/urlmodels");
const shortid = require("shortid");

async function handlePosturls(req, res) {
  const body = req.body;
  const shortID = shortid.generate(); 

  if (!body.url) return res.status(400).json({ msg: "URL required!" });

  try {
    const newUser = await URL.create({
      shortId: shortID,
      originalLink: body.url,
      visitData: [],
    });
    console.log(newUser);
    return res.status(201).json({ msg: "success", backenData: newUser });
  }
   catch (error) {
    console.error("Error creating URL entry:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleGetshortid(req, res) {
  const url_short = req.params.shortID;

  try {
    const entryObj = await URL.findOneAndUpdate(
      { shortId: url_short },
      {
        $push: {
          visitData: { timestamp: Date.now() },
        },
      },
      { new: true } // Return the updated document
    );

    if (!entryObj) {
      return res.status(404).json({ msg: "URL not found" });
    }

    res.redirect(entryObj.originalLink);
  } catch (error) {
    console.error("Error updating visit data:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleGetanalytics(req, res) {
  const shortId = req.params.shortId;

  try {
    const resultObj = await URL.findOne({ shortId });

    if (!resultObj) {
      return res.status(404).json({ msg: "URL not found" });
    }

    return res.json({
      totalclicks: resultObj.visitData.length,
      analytics: resultObj.visitData,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

module.exports = { handlePosturls, handleGetshortid, handleGetanalytics };
