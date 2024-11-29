const AWS = require("aws-sdk");

const sqs = new AWS.SQS({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
  accessKeyId: "test",
  secretAccessKey: "test",
});
const queueName = "test-queue";
const queueUrl ="http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/test-queue"


module.exports = {
  sqs,
  queueName,
  queueUrl
};
