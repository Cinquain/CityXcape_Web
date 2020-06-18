const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const serverless = require('serverless-http');
const router = express.Router();

const Port = process.env.Port || 8000 

require('dotenv').config();

app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(express.json());


app.listen(Port, () => {
    console.log('Server is up and running')
})


const pool = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});




app.get('/', (req, res) => {
    res.render('index.html')
})

app.post('/signup', (req, res, err) => {

    var first_name = req.body.fname
    var last_name = req.body.lname
    var email = req.body.email
    var city = req.body.city 
    var device = req.body.device
    console.log(first_name, last_name, email, city, device)
    saveToMailchimp(first_name, last_name, email, city, device)
    res.redirect('success.html')

    if (err) {
        console.log('error saving user')
    }
})

function saveToMailchimp(fname, lname, email, city, device) {


    var request = require("request")

    var options = { method: 'POST',
    url: 'https://us7.api.mailchimp.com/3.0/lists/cc06da0dc6/members',
    headers: 
    { 'cache-control': 'no-cache',
        Connection: 'keep-alive',
        Host: 'us7.api.mailchimp.com',
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        Authorization: process.env.MAILCHIMP_AUTHORIZATION,
        'Content-Type': 'application/json' },
    body: 
    { email_address: email,
        status: 'subscribed',
        merge_fields: 
        { FNAME: fname,
            LNAME: lname,
            TEXTYUI_3: city,
            CHECKBOXY: device } },
    json: true };

    request(options, function (error, response, body) {

    if (error) throw new Error(error);
    console.log(body);
    });

}

module.exports.handler = serverless(app)