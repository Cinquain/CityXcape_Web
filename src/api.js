
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router()

require('dotenv').config();


const stripeLiveKey = process.env.STRIPE_SECRET_KEY
const stripeLiveTest = process.env.STRIPE_SECRET_TEST
const stripe = require('stripe')(stripeLiveTest)

app.use(bodyParser.urlencoded({extended:false}));


router.get('/', (req, res) => {
   res.json({
       'Hi': 'Hello World'
   });
})


router.post('/purchase', (req, res) =>{
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


router.post('/signup', (req, res, err) =>{

   var first_name = req.body.fname
   var last_name = req.body.lname
   var email = req.body.email
   var city = req.body.city
   var device = req.body.device
   console.log(first_name, last_name, email, city, device)
   saveToMailchimp(first_name, last_name, email, city, device, res)
   if (err) {
       console.log(err)
   }
})

function saveToMailchimp(fname, lname, email, city, device, res) {

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
   res.redirect('https://romantic-rosalind-bb4e9e.netlify.app/success.html')
   });

}


app.use('/.netlify/functions/api',router);

module.exports.handler = serverless(app)