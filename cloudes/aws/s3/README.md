1. write docker-compose.yml to run s3 & run  ```docker compose up```
2. to check bucket run ```aws --endpoint-url=http://localhost:4566 s3 ls```
3. to create a bucket run ```aws --endpoint-url=http://localhost:4566 s3 mb s3://my-test-bucket```
4. upload file run ```aws --endpoint-url=http://localhost:4566 s3 cp example.txt s3://my-test-bucket/```
5. list file from bucker run ```aws --endpoint-url=http://localhost:4566 s3 ls s3://my-test-bucket/```
6. download file, run ```aws --endpoint-url=http://localhost:4566 s3 cp s3://my-test-bucket/example.txt ./downloaded_example.txt```
7. delete file, run ```aws --endpoint-url=http://localhost:4566 s3 rm s3://my-test-bucket/example.txt```
8. delete bucker ```aws --endpoint-url=http://localhost:4566 s3 rb s3://my-test-bucket --force```
9. or u can check ```index.js```