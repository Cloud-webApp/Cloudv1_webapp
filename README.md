# Web-App 

This web application provides a platform for managing Assignments by different Users.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed
- Postgres database set up
- Clone this repository

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
   npm install express sequelize pg pg-hstore sequelize-cli dotenv bcryptjs lodash csv-parser
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

5. **Starting the Application:**
   ```bash
   node app.js  //or npm start app