const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { sqs, queueUrl } = require("./config");

let isProcessing = false;
async function processMessages() {
  if (isProcessing) {
    console.log("Already processing, skipping this cycle.");
    return;
  }

  isProcessing = true;

  try {
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
    };

    const result = await sqs.receiveMessage(params).promise();

    if (result.Messages && result.Messages.length > 0) {
      const message = result.Messages[0];
      const { Body, ReceiptHandle } = message;

      console.log("Received message:", Body);
      for(let i=0; i<=1000000000; i++);

      const filePath = path.join(__dirname, `output/${message.MessageId}.txt`);
      fs.writeFileSync(filePath, Body, "utf8");
      console.log(`File created successfully at ${filePath}`);

      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle,
      };
      await sqs.deleteMessage(deleteParams).promise();
      console.log("Message deleted from SQS.");
    } else {
      console.log("No messages in queue.");
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }

  isProcessing = false;
}
const intervalId = setInterval(processMessages, 5000);
process.on("SIGINT", () => {
  clearInterval(intervalId);
  console.log("Polling stopped.");
  process.exit();
});
