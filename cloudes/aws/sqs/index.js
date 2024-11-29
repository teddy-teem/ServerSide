const express = require("express");
const routes = require("./routes");
const config = require("./config");

const app = express();
const PORT = 4000;

app.use(routes);

app.listen(PORT, async () => {
  await config.sqs.createQueue({ QueueName: config.queueName }).promise();
  console.log(`All in one app is running on ${PORT}`);
});
