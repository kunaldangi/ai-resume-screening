import { config } from 'dotenv'; config();
import { Model, ModelCtor, Sequelize } from "sequelize";

import { initializeUsersModel } from '../models/users';
import { initializeGoogleFormModel } from '../models/googleForm';

// const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
//     host: `${process.env.DB_HOST}`,
//     port: parseInt(`${process.env.DB_PORT}`) || 5432,
//     dialect: 'postgres',
// });

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
})

let Users: ModelCtor<Model<any, any>>;
let GoogleForm: ModelCtor<Model<any, any>>;

export default async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        Users = await initializeUsersModel(sequelize);
        GoogleForm = await initializeGoogleFormModel(sequelize);
        await sequelize.sync({ alter: true });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export { sequelize, Users, GoogleForm };