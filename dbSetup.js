import userModel from './models/users.js';
import sequelize from "./sequelize.js";
import { Sequelize, DataTypes } from "sequelize";
import insertDataFromCSV from "./csv-parser.js";
import assignmentsModel from "./models/assignments.js";
import logger from './config/logger.config.js';
import submissionsModel from './models/submission.js';
// db authenticae
sequelize.authenticate().then(() => {
    console.log("Connected to the database")
}).catch(err => {
    logger.error("DB connecting error", err)
    console.error("DB connecting error", err)
})

const db = {};
 
// Sequelize and sequelize properties 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//  users  assignments models
db.users = userModel(sequelize, DataTypes);
db.assignments = assignmentsModel(sequelize, DataTypes);
db.submissions = submissionsModel(sequelize, DataTypes);
//relation 
db.users.hasMany(db.assignments, {
    foreignKey: { name: "user_id" },
    onDelete: "CASCADE",
    field: "user_id",
    allowNull: false
});

db.assignments.hasMany(db.submissions,{foreignKey:{name :"assignment_id"},onDelete:"CASCADE",field:"assignment_id",allowNull:false})
db.users.hasMany(db.submissions,{foreignKey:{name :"user_id"},onDelete:"CASCADE",field:"user_id",allowNull:false})

db.sequelize.sync({ force: false }).then(() => {
    console.log("Database schema synchronized successfully.")
    logger.info("Database schema synchronized successfully.")
    insertDataFromCSV();
});


export default db;
 