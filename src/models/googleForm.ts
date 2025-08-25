import { DataTypes, Sequelize } from "sequelize";

export async function initializeGoogleFormModel(sequelize: Sequelize) {
    return sequelize.define('google_forms', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        formId: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        formTitle: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        formPrompt: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    })
}