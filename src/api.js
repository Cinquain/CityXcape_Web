module.exports.handler = function(event, context, callback) {
    

    const {first_name, last_name, email, city, device} = event.body




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
        { FNAME: first_name,
            LNAME: last_name,
            TEXTYUI_3: city,
            CHECKBOXY: device } },
    json: true };

    request(options, function (error, response, body) {

    if (error) throw new Error(error);
    console.log(body);
    });


    callback(null, {
        statusCode: 200,
        body: 'Hello World
    }
    response.redirect('https://romantic-rosalind-bb4e9e.netlify.app/success.html')
    )

}


// const express = require('express');
// const serverless = require('serverless-http');
// const bodyParser = require('body-parser');
// const app = express();
// const router = express.Router()

// require('dotenv').config();


// app.use(bodyParser.urlencoded({extended:false}));



// router.get('/', (req, res) => {

//     res.json({
//         'Hi': 'Hello World'
//     });
// })


// router.post('/signup', (req, res, err) =>{

//     // var first_name = req.body.fname
//     // var last_name = req.body.lname
//     // var email = req.body.email
//     // var city = req.body.city 
//     // var device = req.body.device
//     console.log(first_name, last_name, email, city, device)
//     saveToMailchimp(first_name, last_name, email, city, device)
//     res.redirect('https://romantic-rosalind-bb4e9e.netlify.app/success.html')

//     if (err) {
//         console.log('error saving user')
//     }
// })


// function saveToMailchimp(fname, lname, email, city, device) {


//     var request = require("request")

//     var options = { method: 'POST',
//     url: 'https://us7.api.mailchimp.com/3.0/lists/cc06da0dc6/members',
//     headers: 
//     { 'cache-control': 'no-cache',
//         Connection: 'keep-alive',
//         Host: 'us7.api.mailchimp.com',
//         'Cache-Control': 'no-cache',
//         Accept: '*/*',
//         Authorization: process.env.MAILCHIMP_AUTHORIZATION,
//         'Content-Type': 'application/json' },
//     body: 
//     { email_address: email,
//         status: 'subscribed',
//         merge_fields: 
//         { FNAME: fname,
//             LNAME: lname,
//             TEXTYUI_3: city,
//             CHECKBOXY: device } },
//     json: true };

//     request(options, function (error, response, body) {

//     if (error) throw new Error(error);
//     console.log(body);
//     });

// }



// app.use('/.netlify/functions/api',router);



// module.exports.handler = serverless(app)