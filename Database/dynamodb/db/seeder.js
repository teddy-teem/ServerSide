const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const dynamodb = require("./config");

const createPostTable = async () => {
  try {
    const command = new CreateTableCommand({
      TableName: "posts",
      AttributeDefinitions: [ // only define key's
        {
          AttributeName: "id",
          AttributeType: "N",
        },
        {
          AttributeName: "created_at",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH", // mandatory keys
        },
        {
          AttributeName: "created_at",
          KeyType: "RANGE", // optional range/sort key.
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    });
    const response = await dynamodb.send(command);
    console.log("Post table created:", response);
  } catch (error) {
    console.error("Error creating posts table:", error);
  }
};

const createCommentTable = async () => {
  try {
    const command = new CreateTableCommand({
      TableName: "comments",
      AttributeDefinitions: [ //only keys used in all over the indexes/ tables. 
        {
          AttributeName: "id",
          AttributeType: "N",
        },
        {
          AttributeName: "created_at",
          AttributeType: "S",
        },
        {
          AttributeName: "title",
          AttributeType: "S",
        },
        {
          AttributeName: "author",
          AttributeType: "S",
        },
        {
          AttributeName: "like_count",
          AttributeType: "N",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH", //mandatory key
        },
        {
          AttributeName: "created_at",
          KeyType: "RANGE", //optional sort key
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      LocalSecondaryIndexes: [ // maximum 5, can only create while table creation. after table created, can't create lsi further more.
        {
          IndexName: "idx_id_title",
          KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },
            { AttributeName: "title", KeyType: "RANGE" },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      GlobalSecondaryIndexes: [ // Cannot Modify Existing GSIs:
                                // Can add/delete GSI.
        {
          IndexName: "author_likeCount",
          KeySchema: [
            { AttributeName: "author", KeyType: "HASH" },
            { AttributeName: "like_count", KeyType: "RANGE" },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
    });
    const response = await dynamodb.send(command);
    console.log("Comment table created:", response);
  } catch (error) {
    console.error("Error creating comments table:", error);
  }
};

const main = async () => {
  try {
    console.log("Creating tables...");
    await createPostTable();
    await createCommentTable();
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error in main:", error);
  }
};

main();
