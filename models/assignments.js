import { Sequelize } from "sequelize";

export default (sequelize, DataTypes) => {
    const Assignment = sequelize.define("assignment", {
      assignment_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validator: {
            min:1,
            max:100
        }
    },
    num_of_attemps: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validator:{
            min:1,
            max:100
        }
    },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    },
    {
        timestamps:true,
        createdAt: 'assignment_created',
        updatedAt: 'assignment_updated'
    },
);
    return Assignment;
  };
  