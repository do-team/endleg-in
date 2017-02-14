var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var incoming = JSON.parse(fs.readFileSync('testevent.json', 'utf8'));
//console.log(incoming);

incoming.forEach(function(user) {

var params = {
        TableName: "users",
        Item: {
            "user": user.user,
            "name": user.name,
            "card1":  user.card1,
            "fighflag": user.fightflag
        }
    };
var docClient = new AWS.DynamoDB.DocumentClient();
console.log(params);
docClient.put(params, function(err, data) {
       if (err) {
           console.log(err);
           console.error("Unable to add user", user.user, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded, user", user.user, " added.");
       }
    });
});





