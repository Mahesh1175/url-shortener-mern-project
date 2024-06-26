const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require("mongoose");
const shortid = require('shortid');
var cors = require('cors'); 

// Generate a unique ID
const id = shortid(5);
console.log(id); 

const corsOptions = {
    origin: "http://localhost:3000",
    methods: " GET , POST , DELETE ,PATCH , PUT ",
    crefentials: true
}

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors(corsOptions));

//connecting to the schema of the db
const URL = require("./models/urlmodels");

//connecting the mongodb connection in server file
const {connectMongoDB} = require("./connection");

//connecting routes
const UrlRouter = require("./routes/urlroutes");

//connection link
connectMongoDB("mongodb://127.0.0.1:27017/urldata");

app.use("/url",UrlRouter);

app.listen(port,()=>{
    console.log(`The server is running a port ${port}`)
});