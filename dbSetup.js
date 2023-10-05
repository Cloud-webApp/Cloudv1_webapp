import userModel from './models/users.js';
import sequelize from "./sequelize.js";
import { Sequelize, DataTypes } from "sequelize";
import insertDataFromCSV from "./csv-parser.js";
import assignmentsModel from "./models/assignments.js";

// db authenticae
sequelize.authenticate().then(() => {
    console.log("Connected to the database")
}).catch(err => {
    console.error("Error while connecting to the db", err)
})

const db = {};

// Sequelize and sequelize properties 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//  users  assignments models
db.users = userModel(sequelize, DataTypes);
db.assignments = assignmentsModel(sequelize, DataTypes);

//relation 
db.users.hasMany(db.assignments, {
    foreignKey: { name: "user_id" },
    onDelete: "CASCADE",
    field: "user_id",
    allowNull: false
});

db.sequelize.sync({ force: false }).then(() => {
    console.log("Database schema synchronized successfully.")
    
    insertDataFromCSV();
});

export default db;
