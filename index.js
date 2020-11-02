const express = require("express");
const app = express();
const mongo = require('mongodb').MongoClient
const datastore = require("nedb");

// var ts
app.listen(5500, () => console.log("listening to port 5500"));
app.use(express.static('public'));
app.use(express.json({
    limit: '100mb',
    type: 'application/json'
}))
var database = new datastore('database.db');
database.loadDatabase();

//sub minutes from current time
function submin(dt, minutes) {
    return new Date(dt.getTime() - minutes * 60000);
}
/*
    usage:
    console.log(addmin(new Date(2014, 10, 2), 683).toString());
*/


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
app.get('/latestindex1min', (req, res) => {
    // var oneminagodate = submin(new Date(), 1);
    var oneminagoseconds = submin(new Date(), 1).getTime()
    //convert to milliseconds since january 1987
    database.find({
        timestamp: {
            // $gte: oneminago
            $gte: oneminagoseconds
        }
    }).sort({
        timestamp: -1
    }).exec((err, docs) => {
        res.json({
            docs: docs
        });
    })

})

app.get('/latestindex2min', (req, res) => {
    var twominagoseconds = submin(new Date(), 2).getTime()

    database.find({
        timestamp: {
            // $gte: oneminago
            $gte: twominagoseconds
        }
    }).sort({
        timestamp: -1
    }).exec((err, docs) => {
        res.json({
            docs: docs
        });
    })
})
app.get('/latestindex', function (req, res) {

    database.find({
        //find all entries with a timestamp greater than the previous, last-seen timestamp
        // timestamp: {
        //     // $gt: last_seen_timestamp
        //     $gt: timestamp2
        //     //last_seen_timestamp is the timestamp of the second last entry.
        // }
        // lname: 'thisisthelastname',
        timestamp: {
            $gt: 0 //,
            // $ls: new Date()
            //WONT WORK UNTIL THERE HAS BEEN A POST REQUEST SUBMITTED. THIS IS BECAUSE
            //WHEN FORM IS REFRESHED, TS = UNDEFINED
        }

    }).sort({
        timestamp: -1
    }).exec((err, docs) => {
        res.json({
            docs
        });
    })
    // lastTimeGetRequestWasMade = new Date();

})
app.get('/delete', (req, res) => {
    database.remove({}, {
        multi: true
    }, (err, numRemoved) => {
        res.json({
            message: "Database wiped."
        })
    })
})
app.post('/frontend', (req, res) => {

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