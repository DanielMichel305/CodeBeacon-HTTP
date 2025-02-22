import { DBHandler } from "./dbHandler";
import {Model, InferAttributes, InferCreationAttributes,DataTypes} from 'sequelize';


const sequelize = DBHandler.getDBInstance();



export class WebhookTokens extends Model<InferAttributes<WebhookTokens>,InferCreationAttributes<WebhookTokens>>{

    declare webhook_id: string;
    declare auth_token: string;
    declare discord_channel_id?: string;
    declare discord_guild_id: string;

}

WebhookTokens.init({
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
        discord_channel_id :{
            type: DataTypes.CHAR(32)
        },
        discord_guild_id:{
            type: DataTypes.CHAR(32)
        }
    },
    {
        sequelize,
        tableName:'webhook_tokens'
    }
);


WebhookTokens.sync({ alter: true })  
  .then(() => {
    console.log('webhook_tokens Table synced');
  })
  .catch(err => {
    console.error('Failed to sync webhook_tokens table:', err);
  });
