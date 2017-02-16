var AWS = require("aws-sdk");
var nJwt = require('njwt');
exports.handler = (event, context, callback) => {
AWS.config.update({
  region: "eu-central-1",
  endpoint: "dynamodb.eu-central-1.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();
//console.log("Tohle je v contextu: ", context);
console.log("Tohle je v eventu: ", event);
var docClient = new AWS.DynamoDB.DocumentClient();



console.log('Request Headers:', event.headers);
var zkouska = event.headers;
var token = zkouska.sectoken;
var secret = 'secret';
console.log('token: ', token);
nJwt.verify(token,secret,function(err,verifiedJwt){
  if(err){
    console.log('CHYBA', err); // Token has expired, has been tampered with, etc
    //console.log(err.parsedBody['cognito:username']);
    var user = err.parsedBody['cognito:username'];
    console.log(user);
    // Params validation goes here - to check, if user is not sending cards out of range.
var params = {
        TableName: "endleg-main",
        Item: {
            "user": user,
            "name": event.name,
            "card1": event.card1,
            "card2": event.card2,
            "card3": event.card3,
            "card4": event.card4,
            "card5": event.card5,
            "fightflag": 1
        }
    };
    docClient.put(params, function(err, data) {
           if (err) {
               console.log(err);
               console.error("Unable to add new items from user ", user, ". Error JSON:", JSON.stringify(err, null, 2));
           } else {
               console.log("Request by user", user, " was successfully added.");
           }
        });
  }else{
    console.log(verifiedJwt); // Will contain the header and body
     console.log('All OK decrypted');
  }
});



};