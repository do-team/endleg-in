var AWS = require('aws-sdk');

'use strict';

console.log('Loading function');

/*
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('value1 =', event.key1);
    console.log('value2 =', event.key2);
    console.log('value3 =', event.key3);
    callback(null, event.key1);  // Echo back the first key value
    //callback('Something went wrong, but like really really wrong.');
*/

exports.handler = (event, context, callback) => {
for (int j = 0; j < 10; j++)
{
  PutRecordRequest putRecordRequest = new PutRecordRequest();
  putRecordRequest.setStreamName( "endleg-test" );
  putRecordRequest.setData(ByteBuffer.wrap( String.format( "testData-%d", j ).getBytes() ));
  putRecordRequest.setPartitionKey( String.format( "partitionKey-%d", j/5 ));
  putRecordRequest.setSequenceNumberForOrdering( j-1 );
  PutRecordResult putRecordResult = client.putRecord( putRecordRequest );
  sequenceNumberOfPreviousRecord = putRecordResult.getSequenceNumber();
}
};