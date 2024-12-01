const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const dynamodb = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
});

module.exports = dynamodb;
