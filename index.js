var AWS = require("aws-sdk");
var nJwt = require('njwt');
exports.handler = (event, context, callback) => {
    AWS.config.update({
        region: "eu-central-1",
        endpoint: "dynamodb.eu-central-1.amazonaws.com"
    });

    var dynamodb = new AWS.DynamoDB();
    //console.log("Tohle je v contextu: ", context);
    //console.log("Tohle je v eventu: ", event);
    var docClient = new AWS.DynamoDB.DocumentClient();
    //console.log('Request Headers:', event.headers);
    //var zkouska = event.headers;
    var token = event.headers.sectoken;
    var signingKey = 'secret';
    console.log('token: ', token);

    nJwt.verify(token, signingKey, function(err, verifiedJwt) {
            if (err) {
                console.log('Error - but actually it will go trough...', err); // Token has expired, has been tampered with, etc
                //console.log(err.parsedBody['cognito:username']);
                var user = err.parsedBody['cognito:username'];
                console.log(user); //Extracted username from the hash.
                // Params validation goes here - to check, if user is not sending cards out of range.
                var validCards = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
                console.log('Valid cards: ', validCards);
                //var sentCards = [event.card1, event.card2, event.card3, event.card4, event.card5];
                var sentCards = [event.card1];
                console.log('Cards sent: ', sentCards);
                var validate = function (validCards, sentCards) {
                    return sentCards.some(function (v) {
                        return validCards.indexOf(v) >= 0;
                    });
                };
                if (validCards.indexOf(event.card1) > -1) {
                    //Cards validated...
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
                } else {
                    console.log('One of cards is not valid! Rejecting...');
                }
            } else {
                console.log('All OK decrypted. That also means, it will do nothing with Dynamo :).');
                console.log(verifiedJwt); // Will contain the header and body
        }
    });
};