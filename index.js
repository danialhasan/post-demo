const express = require("express");
const app = express();
const mongo = require('mongodb').MongoClient
const datastore = require("nedb");

// var ts
var lastTimeGetRequestWasMade = 0;
var currentDate;
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
    currentDate = new Date();
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

    // database.findOne({
    //     collection: 'names'
    // }).sort({
    //     _id: -1
    // }).exec(function (err, docs) {
    //     // docs is [doc1, doc3, doc2]
    //     res.json(docs);
    // });
    database.find({
        //find all entries with a timestamp greater than the previous, last-seen timestamp
        // timestamp: {
        //     // $gt: last_seen_timestamp
        //     $gt: timestamp2
        //     //last_seen_timestamp is the timestamp of the second last entry.
        // }
        lname: 'thisisthelastname',
        timestamp: {
            $gt: lastTimeGetRequestWasMade,
            $ls: new Date()
            //WONT WORK UNTIL THERE HAS BEEN A POST REQUEST SUBMITTED. THIS IS BECAUSE
            //WHEN FORM IS REFRESHED, TS = UNDEFINED
        }

    }).sort({
        timestamp: -1
        // createdAt: -1
    }).exec((err, docs) => {
        // docs is[doc1, doc3, doc2]
        res.json({
            docs,
            // ts
        });
    })
    lastTimeGetRequestWasMade = new Date();

    // database.find({
    //     collection: 'names'
    // })
})
app.post('/frontend', (req, res) => {
    //when a post is made to domain.com/frontend, take the timestamp of the request and hold it. It will be used in 
    //get purposes. 

    //in the get handler, find all db entries with a timestamp higher than the timestamp recieved by the post. 
    //Submit them. If there are none, nothing will be submitted. If there are any, all of them over the timestamp 
    //written will be sent. 

    console.log("received request");
    // i++;
    var data = req.body;

    const timestamp = Date.now();

    data.timestamp = timestamp;
    // databaseArr.push("Requests: " + i + " , data: " + req.body.fname + ", " + req.body.lname);

    database.insert(data);
    // ts = data.timestamp;

    // console.log("First name: " + req.body.fname);
    // console.log("Last name: " + req.body.lname);
    // console.log("Collection: " + req.body.collection);
    // console.log("timestamp: " + data.timestamp);

    // console.table(database)

    res.json({
        status: 'success',
        timestamp: timestamp,
        firstname: req.body.fname,
        lastname: req.body.lname,
        collection: req.body.collection,
        // database: database
        // ts: data.timestamp

    })
});