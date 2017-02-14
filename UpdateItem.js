var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000"
});

var incoming = JSON.parse(fs.readFileSync('testevent.json', 'utf8'));
//console.log(incoming);

incoming.forEach(function(user) {

var params = {
        TableName: "users",
        Item: {
            "user": user.user,
            "name": user.name,
            "card1":  user.card1
        }
    };

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});





