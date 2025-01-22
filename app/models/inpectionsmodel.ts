import { Sequelize,Model,Optional } from "sequelize";
import {DataTypes} from "@sequelize/core";
import { DBHandler } from "./dbHandler";



export const inpectionModel = DBHandler.getDBInstance().define('inspections',{

    webhook_id :{
        type : DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    inspection_JSON : {
        type : DataTypes.JSON,
        allowNull: false
    }
});

try {
    inpectionModel.sync();
}
catch(err){
    console.log("Error Syncing inspections table")
}