const express = require("express");
const router = express.Router();
const {sqs, queueUrl} = require("./config");


router.get("/send-message", async (req, res) => {
  const sendMessageResponse = await sqs
    .sendMessage({
      QueueUrl: queueUrl,
      MessageBody: "WRITE_HELLO_FILE!",
    })
    .promise();
  console.log("Message sent:", sendMessageResponse.MessageId);
  res.status(200).send({ message: `Message sent: ${sendMessageResponse.MessageId}` });
});

module.exports = router;
