const {Sequelize} = require('@sequelize/core');
const {MySqlDialect} = require('@sequelize/mysql');

require('dotenv').config();


let instance;  ///SWITCH TO TS DAMN IT!


console.log("USERNAME : " + process.env.SCD_DB1_USER);

const sequelize = new Sequelize({
    dialect: MySqlDialect,
    database: process.env.SCD_DB1_DATABASE,
    user: process.env.SCD_DB1_USER,              ///THIS IS SCARYY
    password: process.env.SCD_DB1_PASS,
    host: process.env.SCD_DB1_HOST,
    port: Number(process.env.SCD_DB1_PORT),
});


class DBHandler  {  //This aint working 
    
    constructor(){
        if(!instance){
            instance=this;
        }
        return instance;
    }
    static getDBInstance(){
        return sequelize;
    }


}

module.exports = DBHandler;