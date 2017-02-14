var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();


var incoming = JSON.parse(fs.readFileSync('testevent.json', 'utf-8'));
console.log(incoming);

var params = {
        TableName: "users",
        Item: {
            "user": incoming.user,
            "name": incoming.name,
            "card1":  incoming.card1,
            "fighflag": incoming.fightflag
        }
    };


var docClient = new AWS.DynamoDB.DocumentClient();

docClient.put(params, function(err, data) {
       if (err) {
           console.log(err);
           console.error("Unable to add user", incoming.user, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded, user", incoming.user, " added.");
       }
    });






