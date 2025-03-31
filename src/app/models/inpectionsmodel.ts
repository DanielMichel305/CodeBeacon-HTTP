import { Sequelize,Model,Optional,DataTypes, InferAttributes, InferCreationAttributes , ForeignKey} from "sequelize";
import { DBHandler } from "./dbHandler";
import { Webhook } from "./webhooks";


const sequelize = DBHandler.getDBInstance();

export class Inspections extends Model<InferAttributes<Inspections>,InferCreationAttributes<Inspections>>{
    declare inspection_id: string;
    declare webhook_id:  ForeignKey<Webhook['webhook_id']>;
    declare state: string;
    declare build_status: string;
    declare repo_name: string
    declare inspection_creation_date: Date;
    declare inspection_json: string;
}

Inspections.init({
    inspection_id:{
        type: DataTypes.CHAR(32),
        primaryKey: true

    },
    webhook_id:{
        type : DataTypes.CHAR(32)
    },
    state:{
        type:DataTypes.CHAR(32)
    },
    build_status:{
        type: DataTypes.CHAR(32)
    },
    repo_name:{
        type: DataTypes.CHAR(140)   ///39 for max username length and 100 for max repo name length 
    },
    inspection_creation_date:{
        type: DataTypes.DATE()
    },
    inspection_json : {
        type: DataTypes.TEXT()
    }
    
},{
    sequelize,
    tableName:'inspections'

});



Inspections.sync({ alter: true })  
  .then(() => {
    console.log('Inspection Table synced');
  })
  .catch(err => {
    console.error('Failed to sync Inspections table:', err);
  });

