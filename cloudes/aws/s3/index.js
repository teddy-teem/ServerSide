const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');

// Initialize the Express app
const app = express();
const port = 3000;

// Configure AWS SDK for LocalStack (S3)
const s3 = new AWS.S3({
  endpoint: 'http://localhost:4566',  // LocalStack S3 endpoint
  s3ForcePathStyle: true,  // Required for LocalStack
  region: 'us-east-1'
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();  // Store files in memory
const upload = multer({ storage: storage });

// Route to create a new S3 bucket
app.post('/create-bucket', async (req, res) => {
  const { bucketName } = req.body;

  const params = {
    Bucket: bucketName
  };

  try {
    await s3.createBucket(params).promise();
    res.status(200).send(`Bucket "${bucketName}" created successfully.`);
  } catch (err) {
    res.status(500).send(`Error creating bucket: ${err.message}`);
  }
});

// Route to upload a file to an S3 bucket
app.post('/upload-file/:bucketName', upload.single('file'), async (req, res) => {
  const { bucketName } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const params = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    await s3.putObject(params).promise();
    res.status(200).send(`File uploaded successfully to "${bucketName}"`);
  } catch (err) {
    res.status(500).send(`Error uploading file: ${err.message}`);
  }
});

app.get('/list-buckets', async (req, res) => {
  try {
    const data = await s3.listBuckets().promise();
    res.status(200).json(data.Buckets);
  } catch (err) {
    res.status(500).send(`Error listing buckets: ${err.message}`);
  }
});

app.delete('/delete-file/:bucketName/:key', async (req, res) => {
  const { bucketName, key } = req.params;

  const params = {
    Bucket: bucketName,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
    res.status(200).send(`File "${key}" deleted successfully from "${bucketName}"`);
  } catch (err) {
    res.status(500).send(`Error deleting file: ${err.message}`);
  }
});

app.delete('/delete-bucket/:bucketName', async (req, res) => {
  const { bucketName } = req.params;

  const params = {
    Bucket: bucketName
  };

  try {
    const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: objects.Contents.map((obj) => ({ Key: obj.Key }))
      }
    };
    if (objects.Contents.length > 0) {
      await s3.deleteObjects(deleteParams).promise();
    }

    await s3.deleteBucket(params).promise();
    res.status(200).send(`Bucket "${bucketName}" deleted successfully.`);
  } catch (err) {
    res.status(500).send(`Error deleting bucket: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
