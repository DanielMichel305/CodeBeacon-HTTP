import { DBHandler } from "./dbHandler";
import {Model, InferAttributes, InferCreationAttributes,DataTypes, ForeignKey} from 'sequelize';
import { User } from "./user";


const sequelize = DBHandler.getDBInstance();



export class Webhook extends Model<InferAttributes<Webhook>,InferCreationAttributes<Webhook>>{

    declare user_id : ForeignKey<User['discord_UID']>;
    declare webhook_id: string;
    declare auth_token: string;
    declare repo_name : string;
    declare webhook_status : string;

}

Webhook.init({
        user_id :{
            type : DataTypes.CHAR(20),
            allowNull: false
        },
        webhook_id :{
            type: DataTypes.CHAR(32),
            allowNull: false, /////alowNull, unique and pk should be true!
            unique: false,
            primaryKey: true
        },
        auth_token :{
            type: DataTypes.CHAR(32),
            allowNull: true,
            unique: true 
        },
        repo_name :{
            type : DataTypes.CHAR(32),
            defaultValue : "N/A"
        },
        webhook_status : {
            type: DataTypes.BOOLEAN,
            defaultValue : true
        }

        

    },
    {
        sequelize,
        tableName:'webhooks'
    }
);


Webhook.sync({ alter: true })  
  .then(() => {
    console.log('webhook_tokens Table synced');
  })
  .catch(err => {
    console.error('Failed to sync webhook_tokens table:', err);
  });
