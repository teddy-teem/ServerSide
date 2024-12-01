const express = require("express");
const routes = require("./router.js");
const dynamodb = require("./db/config.js");
const PORT = 4000;

const app = express();

app.use((req, res, next) => {
  req.context = { dynamodb };
  next();
});
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
