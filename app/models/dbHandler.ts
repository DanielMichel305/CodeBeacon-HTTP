import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';

require('dotenv').config();





console.log("USERNAME : " + process.env.SCD_DB1_USER);




export class DBHandler  {  //This aint working 
    
    private static instance : DBHandler | null = null;
    private sequelize: Sequelize;

    private constructor(){
        
            this.sequelize = new Sequelize({
                dialect: MySqlDialect,
                database: process.env.SCD_DB1_DATABASE,
                user: process.env.SCD_DB1_USER,              
                password: process.env.SCD_DB1_PASS,
                host: process.env.SCD_DB1_HOST,
                port: Number(process.env.SCD_DB1_PORT),
            });
            this.sequelize.authenticate()
                .then(()=>console.log("DB CONNECTED!"))
                .catch(()=>console.log("DB CONN FAILED"));
       
    }
    public static getDBInstance(){
        if(!DBHandler.instance){
            DBHandler.instance = new DBHandler();
        }
        return DBHandler.instance.sequelize;
    }


}

