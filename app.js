const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
var CONNECTION_URL = "mongodb://127.0.0.1:27017/";
const DATABASE_NAME = "mymongo1";


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("product");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/product", (request, response) => {
    collection.insertOne(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/product", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/product/:id", (request, response) => {
    collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.put ("/product/:id", (request, response) => {

    var myquery ={ "_id": new ObjectId(request.params.id) };
    var newvalues = { $set: {name:request.body.name, price: request.body.price, pid: request.body.pid } };

    collection.updateOne(myquery, newvalues, function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
      });
});

app.delete("/product/:id", (request, response) => {
    collection.deleteOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});




