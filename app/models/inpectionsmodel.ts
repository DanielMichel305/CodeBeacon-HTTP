import { Sequelize,Model,Optional,DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { DBHandler } from "./dbHandler";


const sequelize = DBHandler.getDBInstance();

export class Inspections extends Model<InferAttributes<Inspections>,InferCreationAttributes<Inspections>>{
    declare webhook_id: string;
    declare inspection_json: string;
}

Inspections.init({
    webhook_id:{
        type : DataTypes.CHAR(32),
        primaryKey: true
    },
    inspection_json : {
        type: DataTypes.STRING
    }
    
},{
    sequelize,
    tableName:'inspections'

});


