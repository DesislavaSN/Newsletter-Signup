const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const app = express();
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signeup.html");
});



app.post("/", function(req, res) {

  const inputFirstN = req.body.fName;
  const inputLastN = req.body.lName;
  const inputEmail = req.body.email;

  const data = {
    /* JS object*/
    members: [ /* this is required by Mailchimp; (body Parameter) member : An array of objects, each representing an email address and the subscription status for a specific list.  */ {
      email_address: inputEmail,
      status: "subscribed",
      merge_fields: {
        /* JS object in the object!*/
        FNAME: inputFirstN,
        LNAME: inputLastN,
      }
    }]
  }

  const jsonData = JSON.stringify(data); /* in order to pass the data to Mailchimp they require it like that, in a string!*/
  const url = "https://us7.api.mailchimp.com/3.0/lists/3a3696abd0";
  // https://mailchimp.com/developer/release-notes/minor-improvement-parameter-handling-events-endpoint/
  // https://us7.api.mailchimp.com/3.0/
  const options = {
    method: "POST",
    auth: "desi14:fa1022cb5041811557a82b3460afa202-us7",
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(response.statusCode);
      console.log(JSON.parse(jsonData));

    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
