var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {

AWS.config.update({
  region: "eu-central-1",
  endpoint: "https://dynamodb.eu-central-1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "endleg-main";
var user = "test";
var name = "Dave";

var params = {
    TableName:table,
    Item:{
        "user": user,
        "name": name
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

}