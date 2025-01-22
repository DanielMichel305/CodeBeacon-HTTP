import { DBHandler } from "./dbHandler";
import {Model, InferAttributes, InferCreationAttributes,DataTypes} from 'sequelize';


const sequelize = DBHandler.getDBInstance();



export class WebhookTokens extends Model<InferAttributes<WebhookTokens>,InferCreationAttributes<WebhookTokens>>{

    declare webhook_id: string;
    declare token: string;
    declare discord_channel_id?: string;

}

WebhookTokens.init({
        webhook_id :{
            type: DataTypes.CHAR(32),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        token :{
            type: DataTypes.CHAR(32),
            allowNull: false,
            unique: true 
        },
        discord_channel_id :{
            type: DataTypes.CHAR(32)
        }
    },
    {
        sequelize,
        tableName:'webhook_tokens'
    }
);


