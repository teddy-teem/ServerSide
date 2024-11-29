1. write lambda function as plain js ```lambda_function.js```
2. zip that file ```zip lambda_function.zip lambda_function.js```
3. command to create lambda ```aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name hello-world \
    --runtime nodejs14.x \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler lambda_function.handler \
    --zip-file fileb://lambda_function.zip```
4. command to check lambda function list ```aws --endpoint-url=http://localhost:4566 lambda list-functions```
5. command to invoke lambda ```aws --endpoint-url=http://localhost:4566 lambda invoke \
    --function-name hello-world \
    --payload '{}' \
    response.json```
6. check response ```cat response.json```
7. or u can invoke it with any service e.g ```index.js```
