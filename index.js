const express = require("express");
const app = express();
const datastore = require("nedb");

app.listen(5500, () => console.log("listening to port 5500"));
app.use(express.static('public'));
app.use(express.json({
    limit: '100mb',
    type: 'application/json'
}))
var database = new datastore('database.db');
database.loadDatabase();

var i = 0;
app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    // res.setHeader('Access-Control-Allow-Credentials', 'omit');
    // res.setHeader("Access-Control-Allow-Methods", "*");
    // res.end()

    next();

})
app.post('/api', (req, res) => {
    console.log("received request");
    i++;
    var data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    // databaseArr.push("Requests: " + i + " , data: " + req.body.fname + ", " + req.body.lname);

    database.insert(data);

    console.log(req.body);
    console.log("First name: " + req.body.fname);
    console.log("Last name: " + req.body.lname);

    // console.table(database)
    // TODO: add json parsing. look to coding train video. 

    res.json({
        status: 'success',
        timestamp: timestamp,
        firstname: req.body.fname,
        lastname: req.body.lname,
        // database: database
    })
});