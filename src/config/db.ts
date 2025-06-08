import { config } from 'dotenv'; config();
import { Model, ModelCtor, Sequelize } from "sequelize";

import { initializeUsersModel } from '../models/users';

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
    host: `${process.env.DB_HOST}`,
    port: parseInt(`${process.env.DB_PORT}`) || 5432,
    dialect: 'postgres',
})

let Users: ModelCtor<Model<any, any>>;

export default async function initializeDatabase() {
    try {
        await sequelize.authenticate();

        Users = await initializeUsersModel(sequelize);

        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export { sequelize, Users };