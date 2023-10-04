import fs from 'fs';
import csv from 'csv-parser';
// import db from './models/index.js';
import db from './dbSetup.js';
import brcrypt from 'bcryptjs';

const insertDataFromCSV = () => {
  //const filePath = 'users.csv'; // Replace with your CSV file path
  const filePath = '/opt/users.csv';
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      try {
        // Check if a user with the same email already exists in the database
        const existingUser = await db.users.findOne({ where: { email: row.email } });
        const salt = await brcrypt.genSalt(10);
        const hashedPassword = await brcrypt.hash(row.password, salt);
        // console.log("data",row)
        if (!existingUser) {
         
          // If the user doesn't exist, insert the new user record
          await db.users.create({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            password: hashedPassword,
          });
          console.log(`Inserted: ${row.first_name} ${row.last_name}`);
        } else {
          console.log(`Skipped: User with email ${row.email} already exists.`);
        }
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    })
    .on('end', () => {
      console.log('CSV import complete.');
    });
};

export default insertDataFromCSV;
