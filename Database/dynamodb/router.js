const express = require("express");
const {
  listTable,
  insertPost,
  getAllPosts,
  getAllByAuthorCreatedAt,
  describeTable,
} = require("./db/query");
const router = express.Router();

router.get("/posts", (req, res) => {
  console.log("first");
  res.send({ message: "success" });
});

router.get("/db/tables", async (req, res) => {
  const { dynamodb } = req.context;
  const data = await listTable(dynamodb);
  console.log(data);
  res.send({ message: "success", data });
});

router.get("/db/details/:tableName", async (req, res) => {
  try {
    const { dynamodb } = req.context;
  const {tableName} = req.params;
  const data = await describeTable(dynamodb, tableName);
  console.log(data);
  res.send({ message: "success", data });
  } catch (error) {
    res.status(500).send({message: "failed"})
  }
});

// router.get("/db/posts", async (req, res) => {
//   try {
//     const { dynamodb } = req.context;
//     const data = await getAllPosts(dynamodb);
//     console.log(data);
//     res.send({ message: "success", data });
//   } catch (error) {
//     res.status(500).send({ message: "failed to insert" });
//   }
// });

router.get("/db/posts", async (req, res) => {
  try {
    console.log(req.query);
    const { author, createdAt } = req.query;
    const { dynamodb } = req.context;

    const data = author
      ? await getAllByAuthorCreatedAt(dynamodb, {
          author,
          createdAt: createdAt || new Date().setHours(0, 0, 0, 0),
        })
      : await getAllPosts(dynamodb);
    console.log(data);
    res.send({ message: "success", data });
  } catch (error) {
    res.status(500).send({ message: "failed to insert" });
  }
});

router.post("/db/posts", async (req, res) => {
  try {
    const { dynamodb } = req.context;
    const data = await insertPost(dynamodb);
    console.log(data);
    res.send({ message: "success", data });
  } catch (error) {
    res.status(500).send({ message: "failed to insert" });
  }
});

module.exports = router;
