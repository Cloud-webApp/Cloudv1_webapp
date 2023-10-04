import dbConfigs from "./config/dbConfig.js";
import { Sequelize } from "sequelize";

const sequelize= new Sequelize(
    dbConfigs.DB,
    dbConfigs.USER, 
    dbConfigs.PASSWORD,
    {
        host:dbConfigs.HOST,
        dialect:dbConfigs.dialect,
        operatorsAliases:false,
        operatorsAliases: 0,
        pool:dbConfigs.pool
    }
);

export default sequelize;