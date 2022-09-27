const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const serverless = require('serverless-http');
const nodemailer = require('nodemailer')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripeLiveKey = process.env.STRIPE_SECRET_KEY
const stripeLiveTest = process.env.STRIPE_SECRET_TEST
const stripe = require('stripe')(stripeLiveKey)

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

app.post('/purchase', (req, res) =>{
    console.log('Purchase route hit')
    var price = req.body.value
    var items = req.body.items
    var token = req.body.stripeTokenId
    var description = ''
    
    for (var i = 0; i < items.length; i++) {
        var item = items[i]
        description += ` ${item.quantity} ${item.name}`
    }

    console.log(items, price, token, description)
    stripe.charges.create({
        amount: price,
        source: token,
        currency: 'usd',
        description: description
    }).then(function() {
        console.log('charge successful')
        res.json({ message: 'Successfully purchased items'})
    }).catch(function(error) {
        console.log('charge failed')
        console.log(error)
        res.status(500).end()
    })
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


app.post('/business', (req, res, err) => {
    console.log('hitting business endpoint')
    var firstName = req.body.name
    var store = req.body.storename
    var mobile = req.body.mobile
    var email = req.body.email
    var message = req.body.message
    console.log(firstName, store, mobile, email, message)

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'planetcpr@gmail.com',
          pass: 'cisoqpwkjiqikxri'
        }
    })

    var mailOptions = {
        from: 'planetcpr@gmail.com',
        to: 'info@cityXcape.com',
        subject: 'Coverage Request from ' + store,
        text: 'Email: ' + email + '\nPhone: ' + mobile + '\nMessage: ' + message
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
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