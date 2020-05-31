const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const request = require('superagent')
const mysql = require('mysql')


const Port = process.env.Port || 8000 

require('dotenv').config();

app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(express.json())


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

    var name = req.body.fname
    var email = req.body.email
    var city = req.body.city 
    var device = req.body.device

    console.log(name, email, city, device)
    saveToMailchimp(name, email, city, device)
})

function saveToMailchimp(name, email, city, device) {

    var request = require('request');

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merged_fields: {
                    FNAME: name,
                    TEXTYUI_3: city, 
                    CHECKBOXY: device
                }
            }
        ]
    }

    const postData = JSON.stringify(data)

    const options = {
        url: 'https://us7.api.mailchimp.com/3.0/lists/cc06da0dc6',
        method: 'POST',
        headers: { 
            Authorization: 'auth 2d49af1f4e73a69ab208d07a27b5c768-us7'
        },
        body: postData 
    };

    request(options, function(err, response, body) {
        if (err) {
            console.log('Error saving to mailchimp')
        } else if (response.statusCode === 200) {
            console.log('Saved to Mailchimp')
        }
    });


}