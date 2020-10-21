const express = require('express');
const app = express();

app.listen(5500, () => console.log('Listening at port ' + 5500));
app.use(express.static('public'));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Allow: GET, POST, HEAD");
    next();
})
// app.use(express.json({
//     limit: '1mb'
// }));

app.get("/api", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    console.log(req);
});