const mongoose = require("mongoose");
const shortid = require('shortid');

// schema

const UrlSchema = new mongoose.Schema({
    shortId : { 
        type: String,
        required:true,
        unique:true
    },
    originalLink : { 
        type: String,
        required:true
    },
    visitData : [
      {timestamp: {type : Number} }
    ]
},{timestamps: true});

// model
 const URL = mongoose.model("Url", UrlSchema);

 module.exports = URL;