var mongoose = require('mongoose');
const uri = "mongodb+srv://dexitional:DHRCdodowa1@cluster0.unmlw.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect('mongodb://127.0.0.1/kuukua',{ useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, (err) => {
    if(!err){
        console.log("Server has been connected to MongoDB");
    }
});

module.exports = mongoose;

/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dexitional:<password>@cluster0.unmlw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/