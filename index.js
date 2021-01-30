const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/home.html");
});

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }

});

app.post("/", function(req, res) {
  var toEmail = req.body.email;
  var pdfString = req.body.pdfString;
  let mailOptions = {
    from: 'forarma33@gmail.com',
    to: toEmail,
    subject: 'Your Loan Calculation',
    text: 'You can find the amortization table on attachments',
    attachments: [
      {
        filename: 'amortizationList.pdf',
        path: pdfString
      }
    ]
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if(err){
      console.log('Error Occurs', err);
      res.sendFile(__dirname + "/errorpage.html");
    } else {
      console.log('Email sent');
      res.sendFile(__dirname + "/success.html");
    }
  });
});


const port = process.env.PORT || 1337;

app.listen(port, function() {
  console.log("Server started on port " + port);
});
