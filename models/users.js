import { Sequelize } from "sequelize";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "account_created",
      updatedAt: "account_updated",
    }
  );
  return User;
};
