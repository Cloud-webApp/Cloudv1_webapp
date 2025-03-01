import fs from 'fs';
import csv from 'csv-parser';
import db from './dbSetup.js'; // Import your database setup
import bcrypt from 'bcryptjs';
import logger from './config/logger.config.js';



const insertDataFromCSV = () => {
  const filePath = './users.csv'; // Replace with your CSV file path

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      try {
        // Check if a user with the same email already exists in the database
        const existingUser = await db.users.findOne({ where: { email: row.email } });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(row.password, salt);

        if (!existingUser) {
          // If the user doesn't exist, insert the new user record
          await db.users.create({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            password: hashedPassword,
          });
          logger.info(`Inserted: ${row.first_name} ${row.last_name}`);
          console.log(`Inserted: ${row.first_name} ${row.last_name}`);
        } else {
          console.log(`!!Skipped: User with email ${row.email} already exists.`);
          console.log(`!!Skipped: User with email ${row.email} already exists.`);
        }
      } catch (error) {
        logger.error('!!Error inserting data:', error);
        console.error('!!Error inserting data:', error);
      }
    })
    .on('end', () => {
      logger.info('!!!CSV import complete.');
      console.log('!!CSV import complete.');
    });
};

export default insertDataFromCSV;
