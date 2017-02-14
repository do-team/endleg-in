var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "users";
var user = "davesade";
var card1 = "A";
var card2 = "B";
var card3 = "C";
var card4 = "D";
var card5 = "E";
var name = "dave";
var flag = 1;

var params = {
    TableName:table,
    Item:{
        "user": user,
        "name": name,
        "fightflag": flag,
        "card1": card1,
        "card2": card2,
        "card3": card3,
        "card4": card4,
        "card5": card5,
    }
};
console.log("This is event: " + event);
console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});

};
