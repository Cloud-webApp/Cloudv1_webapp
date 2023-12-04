# :spider_web: Web-App 

## :ninja: Author

[Altaf Shaikh](mailto:shaikh.alt@northeastern.edu)

This web application provides a platform for managing assignments by different users, submitting it and downloading via email link.

Below are example of how to perform CD - Instance Refresh and a demo api reference
[![Instance Refresh](https://github.com/Cloud-webApp/Cloudv1_webapp/blob/main/.github/workflows/build-ami-on-merge.yml)]

RESTful Backend API service for a fullstack web application.

Demo API for reference: [Swaggerhub](https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/fall2023-a9#/authenticated/assignment_submission)

## Prerequisites

Before you begin, ensure you have met the following requirements:
- `git` (configured with ssh) [[link](https://git-scm.com/downloads)]
- `node v.16.17.0` and above [[link](https://nodejs.org/en/download/)]
- `Postman` to demo hit the APIs [[link](https://www.postman.com/downloads/)]

## Build and Deploy

1. **Create a New Project:**

   ```bash
   mkdir web-app
   cd web-app

2. **Initialize new Node.js project:**
   ```bash
   npm init
3. **Install Dependencies:**
   ```bash
   npm install express sequelize@^6.33.0 pg pg-hstore sequelize-cli dotenv bcryptjs lodash csv-parser

4. **Database Setup:**
   -Create a postgres database for your project.
   -Update the .env file in your project root with your database configuration:

   ```bash
   DB_HOST=localhost
   DB_PORT="the port"s
   DB_USER="user-name"
   DB_PASSWORD="your passwprd"
   DB_DATABASE="db name"
   DB_DIALECT=postgres

5. **Scripts**
   
  ```bash
   "type": "module",
   "scripts": {
   "test": "jest",
   "start": "nodemon app.js"
   }

6. **Starting the Application:**
   
   ```bash
   node app.js  //or npm start 

## :ninja: Author

[Altaf Shaikh](mailto:shaikh.alt@northeastern.edu)

## :scroll: License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)