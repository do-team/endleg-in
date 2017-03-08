var AWS = require("aws-sdk");
var nJwt = require('njwt');
exports.handler = (event, context, callback) => {
    AWS.config.update({
        region: "eu-central-1",
        endpoint: "dynamodb.eu-central-1.amazonaws.com"
    });
    var token = event.headers.sectoken;
    var signingKey = 'secret';
    console.log('token: ', token);

    nJwt.verify(token, signingKey, function(err, verifiedJwt) {
            console.log(event);

            if (err) {

                console.log('Error - but actually it will go trough...', err); // Token has expired, has been tampered with, etc
                var user = err.parsedBody['cognito:username'];
                //console.log(user); //Extracted username from the hash.

                // Params validation goes here - to check, if user is not sending cards out of range.
                var validCards = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
                console.log('Valid cards: ', validCards);
                var sentCards = [event.body.card1, event.body.card2, event.body.card3, event.body.card4, event.body.card5];
                console.log('Cards sent: ', sentCards);

                var valid = true;
                for (var i = 0; i < sentCards.length; i++) {
                   found = false;
                    if (validCards.indexOf(sentCards[i]) > -1) {
                        found = true;
                        break;
                    }
                   if (!found) {
                    valid = false;
                   }
                }
                if (valid === false) { console.log('Something is wrong!'); return; }
                console.log('Alles gute!');

                    //Cards validated...
                    var params = {
                        TableName: "endleg-main",
                        Item: {
                            "user": user,
                            "name": event.body.name,
                            "card1": event.body.card1,
                            "card2": event.body.card2,
                            "card3": event.body.card3,
                            "card4": event.body.card4,
                            "card5": event.body.card5,
                            "fightflag": 1
                        }
                    };
                    var dynamodb = new AWS.DynamoDB();
                    var docClient = new AWS.DynamoDB.DocumentClient();
                    docClient.put(params, function(err, data) {
                        if (err) {
                            console.log(err);
                            console.error("Unable to add new items from user ", user, ". Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            console.log("Request by user", user, " was successfully added.");
                        }
                    });


            } else {
                console.log('All OK decrypted. That also means, it will do nothing with Dynamo :).');
                console.log(verifiedJwt); // Will contain the header and body
        }
    });
};