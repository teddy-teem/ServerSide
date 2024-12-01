const { UpdateTableCommand } = require("@aws-sdk/client-dynamodb");
const dynamodb = require("./config");

const addGSI = async () => {
  const command = new UpdateTableCommand({
    TableName: "posts", // The table to which you want to add the GSI
    AttributeDefinitions: [
      {
        AttributeName: "author", // Partition key for the GSI
        AttributeType: "S", // String type
      },
      {
        AttributeName: "created_at", // Sort key for the GSI
        AttributeType: "S", // String type (ISO 8601 formatted date string)
      },
    ],
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: "author_created_at_index", // The name of the GSI
          KeySchema: [
            { AttributeName: "author", KeyType: "HASH" }, // Partition key
            { AttributeName: "created_at", KeyType: "RANGE" }, // Sort key
          ],
          Projection: {
            ProjectionType: "ALL", // Include all attributes from the table
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5, // Set the read capacity units
            WriteCapacityUnits: 5, // Set the write capacity units
          },
        },
      },
    ],
  });

  try {
    const response = await dynamodb.send(command);
    console.log("GSI created successfully", response);
  } catch (error) {
    console.error("Error creating GSI", error);
  }
};

addGSI();
