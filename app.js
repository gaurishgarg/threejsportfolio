const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

var x = 5;
dotenv.config({
    path: './.env'
});
var myport = {PORT: process.env.PORT||3000};    
    console.log(myport.PORT);

app = express();
app.use(bodyParser.urlencoded({
    extended: true
})); //express uses bodyparser

app.use(express.static(path.join(__dirname, '/')));
app.get('/', function (req, res){   
    res.sendFile(__dirname+"index.html");

});
app.post('/saveresponse',cors(), async function(req,res){
    console.log(req.body);
    x = 10;
    res.send(req.body);
    // res.redirect("/responsesaved");
});
app.get('/responsesaved', async function(req,res){
    console.log("Communication success");
    res.send("Communication Successful"+x);

});



module.exports = app;


