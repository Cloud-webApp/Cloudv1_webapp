import userModel from './models/users.js';
import sequelize from "./sequelize.js";
import { Sequelize, DataTypes } from "sequelize";
import insertDataFromCSV from "./csv-parser.js";
import assignmentsModel from "./models/assignments.js";

// Authenticate the Sequelize connection
sequelize.authenticate()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error while connecting to the db", err);
  });

// Create a database object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = userModel(sequelize, DataTypes);
db.assignments = assignmentsModel(sequelize, DataTypes);

// Define a foreign key relationship between users and assignments
db.users.hasMany(db.assignments, {
  foreignKey: { name: "user_id" },
  onDelete: "CASCADE",
  field: "user_id",
  allowNull: false,
});

// Synchronize the database and insert data from CSV
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Database synchronization completed!");
    insertDataFromCSV();
  });

export default db;






//draft below, above is cleaned with comments
// import userModel from './models/users.js';
// import sequelize from "./sequelize.js";
// import { Sequelize, DataTypes } from "sequelize";
// import insertDataFromCSV from "./csv-parser.js";
// import assignmentsModel from "./models/assignments.js";


// sequelize.authenticate().then(()=>{
//     console.log("Connected to the database")
// }).catch(err=>{
//     console.error("Error while connecting to the db", err)
// })

// const db={};
// db.Sequelize= Sequelize
// db.sequelize=sequelize;
// db.users= userModel(sequelize,DataTypes)
// db.assignments = assignmentsModel(sequelize,DataTypes)

// db.users.hasMany(db.assignments,{foreignKey:{name :"user_id"},onDelete:"CASCADE",field:"user_id",allowNull:false})

// db.sequelize.sync({force:false}).then(()=>{
//     console.log("yes re-sync done!")
//     insertDataFromCSV()
// });


// export default db;


