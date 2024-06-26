// connection
const mongoose = require("mongoose");

async function connectMongoDB(url){
    mongoose.connect(url)
.then(()=> console.log("the mongodb is connected !"))
.catch((err)=> console.log("error",err)) ;
}

module.exports = {connectMongoDB};