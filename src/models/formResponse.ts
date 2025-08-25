import { DataTypes, Sequelize } from "sequelize";

export async function initializeFormResponsesModel(sequelize: Sequelize) {
   return sequelize.define('form_responses', {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         unique: true
      },
      formId: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: 'google_forms',
            key: 'id'
         }
      },
      candidateName: {
         type: DataTypes.STRING(32),
         allowNull: false,
      },
      resume: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      aiResponse: {
         type: DataTypes.TEXT,
         allowNull: false
      }
   })
}