const {
  ListTablesCommand,
  PutItemCommand,
  ScanCommand,
  QueryCommand,
  DescribeTableCommand
} = require("@aws-sdk/client-dynamodb");
const { faker } = require("@faker-js/faker");

exports.listTable = async (client) => {
  try {
    console.log("looking...");
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    console.log(response.TableNames);
    return response.TableNames;
  } catch (error) {
    console.error(error);
  }
};

exports.describeTable = async (dynamodb, tableName) => {
    const params = {
      TableName: tableName, // The name of your table
    };
  
    try {
      const command = new DescribeTableCommand(params);
      const data = await dynamodb.send(command);
      console.log('Table Details:', JSON.stringify(data.Table, null, 2));
      return data // Printing the table details
    } catch (error) {
      console.error('Error fetching table details:', error);
      throw error
    }
  };

exports.insertPost = async (dynamodb) => {
  try {
    const post = {
      id: { N: faker.number.int({ min: 1, max: 100000 }).toString() }, // Numeric ID
      created_at: { S: new Date().toISOString() }, // ISO string timestamp
      title: { S: faker.lorem.sentence() }, // Random sentence
      content: { S: faker.lorem.paragraph() }, // Random paragraph
      updated_at: { S: new Date().toISOString() },
      like_count: {
        N: faker.number.int({ min: 0, max: 1000 }).toString(),
      },
      author: { S: faker.name.fullName() },
    };

    const command = new PutItemCommand({
      TableName: "posts",
      Item: post,
    });

    const response = await dynamodb.send(command);
    console.log(`Inserted post:`, post.id.N);
    console.log("All posts inserted successfully!");
  } catch (error) {
    console.error("Error inserting post:", error);
    throw error;
  }
};

exports.getAllPosts = async (dynamodb) => {
  try {
    const params = {
      TableName: "posts", // Name of the table
    };

    const command = new ScanCommand(params);
    const { Items } = await dynamodb.send(command);

    if (Items && Items.length > 0) {
      const posts = Items.map((item) => ({
        id: item.id.N,
        created_at: item.created_at.S,
        title: item.title.S,
        content: item.content.S,
        updated_at: item.updated_at.S,
        like_count: item.like_count.N,
        author: item.author.S,
      }));

      console.log("Retrieved posts:", posts);
      return posts;
    } else {
      console.log("No posts found");
      return [];
    }
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

exports.getAllByAuthorCreatedAt = async (dynamodb, { author, createdAt }) => {
  try {
    const params = {
      TableName: "posts",
      IndexName: "author_created_at_index",
      KeyConditionExpression: "#author = :author and #created_at > :time",
      ExpressionAttributeNames: {
        "#author": "author",
        "#created_at": "created_at",
      },
      ExpressionAttributeValues: {
        ":author": { S: author },
        ":time": { S: new Date(createdAt).toISOString() },
      },
    };

    const command = new QueryCommand(params);
    const { Items } = await dynamodb.send(command);

    if (Items && Items.length > 0) {
      const posts = Items.map((item) => ({
        id: item.id.N,
        created_at: item.created_at.S,
        title: item.title.S,
        content: item.content.S,
        updated_at: item.updated_at.S,
        like_count: item.like_count.N,
        author: item.author.S,
      }));

      console.log("Retrieved posts:", posts);
      return posts;
    } else {
      console.log("No posts found");
      return [];
    }
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

exports.updateTitleById = async (id, newTitle) => {
    const params = {
      TableName: 'posts', // The name of your table
      Key: {
        id: { N: id.toString() }, // Primary key (partition key) with id
      },
      UpdateExpression: 'SET #title = :newTitle', // Update expression for setting new title
      ExpressionAttributeNames: {
        '#title': 'title', // Mapping attribute name to avoid conflicts
      },
      ExpressionAttributeValues: {
        ':newTitle': { S: newTitle }, // The new title value to be set
      },
      ReturnValues: 'ALL_NEW', // Return the updated item
    };
  
    try {
      const command = new UpdateItemCommand(params);
      const result = await dynamodb.send(command);
  
      console.log('Updated item:', result.Attributes);
      return result; // Log updated item
    } catch (error) {
      console.error('Error updating item:', error);
      throw error
    }
  };
