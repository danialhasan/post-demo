const express = require("express");
const app = express();
const mongo = require('mongodb').MongoClient
const datastore = require("nedb");


app.listen(5500, () => console.log("listening to port 5500"));
app.use(express.static('public'));
app.use(express.json({
    limit: '100mb',
    type: 'application/json'
}))
var database = new datastore('database.db');
database.loadDatabase();

// var i = 0;
app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    // res.setHeader('Access-Control-Allow-Credentials', 'omit');
    // res.setHeader("Access-Control-Allow-Methods", "*");
    // res.end()

    next();

});
app.get('/api', function (req, res) {
    // var test = "testing";

    //on get request, send the latest data that was sent to the server. 
    // database.find({
    //     fname: 'danial'
    // }, function (err, docs) {
    //     // docs is an array containing documents Mars, Earth, Jupiter
    //     // If no document is found, docs is equal to []
    //     // return docs
    //     if (err) {
    //         res.statusCode = 404;
    //         res.json = err;
    //     };
    //     res.json(docs);
    // });
    // res.send("test");

    // database.findOne({}, {
    //     sort: {
    //         _id: -1
    //     },
    //     limit: 1
    // });

    database.findOne({
        collection: 'names'
    }).sort({
        _id: -1
    }).exec(function (err, docs) {
        // docs is [doc1, doc3, doc2]
        res.json(docs);
    });

    // database.find({
    //     collection: 'names'
    // })
})
app.post('/api', (req, res) => {
    console.log("received request");
    // i++;
    var data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    // databaseArr.push("Requests: " + i + " , data: " + req.body.fname + ", " + req.body.lname);

    database.insert(data);

    console.log(req.body);
    console.log("First name: " + req.body.fname);
    console.log("Last name: " + req.body.lname);
    console.log("Collection: " + req.body.collection);

    // console.table(database)

    res.json({
        status: 'success',
        timestamp: timestamp,
        firstname: req.body.fname,
        lastname: req.body.lname,
        collection: req.body.collection
        // database: database
    })
});