import { Sequelize } from "sequelize";
 
export default (sequelize, DataTypes) => {
    const Submissions = sequelize.define("submissions", {
      submission_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
        timestamps:true,
        createdAt: 'submission_date',
        updatedAt: 'submission_updated'
    },
);
    return Submissions;
  };