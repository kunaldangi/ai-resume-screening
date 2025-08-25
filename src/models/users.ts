import { DataTypes, Sequelize } from "sequelize";

export async function initializeUsersModel(sequelize: Sequelize) {
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        username: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(62),
            allowNull: false
        },
        googleAccessToken: { // for working with Google Form
            type: DataTypes.STRING,
            allowNull: true
        },
        googleRefreshToken: { // for working with Google Form
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}