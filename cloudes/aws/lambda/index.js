const express = require('express');
const AWS = require('aws-sdk');

const app = express();

const lambda = new AWS.Lambda({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test',
});

app.get('/invoke-lambda', (req, res) => {
  const params = {
    FunctionName: 'hello-world',
    Payload: JSON.stringify({ name: 'Jahid' }),
  };

  lambda.invoke(params, (err, data) => {
    if (err) {
      console.error('Error invoking Lambda:', err);
      return res.status(500).json({ error: 'Error invoking Lambda function' });
    }
    return res.json(JSON.parse(data.Payload));
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
