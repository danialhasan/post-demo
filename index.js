const express = require("express");
const app = express();
app.listen(5504, () => console.log("listening to port 5504"));
app.use(express.static('public'));
app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader('Access-Control-Allow-Credentials', 'omit');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.end()

    next();

})
app.post('/api', (req, res) => {
    console.log("received request");
    console.log(req.body);
});