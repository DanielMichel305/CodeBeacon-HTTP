import { Sequelize,Model,Optional,DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { DBHandler } from "./dbHandler";
import { Json } from "sequelize/lib/utils";


const sequelize = DBHandler.getDBInstance();

export class Inspections extends Model<InferAttributes<Inspections>,InferCreationAttributes<Inspections>>{
    declare webhook_id: string;
    declare inspection_json: Json;
}

Inspections.init({
    webhook_id:{
        type : DataTypes.CHAR(32),
        primaryKey: true
    },
    inspection_json : {
        type: DataTypes.JSON
    }
    
},{
    sequelize,
    tableName:'inspections'

});


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