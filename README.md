# cloud-developer-capstone

This project using to add the Note, help people manage the task need to do daily.

## Project Overview

In this project I have implemented all the knowledge that I have learnt from the Udacity Cloud Developer program. In this project I have

-   Created Jenkins server using the AWS CloudFormation.
-   Installed all the needed tools in Jenkins master server using the Launch Configuration.
-   Created one pipeline that build and deploys the backend which create API gateway, lambda function and dynamoDB in AWS account.
-   Created one pipeline that build and deploys the frontend using docker container.

## Project Files
#### backend
This folder all the files related to backend source.

-   `Jenkinsfile`: This file contains the steps of CICD pipeline of backend.

#### frontend
This folder all the files related to backend source.

-   `Jenkinsfile`: This file contains the steps of CICD pipeline of backend.
-   `Dockerfile`: This is Dockerfile of application.

#### jenkins

This folder all the files related to infrastructure deployment.

-   `jenkins-server-parameters.json`: Parameters file for cloud formation stack.
-   `jenkins-server.yml`: CloudFormation template for creating jenkins server.

## Project Setup

-   Create Jenkins server using cloud formation template.

```
$ sh ./create.sh jenkins-stack infrastructure/jenkins-server.yml infrastructure/jenkins-server-parameters.json
```

-   Following resources are created after executing above command:
    -   Security Group
    -   Launch Configuration
    -   Auto Scaling Group
-   Following tools are automatically installed in the server using Launch Configuration:
    -   Jenkins
    -   Docker
    -   AWS CLI
    -   NodeJS
    -   Serverless
-   Once the stack creation is complete, access the Jenkins UI using `http://<EC2_PUBLIC_IP>:8080`
-   Login using admin account and complete the initial setup of Jenkins.
-   Install the following plugins in Jenkins:
    -   [CloudBees AWS Credentials](https://plugins.jenkins.io/aws-credentials/)
    -   [Pipeline: AWS Steps](https://plugins.jenkins.io/pipeline-aws/)
    -   [Blue Ocean](https://plugins.jenkins.io/blueocean/)
-   Add AWS credentials in Jenkins.
-   Create new item in Jenkins of type `Pipeline` of name let's say `Backend Deployment`
-   In the configuration page of `Backend Deployment`, provide the GitHub repository as `https://github.com/bobbynguyen147/cloud-developer-capstone` and script path as `backend/Jenkinsfile`
-   Apply and save the pipeline.
-   Click on `Build Now` to trigger the pipeline.
-   Copy the APIGatewayID from AWS console then update into `/client/src/config.ts` file, create and merge other PR to master branch.
-   Create new item in Jenkins of type `Pipeline` of name let's say `Frontend Deployment`
-   In the configuration page of `Frontend Deployment`, provide the GitHub repository as `https://github.com/bobbynguyen147/cloud-developer-capstone` and script path as `frontend/Jenkinsfile`
-   Apply and save the pipeline.
-   Click on `Build Now` to trigger the pipeline
-   Once the pipeline passes, open a new browser tab and hit link as `http://<DNS_NAME>:8000/`. It will show the capstone project website.
