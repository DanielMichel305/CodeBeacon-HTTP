const {Sequelize} = require('@sequelize/core');
const {MySqlDialect} = require('@sequelize/mysql');

require('dotenv').config();

const sequelize = new Sequelize({
    dialect: MySqlDialect,
    database: 'mydb',
    user: 'admin',              ///THIS IS SCARYY
    password: process.env.SCD-DB1-MASTERPASS,
    host: process.env.SCD-DB1-HOST,
    port: process.env.SCD-DB1-PORT,
});


export const DBHandler = {

    


}