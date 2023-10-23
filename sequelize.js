import { Sequelize } from "sequelize";
import dbConfigs from "./config/dbConfig.js";

// Determine whether to use SSL based on the host
const isAwsRDS = dbConfigs.HOST && dbConfigs.HOST.includes('.rds.amazonaws.com');

const sequelizeConfig = {
  dialect: 'postgres',
  host: dbConfigs.HOST,
};

if (isAwsRDS) {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize(
  dbConfigs.DB,
  dbConfigs.USER,
  dbConfigs.PASSWORD,
  sequelizeConfig
);

export default sequelize;



// import dbConfigs from "./config/dbConfig.js";
// import { Sequelize } from "sequelize";

// const sequelize= new Sequelize(
//     dbConfigs.DB,
//     dbConfigs.USER, 
//     dbConfigs.PASSWORD,
//     {
//         host:dbConfigs.HOST,
//         dialect:dbConfigs.dialect,
//         operatorsAliases:false,
//         operatorsAliases: 0,
//         pool:dbConfigs.pool
//     }
// );

// export default sequelize;



