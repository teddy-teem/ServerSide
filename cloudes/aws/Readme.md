1. install docker
2. install python3
3. run docker
4. command ```docker pull localstack/localstack```
5. then command ```docker run --rm -p 4566:4566 -p 4571:4571 localstack/localstack```
6. install awscli
7. configure it with proper ```aws configure```
        Access Key ID: test
        Secret Access Key: test
        Default Region: us-east-1 (or any region)
        Output Format: json
8. run service

